const {
  default: ParserFactory
} = require('./ParserFactory');
const {
  Validator
} = require('./Validator');
const {
    default: WsdlObjectToPostmanCollection
  } = require('./WsdlObjectToPostmanCollection'),
  COLLECTION_TYPE = 'collection',
  COLLECTION_NAME = 'Converted from WSDL';
getOptions = require('./utils/options').getOptions;

class SchemaPack {
  constructor(input, options = {}) {
    this.input = input;
    this.options = options;
    this.validationResult = null;
    this.valid = null;
    this.wsdlObject = {};
  }

  validate() {
    this.validationResult = Validator.validate(this.input);
    return this.validationResult;
  }

  convert(callback) {
    let collectionJSON = '',
      collectionObject = {};
    const parser = new ParserFactory().getParser(this.input),
      wsdlObject = parser.getWsdlObject(),
      mapper = new WsdlObjectToPostmanCollection(this.wsdlObject);

    this.wsdlObject = wsdlObject;
    collectionObject = mapper.getPostmanCollection();

    if (collectionObject.hasOwnProperty('collection') && collectionObject.collection) {
      collectionJSON = collectionObject.collection.toJSON();

      // this needs to be deleted as even if version is not specified to sdk,
      // it returns a version property with value set as undefined
      // this fails validation against v2.1 collection schema definition.
      delete collectionJSON.info.version;
    }
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
      name: this.wsdlObject.fileName ? this.wsdlObject.fileName :
        COLLECTION_NAME, // todo define where to take the name in only metadata,

      output: [{
        type: 'collection',
        name: this.wsdlObject.fileName ? this.wsdlObject.fileName :
          COLLECTION_NAME // todo define where to take the name in only metadata,

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
