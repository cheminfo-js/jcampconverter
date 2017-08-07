'use strict';

var fs = require('fs');
var join = require('path').join;
var convert = require('../').convert;

var datafolder = join(__dirname, '../__tests__/data');

module.exports = function (filename, options) {
    var jcamp = fs.readFileSync(join(datafolder, filename), 'utf-8');
    return function () {
        convert(jcamp, options);
    }
};
