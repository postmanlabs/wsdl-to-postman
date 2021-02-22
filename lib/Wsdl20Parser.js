const
  WsdlObject = require('./WsdlObject').WsdlObject,
  {
    parseFromXmlToObject,
    getPrincipalPrefix,
    getNamespaceByURL,
    getNamespaceByKey,
    getAllNamespaces,
    PARSER_ATRIBUTE_NAME_PLACE_HOLDER,
    XML_NAMESPACE_SEPARATOR,
    XML_NAMESPACE_DECLARATION,
    TARGET_NAMESPACE_SPEC
  } = require('./WsdlParserCommon'),
  WSDL_ROOT = 'description',
  WSDL_NS_URL = 'http://www.w3.org/ns/wsdl',
  SOAP_NS_URL = 'http://www.w3.org/ns/wsdl/soap',
  SOAP_12_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap12/',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  TNS_NS_KEY = 'xmlns:tns',
  HTTP_NS_URL = 'http://schemas.xmlsoap.org/wsdl/http/',
  SCHEMA_TAG = 'schema',
  ATRIBUTE_TYPES = 'types',
  WsdlError = require('./WsdlError');

class Wsdl20Parser {

  /**
   * Creates a WSDLObject
   * that represents the information of a WSDL object and that is
   * required to create a Postman collection
   * @param {string} xmlDocumentContent the content file in string
   * @returns {object} the WSDLObject
   */
  getWsdlObject(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      throw new WsdlError('xmlDocumentContent must have a value');
    }
    const parsedXml = this.parseFromXmlToObject(xmlDocumentContent);
    let wsdlObject = new WsdlObject();
    wsdlObject = this.assignNamespaces(wsdlObject, parsedXml);

    return wsdlObject;
  }

  /**
   * Reads the parsedXML object, look for the namespaces
   * build the objects and assign to the WSDLObject
   * creates new object of the entry
   * @param {WsdlObject} wsdlObject the object to populate
   * @param {object} parsedXml the content file in javascript object representation
   * @returns {object} the WSDLObject
   */
  assignNamespaces(wsdlObject, parsedXml) {
    let newWsdlObject = {
      ...wsdlObject
    };
    const allNameSpaces = this.getAllNamespaces(parsedXml),
      wsdlNamespace = this.getNamespaceByURL(parsedXml, WSDL_NS_URL),
      soapNamespace = this.getNamespaceByURL(parsedXml, SOAP_NS_URL),
      soap12Namespace = this.getNamespaceByURL(parsedXml, SOAP_12_NS_URL),
      schemaNamespace = this.getSchemaNamespace(parsedXml),
      HTTPNamespace = this.getNamespaceByURL(parsedXml, HTTP_NS_URL),
      tnsNamespace = this.getNamespaceByKey(parsedXml, TNS_NS_KEY),
      targerNamespace = this.getNamespaceByKey(parsedXml, TARGET_NAMESPACE_SPEC);

    newWsdlObject.targetNamespace = targerNamespace;
    newWsdlObject.wsdlNamespace = wsdlNamespace;
    newWsdlObject.SOAPNamespace = soapNamespace;
    newWsdlObject.SOAP12Namespace = soap12Namespace;
    newWsdlObject.schemaNamespace = schemaNamespace;
    newWsdlObject.tnsNamespace = tnsNamespace;
    newWsdlObject.allNameSpaces = allNameSpaces;
    newWsdlObject.HTTPNamespace = HTTPNamespace;

    return newWsdlObject;
  }

  getSchemaNamespace(parsedXml) {
    let schemaNamespace = this.getNamespaceByURL(parsedXml, SCHEMA_NS_URL);
    if (!schemaNamespace) {
      const principalPrefix = this.getPrincipalPrefix(parsedXml),
        descriptions = parsedXml[principalPrefix + WSDL_ROOT],
        types = descriptions[principalPrefix + ATRIBUTE_TYPES],
        schemaTag = Object.keys(types).find((key) => {
          if (key.includes(SCHEMA_TAG)) {
            return true;
          }
        }).split(':')[0],
        schemaNode = types[schemaTag + XML_NAMESPACE_SEPARATOR + SCHEMA_TAG],
        nameSpaceURL = schemaNode[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + XML_NAMESPACE_DECLARATION +
          XML_NAMESPACE_SEPARATOR + schemaTag];
      return {
        key: schemaTag,
        url: nameSpaceURL,
        isDefault: false
      };
    }
    return schemaNamespace;
  }

  /**
   *  converts from string xml into js object
   * @param {string} xmlDocumentContent the binding operation object
   * @returns {object} the parsed object
   */
  parseFromXmlToObject(xmlDocumentContent) {
    return parseFromXmlToObject(xmlDocumentContent);
  }

  /**
   * Finds the namespace for all the wsdl document
   * creates a namespace object with the found information
   * @param {object} xmlDocumentContent the doc content
   * @returns {NameSpace} the  new NameSpace object
   */
  getPrincipalPrefix(xmlDocumentContent) {
    return getPrincipalPrefix(xmlDocumentContent, WSDL_ROOT);
  }

  /**
   * Finds the namespace lookin by url
   * creates a namespace object with the found information
   * @param {object} parsedXml the binding operation object
   * @param {string} url the url to look for
   * @returns {NameSpace} the  new NameSpace object
   */
  getNamespaceByURL(parsedXml, url) {
    return getNamespaceByURL(parsedXml, url, WSDL_ROOT);
  }

  /**
   * Finds the namespace lookgin by its key
   * creates a namespace object with the found information
   * @param {object} parsedXml the binding operation object
   * @param {string} key the key to look for
   * @returns {NameSpace} the  new NameSpace object
   */
  getNamespaceByKey(parsedXml, key) {
    return getNamespaceByKey(parsedXml, key, WSDL_ROOT);
  }

  /**
   * Finds all the  namespaces of the document
   * creates a namespace array object with the found information
   * @param {object} parsedXml the binding operation object
   * @returns {[NameSpace]} the new [NameSpace] object
   */
  getAllNamespaces(parsedXml) {
    return getAllNamespaces(parsedXml, WSDL_ROOT);
  }

}

module.exports = {
  Wsdl20Parser,
  WSDL_NS_URL
};
