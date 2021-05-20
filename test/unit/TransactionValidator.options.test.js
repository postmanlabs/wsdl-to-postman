const numberToWordsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/numberToWords'),
  calculatorWSDLObject = require('./../data/transactionsValidation/wsdlObjects/calculator'),
  numberToWordsCollectionItemsPMVariable =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsPMVariable.json'),
  calculatorCollectionItemsPMVariable =
    require('./../data/transactionsValidation/calculatorCollectionItemsPMVariable.json'),
  {
    expect
  } = require('chai'),
  {
    TransactionValidator
  } = require('./../../lib/TransactionValidator'),
  {
    XMLParser
  } = require('../../lib/XMLParser');


describe('validateBody method with options', function () {
  const bodyMismatchMockWithReason = (reason, schemaJsonPath) => {
      let newMismatch = Object.assign(
        {},
        {
          property: 'BODY',
          transactionJsonPath: '$.request.body',
          schemaJsonPath: schemaJsonPath,
          reasonCode: 'INVALID_BODY',
          reason: reason
        }
      );
      return newMismatch;
    },
    getExpectedWithMismatchInEndpoint = (expectedBase, itemId, mismatch, type = 'request') => {
      let newExpected = JSON.parse(JSON.stringify(expectedBase));
      if (type === 'request') {
        newExpected.matched = false;
        newExpected.requests[itemId].endpoints[0].mismatches = Array.isArray(mismatch) ? mismatch : [mismatch];
        newExpected.requests[itemId].endpoints[0].matched = false;
      }
      else if (type === 'response') {
        newExpected.matched = false;
        newExpected.requests[itemId].endpoints[0].mismatches = Array.isArray(mismatch) ? mismatch : [mismatch];
        newExpected.requests[itemId].endpoints[0].matched = false;
      }
      return newExpected;
    },
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
    };


  it('Should have a mismatch when a request msg has an unresolved PM variable no option sent', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsPMVariable,
        numberToWordsWSDLObject, new XMLParser()
      ),
      mismatchReason =
        'Element \'ubiNum\': \'{{pmVariable}}\' is not a valid value of the atomic type \'xs:unsignedLong\'.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
          '//operation[@name="NumberToWords"]')
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when request msg has an unresolved PM variable and ignoreUnresolvedVariables is false',
    function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(
          numberToWordsCollectionItemsPMVariable,
          numberToWordsWSDLObject, new XMLParser(),
          { ignoreUnresolvedVariables: false }
        ),
        mismatchReason =
          'Element \'ubiNum\': \'{{pmVariable}}\' is not a valid value of the atomic type \'xs:unsignedLong\'.\n',
        expected = getExpectedWithMismatchInEndpoint(
          expectedBase,
          'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
          bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
            '//operation[@name="NumberToWords"]')
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

  it('Should have a mismatch when a request msg has 2 unresolved PM variable no option sent', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        calculatorCollectionItemsPMVariable,
        calculatorWSDLObject, new XMLParser()
      ),
      mismatchReason =
        'Element \'intA\': \'{{}}\' is not a valid value of the atomic type \'xs:int\'.\n',
      mismatchReason2 =
        'Element \'intB\': \'{{}}\' is not a valid value of the atomic type \'xs:int\'.\n',
      mock1 = bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="CalculatorSoap"]' +
        '//operation[@name="Subtract"]'),
      mock2 = bodyMismatchMockWithReason(mismatchReason2, '//definitions//binding[@name="CalculatorSoap"]' +
        '//operation[@name="Subtract"]'),
      expected = getExpectedWithMismatchInEndpoint(
        expectedCalculatorBase,
        '96552d2b-2877-4cf1-ac6d-33846c17abd2',
        [mock1, mock2]);
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


});
