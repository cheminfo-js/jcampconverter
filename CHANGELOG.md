# Changelog

### [8.1.1](https://www.github.com/cheminfo/jcampconverter/compare/v8.1.0...v8.1.1) (2021-05-06)


### Bug Fixes

* bug in linked spectra and reference ([ec63494](https://www.github.com/cheminfo/jcampconverter/commit/ec63494433b865dc3ed7589763d32afbbc1d2c60))

## [8.1.0](https://www.github.com/cheminfo/jcampconverter/compare/v8.0.2...v8.1.0) (2021-05-05)


### Features

* remove the cheminfo hack that was parsing cheminfo meta ([1fe8dd5](https://www.github.com/cheminfo/jcampconverter/commit/1fe8dd51c97a98c65818c4f4af712d6c377969e0))

### [8.0.2](https://www.github.com/cheminfo/jcampconverter/compare/v8.0.1...v8.0.2) (2021-04-28)


### Bug Fixes

* update ensure-text library ([fbda58e](https://www.github.com/cheminfo/jcampconverter/commit/fbda58eee6fc127141930e9c160b468ddeedf23b))

### [8.0.1](https://www.github.com/cheminfo/jcampconverter/compare/v8.0.0...v8.0.1) (2021-04-28)


### Bug Fixes

* noesy without nucleus ([eb9a7b7](https://www.github.com/cheminfo/jcampconverter/commit/eb9a7b7faf13dfa52e1c78b7ec638efcf18ee364))

## [8.0.0](https://www.github.com/cheminfo/jcampconverter/compare/v7.10.0...v8.0.0) (2021-04-27)


### ⚠ BREAKING CHANGES

* matrix for node CI 12, 14 and 16 and remove node 10 support

### Features

* jcamp may also be an ArrayBuffer and not only a string ([58b2a38](https://www.github.com/cheminfo/jcampconverter/commit/58b2a3813b8b368d4f72f13f65f086b1f321ce43))

## [7.10.0](https://www.github.com/cheminfo/jcampconverter/compare/v7.9.0...v7.10.0) (2021-04-27)


### Features

* If ##$cheminfo LDR, parsed the value as a JSON ([2c65658](https://www.github.com/cheminfo/jcampconverter/commit/2c65658331103f4552ffa7def310e695911424c3))

## [7.8.0](https://www.github.com/cheminfo/jcampconverter/compare/v7.7.0...v7.8.0) (2021-03-24)

### Features

* improve 2D noise detection by using the full 2D spectrum ([7607af3](https://www.github.com/cheminfo/jcampconverter/commit/7607af3940945d9e794bf926a09e2e90b4d9efdf))


### Bug Fixes

* update dependencies and readme ([65d11ec](https://www.github.com/cheminfo/jcampconverter/commit/65d11eca3b79ff84f28a0e48e7270fbc24242ae1))

## [7.7.0](https://www.github.com/cheminfo/jcampconverter/compare/v7.6.6...v7.7.0) (2021-02-10)


### Features

* ignore deltaX and calculate firstX-lastX / npoints ([8aff051](https://www.github.com/cheminfo/jcampconverter/commit/8aff051d7c095933e0f01ae171801a871a1e27cf))

### [7.6.6](https://www.github.com/cheminfo/jcampconverter/compare/v7.6.5...v7.6.6) (2021-01-18)


### Bug Fixes

* deal with 2D jcamp without all .nucleus ([3cf7cc0](https://www.github.com/cheminfo/jcampconverter/commit/3cf7cc0907866505f430f4cf359d3b6e0f711878))

### [7.6.5](https://www.github.com/cheminfo/jcampconverter/compare/v7.6.4...v7.6.5) (2020-10-27)


### Bug Fixes

* correct dynamic typing ([bdd061f](https://www.github.com/cheminfo/jcampconverter/commit/bdd061ff2fc2c905122ba0bb677891b47265c527))

### [7.6.4](https://www.github.com/cheminfo/jcampconverter/compare/v7.6.3...v7.6.4) (2020-10-27)


### Bug Fixes

* nmr-processing dependency ([797bc76](https://www.github.com/cheminfo/jcampconverter/commit/797bc767cc129ec6bdf16f74635cd2bd6fc28a41))

### [7.6.3](https://www.github.com/cheminfo/jcampconverter/compare/v7.6.2...v7.6.3) (2020-10-14)


### Bug Fixes

* remove worker from documentation ([9c47fe3](https://www.github.com/cheminfo/jcampconverter/commit/9c47fe31a7d3944fb17c01677f6e58be679cc474))

### [7.6.2](https://github.com/cheminfo/jcampconverter/compare/v7.6.1...v7.6.2) (2020-10-14)

## [7.3.1](https://github.com/cheminfo/jcampconverter/compare/v7.2.0...v7.3.1) (2020-06-24)


### Bug Fixes

* variables has always lowercase property ([32bc505](https://github.com/cheminfo/jcampconverter/commit/32bc505c61645430270b2a0eb09e7bff01460bf6))


### Features

* add data in variables ([dcd2966](https://github.com/cheminfo/jcampconverter/commit/dcd2966ed0de32e6e63207593c1a52bdc5986e49))
* apply NMR conversion to ppm as a postProcessing process ([dcd0ea9](https://github.com/cheminfo/jcampconverter/commit/dcd0ea96b63241afb11ffc5dea779571c4e4650b))



# [7.2.0](https://github.com/cheminfo/jcampconverter/compare/v7.1.0...v7.2.0) (2020-06-20)


### Features

* change xUnits for ntuples to add varname + unit ([92eae09](https://github.com/cheminfo/jcampconverter/commit/92eae094aedaf911a5437c8578a76679d6bb3ae9))



# [7.1.0](https://github.com/cheminfo/jcampconverter/compare/v7.0.0...v7.1.0) (2020-06-11)


### Bug Fixes

* rename xUnit and yUnit to xUnits and yUnits ([d50c6fe](https://github.com/cheminfo/jcampconverter/commit/d50c6feb0db96e2bd10bdae70b6fead0b30ea1c3))


### BREAKING CHANGES

* In the returned value the variables has been
renamed to xUnits and yUnits to keep the LDR of
the jcamp



# [7.0.0](https://github.com/cheminfo/jcampconverter/compare/v6.0.1...v7.0.0) (2020-06-11)



## [6.0.1](https://github.com/cheminfo/jcampconverter/compare/v6.0.0...v6.0.1) (2020-06-10)


### Bug Fixes

* improve 2d spectra discovery ([5a7c15a](https://github.com/cheminfo/jcampconverter/commit/5a7c15afbadb133d3ecb89d5e816354c0d207441))
* improve detection of 2d spectra ([02e966f](https://github.com/cheminfo/jcampconverter/commit/02e966f108578578fe717d259b16a7c933a0db44))
* ntuples separator must contain a comma ([3bbf182](https://github.com/cheminfo/jcampconverter/commit/3bbf1829acffeeed4a888fd502afdd6637d070b8))



# [6.0.0](https://github.com/cheminfo/jcampconverter/compare/v5.0.2...v6.0.0) (2020-06-10)


### Features

* add parsing of multivariable NTUPLE PEAKS ([872a43f](https://github.com/cheminfo/jcampconverter/commit/872a43fa9867b84247138bd939cd455c386e7e46))



## [5.0.2](https://github.com/cheminfo/jcampconverter/compare/v5.0.1...v5.0.2) (2020-04-08)



## [5.0.1](https://github.com/cheminfo/jcampconverter/compare/v5.0.0...v5.0.1) (2020-04-04)


### Bug Fixes

* 2d matrix minX / maxX ([447606d](https://github.com/cheminfo/jcampconverter/commit/447606df8a952d3c19dec3306d8aa2f09ee402b0))



# [5.0.0](https://github.com/cheminfo/jcampconverter/compare/v4.1.1...v5.0.0) (2020-04-04)


### Bug Fixes

* rollup and build ([eef5d66](https://github.com/cheminfo/jcampconverter/commit/eef5d66dbeccdfd907dc86ce1cd8aa1429a544f3))



## [4.1.1](https://github.com/cheminfo/jcampconverter/compare/v4.1.0...v4.1.1) (2020-04-02)


### Bug Fixes

* allow jcamp with no data ([4365d79](https://github.com/cheminfo/jcampconverter/commit/4365d79b16fa6f1651e6a2d4a1626107d0072e8a))



## [2.10.2](https://github.com/cheminfo/jcampconverter/compare/v2.10.1...v2.10.2) (2018-11-23)



<a name="2.9.1"></a>
## [2.9.1](https://github.com/cheminfo/jcampconverter/compare/v2.9.0...v2.9.1) (2017-10-19)



<a name="2.9.0"></a>
# [2.9.0](https://github.com/cheminfo/jcampconverter/compare/v2.8.0...v2.9.0) (2017-09-13)


### Features

* read mestrec file ([5e485f2](https://github.com/cheminfo/jcampconverter/commit/5e485f2))



<a name="2.8.0"></a>
# [2.8.0](https://github.com/cheminfo/jcampconverter/compare/v2.7.0...v2.8.0) (2017-08-09)


### Features

* change newGCMS to chromatogram ([1941f48](https://github.com/cheminfo/jcampconverter/commit/1941f48))



<a name="2.7.0"></a>
# [2.7.0](https://github.com/cheminfo/jcampconverter/compare/v2.6.0...v2.7.0) (2016-09-15)



<a name="2.6.0"></a>
# [2.6.0](https://github.com/cheminfo/jcampconverter/compare/v2.5.1...v2.6.0) (2016-07-11)


### Features

* add noContour option ([ab5ff6b](https://github.com/cheminfo/jcampconverter/commit/ab5ff6b))



<a name="2.5.1"></a>
## [2.5.1](https://github.com/cheminfo/jcampconverter/compare/v2.5.0...v2.5.1) (2016-06-27)


### Bug Fixes

* more wantXY checks ([c87a97d](https://github.com/cheminfo/jcampconverter/commit/c87a97d))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/cheminfo/jcampconverter/compare/v2.4.5...v2.5.0) (2016-06-27)



<a name="2.4.5"></a>
## [2.4.5](https://github.com/cheminfo/jcampconverter/compare/v2.4.4...v2.4.5) (2016-05-06)



<a name="2.4.4"></a>
## [2.4.4](https://github.com/cheminfo/jcampconverter/compare/v2.4.3...v2.4.4) (2016-05-06)



<a name="2.4.3"></a>
## [2.4.3](https://github.com/cheminfo/jcampconverter/compare/v2.4.2...v2.4.3) (2016-05-04)



<a name="2.4.2"></a>
## [2.4.2](https://github.com/cheminfo/jcampconverter/compare/v2.4.1...v2.4.2) (2016-05-04)



<a name="2.4.1"></a>
## [2.4.1](https://github.com/cheminfo/jcampconverter/compare/v2.4.0...v2.4.1) (2016-05-04)



<a name="2.4.0"></a>
# [2.4.0](https://github.com/cheminfo/jcampconverter/compare/v2.3.0...v2.4.0) (2016-05-04)



<a name="2.3.0"></a>
# [2.3.0](https://github.com/cheminfo/jcampconverter/compare/v2.2.2...v2.3.0) (2016-03-14)



<a name="2.2.2"></a>
## [2.2.2](https://github.com/cheminfo/jcampconverter/compare/v2.2.1...v2.2.2) (2016-03-07)



<a name="2.2.1"></a>
## [2.2.1](https://github.com/cheminfo/jcampconverter/compare/v2.2.0...v2.2.1) (2016-03-04)



<a name="2.2.0"></a>
# [2.2.0](https://github.com/cheminfo/jcampconverter/compare/v2.1.0...v2.2.0) (2016-02-25)



<a name="2.1.0"></a>
# [2.1.0](https://github.com/cheminfo/jcampconverter/compare/v2.0.9...v2.1.0) (2015-07-21)



<a name="2.0.9"></a>
## [2.0.9](https://github.com/cheminfo/jcampconverter/compare/v2.0.8...v2.0.9) (2015-05-29)



<a name="2.0.8"></a>
## [2.0.8](https://github.com/cheminfo/jcampconverter/compare/v2.0.7...v2.0.8) (2015-03-10)



<a name="2.0.7"></a>
## [2.0.7](https://github.com/cheminfo/jcampconverter/compare/v2.0.6...v2.0.7) (2015-03-06)



<a name="2.0.6"></a>
## [2.0.6](https://github.com/cheminfo/jcampconverter/compare/v2.0.5...v2.0.6) (2015-03-05)



<a name="2.0.5"></a>
## [2.0.5](https://github.com/cheminfo/jcampconverter/compare/v2.0.4...v2.0.5) (2015-02-19)



<a name="2.0.4"></a>
## [2.0.4](https://github.com/cheminfo/jcampconverter/compare/v2.0.3...v2.0.4) (2015-02-10)



<a name="2.0.3"></a>
## [2.0.3](https://github.com/cheminfo/jcampconverter/compare/v2.0.2...v2.0.3) (2015-01-23)



<a name="2.0.2"></a>
## [2.0.2](https://github.com/cheminfo/jcampconverter/compare/v2.0.1...v2.0.2) (2015-01-23)



<a name="2.0.1"></a>
## [2.0.1](https://github.com/cheminfo/jcampconverter/compare/v2.0.0...v2.0.1) (2014-10-20)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/cheminfo/jcampconverter/compare/v1.0.4...v2.0.0) (2014-10-20)



<a name="1.0.4"></a>
## [1.0.4](https://github.com/cheminfo/jcampconverter/compare/v1.0.3...v1.0.4) (2014-10-16)



<a name="1.0.3"></a>
## [1.0.3](https://github.com/cheminfo/jcampconverter/compare/v1.0.2...v1.0.3) (2014-10-06)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/cheminfo/jcampconverter/compare/v1.0.1...v1.0.2) (2014-10-06)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/cheminfo/jcampconverter/compare/v1.0.0...v1.0.1) (2014-10-06)



<a name="1.0.0"></a>
# 1.0.0 (2014-10-06)
