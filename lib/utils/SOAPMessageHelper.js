const
  {
    SOAPBody
  } = require('./SOAPBody'),
  {
    Cache
  } = require('./Cache'),
  {
    SOAPHeader
  } = require('./SOAPHeader'),
  {
    hash
  } = require('./textUtils'),
  envelopeName =
    ':Envelope',
  bodyName =
    ':Body',
  headerName =
    ':Header',
  xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n',
  UserError = require('../UserError'),
  {
    EMPTY_ELEMENT_BY_DEFAULT
  } = require('../constants/processConstants');


class SOAPMessageHelper {

  constructor() {
    this.cache = new Cache();
  }

  /**
   * calculates the compound key
   * @param {object} rootParametersElement root element in message
   * @param {object} headerInfo the found information for the soap header
   * @param {string} protocol could be either soap or soap12
   * @param {function} concatString function to concatenate strings
   * @returns {string} the compound key
   */
  getCompundKey(rootParametersElement, headerInfo, protocol, concatString) {
    let headerInfoToUse;
    if (Array.isArray(headerInfo) && headerInfo.length > 0) {
      headerInfoToUse = headerInfo;
    }
    return concatString(JSON.stringify(rootParametersElement),
      concatString(JSON.stringify(headerInfoToUse), JSON.stringify(protocol)));
  }

  /**
   * concatenates two strings
   * @param {string} stringA the first string to concatenate
   * @param {string} stringB the second string to concatenate
   * @returns {string} the hashed for this input
   */
  concatString(stringA, stringB) {
    return stringA + stringB;
  }

  /**
   * hashes and input into a sha1 base64
   * @param {object} rootParametersElement root element in message
   * @param {object} headerInfo the found information for the soap header
   * @param {string} protocol could be either soap or soap12
   * @param {function} getCompundKey function to calculate the compund key
   * @param {function} concatString function to concatenate strings
   * @returns {string} the hashed for this input
   */
  getHashedKey(rootParametersElement, headerInfo, protocol, getCompundKey, concatString) {
    return hash(getCompundKey(rootParametersElement, headerInfo, protocol, concatString), 'sha1',
      'base64');
  }

  /**
   * Generates the body message from a nodeElement
   * @param {Element} rootParametersElement node taken from parsedXml
   * @param {Element} headerInfo node taken from parsedXml
   * @param {string} protocol Protocol being used
   * @param {Object} xmlParser the xml parser for the process
   * @returns {string} the rootParametersElement in xml string
   */
  convertInputToMessage(rootParametersElement, headerInfo, protocol, xmlParser) {
    let envelopeAndProtocol = protocol + envelopeName,
      jObj = {},
      headerElement = {},
      bodyAndProtocol = protocol + bodyName,
      resultMessage = '',
      cacheKey = this.getHashedKey(rootParametersElement, headerInfo, protocol, this.getCompundKey,
        this.concatString),
      headerAndProtocol = protocol + headerName,
      cachedElement = this.cache.getFromCache(cacheKey);
    if (cachedElement) {
      return cachedElement;
    }
    jObj[envelopeAndProtocol] = {};
    jObj[envelopeAndProtocol][`${xmlParser.attributePlaceHolder}xmlns:` + protocol] =
      this.getSOAPNamespaceFromProtocol(protocol);
    if (rootParametersElement && rootParametersElement.type === EMPTY_ELEMENT_BY_DEFAULT) {
      return '';
    }
    const soapParametersUtils = new SOAPBody(xmlParser),
      soapHeaderUtils = new SOAPHeader(xmlParser);

    if (Array.isArray(headerInfo) && headerInfo.length === 2) {
      if (Array.isArray(headerInfo[0])) {
        headerInfo[0].forEach((header) => {
          headerElement = { ...headerElement, ...soapParametersUtils.create(header, protocol) };
        });
      }
      headerElement = { ...headerElement,
        ...soapHeaderUtils.create(headerInfo[1], protocol) };

      if (Object.keys(headerElement).length > 0) {
        jObj[envelopeAndProtocol][headerAndProtocol] = headerElement;
      }
    }
    else {
      jObj[envelopeAndProtocol][headerAndProtocol] = soapHeaderUtils.create(headerInfo, protocol);
    }
    jObj[envelopeAndProtocol][bodyAndProtocol] = soapParametersUtils.create(rootParametersElement,
      protocol);

    resultMessage = xmlHeader + this.parseObjectToXML(jObj, xmlParser);
    this.cache.addToCache(cacheKey, resultMessage);
    return resultMessage;
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
      throw new UserError('Provided WSDL definition is invalid.');
    }
    let xml = xmlParser.parseObjectToXML(jsonObject);
    return xml;
  }

}

module.exports = {
  SOAPMessageHelper
};
