const Period = require('./period');
const Device = require('./device');

class ScheduledDevice {
    constructor(device, hour) {
        this.device = device;
        this.period = new Period(hour, hour);
        this.period.extend(device.duration);
    }

    includes(hour) {
        return this.period.includes(hour);
    }
}

class Calculator {
    constructor(powerplan, devices) {
        this.powerplan = powerplan;
        this.devices = devices;
    }

    calculate() {
        const schedule = this.calculateSchedule();

        return {
            "schedule": schedule,
            "consumedEnergy": this.calculatePrice(schedule)
        };
    }

    calculateSchedule() {
        const scheduledDevices = [];
        let devices = [];

        this.devices.forEach(device => {
            if (device.isAllNight) {
                scheduledDevices.push(new ScheduledDevice(device, 0));
            } else {
                devices.push(device);
            }
        });

        const result = {
            total: Number.MAX_VALUE,
            scheduledDevices: []
        };

        this.scheduleDevices(devices, scheduledDevices, result);

        return result.scheduledDevices
            ? this.calculateScheduleFromDevices(result.scheduledDevices)
            : null;
    }

    calculateScheduleFromDevices(scheduledDevices) {
        const schedule = {};

        for (let hour = 0; hour <= 23; hour++) {
            const runningDevices = scheduledDevices.filter(each => each.includes(hour));
            const power = runningDevices.map(each => each.device.power).reduce((a, b) => a + b, 0);

            if (power > this.powerplan.maxPower) {
                return null;
            }

            schedule[hour] = runningDevices.map(each => each.device.id);
        }

        return schedule;
    }

    calculatePrice(schedule) {
        let total = 0.0;
        const pricePerDevice = {};

        for (let hour in schedule) {
            const deviceIds = schedule[hour];
            const rate = this.powerplan.getRate(hour);

            deviceIds.forEach(id => {
                const device = this.devices.find(device => device.id === id);
                const price = device.hourlyPrice(rate);
                const current = pricePerDevice[id];

                pricePerDevice[id] = current ? current + price : price;
                total += price;
            });
        }

        return {
            "value": total,
            "devices": pricePerDevice
        };
    }

    scheduleDevices(devices, scheduledDevices, result) {
        if (devices.length === 0) {
            const price = this.calculateTotalPrice(scheduledDevices);

            if (price && price < result.total) {
                result.total = price;
                result.scheduledDevices = scheduledDevices;
            }
        } else {
            devices.forEach((device, index) => {
                device.allowedStartPeriod.range.forEach(hour => {
                    // Support edge case where there is no any rate for specific hour
                    if (this.powerplan.getRate(hour)) {
                        const scheduledDevicesCopy = scheduledDevices.slice(0);
                        const devicesCopy = devices.slice(0);
                        devicesCopy.splice(index, 1);

                        scheduledDevicesCopy.push(new ScheduledDevice(device, hour));
                        this.scheduleDevices(devicesCopy, scheduledDevicesCopy, result);
                    }
                });
            });
        }
    }

    calculateTotalPrice(scheduledDevices) {
        const schedule = this.calculateScheduleFromDevices(scheduledDevices);
        return schedule ? this.calculatePrice(schedule).value : null;
    }
}

module.exports = Calculator;
