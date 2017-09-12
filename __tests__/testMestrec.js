'use strict';

var Converter = require('../src/index');
var fs = require('fs');

describe('Test from Mestrec Jcamp generator with assignment', function () {
    it('should give 5 spectra', function () {
        var result = Converter.createTree(fs.readFileSync(__dirname + '/data/mestrec/mestrec.jdx').toString());
        expect(result.length).toBe(1);
    });
});
