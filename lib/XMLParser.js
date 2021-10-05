const fastXMLParser = require('fast-xml-parser'),
  Parser = require('fast-xml-parser').j2xParser,
  WsdlError = require('./WsdlError'),
  PARSER_ATTRIBUTE_NAME_PLACE_HOLDER = '@_',
  optionsForFastXMLParser = {
    ignoreAttributes: false,
    ignoreNameSpace: false,
    parseNodeValue: true,
    trimValues: true
  };
let parserOptions = {
  ignoreAttributes: false,
  cdataTagName: '__cdata',
  format: true,
  indentBy: '  ',
  supressEmptyNode: true
};

/**
 * Class to validate inputObject.
 */
class XMLParser {

  constructor(processOptions) {
    this.attributePlaceHolder = PARSER_ATTRIBUTE_NAME_PLACE_HOLDER;
    if (processOptions) {
      let {
        indentCharacter
      } = processOptions;
      if (indentCharacter) {
        parserOptions.indentBy = indentCharacter;
      }
    }
  }

  /**
   *  parse from string xml into js object
   * @param {string} xmlDocumentContent the binding operation object
   * @returns {object} the parsed object
   */
  parseToObject(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      throw new WsdlError('Empty input was proportionated');
    }
    const parsed = fastXMLParser.parse(xmlDocumentContent, optionsForFastXMLParser);
    if (!parsed) {
      throw new WsdlError('Not xml file found in your document');
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
    return fastXMLParser.parse(xmlDocumentContent, optionsForFastXMLParser);
  }

  /**
  * Takes a jsonObject and parses to xml
  * @param {object} jsonObject the object to convert into xml
  * @param {string} protocol  the protocol to implement the message default 'soap'
  * @returns {string} the xml representation of the object
  */
  parseObjectToXML(jsonObject) {
    if (jsonObject === null || jsonObject === undefined) {
      throw new WsdlError('Cannot convert undefined or null to object');
    }
    let parser = new Parser(parserOptions),
      xml = parser.parse(jsonObject);
    return xml;
  }
}

module.exports = {
  XMLParser
};
