'use strict';

var Converter = require('..');
var fs = require('fs');

var filename='/__tests__/data/misc/gcms.jdx';

var result = Converter.convert(fs.readFileSync(__dirname + '/..' + filename).toString());

// console.log(result);