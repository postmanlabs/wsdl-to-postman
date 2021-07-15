const GeocodeAddressParsedWSDLOpHTTPPOST =
  require('../../data/transactionsValidation/wsdlObjects/GeocodeAddressParsedWSDLOpHTTPPOST'),
  GeocodeAddressParsedWSDLOpHTTPPOSTMissParam =
    require('../../data/transactionsValidation/wsdlObjects/GeocodeAddressParsedWSDLOpHTTPPOSTMissParam'),
  {
    expect
  } = require('chai'),
  {
    BodyFormEncodedValidator
  } = require('../../../lib/transactionValidator/BodyFormEncodedValidator'),
  getOptions = require('../../../lib/utils/options').getOptions;


describe('validate BodyFormEncodedValidator', function () {

  const VALID_BODY = {
      mode: 'urlencoded',
      urlencoded: [
        {
          key: 'number',
          value: 'string'
        },
        {
          key: 'numberFractional',
          value: 'string'
        },
        {
          key: 'preDirectional',
          value: 'string'
        },
        {
          key: 'preQualifier',
          value: 'string'
        },
        {
          key: 'preType',
          value: 'string'
        },
        {
          key: 'preArticle',
          value: 'string'
        },
        {
          key: 'name',
          value: 'string'
        },
        {
          key: 'suffix',
          value: 'string'
        },
        {
          key: 'postArticle',
          value: 'string'
        },
        {
          key: 'postQualifier',
          value: 'string'
        },
        {
          key: 'postDirectional',
          value: 'string'
        },
        {
          key: 'suiteType',
          value: 'string'
        },
        {
          key: 'suiteNumber',
          value: 'string'
        },
        {
          key: 'city',
          value: 'string'
        },
        {
          key: 'state',
          value: 'string'
        },
        {
          key: 'zip',
          value: 'string'
        },
        {
          key: 'apiKey',
          value: 'string'
        },
        {
          key: 'version',
          value: 'string'
        },
        {
          key: 'shouldCalculateCensus',
          value: 'string'
        },
        {
          key: 'censusYear',
          value: 'string'
        },
        {
          key: 'shouldReturnReferenceGeometry',
          value: 'string'
        },
        {
          key: 'shouldNotStoreTransactionDetails',
          value: 'string'
        }
      ]
    },
    INVALID_BODY_MISS_PROPERTY = {
      mode: 'urlencoded',
      urlencoded: [
        {
          key: 'numberFractional',
          value: 'string'
        },
        {
          key: 'preDirectional',
          value: 'string'
        },
        {
          key: 'preQualifier',
          value: 'string'
        },
        {
          key: 'preType',
          value: 'string'
        },
        {
          key: 'preArticle',
          value: 'string'
        },
        {
          key: 'name',
          value: 'string'
        },
        {
          key: 'suffix',
          value: 'string'
        },
        {
          key: 'postArticle',
          value: 'string'
        },
        {
          key: 'postQualifier',
          value: 'string'
        },
        {
          key: 'postDirectional',
          value: 'string'
        },
        {
          key: 'suiteType',
          value: 'string'
        },
        {
          key: 'suiteNumber',
          value: 'string'
        },
        {
          key: 'city',
          value: 'string'
        },
        {
          key: 'state',
          value: 'string'
        },
        {
          key: 'zip',
          value: 'string'
        },
        {
          key: 'apiKey',
          value: 'string'
        },
        {
          key: 'version',
          value: 'string'
        },
        {
          key: 'shouldCalculateCensus',
          value: 'string'
        },
        {
          key: 'censusYear',
          value: 'string'
        },
        {
          key: 'shouldReturnReferenceGeometry',
          value: 'string'
        },
        {
          key: 'shouldNotStoreTransactionDetails',
          value: 'string'
        }
      ]
    },
    INVALID_BODY_TYPE = {
      mode: 'urlencoded',
      urlencoded: [
        {
          key: 'number',
          value: 8
        },
        {
          key: 'numberFractional',
          value: 'string'
        },
        {
          key: 'preDirectional',
          value: 'string'
        },
        {
          key: 'preQualifier',
          value: 'string'
        },
        {
          key: 'preType',
          value: 'string'
        },
        {
          key: 'preArticle',
          value: 'string'
        },
        {
          key: 'name',
          value: 'string'
        },
        {
          key: 'suffix',
          value: 'string'
        },
        {
          key: 'postArticle',
          value: 'string'
        },
        {
          key: 'postQualifier',
          value: 'string'
        },
        {
          key: 'postDirectional',
          value: 'string'
        },
        {
          key: 'suiteType',
          value: 'string'
        },
        {
          key: 'suiteNumber',
          value: 'string'
        },
        {
          key: 'city',
          value: 'string'
        },
        {
          key: 'state',
          value: 'string'
        },
        {
          key: 'zip',
          value: 'string'
        },
        {
          key: 'apiKey',
          value: 'string'
        },
        {
          key: 'version',
          value: 'string'
        },
        {
          key: 'shouldCalculateCensus',
          value: 'string'
        },
        {
          key: 'censusYear',
          value: 'string'
        },
        {
          key: 'shouldReturnReferenceGeometry',
          value: 'string'
        },
        {
          key: 'shouldNotStoreTransactionDetails',
          value: 'string'
        }
      ]
    };

  it('Should not validate body when properties to ignore contains BODY', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validationPropertiesToIgnore'; });
    let optionFromOptions = {},
      paramsValidator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = 'BODY';
    paramsValidator = new BodyFormEncodedValidator();
    result = paramsValidator.validate({
      body: {}, operationFromWSDLL: {},
      options: optionFromOptions,
      isResponse: false
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('Shouldn\'t validate body when properties to ignore contains RESPONSE_BODY and isResponse true', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      validateHeaderOption = options.find((option) => { return option.id === 'validationPropertiesToIgnore'; });
    let optionFromOptions = {},
      paramsValidator,
      result;
    optionFromOptions[`${validateHeaderOption.id}`] = 'RESPONSE_BODY';
    paramsValidator = new BodyFormEncodedValidator();
    result = paramsValidator.validate({
      body: {}, operationFromWSDLL: {},
      options: optionFromOptions,
      isResponse: true
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('Should get one missmatch when a parameter is missing in schema', function () {
    const options = getOptions({
        usage: ['VALIDATION']
      }),
      showMissingInSchemaErrors = options.find((option) => { return option.id === 'showMissingInSchemaErrors'; });
    let optionFromOptions = {},
      paramsValidator,
      result;
    optionFromOptions[`${showMissingInSchemaErrors.id}`] = true;
    paramsValidator = new BodyFormEncodedValidator();
    result = paramsValidator.validate({
      body: VALID_BODY,
      operationFromWSDL: GeocodeAddressParsedWSDLOpHTTPPOSTMissParam, options: optionFromOptions,
      isResponse: false
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'BODY',
      transactionJsonPath: '$.request.body.urlencoded[0]',
      schemaJsonPath: null,
      reasonCode: 'MISSING_IN_SCHEMA',
      reason: 'The Url Encoded body param "number" was not found in the schema'
    });
  });

  it('Should get one missmatch when a parameter is missing in request', function () {
    let paramsValidator,
      result;
    paramsValidator = new BodyFormEncodedValidator();
    result = paramsValidator.validate({
      body: INVALID_BODY_MISS_PROPERTY,
      operationFromWSDL: GeocodeAddressParsedWSDLOpHTTPPOST, options: {},
      isResponse: false
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'BODY',
      transactionJsonPath: '$.request.body.urlencoded',
      schemaJsonPath: '//definitions//binding[@name=\'GeocoderService_V04_01HttpPost\']' +
        '//operation[@name=\'GeocodeAddressParsed\']',
      reasonCode: 'MISSING_IN_REQUEST',
      reason: 'The Url Encoded body param "number" was not found in the transaction'
    });

  });

  it('Should get zero missmatch with a correct body', function () {
    let paramsValidator,
      result;
    paramsValidator = new BodyFormEncodedValidator();
    result = paramsValidator.validate({
      body: VALID_BODY,
      operationFromWSDL: GeocodeAddressParsedWSDLOpHTTPPOST, options: {},
      isResponse: false
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);

  });

  it('Should get one missmatch with suggestion when a parameter is missing in request', function () {
    const options = getOptions({ usage: ['VALIDATION'] }),
      suggestAvailableFixes = options.find((option) => { return option.id === 'suggestAvailableFixes'; });
    let optionFromOptions = {},
      paramsValidator,
      result;
    optionFromOptions[`${suggestAvailableFixes.id}`] = true;
    paramsValidator = new BodyFormEncodedValidator();
    result = paramsValidator.validate({
      body: INVALID_BODY_MISS_PROPERTY,
      operationFromWSDL: GeocodeAddressParsedWSDLOpHTTPPOST, options: optionFromOptions,
      isResponse: false
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'BODY',
      transactionJsonPath: '$.request.body.urlencoded',
      schemaJsonPath: '//definitions//binding[@name=\'GeocoderService_V04_01HttpPost\']' +
        '//operation[@name=\'GeocodeAddressParsed\']',
      reasonCode: 'MISSING_IN_REQUEST',
      reason: 'The Url Encoded body param "number" was not found in the transaction',
      suggestedFix: {
        key: 'number',
        actualValue: null,
        suggestedValue: {
          key: 'number',
          value: 'string'
        }
      }
    });
  });

  it('Should get one missmatch with suggestion when a parameter has an invalid type', function () {
    const options = getOptions({ usage: ['VALIDATION'] }),
      suggestAvailableFixes = options.find((option) => { return option.id === 'suggestAvailableFixes'; });
    let optionFromOptions = {},
      paramsValidator,
      result;
    optionFromOptions[`${suggestAvailableFixes.id}`] = true;
    paramsValidator = new BodyFormEncodedValidator();
    result = paramsValidator.validate({
      body: INVALID_BODY_TYPE,
      operationFromWSDL: GeocodeAddressParsedWSDLOpHTTPPOST, options: optionFromOptions,
      isResponse: false
    });
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    expect(result[0]).to.be.an('object').and.to.deep.include({
      property: 'BODY',
      transactionJsonPath: '$.request.body.urlencoded[0]',
      schemaJsonPath: '//definitions//binding[@name=\'GeocoderService_V04_01HttpPost\']' +
        '//operation[@name=\'GeocodeAddressParsed\']',
      reasonCode: 'INVALID_TYPE',
      reason: 'The request body needs to be of type string, but we found "8"',
      suggestedFix: {
        key: 'number',
        actualValue: null,
        suggestedValue: {
          key: 'number',
          value: 'string'
        }
      }
    });
  });

});
