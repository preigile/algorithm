const expect = require('chai').expect;

const PowerPlan = require('../src/powerplan');
const Rate = require('../src/rate');

describe('Power plan', function () {
    it('should return rate for specific hour', function () {
        const rates = [new Rate(6, 9, 1.0), new Rate(11, 13, 2.0)];
        const powerplan = new PowerPlan(rates, 0);

        expect(powerplan.getRate(7).value).to.equal(1.0);
        expect(powerplan.getRate(12).value).to.equal(2.0);
        expect(powerplan.getRate(10).value).to.equal(0.0);
    })
});
