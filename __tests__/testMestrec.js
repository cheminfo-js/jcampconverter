'use strict';

const Converter = require('../src/index');
const fs = require('fs');
const route = __dirname + '/data/mestrec/';

describe('Test from Mestrec Jcamp generator with assignment', function () {
    it('real example', function () {
        var result = Converter.createTree(fs.readFileSync(route + 'mestrec.jdx').toString());
        expect(result.length).toBe(1);
    });

    it('simple case', function () {
        var result = Converter.createTree(fs.readFileSync(route + 'simple.jdx').toString());
        expect(result).toEqual([{
            title: 'first level 1',
            dataType: 'first',
            jcamp: '##TITLE= first level 1\n##DATATYPE=\tfirst\n',
            children: [{
                title: 'second level 1',
                dataType: 'second',
                jcamp: '##TITLE= second level 1\n##DATATYPE= second\n',
                children: []
            }, {
                title: 'second level 2',
                dataType: 'second',
                jcamp: '##TITLE= second level 2\n##DATATYPE= second\n',
                children: [{
                    title: 'third level',
                    jcamp: '##TITLE= third level\n',
                    children: []
                }]
            }]
        }, {
            title: 'first level 2',
            dataType: 'first',
            jcamp: '##TITLE= first level 2\n##DATATYPE=\tfirst\n',
            children: []
        }]);
    });
});
