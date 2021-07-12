const GeocodeAddressParsedWSDLOp = require('./../data/transactionsValidation/wsdlObjects/GeocodeAddressParsedWSDLOp'),
  {
    expect
  } = require('chai'),
  {
    TransactionValidator
  } = require('./../../lib/TransactionValidator'),
  getOptions = require('./../../lib/utils/options').getOptions;


describe('validateQueryParams', function () {
  const geocodeAddressParsedURL = 'Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed?number=string&numberFractional' +
    '=string&preDirectional=string&preQualifier=string&preType=string&preArticle=string&name=string&suffix' +
    '=string&postArticle=string&postQualifier=string&postDirectional=string&suiteType=string&suiteNumber=string&' +
    'city=string&state=string&zip=string&apiKey=string&version=string&shouldCalculateCensus=string&censusYear=string' +
    '&shouldReturnReferenceGeometry=string&shouldNotStoreTransactionDetails=string',
    geocodeAddressParsedURLMissing = 'Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed?number=string&numberFractional' +
    '=string&preDirectional=string&preQualifier=string&preType=string&preArticle=string&name=string&suffix' +
    '=string&postArticle=string&postQualifier=string&postDirectional=string&suiteType=string&suiteNumber=string&' +
    'city=string&state=string&zip=string&apiKey=string&version=string&shouldCalculateCensus=string&censusYear=string' +
    '&shouldReturnReferenceGeometry=string',
    geocodeAddressParsedURLMissing2 = 'Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed?number=string&numberFractional' +
    '=string&preDirectional=string&preQualifier=string&preType=string&preArticle=string&name=string&suffix' +
    '=string&postArticle=string&postQualifier=string&postDirectional=string&suiteType=string&suiteNumber=string&' +
    'city=string&state=string&zip=string&apiKey=string&version=string&shouldCalculateCensus=string&censusYear=string';

  it('Should not validate queryparams when properties to ignore contains  QUERYPARAMS', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validationPropertiesToIgnore'; });
    let optionFromOptions = {},
      transactionValidator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = 'QUERYPARAM';
    transactionValidator = new TransactionValidator();
    result = transactionValidator.validateQueryParams({
      itemRequestProcessedInfo: {}, operationFromWSDLL: {},
      options: optionFromOptions
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('Should not return missmatch when url is correct', function () {
    const itemRequestProcessedInfo = {
      url: geocodeAddressParsedURL,
      name: '',
      protocol: 'http',
      method: 'GET',
      soapActionSegment: ''
    };
    let optionFromOptions = {},
      transactionValidator,
      result;
    transactionValidator = new TransactionValidator();
    result = transactionValidator.validateQueryParams({
      itemRequestProcessedInfo: itemRequestProcessedInfo,
      operationFromWSDL: GeocodeAddressParsedWSDLOp, options: optionFromOptions
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('Should get one missmatch when a parameter is missing in request', function () {
    const itemRequestProcessedInfo = {
      url: geocodeAddressParsedURLMissing,
      name: '',
      protocol: 'http',
      method: 'GET',
      soapActionSegment: ''
    };
    let optionFromOptions = {},
      transactionValidator,
      result;
    transactionValidator = new TransactionValidator();
    result = transactionValidator.validateQueryParams({
      itemRequestProcessedInfo: itemRequestProcessedInfo,
      operationFromWSDL: GeocodeAddressParsedWSDLOp, options: optionFromOptions
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'QUERYPARAM',
      transactionJsonPath: '$.request.url.query',
      schemaJsonPath: '//definitions//binding[@name=\'GeocoderService_V04_01HttpGet\']' +
      '//operation[@name=\'GeocodeAddressParsed\']',
      reasonCode: 'MISSING_IN_REQUEST',
      reason: 'The required query parameter "shouldNotStoreTransactionDetails" was not found in the transaction'
    });

  });

  it('Should get one missmatch with suggestion when a parameter is missing in request', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      suggestAvailableFixesOption = options.find((option) => { return option.id === 'suggestAvailableFixes'; });
    let optionFromOptions = {},
      itemRequestProcessedInfo = {
        url: geocodeAddressParsedURLMissing,
        name: '',
        protocol: 'http',
        method: 'GET',
        soapActionSegment: ''
      },
      transactionValidator,
      result;
    optionFromOptions[`${suggestAvailableFixesOption.id}`] = true;
    transactionValidator = new TransactionValidator();
    result = transactionValidator.validateQueryParams({
      itemRequestProcessedInfo: itemRequestProcessedInfo,
      operationFromWSDL: GeocodeAddressParsedWSDLOp, options: optionFromOptions
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'QUERYPARAM',
      transactionJsonPath: '$.request.url.query',
      schemaJsonPath: '//definitions//binding[@name=\'GeocoderService_V04_01HttpGet\']' +
      '//operation[@name=\'GeocodeAddressParsed\']',
      reasonCode: 'MISSING_IN_REQUEST',
      reason: 'The required query parameter "shouldNotStoreTransactionDetails" was not found in the transaction',
      suggestedFix: {
        key: 'shouldNotStoreTransactionDetails',
        actualValue: null,
        suggestedValue: {
          key: 'shouldNotStoreTransactionDetails',
          value: 'string'
        }
      }
    });

  });

  it('Should get two missmatch when 2 parameters are missing in request', function () {
    const itemRequestProcessedInfo = {
      url: geocodeAddressParsedURLMissing2,
      name: '',
      protocol: 'http',
      method: 'GET',
      soapActionSegment: ''
    };
    let optionFromOptions = {},
      transactionValidator,
      result;
    transactionValidator = new TransactionValidator();
    result = transactionValidator.validateQueryParams({
      itemRequestProcessedInfo: itemRequestProcessedInfo,
      operationFromWSDL: GeocodeAddressParsedWSDLOp, options: optionFromOptions
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(2);
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'QUERYPARAM',
      transactionJsonPath: '$.request.url.query',
      schemaJsonPath: '//definitions//binding[@name=\'GeocoderService_V04_01HttpGet\']' +
      '//operation[@name=\'GeocodeAddressParsed\']',
      reasonCode: 'MISSING_IN_REQUEST',
      reason: 'The required query parameter "shouldReturnReferenceGeometry" was not found in the transaction'
    });
    expect(result[1]).to.be.an('object').and.to.deep.include({
      property: 'QUERYPARAM',
      transactionJsonPath: '$.request.url.query',
      schemaJsonPath: '//definitions//binding[@name=\'GeocoderService_V04_01HttpGet\']' +
      '//operation[@name=\'GeocodeAddressParsed\']',
      reasonCode: 'MISSING_IN_REQUEST',
      reason: 'The required query parameter \"shouldNotStoreTransactionDetails\" was not found in the transaction',
    });

  });
});
