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

    it('being daily is extendable', function () {
        const period = new Period(10, 15);
        period.extend(2);

        expect(period.from).to.equal(10);
        expect(period.to).to.equal(17);
    });

    it('being nightly is extendable', function () {
        const period = new Period(21, 7);
        period.extend(2);

        expect(period.from).to.equal(21);
        expect(period.to).to.equal(9);
    });

    it('being daily is extendable to nightly', function () {
        const period = new Period(20, 22);
        period.extend(5);

        expect(period.from).to.equal(20);
        expect(period.to).to.equal(3);
    })
});
