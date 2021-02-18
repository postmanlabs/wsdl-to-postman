const expect = require('chai').expect,
  {
    validate
  } = require('../../index'),
  fs = require('fs'),
  {
    SchemaPack 
  }= require('../../lib/SchemaPack');

describe('Test validate function in SchemaPack', function() {
  /*
  it('Should get an error msg when there is no WSDL spec', function () {
    let fileData = fs.readFileSync('test/data/dummy.wsdl', 'utf8'),
     result = validate(fileData);
     expect(result).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Not WSDL Specification found in your document'
    });
  });

  it('Should get an error msg when file is empty', function () {
    let fileData = fs.readFileSync('test/data/empty.wsdl', 'utf8'),
      result = validate(fileData);
      expect(result).to.be.an('object')
        .and.to.include({
          result: false,
          reason: 'Input not provided'
      });
  });
*/
  it('Should be successful when input is valid', function () {
    let fileData = fs.readFileSync('test/data/Simple.wsdl', 'utf8');
     result = validate(fileData);
    expect(result).to.be.an('object')
      .and.to.include({
        result: true,
        reason: 'Success'
    });
      
  });
});
