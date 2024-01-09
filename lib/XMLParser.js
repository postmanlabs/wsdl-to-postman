const fastXMLParser = require('fast-xml-parser'),
  Parser = require('fast-xml-parser').j2xParser,
  UserError = require('./UserError'),
  { fixComments } = require('./utils/textUtils'),
  PARSER_ATTRIBUTE_NAME_PLACE_HOLDER = '@_',
  optionsForFastXMLParser = {
    ignoreAttributes: false,
    ignoreNameSpace: false,
    parseNodeValue: true,
    trimValues: true
  };


/**
 * Class to validate inputObject.
 */
class XMLParser {
  constructor(processOptions) {
    this.attributePlaceHolder = PARSER_ATTRIBUTE_NAME_PLACE_HOLDER;
    this.parserOptions = {
      ignoreAttributes: false,
      cdataTagName: '__cdata',
      format: true,
      indentBy: '  ',
      supressEmptyNode: true
    };
    // set indentation as tab provided option with the Tab as value
    if (processOptions && processOptions.indentCharacter) {
      if (typeof processOptions.indentCharacter === 'string' &&
        processOptions.indentCharacter.toLowerCase() === 'tab') {
        this.parserOptions.indentBy = '\t';
      }
    }
  }

  /**
   *  parse from string xml into js object
   * @param {string} xmlDocumentContent the binding operation object
   * @param {boolean} validateXML should validate the xml as well or not
   * @returns {object} the parsed object
   */
  parseToObject(xmlDocumentContent, validateXML = true) {
    if (!xmlDocumentContent) {
      throw new UserError('Provided WSDL definition is invalid.');
    }
    const fixedXML = fixComments(xmlDocumentContent),
      validationResult = fastXMLParser.validate(fixedXML, {
        allowBooleanAttributes: true
      });

    if (validateXML && validationResult !== true) {
      throw new UserError('Provided WSDL definition is invalid XML.');
    }

    let parsed = fastXMLParser.parse(fixedXML, optionsForFastXMLParser);

    if ((typeof result === 'object' && typeof result.err === 'object') || !parsed) {
      throw new UserError('Provided WSDL definition is invalid XML.');
    }
    return parsed;
  }

  /**
   *  parse from string xml into js object
   * @param {string} xmlDocumentContent the binding operation object
   * @returns {object} the parsed object
   */
  safeParseToObject(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      return '';
    }
    return fastXMLParser.parse(fixComments(xmlDocumentContent), optionsForFastXMLParser);
  }

  /**
  * Takes a jsonObject and parses to xml
  * @param {object} jsonObject the object to convert into xml
  * @param {string} protocol  the protocol to implement the message default 'soap'
  * @returns {string} the xml representation of the object
  */
  parseObjectToXML(jsonObject) {
    if (jsonObject === null || jsonObject === undefined) {
      throw new UserError('Provided WSDL definition is invalid.');
    }
    let parser = new Parser(this.parserOptions),
      xml = parser.parse(jsonObject);
    return xml;
  }
}

module.exports = {
  XMLParser
};
