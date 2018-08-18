const fs = require('fs');

const Device = require('./device');
const Rate = require('./rate');
const PowerPlan = require('./powerplan');

class Reader {
    static read(file) {
        const text = fs.readFileSync(file);
        const input = JSON.parse(text);
        return this.materialize(input);
    }

    static materialize(input) {
        const devices = input.devices.map(device =>
            new Device(device.id, device.name, parseFloat(device.power), parseInt(device.duration), device.mode)
        );


        const rates = input.rates.map(rate =>
            new Rate(parseInt(rate.from), parseInt(rate.to), parseFloat(rate.value))
        );

        return {
            devices: devices,
            powerplan: new PowerPlan(rates, input.maxPower)
        };
    }
}

module.exports = Reader;
