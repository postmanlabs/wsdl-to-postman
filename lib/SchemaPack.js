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
    WSDLMerger
  } = require('./utils/WSDLMerger'),
  WsdlError = require('./WsdlError'),
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
    this.validated = false;
    this.name = getCollectionNameFromFileOrEmpty(this.input);
    this.validate();
  }

  /**
   * Validates if provided input has a correct format and contents
   * @returns {object} A validation object with format {result: <boolean>, reason: <string>}
   */
  validate() {
    let result = new Validator().validate(this.input);
    if (this.input.type === 'folder') {
      this.input.data = result.xml.inputData;
      this.input.xmlFiles = result.xml.files;
    }
    else {
      this.input.data = result.xml;
    }
    this.validationResult = result.valResult;
    this.validated = true;
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
      collectionJSON;
    const parser = new ParserFactory().getParser(this.input.data);
    try {
      wsdlObject = parser.getWsdlObject(this.input.data, this.xmlParser);
      mapper = new WsdlToPostmanCollectionMapper(wsdlObject);
      postmanCollection = mapper.getPostmanCollection(this.options, this.xmlParser, this.name);
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
    if (!this.validationResult.result) {
      return callback(null, this.validationResult);
    }
    return callback(null, {
      result: true,
      name: this.name === '' ? COLLECTION_NAME : this.name,
      output: [{
        type: 'collection',
        name: this.name === '' ? COLLECTION_NAME : this.name
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
  validateTransaction(transactions, callback) {
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

  /**
   *
   * @description Merge the folder WSDL files into one and then validate that file
   *
   * @param {*} callback return
   * @returns {boolean} validation
   */
  mergeAndValidate(callback) {
    const wsdlMerger = new WSDLMerger();
    let validationResult;
    try {
      wsdlMerger.merge(this.input.data, this.input.xmlFiles, this.xmlParser)
        .then((merged) => {
          this.input = {
            type: 'string',
            data: merged
          };
          validationResult = this.validate();
          return callback(null, validationResult);
        })
        .catch((err) => {
          if (err instanceof WsdlError) {
            this.validationResult = {
              result: false,
              reason: err.message,
              error: err
            };
          }
          else {
            this.validationResult = {
              result: false,
              reason: 'Error while merging files.',
              error: err
            };
          }
          return callback(null, this.validationResult);
        });
    }
    catch (error) {
      callback(error);
    }
  }

  static getOptions(mode, criteria) {
    return getOptions(mode, criteria);
  }
}

module.exports = {
  SchemaPack
};
