const expect = require('chai').expect,
  fs = require('fs'),
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  VALID_WSDL_PATH = 'test/data/validWSDLs11/numberConvertion.wsdl',
  numberToWordsCollectionItems = require('./../data/transactionsValidation/numberToWordsCollectionItems.json'),
  options = {},
  notIdCollectionItems = require('./../data/transactionsValidation/numberToWordsCollNoIDs.json'),
  nullRequestCollectionItems = require('./../data/transactionsValidation/numberToWordsCollNullRequests.json'),
  emptyRequestCollectionItems = require('./../data/transactionsValidation/numberToWordsCollEmptyRequests.json'),
  numberToWordsCollectionItemsNoCTHeader =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsNoCTHeader.json'),
  numberToWordsCollectionItemsCTHeaderNXML =
    require('./../data/transactionsValidation/numberToWordsCollectionItemsCTHeaderNXML.json');

describe('Test validate Transactions method in SchemaPack', function () {

  let fileContent = fs.readFileSync(VALID_WSDL_PATH, 'utf8');
  const schemaPack = new SchemaPack({
    type: 'string', data: fileContent
  }, options);

  it('Should return an error when the Requests are null in the Collection', function () {
    schemaPack.validateTransaction(nullRequestCollectionItems, (error) => {
      expect(error.message).to.equal('Invalid syntax provided for requestList');
    });
  });

  it('Should return an error when there is not Id Collection', function () {
    schemaPack.validateTransaction(notIdCollectionItems, (error) => {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    });
  });

  it('Should return an error when the Requests are empty in the Collection', function () {
    schemaPack.validateTransaction(emptyRequestCollectionItems, (error) => {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    });
  });

  it('Should validate when validateContentType option is true ' +
    'and Header Content-Type was not found in the transaction', function () {
    const options = {
        validateContentType: true
      },
      schemaPackWithOptions = new SchemaPack({
        type: 'string', data: fileContent
      }, options);
    schemaPackWithOptions.validateTransaction(numberToWordsCollectionItemsNoCTHeader, (error, result) => {
      expect(error).to.be.null;
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
  });

  it('Should validate when validateContentType option is true' +
    ' and Header is other than text/xml', function () {
    const options = {
        validateContentType: true
      },
      schemaPackWithOptions = new SchemaPack({
        type: 'string', data: fileContent
      }, options);
    schemaPackWithOptions.validateTransaction(numberToWordsCollectionItemsCTHeaderNXML, (error, result) => {
      expect(error).to.be.null;
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
  });

  it('Should not validate header when validateContentType option is not provided (false by default) ' +
    'and Header Content-Type was not found in the transaction', function () {
    schemaPack.validateTransaction(numberToWordsCollectionItemsNoCTHeader, (error, result) => {
      expect(error).to.be.null;
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

  it('Should not validate header when validateContentType option is not provided (false by default) ' +
    ' and Header is other than text/xml', function () {
    schemaPack.validateTransaction(numberToWordsCollectionItemsCTHeaderNXML, (error, result) => {
      expect(error).to.be.null;
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

  it('Should return no missmatches if entry is valid', function () {
    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');

      schemaPack.validateTransaction(numberToWordsCollectionItems, (error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
      });
    });
  });

});
