'use strict';

var Converter = require('..');
var fs = require('fs');

function checkJcamp(filename, label, options) {

    var result = Converter.convert(fs.readFileSync(__dirname + "/../__tests__" + filename).toString(), options);

    console.log("===================",label)
    console.log(result.profiling);

};



var options = {
    fastParse: true
};


//checkJcamp('/data/compression/jcamp-fix.dx', "Compression fixed", options);
//checkJcamp('/data/compression/jcamp-packed.dx', "Compression packed", options);
//checkJcamp('/data/compression/jcamp-squeezed.dx', "Compression squeezed", options);
//checkJcamp('/data/compression/jcamp-difdup.dx', "Compression difdup", options);
//for (var i=0; i<5; i++) {
    checkJcamp('/data/indometacin/hmbc.dx', "HMBC", options);
//}


