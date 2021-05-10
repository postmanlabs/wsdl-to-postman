const COLLECTION_TYPE = 'collection',
  {
    ParserFactory
  } = require('./ParserFactory'),
  {
    Validator
  } = require('./Validator'),
  {
    XMLParser
  } = require('./XMLParser'),
  {
    WsdlToPostmanCollectionMapper
  } = require('./WsdlToPostmanCollectionMapper'),
  COLLECTION_NAME = 'Converted from WSDL',
  getOptions = require('./utils/options').getOptions,
  {
    getCollectionNameFromFileOrEmpty
  } = require('./utils/readInput'),
  {
    TransactionValidator
  } = require('./TransactionValidator');

/**
 * Class to validate and convert files with WSDL specification to Postman collection format.
 * @param {object} input Input object with format {data: <string>, type: <string>}
 * @param {object} options Contains some options to modify conversion result
 */
class SchemaPack {
  constructor(input, options = {}) {
    this.input = input;
    this.options = options;
    this.validationResult = null;
    this.valid = null;
    this.wsdlObject = {};
    this.xmlParser = new XMLParser();

  }

  /**
   * Validates if provided input has a correct format and contents
   * @returns {object} A validation object with format {result: <boolean>, reason: <string>}
   */
  validate() {
    let result = new Validator().validate(this.input);
    this.validationResult = result.valResult;
    this.input.data = result.xml;
    return this.validationResult;
  }

  /**
   * Run the Wsdl to postman collection process
   * @param {function} callback A function to excecute after conversion process finishes
   * @returns {function} A callback execution
   */
  convert(callback) {
    let postmanCollection,
      mapper,
      wsdlObject,
      collectionJSON,
      name = '';
    name = getCollectionNameFromFileOrEmpty(this.input);
    this.validate();
    const parser = new ParserFactory().getParser(this.input.data);

    try {
      wsdlObject = parser.getWsdlObject(this.input.data, this.xmlParser);
      mapper = new WsdlToPostmanCollectionMapper(wsdlObject);
      postmanCollection = mapper.getPostmanCollection(this.options, name);
      collectionJSON = postmanCollection.toJSON();
    }
    catch (error) {
      return callback(error);
    }
    // this needs to be deleted as even if version is not specified to sdk,
    // it returns a version property with value set as undefined
    // this fails validation against v2.1 collection schema definition.
    delete collectionJSON.info.version;

    return callback(null, {
      result: true,
      output: [{
        type: COLLECTION_TYPE,
        data: collectionJSON
      }]
    });
  }

  getMetaData(callback) {
    let name = getCollectionNameFromFileOrEmpty(this.input);
    this.validate();
    if (!this.validationResult.result) {
      return callback(null, this.validationResult);
    }
    return callback(null, {
      result: true,
      name: name === '' ? COLLECTION_NAME : name,
      output: [{
        type: 'collection',
        name: name === '' ? COLLECTION_NAME : name
      }]
    });
  }

  /**
   *
   * @description Takes in a transaction object (meant to represent a Postman history object)
   *
   * @param {*} transactions RequestList
   * @param {*} callback return
   * @returns {boolean} validation
   */
  validateTransactions(transactions, callback) {
    this.validate();

    const parser = new ParserFactory().getParser(this.input.data),
      transactionValidator = new TransactionValidator(),
      wsdlObject = parser.getWsdlObject(this.input.data, this.xmlParser);
    let result;
    try {
      result = transactionValidator.validateTransaction(transactions, wsdlObject, this.xmlParser, this.options);
      callback(null, result);
    }
    catch (error) {
      callback(error);
    }
  }

  mergeAndValidate(callback) {
    console.error('not implemented');
    return callback(null, {
      result: false,
      reason: 'not implemented'
    });
  }

  static getOptions(mode, criteria) {
    return getOptions(mode, criteria);
  }
}

module.exports = {
  SchemaPack
};
