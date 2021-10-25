const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  validWSDLs20 = 'test/data/validWSDLs20',
  SEPARATED_FILES = '../data/separatedFiles',
  REMOTE_REFS = 'test/data/separatedFiles/remoteRefs',
  fs = require('fs'),
  getAllTransactionsFromCollection = require('../../lib/utils/getAllTransactions').getAllTransactionsFromCollection,
  async = require('async'),
  path = require('path'),
  {
    MULTIPLE_ROOT_FILES,
    MISSING_ROOT_FILE
  } = require('../../lib/constants/messageConstants'),
  optionIds = [
    'folderStrategy',
    'validateHeader',
    'validationPropertiesToIgnore',
    'ignoreUnresolvedVariables',
    'detailedBlobValidation',
    'showMissingInSchemaErrors',
    'suggestAvailableFixes',
    'resolveRemoteRefs',
    'sourceUrl',
    'indentCharacter'
  ],
  getOptions = require('../../lib/utils/options').getOptions;

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
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
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
      expect(result.output[0].data.info.name).to.equal('Calculator');
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
      expect(result.output[0].data.info.name).to.equal('Calculator');
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

  it('Should generate a valid message with global attributes with fixed property', function () {
    const
      VALID_WSDL_PATH = validWSDLs + '/attributeIssue.wsdl',
      schemaPack = new SchemaPack({
        type: 'file',
        data: VALID_WSDL_PATH
      }, {}),
      expectedBodyRaw = '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n' +
        '<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n' +
        '  <soap:Body>\n' +
        '    <Add xmlns=\"http://tempuri.org/\" version=\"v36.2\">\n' +
        '      <intA>100</intA>\n' +
        '      <intB>100</intB>\n' +
        '    </Add>\n' +
        '  </soap:Body>\n' +
        '</soap:Envelope>\n';

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data.info.name).to.equal('Calculator');
      expect(result.output[0].data.item[0].item[0].request.body.raw).to.equal(expectedBodyRaw);
    });
  });

  it('Should get a collection when send a file with remote refs and option is set to true', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
    let optionFromOptions = {},
      schemaPack;
    fileContent = fs.readFileSync(REMOTE_REFS + '/remoteStockquoteservice.wsdl', 'utf8');
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = true;

    schemaPack = new SchemaPack({
      data: fileContent,
      type: 'string'
    }, optionFromOptions);

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
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

  it('Should get an object representing PM Collection with no folder when has one service', function () {
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
      expect(result.output[0].data.item.length).to.equal(8);
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

  it('Should get an object representing PM Collection with tabs in message', function () {
    let fileContent = fs.readFileSync(validWSDLs + '/calculator-soap11and12.wsdl', 'utf8');
    const options = { folderStrategy: 'Port/Endpoint', indentCharacter: 'Tab' },
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
      expect(result.output[0].data.item[0].item[0].request.body.raw.includes('\t')).to.equal(true);

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
    expect(options.length).to.eq(10);
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
    expect(options.length).to.eq(4);
  });

  it('Should return external options when called with mode document and usage not an object', function () {
    const options = SchemaPack.getOptions('document', 2);
    expect(options).to.be.an('array');
    expect(options.length).to.eq(10);
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
      getAllTransactionsFromCollection(result.output[0].data, historyRequests);

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
      expect(y.name).to.eq('Calculator');
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
      expect(result.reason).to.eq('Input.data not provided');
    });
  });
});

describe('merge and validate', function () {

  it('Should create collection from folder having one root file for browser', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/W3Example'),
      files = [],
      array = [
        { fileName: folderPath + '/stockquote.xsd' },
        { fileName: folderPath + '/stockquote.wsdl' },
        { fileName: folderPath + '/stockquoteservice.wsdl' }
      ];

    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });

    const schemaPack = new SchemaPack({ type: 'folder', data: files }, {});

    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
        });
        done();
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should create collection from folder having one root file for browser ex 2', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/counting'),
      files = [],
      array = [
        { fileName: folderPath + '/CountingCategoryData.xsd' },
        { fileName: folderPath + '/CountingCategoryService.wsdl' }
      ];

    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });

    const schemaPack = new SchemaPack({ type: 'folder', data: files }, {});

    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should create collection from folder having only one file for browser', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/W3Example'),
      files = [],
      array = [
        { fileName: folderPath + '/output.wsdl' }
      ];

    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });

    const schemaPack = new SchemaPack({ type: 'folder', data: files }, {});

    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should create collection from folder having only one file no imports for browser', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/W3Example'),
      files = [],
      array = [
        { fileName: folderPath + '/outputNoImports.wsdl' }
      ];
    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });
    const schemaPack = new SchemaPack({ type: 'folder', data: files }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should throw an error when input has more than one root file (services)', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/multipleRoot'),
      files = [],
      array = [
        { fileName: folderPath + '/CountingCategoryData.xsd' },
        { fileName: folderPath + '/CountingCategoryService.wsdl' },
        { fileName: folderPath + '/CountingCategoryServiceCopy.wsdl' }
      ];
    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });
    const schemaPack = new SchemaPack({ type: 'folder', data: files }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      expect(status.result).to.equal(false);
      expect(status.reason).to.equal(MULTIPLE_ROOT_FILES);
      done();
    });
  });

  it('Should create collection from folder send only file info', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/W3Example'),
      array = [
        { fileName: folderPath + '/stockquote.xsd' },
        { fileName: folderPath + '/stockquote.wsdl' },
        { fileName: folderPath + '/stockquoteservice.wsdl' }
      ];
    const schemaPack = new SchemaPack({ type: 'folder', data: array }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          expect(result.output[0].data.info.name).to.equal('StockQuoteService');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should create collection from folder send only file info principal prefix', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/ServicesWithPrincipalPrefix'),
      array = [
        { fileName: folderPath + '/goodService.wsdl' },
        { fileName: folderPath + '/goodService-common.wsdl' },
        { fileName: folderPath + '/common-messages.xsd' },
        { fileName: folderPath + '/common-types.xsd' },
        { fileName: folderPath + '/goodService-messages-common.xsd' },
        { fileName: folderPath + '/goodService-messages.xsd' }
      ];
    const schemaPack = new SchemaPack({ type: 'folder', data: array }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          expect(result.output[0].data.info.name).to.equal('GoodServicePortal');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should create collection from folder with files not XML send only file', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/wsdlfolderextrafile'),
      array = [
        { fileName: folderPath + '/README.md' },
        { fileName: folderPath + '/stockquote.xsd' },
        { fileName: folderPath + '/stockquote.wsdl' },
        { fileName: folderPath + '/stockquoteservice.wsdl' }
      ];
    const schemaPack = new SchemaPack({ type: 'folder', data: array }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          expect(result.output[0].data.info.name).to.equal('StockQuoteService');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should create collection from folder with files not WSDL send only file', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/wsdlfolderextrafilexml'),
      array = [
        { fileName: folderPath + '/README.xml' },
        { fileName: folderPath + '/stockquote.xsd' },
        { fileName: folderPath + '/stockquote.wsdl' },
        { fileName: folderPath + '/stockquoteservice.wsdl' }
      ];
    const schemaPack = new SchemaPack({ type: 'folder', data: array }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          expect(result.output[0].data.info.name).to.equal('StockQuoteService');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should create from folder where targetnamespace is the same in imported schema than in wsdl', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/sameTargetnamespace'),
      array = [
        { fileName: folderPath + '/Services.wsdl' },
        { fileName: folderPath + '/Types.xsd' }
      ];
    const schemaPack = new SchemaPack({ type: 'folder', data: array }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          expect(result.output[0].data.info.name).to.equal('LTSService');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should throw an error when no root file found', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/noRootFile'),
      array = [
        { fileName: folderPath + '/Services.wsdl' },
        { fileName: folderPath + '/Types.xsd' }
      ];
    const schemaPack = new SchemaPack({ type: 'folder', data: array }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      expect(status.result).to.equal(false);
      expect(status.reason).to.equal(MISSING_ROOT_FILE);
      done();
    });
  });

  it('Should create from folder where uses include tag', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/includeTag'),
      array = [
        { fileName: folderPath + '/Services.wsdl' },
        { fileName: folderPath + '/Types.xsd' }
      ];
    const schemaPack = new SchemaPack({ type: 'folder', data: array }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          expect(result.output[0].data.info.name).to.equal('LTSService');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

  it('Should create collection from nested folders send only file info', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/nestedFolders'),
      array = [
        { fileName: folderPath + '/wsdl/Services.wsdl' },
        { fileName: folderPath + '/schemas/Types.xsd' }
      ];
    const schemaPack = new SchemaPack({ type: 'folder', data: array }, {});
    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          expect(result.output[0].data.info.name).to.equal('LTSService');
          done();
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

});
