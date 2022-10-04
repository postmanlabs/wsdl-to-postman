const multifileUtils = require('./utils/multifile'),
  COLLECTION_TYPE = 'collection',
  BROWSER = 'browser',
  {
    WSDLParserFactory
  } = require('./WSDLParserFactory'),
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
  } = require('./TransactionValidator'),
  {
    resolveRemoteRefs
  } = require('./utils/WSDLRemoteResolver');

// eslint-disable-next-line no-restricted-modules
let path = require('path'),
  pathBrowserify = require('path-browserify');
const { getRootFiles } = require('./detectRoot');

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
    this.wsdlObject = {};
    this.xmlParser = new XMLParser(this.options);
    this.validated = false;
    this.name = getCollectionNameFromFileOrEmpty(this.input);
    this.validate();
  }

  /**
   * Validates if provided input has a correct format and contents
   * @returns {object} A validation object with format {result: <boolean>, reason: <string>}
   */
  validate() {
    if (this.input.type === 'multiFile' || this.input.type === undefined) {
      return;
    }
    let result = new Validator().validate(this.input, this.xmlParser);
    if (this.input.type === 'folder') {
      this.input.data = result.xml.inputData;
      this.input.xmlFiles = result.xml.files;
    }
    else {
      this.parsedXML = result.parsedXML;
      this.input = {
        type: 'string',
        data: result.xml
      };
      if (this.parsedXML) {
        const wsdlParser = new WSDLParserFactory().getParser(this.input.data);
        let serviceInfo = wsdlParser.getServicesAndDocumentation(this.parsedXML);
        if (serviceInfo && serviceInfo.length === 1) {
          this.name = serviceInfo[0].name;
        }
      }
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

    resolveRemoteRefs(this.input, this.xmlParser, this.options, (result) => {
      let { mergedFile, newParsed, err } = result;
      if (err) {
        return callback(null, {
          result: false,
          reason: err.name + ': ' + err.message
        });
      }
      this.input.data = mergedFile;
      if (newParsed) {
        this.parsedXML = newParsed;
      }
      const wsdlParser = new WSDLParserFactory().getParser(this.input.data);
      try {
        wsdlObject = wsdlParser.getWsdlObject(this.parsedXML);
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
    });
  }

  /**
   *
   * @description Returns the name and type of the conversion
   *
   * @param {*} callback return
   * @returns {object} type and name properties
   */
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
    const wsdlParser = new WSDLParserFactory().getParser(this.input.data),
      transactionValidator = new TransactionValidator(),
      wsdlObject = wsdlParser.getWsdlObject(this.parsedXML);
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
    let validationResult,
      errReason;
    try {
      wsdlMerger.merge(this.input, this.xmlParser)
        .then((merged) => {
          this.input = {
            type: 'string',
            data: merged
          };
          validationResult = this.validate();
          if (validationResult.result) {
            this.parsedXML = this.xmlParser.parseToObject(merged);
          }
          return callback(null, validationResult);
        })
        .catch((err) => {
          errReason = err instanceof WsdlError ?
            err.message : 'Error while merging files.';
          this.validationResult = {
            result: false,
            reason: errReason,
            error: err
          };
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

  /**
   *
   * @description Takes in a folder and identifies the root files in that folder
   * if there are different specification's versions will return only the ones that
   * corresponds to the field specificationVersion
   *
   * @returns {object} root files information found in the input
   */
  async detectRootFiles() {
    const input = this.input;
    let files = {},
      rootFiles,
      // res,
      // adaptedInput,
      // inputDataContents = [],
      parserFactory,
      wsdlParser,
      versionToUse = this.input.specificationVersion ?
        this.input.specificationVersion :
        '1.1',
      // merger = new WSDLMerger(),
      modifiedData = [];

    multifileUtils.validateInputMultiFileAPI(input);
    // if (!input.specificationVersion && 'content' in input.data[0]) {
    // }
    if (input.origin === BROWSER) {
      path = pathBrowserify;
      OasResolverOptions.browser = true;
    }
    input.data.forEach((file) => {
      files[path.resolve(file.path)] = file.content ? file.content : '';
    });
    // adaptedInput = multifileUtils.mapDetectRootFilesInputToGetRootFilesInput(input);
    // inputDataContents = input.data.map((fileData) => {
    //   return fileData.content;
    // });
    parserFactory = new WSDLParserFactory();

    // versionToUse = merger.getFilesVersion(inputDataContents);

    wsdlParser = parserFactory.getParserByVersion(versionToUse);
    modifiedData = input.data.map((fileData) => {
      let newData = fileData;
      newData.parsed = this.xmlParser.safeParseToObject(fileData.content);
      return newData;
    });
    rootFiles = getRootFiles(modifiedData, wsdlParser, this.xmlParser);

    return rootFiles;
  }
}

module.exports = {
  SchemaPack
};
