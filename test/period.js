const expect = require('chai').expect;

const Period = require('../src/period');

describe('Period', function () {
    it('being daily should include specific hour', function () {
        const period = new Period(6, 9);

        expect(period.includes(6)).to.true;
        expect(period.includes(7)).to.true;

        expect(period.includes(8)).to.true;
        expect(period.includes(9)).to.false;

        expect(period.includes(5)).to.false;
        expect(period.includes(10)).to.false;
    });

    it('being nightly should include specific hour', function () {
        const period = new Period(20, 8);

        expect(period.includes(20)).to.true;
        expect(period.includes(21)).to.true;

        expect(period.includes(0)).to.true;

        expect(period.includes(7)).to.true;
        expect(period.includes(8)).to.false;

        expect(period.includes(19)).to.false;
        expect(period.includes(9)).to.false;
    });

    it('being 24h should include everything', function () {
        const period = new Period(0, 0);

        expect(period.includes(0)).to.true;
        expect(period.includes(12)).to.true;
        expect(period.includes(23)).to.true;
    });

    it('being daily is extendable', function () {
        const period = new Period(10, 15);

        period.extend(2);
        expect(period.from).to.equal(10);
        expect(period.to).to.equal(17);

        period.extend(0);
        expect(period.from).to.equal(10);
        expect(period.to).to.equal(17);
    });

    it('being nightly is extendable', function () {
        const period = new Period(21, 7);

        period.extend(2);
        expect(period.from).to.equal(21);
        expect(period.to).to.equal(9);

        period.extend(0);
        expect(period.from).to.equal(21);
        expect(period.to).to.equal(9);
    });

    it('being daily is extendable to nightly', function () {
        const period = new Period(20, 22);

        period.extend(5);
        expect(period.from).to.equal(20);
        expect(period.to).to.equal(3);
    });

    it('being daily is subtractable', function () {
        const period = new Period(10, 18);

        period.subtract(5);
        expect(period.from).to.equal(10);
        expect(period.to).to.equal(13);

        period.subtract(0);
        expect(period.from).to.equal(10);
        expect(period.to).to.equal(13);
    });

    it('being nightly is subtractable', function () {
        const period = new Period(18, 8);

        period.subtract(5);
        expect(period.from).to.equal(18);
        expect(period.to).to.equal(3);

        period.subtract(0);
        expect(period.from).to.equal(18);
        expect(period.to).to.equal(3);
    });

    it('being nightly is subtractable to daily', function () {
        const period = new Period(22, 2);

        period.subtract(1);
        expect(period.from).to.equal(22);
        expect(period.to).to.equal(1);

        period.subtract(2);
        expect(period.from).to.equal(22);
        expect(period.to).to.equal(23);
    });

    it('being daily has range', function () {
        const period = new Period(10, 12);
        expect(period.range).to.eql([10, 11]);
    });

    it('being 1h has range', function () {
        const period = new Period(10, 11);
        expect(period.range).to.eql([10]);
    });

    it('being nightly has range', function () {
        const period = new Period(22, 3);
        expect(period.range).to.eql([22, 23, 0, 1, 2]);
    });

    it('being 24h has 24h range', function () {
        const expected = [...Array(24).keys()];

        let period = new Period(0, 0);
        expect(period.range).to.eql(expected);

        period = new Period(7, 7);
        expect(period.range).to.eql(expected);
    });

    it('being 24h is all-nigth', function () {
        let period = new Period(0, 0);
        expect(period.isAllNight).to.true;

        period = new Period(7, 7);
        expect(period.isAllNight).to.true;

        period = new Period(7, 8);
        expect(period.isAllNight).to.false;

        period = new Period(8, 7);
        expect(period.isAllNight).to.false;
    })
});
