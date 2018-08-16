class PowerPlan {
    constructor(rates, maxPower) {
        this._rates = rates;
        this._maxPower = maxPower;
    }

    get rates() {
        return this._rates;
    }

    get maxPower() {
        return this._maxPower;
    }

    getRate(hour) {
        const rate = this
            .rates
            .find(each => hour >= each.from && hour <= each.to);

        return rate ? rate : null;
    }
}

module.exports = PowerPlan;
