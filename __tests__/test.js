'use strict';

var Converter = require('..');
var fs = require('fs');

function checkJcamp(filename, label, data) {
    const result = Converter.convert(fs.readFileSync(__dirname + '/data' + filename).toString());
    describe(label, () => {
        it('xAxis type', () => {
            expect(result.xType).toEqual(data.xType);
        });

        if (result.spectra) {
            it('Number of spectra present', () => {
                expect(result.spectra.length).toEqual(data.nbSpectra);
            });

            it('Spectrum data', () => {
                var spectrum = result.spectra[0];
                expect(spectrum.observeFrequency).toEqual(data.observeFrequency);
                expect(spectrum.nbPoints).toEqual(data.nbPoints);
                expect(spectrum.nbPoints).toEqual(spectrum.data[0].length / 2);
                expect(spectrum.firstX).toEqual(data.firstX);
                expect(spectrum.lastX).toEqual(data.lastX);
                expect(spectrum.data[0].reduce((a, b) => a + b)).toEqual(data.total);
            });
        }
    });
}

describe('Test JCAMP converter', () => {

    checkJcamp('/ethylvinylether/1h.jdx', '1H NMR Ethyl vinyl ether', {
        nbSpectra: 2,
        xType: '1H',
        observeFrequency: 400.112,
        nbPoints: 16384,
        firstX: 11.00659,
        lastX: -1.009276326659311,
        total: 10199322812.993612
    });

    describe('All those compressions should give exactly the dame result', () => {
        var options = {
            nbSpectra: 1,
            xType: '1H',
            observeFrequency: 400.1321303162,
            nbPoints: 16384,
            firstX: 12.31284,
            lastX: -1.6646457842364946,
            total: 11044828778.007011
        };

        checkJcamp('/compression/jcamp-fix.dx', 'Compression fixed', options);
        checkJcamp('/compression/jcamp-packed.dx', 'Compression packed', options);
        checkJcamp('/compression/jcamp-squeezed.dx', 'Compression squeezed', options);
        checkJcamp('/compression/jcamp-difdup.dx', 'Compression difdup', options);

    });

    checkJcamp('/indometacin/1h.dx', '1H NMR Indometacin', {
        nbSpectra: 1,
        xType: '1H',
        observeFrequency: 399.682468187609,
        nbPoints: 32768,
        firstX: 16.46138,
        lastX: -4.114164000759506,
        total: 34968303169.78704
    });

    checkJcamp('/indometacin/cosy.dx', 'COSY Indometacin', {
        nbSpectra: 1024,
        xType: '1H',
        observeFrequency: 399.682944878731,
        nbPoints: 1024,
        firstX: 13.42727,
        lastX: 1.3052585346869103,
        total: 543213.05460976
    });

    checkJcamp('/indometacin/hsqc.dx', 'HSQC Indometacin', {
        nbSpectra: 1024,
        xType: '1H',
        observeFrequency: 399.682944878731,
        nbPoints: 1024,
        firstX: 13.42727,
        lastX: 1.3052585346869103,
        total: 8546795.054609755
    });

    checkJcamp('/indometacin/hmbc.dx', 'HMBC Indometacin', {
        nbSpectra: 1024,
        xType: '1H',
        observeFrequency: 399.682956295637,
        nbPoints: 1024,
        firstX: 13.35119,
        lastX: 1.4369847858490203,
        total: 24130609.545490365
    });

// TODO fix this case
// checkJcamp('/misc/nemo_generated.jdx', "Nemo generated JCamp",
//     {
//         nbSpectra: 2,
//         xType: "1H",
//         observeFrequency: 600.589925054317,
//         nbPoints: 131072,
//         firstX: 14.82852,
//         lastX: -5.183854946422537,
//         total: 92336803770.80695
//     }
// );
});
