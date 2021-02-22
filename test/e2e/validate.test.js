const expect = require('chai').expect,
  Index = require('../../index.js'),
  async = require('async'),
  fs = require('fs'),
  empty_Path = 'test/data/validation/empty.wsdl',
  dummy_Path = 'test/data/validation/dummy.wsdl',
  v11_Path = 'test/data/validWSDLs/numberConvertion.wsdl',
  v20_Path = 'test/data/validation/simple12.wsdl',
  wrong_Path = 'path/does/not/exist.wsdl',
  validWSDLs = 'test/data/validWSDLs';

describe('Test validate function in SchemaPack', function() {

  it('Should get an error msg when there is no WSDL spec', function () {
    let result = Index.validate({ type: 'file', data: dummy_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Not WSDL Specification found in your document'
      });
  });

  it('Should get an error msg when file is empty', function () {
    let result = Index.validate({ type: 'file', data: empty_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Not WSDL Specification found in your document'
      });
  });

  it('Should get an error msg when file is not found', function() {
    let result = Index.validate({ type: 'file', data: wrong_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'File exist.wsdl not found'
      });
  });

  it('Should get an error msg when input type is other than file or string', function () {
    let result = Index.validate({ type: 'other', data: v11_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Invalid input type (other). Type must be file/string.'
      });
  });

  it('Should get an error msg when input type is undefined', function () {
    let result = Index.validate({ type: 'undefined', data: v11_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Invalid input type (undefined). Type must be file/string.'
      });
  });

  it('Should get an error msg when input data is not provided', function () {
    let result = Index.validate({ type: 'file' });
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input not provided'
      });
  });

  it('Should be successful when input is valid wsdl file version 1.1', function () {
    let result = Index.validate({ type: 'file', data: v11_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: true,
        reason: 'Success'
      });
  });

  it('Should be successful when input is valid wsdl file version 2.0', function () {
    let result = Index.validate({ type: 'file', data: v20_Path });
    expect(result).to.be.an('object')
      .and.to.include({
        result: true,
        reason: 'Success'
      });
  });
});

describe('Test convert function in SchemaPack', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs);
  async.each(validWSDLsFolder, function (file, cb) {
    it('Should take a wsdl file and convert it into a Postman Collection ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
      Index.convert({ type: 'string', data: fileContent }, {}, (err, conversionResult) => {
        expect(err).to.be.null;
        expect(conversionResult.result).to.equal(true);
        if (conversionResult.result) {
          expect(conversionResult.output[0].type).to.equal('collection');
          expect(conversionResult.output[0].data).to.have.property('info');
          expect(conversionResult.output[0].data).to.have.property('item');
        }
        else {
          return cb(null);
        }
      });
    });
  });
});
