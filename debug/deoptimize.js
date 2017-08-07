'use strict';
debugger;
var fs = require('fs');
var join = require('path').join;
var convert = require('../').convert;

var datafolder = join(__dirname, '../__tests__/data');

var data = fs.readFileSync(join(datafolder, 'indometacin/cosy.dx'), 'utf8');

console.log('convert');
convert(data);
convert(data);
convert(data);
convert(data);
convert(data);
convert(data);
convert(data);
convert(data);
convert(data);
convert(data);
