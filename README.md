# JCAMP converter

Parse and convert JCAMP data

<h3 align="center">

  <a href="https://www.zakodium.com">
    <img src="https://www.zakodium.com/brand/zakodium-logo-white.svg" width="50" alt="Zakodium logo" />
  </a>

  <p>
    Maintained by <a href="https://www.zakodium.com">Zakodium</a>
  </p>

  [![NPM version][npm-image]][npm-url]
  [![build status][ci-image]][ci-url]
  [![Test coverage][codecov-image]][codecov-url]
  [![npm download][download-image]][download-url]

</h3>

## Installation

### Node JS

`npm install jcampconverter`

### Bower

`bower install jcampconverter`

## Methods

### convert(jcamp, [options])

Converts the `jcamp` using `options`.  
Returns an object with information about the converted file and uncompressed spectra data.

**Arguments**

- `jcamp` - String containing the JCAMP data
- `options` - Object with options to pass to the converter

**Options**

- keepRecordsRegExp - regexp to select which records should be placed in the info field. By default: :/^\$/} (nothing is kept)
- withoutXY - do not parse XYDATA or PEAKTABLE fields. Useful to only extract metadata fields (combine this option with `keepRecordsRegExp`)
- chromatogram - use the new GC/MS data format output (default: false)
- canonicDataLabels - canonize data labels (uppercase) (default: true).
- canonicMetadataLabels - canonize data labels (uppercase) (default: false).
- dynamicTyping - When parsing field convert to number if a number (default: true)

2D NMR options:

- noContour - if true, the contour levels will not be generated. Instead the raw data will be available in `result.minMax.z` (default: false)
- nbContourLevels - number of contour levels to use in each positive and negative sides (default: 7)
- noiseMultiplier - default: 5
- keepSpectra - Generate array for 2D NMR spectra (default: false)

### Use as a module

#### Node.JS

```javascript
var converter = require('jcampconverter');
var jcamp = require('fs').readFileSync('path/to/jcamp.dx').toString();

var result = converter.convert(jcamp);

// if there is only one spectrum it will be in
console.log(result.flatten[0]);

// the converter will also keep the full jcamp tree
```

## Testing and build

```console
npm install
npm test
npm run build
```

## Benchmark

```console
npm run benchmark
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/jcampconverter.svg
[npm-url]: https://npmjs.org/package/jcampconverter
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/jcampconverter.svg
[codecov-url]: https://codecov.io/gh/cheminfo/jcampconverter
[ci-image]: https://github.com/cheminfo/jcampconverter/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/jcampconverter/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/jcampconverter.svg
[download-url]: https://npmjs.org/package/jcampconverter
