const expect = require('chai').expect,
  {
    getOptions,
    getMetaData,
    convert,
    validate,
    mergeAndValidate
  } = require('../../index'),
  validWSDLs = 'test/data/validWSDLs11',
  fs = require('fs'),
  path = require('path');

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
      VALID_WSDL_PATH = validWSDLs + '/calculator-soap11and12.wsdl';

    getMetaData({
      type: 'file',
      data: VALID_WSDL_PATH
    }, function (x, y) {
      expect(x).to.eq(null);
      expect(y.name).to.eq('calculator-soap11and12.wsdl');
    });

  });
});


describe('convert', function () {
  it('Should convert the valid input file', function () {
    const
      VALID_WSDL_PATH = validWSDLs + '/calculator-soap11and12.wsdl';
    convert({
      type: 'file',
      data: VALID_WSDL_PATH
    }, {}, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
    });

  });
  it('Should convert the valid input data from file', function () {
    const
      VALID_WSDL_PATH = validWSDLs + '/calculator-soap11and12.wsdl',
      fileContent = fs.readFileSync(VALID_WSDL_PATH, 'utf8');
    convert({
      type: 'string',
      data: fileContent
    }, {}, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
    });

  });
});

describe('validate', function () {
  it('Should return the validate correct for the valid input file', function () {

    const
      VALID_WSDL_PATH = validWSDLs + '/calculator-soap11and12.wsdl';

    let result = validate({
      type: 'file',
      data: VALID_WSDL_PATH
    });
    expect(result.result).to.equal(true);

  });
});

describe('merge and validate', function () {
  it('Should send error', function () {
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
