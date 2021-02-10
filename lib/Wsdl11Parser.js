const WsdlObject = require('./WsdlObject'),
  optionsForFastXMLParser = {
    ignoreAttributes: false,
    ignoreNameSpace: false,
    parseNodeValue: true,
    trimValues: true
  },
  fastXMLParser = require('fast-xml-parser'),
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER = '@_',
  TARGET_NAMESPACE_SPEC = 'targetNamespace',
  XML_NAMESPACE_DECLARATION = 'xmlns',
  WsdlError = require('./WsdlError'),
  WSDL_ROOT = 'definitions',
  XML_NAMESPACE_SEPARATOR = ':',
  WSDL_NS_URL = 'http://schemas.xmlsoap.org/wsdl/',
  SOAP_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap/',
  SOAP_12_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap12/',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  TNS_NS_KEY = 'xmlns:tns',
  TARGETNAMESPACE_KEY = 'targetNamespace';
class Wsdl11Parser {

  getWsdlObject() {
    return new WsdlObject();
  }

  getWsdlOperations() {
    return {};
  }

  parseFromXmlToObject(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      throw new WsdlError('Empty input was proportionated');
    }
    const parsed = fastXMLParser.parse(xmlDocumentContent, optionsForFastXMLParser);
    if (!parsed) {
      throw new WsdlError('Not xml file found in your document');
    }
    return parsed;
  }

  getNamespaceByURL(parsedXml, url) {
    if (!url) {
      throw new WsdlError('URL must not be empty');
    }
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get namespace from undefind or null object');
    }
    try {
      const principalPrefix = this.getPrincipalPrefix(parsedXml),
        definitions = parsedXml[principalPrefix + WSDL_ROOT];
      let namespace = Object.keys(definitions)
        .find((key) => {
          return definitions[key] === url;
        }).replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, '');
      namespace.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, '');
      var res = namespace.substring(namespace.indexOf(XML_NAMESPACE_SEPARATOR) + 1, namespace.length);
      return {
        key: res,
        url: url,
        isDefault: res === XML_NAMESPACE_DECLARATION
      };
    }
    catch (error) {
      throw new WsdlError('Can not get namespace from object');
    }
  }

  getPrincipalPrefix(parsedXml) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get prefix from undefind or null object');
    }
    let namespace = Object.keys(parsedXml).find((key) => {
      if (key.includes(WSDL_ROOT)) {
        return true;
      }
    });
    if (namespace === undefined) {
      throw new WsdlError('Can not get prefix from object');
    }
    return namespace.substring(0, namespace.indexOf(XML_NAMESPACE_SEPARATOR) + 1);
  }

  getNamespaceBykey(parsedXml, key) {
    if (!key) {
      throw new WsdlError('key must not be empty');
    }
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get namespace from undefind or null object');
    }
    try {
      const principalPrefix = this.getPrincipalPrefix(parsedXml),
        definitions = parsedXml[principalPrefix + WSDL_ROOT];
      let res = definitions[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + key];

      return {
        key: key.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, ''),
        url: res,
        isDefault: key === XML_NAMESPACE_DECLARATION
      };
    }
    catch (error) {
      throw new WsdlError('Can not get namespace from object');
    }
  }

  getAllNamespaces(parsedXml) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get namespaces from undefind or null object');
    }
    try {
      const principalPrefix = this.getPrincipalPrefix(parsedXml),
        definitions = parsedXml[principalPrefix + WSDL_ROOT];
      let namespace = Object.keys(definitions)
        .filter(
          (key) => {
            return key.startsWith(PARSER_ATRIBUTE_NAME_PLACE_HOLDER + XML_NAMESPACE_DECLARATION) ||
              key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + TARGET_NAMESPACE_SPEC;
          }
        )
        .map((key) => {
          return this.getNamespaceBykey(parsedXml, key.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, ''));
        });

      return namespace;
    }
    catch (error) {
      throw new WsdlError('Can not get namespaces from object');
    }
  }
}


module.exports = {
  Wsdl11Parser,
  WSDL_NS_URL,
  SOAP_NS_URL,
  SOAP_12_NS_URL,
  SCHEMA_NS_URL,
  TARGETNAMESPACE_KEY,
  TNS_NS_KEY
};
