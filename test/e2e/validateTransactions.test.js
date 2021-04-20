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
  emptyRequestCollectionItems = require('./../data/transactionsValidation/numberToWordsCollEmptyRequests.json');

describe('Test validate Transactions method in SchemaPack', function() {

  let fileContent = fs.readFileSync(VALID_WSDL_PATH, 'utf8');
  const schemaPack = new SchemaPack({
    type: 'string', data: fileContent
  }, options);

  it('Should return an error when there is not Id Collection', function() {
    schemaPack.validateTransactions(notIdCollectionItems, (error) => {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    });
  });

  it('Should return an error when the Requests are null in the Collection', function () {
    schemaPack.validateTransactions(nullRequestCollectionItems, (error) => {
      expect(error.message).to.equal('Invalid syntax provided for requestList');
    });
  });

  it('Should return an error when the Requests are empty in the Collection', function () {
    schemaPack.validateTransactions(emptyRequestCollectionItems, (error) => {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    });
  });

  it('Should return no missmatches', function() {
    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');

      schemaPack.validateTransactions(numberToWordsCollectionItems, (error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
      });
    });
  });
});
