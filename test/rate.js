const expect = require('chai').expect;

const Rate = require('../src/rate');
var Device = require('../src/device');

describe('Rate', function () {
    it('being daily should include specific hour', function () {
        const rate = new Rate(6, 9, 0.0);

        expect(rate.includes(6)).to.true;
        expect(rate.includes(7)).to.true;

        expect(rate.includes(8)).to.true;
        expect(rate.includes(9)).to.false;

        expect(rate.includes(5)).to.false;
        expect(rate.includes(10)).to.false;
    });

    it('being nightly should include specific hour', function () {
        const rate = new Rate(20, 8, 0.0);

        expect(rate.includes(20)).to.true;
        expect(rate.includes(21)).to.true;

        expect(rate.includes(0)).to.true;

        expect(rate.includes(7)).to.true;
        expect(rate.includes(8)).to.false;

        expect(rate.includes(19)).to.false;
        expect(rate.includes(9)).to.false;
    });

    it('should calculate hourly energy consumption', function () {
        const device = new Device('id', 'name', 50, 3);
        const rate = new Rate(0, 23, 5.0);

        expect(rate.hourlyConsumption(device)).to.be.closeTo(0.25, 0.001);
    })
});
