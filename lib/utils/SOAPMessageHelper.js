const
  {
    SOAPBody
  } = require('./SOAPBody'),
  {
    SOAPHeader
  } = require('./SOAPHeader'),
  envelopeName =
    ':Envelope',
  bodyName =
    ':Body',
  headerName =
    ':Header',
  xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n',
  WsdlError = require('../WsdlError');


class SOAPMessageHelper {

  convertInputToMessage(rootParametersElement, headerInfo, protocol, parser) {

    let envelopeAndProtocol = protocol + envelopeName,
      jObj = {},
      bodyAndProtocol = protocol + bodyName,
      headerAndProtocol = protocol + headerName;
    jObj[envelopeAndProtocol] = {};
    jObj[envelopeAndProtocol]['@_xmlns:' + protocol] = this.getSOAPNamespaceFromProtocol(protocol);
    const soapParametersUtils = new SOAPBody(),
      soapHeaderUtils = new SOAPHeader();
    jObj[envelopeAndProtocol][headerAndProtocol] = soapHeaderUtils.create(headerInfo, protocol);
    jObj[envelopeAndProtocol][bodyAndProtocol] = soapParametersUtils.create(rootParametersElement,
      protocol);


    return xmlHeader + this.parseObjectToXML(jObj, parser);
  }


  /**
   * Determines the url of the named protocol depending on the protocol name
   * @param {string} protocol  the name of the protocol to look up for
   * @returns {string} url the url default the one for soap
   */
  getSOAPNamespaceFromProtocol(protocol) {
    var urls = {
      'soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'soap12': 'http://www.w3.org/2003/05/soap-envelope',
      'default': 'http://schemas.xmlsoap.org/soap/envelope/'
    };
    return (urls[protocol] || urls.default);
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
  SOAPMessageHelper
};
