const expect = require('chai').expect,
  {
    validate
  } = require('../../index'),
  result = null;

describe('Validate WSDL Input File', function() {
  it('Should get an error msg when input is null', function() {
    result = validate(null);
    expect(result).to.eql('Input not provided');
  });

  it('Should get an error msg when there is no WSDL spec', function () {
    let emptyFile = 'test/data/empty.wsdl';
    result = validate(emptyFile);
    expect(result).to.eql('Not WSDL Specification found in your document');
  });

  it('Should be successful when input contains "definitions>"', function() {
    let inputFile = 'test/data/Simple.wsdl';
    result = validate(inputFile);
    expect(result).to.be.an('object')
      .and.to.include({
        result: true,
        reason: 'Success'
    });
  });
});
