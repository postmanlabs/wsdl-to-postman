const expect = require('chai').expect,
  Index = require('../../index.js'),
  empty_Path='test/data/empty.wsdl',
  dummy_Path='test/data/dummy.wsdl',
  simple_Path='test/data/Simple.wsdl',
  wrong_Path='path/does/not/exist.wsdl';

describe('Test validate function in SchemaPack', function() {
  
  it('Should get an error msg when there is no WSDL spec', function () {
    let schemaPack = new Index.SchemaPack({ type: 'file', data: dummy_Path }, {}),
      result = schemaPack.validate();
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Not WSDL Specification found in your document'
    });
  });

  it('Should get an error msg when file is empty', function () {
    let schemaPack = new Index.SchemaPack({ type: 'file', data: empty_Path }, {}),
      result = schemaPack.validate();
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Not WSDL Specification found in your document'
    });
  });

  it('Should get an error msg when file is not found', function() {
    let schemaPack = new Index.SchemaPack({ type: 'file', data: wrong_Path }, {}),
      result = schemaPack.validate();
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'File exist.wsdl not found' 
    });
  });

  it('Should get an error msg when input type is other than file or string', function () {
    let schemaPack = new Index.SchemaPack({ type: 'other', data: simple_Path }, {}),
      result = schemaPack.validate();
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Invalid input type (other). Type must be file/string.'
    });
  });

  it('Should get an error msg when input type is undefined', function () {
    let schemaPack = new Index.SchemaPack({ type: 'undefined', data: simple_Path }, {}),
      result = schemaPack.validate();
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Invalid input type (undefined). Type must be file/string.'
    });
  });

  it('Should get an error msg when input data is not provided', function () {
    let schemaPack = new Index.SchemaPack({ type: 'file' }, {}),
      result = schemaPack.validate();
    expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input not provided'
    });
  });

  it('Should be successful when input is valid', function () {
    let schemaPack = new Index.SchemaPack({ type: 'file', data: simple_Path }, {}),
      result = schemaPack.validate();
    expect(result).to.be.an('object')
      .and.to.include({
        result: true,
        reason: 'Success'
    });
  });
});
