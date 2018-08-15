class Device {
    constructor(id, name, power, duration, mode) {
        this.id = id;
        this.name = name;
        this.power = power;
        this.duration = duration;
        this.mode = mode;
    }
}

class PowerPlan {
    constructor(rates, maxPower) {
        this.rates = rates;
        this.maxPower = maxPower;
    }
}

module.exports = Device;
