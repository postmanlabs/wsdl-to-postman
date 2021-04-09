const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  validWSDLs20 = 'test/data/validWSDLs20',
  fs = require('fs'),
  async = require('async');

describe('SchemaPack convert unit test WSDL 1.1', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs);
  async.each(validWSDLsFolder, function(file) {
    it('Should get an object representing PM Collection from ' + file, function() {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      schemaPack.convert((error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
        expect(result.output[0].data).to.be.an('object');
      });
    });
  });

  it('Should get an object representing PM Collection from a file sending the path', function() {
    const
      VALID_WSDL_PATH = validWSDLs + '/calculator-soap11and12.wsdl',
      schemaPack = new SchemaPack({
        type: 'file',
        data: VALID_WSDL_PATH
      }, {});

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data).to.be.an('object');
    });
  });
});

describe('SchemaPack convert unit test WSDL 1.1 with options', function() {

  it('Should get an object representing PM Collection with two folders', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8');
    const options = {
        folderStrategy: 'Port/Endpoint'
      },
      schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, options);

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data.item).to.be.an('array');
      expect(result.output[0].data.item.length).to.equal(2);
      expect(result.output[0].data.item[0].name).to.equal('CalculatorSoap');
      expect(result.output[0].data.item[1].name).to.equal('CalculatorSoap12');

    });
  });

  it('Should get an object representing PM Collection with one folder', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8');
    const options = {
        folderStrategy: 'Service'
      },
      schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, options);

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].data.item).to.be.an('array');
      expect(result.output[0].data.item.length).to.equal(1);
      expect(result.output[0].data.item[0].name).to.equal('Calculator');

    });
  });

  it('Should get an object representing PM Collection without folder', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8');
    const options = {
        folderStrategy: 'No folders'
      },
      schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, options);

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].data.item).to.be.an('array');
      expect(result.output[0].data.item.length).to.equal(8);

    });
  });

});

describe('SchemaPack convert unit test WSDL 2.0', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs20);
  async.each(validWSDLsFolder, function(file) {
    it('Should get an object representing PM Collection from ' + file, function() {
      let fileContent = fs.readFileSync(validWSDLs20 + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      schemaPack.convert((error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
        expect(result.output[0].data).to.be.an('object');
      });
    });
  });
});

describe('SchemaPack getOptions', function() {

  it('Should return external options when called without parameters', function() {
    const options = SchemaPack.getOptions();
    expect(options).to.be.an('array');
    expect(options.length).to.eq(1);
  });

  it('Should return external options when called with mode = document', function() {
    const options = SchemaPack.getOptions('document');
    expect(options).to.be.an('array');
    expect(options.length).to.eq(1);
  });

  it('Should return external options when called with mode = use', function() {
    const options = SchemaPack.getOptions('use');
    expect(options).to.be.an('object');
    expect(options).to.haveOwnProperty('folderStrategy');
    expect(options.folderStrategy).to.eq('Port/Endpoint');
  });

  it('Should return external options when called with criteria usage conversion', function() {
    const options = SchemaPack.getOptions({
      usage: ['CONVERSION']
    });
    expect(options).to.be.an('array');
    expect(options.length).to.eq(1);
  });

  it('Should return external options when called with criteria usage validation', function() {
    const options = SchemaPack.getOptions({
      usage: ['VALIDATION']
    });
    expect(options).to.be.an('array');
    expect(options.length).to.eq(0);
  });

  it('Should return external options when called with mode use and usage conversion', function() {
    const options = SchemaPack.getOptions('use', {
      usage: ['CONVERSION']
    });
    expect(options).to.be.an('object');
    expect(options).to.haveOwnProperty('folderStrategy');
    expect(options.folderStrategy).to.eq('Port/Endpoint');
  });

  it('Should return external options when called with mode document and usage conversion', function() {
    const options = SchemaPack.getOptions('document', {
      usage: ['CONVERSION']
    });
    expect(options).to.be.an('array');
    expect(options.length).to.eq(1);
  });

  it('Should return external options when called with mode document and usage not an object', function() {
    const options = SchemaPack.getOptions('document', 2);
    expect(options).to.be.an('array');
    expect(options.length).to.eq(1);
  });

});
