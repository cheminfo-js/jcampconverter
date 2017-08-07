'use strict';

const Converter = require('..');
const fs = require('fs');

describe('Test from ACD Jcamp generator', () => {
    it('COSY simulated spectrum', () => {
        var result = Converter.convert(
            fs.readFileSync(__dirname + '/data/acd/test1_cosy.jdx').toString(),
            {xy: true}
        );
        expect(result.ntuples.length).toBe(3);
        expect(result.twoD).toBe(true);
        expect(result.contourLines).toBeInstanceOf(Object);
    });
});
