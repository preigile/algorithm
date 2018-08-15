const PowerPlan = require('./powerplan');
const Device = require('./device');
const Rate = require('./rate');

class ScheduledDevice {
    constructor(device, from, to ) {
        this.device = device;
        this.from = from;
        this.to = to;
    }
}

class Calculator {
    constructor(powerplan, devices) {
        this.powerPlan = powerplan;
        this.devices = devices;
        this.scheduledDevices = [];
    }

    calculate() {
        const schedule = this.calculateSchedule();
        
        return {
            "schedule": schedule,
            "consumedEnergy": Calculator.calculateConsumedEnergy(schedule)
        };
    }

    calculateSchedule() {
        const schedule = {};

        this.devices.forEach(device => {
            if(device.duration === 24) {
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

    static calculateConsumedEnergy(schedule) {
        return {
            "value": 0,
            "devices": {}
        };
    }
}

module.exports = Calculator;
