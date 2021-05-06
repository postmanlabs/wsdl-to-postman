const
  WsdlObject = require('./WSDLObject').WsdlObject,
  Operation = require('./WSDLObject').Operation,
  {
    getHttpVerb,
    POST_METHOD
  } = require('../lib/utils/httpUtils'),
  WsdlError = require('./WsdlError'),
  WSDL_ROOT = 'definitions',
  PORT_TYPE_TAG = 'portType',
  OPERATION_TAG = 'operation',
  BINDING_TAG = 'binding',
  PORT_TAG = 'port',
  ADDRESS_TAG = 'address',
  NAME_TAG = 'name',
  LOCATION_TAG = 'location',
  DOCUMENTATION_TAG = 'documentation',
  INPUT_TAG = 'input',
  OUTPUT_TAG = 'output',
  FAULT_TAG = 'fault',
  MESSAGE_TAG = 'message',
  PART_TAG = 'part',
  WSDL_NS_URL = 'http://schemas.xmlsoap.org/wsdl/',
  SOAP_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap/',
  SOAP_12_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap12/',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  XML_POLICY = 'http://schemas.xmlsoap.org/ws/2004/09/policy',
  TNS_NS_KEY = 'xmlns:tns',
  SOAP_NS_KEY = 'xmlns:soap',
  SOAP_12_NS_KEY = 'xmlns:soap12',
  HTTP_NS_KEY = 'xmlns:http',
  ATRIBUTE_NAME = 'name',
  ATRIBUTE_STYLE = 'style',
  ATRIBUTE_VERB = 'verb',
  ATRIBUTE_TYPE = 'type',
  ATRIBUTE_MESSAGE = 'message',
  ATRIBUTE_ELEMENT = 'element',
  TARGETNAMESPACE_KEY = 'targetNamespace',
  ATRIBUTE_LOCATION = 'location',

  {
    getArrayFrom
  } = require('./utils/objectUtils'),
  {
    parseFromXmlToObject,
    getPrincipalPrefix,
    getNamespaceByURL,
    getNamespaceByKey,
    getAllNamespaces,
    getServices,
    getBindings,
    getElementsFromWSDL,
    getSchemaNamespace,
    getNodeByName,
    getAttributeByName,
    THIS_NS_PREFIX,
    getBindingOperation,
    assignSecurity
  } = require('./WsdlParserCommon'),
  {
    getQNamePrefixFilter,
    getQNamePrefix
  } = require('./utils/XMLParsedUtils'),
  {
    DOC_HAS_NO_SERVICE_MESSAGE,
    DOC_HAS_NO_SERVICE_PORT_MESSAGE
  } = require('./constants/messageConstants'),
  {
    HTTP_PROTOCOL,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL
  } = require('./constants/processConstants'),
  {
    createErrorElement
  } = require('./utils/WSDLElementUtils');
class Wsdl11Parser {

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
    wsdlObject = this.assignOperations(wsdlObject, parsedXml);
    wsdlObject = this.assignSecurity(wsdlObject, parsedXml);
    wsdlObject.xmlParsed = parsedXml;
    wsdlObject.version = '1.1';
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
      soapNamespace = this.getNamespaceByKey(parsedXml, SOAP_NS_KEY),
      soap12Namespace = this.getNamespaceByKey(parsedXml, SOAP_12_NS_KEY),
      schemaNamespace = this.getSchemaNamespace(parsedXml),
      HTTPNamespace = this.getNamespaceByKey(parsedXml, HTTP_NS_KEY),
      tnsNamespace = this.getNamespaceByKey(parsedXml, TNS_NS_KEY),
      targetNamespace = this.getNamespaceByKey(parsedXml, TARGETNAMESPACE_KEY),
      securityPolicyNamespace = this.getNamespaceByURL(parsedXml, XML_POLICY);

    newWsdlObject.targetNamespace = targetNamespace;
    newWsdlObject.wsdlNamespace = wsdlNamespace;
    newWsdlObject.SOAPNamespace = soapNamespace;
    newWsdlObject.SOAP12Namespace = soap12Namespace;
    newWsdlObject.schemaNamespace = schemaNamespace;
    newWsdlObject.tnsNamespace = tnsNamespace;
    newWsdlObject.allNameSpaces = allNameSpaces;
    newWsdlObject.HTTPNamespace = HTTPNamespace;
    newWsdlObject.securityPolicyNamespace = securityPolicyNamespace;

    return newWsdlObject;
  }

  assignSecurity(wsdlObject, parsedXml) {
    return assignSecurity(wsdlObject, parsedXml, WSDL_ROOT);
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
  assignOperations(wsdlObject, parsedXml) {
    let newWsdlObject = { ...wsdlObject },
      wsdlOperations = [];
    const principalPrefix = this.getPrincipalPrefix(parsedXml),
      services = this.getServices(parsedXml),
      bindings = this.getBindings(parsedXml, newWsdlObject),
      elements = this.getElementsFromWSDL(parsedXml, principalPrefix,
        wsdlObject.schemaNamespace, wsdlObject.tnsNamespace);

    bindings.forEach((binding) => {
      const bindingTagInfo =
        this.getBindingInfoFromBindingTag(binding,
          newWsdlObject.SOAPNamespace,
          newWsdlObject.SOAP12Namespace,
          newWsdlObject.HTTPNamespace),
        bindingOperations = getBindingOperation(binding, principalPrefix, newWsdlObject),
        bindingTypeFilter =
          getAttributeByName(binding, ATRIBUTE_TYPE).replace(THIS_NS_PREFIX, '');

      bindingOperations.forEach((operation) => {
        let wsdlOperation = new Operation(),
          servicePort,
          service,
          portTypeOperation,
          serviceAndPort,
          portTypeOperationDocumentation;

        serviceAndPort = this.getServiceAndServicePortByBindingName(getAttributeByName(binding, NAME_TAG),
          services, principalPrefix, wsdlObject);
        service = serviceAndPort ? serviceAndPort.service : undefined;
        servicePort = serviceAndPort ? serviceAndPort.port : undefined;
        wsdlOperation.name = getAttributeByName(operation, ATRIBUTE_NAME);
        portTypeOperation = this.getPortTypeOperationByPortTypeNameAndOperationName(bindingTypeFilter,
          wsdlOperation.name,
          parsedXml, principalPrefix);
        portTypeOperationDocumentation = this.getPortTypeOperationDocumentation(portTypeOperation, principalPrefix);
        wsdlOperation.method = bindingTagInfo.verb;
        wsdlOperation.protocol = bindingTagInfo.protocol;
        wsdlOperation.style = this.getStyleFromBindingOperation(operation, bindingTagInfo);
        wsdlOperation.portName = this.getPortName(servicePort);
        wsdlOperation.serviceName = this.getServiceName(service);
        wsdlOperation.description = portTypeOperationDocumentation;

        wsdlOperation.input = this.getElementFromPortTypeOperation(parsedXml, portTypeOperation, elements,
          principalPrefix, INPUT_TAG);
        wsdlOperation.output = this.getElementFromPortTypeOperation(parsedXml, portTypeOperation, elements,
          principalPrefix, OUTPUT_TAG);
        wsdlOperation.fault = this.getElementFromPortTypeOperation(parsedXml, portTypeOperation, elements,
          principalPrefix, FAULT_TAG);
        wsdlOperation.url = this.getServiceURL(servicePort, operation, bindingTagInfo);
        wsdlOperation.xpathInfo = this.getOperationxPathInfo(bindingTagInfo.bindingName, wsdlOperation.name,
          wsdlObject.wsdlNamespace.url);
        wsdlOperations.push(wsdlOperation);
      });
    });
    newWsdlObject.operationsArray = wsdlOperations;

    return newWsdlObject;
  }

  /**
   * Returns an xpath for an operation
   * @param {string} bindingName binding name
   * @param {string} operationName self operation name
   * @param {string} wsdlNamespaceUrl wsdl url namespace
   * @returns {object} object with xpath and url
   */
  getOperationxPathInfo(bindingName, operationName, wsdlNamespaceUrl) {
    return {
      xpath: `//${WSDL_ROOT}//${BINDING_TAG}[@${ATRIBUTE_NAME}="${bindingName}"]` +
        `//${OPERATION_TAG}[@${ATRIBUTE_NAME}="${operationName}"]`,
      wsdlNamespaceUrl: wsdlNamespaceUrl
    };
  }

  /**
   * Gets the service url
   * if the service port is not defined return empty string
   * @param {object} servicePort the service port element tag information
   * @param {object} bindingOperation the binding operation element tag information
   * @param {object} bindingTagInfo the binding information for the binding
   * @returns {string} the service url
   */
  getServiceURL(servicePort, bindingOperation, bindingTagInfo) {
    if (!servicePort) {
      return '';
    }
    let keys = Object.keys(servicePort),
      addressKey = keys.find((key) => {
        if (key.includes(ADDRESS_TAG)) { return true; }
      }),
      serviceLocation = this.getLocationFromBindingOperation(bindingOperation, bindingTagInfo),
      address = servicePort[addressKey];
    return getAttributeByName(address, LOCATION_TAG) + serviceLocation;
  }

  /**
   * Gets the name of the service if is not defined
   * return empty string
   * @param {*} service the service element tag information
   * @returns {string} the service name
   */
  getServiceName(service) {
    return service ? getAttributeByName(service, NAME_TAG) : '';
  }

  /**
   * Gets the name of the service port if is not defined
   * return empty string
   * @param {*} servicePort the service->port element tag information
   * @returns {string} the service port name
   */
  getPortName(servicePort) {
    return servicePort ? getAttributeByName(servicePort, NAME_TAG) : '';
  }

  /**
   * gets the documentation information from the porttypeoperation
   * @param {object} portTypeOperation port type operation object
   * @param {*} principalPrefix the prefix for the wsdl
   * @returns {string} the documentation
   */
  getPortTypeOperationDocumentation(portTypeOperation, principalPrefix) {
    let documentation = getNodeByName(portTypeOperation, principalPrefix, DOCUMENTATION_TAG);
    return documentation ? this.getDocumentationStringFromNode(documentation) : '';
  }

  /**
   * if the element is a object then the parser populated
   * the propety #text then the node is the string
   * also replaces tabs and new lines from the string
   * @param {*} node the element the return as array
   * @returns {string} the documentation
   */
  getDocumentationStringFromNode(node) {
    if (typeof node === 'object') {
      return this.removeLineBreak(node['#text']);
    }
    return this.removeLineBreak(node);
  }

  /**
   * Removes new line characters of a string
   * @param {string} text the text to remove the new line characters
   * @returns {string} the modified text
   */
  removeLineBreak(text) {
    return text.replace(/(\r\n|\n|\r)/gm, '');
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
   * finds the element from the port type operation object
   * @param {object} parsedXml the content file in javascript object representation
   * @param {object} portTypeOperation por type operation to find the element
   * @param {object} elementsFromWSDL all the elements of the document
   * @param {string} principalPrefix the principal prefix of the document
   * @param {string} tag the tag for search of could be input output fault
   * @returns {object} the WSDLObject
   */
  getElementFromPortTypeOperation(parsedXml, portTypeOperation, elementsFromWSDL, principalPrefix, tag) {
    const information = getNodeByName(portTypeOperation, principalPrefix, tag);
    let messageName, elementName, element;
    if (information) {
      messageName = getAttributeByName(information, ATRIBUTE_MESSAGE);
      elementName = this.getMessageElementNameByMessageName(parsedXml, principalPrefix, messageName);
      element = elementsFromWSDL.find((element) => {
        return element.name === elementName;
      });
      if (element === undefined) {
        return createErrorElement(elementName);
      }
      return element;
    }
    return null;
  }

  /**
   * Finds all the elements from the types
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the wsdl prefix
   * @param {Namespace} schemaNameSpace the schema Namespace
   * @param {Namespace} thisNameSpace the Namespace of tns
   * @returns {[object]} the [elements] object
   */
  getElementsFromWSDL(parsedXml, principalPrefix, schemaNameSpace, thisNameSpace) {
    return getElementsFromWSDL(parsedXml, principalPrefix, WSDL_ROOT, schemaNameSpace, thisNameSpace);
  }

  /**
   * finds the element from the port type operation object
   * @param {object} parsedXml the content file in javascript object representation
   * @param {string} principalPrefix the principal prefix of the document
   * @param {string} messageName the name too look up for
   * @returns {object} the message from WSDLObject
   */
  getMessageElementNameByMessageName(parsedXml, principalPrefix, messageName) {
    let definitions = getNodeByName(parsedXml, principalPrefix, WSDL_ROOT),
      part, elementName,
      messageOnlyName = messageName.replace(THIS_NS_PREFIX, ''),
      messages = getArrayFrom(getNodeByName(definitions, principalPrefix, MESSAGE_TAG)),
      foundMessage = messages.find((message) => {
        return getAttributeByName(message, ATRIBUTE_NAME) === messageOnlyName;
      });
    if (foundMessage) {
      part = getNodeByName(foundMessage, principalPrefix, PART_TAG);
      elementName = getAttributeByName(part, ATRIBUTE_ELEMENT);
      if (!elementName || Array.isArray(elementName)) {
        return messageName.replace(THIS_NS_PREFIX, '');
      }
      elementName = elementName.replace(THIS_NS_PREFIX, '');
    }
    return elementName;
  }

  /**
   * Looks up for the service by binding name
   * @param {string} bindingName the object to populate
   * @param {array} services the object to populate
   * @param {string} principalPrefix the principal wsdl prefix
   * @param {WSDLObject} wsdlObject the wsdl object we are building
   * @returns {object} parsedXML service representation
   */
  getServiceAndServicePortByBindingName(bindingName, services, principalPrefix, wsdlObject) {
    if (!bindingName) {
      throw new WsdlError('BindingName must have a value');
    }
    if (principalPrefix === undefined || principalPrefix === null) {
      throw new WsdlError('PrincipalPrefix must have a value');
    }
    if (!services) {
      wsdlObject.log.logError(DOC_HAS_NO_SERVICE_MESSAGE + ' ' + bindingName);
      return;
    }
    try {
      let foundService = null,
        port = null,
        i = 0;
      for (i = 0; i < services.length; i++) {
        const ports = getArrayFrom(getNodeByName(services[i], principalPrefix, PORT_TAG));
        if (!ports) {
          break;
        }
        port = ports.find((port) => {
          return getAttributeByName(port, BINDING_TAG) === THIS_NS_PREFIX + bindingName;
        });
        if (port) {
          foundService = services[i];
          break;
        }
      }
      if (!port) {
        wsdlObject.log.logError(DOC_HAS_NO_SERVICE_PORT_MESSAGE + ' ' + bindingName);
        return;
      }

      return {
        service: foundService,
        port: port
      };
    }
    catch (error) {
      throw new WsdlError('Can not get service port from object');
    }
  }

  /**
   * Looks up for the port type operation by portype name and operation name
   * @param {string} portTypeName the port type name to look for
   * @param {string} operationName the operation name to look for
   * @param {object} parsedXml the parsed xml object from the parser
   * @param {string} principalPrefix the principal wsdl prefix
   * @returns {object} parsedXML porttype operation representation
   */
  getPortTypeOperationByPortTypeNameAndOperationName(portTypeName, operationName,
    parsedXml, principalPrefix) {
    let portTypeFound, operationReturn, operations;
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
      const definitions = getNodeByName(parsedXml, principalPrefix, WSDL_ROOT),
        arrayPortTypes = getArrayFrom(getNodeByName(definitions, principalPrefix, PORT_TYPE_TAG));
      portTypeFound = arrayPortTypes.find((portType) => {
        return getAttributeByName(portType, NAME_TAG) === portTypeName;
      });
      operations = getArrayFrom(getNodeByName(portTypeFound, principalPrefix, OPERATION_TAG));

      operationReturn = operations.find((operation) => {
        return getAttributeByName(operation, NAME_TAG) === operationName;
      });

      return operationReturn;
    }
    catch (error) {
      throw new WsdlError('Can not get port type from object');
    }
  }

  /**
   * Looks up for the style property in the binding operation tag
   * @param {string} operation the binding operation object
   * @param {string} bindingTagInfo the binding's binding son tag information
   * @returns {string} the style's property's value property
   */
  getStyleFromBindingOperation(operation, bindingTagInfo) {
    if (!operation || typeof operation !== 'object') {
      throw new WsdlError('Can not get style info from operation undefined or null object');
    }
    try {
      if (bindingTagInfo.protocol === SOAP_PROTOCOL ||
        bindingTagInfo.protocol === SOAP12_PROTOCOL) {
        return getAttributeByName(getNodeByName(operation, bindingTagInfo.protocolPrefix, OPERATION_TAG),
          ATRIBUTE_STYLE);
      }
    }
    catch (error) {
      throw new WsdlError('Can not get style info from operation');
    }
    return '';
  }

  /**
   * Looks up for the style property in the binding operation tag
   * @param {string} operation the binding operation object
   * @param {string} bindingTagInfo the binding's binding son tag information
   * @returns {string} the style's property's value property
   */
  getLocationFromBindingOperation(operation, bindingTagInfo) {
    if (!operation || typeof operation !== 'object') {
      throw new WsdlError('Can not get style info from operation undefined or null object');
    }
    try {
      if (bindingTagInfo.protocol === HTTP_PROTOCOL) {
        return getAttributeByName(getNodeByName(operation, bindingTagInfo.protocolPrefix, OPERATION_TAG),
          ATRIBUTE_LOCATION);
      }
    }
    catch (error) {
      throw new WsdlError('Can not get location info from operation');
    }
    return '';
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
   * Finds the namespace looking by url
   * creates a namespace object with the found information
   * @param {object} parsedXml the binding operation object
   * @param {string} url the url to look for
   * @returns {NameSpace} the  new NameSpace object
   */
  getNamespaceByURL(parsedXml, url) {
    return getNamespaceByURL(parsedXml, url, WSDL_ROOT);
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
   * Get the bindngs operations of the document
   * always returns an array
   * @param {object} binding the binding operation object
   * @param {object} principalPrefix the principal prefix
   * @param {object} wsdlObject wsdl object we are building
   * @returns {[object]} the information of the operation bindings
   */
  getBindingOperation(binding, principalPrefix, wsdlObject) {
    return getBindingOperation(binding, principalPrefix, wsdlObject);
  }

  /**
   * Get the port type operations of the document
   * always returns an array
   * @param {object} parsedXml the binding operation object
   * @returns {Array} the information of the por type operations
   */
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

  /**
   * Get the bindngs  of the document
   * always returns an array
   * @param {object} parsedXml the binding operation object
   * @param {WSDLObject} wsdlObject object we are building
   * @returns {Array} the information of the bindings
   */
  getBindings(parsedXml, wsdlObject) {
    return getBindings(parsedXml, WSDL_ROOT, wsdlObject);
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
   * gets the next information from the binding tag:
   * name, protocol, protocol prefix and the default verb
   * @param {object} binding the binding operation object
   * @param {NameSpace} soapNamespace the soap namespace information
   * @param {NameSpace} soap12Namespace the sopa 1.2 namespace information
   * @param {NameSpace} httpNamespace the http namespace information
   * @returns {object} a new object with the information
   */
  getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace, httpNamespace) {
    if (!binding || typeof binding !== 'object') {
      throw new WsdlError('Can not get binding info from undefined or null object');
    }
    let protocol = '',
      verb = '',
      protocolPrefix = '',
      bindingName = '',
      namespace = Object.keys(binding).find((key) => {
        if (key.includes(BINDING_TAG)) {
          return true;
        }
      });
    if (namespace === undefined) {
      throw new WsdlError('Can not get binding from object');
    }
    const protocolKey = getQNamePrefix(namespace);
    protocolPrefix = getQNamePrefixFilter(namespace);

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
      verb = getHttpVerb(getAttributeByName(binding[namespace], ATRIBUTE_VERB));
    }
    else {
      throw new WsdlError('Can not find protocol in those namespaces');
    }

    bindingName = getAttributeByName(binding, ATRIBUTE_NAME);

    return {
      protocol: protocol,
      protocolPrefix: protocolPrefix,
      verb: verb,
      bindingName: bindingName
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
  HTTP_PROTOCOL
};
