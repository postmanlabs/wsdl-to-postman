const
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
  MESSAGE_TAG = 'message',
  PART_TAG = 'part',
  WSDL_NS_URL = 'http://schemas.xmlsoap.org/wsdl/',
  SOAP_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap/',
  SOAP_12_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap12/',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  TNS_NS_KEY = 'xmlns:tns',
  ATRIBUTE_NAME = 'name',
  ATRIBUTE_STYLE = 'style',
  ATRIBUTE_VERB = 'verb',
  ATRIBUTE_MESSAGE = 'message',
  ATRIBUTE_ELEMENT = 'element',
  TARGETNAMESPACE_KEY = 'targetNamespace',
  ATRIBUTE_LOCATION = 'location',
  {
    getArrayFrom
  } = require('./utils/objectUtils'),
  {
    getPrincipalPrefix,
    getNodeByName,
    getAttributeByName,
    THIS_NS_PREFIX,
    getDocumentationStringFromNode
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

class WsdlInformationService11 {
  constructor() {
    this.version = '1.1';
  }

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
    return documentation ? getDocumentationStringFromNode(documentation) : '';
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
   * @param {string} bindingOperation the binding operation object
   * @param {string} bindingTagInfo the binding's binding son tag information
   * @returns {string} the style's property's value property
   */
  getStyleFromBindingOperation(bindingOperation, bindingTagInfo) {
    if (!bindingOperation || typeof bindingOperation !== 'object') {
      throw new WsdlError('Can not get style info from binding operation undefined or null object');
    }
    try {
      if (bindingTagInfo.protocol === SOAP_PROTOCOL ||
        bindingTagInfo.protocol === SOAP12_PROTOCOL) {
        return getAttributeByName(getNodeByName(bindingOperation, bindingTagInfo.protocolPrefix, OPERATION_TAG),
          ATRIBUTE_STYLE);
      }
    }
    catch (error) {
      throw new WsdlError('Can not get style info from binding operation');
    }
    return '';
  }

  /**
   * Looks up for the style property in the binding operation tag
   * @param {string} bindingOperation the binding operation object
   * @param {string} bindingTagInfo the binding's binding son tag information
   * @returns {string} the style's property's value property
   */
  getLocationFromBindingOperation(bindingOperation, bindingTagInfo) {
    if (!bindingOperation || typeof bindingOperation !== 'object') {
      throw new WsdlError('Can not get location info from binding operation undefined or null object');
    }
    try {
      if (bindingTagInfo.protocol === HTTP_PROTOCOL) {
        return getAttributeByName(getNodeByName(bindingOperation, bindingTagInfo.protocolPrefix, OPERATION_TAG),
          ATRIBUTE_LOCATION);
      }
    }
    catch (error) {
      throw new WsdlError('Can not get location info from binding operation');
    }
    return '';
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
      const principalPrefix = getPrincipalPrefix(parsedXml, WSDL_ROOT),
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
   * gets the next information from the binding tag:
   * name, protocol, protocol prefix and the default verb
   * @param {object} binding the WSDL's binding object
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
  WsdlInformationService11,
  WSDL_NS_URL,
  SOAP_NS_URL,
  SOAP_12_NS_URL,
  SCHEMA_NS_URL,
  TARGETNAMESPACE_KEY,
  TNS_NS_KEY,
  SOAP_PROTOCOL,
  SOAP12_PROTOCOL,
  HTTP_PROTOCOL,
  WSDL_ROOT
};
