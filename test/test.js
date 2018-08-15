const expect = require('chai').expect;

const Reader = require('../src/reader');
const Device = require('../src/device');
const Calculator = require('../src/calculator');

describe('Input data reader', function () {
    it('should read devices', function () {

        const devices = Reader.read('test/data/input.json').devices;
        expect(devices).to.have.lengthOf(5);
        expect(devices[0].name).to.equal('Посудомоечная машина');
    });

    it('should read rates', function () {
        const powerplan = Reader.read('test/data/input.json').powerplan;
        const rates = powerplan.rates;
        expect(rates).to.have.lengthOf(5);
        expect(rates[0].value).to.equal(6.46);
    });

    it('should read max power', function () {
        const powerplan = Reader.read('test/data/input.json').powerplan;
        expect(powerplan.maxPower).to.equal(2100);
    });

    describe('Calculator', function () {
        it('should work', function () {
            const data = Reader.read('test/data/input.json');
            const devices = data.devices;
            const powerplan = data.powerplan;
            const calculator = new Calculator(powerplan, devices);
            const output = calculator.calculate();
            console.log(output);
        })
    });
});
