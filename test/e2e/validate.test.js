const expect = require('chai').expect,
  Index = require('../../index.js'),
  empty_Path = 'test/data/empty.wsdl',
  dummy_Path = 'test/data/dummy.wsdl',
  v11_Path = 'test/data/simple11.wsdl',
  v20_Path = 'test/data/simple12.wsdl',
  wrong_Path = 'path/does/not/exist.wsdl';

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
