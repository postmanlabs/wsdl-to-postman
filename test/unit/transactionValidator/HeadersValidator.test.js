const {
    expect
  } = require('chai'),
  {
    HeadersValidator
  } = require('../../../lib/transactionValidator/HeadersValidator'),
  numberToWordsWSDLObject = require('../../data/transactionsValidation/wsdlObjects/numberToWords'),
  getOptions = require('../../../lib/utils/options').getOptions;

describe('HeadersValidator', function () {
  it('Should return missing header when validateHeader option is on true' +
    ' and not content-type header is present', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
      { soapAction: '' });
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
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'text/plain; charset=utf-8'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
    { soapAction: '' });
    expect(result).to.be.an('Array');
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'HEADER',
      transactionJsonPath: '$.request.header[0].value',
      schemaJsonPath: 'schemaPathPrefix',
      reasonCode: 'INVALID_TYPE',
      reason: 'The header \"Content-Type\" needs to be \"text/xml\" or \"application/soap+xml\" but we ' +
        'found \"text/plain; charset=utf-8\" instead'
    });
  });

  it('Should not return missing header when validateHeader option is not provided' +
  ' and not content-type header is present',
  function () {
    const validator = new HeadersValidator(),
      result = validator.validate([], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', false, false, {});
    expect(result).to.be.an('array');
    expect(result.length).to.eq(0);
  });

  it('Should not return bad header mismatch when validateHeader option' +
  ' is false and content-type header is not text/xml',
  function () {
    const validator = new HeadersValidator(),
      result = validator.validate([{
        'key': 'Content-Type',
        'value': 'text/plain; charset=utf-8'
      }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', false, false, {}, { soapAction: '' });
    expect(result).to.be.an('array');
    expect(result.length).to.eq(0);
  });

  it('Should not return missmatch when header is text/xml and validateHeader option is true', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'text/xml'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions, { soapAction: '' });
    expect(result).to.be.an('Array');
    expect(result.length).to.equal(0);
  });

  it('Should not return missmatch when header is application/soap+xml and validateHeader option is true', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'application/soap+xml'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
    { soapAction: '' });
    expect(result).to.be.an('Array');
    expect(result.length).to.equal(0);
  });

  it('Should return missing header when validateHeader option is on true' +
  ' wsdl operation has SOAPAction and not SOAPAction header is present', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'application/soap+xml'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
    numberToWordsWSDLObject.operationsArray[0]);
    expect(result).to.be.an('Array');
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'HEADER',
      transactionJsonPath: '$.request.header',
      schemaJsonPath: 'schemaPathPrefix',
      reasonCode: 'MISSING_IN_REQUEST',
      reason: 'The header "SoapAction" was not found in the transaction'
    });
  });

  it('Should return bad header when validateHeader option is on true' +
  ' wsdl operation has SOAPAction and are not equal', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'application/soap+xml'
    },
    {
      'key': 'SOAPAction',
      'value': 'NumberToWordsnotequal'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
    numberToWordsWSDLObject.operationsArray[0]);
    expect(result).to.be.an('Array');
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'HEADER',
      transactionJsonPath: '$.request.header[1].value',
      schemaJsonPath: 'schemaPathPrefix',
      reasonCode: 'INVALID_TYPE',
      reason: 'The header "SoapAction" needs to be "http://www.dataaccess.com/webservicesserver/NumberToWords"' +
       ' but we found "NumberToWordsnotequal" instead'
    });
  });

  it('Should not return missmatch when validateHeader option is on true' +
  ' wsdl operation has SOAPAction and are equal', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'application/soap+xml'
    },
    {
      'key': 'SOAPAction',
      'value': 'http://www.dataaccess.com/webservicesserver/NumberToWords'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
    numberToWordsWSDLObject.operationsArray[0]);
    expect(result).to.be.an('Array');
    expect(result.length).to.equal(0);
  });

  it('Should not return missmatch when validateHeader option is on true' +
  ' wsdl operation has SOAPAction and SOAPAction value is PM var', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; }),
      ignoreUnresolvedVariablesOption = options.find((option) => { return option.id === 'ignoreUnresolvedVariables'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    optionFromOptions[`${ignoreUnresolvedVariablesOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'application/soap+xml'
    },
    {
      'key': 'SOAPAction',
      'value': '{{pmvar}}'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
    numberToWordsWSDLObject.operationsArray[0]);
    expect(result).to.be.an('Array');
    expect(result.length).to.equal(0);
  });

  it('Should return missing header in schema when validateHeader option is on true' +
  ' wsdl operation has SOAPAction and not SOAPAction header is present', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; }),
      showMissingInSchemaErrorsOption = options.find((option) => { return option.id === 'showMissingInSchemaErrors'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    optionFromOptions[`${showMissingInSchemaErrorsOption.id}`] = true;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'application/soap+xml'
    },
    {
      'key': 'SOAPAction',
      'value': 'someSOAPAction'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
    { soapAction: '' });
    expect(result).to.be.an('Array');
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'HEADER',
      transactionJsonPath: '$.request.header',
      schemaJsonPath: 'schemaPathPrefix',
      reasonCode: 'MISSING_IN_SCHEMA',
      reason: 'The header "SoapAction" was not found in the schema'
    });
  });

  it('Should not return missing header in schema when validateHeader option is on true wsdl operation has SOAPAction' +
  '  and not SOAPAction header is present and show missing in schema errors is false', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validateHeader'; }),
      showMissingInSchemaErrorsOption = options.find((option) => { return option.id === 'showMissingInSchemaErrors'; });
    let optionFromOptions = {},
      validator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = true;
    optionFromOptions[`${showMissingInSchemaErrorsOption.id}`] = false;
    validator = new HeadersValidator();
    result = validator.validate([{
      'key': 'Content-Type',
      'value': 'application/soap+xml'
    },
    {
      'key': 'SOAPAction',
      'value': 'someSOAPAction'
    }], 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0', true, false, optionFromOptions,
    { soapAction: '' });
    expect(result).to.be.an('Array');
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'HEADER',
      transactionJsonPath: '$.request.header[1].value',
      schemaJsonPath: 'schemaPathPrefix',
      reasonCode: 'INVALID_TYPE',
      reason: 'The header "SoapAction" needs to be "" but we found "someSOAPAction" instead'
    });
  });

});
