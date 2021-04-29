const expect = require('chai').expect,
  {
    getAllTransactions
  } = require('../../lib/utils/getAllTransactions'),
  COLLECTION_SCHEMAS = require('../data/collection/v2.1.js').schemas;

describe('Get all transactions', function () {
  it('Should get transactions from a collection', function () {

    let historyRequests = [];
    getAllTransactions(COLLECTION_SCHEMAS.collection['2.1.0'], historyRequests);

    expect(historyRequests).to.not.be.null;

  });
});
