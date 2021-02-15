const
  WsdlObject = require('../lib/WSDLObject').WsdlObject,
  Operation = require('../lib/WSDLObject').Operation,
  optionsForFastXMLParser = {
    ignoreAttributes: false,
    ignoreNameSpace: false,
    parseNodeValue: true,
    trimValues: true
  },
  {
    getHttpVerb,
    POST_METHOD
  } = require('../lib/utils/httpUtils'),
  fastXMLParser = require('fast-xml-parser'),
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER = '@_',
  TARGET_NAMESPACE_SPEC = 'targetNamespace',
  XML_NAMESPACE_DECLARATION = 'xmlns',
  WsdlError = require('../lib/wsdlError'),
  WSDL_ROOT = 'definitions',
  PORT_TYPE_TAG = 'portType',
  OPERATION_TAG = 'operation',
  BINDING_TAG = 'binding',
  SERVICE_TAG = 'service',
  PORT_TAG = 'port',
  ADDRESS_TAG = 'address',
  NAME_TAG = 'name',
  LOCATION_TAG = 'location',
  DOCUMENTATION_TAG = 'documentation',
  XML_NAMESPACE_SEPARATOR = ':',
  WSDL_NS_URL = 'http://schemas.xmlsoap.org/wsdl/',
  SOAP_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap/',
  SOAP_12_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap12/',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  TNS_NS_KEY = 'xmlns:tns',
  SOAP_PROTOCOL = 'SOAP',
  HTTP_PROTOCOL = 'HTTP',
  SOAP12_PROTOCOL = 'SOAP12',
  ATRIBUTE_NAME = 'name',
  ATRIBUTE_STYLE = 'style',
  ATRIBUTE_VERB = 'verb',
  ATRIBUTE_TYPE = 'type',
  THIS_NS_PREFIX = 'tns:',
  TARGETNAMESPACE_KEY = 'targetNamespace';
class Wsdl11Parser {

  getWsdlObject(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      throw new WsdlError('xmlDocumentContent must have a value');
    }
    const parsedXml = parser.parseFromXmlToObject(xmlDocumentContent);
    let wsdlObject = new WsdlObject();
    wsdlObject = this.assignNamespaces(wsdlObject, parsedXml);
    wsdlObject = this.assignOperations(wsdlObject, parsedXml);
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

  assignOperations(wsdlObject, parsedXml) {
    let newWsdlObject = {
        ...wsdlObject
      },
      wsdlOperations = [];
    const principalPrefix = this.getPrincipalPrefix(parsedXml),
      services = this.getServices(parsedXml),
      bindings = this.getBindings(parsedXml);

    bindings.forEach((binding) => {
      const bindingTagInfo = this.getBindingInfoFromBindinTag(binding,
          newWsdlObject.SOAPNamespace,
          newWsdlObject.SOAP12Namespace),
        bindingOperations = binding[principalPrefix + OPERATION_TAG],
        bindingTypeFilter =
        binding[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE].replace(THIS_NS_PREFIX, '');

      bindingOperations.forEach((operation) => {
        let wsdlOperation = new Operation(),
          servicePort,
          addressKey,
          service,
          address,
          portTypeOperation,
          portTypeOperationDocumentation;
        wsdlOperation.name = operation[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME];
        wsdlOperation.method = bindingTagInfo.verb;
        wsdlOperation.protocol = bindingTagInfo.protocol;
        wsdlOperation.style = this.getStyleFromBindingOperation(operation, bindingTagInfo);
        servicePort = this.getServicePortByBindingName(binding[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG],
          services, principalPrefix);
        service = this.getServiceByBindingName(binding[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG],
          services, principalPrefix);
        portTypeOperation = this.getPortTypeOperationByPortTypeNameAndOperationName(bindingTypeFilter,
          wsdlOperation.name,
          parsedXml, principalPrefix);
        portTypeOperationDocumentation = portTypeOperation[principalPrefix + DOCUMENTATION_TAG];

        addressKey = Object.keys(servicePort).find((key) => {
          if (key.includes(ADDRESS_TAG)) {
            return true;
          }
        });
        address = servicePort[addressKey];

        wsdlOperation.url = address[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + LOCATION_TAG];
        wsdlOperation.portName = servicePort[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG];
        wsdlOperation.serviceName = service[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG];
        wsdlOperation.description = portTypeOperationDocumentation.replace(/(\r\n|\n|\r)/gm, '');
        wsdlOperations.push(wsdlOperation);
      });
    });
    newWsdlObject.operationsArray = wsdlOperations;

    return newWsdlObject;
  }

  getServicePortByBindingName(bindingName, services, principalPrefix) {
    if (!bindingName) {
      throw new WsdlError('BindingName must have a value');
    }
    if (principalPrefix === undefined || principalPrefix === null) {
      throw new WsdlError('PrincipalPrefix must have a value');
    }
    if (!services) {
      throw new WsdlError('Can not get service port from undefined or null object');
    }
    try {
      let port = null;
      services.forEach((service) => {
        const ports = service[principalPrefix + PORT_TAG];
        port = ports.find((port) => {
          return port[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + BINDING_TAG] === THIS_NS_PREFIX + bindingName;
        });
      });

      return port;
    }
    catch (error) {
      throw new WsdlError('Can not get service port from object');
    }
  }

  getServiceByBindingName(bindingName, services, principalPrefix) {
    if (!bindingName) {
      throw new WsdlError('BindingName must have a value');
    }
    if (principalPrefix === undefined || principalPrefix === null) {
      throw new WsdlError('PrincipalPrefix must have a value');
    }
    if (!services) {
      throw new WsdlError('Can not get service port from undefined or null object');
    }
    try {
      let foundService = null,
        port = null;
      services.forEach((service) => {
        const ports = service[principalPrefix + PORT_TAG];
        port = ports.find((port) => {
          return port[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + BINDING_TAG] === 'tns:' + bindingName;
        });
        if (port) {
          foundService = service;
        }
      });
      return foundService;
    }
    catch (error) {
      throw new WsdlError('Can not get service port from object');
    }
  }

  getPortTypeOperationByPortTypeNameAndOperationName(portTypeName, operationName,
    parsedXml, principalPrefix) {
    let arrayPortTypes, portTypeFound, operationReturn, operations;
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get porttype from undefined or null object');
    }
    if (!portTypeName) {
      throw new WsdlError('Can not get port type with no filter name');
    }
    if (!operationName) {
      throw new WsdlError('Can not get port type with no filter operationName');
    }
    try {
      const definitions = parsedXml[principalPrefix + WSDL_ROOT],
        portTypes = definitions[principalPrefix + PORT_TYPE_TAG];

      if (portTypes && !Array.isArray(portTypes)) {
        arrayPortTypes = [portTypes];
      }
      else {
        arrayPortTypes = portTypes;
      }
      portTypeFound = arrayPortTypes.find((portType) => {
        return portType[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG] ===
          portTypeName;
      });
      operations = portTypeFound[principalPrefix + OPERATION_TAG];

      operationReturn = operations.find((operation) => {
        return operation[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG] ===
          operationName;
      });

      return operationReturn;
    }
    catch (error) {
      throw new WsdlError('Can not get port type from object');
    }
  }

  getStyleFromBindingOperation(operation, bindingTagInfo) {
    if (!operation || typeof operation !== 'object') {
      throw new WsdlError('Can not get style info from operation undefined or null object');
    }
    try {
      if (bindingTagInfo.protocol === SOAP_PROTOCOL ||
        bindingTagInfo.protocol === SOAP12_PROTOCOL) {
        return operation[bindingTagInfo.protocolPrefix +
          OPERATION_TAG][PARSER_ATRIBUTE_NAME_PLACE_HOLDER +
          ATRIBUTE_STYLE
        ];
      }
    }
    catch (error) {
      throw new WsdlError('Can not get style info from operation');
    }
    return '';
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

  getPortTypeOperations(parsedXml) {
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

  getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace, httpNamespace) {
    if (!binding || typeof binding !== 'object') {
      throw new WsdlError('Can not get binding info from undefined or null object');
    }
    let protocol = '',
      verb = '',
      protocolPrefix = '',
      namespace = Object.keys(binding).find((key) => {
        if (key.includes(BINDING_TAG)) {
          return true;
        }
      });
    if (namespace === undefined) {
      throw new WsdlError('Can not get binding from object');
    }
    const protocolKey = namespace.split(XML_NAMESPACE_SEPARATOR)[0];
    protocolPrefix = namespace.substring(0, namespace.indexOf(XML_NAMESPACE_SEPARATOR) + 1);

    if (soap12Namespace && protocolKey === soap12Namespace.key) {
      protocol = SOAP12_PROTOCOL;
      verb = POST_METHOD;
    }
    else if (soapNamespace && protocolKey === soapNamespace.key) {
      protocol = SOAP_PROTOCOL;
      verb = POST_METHOD;
    }
    else if (httpNamespace && protocolKey === httpNamespace.key) {
      protocol = HTTP_PROTOCOL;
      verb = getHttpVerb(binding[namespace][PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_VERB]);
    }
    else {
      throw new WsdlError('Can not find protocol in those namespaces');
    }

    return {
      protocol: protocol,
      protocolPrefix: protocolPrefix,
      verb: verb
    };
  }
}

module.exports = {
  Wsdl11Parser,
  WSDL_NS_URL,
  SOAP_NS_URL,
  SOAP_12_NS_URL,
  SCHEMA_NS_URL,
  TARGETNAMESPACE_KEY,
  TNS_NS_KEY,
  SOAP_PROTOCOL,
  SOAP12_PROTOCOL,
  HTTP_PROTOCOL,
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER
};
