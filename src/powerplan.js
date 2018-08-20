const Rate = require('./rate');

class PowerPlan {
    constructor(rates, maxPower) {
        this.rates = rates;
        this.maxPower = maxPower;
    }

    getRate(hour) {
        const rate = this.rates.find(each => each.includes(hour));

        return rate ? rate : new Rate(hour, hour, 0.0);
    }
}

module.exports = PowerPlan;
