class PowerPlan {
    constructor(rates, maxPower) {
        this.rates = rates;
        this.maxPower = maxPower;
    }

    getRate(hour) {
        return this.rates.find(each => each.includes(hour));
    }
}

module.exports = PowerPlan;
