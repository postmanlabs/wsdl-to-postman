var expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  fs = require('fs'),
  path = require('path'),
  VALID_WSDL_PATH = 'test/data/validWSDLs11/numberConvertion.wsdl',
  numberToWordsCollectionItems = require('./../data/transactionsValidation/numberToWordsCollectionItems.json'),
  numberToWordsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/numberToWords'),
  options = {},
  notIdCollectionItems = require('./../data/transactionsValidation/numberToWordsCollNoIDs.json'),
  nullRequestCollectionItems = require('./../data/transactionsValidation/numberToWordsCollNullRequests.json'),
  emptyRequestCollectionItems = require('./../data/transactionsValidation/numberToWordsCollEmptyRequests.json');

describe('Test validate Transactions method in SchemaPack', function() {
  it('Should return an error when there is not Id Collection', function() {
    const schemaPack = new SchemaPack({
      type: 'file', data: VALID_WSDL_PATH
    }, options);
    schemaPack.validateTransactions(notIdCollectionItems, (error) => {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    });
  });

  it('Should return an error when the Requests are null in the Collection', function () {
    const schemaPack = new SchemaPack({
      type: 'file', data: VALID_WSDL_PATH
    }, options);
    schemaPack.validateTransactions(nullRequestCollectionItems, (error) => {
      expect(error.message).to.equal('Invalid syntax provided for requestList');
    });
  });

  it('Should return an error when the Requests are empty in the Collection', function () {
    const schemaPack = new SchemaPack({
      type: 'file', data: VALID_WSDL_PATH
    }, options);
    schemaPack.validateTransactions(emptyRequestCollectionItems, (error) => {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    });
  });
});
