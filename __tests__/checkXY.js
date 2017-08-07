'use strict';

const Converter = require('..');
const fs = require('fs');

var jcamp = fs.readFileSync(__dirname + '/data/misc/iv.jdx').toString();

describe('Test conversion option for jcamp', () => {
    it('1H NMR ethyl vinyl ether', () => {
        var result = Converter.convert(jcamp, {xy: true});

        var x = result.spectra[0].data[0].x;
        var y = result.spectra[0].data[0].y;

        // Check X and Y length
        expect(x.length).toBe(302);
        expect(y.length).toBe(302);

        // Check type is peak table
        var type = result.spectra[0];
        expect(type).not.toHaveProperty('isXYdata');
        expect(type.isPeaktable).toBe(true);
    });

    it('withoutXY', () => {
        var result = Converter.convert(jcamp, {withoutXY: true, keepRecordsRegExp: /.*/});
        expect(result.info.TITLE).toBe('abc');
        expect(result.info).not.toHaveProperty('PEAKTABLE');
    });
});
