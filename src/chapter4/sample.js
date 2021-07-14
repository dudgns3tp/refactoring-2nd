function sampleProvinceData() {
    return {
        name: 'Asia',
        producers: [
            { name: 'Byzantium', const: 10, production: 9 },
            { name: 'Attalia', const: 12, production: 10 },
            { name: 'Sinope', const: 10, production: 6 },
        ],
        demand: 30,
        price: 20,
    };
}

module.exports = {
    sampleProvinceData,
};
