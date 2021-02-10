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
  WSDL_NS_URL = 'http://schemas.xmlsoap.org/wsdl/';


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
    return fastXMLParser.parse(xmlDocumentContent, optionsForFastXMLParser);
  }

  getNamespaceByURL(parsedXml, value) {
    const definitions = parsedXml.definitions;
    let namespace = Object.keys(definitions)
      .find((key) => {
        return definitions[key] === value;
      });
    namespace.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, '');
    var res = namespace.substring(namespace.indexOf(':') + 1, namespace.length);

    return {
      key: res,
      url: value,
      isDefault: res === XML_NAMESPACE_DECLARATION
    };
  }

  getNamespaceBykey(parsedXml, key) {
    let res = parsedXml[key];

    return {
      key: key.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, ''),
      url: res,
      isDefault: false
    };
  }

  getAllNamespaces(parsedXml) {
    let namespace = Object.keys(parsedXml)
      .filter(
        (key) => {
          return key.startsWith(PARSER_ATRIBUTE_NAME_PLACE_HOLDER + XML_NAMESPACE_DECLARATION) ||
            key === TARGET_NAMESPACE_SPEC;
        }
      )
      .map((key) => {
        return getNamespaceBykey(parsedXml, key);
      });

    return namespace;
  }
}


module.exports = {
  Wsdl11Parser,
  WSDL_NS_URL
};
