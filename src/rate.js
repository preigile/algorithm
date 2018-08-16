class Rate {
    constructor(from, to, value) {
        this.from = from;
        this.to = to;
        this.value = value;
    }

    includes(hour) {
        return this.from < this.to
            ? hour >= this.from && hour < this.to
            : hour >= this.from || hour < this.to;
    }
}

module.exports = Rate;
