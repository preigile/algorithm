const Period = require('./period');

class Rate {
    constructor(from, to, value) {
        this.period = new Period(from, to);
        this.value = value;
    }

    includes(hour) {
        return this.period.includes(hour);
    }

    hourlyPrice(device) {
        return this.value * device.power / 1000.0;
    }
}

module.exports = Rate;
