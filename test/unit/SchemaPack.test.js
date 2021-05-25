const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  validWSDLs20 = 'test/data/validWSDLs20',
  fs = require('fs'),
  getAllTransactions = require('../../lib/utils/getAllTransactions').getAllTransactions,
  async = require('async'),
  optionIds = [
    'folderStrategy',
    'validateHeader',
    'validationPropertiesToIgnore',
    'ignoreUnresolvedVariables'
  ];

describe('SchemaPack convert unit test WSDL 1.1', function () {
  var validWSDLsFolder = fs.readdirSync(validWSDLs);
  async.each(validWSDLsFolder, function (file) {
    it('Should get an object representing PM Collection from ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      schemaPack.convert((error, result) => {
        expect(error, error ? error.stack : '').to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
        if (file === 'failing.wsdl') {
          fs.writeFileSync('coll.json', JSON.stringify(result.output[0].data));
        }
      });
    });
  });

  it('Should get an object representing PM Collection from a file sending the path', function () {
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
      expect(result.output[0].data.info.name).to.equal('calculator-soap11and12.wsdl');
    });
  });

  it('Should get an object representing PM Collection from a file sending string', function () {
    const
      VALID_WSDL_PATH = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8'),
      schemaPack = new SchemaPack({
        type: 'string',
        data: VALID_WSDL_PATH
      }, {});

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data.info.name).to.equal('http://tempuri.org/');
    });
  });

  it('Should get an error when input is not file nor string', function () {
    const
      schemaPack = new SchemaPack({
        type: 'string',
        data: '<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"</wsdl:definitions>'
      }, {});

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
    });
  });
});

describe('SchemaPack convert unit test WSDL 1.1 with options', function () {

  it('Should get an object representing PM Collection with two folders', function () {
    let fileContent = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8');
    const options = { folderStrategy: 'Port/Endpoint' },
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

  it('Should get an object representing PM Collection with one folder', function () {
    let fileContent = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8');
    const options = { folderStrategy: 'Service' },
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
      expect(result.output[0].data.item.length).to.equal(1);
      expect(result.output[0].data.item[0].name).to.equal('Calculator');

    });
  });

  it('Should get an object representing PM Collection without folder', function () {
    let fileContent = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8');
    const options = { folderStrategy: 'No folders' },
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
      expect(result.output[0].data.item.length).to.equal(8);

    });
  });

});

describe('SchemaPack convert unit test WSDL 2.0', function () {
  var validWSDLsFolder = fs.readdirSync(validWSDLs20);
  async.each(validWSDLsFolder, function (file) {
    it('Should get an object representing PM Collection from ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs20 + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      schemaPack.convert((error, result) => {
        expect(error, error ? error.stack : '').to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
      });
    });
  });
});

describe('SchemaPack getOptions', function () {

  it('must have a valid structure', function () {
    const options = SchemaPack.getOptions();
    options.forEach((option) => {
      expect(option).to.have.property('name');
      expect(option).to.have.property('id');
      expect(option).to.have.property('type');
      expect(option).to.have.property('default');
      expect(option).to.have.property('description');
    });
  });

  it('Should return external options when called without parameters', function () {
    SchemaPack.getOptions().forEach((option) => {
      expect(option.id).to.be.oneOf(optionIds);
    });
  });

  it('Should return external options when called with mode = document', function () {
    const options = SchemaPack.getOptions('document');
    expect(options).to.be.an('array');
    expect(options.length).to.eq(4);
  });

  it('Should return external options when called with mode = use', function () {
    const options = SchemaPack.getOptions('use');
    expect(options).to.be.an('object');
    expect(options).to.haveOwnProperty('folderStrategy');
    expect(options.folderStrategy).to.eq('Port/Endpoint');
  });

  it('Should return external options when called with criteria usage conversion', function () {
    SchemaPack.getOptions({
      usage: ['CONVERSION']
    }).forEach((option) => {
      expect(option.id).to.be.oneOf(optionIds);
      expect(option.usage).to.include('CONVERSION');
    });
  });

  it('Should return external options when called with criteria usage validation', function () {
    SchemaPack.getOptions({
      usage: ['VALIDATION']
    }).forEach((option) => {
      expect(option.id).to.be.oneOf(optionIds);
      expect(option.usage).to.include('VALIDATION');
    });
  });

  it('Should return external options when called with mode use and usage conversion', function () {
    const options = SchemaPack.getOptions('use', {
      usage: ['CONVERSION']
    });
    expect(options).to.be.an('object');
    expect(options).to.haveOwnProperty('folderStrategy');
    expect(options.folderStrategy).to.eq('Port/Endpoint');
  });

  it('Should return external options when called with mode document and usage conversion', function () {
    const options = SchemaPack.getOptions('document', {
      usage: ['CONVERSION']
    });
    expect(options).to.be.an('array');
    expect(options.length).to.eq(1);
  });

  it('Should return external options when called with mode document and usage not an object', function () {
    const options = SchemaPack.getOptions('document', 2);
    expect(options).to.be.an('array');
    expect(options.length).to.eq(4);
  });

  it('Should return default empty array in validationPropertiesToIgnore', function () {
    const options = SchemaPack.getOptions('use', {
      usage: ['VALIDATION']
    });
    expect(options).to.be.an('object');
    expect(options).to.haveOwnProperty('validationPropertiesToIgnore');
    expect(options).to.haveOwnProperty('ignoreUnresolvedVariables');
    expect(options.validationPropertiesToIgnore).to.be.empty;
  });

});

describe('validateTransaction method', function () {
  const notIdCollectionItems = require('./../data/transactionsValidation/notIdCollectionItems.json');
  it('Should return an error when transactions id is null', function () {
    const
      VALID_WSDL_PATH = validWSDLs + '/calculator-soap11and12.wsdl',
      schemaPack = new SchemaPack({
        type: 'file',
        data: VALID_WSDL_PATH
      }, {});
    schemaPack.validateTransaction(notIdCollectionItems, (error) => {
      expect(error.message).to.equal('Invalid syntax provided for requestList');
    });
  });

  it('Should return no missmatches when entry is valid', function () {
    const
      VALID_WSDL_PATH = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8'),
      schemaPack = new SchemaPack({
        type: 'string',
        data: VALID_WSDL_PATH
      }, {});

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');

      let historyRequests = [];
      getAllTransactions(result.output[0].data, historyRequests);

      // postman application should substitute variables
      historyRequests.forEach((historyRequest) => {
        historyRequest.request.url.host = 'http://www.dneonline.com';
      });

      schemaPack.validateTransaction(historyRequests, (error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
      });
    });
  });
});

describe('getMetaData method', function () {
  it('Should return the metadata for the valid input file', function () {
    const
      VALID_WSDL_PATH = validWSDLs + '/calculator-soap11and12.wsdl',
      schemaPack = new SchemaPack({
        type: 'file',
        data: VALID_WSDL_PATH
      }, {});
    schemaPack.getMetaData(function (x, y) {
      expect(x).to.eq(null);
      expect(y.name).to.eq('calculator-soap11and12.wsdl');
    });
  });

  it('Should return the metadata for the valid input string', function () {
    const
      schemaPack = new SchemaPack({
        type: 'string',
        data: '<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"</wsdl:definitions>'
      }, {});
    schemaPack.getMetaData(function (x, y) {
      expect(x).to.eq(null);
      expect(y.name).to.eq('Converted from WSDL');
    });
  });

  it('Should return the validation errors if there was', function () {
    const
      schemaPack = new SchemaPack({
        type: 'string',
        data: ''
      }, {});
    schemaPack.getMetaData(function (error, result) {
      expect(error).to.eq(null);
      expect(result.reason).to.eq('Input not provided');
    });
  });
});
