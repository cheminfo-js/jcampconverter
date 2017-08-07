'use strict';

const Converter = require('..');
const fs = require('fs');
const file = fs.readFileSync(__dirname + '/data/misc/gcms.jdx').toString();

describe('Test JCAMP converter of GCMS', () => {
    it('old format', () => {
        var result = Converter.convert(file);
        var gcms = result.gcms;

        // Check content
        expect(gcms.gc).toBeInstanceOf(Object);
        expect(gcms.ms).toBeInstanceOf(Object);
        expect(gcms.gc.tic).toBeInstanceOf(Array);

        // Check length
        expect(gcms.gc.tic.length).toBe(4840);
        expect(gcms.ms.length).toBe(2420);
    });

    it('new format', () => {
        var result = Converter.convert(file, {newGCMS: true});
        var gcms = result.gcms;

        // Check content
        expect(gcms.times).toBeInstanceOf(Array);
        expect(gcms.series).toBeInstanceOf(Object);
        // Check length
        expect(gcms.times.length).toBe(2420);
        expect(gcms.series.ms.data.length).toBe(2420);
        expect(gcms.series.tic.data.length).toBe(2420);
        expect(gcms.series.scannumber.data.length).toBe(2420);
    });
});
