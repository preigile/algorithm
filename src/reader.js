const fs = require('fs');

const Device = require('./device');
const Rate = require('./rate');
const PowerPlan = require('./powerplan');

class Reader {
    static read(file) {
        const devices = [];
        const rates = [];
        const data = fs.readFileSync(file);
        const input = JSON.parse(data);

        input.devices.forEach(device => {
            devices.push(new Device(device.id, device.name, parseFloat(device.power),
                parseInt(device.duration),
                device.mode));
        });

        input.rates.forEach(rate => {
            rates.push(new Rate(rate.from, rate.to, parseFloat(rate.value)));
        });

        return {
            devices: devices,
            powerplan: new PowerPlan(rates, input.maxPower)
        };
    }
}

module.exports = Reader;
