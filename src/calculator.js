const PowerPlan = require('./powerplan');
const Period = require('./period');
const Device = require('./device');
const Rate = require('./rate');

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
        let scheduledDevices = [];

        this.devices.forEach(device => {
            if (device.duration === 24) {
                scheduledDevices.push(new ScheduledDevice(device, 0))
            }
        });

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
                let consumption = rate.value * device.power / 1000.0;

                consumptionPerDevice[id] = current ? current + consumption : consumption;
                total += consumption;
            });
        }

        return {
            "value": total,
            "devices": consumptionPerDevice
        };
    }

    calculateDeviceConsumption(device, from, scheduledDevices) {

    }
}

module.exports = Calculator;
