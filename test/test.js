const expect = require('chai').expect;

const Reader = require('../src/reader');

describe('Input data reader', function () {
    it('should read devices', function () {

        const devices = Reader.read('test/data/input.json').devices;
        expect(devices).to.have.lengthOf(5);
        expect(devices[0].name).to.equal('Посудомоечная машина');
    });

    it('should read rates', function () {
        const rates = Reader.read('test/data/input.json').rates;
        expect(rates).to.have.lengthOf(5);
        expect(rates[0].value).to.equal(6.46);
    });
});