'use strict';

const Converter = require('..');
const fs = require('fs');

describe('Test JCAMP options', () => {
    it('1H NMR ethyl vinyl ether', () => {
        var result = Converter.convert(
            fs.readFileSync(__dirname + '/data/ethylvinylether/1h.jdx').toString(),
            {keepRecordsRegExp: /^.+$/}
        );

        expect(Object.keys(result.info).length).toBe(385);
        expect(result.info.$SOLVENT).toBe('<DMSO>');
    });
});
