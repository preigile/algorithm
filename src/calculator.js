const PowerPlan = require('./powerplan');
const Device = require('./device');
const Rate = require('./rate');

class ScheduledDevice {
    constructor(device, from, to) {
        this.device = device;
        this.from = from;
        this.to = to;
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
                scheduledDevices.push(new ScheduledDevice(device, 0, 23))
            }
        });

        [...Array(24).keys()].forEach(hour => {
            const ids = scheduledDevices
                .filter(each => hour >= each.from && hour <= each.to)
                .map(each => each.device.id);
            schedule[hour.toString()] = ids;
        });

        return schedule;
    }

    calculateConsumedEnergy(schedule) {
        let total = 0.0;
        const consumptionPerDevice = {};

        for (let hour in schedule) {
            let deviceIds = schedule[hour];
            let rate = this.powerplan.getRate(parseInt(hour));

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
}

module.exports = Calculator;
