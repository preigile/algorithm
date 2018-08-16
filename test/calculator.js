const expect = require('chai').expect;

const Calculator = require('../src/calculator');
const PowerPlan = require('../src/powerplan');
const Device = require('../src/device');
const Reader = require('../src/reader');
const Rate = require('../src/rate');

describe('Calculator', function () {
    it('should work', function () {
        const data = Reader.read('test/data/input.json');
        const devices = data.devices;
        const powerplan = data.powerplan;
        const calculator = new Calculator(powerplan, devices);
        const output = calculator.calculate();
    })
});
