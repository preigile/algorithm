const expect = require('chai').expect;

const Device = require('../src/device');
const Period = require('../src/period');
const Rate = require('../src/rate');

describe('Device', function () {
    it('should have daily allowed period', function () {
        const device = new Device('id', 'name', 0, 3, 'day');
        const period = device.allowedPeriod;

        expect(period.from).to.equals(7);
        expect(period.to).to.equals(21);
    });

    it('should have nightly allowed period', function () {
        const device = new Device('id', 'name', 0, 3, 'night');
        const period = device.allowedPeriod;

        expect(period.from).to.equals(21);
        expect(period.to).to.equals(7);
    });

    it('should have 24h allowed period', function () {
        const device = new Device('id', 'name', 0, 3);
        const period = device.allowedPeriod;

        expect(period.from).to.equals(0);
        expect(period.to).to.equals(23);
    });

    it('should have daily allowed start period', function () {
        const device = new Device('id', 'name', 0, 3, 'day');
        const period = device.allowedStartPeriod;

        expect(period.from).to.equals(7);
        expect(period.to).to.equals(18);
    });

    it('should have nightly allowed start period', function () {
        const device = new Device('id', 'name', 0, 3, 'night');
        const period = device.allowedStartPeriod;

        expect(period.from).to.equals(21);
        expect(period.to).to.equals(4);
    });

    it('should have daily from nightly allowed start period', function () {
        const device = new Device('id', 'name', 0, 8, 'night');
        const period = device.allowedStartPeriod;

        expect(period.from).to.equals(21);
        expect(period.to).to.equals(23);
    });

    it('should have 24h allowed start period', function () {
        const device = new Device('id', 'name', 0, 3);
        const period = device.allowedStartPeriod;

        expect(period.from).to.equals(0);
        expect(period.to).to.equals(23);
    });

    it('should calculate hourly energy consumption', function () {
        const device = new Device('id', 'name', 50, 3);
        const rate = new Rate(0, 23, 5.0);

        expect(device.hourlyConsumption(rate)).to.be.closeTo(0.25, 0.001);
    });
});