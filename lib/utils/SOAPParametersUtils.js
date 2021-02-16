const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n',
  Parser = require('fast-xml-parser').j2xParser,
  {
    BFSSoapParametersHelper
  } = require('../../lib/utils/BFSSoapParametersHelper'),
  WsdlError = require('../WsdlError'),
  parserOptions = {
    ignoreAttributes: false,
    cdataTagName: '__cdata',
    format: true,
    indentBy: '  ',
    supressEmptyNode: false
  };

/**
 * Class to map some element nodes into xml messages
 * for soap calls
 */
class SOAPParametersUtils {

  /**
   * Takes a node representing the message for a soap call
   * returns an object with default values depending on the object type
   * @param {*} element the root tnode for the message parameters
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @returns {string} the message xml with the structure determined in the
   * elements and the default values examples
   */
  converObjectParametersToXML(element, protocol) {
    const parametersUtils = new BFSSoapParametersHelper(),
      parser = new Parser(parserOptions);
    return xmlHeader + parser.parse(parametersUtils.convertFromNodeToJson(element, protocol));
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


  /**
   * Takes a node element and convert it to a javascript object representation
   * @param {object} element the object to convert into xml
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @returns {object} the object representation of the nodes
   */
  buildObjectParameters(element, protocol) {
    const parametersUtils = new BFSSoapParametersHelper();
    return parametersUtils.convertFromNodeToJson(element, protocol);
  }

}

module.exports = {
  SOAPParametersUtils,
  xmlHeader
};
