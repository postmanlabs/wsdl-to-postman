const
  {
    SOAPBody
  } = require('./SOAPBody'),
  xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n';

class XMLMessageHelper {

  /**
   * Generates the body message from a nodeElement
   * @param {Element} rootParametersElement node taken from parsedXml
   * @param {boolean} xmlParser indicates if xmlns should be removed from the root node
   * @returns {string} the rootParametersElement in xml string
   */
  convertInputToMessage(rootParametersElement, xmlParser) {
    let jObj = {};
    const soapParametersUtils = new SOAPBody(xmlParser);
    jObj = soapParametersUtils.create(rootParametersElement);
    return xmlHeader + this.parseObjectToXML(jObj, xmlParser);
  }

  /**
 * Takes a jsonObject and parses to xml
 * @param {object} jsonObject the object to convert into xml
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @returns {string} the xml representation of the object
 */
  parseObjectToXML(jsonObject, xmlParser) {
    if (jsonObject === null || jsonObject === undefined) {
      throw new WsdlError('Cannot convert undefined or null to object');
    }
    let xml = xmlParser.parseObjectToXML(jsonObject);
    return xml;
  }

}

module.exports = {
  XMLMessageHelper
};
