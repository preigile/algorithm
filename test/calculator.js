const expect = require('chai').expect;

const Calculator = require('../src/calculator');
const PowerPlan = require('../src/powerplan');
const Device = require('../src/device');
const Reader = require('../src/reader');
const Rate = require('../src/rate');

describe('Calculator on full input data', function () {
    const data = Reader.read('test/data/input.json');
    const calculator = new Calculator(data.powerplan, data.devices);

    it('should calculate total consumed energy', function () {
        const output = calculator.calculate();
        expect(output.consumedEnergy.value).to.be.closeTo(38.939, 0.001);
    })
});

describe('Calculator on small input data', function () {
    function calculate(input) {
        const data = Reader.materialize(input);
        const calculator = new Calculator(data.powerplan, data.devices);
        return calculator.calculate();
    }

    it('should schedule 24h devices', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 24}
            ],
            "rates": [
                {"from": 0, "to": 0, "value": 1}
            ],
            "maxPower": 1000
        };

        const output = calculate(input);

        expect(output.schedule['0']).to.include("d0");
        expect(output.schedule['23']).to.include("d0");
    });

    it('should calculate consumed energy for 24h device', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 24}
            ],
            "rates": [
                {"from": 0, "to": 0, "value": 1}
            ],
            "maxPower": 1000
        };

        const output = calculate(input);

        const devices = output.consumedEnergy.devices;
        expect(devices['d0']).to.be.closeTo(0.24, 0.001);
    });

    it('should calculate the simplest schedule', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 2, "mode": "day"}
            ],
            "rates": [
                {"from": 0, "to": 0, "value": 1}
            ],
            "maxPower": 1000
        };

        const output = calculate(input);

        expect(output.schedule['9']).to.have.length(0);
        expect(output.schedule['7']).to.include("d0");
        expect(output.schedule['8']).to.include("d0");
        expect(output.schedule['9']).to.have.length(0);
    })
});
