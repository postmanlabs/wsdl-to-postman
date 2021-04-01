const Parser = require('fast-xml-parser').j2xParser,
  {
    SOAPParametersUtils
  } = require('./SOAPParametersUtils'),
  {
    SOAPHeaderUtils
  } = require('./SOAPHeaderUtils'),
  envelopeName =
  ':Envelope',
  bodyName =
  ':Body',
  headerName =
  ':Header',
  xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n',
  parserOptions = {
    ignoreAttributes: false,
    cdataTagName: '__cdata',
    format: true,
    indentBy: '  ',
    supressEmptyNode: false
  },
  WsdlError = require('../WsdlError');


class SOAPMessageHelper {

  convertInputToMessage(rootParametersElement, headerInfo, protocol) {

    let envelopeAndProtocol = protocol + envelopeName,
      jObj = {},
      bodyAndProtocol = protocol + bodyName,
      headerAndProtocol = protocol + headerName;
    jObj[envelopeAndProtocol] = {};
    jObj[envelopeAndProtocol]['@_xmlns:' + protocol] = this.getSOAPNamespaceFromProtocol(protocol);
    const soapParametersUtils = new SOAPParametersUtils(),
      soapHeaderUtils = new SOAPHeaderUtils();
    jObj[envelopeAndProtocol][headerAndProtocol] = soapHeaderUtils.convertObjectHeaderToJObj(headerInfo, protocol);
    jObj[envelopeAndProtocol][bodyAndProtocol] = soapParametersUtils.buildObjectParameters(rootParametersElement,
      protocol);


    return xmlHeader + this.parseObjectToXML(jObj);
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
  SOAPMessageHelper
};
