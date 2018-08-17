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
}

module.exports = Device;
