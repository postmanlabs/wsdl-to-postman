const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n',
  {
    BFSSoapParametersHelper
  } = require('../../lib/utils/BFSSoapParametersHelper');

/**
 * Class to map some element nodes into xml messages
 * for soap calls
 */
class SOAPParametersUtils {

  /**
   * Takes a node element and convert it to a javascript object representation
   * @param {object} element the object to convert into xml
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @returns {object} the object representation of the nodes
   */
  buildObjectParameters(element) {
    const parametersUtils = new BFSSoapParametersHelper();
    return parametersUtils.convertFromNodeToJson(element);
  }

}

module.exports = {
  SOAPParametersUtils,
  xmlHeader
};
