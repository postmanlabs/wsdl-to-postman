const {
  assert,
  expect
} = require('chai'), {
    WsdlObject
  } = require('./../../lib/WSDLObject'), {
    TransactionValidator
  } = require('./../../lib/TransactionValidator'),
  //validCollectionItems = require('./../data/transactionsValidation/validCollectionItems.json'),
  notIdCollectionItems = require('./../data/transactionsValidation/notIdCollectionItems.json'),
  emptyIdCollectionItems = require('./../data/transactionsValidation/emptyIdCollectionItems.json'),
  nullRequestCollectionItems = require('./../data/transactionsValidation/nullRequestCollectionItems.json'),
  emptyRequestCollectionItems = require('./../data/transactionsValidation/emptyRequestCollectionItems.json'),
  numberToWordsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/numberToWords'),
  numberToWordsNoOperationsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/numberToWordsNoOperations'),
  numberToWordsCollectionItems = require('./../data/transactionsValidation/numberToWordsCollectionItems.json');

describe('Transaction Validator validate structure', function() {
  let emptyWsdlObject = new WsdlObject();
  // it('Should not throw any error when transactions structure are valid', function() {
  //   const transactionValidator = new TransactionValidator();
  //   emptyWsdlObject.operationsArray = [];
  //   emptyWsdlObject.operationsArray[0] = {};
  //   emptyWsdlObject.operationsArray[1] = {};
  //   emptyWsdlObject.operationsArray[0].url = 'https://domain.com/v1/petsa/{{hello}}';
  //   emptyWsdlObject.operationsArray[0].name = 'req1';
  //   emptyWsdlObject.operationsArray[1].url = 'https://domain.com/petsa/4';
  //   emptyWsdlObject.operationsArray[1].name = 'req2';

  //   result = transactionValidator.validateTransaction(validCollectionItems, emptyWsdlObject);
  //   expect(result).to.be.an('object').and.to.deep.include({
  //     matched: true,
  //     requests: {
  //       r1: {
  //         endpoints: [{
  //           matched: true,
  //           endpointMatchScore: 1,
  //           endpoint: 'req1',
  //           mismatches: [],
  //           responses: {
  //             r1s1: {
  //               id: 'r1s1',
  //               matched: true,
  //               mismatches: []
  //             },
  //             r1s2: {
  //               id: 'r1s2',
  //               matched: true,
  //               mismatches: []
  //             }
  //           }
  //         }],
  //         requestId: 'r1',
  //       },
  //       r2: {
  //         endpoints: [{
  //           matched: true,
  //           endpointMatchScore: 1,
  //           endpoint: 'req2',
  //           mismatches: [],
  //           responses: {
  //             r2s1: {
  //               id: 'r2s1',
  //               matched: true,
  //               mismatches: []
  //             },
  //             r2s2: {
  //               id: 'r2s2',
  //               matched: true,
  //               mismatches: []
  //             }
  //           }
  //         }],
  //         requestId: 'r2',
  //       }
  //     }
  //   });
  // });

  it('Should return an error when transaction id is null', function() {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(notIdCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Invalid syntax provided for requestList');
    }
  });

  it('Should return an error when transaction id is empty string', function() {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(emptyIdCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    }
  });

  it('Should return an error when transaction request is null', function() {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(nullRequestCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Invalid syntax provided for requestList');
    }
  });

  it('Should return an error when transaction request is empty', function() {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(emptyRequestCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    }
  });
});

describe('Validate method and url', function() {
  it('Should validate correct number to words mock wsdl and collection items', function() {
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

  it('Should return empty endpoints when not matched found in transaction', function() {
    const transactionValidator = new TransactionValidator(),
      result = transactionValidator.validateTransaction(numberToWordsCollectionItems, numberToWordsNoOperationsWSDLObject);
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

});
