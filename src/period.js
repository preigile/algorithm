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
    }
}

module.exports = Period;
