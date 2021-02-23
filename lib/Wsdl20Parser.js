const
  WsdlObject = require('./WsdlObject').WsdlObject,
  Operation = require('./WsdlObject').Operation,
  {
    parseFromXmlToObject,
    getPrincipalPrefix,
    getNamespaceByURL,
    getNamespaceByKey,
    getAllNamespaces,
    getServices,
    getBindings,
    getElementsFromWSDL,
    getArrayFrom,
    getSchemaNamespace,
    PARSER_ATRIBUTE_NAME_PLACE_HOLDER,
    TARGET_NAMESPACE_SPEC
  } = require('./WsdlParserCommon'),
  {
    getHttpVerb,
    POST_METHOD
  } = require('../lib/utils/httpUtils'),
  WSDL_ROOT = 'description',
  WSDL_NS_URL = 'http://www.w3.org/ns/wsdl',
  SOAP_NS_URL = 'http://www.w3.org/ns/wsdl/soap',
  SOAP_12_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap12/',
  TNS_NS_KEY = 'xmlns:tns',
  HTTP_NS_URL = 'http://schemas.xmlsoap.org/wsdl/http/',
  ATRIBUTE_TYPE = 'type',
  ATRIBUTE_METHOD_DEFAULT = 'methodDefault',
  ATRIBUTE_REF = 'ref',
  OPERATION_TAG = 'operation',
  ENDPOINT_TAG = 'endpoint',
  BINDING_TAG = 'binding',
  THIS_NS_PREFIX = 'tns:',
  NAME_TAG = 'name',
  ADDRESS_TAG = 'address',
  INTERFACE_TAG = 'interface',
  SOAP_PROTOCOL = 'soap',
  HTTP_PROTOCOL = 'HTTP',
  SOAP12_PROTOCOL = 'soap12',
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

  /**
   * Reads the parsedXML object, look for the operations
   * every operation will map to a PostmanCollection request
   * build the objects and assign to the WSDLObject
   * creates new object of the entry
   * @param {WsdlObject} wsdlObject the object to populate
   * @param {object} parsedXml the content file in javascript object representation
   * @param {string} schemaPrefix the prefix for the schema
   * @returns {object} the WSDLObject
   */
  assignOperations(wsdlObject, parsedXml, schemaPrefix) {
    let newWsdlObject = {
        ...wsdlObject
      },
      wsdlOperations = [];
    const principalPrefix = this.getPrincipalPrefix(parsedXml),
      services = this.getServices(parsedXml),
      bindings = this.getBindings(parsedXml),
      elements = this.getElementsFromWSDL(parsedXml, principalPrefix, schemaPrefix);

    bindings.forEach((binding) => {
      const bindingOperations = this.getArrayFrom(binding[principalPrefix + OPERATION_TAG]),
        bindingInterfaceName =
        binding[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + INTERFACE_TAG].replace(THIS_NS_PREFIX, ''),
        bindingTagInfo = this.getBindingInfoFromBindinTag(binding,
          newWsdlObject.SOAPNamespace,
          newWsdlObject.SOAP12Namespace,
          newWsdlObject.HTTPNamespace);

      bindingOperations.forEach((operation) => {
        let wsdlOperation = new Operation(),
          wsdlOperationRef = operation[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_REF].replace(THIS_NS_PREFIX, ''),
          serviceEndpoint = this.getServiceEndpointByBindingName(binding[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG],
            services, principalPrefix),
          interfaceOperation = this.getInterfaceOperationByInterfaceNameAndOperationName(
            bindingInterfaceName,
            wsdlOperationRef,
            parsedXml, principalPrefix),
          service = this.getServiceByBindingName(binding[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG],
            services, principalPrefix);

        wsdlOperation.name = interfaceOperation[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG];
        wsdlOperation.url = serviceEndpoint[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ADDRESS_TAG];
        wsdlOperation.method = bindingTagInfo.verb;
        wsdlOperation.protocol = bindingTagInfo.protocol;
        wsdlOperation.portName = serviceEndpoint[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG];
        wsdlOperation.serviceName = service[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG];

        wsdlOperations.push(wsdlOperation);
      });
    });
    newWsdlObject.operationsArray = wsdlOperations;
    return newWsdlObject;
  }


  getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace, httpNamespace) {
    const type = binding[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE];
    let protocol = '',
      verb = '',
      protocolPrefix = '';

    if (type === soapNamespace.url) {
      protocol = SOAP_PROTOCOL;
      verb = POST_METHOD;
      protocolPrefix = soapNamespace.key;
    }
    else if (type === soap12Namespace.url) {
      protocol = SOAP12_PROTOCOL;
      verb = POST_METHOD;
      protocolPrefix = soapNamespace.key;
    }
    else if (type === httpNamespace.url) {
      protocol = HTTP_PROTOCOL;
      verb = getHttpVerb(binding[PARSER_ATRIBUTE_NAME_PLACE_HOLDER +
        httpNamespace.key + ':' + ATRIBUTE_METHOD_DEFAULT]);
      protocolPrefix = soapNamespace.key;
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
        endpoint = null;
      services.forEach((service) => {
        const endpoints = this.getArrayFrom(service[principalPrefix + ENDPOINT_TAG]);
        endpoint = endpoints.find((endpoint) => {
          return endpoint[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + BINDING_TAG] === 'tns:' + bindingName;
        });
        if (endpoint) {
          foundService = service;
        }
      });
      return foundService;
    }
    catch (error) {
      throw new WsdlError('Can not get service port from object');
    }
  }

  /**
   * Finds the schema namespace, could be on root or
   * defined in the types schema tag
   * creates a namespace array object with the found information
   * @param {object} parsedXml the binding operation object
   * @param {string} wsdlRoot the root tag for the document
   * @returns {[object]} the [elements] object
   */
  getSchemaNamespace(parsedXml) {
    return getSchemaNamespace(parsedXml, WSDL_ROOT);
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

  /**
   * Finds all the services of the document
   * creates a namespace array object with the found information
   * @param {object} parsedXml the binding operation object
   * @returns {[NameSpace]} the [services] object
   */
  getServices(parsedXml) {
    return getServices(parsedXml, WSDL_ROOT);
  }

  /**
   * Get the bindngs  of the document
   * always returns an array
   * @param {object} parsedXml the binding operation object
   * @returns {[object]} the information of the bindings
   */
  getBindings(parsedXml) {
    return getBindings(parsedXml, WSDL_ROOT);
  }

  /**
   * Finds all the elements from the types
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the wsdl prefix
   * @param {string} schemaPrefix the schema elements prefix
   * @param {string} wsdlRoot the root tag for the document
   * @returns {[object]} the [elements] object
   */
  getElementsFromWSDL(parsedXml, principalPrefix, schemaPrefix) {
    return getElementsFromWSDL(parsedXml, principalPrefix, schemaPrefix, WSDL_ROOT);
  }

  getArrayFrom(element) {
    return getArrayFrom(element);
  }

  /**
   * Looks up for the service port by binding name
   * @param {string} bindingName the object to populate
   * @param {array} services the object to populate
   * @param {string} principalPrefix the object to populate
   * @returns {object} parsed service port representation
   */
  getServiceEndpointByBindingName(bindingName, services, principalPrefix) {
    if (!bindingName) {
      throw new WsdlError('BindingName must have a value');
    }
    if (principalPrefix === undefined || principalPrefix === null) {
      throw new WsdlError('PrincipalPrefix must have a value');
    }
    if (!services) {
      throw new WsdlError('Can not get service endpoint from undefined or null object');
    }
    try {
      let endpoint;
      services.forEach((service) => {
        const endpoints = this.getArrayFrom(service[principalPrefix + ENDPOINT_TAG]);
        endpoint = endpoints.find((endpoint) => {
          return endpoint[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + BINDING_TAG] === THIS_NS_PREFIX + bindingName;
        });
      });
      if (!endpoint) {
        throw new WsdlError('Can not get service endpoint from object');
      }
      return endpoint;
    }
    catch (error) {
      throw new WsdlError('Can not get service endpoint from object');
    }
  }

  /**
   * Looks up for the port type operation by portype name and operation name
   * @param {string} interfaceName the interface name to look for
   * @param {string} operationName the operation name to look for
   * @param {object} parsedXml the parsed xml object from the parser
   * @param {string} principalPrefix the principal wsdl prefix
   * @returns {object} parsedXML porttype operation representation
   */
  getInterfaceOperationByInterfaceNameAndOperationName(interfaceName, operationName,
    parsedXml, principalPrefix) {
    let interfaceFound, operationReturn, operations;
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get porttype from undefined or null object');
    }
    if (!interfaceName) {
      throw new WsdlError('Can not get port type with no filter name');
    }
    if (!operationName) {
      throw new WsdlError('Can not get port type with no filter operationName');
    }
    try {
      const definitions = parsedXml[principalPrefix + WSDL_ROOT],
        arrayInterfaces = this.getArrayFrom(definitions[principalPrefix + INTERFACE_TAG]);
      interfaceFound = arrayInterfaces.find((actualInterface) => {
        return actualInterface[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + NAME_TAG] ===
          interfaceName;
      });
      operations = this.getArrayFrom(interfaceFound[principalPrefix + OPERATION_TAG]);

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
}

module.exports = {
  Wsdl20Parser,
  WSDL_NS_URL
};
