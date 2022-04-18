const {
    expect
  } = require('chai'),
  {
    MethodValidator
  } = require('../../../lib/transactionValidator/MethodValidator');

describe('Method validator', function() {
  it('Should have a mismatch when item request has a different method than POST in a /soap12 request', function() {
    const transactionValidator = new MethodValidator(),
      result = transactionValidator.validate('soap12', 'GET', { xpathInfo: { xpath: 'xpath' } });
    expect(result[0]).to.be.an('object').and.to.deep.include({
      'property': 'SOAP_METHOD',
      'reason': 'Soap requests must use POST method.',
      'reasonCode': 'INVALID_SOAP_METHOD',
      'schemaJsonPath': 'xpath',
      'transactionJsonPath': '$.request.method'
    });
  });

  it('Shouldn\'t  have a mismatch when item request has a different method than POST in a /soap12 request' +
      ' and option validationPropertiesToIgnore has "HTTP_METHOD"', function() {
    const transactionValidator = new MethodValidator(),
      result = transactionValidator.validate('soap12', 'GET', { xpathInfo: { xpath: 'xpath' } },
        ['SOAP_METHOD']
      );
    expect(result).to.be.an('Array');
    expect(result.length).to.equal(0);
  });
});
