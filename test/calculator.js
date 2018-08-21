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

    it('should use device mode', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 1, "mode": "day"},
                {"id": "d1", "name": "d1", "power": 10, "duration": 1, "mode": "night"}
            ],
            "rates": [
                {"from": 0, "to": 0, "value": 1}
            ],
            "maxPower": 1000
        };

        const output = calculate(input);

        expect(output.schedule['7'], "Hour 7").to.have.members(['d0']);
        expect(output.schedule['21'], "Hour 21").to.have.members(['d1']);
    });

    it('should optimize cost for day mode devices', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 1, "mode": "day"},
                {"id": "d1", "name": "d1", "power": 10, "duration": 1, "mode": "day"}
            ],
            "rates": [
                {"from": 10, "to": 13, "value": 2},
                {"from": 13, "to": 15, "value": 1},
                {"from": 15, "to": 17, "value": 3}
            ],
            "maxPower": 1000
        };

        const output = calculate(input);

        expect(output.schedule['13']).to.have.members(['d0', 'd1']);
    });

    it('should optimize cost for night mode devices', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 1, "mode": "night"},
                {"id": "d1", "name": "d1", "power": 10, "duration": 1, "mode": "night"}
            ],
            "rates": [
                {"from": 1, "to": 2, "value": 2},
                {"from": 2, "to": 3, "value": 1},
                {"from": 3, "to": 4, "value": 3}
            ],
            "maxPower": 1000
        };

        const output = calculate(input);

        expect(output.schedule['2']).to.have.members(['d0', 'd1']);
    });

    it('should optimize cost for devices without mode', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 1},
                {"id": "d1", "name": "d1", "power": 10, "duration": 1}
            ],
            "rates": [
                {"from": 10, "to": 13, "value": 2},
                {"from": 13, "to": 15, "value": 1},
                {"from": 15, "to": 17, "value": 3}
            ],
            "maxPower": 1000
        };

        const output = calculate(input);

        expect(output.schedule['13']).to.have.members(['d0', 'd1']);
    });

    it('should use the max power', function () {
        const input = {
            "devices": [
                {"id": "d0", "name": "d0", "power": 10, "duration": 1, "mode": "day"},
                {"id": "d1", "name": "d1", "power": 20, "duration": 1, "mode": "day"}
            ],
            "rates": [
                {"from": 7, "to": 8, "value": 1},
                {"from": 8, "to": 7, "value": 2}
            ],
            "maxPower": 25
        };

        const output = calculate(input);
        expect(output.schedule['7'], "Hour 7").to.have.members(['d1']);
        expect(output.schedule['8'], "Hour 8").to.have.members(['d0']);
    })
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
    //
    // it('can write output data', function () {
    //     expect(actual).to.not.null;
    //
    //     new Writer(actual).write('test/data/output-actual.json');
    // })
});
