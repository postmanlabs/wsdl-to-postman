const
  {
    getNodeByName,
    getAttributeByName,
    THIS_NS_PREFIX,
    getDocumentationStringFromNode
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
  HTTP_NS_URL = 'http://www.w3.org/ns/wsdl/http',
  ATRIBUTE_TYPE = 'type',
  ATRIBUTE_METHOD_DEFAULT = 'methodDefault',
  ATRIBUTE_METHOD = 'method',
  ATRIBUTE_REF = 'ref',
  ATRIBUTE_NAME = 'name',
  ATRIBUTE_VERSION = 'version',
  OPERATION_TAG = 'operation',
  ENDPOINT_TAG = 'endpoint',
  BINDING_TAG = 'binding',
  FAULT_TAG = 'fault',
  DOCUMENTATION_TAG = 'documentation',
  NAME_TAG = 'name',
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

class WSDLInformationService20 {
  constructor() {
    this.version = '2.0';
  }

  getMethodFromBindingOperation(bindingOperation, httpNamespace) {

    let readVerb = getAttributeByName(bindingOperation, httpNamespace.key + XML_NAMESPACE_SEPARATOR +
      ATRIBUTE_METHOD);

    return getHttpVerb(readVerb);
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
   * @param {*} interfaceOperation the wsdl interface operation object from interface tag
   * @param {string} principalPrefix the documents principal prefix
   * @returns {string} the documentation value
   */
  getInterfaceOperationDocumentation(interfaceOperation, principalPrefix) {
    let documentation = getNodeByName(interfaceOperation, principalPrefix, DOCUMENTATION_TAG);
    return documentation ? getDocumentationStringFromNode(documentation) : '';
  }

  /**
   * gets the next information from the binding tag:
   * name, protocol, protocol prefix and the default verb
   * @param {*} binding the binding node to look up for information
   * @param {NameSpace} soapNamespace the documents found namespace
   * @param {NameSpace} soap12Namespace the documentos found namespace
   * @param {NameSpace} httpNamespace the documentos found namespace
   * @returns {object} the protocol information
   */
  getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace, httpNamespace) {
    const type = getAttributeByName(binding, ATRIBUTE_TYPE);
    let protocol = '',
      verb = '',
      readVerb = '',
      bindingName = '',
      protocolPrefix = '';

    if ((soapNamespace && type === SOAP_NS_URL) || (soap12Namespace && type === SOAP_12_NS_URL)) {
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
    else if (httpNamespace && type === HTTP_NS_URL) {
      protocol = HTTP_PROTOCOL;
      readVerb = getAttributeByName(binding, httpNamespace.key + XML_NAMESPACE_SEPARATOR +
        ATRIBUTE_METHOD_DEFAULT);
      if (!readVerb) {
        verb = undefined;
      }
      else {
        verb = getHttpVerb(readVerb);
      }
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
        const endpoints = getArrayFrom(getNodeByName(services[i], principalPrefix, ENDPOINT_TAG));
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
        arrayInterfaces = getArrayFrom(getNodeByName(definitions, principalPrefix, INTERFACE_TAG));
      interfaceFound = arrayInterfaces.find((actualInterface) => {
        return getAttributeByName(actualInterface, NAME_TAG) === interfaceName;
      });
      operations = getArrayFrom(getNodeByName(interfaceFound, principalPrefix, OPERATION_TAG));
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
  getInterfaceByInterfaceName(interfaceName, parsedXml, principalPrefix) {
    let WSDLFoundInterface;
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not interface from undefined or null object');
    }
    if (!interfaceName) {
      throw new WsdlError('Can not get interface with no filter name');
    }
    try {
      const definitions = getNodeByName(parsedXml, principalPrefix, WSDL_ROOT),
        arrayInterfaces = getArrayFrom(getNodeByName(definitions, principalPrefix, INTERFACE_TAG));
      WSDLFoundInterface = arrayInterfaces.find((actualInterface) => {
        return getAttributeByName(actualInterface, NAME_TAG) === interfaceName;
      });
      return WSDLFoundInterface;
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
  WSDLInformationService20,
  WSDL_NS_URL,
  WSDL_ROOT
};
