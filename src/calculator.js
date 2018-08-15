const Device = require('./device');
const Rate = require('./rate');
const PowerPlan = require('./powerplan');

class Calculator {
    constructor(powerplan, devices) {
        this.powerPlan = powerplan;
        this.devices = devices;
    }

    static calculate() {
        const schedule = Calculator.calculateSchedule();

        return {
            "schedule": schedule,
            "consumedEnergy": Calculator.calculateConsumedEnergy(schedule)
        };
    }

    static calculateSchedule() {
        return {
            "0": [],
        };
    }

    static calculateConsumedEnergy(schedule) {
        return {
            "value": 0,
            "devices": {}
        };
    }
}

module.exports = Calculator;
