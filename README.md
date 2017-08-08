# JCAMP converter

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][codecov-image]][codecov-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]
  
Parse and convert JCAMP data

## Installation

### Node JS

`npm install jcampconverter`

### Bower

`bower install jcampconverter`

## Methods

### convert(jcamp, [options], [useWorker])

Converts the `jcamp` using `options`.  
Returns an object with information about the converted file and uncompressed spectra data.

__Arguments__

* `jcamp` - String containing the JCAMP data
* `options` - Object with options to pass to the converter
* `useWorker` - Browser only: convert in a web worker (default: false). If this option is set to true, it will return a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

__Options__

* keepRecordsRegExp - regexp to select which records should be placed in the info field. By default: :/^$/} (nothing is kept)
* xy - instead of creating a 1D array containing [x1,y1,x2,y2, ...] create an object: {x:[], y:[]}
* withoutXY - do not parse XYDATA or PEAKTABLE fields. Useful to only extract metadata fields (combine this option with `keepRecordsRegExp`)
* chromatogram - use the new GC/MS data format output (default: false)

2D NMR options:
* noContour - if true, the contour levels will not be generated. Instead the raw data will be available in `result.minMax.z` (default: false)
* nbContourLevels - number of contour levels to use in each positive and negative sides (default: 7)
* noiseMultiplier - default: 5
* keepSpectra - Generate array for 2D NMR spectra (default: false)

### Use as a module

#### Node.JS

```javascript
var converter = require('jcampconverter');
var jcamp = require('fs').readFileSync('path/to/jcamp.dx').toString();

var result = converter.convert(jcamp);
```

#### AMD

```javascript
require(['jcampconverter'], function(JcampConverter) {
    // Use the worker
    JcampConverter.convert(jcamp, true).then(function (result) {
        // Do something with result
    });
});
```

## Testing and build

```
npm install
npm test
npm run build
```

## Benchmark

```
npm run benchmark
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/jcampconverter.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/jcampconverter
[travis-image]: https://img.shields.io/travis/cheminfo-js/jcampconverter/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo-js/jcampconverter
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo-js/jcampconverter.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/cheminfo-js/jcampconverter
[david-image]: https://img.shields.io/david/cheminfo-js/jcampconverter.svg?style=flat-square
[david-url]: https://david-dm.org/cheminfo-js/jcampconverter
[download-image]: https://img.shields.io/npm/dm/jcampconverter.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/jcampconverter
