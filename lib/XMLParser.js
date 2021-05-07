const fastXMLParser = require('fast-xml-parser'),
  WsdlError = require('./WsdlError'),
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
}

module.exports = {
  XMLParser
};
