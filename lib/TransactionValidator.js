const Ajv = require('ajv'),
  transactionSchema = require('./constants/transactionSchema');

class TransactionValidator {

  validateTransaction(items, wsdlObject) {
    if (!wsdlObject) {
      throw new Error('wsdlObject not provided');
    }
    this.validateStructure(items);
    this.validateRequiredFields(items);
  }

  validateStructure(transactions) {
    try {
      let ajv = new Ajv({ allErrors: true }),
        validate = ajv.compile(transactionSchema),
        res = validate(transactions);

      if (!res) {
        throw new Error('Invalid syntax provided for requestList', validate.errors);
      }
    }
    catch (e) {
      throw new Error('Invalid syntax provided for requestList', e);
    }
  }

  validateRequiredFields(items) {
    const invalidItem = items.find((item) => {
      return !item.id || Object.keys(item.request).length === 0;
    });
    if (invalidItem) {
      throw Error('Required field is null, empty or undefined');
    }
  }
}

module.exports = {
  TransactionValidator
};
