const expect = require('chai').expect;

const Rate = require('../src/rate');

describe('Rate', function () {
    it('being dayly should include some hour', function () {
        const rate = new Rate(6, 9, 1.0);

        expect(rate.includes(6)).to.true;
        expect(rate.includes(7)).to.true;

        expect(rate.includes(8)).to.true;
        expect(rate.includes(9)).to.true;

        expect(rate.includes(5)).to.false;
        expect(rate.includes(10)).to.false;
    });

    it('being nightly should include some hour', function () {
        const rate = new Rate(20, 8, 1.0);

        expect(rate.includes(20)).to.true;
        expect(rate.includes(21)).to.true;

        expect(rate.includes(0)).to.true;

        expect(rate.includes(7)).to.true;
        expect(rate.includes(8)).to.true;

        expect(rate.includes(19)).to.false;
        expect(rate.includes(9)).to.false;
    })
});
