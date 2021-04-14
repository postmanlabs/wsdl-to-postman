const { assert, expect } = require('chai'),
  {
    WsdlObject
  } = require('./../../lib/WSDLObject'),
  {
    TransactionValidator
  } = require('./../../lib/TransactionValidator'),
  validCollectionItems = require('./../data/transactionsValidation/validCollectionItems.json'),
  notIdCollectionItems = require('./../data/transactionsValidation/notIdCollectionItems.json'),
  emptyIdCollectionItems = require('./../data/transactionsValidation/emptyIdCollectionItems.json'),
  nullRequestCollectionItems = require('./../data/transactionsValidation/nullRequestCollectionItems.json'),
  emptyRequestCollectionItems = require('./../data/transactionsValidation/emptyRequestCollectionItems.json');

describe('Transaction Validator validateTransaction function', function() {
  const emptyWsdlObject = new WsdlObject();
  it('Should not throw any error when transactions structure are valid', function() {
    const transactionValidator = new TransactionValidator();
    transactionValidator.validateTransaction(validCollectionItems, emptyWsdlObject);
  });

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

  it('Should return an error when transaction request contains an empty WSDL Object', function() {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateTransaction(emptyRequestCollectionItems, emptyWsdlObject);
      assert.fail('Expected error');
    }
    catch (error) {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    }
  });

  it('Should return an error when wsdlObject is not provided', function() {
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

describe('TransactionValidator validateRequiredFields function', function() {
  it('Should return an error when id is not in any item', function() {
    const transactionValidator = new TransactionValidator();
    try {
      transactionValidator.validateRequiredFields(notIdCollectionItems);
      assert.fail('Error expected');
    }
    catch (error) {
      expect(error.message).to.equal('Required field is null, empty or undefined');
    }
  });

  it('Should return an error when request is not in any item', function() {
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
