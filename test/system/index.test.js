const expect = require('chai').expect,
  {
    getOptions,
    getMetaData,
    convert,
    validate,
    mergeAndValidate,
    detectRelatedFiles,
    detectRootFiles
  } = require('../../index'),
  invalidWSDLs = 'test/data/invalidWSDLs11',
  validWSDLs11 = 'test/data/validWSDLs11',
  validWSDLs20 = 'test/data/validWSDLs20',
  empty_Path = 'test/data/validation/empty.wsdl',
  dummy_Path = 'test/data/validation/dummy.wsdl',
  wrong_Path = 'path/does/not/exist.wsdl',
  COUNTING_SEPARATED_FOLDER = '../data/separatedFiles/counting',
  WIKI_20_FOLDER = '../data/separatedFiles/wiki20',
  fs = require('fs'),
  path = require('path'),
  async = require('async');

describe('Index getOptions', function () {
  it('Should return external options when called without parameters', function () {
    const options = getOptions();
    expect(options).to.be.an('array');
    expect(options).to.not.be.empty;
  });
});

describe('getMetaData', function () {
  it('Should return the metadata for the valid input file', function () {

    const
      VALID_WSDL_PATH = validWSDLs11 + '/calculator-soap11and12.wsdl';

    getMetaData({
      type: 'file',
      data: VALID_WSDL_PATH
    }, function (x, y) {
      expect(x).to.eq(null);
      expect(y.name).to.eq('Calculator');
    });

  });
});

describe('convert', function () {
  var WSDLsFolder11 = fs.readdirSync(validWSDLs11),
    WSDLsFolder20 = fs.readdirSync(validWSDLs20);
  async.each(WSDLsFolder11, function (file) {
    it('Should take a WSDL file v11 and convert it to a Postman Collection ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs11 + '/' + file, 'utf8');
      convert({ type: 'string', data: fileContent }, { folderStrategy: 'No folders' },
        (err, conversionResult) => {
          expect(err).to.be.null;
          expect(conversionResult.result).to.equal(true);
          if (conversionResult.result) {
            expect(conversionResult.output[0].type).to.equal('collection');
            expect(conversionResult.output[0].data).to.have.property('info');
            expect(conversionResult.output[0].data).to.have.property('item');
            conversionResult.output[0].data.item.forEach((item) => {
              expect(item).to.include.all.keys('name', 'request', 'response');
              expect(item.request).to.include.all.keys('url', 'header', 'method', 'body', 'description');
              expect(item.response[0]).to.include.all.keys(
                'name', 'originalRequest', 'status', 'code', 'header', 'body'
              );
            });
          }
        });
    });
  });

  async.each(WSDLsFolder20, function (file) {
    it('Should take a WSDL file v20 and convert it to a Postman Collection ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs20 + '/' + file, 'utf8');
      convert({ type: 'string', data: fileContent }, { folderStrategy: 'No folders' },
        (error, conversionResult) => {
          expect(error).to.be.null;
          expect(conversionResult).to.be.an('object');
          expect(conversionResult.output).to.be.an('array');
          expect(conversionResult.output[0].data).to.be.an('object');
          expect(conversionResult.output[0].type).to.equal('collection');
        });
    });
  });

  it('Should return "Provided document is not a valid WSDL specification" with invalid file', function () {
    const
      VALID_WSDL_PATH = invalidWSDLs + '/calculator-invalid.wsdl';
    convert({
      type: 'file',
      data: VALID_WSDL_PATH
    }, {}, (error, result) => {
      expect(error).to.be.null;
      expect(result.result).to.equal(false);
      expect(result.reason).to.equal('Provided document is not a valid WSDL specification');
    });

  });
});

describe('validate', function () {
  it('Should return the validate correct for the valid input file version 1.1', function () {
    const
      VALID_WSDL_PATH = validWSDLs11 + '/calculator-soap11and12.wsdl';
    let result = validate({
      type: 'file',
      data: VALID_WSDL_PATH
    });
    expect(result.result).to.equal(true);
  });

  it('Should return the validate correct for the valid input file version 2.0', function () {
    const
      VALID_WSDL_PATH = validWSDLs20 + '/heron2.wsdl';
    let result = validate({ type: 'file', data: VALID_WSDL_PATH });
    expect(result.result).to.equal(true);
  });

  it('Should get an error msg when there is no WSDL spec', function () {
    let result = validate({ type: 'file', data: dummy_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Provided document is not a valid WSDL specification'
      });
  });

  it('Should get an error msg when file is empty', function () {
    let result = validate({ type: 'file', data: empty_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Provided document is not a valid WSDL specification'
      });
  });

  it('Should get an error msg when file is not found', function () {
    let result = validate({ type: 'file', data: wrong_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'File exist.wsdl not found'
      });
  });

  it('Should get an error msg when input type is other than file or string', function () {
    const
      VALID_WSDL_PATH = validWSDLs11 + '/calculator-soap11and12.wsdl';
    let result = validate({ type: 'other', data: VALID_WSDL_PATH });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Invalid input type (other). Type must be file/string/folder.'
      });
  });

  it('Should get an error msg when input type is undefined', function () {
    const
      VALID_WSDL_PATH = validWSDLs11 + '/calculator-soap11and12.wsdl';
    let result = validate({ type: 'undefined', data: VALID_WSDL_PATH });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Invalid input type (undefined). Type must be file/string/folder.'
      });
  });

  it('Should get an error msg when input data is not provided', function () {
    let result = validate({ type: 'file' });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input.data not provided'
      });
  });

});

describe('merge and validate', function () {
  it('Should not send error', function () {
    let folderPath = path.join(__dirname, '../data/separatedFiles/W3Example'),
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

    mergeAndValidate({ type: 'folder', data: files }, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.result).to.equal(true);
    });

  });
});

describe('detectRelatedFiles', async function () {
  it('should return related files', async function () {
    const folderPath = path.join(__dirname, '../data/separatedFiles/missingImport'),
      M_I_SERVICE_PATH = path.join(folderPath + '/CountingCategoryService.wsdl'),
      M_I_DATA_PATH = path.join(folderPath + '/CountingCategoryData.xsd'),
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
      result = await detectRelatedFiles(input);
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
});

describe('detectRootFiles', async function () {
  it('should return one root 1.1 correctly', async function () {
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
        specificationVersion: '1.1',
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
      result = await detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data[0].path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return one root 2.0 correctly', async function () {
    const service = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/wikipedia.wsdl'
      ),
      types = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/Types.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
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
          }
        ]
      },
      result = await detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(1);
    expect(result.output.data[0].path).to.equal('/wikipedia.wsdl');
    expect(result.output.specification.version).to.equal('2.0');
    expect(result.output.type).to.be.equal('rootFiles');
  });
});