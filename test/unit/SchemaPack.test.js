const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  validWSDLs20 = 'test/data/validWSDLs20',
  SEPARATED_FILES = '../data/separatedFiles',
  REMOTE_REFS = 'test/data/separatedFiles/remoteRefs',
  COUNTING_SEPARATED_FOLDER = '../data/separatedFiles/counting',
  WIKI_20_FOLDER = '../data/separatedFiles/wiki20',
  MULTIPLE_ROOT = '../data/separatedFiles/multipleRoot',
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
    'indentCharacter',
    'resolveRemoteRefs',
    'remoteRefsResolver'
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
    expect(options.length).to.eq(11);
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
    expect(options.length).to.eq(5);
  });

  it('Should return external options when called with mode document and usage not an object', function () {
    const options = SchemaPack.getOptions('document', 2);
    expect(options).to.be.an('array');
    expect(options.length).to.eq(11);
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

  it('Should return no mismatches when entry is valid', function () {
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

  it('Should get a collection and validate when send a file with remote refs and option is set to true', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; }),
      remoteRefsCollectionItems =
        require('./../data/transactionsValidation/remoteStockquoteserviceCollectionItems.json');

    let optionFromOptions = {},
      schemaPack;
    fileContent = fs.readFileSync(REMOTE_REFS + '/remoteStockquoteservice.wsdl', 'utf8');
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = true;

    schemaPack = new SchemaPack({
      data: fileContent,
      type: 'string'
    }, optionFromOptions);

    schemaPack.validateTransaction(remoteRefsCollectionItems, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.deep.equal({
        matched: true,
        requests: {
          '06a2536d-f3fd-4e6a-86c8-9b002d87a71c': {
            requestId: '06a2536d-f3fd-4e6a-86c8-9b002d87a71c',
            endpoints: [
              {
                matched: true,
                endpointMatchScore: 1,
                endpoint: 'POST soap GetLastTradePrice',
                mismatches: [
                ],
                responses: {
                  'cbdfb1a5-0ae0-4c1b-a1c2-3b1ee3442e77': {
                    id: 'cbdfb1a5-0ae0-4c1b-a1c2-3b1ee3442e77',
                    matched: true,
                    mismatches: [
                    ]
                  }
                }
              }
            ]
          }
        },
        missingEndpoints: []
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

  it('Should create collection from nested schema imports', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/xsdimportsxsd'),
      files = [],
      array = [
        { fileName: folderPath + '/spec.wsdl' },
        { fileName: folderPath + '/schemas/xsd0.xsd' },
        { fileName: folderPath + '/schemas/subschemas/xsd2.xsd' },
        { fileName: folderPath + '/schemas/subschemas/xsd3.xsd' }
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

});

describe('SchemaPack detectRelatedFiles', async function () {
  it('should return related files', async function () {
    const M_I_SERVICE_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryService.wsdl'),
      M_I_DATA_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryData.xsd'),
      M_I_SERVICE = fs.readFileSync(M_I_SERVICE_PATH, 'utf8'),
      M_I_DATA = fs.readFileSync(M_I_DATA_PATH, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/CountingCategoryService.wsdl'
          }
        ],
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: M_I_SERVICE
          },
          {
            path: '/CountingCategoryData.xsd',
            content: M_I_DATA
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      result = await schemaPack.detectRelatedFiles();
    expect(result).to.deep.equal({
      result: true,
      output: {
        type: 'relatedFiles',
        specification: {
          type: 'WSDL',
          version: '1.1'
        },
        data: [
          {
            rootFile: {
              path: '/CountingCategoryService.wsdl'
            },
            relatedFiles: [
              {
                path: '/CountingCategoryData.xsd'
              }
            ],
            missingRelatedFiles: [
              {
                path: '/CommonData.xsd'
              }
            ]
          }
        ]
      }
    });
  });

  it('Should throw error when root is not present in data array', async function () {
    const M_I_DATA_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryData.xsd'),
      M_I_DATA = fs.readFileSync(M_I_DATA_PATH, 'utf8'),
      input = {
        type: 'multiFile',
        rootFiles: [
          {
            path: '/CountingCategoryService.wsdl'
          }
        ],
        data: [
          {
            path: '/CountingCategoryData.yaml',
            content: M_I_DATA
          }]
      };
    try {
      let schemaPack = new SchemaPack(input, {});
      await schemaPack.detectRelatedFiles();
    }
    catch (error) {
      expect(error.message).to.equal('Root file content not found in data array');
    }
  });

  it('Should take the root file from data array root file prop empty array', async function () {
    const M_I_SERVICE_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryService.wsdl'),
      M_I_SERVICE = fs.readFileSync(M_I_SERVICE_PATH, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
        ],
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: M_I_SERVICE
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      res = await schemaPack.detectRelatedFiles();
    expect(res).to.not.be.empty;
    expect(res.result).to.be.true;
    expect(res.output.data[0].rootFile.path).to.equal('/CountingCategoryService.wsdl');
    expect(res.output.data.length).to.equal(1);
  });

  it('Should take the root file from data array root file prop undefined', async function () {
    const M_I_SERVICE_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryService.wsdl'),
      M_I_SERVICE = fs.readFileSync(M_I_SERVICE_PATH, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: M_I_SERVICE
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      res = await schemaPack.detectRelatedFiles();
    expect(res).to.not.be.empty;
    expect(res.result).to.be.true;
    expect(res.output.data[0].rootFile.path).to.equal('/CountingCategoryService.wsdl');
    expect(res.output.data.length).to.equal(1);
  });

  it('should return error when there is no root in the entry', async function () {
    let M_I_DATA_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryData.xsd'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
        ],
        data: [
          {
            path: '/CountingCategoryData.xsd',
            content: M_I_DATA_PATH
          }
        ]
      };
    try {
      const schemaPack = new SchemaPack(input, {});
      await schemaPack.detectRelatedFiles();
    }
    catch (error) {
      expect(error.message).to.equal('Input should have at least one root file');
    }
  });

  it('should throw error when root files is undefined', async function () {
    let M_I_DATA_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryData.xsd'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        data: [
          {
            path: '/CountingCategoryData.xsd',
            content: M_I_DATA_PATH
          }
        ]
      };
    try {
      const schemaPack = new SchemaPack(input, {});
      await schemaPack.detectRelatedFiles();
    }
    catch (error) {
      expect(error.message).to.equal('Input should have at least one root file');
    }
  });

  it('should return error when "type" parameter is not sent', async function () {
    const M_I_SERVICE_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryService.wsdl'),
      M_I_DATA_PATH = path.join(__dirname, SEPARATED_FILES + '/missingImport/CountingCategoryData.xsd'),
      M_I_SERVICE = fs.readFileSync(M_I_SERVICE_PATH, 'utf8'),
      M_I_DATA = fs.readFileSync(M_I_DATA_PATH, 'utf8'),
      input = {
        rootFiles: [
          {
            path: '/CountingCategoryService.yaml',
            content: M_I_SERVICE
          }
        ],
        data: [
          {
            path: '/CountingCategoryData.yaml',
            content: M_I_DATA
          }
        ]
      };

    try {
      const schemaPack = new SchemaPack(input, {});
      await schemaPack.detectRelatedFiles();
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('"Type" parameter should be provided');
    }
  });

  it('should return error when input is an empty object', async function () {
    try {
      const schemaPack = new SchemaPack({}, {});
      await schemaPack.detectRelatedFiles();
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('Input object must have "type" and "data" information');
    }
  });

  it('should return error when input data is an empty array', async function () {
    try {
      const schemaPack = new SchemaPack({ type: 'multiFile', data: [] }, {});
      await schemaPack.detectRelatedFiles();
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('"Data" parameter should be provided');
    }
  });

});

describe('SchemaPack detectRootFiles', function () {

  it('should return error when input is an empty object', async function () {
    try {
      const schemaPack = new SchemaPack({}, {});
      await schemaPack.detectRootFiles();
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('Input object must have "type" and "data" information');
    }
  });

  it('should return error when input data is an empty array', async function () {
    try {
      const
        schemaPack = new SchemaPack({
          type: 'multiFile',
          data: ''
        }, {});
      await schemaPack.detectRootFiles();
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('"Data" parameter should be provided');
    }
  });

  it('should return one root 1.1 correctly without specificationVersion provided', async function () {
    const service = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      result = await schemaPack.detectRootFiles();
    expect(result.result).to.be.true;
    expect(result.output.data[0].path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return no root when specificationVersion is 2.0 and no root ' +
    'file with that version is present', async function () {
    const service = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '2.0',
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      result = await schemaPack.detectRootFiles();
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(0);
    expect(result.output.specification.version).to.equal('2.0');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return one root using version by default (1.1) when multiple ' +
    'versions are present (Not specificationVersion)', async function () {
    const service = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/wikipedia.wsdl'
      ),
      types = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/Types.xsd'
      ),
      service2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      serviceContent2 = fs.readFileSync(service2, 'utf8'),
      typesContent2 = fs.readFileSync(types2, 'utf8'),
      input = {
        type: 'multiFile',
        data: [
          {
            path: '/wikipedia.wsdl',
            content: serviceContent
          },
          {
            path: '/Types.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent2
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent2
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      result = await schemaPack.detectRootFiles();
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(1);
    expect(result.output.data[0].path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return one root when multiple versions are present correctly 2.0', async function () {
    const service = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/wikipedia.wsdl'
      ),
      types = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/Types.xsd'
      ),
      service2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      serviceContent2 = fs.readFileSync(service2, 'utf8'),
      typesContent2 = fs.readFileSync(types2, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '2.0',
        data: [
          {
            path: '/wikipedia.wsdl',
            content: serviceContent
          },
          {
            path: '/Types.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent2
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent2
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      result = await schemaPack.detectRootFiles();
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(1);
    expect(result.output.data[0].path).to.equal('/wikipedia.wsdl');
    expect(result.output.specification.version).to.equal('2.0');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return no root file when there is not a root file present', async function () {
    const types = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/Types.xsd'
      ),
      types2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let typesContent = fs.readFileSync(types, 'utf8'),
      typesContent2 = fs.readFileSync(types2, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        data: [
          {
            path: '/Types.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent2
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      result = await schemaPack.detectRootFiles();
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(0);
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return 2 root 1.1 correctly', async function () {
    const service = path.join(
        __dirname,
        MULTIPLE_ROOT,
        '/CountingCategoryService.wsdl'
      ),
      service2 = path.join(
        __dirname,
        MULTIPLE_ROOT,
        '/CountingCategoryServiceCopy.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      serviceContent2 = fs.readFileSync(service2, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryServiceCopy.wsdl',
            content: serviceContent2
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      result = await schemaPack.detectRootFiles();
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(2);
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should propagate one error correctly', async function () {
    const service = path.join(
      __dirname,
      COUNTING_SEPARATED_FOLDER,
      '/CountingCategoryService.wsdl'
    );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        data: [
          {
            path: '',
            content: serviceContent
          }
        ]
      };
    try {
      const schemaPack = new SchemaPack(input, {});
      await schemaPack.detectRootFiles();
    }
    catch (ex) {
      expect(ex.message).to.equal('"Path" of the data element should be provided');
    }
  });

  it('should not read content from FS when is not present', async function () {
    let input = {
        type: 'multiFile',
        data: [
          {
            path: '/CountingCategoryService.wsdl'
          },
          {
            path: '/CountingCategoryData.xsd'
          }
        ]
      },
      schemaPack = new SchemaPack(input, {}),
      result = await schemaPack.detectRootFiles();
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(0);
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return error when "type" parameter is not sent', async function () {
    const service = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          }
        ]
      };
    try {
      const schemaPack = new SchemaPack(input, {});
      await schemaPack.detectRootFiles();
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('"Type" parameter should be provided');
    }
  });

});

describe('bundle remote refs', function () {
  const customFetchOK = (url) => {
    const url1 = 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/' +
    'development/test/data/separatedFiles/remoteRefs/remoteStockquote.wsdl',
      url2 = 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/' +
      'development/test/data/separatedFiles/remoteRefs/remoteStockquote.xsd',
      folderPath = path.join(__dirname, SEPARATED_FILES, '/remoteRefs'),

      path1 = path.join(folderPath + '/remoteStockquote.wsdl'),
      path2 = path.join(folderPath + '/remoteStockquote.xsd'),
      urlMap = {};
    urlMap[url1] = fs.readFileSync(path1, 'utf8');
    urlMap[url2] = fs.readFileSync(path2, 'utf8');
    let status = 200,
      content = urlMap[url];
    if (content === undefined) {
      status = 404;
    }
    return Promise.resolve({
      text: () => { return Promise.resolve(content); },
      status: status
    });
  };

  it('Should bundle a file with remote refs', async function () {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/remoteRefs'),
      contentFile = fs.readFileSync(folderPath + '/remoteStockquoteservice.wsdl', 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: folderPath + '/remoteStockquoteservice.wsdl'
          }
        ],
        data: [
          {
            path: folderPath + '/remoteStockquoteservice.wsdl',
            content: contentFile
          }
        ]
      };

    const schemaPack = new SchemaPack(input, { resolveRemoteRefs: true, remoteRefsResolver: customFetchOK }),
      result = await schemaPack.bundle();
    expect(result).to.not.be.undefined;
    expect(result.result).to.be.true;
    expect(result.output.data[0].rootFile.bundledContent).to.not.be.empty;

  });

});
