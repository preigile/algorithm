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
            let deviceIds = schedule[hour];
            let rate = this.powerplan.getRate(hour);

            deviceIds.forEach(id => {
                const device = this.devices.find(each => each.id == id);
                let current = energyPerDevice[id];
                let consumption = rate.value * device.power / 1000.0;

                energyPerDevice[id] = current ? current + consumption : consumption;
                total = consumption;
            });
        }

        return {
            "value": total,
            "devices": energyPerDevice
        };
    }
}

module.exports = Calculator;
