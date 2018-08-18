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

    getSortedRates() {
        const rates = this.rates.slice(0);

        return rates.sort((a, b) => a.value >= b.value);
    }
}

module.exports = PowerPlan;
