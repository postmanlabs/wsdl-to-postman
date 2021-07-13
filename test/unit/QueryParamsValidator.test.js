const GeocodeAddressParsedWSDLOp =
require('../data/transactionsValidation/wsdlObjects/GeocodeAddressParsedWSDLOp'),
  GeocodeAddressParsedWSDLOpMissParam =
  require('../data/transactionsValidation/wsdlObjects/GeocodeAddressParsedWSDLOpMissParam'),
  {
    expect
  } = require('chai'),
  {
    QueryParamsValidator
  } = require('../../lib/transactionValidator/QueryParamsValidator'),
  getOptions = require('../../lib/utils/options').getOptions;


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
      'city=string&state=string&zip=string&apiKey=string&version=string&shouldCalculateCensus=string&' +
      'censusYear=string' +
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
      paramsValidator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = 'QUERYPARAM';
    paramsValidator = new QueryParamsValidator();
    result = paramsValidator.validate({
      itemRequestProcessedInfo: {}, operationFromWSDLL: {},
      options: optionFromOptions
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('Should not return missmatch when url is correct', function () {
    const itemRequestProcessedInfo = {
      fullURL: geocodeAddressParsedURL,
      name: '',
      protocol: 'http',
      method: 'GET',
      soapActionSegment: ''
    };
    let optionFromOptions = {},
      paramsValidator,
      result;
    paramsValidator = new QueryParamsValidator();
    result = paramsValidator.validate({
      itemRequestProcessedInfo: itemRequestProcessedInfo,
      operationFromWSDL: GeocodeAddressParsedWSDLOp, options: optionFromOptions
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('Should get one missmatch when a parameter is missing in request', function () {
    const itemRequestProcessedInfo = {
      fullURL: geocodeAddressParsedURLMissing,
      name: '',
      protocol: 'http',
      method: 'GET',
      soapActionSegment: ''
    };
    let optionFromOptions = {},
      paramsValidator,
      result;
    paramsValidator = new QueryParamsValidator();
    result = paramsValidator.validate({
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
        fullURL: geocodeAddressParsedURLMissing,
        name: '',
        protocol: 'http',
        method: 'GET',
        soapActionSegment: ''
      },
      paramsValidator,
      result;
    optionFromOptions[`${suggestAvailableFixesOption.id}`] = true;
    paramsValidator = new QueryParamsValidator();
    result = paramsValidator.validate({
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
      fullURL: geocodeAddressParsedURLMissing2,
      name: '',
      protocol: 'http',
      method: 'GET',
      soapActionSegment: ''
    };
    let optionFromOptions = {},
      paramsValidator,
      result;
    paramsValidator = new QueryParamsValidator();
    result = paramsValidator.validate({
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
      reason: 'The required query parameter \"shouldNotStoreTransactionDetails\" was not found in the transaction'
    });
  });

  it('Should get one missmatch of missing in schema when a parameter is missing in schema', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      suggestAvailableFixesOption = options.find((option) => { return option.id === 'showMissingInSchemaErrors'; });
    let optionFromOptions = {},
      itemRequestProcessedInfo = {
        fullURL: geocodeAddressParsedURL,
        name: '',
        protocol: 'http',
        method: 'GET',
        soapActionSegment: ''
      },
      paramsValidator,
      result;
    optionFromOptions[`${suggestAvailableFixesOption.id}`] = true;
    paramsValidator = new QueryParamsValidator();
    result = paramsValidator.validate({
      itemRequestProcessedInfo: itemRequestProcessedInfo,
      operationFromWSDL: GeocodeAddressParsedWSDLOpMissParam, options: optionFromOptions
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'QUERYPARAM',
      transactionJsonPath: '$.request.url.query[0]',
      schemaJsonPath: null,
      reasonCode: 'MISSING_IN_SCHEMA',
      reason: 'The query parameter number was not found in the schema'
    });
  });
});
