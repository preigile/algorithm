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
        this.scheduledDevices = [];
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

        this.devices.forEach(device => {
            if (device.duration === 24) {
                this.scheduledDevices.push(new ScheduledDevice(device, 0, 23))
            }
        });

        [...Array(24).keys()].forEach(hour => {
            const ids = this.scheduledDevices
                .filter(device => hour >= device.from && hour <= device.to)
                .map(device => device.device.id);
            schedule[hour.toString()] = ids;
        });

        return schedule;
    }

    calculateConsumedEnergy(schedule) {
        let total = 0.0;
        const energyPerDevice = {};

        for (let hour in schedule) {
            let devices = schedule[hour];
            let rate = this.powerplan.getRate(hour);

            devices.forEach(device => {
                let current = energyPerDevice[device];
                energyPerDevice[device] = current ? current + rate.value : rate.value;
                total = rate.value;
            });
        }

        return {
            "value": total,
            "devices": energyPerDevice
        };
    }
}

module.exports = Calculator;
