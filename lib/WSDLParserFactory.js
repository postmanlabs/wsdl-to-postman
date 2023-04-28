const { WsdlInformationService11 } = require('./WsdlInformationService11');
const { WsdlInformationService20 } = require('./WsdlInformationService20');

const V11 = '1.1',
  V20 = '2.0',
  {
    WsdlParser
  } = require('../lib/WsdlParser'),
  UserError = require('../lib/UserError');

/**
 * Class to construct the concrete parser
 * depending on the input file
 */
class WSDLParserFactory {

  /**
   * Creates a concrete implementation of the parser
   * depending on the input file
   * definitions for v 1.1
   * description for v 2.0
   * @param {string} xmlDocumentContent the content file in string
   * @returns {object} the concrete parser for each case throws error
   * if not found
   */
  getParser(xmlDocumentContent) {
    let version = this.getWsdlVersion(xmlDocumentContent);
    if (version === V11) {
      return new WsdlParser(new WsdlInformationService11());
    }
    return new WsdlParser(new WsdlInformationService20());
  }

  /**
   * Creates a concrete implementation of the parser
   * depending on the input file
   * definitions for v 1.1
   * description for v 2.0
   * @param {string} version the document version
   * @returns {object} the concrete parser for each case throws error
   * if not found
   */
  getParserByVersion(version) {
    if (version === V11) {
      return new WsdlParser(new WsdlInformationService11());
    }
    return new WsdlParser(new WsdlInformationService20());
  }

  /**
   * Gets the WSDL Version
   * @param {string} xmlDocumentContent the content file in string
   * @returns {string} the version of the WSDL
   * if not found
   */
  getWsdlVersion(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      throw new UserError('Provided WSDL definition is invalid.');
    }
    if (xmlDocumentContent.includes('definitions>')) {
      return V11;
    }
    if (xmlDocumentContent.includes('description>')) {
      return V20;
    }
    throw new UserError('Provided WSDL definition is invalid.');
  }

  /**
   * Gets the WSDL Version
   * @param {string} xmlDocumentContent the content file in string
   * @returns {string} the version of the WSDL
   * if not found
   */
  getSafeWsdlVersion(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      throw new UserError('Provided WSDL definition is invalid.');
    }
    if (xmlDocumentContent.includes('definitions>')) {
      return V11;
    }
    if (xmlDocumentContent.includes('description>')) {
      return V20;
    }
  }
}


module.exports = {
  WSDLParserFactory,
  V11,
  V20
};
