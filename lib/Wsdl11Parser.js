const WsdlObject = require('./WsdlObject').WsdlObject,
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
  PORT_TYPE_TAG = 'portType',
  OPERATION_TAG = 'operation',
  BINDING_TAG = 'binding',
  SERVICE_TAG = 'service',
  XML_NAMESPACE_SEPARATOR = ':',
  WSDL_NS_URL = 'http://schemas.xmlsoap.org/wsdl/',
  SOAP_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap/',
  SOAP_12_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap12/',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  TNS_NS_KEY = 'xmlns:tns',
  TARGETNAMESPACE_KEY = 'targetNamespace';
class Wsdl11Parser {

  getWsdlObject(xmlDocumentContent) {
    const parsedXml = parser.parseFromXmlToObject(xmlDocumentContent);
    let wsdlObject = new WsdlObject();
    wsdlObject = this.assignNamespaces(wsdlObject, parsedXml);
    return wsdlObject;
  }

  assignNamespaces(wsdlObject, parsedXml) {
    let newWsdlObject = {
      ...wsdlObject
    };
    const allNameSpaces = this.getAllNamespaces(parsedXml),
      wsdlNamespace = this.getNamespaceByURL(parsedXml, WSDL_NS_URL),
      soapNamespace = this.getNamespaceByURL(parsedXml, SOAP_NS_URL),
      soap12Namespace = this.getNamespaceByURL(parsedXml, SOAP_12_NS_URL),
      schemaNamespace = this.getNamespaceByURL(parsedXml, SCHEMA_NS_URL),
      tnsNamespace = this.getNamespaceBykey(parsedXml, TNS_NS_KEY),
      targerNamespace = this.getNamespaceBykey(parsedXml, TARGETNAMESPACE_KEY);

    newWsdlObject.targetNamespace = targerNamespace;
    newWsdlObject.wsdlNamespace = wsdlNamespace;
    newWsdlObject.SOAPNamespace = soapNamespace;
    newWsdlObject.SOAP12Namespace = soap12Namespace;
    newWsdlObject.schemaNamespace = schemaNamespace;
    newWsdlObject.tnsNamespace = tnsNamespace;
    newWsdlObject.allNameSpaces = allNameSpaces;
    return newWsdlObject;
  }

  // assignOperations(wsdlObject, parsedXml) {
  //   let newWsdlObject = {
  //     ...wsdlObject
  //   };
  //   // const bindings = this.getBindings(parsedXml),
  //   //   services = this.getServices(parsedXml, WSDL_NS_URL);

  //   // newWsdlObject.targetNamespace = targerNamespace;
  //   // newWsdlObject.wsdlNamespace = wsdlNamespace;
  //   return newWsdlObject;
  // }


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
      throw new WsdlError('Can not get namespace from undefined or null object');
    }
    try {
      const principalPrefix = this.getPrincipalPrefix(parsedXml),
        definitions = parsedXml[principalPrefix + WSDL_ROOT];
      let namespaceKey = Object.keys(definitions)
        .find((key) => {
          return definitions[key] === url;
        });
      if (namespaceKey) {
        let namespace = namespaceKey.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, '');
        namespace.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, '');
        var res = namespace.substring(namespace.indexOf(XML_NAMESPACE_SEPARATOR) + 1, namespace.length);
        return {
          key: res,
          url: url,
          isDefault: res === XML_NAMESPACE_DECLARATION
        };
      }
      return null;
    }
    catch (error) {
      throw new WsdlError('Can not get namespace from object');
    }
  }

  getPrincipalPrefix(parsedXml) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get prefix from undefined or null object');
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
      throw new WsdlError('Can not get namespace from undefined or null object');
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
      throw new WsdlError('Can not get namespaces from undefined or null object');
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

  getPortypeOperations(parsedXml) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get portypes from undefined or null object');
    }
    try {
      let operations = [];
      const principalPrefix = this.getPrincipalPrefix(parsedXml),
        definitions = parsedXml[principalPrefix + WSDL_ROOT],
        portTtypes = definitions[principalPrefix + PORT_TYPE_TAG];

      if (portTtypes && Array.isArray(portTtypes)) {
        operations = portTtypes.map((portType) => {
          return portType[principalPrefix + OPERATION_TAG];
        }, []);
        return operations.flat();
      }
      return portTtypes[principalPrefix + OPERATION_TAG];
    }
    catch (error) {
      throw new WsdlError('Can not get portypes from object');
    }
  }

  getBindings(parsedXml) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get bindings from undefined or null object');
    }
    try {
      const principalPrefix = this.getPrincipalPrefix(parsedXml),
        definitions = parsedXml[principalPrefix + WSDL_ROOT],
        bindings = definitions[principalPrefix + BINDING_TAG];

      if (bindings && !Array.isArray(bindings)) {
        return [bindings];
      }
      return bindings;
    }
    catch (error) {
      throw new WsdlError('Can not get bindings from object');
    }

  }

  getServices(parsedXml) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get services from undefined or null object');
    }
    try {
      const principalPrefix = this.getPrincipalPrefix(parsedXml),
        definitions = parsedXml[principalPrefix + WSDL_ROOT],
        services = definitions[principalPrefix + SERVICE_TAG];

      if (services && !Array.isArray(services)) {
        return [services];
      }
      return services;
    }
    catch (error) {
      throw new WsdlError('Can not get services from object');
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
