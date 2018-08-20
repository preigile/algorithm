const Period = require('./period');

class ScheduledDevice {
    constructor(device, hour) {
        this.device = device;
        this.period = new Period(hour, hour);
        this.period.extend(device.duration);
    }

    includes(hour) {
        return this.period.includes(hour);
    }

    get isScheduledToAllowedPeriod() {
        return this.device.allowedStartPeriod.includes(this.period.from);
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
        const scheduledDevices = [];
        const unscheduledDevices = [];

        this.devices.forEach(device => {
            if (device.duration === 24) {
                scheduledDevices.push(new ScheduledDevice(device, 0));
            } else {
                unscheduledDevices.push(device);
            }
        });

        let result = {
            total: Number.MAX_VALUE,
            scheduledDevices: []
        };

        unscheduledDevices.sort((a, b) => a.energy <= b.energy);
        this.scheduleDevices(unscheduledDevices, scheduledDevices, result);

        return this.calculateScheduleFromDevices(result.scheduledDevices);
    }

    calculateScheduleFromDevices(scheduledDevices) {
        const schedule = {};

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
                let consumption = device.hourlyConsumption(rate);
                let current = consumptionPerDevice[id];

                consumptionPerDevice[id] = current ? current + consumption : consumption;
                total += consumption;
            });
        }

        return {
            "value": total,
            "devices": consumptionPerDevice
        };
    }

    scheduleDevices(devices, scheduledDevices, result) {
        if (devices.length === 0) {
            const energy = this.calculateEnergy(scheduledDevices);

            if (energy && energy < result.total) {
                result.total = energy;
                result.scheduledDevices = scheduledDevices;

                return;
            } else {
                return;
            }
        }

        devices.forEach((device, index) => {
            [...Array(24).keys()].forEach(hour => {
                const s = scheduledDevices.slice(0);
                const d = devices.slice(0);
                d.splice(index, 1);
                const scheduledDevice = new ScheduledDevice(device, hour);

                if (!scheduledDevice.isScheduledToAllowedPeriod) {
                    return;
                }

                s.push(scheduledDevice);
                this.scheduleDevices(d, s, result);
            });
        });
    }

    calculateEnergy(scheduledDevices) {
        const schedule = this.calculateScheduleFromDevices(scheduledDevices);

        if (schedule) {
            const data = this.calculateConsumedEnergy(schedule);

            return data.value;
        } else {
            return null;
        }
    }
}

module.exports = Calculator;
