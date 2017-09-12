'use strict';

var Converter = require('../src/index');
var fs = require('fs');

describe.only('Test from Mestrec Jcamp generator with assignment', function () {

    it('should give 5 spectra', function () {

        var result = Converter.createTree(fs.readFileSync(__dirname + '/data/mestrec/mestrec.jdx').toString());
        console.log(result);
        expect(result.length).toBe(1);
        // result.ntuples.length.should.eql(3);
        // result.twoD.should.be.true();
        // result.contourLines.should.be.obj;
    });
});
