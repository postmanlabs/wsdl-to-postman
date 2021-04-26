const
  WsdlObject = require('./WSDLObject').WsdlObject,
  Operation = require('./WSDLObject').Operation,
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
    TARGET_NAMESPACE_SPEC,
    THIS_NS_PREFIX,
    getBindingOperation,
    assignSecurity
  } = require('./WsdlParserCommon'),
  {
    getArrayFrom
  } = require('./utils/objectUtils'),
  {
    getHttpVerb,
    POST_METHOD
  } = require('../lib/utils/httpUtils'),
  WSDL_ROOT = 'description',
  WSDL_NS_URL = 'http://www.w3.org/ns/wsdl',
  SOAP_NS_URL = 'http://www.w3.org/ns/wsdl/soap',
  SOAP_12_NS_URL = 'http://www.w3.org/ns/wsdl/soap',
  TNS_NS_KEY = 'xmlns:tns',
  HTTP_NS_URL = 'http://www.w3.org/ns/wsdl/http',
  XML_POLICY = 'http://schemas.xmlsoap.org/ws/2004/09/policy',
  ATRIBUTE_TYPE = 'type',
  ATRIBUTE_METHOD_DEFAULT = 'methodDefault',
  ATRIBUTE_REF = 'ref',
  ATRIBUTE_NAME = 'name',
  ATRIBUTE_VERSION = 'version',
  OPERATION_TAG = 'operation',
  ENDPOINT_TAG = 'endpoint',
  BINDING_TAG = 'binding',
  FAULT_TAG = 'fault',
  DOCUMENTATION_TAG = 'documentation',
  NAME_TAG = 'name',
  INPUT_TAG = 'input',
  OUTPUT_TAG = 'output',
  OUTFAULT_TAG = 'outfault',
  ADDRESS_TAG = 'address',
  INTERFACE_TAG = 'interface',
  ATRIBUTE_ELEMENT = 'element',
  ATRIBUTE_LOCATION = 'location',
  {
    HTTP_PROTOCOL,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL
  } = require('./constants/processConstants'),
  WsdlError = require('./WsdlError'),
  {
    XML_NAMESPACE_SEPARATOR,
    getQNameLocal
  } = require('./utils/XMLParsedUtils'),
  {
    DOC_HAS_NO_SERVICE_MESSAGE,
    DOC_HAS_NO_SERVICE_PORT_MESSAGE
  } = require('./constants/messageConstants'),
  {
    createErrorElement
  } = require('./utils/WSDLElementUtils');

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
    wsdlObject = this.assignOperations(wsdlObject, parsedXml);
    wsdlObject = this.assignSecurity(wsdlObject, parsedXml);
    wsdlObject.xmlParsed = parsedXml;
    wsdlObject.version = '2.0';
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
      schemaNamespace = getSchemaNamespace(parsedXml, WSDL_ROOT),
      HTTPNamespace = this.getNamespaceByURL(parsedXml, HTTP_NS_URL),
      tnsNamespace = this.getNamespaceByKey(parsedXml, TNS_NS_KEY),
      targerNamespace = this.getNamespaceByKey(parsedXml, TARGET_NAMESPACE_SPEC),
      securityPolicyNamespace = this.getNamespaceByURL(parsedXml, XML_POLICY);

    newWsdlObject.targetNamespace = targerNamespace;
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
    const principalPrefix = getPrincipalPrefix(parsedXml, WSDL_ROOT),
      services = this.getServices(parsedXml),
      bindings = this.getBindings(parsedXml, newWsdlObject),
      elements = this.getElementsFromWSDL(parsedXml, principalPrefix,
        wsdlObject.schemaNamespace, wsdlObject.tnsNamespace);

    bindings.forEach((binding) => {
      const bindingOperations = getBindingOperation(binding, principalPrefix, newWsdlObject),
        bindingInterfaceName =
          getAttributeByName(binding, INTERFACE_TAG).replace(THIS_NS_PREFIX, ''),
        bindingTagInfo = this.getBindingInfoFromBindinTag(binding,
          newWsdlObject.SOAPNamespace,
          newWsdlObject.SOAP12Namespace,
          newWsdlObject.HTTPNamespace),
        interfaceElement = this.getInterfaceByInterfaceName(bindingInterfaceName, parsedXml, principalPrefix);

      bindingOperations.forEach((operation) => {
        let interfaceOperationDocumentation = {},
          wsdlOperation = new Operation(),

          wsdlOperationRef = getAttributeByName(operation, ATRIBUTE_REF).replace(THIS_NS_PREFIX, ''),
          serviceAndEndpoint = this.getServiceAndServiceEndpointByBindingName(getAttributeByName(binding, NAME_TAG),
            services, principalPrefix, newWsdlObject),
          serviceEndpoint = serviceAndEndpoint ? serviceAndEndpoint.endpoint : undefined,
          interfaceOperation = this.getInterfaceOperationByInterfaceNameAndOperationName(
            bindingInterfaceName,
            wsdlOperationRef,
            parsedXml, principalPrefix),
          service = serviceAndEndpoint ? serviceAndEndpoint.service : undefined;
        interfaceOperationDocumentation = this.getInterfaceOperationDocumentation(interfaceOperation, principalPrefix);

        wsdlOperation.name = getAttributeByName(interfaceOperation, NAME_TAG);
        wsdlOperation.url = this.getServiceURL(serviceEndpoint, operation, bindingTagInfo);
        wsdlOperation.method = bindingTagInfo.verb;
        wsdlOperation.protocol = bindingTagInfo.protocol;
        wsdlOperation.portName = this.getPortName(serviceEndpoint);
        wsdlOperation.serviceName = this.getServiceName(service);
        wsdlOperation.description = interfaceOperationDocumentation;

        wsdlOperation.input = this.getElementFromInterfaceOperation(interfaceElement, interfaceOperation, elements,
          principalPrefix, INPUT_TAG);
        wsdlOperation.output = this.getElementFromInterfaceOperation(interfaceElement, interfaceOperation, elements,
          principalPrefix, OUTPUT_TAG);
        wsdlOperation.fault = this.getElementFromInterfaceOperation(interfaceElement, interfaceOperation, elements,
          principalPrefix, OUTFAULT_TAG);
        wsdlOperation.xpathInfo = this.getOperationxPathInfo(bindingTagInfo.bindingName, wsdlOperation.name,
          wsdlObject.wsdlNamespace.url, wsdlObject.tnsNamespace);

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
 * @param {string} tnsNamespace tnsNamespace information
 * @returns {object} object with xpath and url
 */
  getOperationxPathInfo(bindingName, operationName, wsdlNamespaceUrl, tnsNamespace) {
    return {
      xpath: `//${WSDL_ROOT}//${BINDING_TAG}[@${ATRIBUTE_NAME}="${bindingName}"]` +
        `//${OPERATION_TAG}[@${ATRIBUTE_REF}="${tnsNamespace.key + ':' + operationName}"]`,
      wsdlNamespaceUrl: wsdlNamespaceUrl
    };
  }

  assignSecurity(wsdlObject, parsedXml) {
    return assignSecurity(wsdlObject, parsedXml, WSDL_ROOT);
  }

  /**
   * Gets the service url
   * if the service port is not defined return empty string
   * @param {object} serviceEndpoint the service endpoint element tag information
   * @param {object} bindingOperation the binding operation element tag information
   * @param {object} bindingTagInfo the binding information for the binding
   * @returns {string} the service url
   */
  getServiceURL(serviceEndpoint, bindingOperation, bindingTagInfo) {
    if (!serviceEndpoint) {
      return '';
    }
    let serviceLocation = this.getLocationFromBindingOperation(bindingOperation, bindingTagInfo);
    return getAttributeByName(serviceEndpoint, ADDRESS_TAG) + serviceLocation;
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
   * @param {*} serviceEndpoint the service->endpoint element tag information
   * @returns {string} the service port name
   */
  getPortName(serviceEndpoint) {
    return serviceEndpoint ? getAttributeByName(serviceEndpoint, NAME_TAG) : '';
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
        return getAttributeByName(operation, bindingTagInfo.protocolPrefix +
          XML_NAMESPACE_SEPARATOR + ATRIBUTE_LOCATION);
      }
    }
    catch (error) {
      throw new WsdlError('Can not get location info from operation');
    }
    return '';
  }

  /**
   * Gets the documentation from the operation in a interface tag
   * if not found returns empty string
   * @param {*} interfaceOperation the operation object from interface tag
   * @param {string} principalPrefix the documents principal prefix
   * @returns {string} the documentation value
   */
  getInterfaceOperationDocumentation(interfaceOperation, principalPrefix) {
    let documentation = getNodeByName(interfaceOperation, principalPrefix, DOCUMENTATION_TAG);
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
      return node['#text'].replace(/(\r\n|\n|\r)/gm, '');
    }
    return node.replace(/(\r\n|\n|\r)/gm, '');
  }

  /**
   * if the element is a object then the parser populated
   * the propety #text then the node is the string
   * @param {*} binding the binding node to look up for information
   * @param {NameSpace} soapNamespace the documents found namespace
   * @param {NameSpace} soap12Namespace the documentos found namespace
   * @param {NameSpace} httpNamespace the documentos found namespace
   * @returns {object} the protocol information
   */
  getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace, httpNamespace) {
    const type = getAttributeByName(binding, ATRIBUTE_TYPE);
    let protocol = '',
      verb = '',
      bindingName = '',
      protocolPrefix = '';

    if ((soapNamespace && type === soapNamespace.url) || (soap12Namespace && type === soap12Namespace.url)) {
      let namespaceKey = soapNamespace ? soapNamespace.key : soap12Namespace.key,
        version = getAttributeByName(binding, namespaceKey + XML_NAMESPACE_SEPARATOR + ATRIBUTE_VERSION);
      if (version === '1.2') {
        protocol = SOAP12_PROTOCOL;
        protocol = SOAP12_PROTOCOL;
        verb = POST_METHOD;
        protocolPrefix = namespaceKey;
      }
      else {
        protocol = SOAP_PROTOCOL;
        verb = POST_METHOD;
        protocolPrefix = namespaceKey;
      }
    }
    else if (httpNamespace && type === httpNamespace.url) {
      protocol = HTTP_PROTOCOL;
      verb = getHttpVerb(getAttributeByName(binding, httpNamespace.key + XML_NAMESPACE_SEPARATOR +
        ATRIBUTE_METHOD_DEFAULT));
      protocolPrefix = httpNamespace.key;
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
   * @param {WSDLObject} wsdlObject the object we are building
   * @returns {[object]} the information of the bindings
   */
  getBindings(parsedXml, wsdlObject) {
    return getBindings(parsedXml, WSDL_ROOT, wsdlObject);
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
   * if an element is not an array then convert it to an array
   * @param {object} element the element the return as array
   * @returns {[object]} the array of objects
   */
  getArrayFrom(element) {
    return getArrayFrom(element);
  }

  /**
   * Looks up for the service port by binding name
   * @param {string} bindingName the object to populate
   * @param {array} services the object to populate
   * @param {string} principalPrefix the object to populate
   * @param {WSDLObject} wsdlObject object we are building
   * @returns {object} parsed service port representation
   */
  getServiceAndServiceEndpointByBindingName(bindingName, services, principalPrefix, wsdlObject) {
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
        endpoint = null,
        i = 0;
      for (i = 0; i < services.length; i++) {
        const endpoints = this.getArrayFrom(getNodeByName(services[i], principalPrefix, ENDPOINT_TAG));
        if (!endpoints) {
          break;
        }
        endpoint = endpoints.find((endpoint) => {
          return getAttributeByName(endpoint, BINDING_TAG) === THIS_NS_PREFIX + bindingName;
        });
        if (endpoint) {
          foundService = services[i];
          break;
        }
      }
      if (!endpoint) {
        wsdlObject.log.logError(DOC_HAS_NO_SERVICE_PORT_MESSAGE + ' ' + bindingName);
        return;
      }

      return {
        service: foundService,
        endpoint: endpoint
      };
    }
    catch (error) {
      throw new WsdlError('Can not get service endpoint from object');
    }
  }

  /**
   * Looks up for the interface operation by portype name and operation name
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
      const definitions = getNodeByName(parsedXml, principalPrefix, WSDL_ROOT),
        arrayInterfaces = this.getArrayFrom(getNodeByName(definitions, principalPrefix, INTERFACE_TAG));
      interfaceFound = arrayInterfaces.find((actualInterface) => {
        return getAttributeByName(actualInterface, NAME_TAG) === interfaceName;
      });
      operations = this.getArrayFrom(getNodeByName(interfaceFound, principalPrefix, OPERATION_TAG));
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
   * Looks up for the interface operation by portype name and operation name
   * @param {string} interfaceName the interface name to look for
   * @param {object} parsedXml the parsed xml object from the parser
   * @param {string} principalPrefix the principal wsdl prefix
   * @returns {object} parsedXML porttype operation representation
   */
  getInterfaceByInterfaceName(interfaceName,
    parsedXml, principalPrefix) {
    let interfaceFound;
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not interface from undefined or null object');
    }
    if (!interfaceName) {
      throw new WsdlError('Can not get interface with no filter name');
    }
    try {
      const definitions = getNodeByName(parsedXml, principalPrefix, WSDL_ROOT),
        arrayInterfaces = this.getArrayFrom(getNodeByName(definitions, principalPrefix, INTERFACE_TAG));
      interfaceFound = arrayInterfaces.find((actualInterface) => {
        return getAttributeByName(actualInterface, NAME_TAG) === interfaceName;
      });
      return interfaceFound;
    }
    catch (error) {
      throw new WsdlError('Can not get interface from object');
    }
  }

  /**
   * finds the element from the interface operation object
   * @param {object} interfaceElement the interface from wsdl
   * @param {object} interfaceOperation interface operation to find the element
   * @param {object} elementsFromWSDL all the elements of the document
   * @param {string} principalPrefix the principal prefix of the document
   * @param {string} tag the tag for search of could be input output fault
   * @returns {object} the WSDLObject
   */
  getElementFromInterfaceOperation(interfaceElement, interfaceOperation, elementsFromWSDL, principalPrefix, tag) {
    if (tag === OUTFAULT_TAG) {
      return this.getElementFromInterfaceOperationFault(interfaceElement,
        interfaceOperation, elementsFromWSDL, principalPrefix, tag);
    }
    return this.getElementFromInterfaceOperationInOut(interfaceOperation, elementsFromWSDL, principalPrefix, tag);
  }

  /**
   * finds the element from the interface operation object when is called
   * for input or output
   * @param {object} interfaceOperation interface operation to find the element
   * @param {object} elementsFromWSDL all the elements of the document
   * @param {string} principalPrefix the principal prefix of the document
   * @param {string} tag the tag for search of could be input output fault
   * @returns {object} the WSDLObject
   */
  getElementFromInterfaceOperationInOut(interfaceOperation, elementsFromWSDL, principalPrefix, tag) {
    const information = interfaceOperation[principalPrefix + tag];
    let elementName, element;
    if (information) {
      elementName = getAttributeByName(information, ATRIBUTE_ELEMENT);
      element = elementsFromWSDL.find((element) => {
        let fixedName = getQNameLocal(elementName);
        return element.name === fixedName;
      });
      if (element === undefined) {
        return createErrorElement(elementName);
      }
      return element;
    }
    return null;
  }

  /**
   * finds the element from the interface operation object when is called
   * with fault tag
   * @param {object} interfaceElement the interface from wsdl
   * @param {object} interfaceOperation interface operation to find the element
   * @param {object} elementsFromWSDL all the elements of the document
   * @param {string} principalPrefix the principal prefix of the document
   * @param {string} tag the tag for search of could be input output fault
   * @returns {object} the WSDLObject
   */
  getElementFromInterfaceOperationFault(interfaceElement, interfaceOperation, elementsFromWSDL, principalPrefix, tag) {
    let faults,
      information = interfaceOperation[principalPrefix + tag];
    if (!information) {
      return null;
    }
    const faultReference = getAttributeByName(information, ATRIBUTE_REF);

    if (faultReference) {
      faults = getArrayFrom(getNodeByName(interfaceElement, principalPrefix, FAULT_TAG));
      if (faults) {
        let foundFault = faults.find((fault) => {
          let fixedName = getQNameLocal(faultReference);
          return getAttributeByName(fault, ATRIBUTE_NAME) === fixedName;
        });
        if (foundFault) {
          let elementName = getAttributeByName(foundFault, ATRIBUTE_ELEMENT),
            element = elementsFromWSDL.find((element) => {
              let fixedName = getQNameLocal(elementName);
              return element.name === fixedName;
            });
          return element;
        }
      }
    }
    return null;
  }
}

module.exports = {
  Wsdl20Parser,
  WSDL_NS_URL
};
