const Period = require('./period');

class Device {
    constructor(id, name, power, duration, mode) {
        this.id = id;
        this.name = name;
        this.power = power;
        this.duration = duration;
        this.mode = mode;
    }

    get energy() {
        return this.power * this.duration;
    }


    get allowedPeriod() {
        if (this.mode) {
            // TODO: Check for values other than 'day' or 'night'
            return this.mode === 'day' ? new Period(7, 21) : new Period(21, 7);
        } else {
            return new Period(0, 23);
        }
    }

    get allowedStartPeriod() {
        const period = this.allowedPeriod.subtract(this.duration);

        return this.mode ? period : new Period(0, 23);
    }

    hourlyConsumption(rate) {
        return rate.hourlyConsumption(this);
    }
}

module.exports = Device;
