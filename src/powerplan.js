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
}

module.exports = PowerPlan;
