const expect = require('chai').expect;

const Reader = require('../src/reader');

describe('Input data reader', function () {
    const reader = Reader.read('test/data/input.json');

    it('should read devices', function() {
        const devices = reader.devices;
        expect(devices).to.have.lengthOf(5);
        expect(devices[0].name).to.equal('Посудомоечная машина');
    });

    it('should read rates', function() {
        const powerplan = reader.powerplan;
        const rates = powerplan.rates;
        expect(rates).to.have.lengthOf(5);
        expect(rates[0].value).to.equal(6.46);
    });

    it('should read max power', function() {
        const powerplan = reader.powerplan;
        expect(powerplan.maxPower).to.equal(2100);
    });
});
