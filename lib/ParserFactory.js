const V11 = '1.1',
  V20 = '2.0',
  {
    Wsdl11Parser
  } = require('../lib/Wsdl11Parser'),
  {
    Wsdl20Parser
  } = require('../lib/Wsdl20Parser'),
  WsdlError = require('../lib/wsdlError');

/**
 * Class to construct the concrete parser
 * depending on the input file
 */
class ParserFactory {
  getParser(xmlDocumentContent) {
    let version = this.getWsdlVersion(xmlDocumentContent);
    if (version === V11) {
      return new Wsdl11Parser(xmlDocumentContent);
    }
    else if (version === V20) {
      return new Wsdl20Parser(xmlDocumentContent);
    }
  }

  /**
   * Creates a concrete implementation of the parser
   * depending on the input file
   * definitions for v 1.1
   * description for v 2.0
   * @param {string} xmlDocumentContent the content file in string
   * @returns {object} the concrete parser for each case throws error
   * if not found
   */
  getWsdlVersion(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      throw new WsdlError('Empty input was proportionated');
    }
    if (xmlDocumentContent.includes('definitions>')) {
      return V11;
    }
    if (xmlDocumentContent.includes('description>')) {
      return V20;
    }
    throw new WsdlError('Not WSDL Specification found in your document');
  }
}


module.exports = {
  ParserFactory,
  V11,
  V20
};
