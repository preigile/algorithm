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

        input.devices.forEach(each => {
            devices.push(new Device(each.id, each.name, each.power, each.duration, each.mode));
        });

        input.rates.forEach(each => {
            rates.push(new Rate(each.from, each.to, each.value))
        });

        return {
            devices: devices,
            rates: rates
        };
    }
}

module.exports = Reader;
