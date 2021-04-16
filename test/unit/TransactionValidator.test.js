const notIdCollectionItems = require('./../data/transactionsValidation/notIdCollectionItems.json'),
  emptyIdCollectionItems = require('./../data/transactionsValidation/emptyIdCollectionItems.json'),
  nullRequestCollectionItems = require('./../data/transactionsValidation/nullRequestCollectionItems.json'),
  emptyRequestCollectionItems = require('./../data/transactionsValidation/emptyRequestCollectionItems.json'),
  numberToWordsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/numberToWords'),
  numberToWordsNoOperationsWSDLObject =
    require('./../data/transactionsValidation/wsdlObjects/numberToWordsNoOperations'),
  numberToWordsCollectionItems = require('./../data/transactionsValidation/numberToWordsCollectionItems.json'),
  numberToWordsCollectionItemsNoCTHeader =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsNoCTHeader.json'),
  numberToWordsCollectionItemsCTHeaderNXML =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsCTHeaderNXML.json'),
  numberToWordsCollectionItemsGET = require('./../data/transactionsValidation/numberToWordsCollectionItemsGET.json'),
  numberToWordsCollectionItemsIncompleteItems =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsIncompleteItems.json'),
  //  validCollectionItems = require('./../data/transactionsValidation/validCollectionItems.json'),
  {
    assert,
    expect
  } = require('chai'),
  {
    WsdlObject
  } = require('./../../lib/WSDLObject'),
  {
    TransactionValidator
  } = require('./../../lib/TransactionValidator');


describe('Transaction Validator validateTransaction function', function () {
  const emptyWsdlObject = new WsdlObject();
  it('Should validate correct number to words mock wsdl and collection items', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItems, numberToWordsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include({
      matched: true,
      requests: {
        '18403328-4213-4c3e-b0e9-b21a636697c3': {
          endpoints: [{
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'NumberToDollars',
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
            endpoint: 'NumberToWords',
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
            endpoint: 'NumberToDollars',
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
            endpoint: 'NumberToWords',
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
    });
  });

  it('Should return an error when transaction id is null', function () {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(notIdCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Invalid syntax provided for requestList');
    }
  });

  it('Should return an error when transaction id is an empty string', function () {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(emptyIdCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    }
  });

  it('Should return an error when transaction request is null', function () {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(nullRequestCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Invalid syntax provided for requestList');
    }
  });

  it('Should return an error when transaction request contains an empty WSDL Object', function () {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(emptyRequestCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    }
  });

  it('Should return an error when wsdlObject is not provided', function () {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(emptyRequestCollectionItems);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('wsdlObject not provided');
    }
  });
});

describe('TransactionValidator validateRequiredFields function', function () {
  it('Should return an error when id is not in any item', function () {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateRequiredFields(notIdCollectionItems);
      assert.fail('Error expected');
    }
    catch (error) {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    }
  });

  it('Should return an error when request is not in any item', function () {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateRequiredFields(emptyRequestCollectionItems);
      assert.fail('Error expected');
    }
    catch (error) {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    }
  });
});

describe('Validate method and url found item in wsdl and operation wsdl in collection', function () {

  it('Should return empty endpoints when not matchs found in transaction', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItems,
        numberToWordsNoOperationsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include({
      matched: true,
      requests: {
        '18403328-4213-4c3e-b0e9-b21a636697c3': {
          endpoints: [],
          requestId: '18403328-4213-4c3e-b0e9-b21a636697c3'
        },
        '353e33da-1eee-41c1-8865-0f72b2e1fd10': {
          endpoints: [],
          requestId: '353e33da-1eee-41c1-8865-0f72b2e1fd10'
        },
        '395c9db6-d6f5-45a7-90f5-09f5aab4fe92': {
          endpoints: [],
          requestId: '395c9db6-d6f5-45a7-90f5-09f5aab4fe92'
        },
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0': {
          endpoints: [],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });

  it('Should return missing endpoints when the wsdl has operations not found in the collection', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItemsIncompleteItems,
        numberToWordsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include({
      matched: true,
      missingEndpoints: [{
        property: 'ENDPOINT',
        transactionJsonPath: null,
        schemaJsonPath: 'soap NumberToDollars',
        reasonCode: 'MISSING_ENDPOINT',
        reason: 'The endpoint "POST soap NumberToDollars" is missing in collection',
        endpoint: 'POST soap NumberToDollars'
      },
      {
        property: 'ENDPOINT',
        transactionJsonPath: null,
        schemaJsonPath: 'soap12 NumberToWords',
        reasonCode: 'MISSING_ENDPOINT',
        reason: 'The endpoint "POST soap12 NumberToWords" is missing in collection',
        endpoint: 'POST soap12 NumberToWords'
      },
      {
        property: 'ENDPOINT',
        transactionJsonPath: null,
        schemaJsonPath: 'soap12 NumberToDollars',
        reasonCode: 'MISSING_ENDPOINT',
        reason: 'The endpoint "POST soap12 NumberToDollars" is missing in collection',
        endpoint: 'POST soap12 NumberToDollars'
      }
      ],
      requests: {
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0': {
          endpoints: [{
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'NumberToWords',
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
    });
  });

  it('Should return empty endpoints when not matchs found in the transaction by incorrect method', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItemsGET,
        numberToWordsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include({
      matched: true,
      missingEndpoints: [{
        property: 'ENDPOINT',
        transactionJsonPath: null,
        schemaJsonPath: 'soap NumberToWords',
        reasonCode: 'MISSING_ENDPOINT',
        reason: 'The endpoint "POST soap NumberToWords" is missing in collection',
        endpoint: 'POST soap NumberToWords'
      },
      {
        property: 'ENDPOINT',
        transactionJsonPath: null,
        schemaJsonPath: 'soap NumberToDollars',
        reasonCode: 'MISSING_ENDPOINT',
        reason: 'The endpoint "POST soap NumberToDollars" is missing in collection',
        endpoint: 'POST soap NumberToDollars'
      },
      {
        property: 'ENDPOINT',
        transactionJsonPath: null,
        schemaJsonPath: 'soap12 NumberToWords',
        reasonCode: 'MISSING_ENDPOINT',
        reason: 'The endpoint "POST soap12 NumberToWords" is missing in collection',
        endpoint: 'POST soap12 NumberToWords'
      },
      {
        property: 'ENDPOINT',
        transactionJsonPath: null,
        schemaJsonPath: 'soap12 NumberToDollars',
        reasonCode: 'MISSING_ENDPOINT',
        reason: 'The endpoint "POST soap12 NumberToDollars" is missing in collection',
        endpoint: 'POST soap12 NumberToDollars'
      }
      ],
      requests: {
        '18403328-4213-4c3e-b0e9-b21a636697c3': {
          endpoints: [],
          requestId: '18403328-4213-4c3e-b0e9-b21a636697c3'
        },
        '353e33da-1eee-41c1-8865-0f72b2e1fd10': {
          endpoints: [],
          requestId: '353e33da-1eee-41c1-8865-0f72b2e1fd10'
        },
        '395c9db6-d6f5-45a7-90f5-09f5aab4fe92': {
          endpoints: [],
          requestId: '395c9db6-d6f5-45a7-90f5-09f5aab4fe92'
        },
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0': {
          endpoints: [],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });

});

describe('Validate Headers', function () {
  it('Should return missing header when not content-type header is present', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItemsNoCTHeader, numberToWordsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include({
      matched: true,
      requests: {
        '18403328-4213-4c3e-b0e9-b21a636697c3': {
          endpoints: [{
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'NumberToDollars',
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
            endpoint: 'NumberToWords',
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
            endpoint: 'NumberToDollars',
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
            endpoint: 'NumberToWords',
            mismatches: [{
              property: 'HEADER',
              transactionJsonPath: '$.request.header',
              schemaJsonPath: 'schemaPathPrefix',
              reasonCode: 'MISSING_IN_REQUEST',
              reason: `The header "Content-Type" was not found in the transaction`
            }],
            responses: {
              'd36c56cf-0cf6-4273-a34d-973e842bf80f': {
                id: 'd36c56cf-0cf6-4273-a34d-973e842bf80f',
                matched: false,
                mismatches: [{
                  property: 'HEADER',
                  transactionJsonPath: '$.responses[d36c56cf-0cf6-4273-a34d-973e842bf80f].header',
                  schemaJsonPath: 'schemaPathPrefix',
                  reasonCode: 'MISSING_IN_REQUEST',
                  reason: `The header "Content-Type" was not found in the transaction`
                }]
              }
            }
          }],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });

  it('Should return bad header when not content-type header is not text/xml', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItemsCTHeaderNXML,
        numberToWordsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include({
      matched: true,
      requests: {
        '18403328-4213-4c3e-b0e9-b21a636697c3': {
          endpoints: [{
            matched: true,
            endpointMatchScore: 1,
            endpoint: 'NumberToDollars',
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
            endpoint: 'NumberToWords',
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
            endpoint: 'NumberToDollars',
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
            endpoint: 'NumberToWords',
            mismatches: [{
              property: 'HEADER',
              transactionJsonPath: '$.request.header[0].value',
              schemaJsonPath: 'schemaPathPrefix',
              reasonCode: 'INVALID_TYPE',
              reason: 'The header \"Content-Type\" needs to be \"text/xml\" but we found \"text/plain; charset=utf-8\" instead'
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
                  reason: 'The header \"Content-Type\" needs to be \"text/xml\" but we found \"text/plain; charset=utf-8\" instead'
                }]
              }
            }
          }],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });
});


describe('get Raw URL', function () {
  it('Should return the same url when it is a string', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.getRawURL('http://url.com');
    expect(result).to.be.equal('http://url.com');
  });
});
