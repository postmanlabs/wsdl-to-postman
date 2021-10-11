const
  {
    SOAPBody
  } = require('./SOAPBody'),
  {
    Cache
  } = require('./Cache'),
  {
    hash
  } = require('./textUtils'),
  xmlHeader = '<?xml version="1.0" encoding="utf-8"?>\n';

class XMLMessageHelper {

  constructor() {
    this.cache = new Cache();
  }

  /**
  * hashes and input into a sha1 base64
  * @param {sting} input string to hash
  * @returns {string} the hashed input
  */
  hash(input) {
    return crypto.createHash('sha1').update(input).digest('base64');
  }


  /**
   * hashes and input into a sha1 base64
   * @param {object} rootParametersElement root element in message
   * @returns {string} the hashed for this input
   */
  getHashedKey(rootParametersElement) {
    return hash(JSON.stringify(rootParametersElement), 'sha1',
      'base64');
  }

  /**
   * Generates the body message from a nodeElement
   * @param {Element} rootParametersElement node taken from parsedXml
   * @param {boolean} xmlParser indicates if xmlns should be removed from the root node
   * @returns {string} the rootParametersElement in xml string
   */
  convertInputToMessage(rootParametersElement, xmlParser) {
    let jObj = {},
      resultMessage,
      cacheKey = this.getHashedKey(rootParametersElement),
      cachedElement = this.cache.getFromCache(cacheKey);
    if (cachedElement) {
      return cachedElement;
    }

    const soapParametersUtils = new SOAPBody(xmlParser);
    jObj = soapParametersUtils.create(rootParametersElement);
    resultMessage = xmlHeader + this.parseObjectToXML(jObj, xmlParser);
    this.cache.addToCache(cacheKey, resultMessage);
    return resultMessage;
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
