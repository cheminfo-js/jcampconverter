'use strict';

var Converter = require('..');
var fs = require('fs');

describe('Intensity Scaling', function () {
    describe('Difdup compresion file', function () {
        let jcamp = fs.readFileSync(__dirname + '/data/compression/jcamp-difdup.dx').toString();
        let jcampNcProcReduced = fs.readFileSync(__dirname + '/data/intensityScaling/jcamp-difdupNcProcReduced.dx').toString();
        var result = Converter.convert(jcamp, {useNcProc: true, xy: true});
        var resultNcProcReduced = Converter.convert(jcampNcProcReduced, {useNcProc: true, xy: true});
        it('should be double of first', function() {
            let x1 = result.spectra[0].data[0].y[0];
            let x2 = resultNcProcReduced.spectra[0].data[0].y[0];
            x1.should.equal(x2/2);
        })
    })
})