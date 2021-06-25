const numberToWordsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/numberToWords'),
  calculatorWSDLObject = require('./../data/transactionsValidation/wsdlObjects/calculator'),
  getPlayedMatchesWSDLObject = require('./../data/transactionsValidation/wsdlObjects/getPlayedMatches'),
  numberToWordsCollectionItemsPMVariable =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsPMVariable.json'),
  calculatorCollectionItemsPMVariable =
    require('./../data/transactionsValidation/calculatorCollectionItemsPMVariable.json'),
  numberToWordsCollectionItemsBodyMoreFields =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsBodyMoreFields.json'),
  numberToWordsCollectionItemsBodyIncomplete =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsBodyIncomplete.json'),
  numberToWordsCollectionItemsBodyWrongType =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsBodyWrongType.json'),
  numberToWordsCollectionItemsInvalidMessage =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsInvalidMessage.json'),
  numberToWordsCollectionItemsInvalidRootElement =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsInvalidRootElement.json'),
  getPlayedMatchesCollectionItemsWrongType =
    require('./../data/transactionsValidation/getPlayedMatchesCollectionItemsWrongType.json'),
  {
    expect
  } = require('chai'),
  {
    TransactionValidator
  } = require('./../../lib/TransactionValidator'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  numberToWordsCollectionItemsCTHeaderPMVariable =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsCTHeaderPMVariable.json'),
  expectedBase = {
    matched: true,
    requests: {
      '18403328-4213-4c3e-b0e9-b21a636697c3': {
        endpoints: [{
          matched: true,
          endpointMatchScore: 1,
          endpoint: 'POST soap12 NumberToDollars',
          mismatches: [],
          responses: {
            '1763f0b2-9f34-4796-a390-b94ee5c37c7c': {
              id: '1763f0b2-9f34-4796-a390-b94ee5c37c7c',
              matched: true,
              mismatches: []
            }
          }
        }],
        requestId: '18403328-4213-4c3e-b0e9-b21a636697c3'
      },
      '353e33da-1eee-41c1-8865-0f72b2e1fd10': {
        endpoints: [{
          matched: true,
          endpointMatchScore: 1,
          endpoint: 'POST soap12 NumberToWords',
          mismatches: [],
          responses: {
            'c8a892b6-4b2e-4523-9cc3-fc3e08c835c4': {
              id: 'c8a892b6-4b2e-4523-9cc3-fc3e08c835c4',
              matched: true,
              mismatches: []
            }
          }
        }],
        requestId: '353e33da-1eee-41c1-8865-0f72b2e1fd10'
      },
      '395c9db6-d6f5-45a7-90f5-09f5aab4fe92': {
        endpoints: [{
          matched: true,
          endpointMatchScore: 1,
          endpoint: 'POST soap NumberToDollars',
          mismatches: [],
          responses: {
            '8a0c6532-84f9-45c7-838a-f4bf1a6de002': {
              id: '8a0c6532-84f9-45c7-838a-f4bf1a6de002',
              matched: true,
              mismatches: []
            }
          }
        }],
        requestId: '395c9db6-d6f5-45a7-90f5-09f5aab4fe92'
      },
      'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0': {
        endpoints: [{
          matched: true,
          endpointMatchScore: 1,
          endpoint: 'POST soap NumberToWords',
          mismatches: [],
          responses: {
            'd36c56cf-0cf6-4273-a34d-973e842bf80f': {
              id: 'd36c56cf-0cf6-4273-a34d-973e842bf80f',
              matched: true,
              mismatches: []
            }
          }
        }],
        requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
      }
    }
  },
  expectedCalculatorBase = {
    matched: true,
    requests: {
      'd15dbad2-a5d2-4c96-9a9c-5f794d3eba01': {
        requestId: 'd15dbad2-a5d2-4c96-9a9c-5f794d3eba01',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap Add',
            mismatches: [
            ],
            responses: {
              '0b710935-f1f7-4048-9ea8-ce829a477eab': {
                id: '0b710935-f1f7-4048-9ea8-ce829a477eab',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      },
      '96552d2b-2877-4cf1-ac6d-33846c17abd2': {
        requestId: '96552d2b-2877-4cf1-ac6d-33846c17abd2',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap Subtract',
            mismatches: [
            ],
            responses: {
              '4f1d0f6c-65ed-4302-babc-a46ce2134ac3': {
                id: '4f1d0f6c-65ed-4302-babc-a46ce2134ac3',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      },
      'afe6f424-c8d3-4f22-ac7f-68fd7227a486': {
        requestId: 'afe6f424-c8d3-4f22-ac7f-68fd7227a486',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap Multiply',
            mismatches: [
            ],
            responses: {
              'ca88bea9-ba25-43ff-8992-5478e8b22a3c': {
                id: 'ca88bea9-ba25-43ff-8992-5478e8b22a3c',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      },
      'd724b317-5f53-451b-a5ce-6ee112034159': {
        requestId: 'd724b317-5f53-451b-a5ce-6ee112034159',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap Divide',
            mismatches: [
            ],
            responses: {
              '77c8ddce-e038-450d-b62b-e6eddd8c35e3': {
                id: '77c8ddce-e038-450d-b62b-e6eddd8c35e3',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      },
      '97a39497-046f-4070-acac-c74f56e25a12': {
        requestId: '97a39497-046f-4070-acac-c74f56e25a12',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap12 Add',
            mismatches: [
            ],
            responses: {
              '1e031046-c0f0-43a2-86be-73fe40232125': {
                id: '1e031046-c0f0-43a2-86be-73fe40232125',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      },
      '345a134b-4a5b-491a-9e44-e2e8248571bc': {
        requestId: '345a134b-4a5b-491a-9e44-e2e8248571bc',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap12 Subtract',
            mismatches: [
            ],
            responses: {
              'b9b97647-8277-4a33-81fc-49c1d6d64761': {
                id: 'b9b97647-8277-4a33-81fc-49c1d6d64761',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      },
      'd0c1ac21-2949-4f62-ad09-daa10cf608ef': {
        requestId: 'd0c1ac21-2949-4f62-ad09-daa10cf608ef',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap12 Multiply',
            mismatches: [
            ],
            responses: {
              '0bd70547-189b-47e2-969d-44d04423224e': {
                id: '0bd70547-189b-47e2-969d-44d04423224e',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      },
      '1a4fd56b-1260-4861-9483-7724b46a27c2': {
        requestId: '1a4fd56b-1260-4861-9483-7724b46a27c2',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap12 Divide',
            mismatches: [
            ],
            responses: {
              '7c690fc8-cad3-4a7f-aa7f-9b98a03a3c4b': {
                id: '7c690fc8-cad3-4a7f-aa7f-9b98a03a3c4b',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      }
    },
    missingEndpoints: [
    ]
  },
  expectedGetPlayedMatchesBase = {
    matched: true,
    requests: {
      'cfae0d0e-d10c-4a15-8ba6-c80ee6e45879': {
        requestId: 'cfae0d0e-d10c-4a15-8ba6-c80ee6e45879',
        endpoints: [
          {
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap getPlayedMatches',
            mismatches: [
            ],
            responses: {
              '47c90016-9b32-4612-aefc-f2128d79cd3c': {
                id: '47c90016-9b32-4612-aefc-f2128d79cd3c',
                matched: true,
                mismatches: [
                ]
              }
            }
          }
        ]
      }
    },
    missingEndpoints: [
    ]
  };

describe('validateBody method with options', function () {
  const bodyMismatchMockWithReason = (reason, schemaJsonPath, reasonCode = 'INVALID_BODY') => {
      let newMismatch = Object.assign(
        {},
        {
          property: 'BODY',
          transactionJsonPath: '$.request.body',
          schemaJsonPath: schemaJsonPath,
          reasonCode,
          reason: reason
        }
      );
      return newMismatch;
    },
    getExpectedWithMismatchInEndpoint = (expectedBase, itemId, mismatch, type = 'request', responseId = '') => {
      let newExpected = JSON.parse(JSON.stringify(expectedBase));
      if (type === 'request') {
        newExpected.matched = false;
        newExpected.requests[itemId].endpoints[0].mismatches = Array.isArray(mismatch) ? mismatch : [mismatch];
        newExpected.requests[itemId].endpoints[0].matched = false;
      }
      else if (type === 'response') {
        mismatch.property = 'RESPONSE_BODY';
        mismatch.transactionJsonPath = '$.response.body';
        newExpected.matched = false;
        newExpected.requests[itemId].endpoints[0].matched = false;
        newExpected.requests[itemId].endpoints[0].responses[responseId].mismatches =
          Array.isArray(mismatch) ? mismatch : [mismatch];
        newExpected.requests[itemId].endpoints[0].responses[responseId].matched = false;
      }
      return newExpected;
    },
    withSuggestedFix = (mismatch, suggestedObject) => {
      let newMismatch = JSON.parse(JSON.stringify(mismatch));
      newMismatch.suggestedFix = suggestedObject;
      return newMismatch;
    };
  it('Should have a mismatch when a request msg has an unresolved PM variable no option sent', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsPMVariable,
        numberToWordsWSDLObject, new XMLParser(),
        { detailedBlobValidation: true }
      ),
      mismatchReason =
        'Element \'ubiNum\': \'{{pmVariable}}\' is not a valid value of the atomic type \'xs:unsignedLong\'.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
          '//operation[@name="NumberToWords"]', 'INVALID_TYPE')

      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when request msg has an unresolved PM variable and ignoreUnresolvedVariables is false',
    function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(
          numberToWordsCollectionItemsPMVariable,
          numberToWordsWSDLObject, new XMLParser(),
          { ignoreUnresolvedVariables: false, detailedBlobValidation: true }
        ),
        mismatchReason =
          'Element \'ubiNum\': \'{{pmVariable}}\' is not a valid value of the atomic type \'xs:unsignedLong\'.\n',
        expected = getExpectedWithMismatchInEndpoint(
          expectedBase,
          'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
          bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
            '//operation[@name="NumberToWords"]', 'INVALID_TYPE')
        );
      expect(result).to.be.an('object').and.to.deep.include(expected);
    });


  it('Shouldn\'t have a mismatch when a request msg has an unresolved PM variable' +
  ' and ignoreUnresolvedVariables is true', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsPMVariable,
        numberToWordsWSDLObject, new XMLParser(),
        { ignoreUnresolvedVariables: true }
      );
    expect(result).to.be.an('object').and.to.deep.include(expectedBase);
  });

  it('Should have two mismatch when a request msg has 2 unresolved PM variable no option sent' +
  ', detailedBlobValidation is true and suggestAvailableFixes is true', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        calculatorCollectionItemsPMVariable,
        calculatorWSDLObject, new XMLParser(),
        { detailedBlobValidation: true, suggestAvailableFixes: true }
      ),
      mismatchReason =
        'Element \'intA\': \'{{}}\' is not a valid value of the atomic type \'xs:int\'.\n',
      mismatchReason2 =
        'Element \'intB\': \'{{}}\' is not a valid value of the atomic type \'xs:int\'.\n',
      mock1 = withSuggestedFix(
        bodyMismatchMockWithReason(
          mismatchReason,
          '//definitions//binding[@name="CalculatorSoap"]//operation[@name="Subtract"]',
          'INVALID_TYPE'
        ),
        {
          key: '//Subtract/intA',
          actualValue: '{{}}',
          suggestedValue: '100'
        }
      ),
      mock2 = withSuggestedFix(
        bodyMismatchMockWithReason(
          mismatchReason2,
          '//definitions//binding[@name="CalculatorSoap"]//operation[@name="Subtract"]',
          'INVALID_TYPE'
        ),
        {
          key: '//Subtract/intB',
          actualValue: '{{}}',
          suggestedValue: '100'
        }
      ),
      expected = getExpectedWithMismatchInEndpoint(
        expectedCalculatorBase,
        '96552d2b-2877-4cf1-ac6d-33846c17abd2',
        [mock1, mock2]);
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have one mismatch when a request msg has 2 unresolved PM variable no option sent' +
  ', detaledBlobValidation is false and suggestAvailableFixes is true', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        calculatorCollectionItemsPMVariable,
        calculatorWSDLObject, new XMLParser(),
        { detailedBlobValidation: false, suggestAvailableFixes: true }
      ),
      mismatchReason = 'The request body didn\'t match the specified schema',
      mock = withSuggestedFix(
        bodyMismatchMockWithReason(
          mismatchReason,
          '//definitions//binding[@name="CalculatorSoap"]//operation[@name="Subtract"]',
          'INVALID_BODY'
        ),
        {
          key: '//soap:Body',
          actualValue: '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<soap:Envelope' +
            ' xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  <soap:Body>\n' +
            '    <Subtract xmlns=\"http://tempuri.org/\">\n      <intA>{{}}</intA>\n    ' +
            '  <intB>{{}}</intB>\n    </Subtract>\n  </soap:Body>\n</soap:Envelope>\n',
          suggestedValue: '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<soap:Envelope' +
            ' xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  <soap:Body>\n' +
            '    <Subtract xmlns=\"http://tempuri.org/\">\n      <intA>100</intA>\n    ' +
            '  <intB>100</intB>\n    </Subtract>\n  </soap:Body>\n</soap:Envelope>\n'
        }
      ),
      expected = getExpectedWithMismatchInEndpoint(
        expectedCalculatorBase,
        '96552d2b-2877-4cf1-ac6d-33846c17abd2',
        mock);
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Shouldn\'t have a mismatch when a request msg has 2 unresolved PM variable and ignoreUnresolvedVariables is true',
    function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(
          calculatorCollectionItemsPMVariable,
          calculatorWSDLObject, new XMLParser(),
          { ignoreUnresolvedVariables: true }
        );
      expect(result).to.be.an('object').and.to.deep.include(expectedCalculatorBase);
    });

  it('Should have a mismatch when a request msg has more than expected fields and ' +
  'showMissingSchemaErrors is not sent', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyMoreFields,
        numberToWordsWSDLObject, new XMLParser(),
        { detailedBlobValidation: true }
      ),
      mismatchReason = 'Element \'WRONGFIELD\': This element is not expected.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
          '//operation[@name="NumberToWords"]', 'MISSING_IN_SCHEMA')
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Shouldn\'t have any mismatch when a request msg has more than expected fields' +
  ' and showMissingSchemaErrors is false',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyMoreFields,
        numberToWordsWSDLObject, new XMLParser(),
        { showMissingSchemaErrors: false }
      );
    expect(result).to.be.an('object').and.to.deep.include(expectedBase);
  });

  it('Should have a mismatch when a request msg has more than expected fields and showMissingSchemaErrors is true',
    function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(
          numberToWordsCollectionItemsBodyMoreFields,
          numberToWordsWSDLObject, new XMLParser(),
          { detailedBlobValidation: true }
        ),
        mismatchReason = 'Element \'WRONGFIELD\': This element is not expected.\n',
        expected = getExpectedWithMismatchInEndpoint(
          expectedBase,
          'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
          bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
            '//operation[@name="NumberToWords"]', 'MISSING_IN_SCHEMA')
        );
      expect(result).to.be.an('object').and.to.deep.include(expected);
    });

  it('Should have a mismatch when a request msg has more than expected fields, showMissingSchemaErrors is true' +
  ' and suggestAvaulableFixes is true',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyMoreFields,
        numberToWordsWSDLObject, new XMLParser(),
        { showMissingSchemaErrors: true, suggestAvailableFixes: true }
      ),
      mismatchReason = 'The request body didn\'t match the specified schema',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        withSuggestedFix(
          bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
          '//operation[@name="NumberToWords"]'),
          {
            key: '//soap:Body',
            actualValue: '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<soap:Envelope' +
              ' xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  <soap:Body>\n' +
              '    <NumberToWords xmlns=\"http://www.dataaccess.com/webservicesserver/\">\n' +
              '      <ubiNum>18446744073709</ubiNum>\n <WRONGFIELD>WRONG</WRONGFIELD>\n' +
              '    </NumberToWords>\n  </soap:Body>\n</soap:Envelope>\n',
            suggestedValue: '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<soap:Envelope' +
              ' xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  <soap:Body>\n' +
              '    <NumberToWords xmlns=\"http://www.dataaccess.com/webservicesserver/\">\n' +
              '      <ubiNum>100</ubiNum>\n    </NumberToWords>\n  </soap:Body>\n</soap:Envelope>\n'
          }
        )
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a request msg has more than expected fields, showMissingSchemaErrors is true,' +
  ' suggestAvaulableFixes is true and detailedBlobValidation is true',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyMoreFields,
        numberToWordsWSDLObject, new XMLParser(),
        {
          showMissingSchemaErrors: true,
          suggestAvailableFixes: true,
          detailedBlobValidation: true
        }
      ),
      mismatchReason = 'Element \'WRONGFIELD\': This element is not expected.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        withSuggestedFix(
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name="NumberConversionSoapBinding"]' +
            '//operation[@name="NumberToWords"]',
            'MISSING_IN_SCHEMA'
          ),
          {
            key: '//NumberToWords',
            actualValue: '<ubiNum>18446744073709</ubiNum>\n<WRONGFIELD>WRONG</WRONGFIELD>',
            suggestedValue: '<ubiNum>18446744073709</ubiNum>'
          }
        )
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a request msg has less than expected fields,' +
  ' suggestAvaulableFixes is true and detailedBlobValidation is true',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyIncomplete,
        numberToWordsWSDLObject, new XMLParser(),
        {
          suggestAvailableFixes: true,
          detailedBlobValidation: true
        }
      ),
      mismatchReason = 'Element \'NumberToWords\': Missing child element(s). Expected is ( ubiNum ).\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        withSuggestedFix(
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name="NumberConversionSoapBinding"]' +
            '//operation[@name="NumberToWords"]',
            'MISSING_IN_REQUEST'
          ),
          {
            key: '//NumberToWords',
            actualValue: '',
            suggestedValue: '<ubiNum>100</ubiNum>'
          }
        )
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a request msg has a different type than expected in field,' +
  ' suggestAvailableFixes is true and detailedBlobValidation is true',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyWrongType,
        numberToWordsWSDLObject, new XMLParser(),
        {
          suggestAvailableFixes: true,
          detailedBlobValidation: true
        }
      ),
      mismatchReason = 'Element \'ubiNum\': \'WRONG TYPE\' is not a valid' +
        ' value of the atomic type \'xs:unsignedLong\'.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        withSuggestedFix(
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name="NumberConversionSoapBinding"]' +
            '//operation[@name="NumberToWords"]',
            'INVALID_TYPE'
          ),
          {
            key: '//NumberToWords/ubiNum',
            actualValue: 'WRONG TYPE',
            suggestedValue: '100'
          }
        )
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a response msg has a different type than expected in field,' +
  ' and there are multiple elements with the same name than its parent in different levels' +
  'suggestAvailableFixes is true and detailedBlobValidation is true',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        getPlayedMatchesCollectionItemsWrongType,
        getPlayedMatchesWSDLObject, new XMLParser(),
        {
          suggestAvailableFixes: true,
          detailedBlobValidation: true
        }
      ),
      mismatchReason = 'Element \'MatchId\': \'WRONGVALUE\' is not a valid value of the atomic type \'xs:int\'.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedGetPlayedMatchesBase,
        'cfae0d0e-d10c-4a15-8ba6-c80ee6e45879',
        withSuggestedFix(
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name=\"getPlayedMatchesBinding\"]//operation[@name=\"getPlayedMatches\"]',
            'INVALID_TYPE'
          ),
          {
            key: '//getPlayedMatchesResponse/getPlayedMatchesResult/item/MatchId',
            actualValue: 'WRONGVALUE',
            suggestedValue: '100'
          }
        ),
        'response',
        '47c90016-9b32-4612-aefc-f2128d79cd3c'
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a response msg has a different type than expected in field,' +
  ' and there are multiple elements with the same name than its parent in different levels' +
  'suggestAvailableFixes is true and detailedBlobValidation is false',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        getPlayedMatchesCollectionItemsWrongType,
        getPlayedMatchesWSDLObject, new XMLParser(),
        {
          suggestAvailableFixes: true,
          detailedBlobValidation: false
        }
      ),
      mismatchReason = 'The request body didn\'t match the specified schema',
      date = new Date(),
      dateMock = `${date.toISOString().split('T')[0]}Z`,
      expected = getExpectedWithMismatchInEndpoint(
        expectedGetPlayedMatchesBase,
        'cfae0d0e-d10c-4a15-8ba6-c80ee6e45879',
        withSuggestedFix(
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name=\"getPlayedMatchesBinding\"]//operation[@name=\"getPlayedMatches\"]',
            'INVALID_RESPONSE_BODY'
          ),
          {
            key: '//soap:Body',
            actualValue: '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n' +
            '<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  ' +
            '<soap:Body>\n    ' +
            '<getPlayedMatchesResponse xmlns=\"http://{{url}}/soap/services/getPlayedMatches.php\">\n      ' +
            '<getPlayedMatchesResult>\n        <item>\n          <MatchId>WRONGVALUE</MatchId>\n          ' +
            '<GameRound>100</GameRound>\n          <Arena>string</Arena>\n          <Field>string</Field>\n          ' +
            '<MatchTimeDateTime>string</MatchTimeDateTime>\n          <Time>string</Time>\n          ' +
            '<Team1Id>100</Team1Id>\n          <Team1GlobalId>100</Team1GlobalId>\n          ' +
            '<Team1Name>string</Team1Name>\n          <Team2Id>100</Team2Id>\n          ' +
            '<Team2GlobalId>100</Team2GlobalId>\n          <Team2Name>string</Team2Name>\n          ' +
            '<Team1Score>100</Team1Score>\n          <Team2Score>100</Team2Score>\n          ' +
            '<GameResult>string</GameResult>\n          <GameStatus>100</GameStatus>\n          ' +
            '<UpdateTimeStamp>string</UpdateTimeStamp>\n          <MatchName>string</MatchName>\n          ' +
            '<Team1ClubId>string</Team1ClubId>\n          <Team1ClubGlobalId>string</Team1ClubGlobalId>\n          ' +
            '<Team2ClubId>string</Team2ClubId>\n          <Team2ClubGlobalId>string</Team2ClubGlobalId>\n          ' +
            '<Winner>string</Winner>\n          <SortOrder1>string</SortOrder1>\n          ' +
            '<SortOrder2>string</SortOrder2>\n          <MatchGroupId>100</MatchGroupId>\n          ' +
            '<MatchClassId>100</MatchClassId>\n          ' +
            '<PersonalResultRegistration>100</PersonalResultRegistration>\n          ' +
            '<FieldId>string</FieldId>\n          <ArenaId>string</ArenaId>\n          ' +
            '<FieldGlobalId>string</FieldGlobalId>\n          <ArenaGlobalId>string</ArenaGlobalId>\n          ' +
            '<Sets>string</Sets>\n          <RefereesAssignments>\n            <item>\n              ' +
            '<id>string</id>\n              <PersonGlobalId>string</PersonGlobalId>\n              ' +
            '<RefereeNumber>string</RefereeNumber>\n              <Person>\n                ' +
            '<item>\n                  <id>100</id>\n                  ' +
            '<last_name>string</last_name>\n                  ' +
            '<first_name>string</first_name>\n                  <gender>string</gender>\n                  ' +
            '<birth_year>string</birth_year>\n                  ' +
            '<birth_date>2021-06-04Z</birth_date>\n                  ' +
            '<phone>string</phone>\n                  <email>string</email>\n                </item>\n              ' +
            '</Person>\n            </item>\n          </RefereesAssignments>\n        </item>\n      ' +
            '</getPlayedMatchesResult>\n    </getPlayedMatchesResponse>\n  </soap:Body>\n</soap:Envelope>\n',
            suggestedValue: '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n' +
            '<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  ' +
            '<soap:Body>\n    ' +
            '<getPlayedMatchesResponse xmlns=\"http://{{url}}/soap/services/getPlayedMatches.php\">\n      ' +
            '<getPlayedMatchesResult>\n        <item>\n          <MatchId>100</MatchId>\n          ' +
            '<GameRound>100</GameRound>\n          <Arena>string</Arena>\n          ' +
            '<Field>string</Field>\n          <MatchTimeDateTime>string</MatchTimeDateTime>\n          ' +
            '<Time>string</Time>\n          <Team1Id>100</Team1Id>\n          ' +
            '<Team1GlobalId>100</Team1GlobalId>\n          <Team1Name>string</Team1Name>\n          ' +
            '<Team2Id>100</Team2Id>\n          <Team2GlobalId>100</Team2GlobalId>\n          ' +
            '<Team2Name>string</Team2Name>\n          <Team1Score>100</Team1Score>\n          ' +
            '<Team2Score>100</Team2Score>\n          <GameResult>string</GameResult>\n          ' +
            '<GameStatus>100</GameStatus>\n          <UpdateTimeStamp>string</UpdateTimeStamp>\n          ' +
            '<MatchName>string</MatchName>\n          <Team1ClubId>string</Team1ClubId>\n          ' +
            '<Team1ClubGlobalId>string</Team1ClubGlobalId>\n          ' +
            '<Team2ClubId>string</Team2ClubId>\n          ' +
            '<Team2ClubGlobalId>string</Team2ClubGlobalId>\n          <Winner>string</Winner>\n          ' +
            '<SortOrder1>string</SortOrder1>\n          <SortOrder2>string</SortOrder2>\n          ' +
            '<MatchGroupId>100</MatchGroupId>\n          <MatchClassId>100</MatchClassId>\n          ' +
            '<PersonalResultRegistration>100</PersonalResultRegistration>\n          ' +
            '<FieldId>string</FieldId>\n          ' +
            '<ArenaId>string</ArenaId>\n          <FieldGlobalId>string</FieldGlobalId>\n          ' +
            '<ArenaGlobalId>string</ArenaGlobalId>\n          <Sets>string</Sets>\n          ' +
            '<RefereesAssignments>\n            <item>\n              <id>string</id>\n              ' +
            '<PersonGlobalId>string</PersonGlobalId>\n              ' +
            '<RefereeNumber>string</RefereeNumber>\n              ' +
            '<Person>\n                <item>\n                  <id>100</id>\n                  ' +
            '<last_name>string</last_name>\n                  <first_name>string</first_name>\n                  ' +
            '<gender>string</gender>\n                  <birth_year>string</birth_year>\n                  ' +
            '<birth_date>' + dateMock + '</birth_date>\n                  <phone>string</phone>\n                  ' +
            '<email>string</email>\n                </item>\n              </Person>\n            </item>\n          ' +
            '</RefereesAssignments>\n        </item>\n      ' +
            '</getPlayedMatchesResult>\n    </getPlayedMatchesResponse>\n  ' +
            '</soap:Body>\n</soap:Envelope>\n'
          }
        ),
        'response',
        '47c90016-9b32-4612-aefc-f2128d79cd3c'
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a response msg has a different type than expected in field,' +
  ' and there are multiple elements with the same name than its parent in different levels' +
  'suggestAvailableFixes is false and detailedBlobValidation is false',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        getPlayedMatchesCollectionItemsWrongType,
        getPlayedMatchesWSDLObject, new XMLParser(),
        {
          suggestAvailableFixes: false,
          detailedBlobValidation: false
        }
      ),
      mismatchReason = 'The request body didn\'t match the specified schema',
      expected = getExpectedWithMismatchInEndpoint(
        expectedGetPlayedMatchesBase,
        'cfae0d0e-d10c-4a15-8ba6-c80ee6e45879',
        bodyMismatchMockWithReason(
          mismatchReason,
          '//definitions//binding[@name=\"getPlayedMatchesBinding\"]//operation[@name=\"getPlayedMatches\"]',
          'INVALID_RESPONSE_BODY'
        ),
        'response',
        '47c90016-9b32-4612-aefc-f2128d79cd3c'
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a response msg has a different type than expected in field,' +
  ' and there are multiple elements with the same name than its parent in different levels' +
  'suggestAvailableFixes is false and detailedBlobValidation is true',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        getPlayedMatchesCollectionItemsWrongType,
        getPlayedMatchesWSDLObject, new XMLParser(),
        {
          suggestAvailableFixes: false,
          detailedBlobValidation: true
        }
      ),
      mismatchReason = 'Element \'MatchId\': \'WRONGVALUE\' is not a valid value of the atomic type \'xs:int\'.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedGetPlayedMatchesBase,
        'cfae0d0e-d10c-4a15-8ba6-c80ee6e45879',
        bodyMismatchMockWithReason(
          mismatchReason,
          '//definitions//binding[@name=\"getPlayedMatchesBinding\"]//operation[@name=\"getPlayedMatches\"]',
          'INVALID_TYPE'
        ),
        'response',
        '47c90016-9b32-4612-aefc-f2128d79cd3c'
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should return a well formated mismatch when message body is an invalid xml string',
    function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(
          numberToWordsCollectionItemsInvalidMessage,
          numberToWordsWSDLObject, new XMLParser(),
          {
            suggestAvailableFixes: false,
            detailedBlobValidation: true
          }
        ),
        mismatchReason = 'Error validating message',
        expected = getExpectedWithMismatchInEndpoint(
          expectedBase,
          'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name=\"NumberConversionSoapBinding\"]//operation[@name=\"NumberToWords\"]',
            'INVALID_BODY'
          )
        );
      expect(result).to.be.an('object').and.to.deep.include(expected);
    });

  it('Should return a well formated mismatch with suggested fix when message body is an invalid xml string',
    function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(
          numberToWordsCollectionItemsInvalidMessage,
          numberToWordsWSDLObject, new XMLParser(),
          {
            suggestAvailableFixes: true,
            detailedBlobValidation: true
          }
        ),
        mismatchReason = 'Error validating message',
        mismatch = withSuggestedFix(
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name=\"NumberConversionSoapBinding\"]//operation[@name=\"NumberToWords\"]',
            'INVALID_BODY'
          ),
          {
            key: '//soap:Body',
            actualValue: '',
            suggestedValue: '<NumberToWords >\n      <ubiNum>100</ubiNum>\n    </NumberToWords>'
          }
        ),
        expected = getExpectedWithMismatchInEndpoint(
          expectedBase,
          'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
          mismatch
        );
      expect(result).to.be.an('object').and.to.deep.include(expected);
    });

  it('Should return a well formated mismatch when message body has an invalid root element',
    function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(
          numberToWordsCollectionItemsInvalidRootElement,
          numberToWordsWSDLObject, new XMLParser(),
          {
            suggestAvailableFixes: false,
            detailedBlobValidation: true
          }
        ),
        mismatchReason = 'Error validating message',
        expected = getExpectedWithMismatchInEndpoint(
          expectedBase,
          'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name=\"NumberConversionSoapBinding\"]//operation[@name=\"NumberToWords\"]',
            'INVALID_BODY'
          )
        );
      expect(result).to.be.an('object').and.to.deep.include(expected);
    });

  it('Should return a well formated mismatch with suggested fix when message body has an invalid root element',
    function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(
          numberToWordsCollectionItemsInvalidRootElement,
          numberToWordsWSDLObject, new XMLParser(),
          {
            suggestAvailableFixes: true,
            detailedBlobValidation: true
          }
        ),
        mismatchReason = 'Error validating message',
        mismatch = withSuggestedFix(
          bodyMismatchMockWithReason(
            mismatchReason,
            '//definitions//binding[@name=\"NumberConversionSoapBinding\"]//operation[@name=\"NumberToWords\"]',
            'INVALID_BODY'
          ),
          {
            key: '//soap:Body',
            actualValue: '',
            suggestedValue: '<NumberToWords >\n      <ubiNum>100</ubiNum>\n    </NumberToWords>'
          }
        ),
        expected = getExpectedWithMismatchInEndpoint(
          expectedBase,
          'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
          mismatch
        );
      expect(result).to.be.an('object').and.to.deep.include(expected);
    });

  it('Should return a well formated mismatch when message body has an invalid root element,' +
  ' detailedBlobValidation in false, suggestAvailableFixes in true',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsInvalidMessage,
        numberToWordsWSDLObject, new XMLParser(),
        {
          suggestAvailableFixes: true,
          detailedBlobValidation: false
        }
      ),
      mismatchReason = 'The request body didn\'t match the specified schema',
      mismatch = withSuggestedFix(
        bodyMismatchMockWithReason(
          mismatchReason,
          '//definitions//binding[@name=\"NumberConversionSoapBinding\"]//operation[@name=\"NumberToWords\"]',
          'INVALID_BODY'
        ),
        {
          key: '//soap:Body',
          actualValue: '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n' +
            '<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  ' +
            '<soap:Body></soap:Body>\n' +
            '</soap:Envelope>\n',
          suggestedValue: '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n' +
            '<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  ' +
            '<soap:Body>\n    ' +
            '<NumberToWords xmlns=\"http://www.dataaccess.com/webservicesserver/\">\n      ' +
            '<ubiNum>100</ubiNum>\n    ' +
            '</NumberToWords>\n  ' +
            '</soap:Body>\n' +
            '</soap:Envelope>\n'
        }
      ),
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        mismatch
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should return a well formated mismatch when message body has an invalid root element,' +
  ' detailedBlobValidation in false, suggestAvailableFixes in false',
  function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsInvalidRootElement,
        numberToWordsWSDLObject, new XMLParser(),
        {
          suggestAvailableFixes: false,
          detailedBlobValidation: false
        }
      ),
      mismatchReason = 'The request body didn\'t match the specified schema',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        bodyMismatchMockWithReason(
          mismatchReason,
          '//definitions//binding[@name=\"NumberConversionSoapBinding\"]//operation[@name=\"NumberToWords\"]',
          'INVALID_BODY'
        )
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });
});

describe('Validate Headers with options', function () {

  it('Should return bad header mismatch when validateContentType option' +
    ' is true content-type header is not text/xml and ignore unresolved variables is false', function () {
    const options = {
        validateContentType: true,
        ignoreUnresolvedVariables: false
      },
      transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItemsCTHeaderPMVariable,
        numberToWordsWSDLObject, new XMLParser(), options);
    expect(result).to.be.an('object').and.to.deep.include({
      matched: false,
      requests: {
        '18403328-4213-4c3e-b0e9-b21a636697c3': {
          endpoints: [{
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap12 NumberToDollars',
            mismatches: [],
            responses: {
              '1763f0b2-9f34-4796-a390-b94ee5c37c7c': {
                id: '1763f0b2-9f34-4796-a390-b94ee5c37c7c',
                matched: true,
                mismatches: []
              }
            }
          }],
          requestId: '18403328-4213-4c3e-b0e9-b21a636697c3'
        },
        '353e33da-1eee-41c1-8865-0f72b2e1fd10': {
          endpoints: [{
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap12 NumberToWords',
            mismatches: [],
            responses: {
              'c8a892b6-4b2e-4523-9cc3-fc3e08c835c4': {
                id: 'c8a892b6-4b2e-4523-9cc3-fc3e08c835c4',
                matched: true,
                mismatches: []
              }
            }
          }],
          requestId: '353e33da-1eee-41c1-8865-0f72b2e1fd10'
        },
        '395c9db6-d6f5-45a7-90f5-09f5aab4fe92': {
          endpoints: [{
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'POST soap NumberToDollars',
            mismatches: [],
            responses: {
              '8a0c6532-84f9-45c7-838a-f4bf1a6de002': {
                id: '8a0c6532-84f9-45c7-838a-f4bf1a6de002',
                matched: true,
                mismatches: []
              }
            }
          }],
          requestId: '395c9db6-d6f5-45a7-90f5-09f5aab4fe92'
        },
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0': {
          endpoints: [{
            matched: false,
            endpointMatchScore: 1,
            endpoint: 'POST soap NumberToWords',
            mismatches: [{
              property: 'HEADER',
              transactionJsonPath: '$.request.header[0].value',
              schemaJsonPath: 'schemaPathPrefix',
              reasonCode: 'INVALID_TYPE',
              reason: 'The header \"Content-Type\" needs to be \"text/xml\" but we ' +
                'found \"{{unresolvedVariable}}\" instead'
            }],
            responses: {
              'd36c56cf-0cf6-4273-a34d-973e842bf80f': {
                id: 'd36c56cf-0cf6-4273-a34d-973e842bf80f',
                matched: false,
                mismatches: [{
                  property: 'HEADER',
                  transactionJsonPath: '$.responses[d36c56cf-0cf6-4273-a34d-973e842bf80f].header[0].value',
                  schemaJsonPath: 'schemaPathPrefix',
                  reasonCode: 'INVALID_TYPE',
                  reason: 'The header \"Content-Type\" needs to be \"text/xml\" but we' +
                    ' found \"{{unresolvedVariable}}\" instead'
                }]
              }
            }
          }],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });

  it('Shouldn\'t have a mismatch when a request msg has an unresolved PM variable' +
    ' and ignoreUnresolvedVariables is true', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsCTHeaderPMVariable,
        numberToWordsWSDLObject, new XMLParser(),
        {
          validateContentType: true,
          ignoreUnresolvedVariables: true
        }
      );
    expect(result).to.be.an('object').and.to.deep.include(expectedBase);
  });
});
