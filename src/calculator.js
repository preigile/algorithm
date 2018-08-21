const Period = require('./period');

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
        const scheduledDevices = [];
        let devices = [];

        // Optimization - first of all schedule all-night devices
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

        return {
            "schedule": this.calculateSchedule(result.scheduledDevices),
            "consumedEnergy": this.calculatePrice(result.scheduledDevices)
        };
    }

    // Build the schedule object based on scheduled devices
    calculateSchedule(scheduledDevices) {
        const schedule = {};

        for (let hour = 0; hour <= 23; hour++) {
            const runningDevices = scheduledDevices.filter(each => each.includes(hour));

            schedule[hour] = runningDevices.map(each => each.device.id);
        }

        return schedule;
    }

    // Build the consumed energy object based on scheduled devices
    calculatePrice(scheduledDevices) {
        let totalPrice = 0.0;
        const pricePerDevice = {};

        for (let hour = 0; hour <= 23; hour++) {
            const rate = this.powerplan.getRate(hour);
            let subtotal = 0;
            let power = 0;

            for (let i = 0; i < scheduledDevices.length; i++) {
                const each = scheduledDevices[i];

                if (each.includes(hour)) {
                    const device = each.device;
                    power += device.power;

                    if (power > this.powerplan.maxPower) {
                        return null;
                    }

                    const id = device.id;
                    const price = device.hourlyPrice(rate);
                    const current = pricePerDevice[id];

                    pricePerDevice[id] = current ? current + price : price;
                    subtotal += price;
                }
            }

            totalPrice += subtotal;
        }

        return {
            "value": totalPrice,
            "devices": pricePerDevice
        };
    }

    scheduleDevices(devices, scheduledDevices, result) {
        const price = this.calculatePrice(scheduledDevices);

        if (price === null || price.value >= result.total) {
            return;
        }

        if (devices.length === 0) {
            result.total = price.value;
            result.scheduledDevices = scheduledDevices;
            return;
        }

        devices.forEach((device, index) => {
            // We expect here that all-night devices were already scheduled,
            // otherwise their allowed start period range here will have 24 items
            // and lead to very inefficient calculation.
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

module.exports = Calculator;
