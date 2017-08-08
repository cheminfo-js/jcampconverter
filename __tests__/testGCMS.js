'use strict';

const Converter = require('..');
const fs = require('fs');
const gcms = fs.readFileSync(__dirname + '/data/misc/gcms.jdx').toString();
const chromTest = fs.readFileSync(__dirname + '/data/misc/chrom.jdx').toString();

describe('Test JCAMP converter of GCMS', () => {
    it('complex chromatogram', () => {
        var result = Converter.convert(gcms, {chromatogram: true});
        var chrom = result.chromatogram;

        // Check content
        expect(chrom.times).toBeInstanceOf(Array);
        expect(chrom.series).toBeInstanceOf(Object);
        // Check length
        expect(chrom.times.length).toBe(2420);
        expect(chrom.series.ms.data.length).toBe(2420);
        expect(chrom.series.tic.data.length).toBe(2420);
        expect(chrom.series.scannumber.data.length).toBe(2420);
    });

    it('simple chromatogram', () => {
        var result = Converter.convert(chromTest, {chromatogram: true});
        var chrom = result.chromatogram;

        // Check content
        expect(chrom.times).toBeInstanceOf(Array);
        expect(chrom.series).toBeInstanceOf(Object);

        // Check length
        expect(chrom.times.length).toBe(10530);
        expect(chrom.series.intensity.data.length).toBe(10530);
    });
});
