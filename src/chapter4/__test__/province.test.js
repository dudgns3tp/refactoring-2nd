/* eslint-disable no-undef */
const Province = require('../class/province');
const { sampleProvinceData } = require('../sample');

describe('province', function () {
    it('shortfall', () => {
        const asia = new Province(sampleProvinceData());
        expect(asia.shortfall).toBe(5);
    });
});
