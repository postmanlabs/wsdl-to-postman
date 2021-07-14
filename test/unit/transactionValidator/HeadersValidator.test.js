const {
    expect
  } = require('chai'),
  {
    HeadersValidator
  } = require('../../../lib/transactionValidator/HeadersValidator'),
  getOptions = require('../../../lib/utils/options').getOptions;

describe('HeadersValidator', function () {
  it('Should return missing header when validateHeader option is on true' +
    ' and not content-type header is present', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; });
    let optionFromOptions = {},
      transactionValidator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    transactionValidator = new HeadersValidator();
    result = transactionValidator.validate([], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions);
    expect(result).to.be.an('Array');
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'HEADER',
      transactionJsonPath: '$.request.header',
      schemaJsonPath: 'schemaPathPrefix',
      reasonCode: 'MISSING_IN_REQUEST',
      reason: 'The header "Content-Type" was not found in the transaction'
    });
  });

  it('Should return bad header mismatch when validateHeader option' +
  ' is true and content-type header is not text/xml',
  function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; });
    let optionFromOptions = {},
      transactionValidator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    transactionValidator = new HeadersValidator();
    result = transactionValidator.validate([{
      'key': 'Content-Type',
      'value': 'text/plain; charset=utf-8'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions);
    expect(result).to.be.an('Array');
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'HEADER',
      transactionJsonPath: '$.request.header[0].value',
      schemaJsonPath: 'schemaPathPrefix',
      reasonCode: 'INVALID_TYPE',
      reason: 'The header \"Content-Type\" needs to be \"text/xml\" but we ' +
        'found \"text/plain; charset=utf-8\" instead'
    });
  });

  it('Should not return missing header when validateHeader option is not provided' +
  ' and not content-type header is present',
  function () {
    const transactionValidator = new HeadersValidator(),
      result = transactionValidator.validate([], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', false, false, {});
    expect(result).to.be.an('array');
    expect(result.length).to.eq(0);
  });

  it('Should not return bad header mismatch when validateHeader option' +
  ' is false and content-type header is not text/xml',
  function () {
    const transactionValidator = new HeadersValidator(),
      result = transactionValidator.validate([{
        'key': 'Content-Type',
        'value': 'text/plain; charset=utf-8'
      }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', false, false, {});
    expect(result).to.be.an('array');
    expect(result.length).to.eq(0);
  });

});
