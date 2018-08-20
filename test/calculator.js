const fs = require('fs');
const expect = require('chai').expect;

const Calculator = require('../src/calculator');
const Reader = require('../src/reader');
const Writer = require('../src/writer');

describe('Calculator', function () {
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
    });
});

describe('Calculator on sample input data', function () {
    const data = Reader.read('test/data/input.json');
    const calculator = new Calculator(data.powerplan, data.devices);
    const actual = calculator.calculate();
    const expected = JSON.parse(fs.readFileSync('test/data/output-expected.json'));

    it('should calculate total consumed energy', function () {
        expect(actual).to.not.null;
        expect(actual.consumedEnergy.value).to.be.closeTo(expected.consumedEnergy.value, 0.001);
    });

    it('should calculate consumed energy per device', function () {
        expect(actual).to.not.null;
        const expectedDevices = expected.consumedEnergy.devices;
        const actualDevices = actual.consumedEnergy.devices;

        for (let id in expectedDevices) {
            expect(actualDevices).to.haveOwnProperty(id);
            expect(actualDevices[id]).to.be.closeTo(expectedDevices[id], 0.001);
        }
    });

    it('should calculate correct schedule', function () {
        expect(actual).to.not.null;

        for (let hour in expected.schedule) {
            expect(actual.schedule[hour], "Hour " + hour).to.have.members(expected.schedule[hour]);
        }
    });

    it('Can write output data', function () {
        expect(actual).to.not.null;

        new Writer(actual).write('test/data/output-actual.json');
    })
});
