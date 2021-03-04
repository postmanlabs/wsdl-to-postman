const COLLECTION_TYPE = 'collection',
  {
    ParserFactory
  } = require('./ParserFactory'),
  {
    Validator
  } = require('./Validator'),
  {
    WsdlToPostmanCollectionMapper
  } = require('./WsdlToPostmanCollectionMapper'),
  COLLECTION_NAME = 'Converted from WSDL',
  {
    getCollectionNameFromFileOrEmpty
  } = require('./utils/readInput');
// getOptions = require('./utils/options').getOptions;

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
  }

  /**
   * Validates if provided input has a correct format and contents
   * @returns {object} A validation object with format {result: <boolean>, reason: <string>}
   */
  validate() {
    this.validationResult = new Validator().validate(this.input);
    return this.validationResult;
  }

  /**
   * Run the Wsdl to postman collection process
   * @param {function} callback A function to excecute after conversion process finishes
   * @returns {function} A callback execution
   */
  convert(callback) {
    const parser = new ParserFactory().getParser(this.input.data);
    let postmanCollection,
      mapper,
      wsdlObject,
      collectionJSON,
      name = '';

    try {
      name = getCollectionNameFromFileOrEmpty(this.input);
      wsdlObject = parser.getWsdlObject(this.input.data);
      mapper = new WsdlToPostmanCollectionMapper(wsdlObject);
      postmanCollection = mapper.getPostmanCollection(name);
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
    if (!this.valid) {
      return callback(null, this.validationResult);
    }
    return callback(null, {
      result: true,
      name: this.wsdlObject.fileName ? this.wsdlObject.fileName : COLLECTION_NAME,
      // todo define where to take the name in only metadata,

      output: [{
        type: 'collection',
        name: this.wsdlObject.fileName ? this.wsdlObject.fileName : COLLECTION_NAME
        // todo define where to take the name in only metadata,

      }]
    });
  }

  mergeAndValidate(callback) {
    console.error('not implemented');
    return callback(null, {
      result: false,
      reason: 'not implemented'
    });
  }
}

module.exports = {
  SchemaPack
};
