const PowerPlan = require('./powerplan');
const Period = require('./period');
const Device = require('./device');
const Rate = require('./rate');

Array.prototype.groupBy = property => {
    return this.reduce((groups, each) => {
        const value = each[property];
        groups[value] = groups[value] || [];
        groups[value].push(each);
        return groups;
    }, {})
};

class ScheduledDevice {
    constructor(device, hour) {
        this.device = device;
        this.period = new Period(hour, hour);
        this.period.extend(device.duration);
    }

    includes(hour) {
        return this.period.includes(hour);

    }
}

class Calculator {
    constructor(powerplan, devices) {
        this.powerplan = powerplan;
        this.devices = devices;
    }

    calculate() {
        const schedule = this.calculateSchedule();

        return {
            "schedule": schedule,
            "consumedEnergy": this.calculateConsumedEnergy(schedule)
        };
    }

    calculateSchedule() {
        const schedule = {};
        const scheduledDevices = [];
        const unscheduledDevices = [];

        this.devices.forEach(device => {
            if (device.duration === 24) {
                scheduledDevices.push(new ScheduledDevice(device, 0));
            } else {
                unscheduledDevices.push(device);
            }
        });

        unscheduledDevices.sort((a, b) => a.energy <= b.energy);
        this.scheduleDevices(unscheduledDevices, scheduledDevices);

        [...Array(24).keys()].forEach(hour => {
            schedule[hour] = scheduledDevices
                .filter(each => each.includes(hour))
                .map(each => each.device.id);
        });

        return schedule;
    }

    calculateConsumedEnergy(schedule) {
        let total = 0.0;
        const consumptionPerDevice = {};

        for (let hour in schedule) {
            let deviceIds = schedule[hour];
            let rate = this.powerplan.getRate(hour);

            deviceIds.forEach(id => {
                const device = this.devices.find(device => device.id === id);
                let current = consumptionPerDevice[id];
                let consumption = device.hourlyConsumption(rate);

                consumptionPerDevice[id] = current ? current + consumption : consumption;
                total += consumption;
            });
        }

        return {
            "value": total,
            "devices": consumptionPerDevice
        };
    }

    scheduleDevices(devices, scheduledDevices) {
        devices.sort((a, b) => a.energy <= b.energy);

        const sortedRates = this.powerplan.getSortedRates();
        devices.forEach(device => {
            const allowedStartPeriod = device.allowedStartPeriod;
            scheduledDevices.push(new ScheduledDevice(device, allowedStartPeriod.from));
        });

        // devices.forEach(device => {
        //     [...Array(24).keys()].forEach(hour => {
        //         const consumption = this.calculateDeviceConsumption(device, hour, scheduledDevices);
        //         // Truthy consumption means that device can be scheduled
        //         if (consumption) {
        //             scheduledDevices.push(new ScheduledDevice(device, hour));
        //             const toSchedule = devices.filter(each => each.id !== device.id);
        //             this.scheduleDevices(toSchedule, scheduledDevices);
        //         }
        //     });
        // });
    }

    calculateDeviceConsumption(hour, device, scheduledDevices) {
        const allowedStartPeriod = device.allowedStartPeriod;

        if (allowedStartPeriod.includes(hour)) {
            const currentRate = this.powerplan.getRate(hour);
            let alreadyConsumed = 0.0;

            scheduledDevices.forEach(each => {
                alreadyConsumed += each.hourlyConsumption(currentRate);
            });

            const consumption = device.hourlyConsumption(currentRate);

            if(alreadyConsumed + consumption > this.powerplan.maxPower) {
                return null;
            }

            return consumption;

        } else {
            return null;
        }
    }
}

module.exports = Calculator;
