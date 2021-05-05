const notIdCollectionItems = require('./../data/transactionsValidation/notIdCollectionItems.json'),
  emptyIdCollectionItems = require('./../data/transactionsValidation/emptyIdCollectionItems.json'),
  nullRequestCollectionItems = require('./../data/transactionsValidation/nullRequestCollectionItems.json'),
  emptyRequestCollectionItems = require('./../data/transactionsValidation/emptyRequestCollectionItems.json'),
  numberToWordsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/numberToWords'),
  getMatchDetailsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/getMatchDetails'),
  numberToWordsNoOperationsWSDLObject =
    require('./../data/transactionsValidation/wsdlObjects/numberToWordsNoOperations'),
  numberToWordsCollectionItems = require('./../data/transactionsValidation/numberToWordsCollectionItems.json'),
  numberToWordsCollectionItemsBodyWrongType =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsBodyWrongType.json'),
  numberToWordsCollectionItemsBodyIncomplete =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsBodyIncomplete.json'),
  numberToWordsCollectionItemsBodyMoreFields =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsBodyMoreFields.json'),
  numberToWordsCollectionItemsBodyLess =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsBodyLess.json'),
  numberToWordsCollectionItemsResponseBodyIncomplete =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsResponseBodyIncomplete.json'),
  numberToWordsCollectionItemsResponseBodyMoreFields =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsResponseBodyMoreFields.json'),
  numberToWordsCollectionItemsResponseBodyLess =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsResponseBodyLess.json'),
  numberToWordsCollectionItemsNoCTHeader =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsNoCTHeader.json'),
  numberToWordsCollectionItemsCTHeaderNXML =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsCTHeaderNXML.json'),
  numberToWordsCollectionItemsGET = require('./../data/transactionsValidation/numberToWordsCollectionItemsGET.json'),
  numberToWordsCollectionItemsIncompleteItems =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsIncompleteItems.json'),
  getMatchDetailsCollectionItems = require('./../data/transactionsValidation/getMatchDetailsCollectionItems.json'),
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
    });
  });
});

describe('Validate Headers', function () {
  it('Should return missing header when validateContentType option is on true' +
    ' and not content-type header is present', function () {
      const options = {
        validateContentType: true
      },
        transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(numberToWordsCollectionItemsNoCTHeader,
          numberToWordsWSDLObject, options);
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
                transactionJsonPath: '$.request.header',
                schemaJsonPath: 'schemaPathPrefix',
                reasonCode: 'MISSING_IN_REQUEST',
                reason: 'The header "Content-Type" was not found in the transaction'
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
                    reason: 'The header "Content-Type" was not found in the transaction'
                  }]
                }
              }
            }],
            requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
          }
        }
      });
    });

  it('Should return bad header mismatch when validateContentType option' +
    ' is true and content-type header is not text/xml', function () {
      const options = {
        validateContentType: true
      },
        transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(numberToWordsCollectionItemsCTHeaderNXML,
          numberToWordsWSDLObject, options);
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
                  'found \"text/plain; charset=utf-8\" instead'
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
                      ' found \"text/plain; charset=utf-8\" instead'
                  }]
                }
              }
            }],
            requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
          }
        }
      });
    });

  it('Should not return missing header when validateContentType option is not provided' +
    ' and not content-type header is present', function () {
      const transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(numberToWordsCollectionItemsNoCTHeader,
          numberToWordsWSDLObject);
      expect(result).to.be.an('object').and.to.deep.include({
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
      });
    });

  it('Should not return bad header mismatch when validateContentType option' +
    ' is not provided and content-type header is not text/xml', function () {
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
      });
    });


  it('Should not return missing header when validateContentType option is set explicitly on false' +
    ' and not content-type header is present', function () {
      const options = {
        validateContentType: false
      },
        transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(numberToWordsCollectionItemsNoCTHeader,
          numberToWordsWSDLObject, options);
      expect(result).to.be.an('object').and.to.deep.include({
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
      });
    });

  it('Should not return bad header mismatch when validateContentType option is set explicitly on false' +
    ' and content-type header is not text/xml', function () {
      const options = {
        validateContentType: false
      },
        transactionValidator = new TransactionValidator(),
        result = transactionValidator.validateTransaction(numberToWordsCollectionItemsCTHeaderNXML,
          numberToWordsWSDLObject, options);
      expect(result).to.be.an('object').and.to.deep.include({
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
      });
    });
});


describe('get Raw URL', function () {
  it('Should return the same url when it is a string', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.getUrlPath('http://url.com');
    expect(result).to.be.equal('http://url.com');
  });

  it('Should return empty string when url does not have path', function () {
    const transactionValidator = new TransactionValidator(),
      url = {
        'raw': 'https://queue.amazonaws.com',
        'protocol': 'https',
        'host': [
          'queue',
          'amazonaws',
          'com'
        ]
      },
      result = transactionValidator.getUrlPath(url);

    expect(result).to.be.equal('');
  });
});

describe('validateBody method', function () {
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
      let newExpected = Object.assign({}, expectedBase);
      if (type === 'request') {
        newExpected.matched = false;
        newExpected.requests[itemId].endpoints[0].mismatches = [mismatch];
        newExpected.requests[itemId].endpoints[0].matched = false;
      }
      else if (type === 'response') {
        newExpected.matched = false;
        newExpected.requests[itemId].endpoints[0].mismatches = [mismatch];
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
    };
  it('Should return an object with no mismatches when request and response bodies are valid', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItems, numberToWordsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include(expectedBase);
  });
  it('Should have a mismatch when a request endpoint has a type error in body', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyWrongType,
        numberToWordsWSDLObject
      ),
      mismatchReason =
        'Element \'ubiNum\': \'WRONG TYPE\' is not a valid value of the atomic type \'xs:unsignedLong\'.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
          '//operation[@name="NumberToWords"]')
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a request endpoint body has not complete all required fields', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyIncomplete,
        numberToWordsWSDLObject
      ),
      mismatchReason = 'Element \'NumberToWords\': Missing child element(s). Expected is ( ubiNum ).\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        bodyMismatchMockWithReason(mismatchReason, '//definitions//binding[@name="NumberConversionSoapBinding"]' +
          '//operation[@name="NumberToWords"]')
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a request endpoint body has more fields than expected', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsBodyMoreFields,
        numberToWordsWSDLObject
      ),
      mismatchReason = 'Element \'WORNGFIELD\': This element is not expected.\n',
      expected = getExpectedWithMismatchInEndpoint(
        expectedBase,
        'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0',
        bodyMismatchMockWithReason(mismatchReason,
          '//definitions//binding[@name="NumberConversionSoapBinding"]' +
          '//operation[@name="NumberToWords"]')
      );
    expect(result).to.be.an('object').and.to.deep.include(expected);
  });

  it('Should have a mismatch when a request endpoint has not body', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItemsBodyLess, numberToWordsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include({
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
          endpoints: [],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });

  it('Should have a mismatch when a response endpoint has not an required field in body', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsResponseBodyIncomplete,
        numberToWordsWSDLObject
      );
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
            mismatches: [],
            responses: {
              'd36c56cf-0cf6-4273-a34d-973e842bf80f': {
                id: 'd36c56cf-0cf6-4273-a34d-973e842bf80f',
                matched: false,
                mismatches: [
                  {
                    property: 'RESPONSE_BODY',
                    transactionJsonPath: '$.response.body',
                    schemaJsonPath: '//definitions//binding[@name="NumberConversionSoapBinding"]' +
                      '//operation[@name="NumberToWords"]',
                    reasonCode: 'INVALID_RESPONSE_BODY',
                    reason: 'Element \'NumberToWordsResponse\': Missing child element(s).' +
                      ' Expected is ( NumberToWordsResult ).\n'
                  }
                ]
              }
            }
          }],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });

  it('Should have a mismatch when a response endpoint has more fields than schema', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsResponseBodyMoreFields,
        numberToWordsWSDLObject
      );
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
            mismatches: [],
            responses: {
              'd36c56cf-0cf6-4273-a34d-973e842bf80f': {
                id: 'd36c56cf-0cf6-4273-a34d-973e842bf80f',
                matched: false,
                mismatches: [
                  {
                    property: 'RESPONSE_BODY',
                    transactionJsonPath: '$.response.body',
                    schemaJsonPath: '//definitions//binding[@name="NumberConversionSoapBinding"]' +
                      '//operation[@name="NumberToWords"]',
                    reasonCode: 'INVALID_RESPONSE_BODY',
                    reason: 'Element \'WRONGFIELD\': This element is not expected.\n'
                  }
                ]
              }
            }
          }],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });

  it('Should have a mismatch when a response endpoint has empty body', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        numberToWordsCollectionItemsResponseBodyLess,
        numberToWordsWSDLObject
      );
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
            mismatches: [],
            responses: {
              'd36c56cf-0cf6-4273-a34d-973e842bf80f': {
                id: 'd36c56cf-0cf6-4273-a34d-973e842bf80f',
                matched: false,
                mismatches: [
                  {
                    property: 'RESPONSE_BODY',
                    transactionJsonPath: '$.response.body',
                    schemaJsonPath: '//definitions//binding[@name="NumberConversionSoapBinding"]' +
                      '//operation[@name="NumberToWords"]',
                    reasonCode: 'INVALID_RESPONSE_BODY',
                    reason: 'Response body not provided'
                  }
                ]
              }
            }
          }],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });

  it('Should have a mismatch sdfdsfdfdf', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(
        getMatchDetailsCollectionItems,
        getMatchDetailsWSDLObject
      );
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
            mismatches: [],
            responses: {
              'd36c56cf-0cf6-4273-a34d-973e842bf80f': {
                id: 'd36c56cf-0cf6-4273-a34d-973e842bf80f',
                matched: false,
                mismatches: [
                  {
                    property: 'RESPONSE_BODY',
                    transactionJsonPath: '$.response.body',
                    schemaJsonPath: '//definitions//binding[@name="NumberConversionSoapBinding"]' +
                      '//operation[@name="NumberToWords"]',
                    reasonCode: 'INVALID_RESPONSE_BODY',
                    reason: 'Response body not provided'
                  }
                ]
              }
            }
          }],
          requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
        }
      }
    });
  });
});

describe('soapMethodValidation', function () {
  it('Should have a mismatch when item request has a different method than POST in a /soap12 request', function () {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItemsGET,
        numberToWordsWSDLObject);
    expect(result).to.be.an('object').and.to.deep.include({
      matched: false,
      requests: {
        '18403328-4213-4c3e-b0e9-b21a636697c3': {
          endpoints: [{
            matched: false,
            endpointMatchScore: 1,
            endpoint: 'POST soap12 NumberToDollars',
            mismatches: [
              {
                'property': 'SOAP_METHOD',
                'reason': 'Soap requests must use POST method.',
                'reasonCode': 'INVALID_SOAP_METHOD',
                'schemaJsonPath': '//definitions//binding[@name=\"NumberConversionSoapBinding12\"]' +
                  '//operation[@name=\"NumberToDollars\"]',
                'transactionJsonPath': '$.request.method'
              }
            ],
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
            matched: false,
            endpointMatchScore: 1,
            endpoint: 'POST soap12 NumberToWords',
            mismatches: [
              {
                'property': 'SOAP_METHOD',
                'reason': 'Soap requests must use POST method.',
                'reasonCode': 'INVALID_SOAP_METHOD',
                'schemaJsonPath': '//definitions//binding[@name=\"NumberConversionSoapBinding12\"]' +
                  '//operation[@name=\"NumberToWords\"]',
                'transactionJsonPath': '$.request.method'
              }
            ],
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
            matched: false,
            endpointMatchScore: 1,
            endpoint: 'POST soap NumberToDollars',
            mismatches: [
              {
                'property': 'SOAP_METHOD',
                'reason': 'Soap requests must use POST method.',
                'reasonCode': 'INVALID_SOAP_METHOD',
                'schemaJsonPath': '//definitions//binding[@name=\"NumberConversionSoapBinding\"]' +
                  '//operation[@name=\"NumberToDollars\"]',
                'transactionJsonPath': '$.request.method'
              }
            ],
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
            mismatches: [
              {
                'property': 'SOAP_METHOD',
                'reason': 'Soap requests must use POST method.',
                'reasonCode': 'INVALID_SOAP_METHOD',
                'schemaJsonPath': '//definitions//binding[@name=\"NumberConversionSoapBinding\"]' +
                  '//operation[@name=\"NumberToWords\"]',
                'transactionJsonPath': '$.request.method'
              }
            ],
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
});
