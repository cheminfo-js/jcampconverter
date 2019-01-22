'use strict';

const Converter = require('..');

const fs = require('fs');

describe('Test JCAMP converter of NMR with peak assignments', () => {
  const target = fs.readFileSync(
    `${__dirname}/data/misc/nmr_13c_dept.dx`
  ).toString();

  const result = Converter.convert(target);

  const paTarget = result.spectra[4];
  const nmrTarget = result.spectra[2];

  it('has correct PEAK ASSIGNMENTS parameters', () => {
    expect(paTarget.nbPoints).toBe(2);
    expect(paTarget.dataType).toBe('PEAK ASSIGNMENTS');
    expect(paTarget.isXYAdata).toBe(true);
  });

  it('has MAXX, MAXY, MINX and MINY parameters', () => {
    // http://www.jcamp-dx.org/protocols/dxnmr01.pdf (5.3.4)
    expect(paTarget.maxX).toBe(235.4936);
    expect(paTarget.minX).toBe(-15.458417214338084);
    expect(paTarget.maxY).toBe(266635237.0);
    expect(paTarget.minY).toBe(-283555411.0);
  });

  it('has data from (XYA)', () => {
    // http://www.jcamp-dx.org/protocols/dxnmr01.pdf (Example 3)
    expect(paTarget.data[0][0]).toBe(118.93612601748676);
    expect(paTarget.data[0][1]).toBe(246226528.0);
    expect(paTarget.data[0][2]).toBe(119.12759305537116);
    expect(paTarget.data[0][3]).toBe(266635237.0);

    expect(paTarget.data[0].length / 2).toBe(2);
  });

  it('has a shiftOffsetVal parameter for "NMR SPECTRUM"', () => {
    expect(nmrTarget.shiftOffsetVal).toBe(235.4936);
  });

  it('has a sampleDescription', () => {
    expect(paTarget.sampleDescription).toBe('This is a test.');
  });
});
