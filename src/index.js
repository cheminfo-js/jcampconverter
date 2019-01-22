'use strict';

function getConverter() {
  // the following RegExp can only be used for XYdata, some peakTables have values with a "E-5" ...
  const ntuplesSeparator = /[, \t]+/;
  const GC_MS_FIELDS = ['TIC', '.RIC', 'SCANNUMBER'];

  function convertToFloatArray(stringArray) {
    var floatArray = [];
    for (let i = 0; i < stringArray.length; i++) {
      floatArray.push(parseFloat(stringArray[i]));
    }
    return floatArray;
  }

  class Spectrum {}

  const defaultOptions = {
    keepRecordsRegExp: /^$/,
    xy: false,
    withoutXY: false,
    chromatogram: false,
    keepSpectra: false,
    noContour: false,
    nbContourLevels: 7,
    noiseMultiplier: 5,
    profiling: false
  };

  function convert(jcamp, options) {
    options = Object.assign({}, defaultOptions, options);

    var wantXY = !options.withoutXY;

    var start = Date.now();

    var ntuples = {};
    var ldr, dataLabel, dataValue, ldrs;
    var position, endLine, infos;

    var result = {};
    result.profiling = options.profiling ? [] : false;
    result.logs = [];
    var spectra = [];
    result.spectra = spectra;
    result.info = {};
    var spectrum = new Spectrum();

    if (!(typeof jcamp === 'string')) {
      throw new TypeError('the JCAMP should be a string');
    }

    if (result.profiling) {
      result.profiling.push({
        action: 'Before split to LDRS',
        time: Date.now() - start
      });
    }

    ldrs = jcamp.split(/[\r\n]+##/);

    if (result.profiling) {
      result.profiling.push({
        action: 'Split to LDRS',
        time: Date.now() - start
      });
    }

    if (ldrs[0]) ldrs[0] = ldrs[0].replace(/^[\r\n ]*##/, '');

    for (let i = 0; i < ldrs.length; i++) {
      ldr = ldrs[i];
      // This is a new LDR
      position = ldr.indexOf('=');
      if (position > 0) {
        dataLabel = ldr.substring(0, position);
        dataValue = ldr.substring(position + 1).trim();
      } else {
        dataLabel = ldr;
        dataValue = '';
      }
      dataLabel = dataLabel.replace(/[_ -]/g, '').toUpperCase();

      if (dataLabel === 'DATATABLE') {
        endLine = dataValue.indexOf('\n');
        if (endLine === -1) endLine = dataValue.indexOf('\r');
        if (endLine > 0) {
          var xIndex = -1;
          var yIndex = -1;
          // ##DATA TABLE= (X++(I..I)), XYDATA
          // We need to find the variables

          infos = dataValue.substring(0, endLine).split(/[ ,;\t]+/);
          if (infos[0].indexOf('++') > 0) {
            var firstVariable = infos[0].replace(
              /.*\(([a-zA-Z0-9]+)\+\+.*/,
              '$1'
            );
            var secondVariable = infos[0].replace(
              /.*\.\.([a-zA-Z0-9]+).*/,
              '$1'
            );
            xIndex = ntuples.symbol.indexOf(firstVariable);
            yIndex = ntuples.symbol.indexOf(secondVariable);
          }

          if (xIndex === -1) xIndex = 0;
          if (yIndex === -1) yIndex = 0;

          if (ntuples.first) {
            if (ntuples.first.length > xIndex) {
              spectrum.firstX = ntuples.first[xIndex];
            }
            if (ntuples.first.length > yIndex) {
              spectrum.firstY = ntuples.first[yIndex];
            }
          }
          if (ntuples.last) {
            if (ntuples.last.length > xIndex) {
              spectrum.lastX = ntuples.last[xIndex];
            }
            if (ntuples.last.length > yIndex) {
              spectrum.lastY = ntuples.last[yIndex];
            }
          }
          if (ntuples.vardim && ntuples.vardim.length > xIndex) {
            spectrum.nbPoints = ntuples.vardim[xIndex];
          }
          if (ntuples.factor) {
            if (ntuples.factor.length > xIndex) {
              spectrum.xFactor = ntuples.factor[xIndex];
            }
            if (ntuples.factor.length > yIndex) {
              spectrum.yFactor = ntuples.factor[yIndex];
            }
          }
          if (ntuples.units) {
            if (ntuples.units.length > xIndex) {
              spectrum.xUnit = ntuples.units[xIndex];
            }
            if (ntuples.units.length > yIndex) {
              spectrum.yUnit = ntuples.units[yIndex];
            }
          }
          spectrum.datatable = infos[0];
          if (infos[1] && infos[1].indexOf('PEAKS') > -1) {
            dataLabel = 'PEAKTABLE';
          } else if (
            infos[1] &&
            (infos[1].indexOf('XYDATA') || infos[0].indexOf('++') > 0)
          ) {
            dataLabel = 'XYDATA';
            spectrum.deltaX =
              (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
          }
        }
      }

      if (dataLabel === 'XYDATA') {
        if (wantXY) {
          prepareSpectrum(result, spectrum);
          // well apparently we should still consider it is a PEAK TABLE if there are no '++' after
          if (dataValue.match(/.*\+\+.*/)) {
            // ex: (X++(Y..Y))
            if (!spectrum.deltaX) {
              spectrum.deltaX =
                (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
            }
            fastParseXYData(spectrum, dataValue, result);
          } else {
            parsePeakTable(spectrum, dataValue, result);
          }
          spectra.push(spectrum);
          spectrum = new Spectrum();
        }
        continue;
      } else if (dataLabel === 'PEAKTABLE') {
        if (wantXY) {
          prepareSpectrum(result, spectrum);
          parsePeakTable(spectrum, dataValue, result);
          spectra.push(spectrum);
          spectrum = new Spectrum();
        }
        continue;
      }
      if (dataLabel === 'PEAKASSIGNMENTS') {
        if (wantXY) {
          if (dataValue.match(/.*(XYA).*/)) {
            // ex: (XYA)
            parseXYA(spectrum, dataValue);
          }
          spectra.push(spectrum);
          spectrum = new Spectrum();
        }
        continue;
      }

      if (dataLabel === 'TITLE') {
        spectrum.title = dataValue;
      } else if (dataLabel === 'DATATYPE') {
        spectrum.dataType = dataValue;
        if (dataValue.indexOf('nD') > -1) {
          result.twoD = true;
        }
      } else if (dataLabel === 'NTUPLES') {
        if (dataValue.indexOf('nD') > -1) {
          result.twoD = true;
        }
      } else if (dataLabel === 'XUNITS') {
        spectrum.xUnit = dataValue;
      } else if (dataLabel === 'YUNITS') {
        spectrum.yUnit = dataValue;
      } else if (dataLabel === 'FIRSTX') {
        spectrum.firstX = parseFloat(dataValue);
      } else if (dataLabel === 'LASTX') {
        spectrum.lastX = parseFloat(dataValue);
      } else if (dataLabel === 'FIRSTY') {
        spectrum.firstY = parseFloat(dataValue);
      } else if (dataLabel === 'LASTY') {
        spectrum.lastY = parseFloat(dataValue);
      } else if (dataLabel === 'NPOINTS') {
        spectrum.nbPoints = parseFloat(dataValue);
      } else if (dataLabel === 'XFACTOR') {
        spectrum.xFactor = parseFloat(dataValue);
      } else if (dataLabel === 'YFACTOR') {
        spectrum.yFactor = parseFloat(dataValue);
      } else if (dataLabel === 'MAXX') {
        spectrum.maxX = parseFloat(dataValue);
      } else if (dataLabel === 'MINX') {
        spectrum.minX = parseFloat(dataValue);
      } else if (dataLabel === 'MAXY') {
        spectrum.maxY = parseFloat(dataValue);
      } else if (dataLabel === 'MINY') {
        spectrum.minY = parseFloat(dataValue);
      } else if (dataLabel === 'DELTAX') {
        spectrum.deltaX = parseFloat(dataValue);
      } else if (dataLabel === '.OBSERVEFREQUENCY' || dataLabel === '$SFO1') {
        if (!spectrum.observeFrequency) {
          spectrum.observeFrequency = parseFloat(dataValue);
        }
      } else if (dataLabel === '.OBSERVENUCLEUS') {
        if (!spectrum.xType) {
          result.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
        }
      } else if (dataLabel === '$SFO2') {
        if (!result.indirectFrequency) {
          result.indirectFrequency = parseFloat(dataValue);
        }
      } else if (dataLabel === '$OFFSET') {
        // OFFSET for Bruker spectra
        result.shiftOffsetNum = 0;
        if (!spectrum.shiftOffsetVal) {
          spectrum.shiftOffsetVal = parseFloat(dataValue);
        }
      } else if (dataLabel === '$REFERENCEPOINT') {
        // OFFSET for Varian spectra
        // if we activate this part it does not work for ACD specmanager
        //         } else if (dataLabel=='.SHIFTREFERENCE') {   // OFFSET FOR Bruker Spectra
        //                 var parts = dataValue.split(/ *, */);
        //                 result.shiftOffsetNum = parseInt(parts[2].trim());
        //                 spectrum.shiftOffsetVal = parseFloat(parts[3].trim());
      } else if (dataLabel === 'VARNAME') {
        ntuples.varname = dataValue.split(ntuplesSeparator);
      } else if (dataLabel === 'SYMBOL') {
        ntuples.symbol = dataValue.split(ntuplesSeparator);
      } else if (dataLabel === 'VARTYPE') {
        ntuples.vartype = dataValue.split(ntuplesSeparator);
      } else if (dataLabel === 'VARFORM') {
        ntuples.varform = dataValue.split(ntuplesSeparator);
      } else if (dataLabel === 'VARDIM') {
        ntuples.vardim = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (dataLabel === 'UNITS') {
        ntuples.units = dataValue.split(ntuplesSeparator);
      } else if (dataLabel === 'FACTOR') {
        ntuples.factor = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (dataLabel === 'FIRST') {
        ntuples.first = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (dataLabel === 'LAST') {
        ntuples.last = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (dataLabel === 'MIN') {
        ntuples.min = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (dataLabel === 'MAX') {
        ntuples.max = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (dataLabel === '.NUCLEUS') {
        if (result.twoD) {
          result.yType = dataValue.split(ntuplesSeparator)[0];
        }
      } else if (dataLabel === 'PAGE') {
        spectrum.page = dataValue.trim();
        spectrum.pageValue = parseFloat(dataValue.replace(/^.*=/, ''));
        spectrum.pageSymbol = spectrum.page.replace(/[=].*/, '');
        var pageSymbolIndex = ntuples.symbol.indexOf(spectrum.pageSymbol);
        var unit = '';
        if (ntuples.units && ntuples.units[pageSymbolIndex]) {
          unit = ntuples.units[pageSymbolIndex];
        }
        if (result.indirectFrequency && unit !== 'PPM') {
          spectrum.pageValue /= result.indirectFrequency;
        }
      } else if (dataLabel === 'RETENTIONTIME') {
        spectrum.pageValue = parseFloat(dataValue);
      } else if (isMSField(dataLabel)) {
        spectrum[convertMSFieldToLabel(dataLabel)] = dataValue;
      } else if (dataLabel === 'SAMPLEDESCRIPTION') {
        spectrum.sampleDescription = dataValue;
      }
      if (dataLabel.match(options.keepRecordsRegExp)) {
        result.info[dataLabel] = dataValue.trim();
      }
    }

    if (result.profiling) {
      result.profiling.push({
        action: 'Finished parsing',
        time: Date.now() - start
      });
    }

    if (Object.keys(ntuples).length > 0) {
      var newNtuples = [];
      var keys = Object.keys(ntuples);
      for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var values = ntuples[key];
        for (let j = 0; j < values.length; j++) {
          if (!newNtuples[j]) newNtuples[j] = {};
          newNtuples[j][key] = values[j];
        }
      }
      result.ntuples = newNtuples;
    }

    if (result.twoD && wantXY) {
      add2D(result, options);
      if (result.profiling) {
        result.profiling.push({
          action: 'Finished countour plot calculation',
          time: Date.now() - start
        });
      }
      if (!options.keepSpectra) {
        delete result.spectra;
      }
    }

    if (options.chromatogram) {
      options.xy = true;
    }

    if (options.xy && wantXY) {
      // the spectraData should not be a oneD array but an object with x and y
      if (spectra.length > 0) {
        for (let i = 0; i < spectra.length; i++) {
          spectrum = spectra[i];
          if (spectrum.data.length > 0) {
            for (let j = 0; j < spectrum.data.length; j++) {
              var data = spectrum.data[j];
              var newData = {
                x: new Array(data.length / 2),
                y: new Array(data.length / 2)
              };
              for (var k = 0; k < data.length; k = k + 2) {
                newData.x[k / 2] = data[k];
                newData.y[k / 2] = data[k + 1];
              }
              spectrum.data[j] = newData;
            }
          }
        }
      }
    }

    // maybe it is a GC (HPLC) / MS. In this case we add a new format
    if (options.chromatogram) {
      if (result.spectra.length > 1) {
        complexChromatogram(result);
      } else {
        simpleChromatogram(result);
      }
      if (result.profiling) {
        result.profiling.push({
          action: 'Finished chromatogram calculation',
          time: Date.now() - start
        });
      }
    }

    if (result.profiling) {
      result.profiling.push({
        action: 'Total time',
        time: Date.now() - start
      });
    }

    return result;
  }

  function convertMSFieldToLabel(value) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function isMSField(dataLabel) {
    return GC_MS_FIELDS.indexOf(dataLabel) !== -1;
  }

  function complexChromatogram(result) {
    var spectra = result.spectra;
    var length = spectra.length;
    var chromatogram = {
      times: new Array(length),
      series: {
        ms: {
          dimension: 2,
          data: new Array(length)
        }
      }
    };

    var existingGCMSFields = [];
    for (let i = 0; i < GC_MS_FIELDS.length; i++) {
      var label = convertMSFieldToLabel(GC_MS_FIELDS[i]);
      if (spectra[0][label]) {
        existingGCMSFields.push(label);
        chromatogram.series[label] = {
          dimension: 1,
          data: new Array(length)
        };
      }
    }

    for (let i = 0; i < length; i++) {
      var spectrum = spectra[i];
      chromatogram.times[i] = spectrum.pageValue;
      for (let j = 0; j < existingGCMSFields.length; j++) {
        chromatogram.series[existingGCMSFields[j]].data[i] = parseFloat(
          spectrum[existingGCMSFields[j]]
        );
      }
      if (spectrum.data) {
        chromatogram.series.ms.data[i] = [
          spectrum.data[0].x,
          spectrum.data[0].y
        ];
      }
    }
    result.chromatogram = chromatogram;
  }

  function simpleChromatogram(result) {
    var data = result.spectra[0].data[0];
    result.chromatogram = {
      times: data.x.slice(),
      series: {
        intensity: {
          dimension: 1,
          data: data.y.slice()
        }
      }
    };
  }

  function prepareSpectrum(result, spectrum) {
    if (!spectrum.xFactor) spectrum.xFactor = 1;
    if (!spectrum.yFactor) spectrum.yFactor = 1;
    if (spectrum.observeFrequency) {
      if (spectrum.xUnit && spectrum.xUnit.toUpperCase() === 'HZ') {
        spectrum.xUnit = 'PPM';
        spectrum.xFactor = spectrum.xFactor / spectrum.observeFrequency;
        spectrum.firstX = spectrum.firstX / spectrum.observeFrequency;
        spectrum.lastX = spectrum.lastX / spectrum.observeFrequency;
        spectrum.deltaX = spectrum.deltaX / spectrum.observeFrequency;
      }
    }
    if (spectrum.shiftOffsetVal) {
      var shift = spectrum.firstX - spectrum.shiftOffsetVal;
      spectrum.firstX = spectrum.firstX - shift;
      spectrum.lastX = spectrum.lastX - shift;
    }
  }

  function getMedian(data) {
    data = data.sort(compareNumbers);
    var l = data.length;
    return data[Math.floor(l / 2)];
  }

  function compareNumbers(a, b) {
    return a - b;
  }

  function convertTo3DZ(spectra) {
    var minZ = spectra[0].data[0][0];
    var maxZ = minZ;
    var ySize = spectra.length;
    var xSize = spectra[0].data[0].length / 2;
    var z = new Array(ySize);
    for (let i = 0; i < ySize; i++) {
      z[i] = new Array(xSize);
      var xVector = spectra[i].data[0];
      for (let j = 0; j < xSize; j++) {
        var value = xVector[j * 2 + 1];
        z[i][j] = value;
        if (value < minZ) minZ = value;
        if (value > maxZ) maxZ = value;
      }
    }
    return {
      z: z,
      minX: spectra[0].data[0][0],
      maxX: spectra[0].data[0][spectra[0].data[0].length - 2], // has to be -2 because it is a 1D array [x,y,x,y,...]
      minY: spectra[0].pageValue,
      maxY: spectra[ySize - 1].pageValue,
      minZ: minZ,
      maxZ: maxZ,
      noise: getMedian(z[0].map(Math.abs))
    };
  }

  function add2D(result, options) {
    var zData = convertTo3DZ(result.spectra);
    if (!options.noContour) {
      result.contourLines = generateContourLines(zData, options);
      delete zData.z;
    }
    result.minMax = zData;
  }

  function generateContourLines(zData, options) {
    var noise = zData.noise;
    var z = zData.z;
    var povarHeight0, povarHeight1, povarHeight2, povarHeight3;
    var isOver0, isOver1, isOver2, isOver3;
    var nbSubSpectra = z.length;
    var nbPovars = z[0].length;
    var pAx, pAy, pBx, pBy;

    var x0 = zData.minX;
    var xN = zData.maxX;
    var dx = (xN - x0) / (nbPovars - 1);
    var y0 = zData.minY;
    var yN = zData.maxY;
    var dy = (yN - y0) / (nbSubSpectra - 1);
    var minZ = zData.minZ;
    var maxZ = zData.maxZ;

    // System.out.prvarln('y0 '+y0+' yN '+yN);
    // -------------------------
    // Povars attribution
    //
    // 0----1
    // |  / |
    // | /  |
    // 2----3
    //
    // ---------------------d------

    var iter = options.nbContourLevels * 2;
    var contourLevels = new Array(iter);
    var lineZValue;
    for (var level = 0; level < iter; level++) {
      // multiply by 2 for positif and negatif
      var contourLevel = {};
      contourLevels[level] = contourLevel;
      var side = level % 2;
      var factor =
        (maxZ - options.noiseMultiplier * noise) *
        Math.exp((level >> 1) - options.nbContourLevels);
      if (side === 0) {
        lineZValue = factor + options.noiseMultiplier * noise;
      } else {
        lineZValue = 0 - factor - options.noiseMultiplier * noise;
      }
      var lines = [];
      contourLevel.zValue = lineZValue;
      contourLevel.lines = lines;

      if (lineZValue <= minZ || lineZValue >= maxZ) continue;

      for (var iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
        var subSpectra = z[iSubSpectra];
        var subSpectraAfter = z[iSubSpectra + 1];
        for (var povar = 0; povar < nbPovars - 1; povar++) {
          povarHeight0 = subSpectra[povar];
          povarHeight1 = subSpectra[povar + 1];
          povarHeight2 = subSpectraAfter[povar];
          povarHeight3 = subSpectraAfter[povar + 1];

          isOver0 = povarHeight0 > lineZValue;
          isOver1 = povarHeight1 > lineZValue;
          isOver2 = povarHeight2 > lineZValue;
          isOver3 = povarHeight3 > lineZValue;

          // Example povar0 is over the plane and povar1 and
          // povar2 are below, we find the varersections and add
          // the segment
          if (isOver0 !== isOver1 && isOver0 !== isOver2) {
            pAx =
              povar +
              (lineZValue - povarHeight0) / (povarHeight1 - povarHeight0);
            pAy = iSubSpectra;
            pBx = povar;
            pBy =
              iSubSpectra +
              (lineZValue - povarHeight0) / (povarHeight2 - povarHeight0);
            lines.push(pAx * dx + x0);
            lines.push(pAy * dy + y0);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          }
          // remove push does not help !!!!
          if (isOver3 !== isOver1 && isOver3 !== isOver2) {
            pAx = povar + 1;
            pAy =
              iSubSpectra +
              1 -
              (lineZValue - povarHeight3) / (povarHeight1 - povarHeight3);
            pBx =
              povar +
              1 -
              (lineZValue - povarHeight3) / (povarHeight2 - povarHeight3);
            pBy = iSubSpectra + 1;
            lines.push(pAx * dx + x0);
            lines.push(pAy * dy + y0);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          }
          // test around the diagonal
          if (isOver1 !== isOver2) {
            pAx =
              (povar +
                1 -
                (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) *
                dx +
              x0;
            pAy =
              (iSubSpectra +
                (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) *
                dy +
              y0;
            if (isOver1 !== isOver0) {
              pBx =
                povar +
                1 -
                (lineZValue - povarHeight1) / (povarHeight0 - povarHeight1);
              pBy = iSubSpectra;
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }
            if (isOver2 !== isOver0) {
              pBx = povar;
              pBy =
                iSubSpectra +
                1 -
                (lineZValue - povarHeight2) / (povarHeight0 - povarHeight2);
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }
            if (isOver1 !== isOver3) {
              pBx = povar + 1;
              pBy =
                iSubSpectra +
                (lineZValue - povarHeight1) / (povarHeight3 - povarHeight1);
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }
            if (isOver2 !== isOver3) {
              pBx =
                povar +
                (lineZValue - povarHeight2) / (povarHeight3 - povarHeight2);
              pBy = iSubSpectra + 1;
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }
          }
        }
      }
    }

    return {
      minX: zData.minX,
      maxX: zData.maxX,
      minY: zData.minY,
      maxY: zData.maxY,
      segments: contourLevels
    };
  }

  function fastParseXYData(spectrum, value) {
    // TODO need to deal with result
    //  console.log(value);
    // we check if deltaX is defined otherwise we calculate it

    var yFactor = spectrum.yFactor;
    var deltaX = spectrum.deltaX;

    spectrum.isXYdata = true;
    // TODO to be improved using 2 array {x:[], y:[]}
    var currentData = [];
    spectrum.data = [currentData];

    var currentX = spectrum.firstX;
    var currentY = spectrum.firstY;

    // we skip the first line
    //
    var endLine = false;
    var ascii;
    let i = 0;
    for (; i < value.length; i++) {
      ascii = value.charCodeAt(i);
      if (ascii === 13 || ascii === 10) {
        endLine = true;
      } else {
        if (endLine) break;
      }
    }

    // we proceed taking the i after the first line
    var newLine = true;
    var isDifference = false;
    var isLastDifference = false;
    var lastDifference = 0;
    var isDuplicate = false;
    var inComment = false;
    var currentValue = 0;
    var isNegative = false;
    var inValue = false;
    var skipFirstValue = false;
    var decimalPosition = 0;
    for (; i <= value.length; i++) {
      if (i === value.length) ascii = 13;
      else ascii = value.charCodeAt(i);
      if (inComment) {
        // we should ignore the text if we are after $$
        if (ascii === 13 || ascii === 10) {
          newLine = true;
          inComment = false;
        }
      } else {
        // when is it a new value ?
        // when it is not a digit, . or comma
        // it is a number that is either new or we continue
        if (ascii <= 57 && ascii >= 48) {
          // a number
          inValue = true;
          if (decimalPosition > 0) {
            currentValue += (ascii - 48) / Math.pow(10, decimalPosition++);
          } else {
            currentValue *= 10;
            currentValue += ascii - 48;
          }
        } else if (ascii === 44 || ascii === 46) {
          // a "," or "."
          inValue = true;
          decimalPosition++;
        } else {
          if (inValue) {
            // need to process the previous value
            if (newLine) {
              newLine = false; // we don't check the X value
              // console.log("NEW LINE",isDifference, lastDifference);
              // if new line and lastDifference, the first value is just a check !
              // that we don't check ...
              if (isLastDifference) skipFirstValue = true;
            } else {
              // need to deal with duplicate and differences
              if (skipFirstValue) {
                skipFirstValue = false;
              } else {
                if (isDifference) {
                  lastDifference = isNegative ? 0 - currentValue : currentValue;
                  isLastDifference = true;
                  isDifference = false;
                }
                var duplicate = isDuplicate ? currentValue - 1 : 1;
                for (var j = 0; j < duplicate; j++) {
                  if (isLastDifference) {
                    currentY += lastDifference;
                  } else {
                    currentY = isNegative ? 0 - currentValue : currentValue;
                  }
                  currentData.push(currentX);
                  currentData.push(currentY * yFactor);
                  currentX += deltaX;
                }
              }
            }
            isNegative = false;
            currentValue = 0;
            decimalPosition = 0;
            inValue = false;
            isDuplicate = false;
          }

          // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
          if (ascii < 74 && ascii > 63) {
            inValue = true;
            isLastDifference = false;
            currentValue = ascii - 64;
          } else if (ascii > 96 && ascii < 106) {
            // negative SQZ digits a b c d e f g h i (ascii 97-105)
            inValue = true;
            isLastDifference = false;
            currentValue = ascii - 96;
            isNegative = true;
          } else if (ascii === 115) {
            // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
            inValue = true;
            isDuplicate = true;
            currentValue = 9;
          } else if (ascii > 82 && ascii < 91) {
            inValue = true;
            isDuplicate = true;
            currentValue = ascii - 82;
          } else if (ascii > 73 && ascii < 83) {
            // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
            inValue = true;
            isDifference = true;
            currentValue = ascii - 73;
          } else if (ascii > 105 && ascii < 115) {
            // negative DIF digits j k l m n o p q r (ascii 106-114)
            inValue = true;
            isDifference = true;
            currentValue = ascii - 105;
            isNegative = true;
          } else if (ascii === 36 && value.charCodeAt(i + 1) === 36) {
            // $ sign, we need to check the next one
            inValue = true;
            inComment = true;
          } else if (ascii === 37) {
            // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
            inValue = true;
            isDifference = true;
            currentValue = 0;
            isNegative = false;
          } else if (ascii === 45) {
            // a "-"
            // check if after there is a number, decimal or comma
            var ascii2 = value.charCodeAt(i + 1);
            if (
              (ascii2 >= 48 && ascii2 <= 57) ||
              ascii2 === 44 ||
              ascii2 === 46
            ) {
              inValue = true;
              if (!newLine) isLastDifference = false;
              isNegative = true;
            }
          } else if (ascii === 13 || ascii === 10) {
            newLine = true;
            inComment = false;
          }
          // and now analyse the details ... space or tabulation
          // if "+" we just don't care
        }
      }
    }
  }

  function parseXYA(spectrum, value) {
    var removeSymbolRegExp = /(\(+|\)+|<+|>+|\s+)/g;

    spectrum.isXYAdata = true;
    var values;
    var currentData = [];
    spectrum.data = [currentData];

    var lines = value.split(/,? *,?[;\r\n]+ */);

    for (let i = 1; i < lines.length; i++) {
      values = lines[i]
        .trim()
        .replace(removeSymbolRegExp, '')
        .split(',');
      currentData.push(parseFloat(values[0]));
      currentData.push(parseFloat(values[1]));
    }
  }

  function parsePeakTable(spectrum, value, result) {
    var removeCommentRegExp = /\$\$.*/;
    var peakTableSplitRegExp = /[,\t ]+/;

    spectrum.isPeaktable = true;
    var values;
    var currentData = [];
    spectrum.data = [currentData];

    // counts for around 20% of the time
    var lines = value.split(/,? *,?[;\r\n]+ */);

    for (let i = 1; i < lines.length; i++) {
      values = lines[i]
        .trim()
        .replace(removeCommentRegExp, '')
        .split(peakTableSplitRegExp);
      if (values.length % 2 === 0) {
        for (let j = 0; j < values.length; j = j + 2) {
          // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
          currentData.push(parseFloat(values[j]) * spectrum.xFactor);
          currentData.push(parseFloat(values[j + 1]) * spectrum.yFactor);
        }
      } else {
        result.logs.push(`Format error: ${values}`);
      }
    }
  }

  return convert;
}

var convert = getConverter();

function JcampConverter(input, options, useWorker) {
  if (typeof options === 'boolean') {
    useWorker = options;
    options = {};
  }
  if (useWorker) {
    return postToWorker(input, options);
  } else {
    return convert(input, options);
  }
}

var stamps = {};
var worker;

function postToWorker(input, options) {
  if (!worker) {
    createWorker();
  }
  return new Promise(function (resolve) {
    var stamp = `${Date.now()}${Math.random()}`;
    stamps[stamp] = resolve;
    worker.postMessage(
      JSON.stringify({
        stamp: stamp,
        input: input,
        options: options
      })
    );
  });
}

function createWorker() {
  var workerURL = URL.createObjectURL(
    new Blob(
      [`var getConverter =${getConverter.toString()};var convert = getConverter(); onmessage = function (event) { var data = JSON.parse(event.data); postMessage(JSON.stringify({stamp: data.stamp, output: convert(data.input, data.options)})); };`],
      { type: 'application/javascript' }
    )
  );
  worker = new Worker(workerURL);
  URL.revokeObjectURL(workerURL);
  worker.addEventListener('message', function (event) {
    var data = JSON.parse(event.data);
    var stamp = data.stamp;
    if (stamps[stamp]) {
      stamps[stamp](data.output);
    }
  });
}

function createTree(jcamp, options = {}) {
  const { flatten = false } = options;
  if (typeof jcamp !== 'string') {
    throw new TypeError('the JCAMP should be a string');
  }

  let lines = jcamp.split(/[\r\n]+/);
  let flat = [];
  let stack = [];
  let result = [];
  let current;
  let ntupleLevel = 0;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    if (line.substring(0, 9) === '##NTUPLES') {
      ntupleLevel++;
    }

    if (line.substring(0, 7) === '##TITLE') {
      let title = [line.substring(8).trim()];
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith('##')) {
          break;
        } else {
          title.push(lines[j].trim());
        }
      }
      stack.push({
        title: title.join('\n'),
        jcamp: `${line}\n`,
        children: []
      });
      current = stack[stack.length - 1];
      flat.push(current);
    } else if (line.substring(0, 5) === '##END' && ntupleLevel === 0) {
      current.jcamp += `${line}\n`;
      var finished = stack.pop();
      if (stack.length !== 0) {
        current = stack[stack.length - 1];
        current.children.push(finished);
      } else {
        current = undefined;
        result.push(finished);
      }
    } else if (current && current.jcamp) {
      current.jcamp += `${line}\n`;
      var match = line.match(/^##(.*?)=(.+)/);
      if (match) {
        var dataLabel = match[1].replace(/[ _-]/g, '').toUpperCase();
        if (dataLabel === 'DATATYPE') {
          current.dataType = match[2].trim();
        }
      }
    }

    if (line.substring(0, 5) === '##END' && ntupleLevel > 0) {
      ntupleLevel--;
    }
  }
  if (flatten) {
    flat.forEach((entry) => {
      entry.children = undefined;
    });
    return flat;
  } else {
    return result;
  }
}

module.exports = {
  convert: JcampConverter,
  createTree: createTree
};
