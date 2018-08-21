class Period {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    includes(hour) {
        return this.from < this.to
            ? hour >= this.from && hour < this.to
            : hour >= this.from || hour < this.to;
    }

    extend(duration) {
        const extended = this.to + duration;
        this.to = extended > 23 ? extended - 24 : extended;

        return this;
    }

    subtract(duration) {
        const to = this.to - duration;
        this.to = to < 0 ? to + 24 : to;

        return this;
    }

    get range() {
        return this.from === this.to
            ? [...Array(24).keys()]
            : this.from < this.to
                ? [...Array(this.to - this.from).keys()].map(i => i + this.from)
                : [...Array(24 - this.from).keys()].map(i => i + this.from).concat([...Array(this.to).keys()]);
    }
}

module.exports = Period;
