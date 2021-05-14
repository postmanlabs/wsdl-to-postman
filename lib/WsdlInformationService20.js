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
  SOAP_NS_KEY = 'xmlns:wsoap',
  SOAP_12_NS_KEY = 'xmlns:wsoap',
  HTTP_NS_KEY = 'xmlns:whttp',
  SOAP_12_NS_URL = 'http://www.w3.org/ns/wsdl/soap',
  HTTP_NS_URL = 'http://www.w3.org/ns/wsdl/http',
  ATTRIBUTE_TYPE = 'type',
  TNS_NS_KEY = 'xmlns:tns',
  ATTRIBUTE_METHOD_DEFAULT = 'methodDefault',
  ATTRIBUTE_METHOD = 'method',
  ATTRIBUTE_REF = 'ref',
  ATTRIBUTE_NAME = 'name',
  ATTRIBUTE_VERSION = 'version',
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
  ATTRIBUTE_ELEMENT = 'element',
  ATTRIBUTE_LOCATION = 'location',
  XML_POLICY = 'http://schemas.xmlsoap.org/ws/2004/09/policy',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  TARGETNAMESPACE_KEY = 'targetNamespace',
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

class WsdlInformationService20 {
  constructor() {
    this.version = '2.0';
  }

  /**
  * gets the input tag name for WSDL 2.0 version
  * @returns {string} the input tag name
  */
  getInputTagName() {
    return INPUT_TAG;
  }

  /**
  * gets the name tag name for WSDL 2.0 version
  * @returns {string} the name tag name
  */
  getNameTag() {
    return NAME_TAG;
  }

  /**
  * gets the output tag name for WSDL 2.0 version
  * @returns {string} the output tag name
  */
  getOuputTagName() {
    return OUTPUT_TAG;
  }

  /**
  * gets the fault tag name for WSDL 2.0 version
  * @returns {string} the fault tag name
  */
  getFaultTagName() {
    return OUTFAULT_TAG;
  }

  /**
  * gets the binding operation name from the binding object
  * @param {object} bindingOperation the WSDL Binding operation
  * @returns {string} the fault tag name
  */
  getBindingOperationName(bindingOperation) {
    return getAttributeByName(bindingOperation, ATTRIBUTE_REF).replace(THIS_NS_PREFIX, '');
  }

  /**
  * gets the interface name corresponding to the sent binding
  * @param {string} binding the binding object from wsdl
  * @returns {string} the interface name
  */
  getAbstractDefinitionName(binding) {
    return getAttributeByName(binding, INTERFACE_TAG).replace(THIS_NS_PREFIX, '');
  }

  /**
   * gets WSDL object 2.0 version
   * @returns {string} the wsdl object version
   */
  getWSDLObjectVersion() {
    return this.version;
  }

  /**
  * gets the root tag for 2.0 version
  * @returns {string} the name of the tag
  */
  getRootTagName() {
    return WSDL_ROOT;
  }

  /**
  * gets the WSDL namespace url for 2.0 version
  * @returns {string} the url
  */
  getWSDLNamespaceURL() {
    return WSDL_NS_URL;
  }

  /**
  * gets the SOAP namespace url for 2.0 version
  * @returns {string} the url
  */
  getSOAPNamespaceURL() {
    return SOAP_NS_URL;
  }

  /**
   * gets the schema namespace url for 2.0 version
   * @returns {string} the url
   */
  getSchemaNamespaceURL() {
    return SCHEMA_NS_URL;
  }

  /**
   * gets the SOAP 12 namespace url for 2.0 version
   * @returns {string} the url
   */
  getSOAP12NamespaceURL() {
    return SOAP_12_NS_URL;
  }

  /**
   * gets the SOAP  namespace url for 2.0 version
   * @returns {string} the key
   */
  getSOAPNamespaceKey() {
    return SOAP_NS_KEY;
  }

  /**
  * gets the SOAP 12 namespace key for 2.0 version
  * @returns {string} the key
  */
  getSOAP12NamespaceKey() {
    return SOAP_12_NS_KEY;
  }

  /**
  * gets the HTTP namespace key for 2.0 version
  * @returns {string} the key
  */
  getHTTPNamespaceKey() {
    return HTTP_NS_KEY;
  }

  /**
  * gets the TNS (this name space) namespace key for 2.0 version
  * @returns {string} the key
  */
  getTHISNamespaceKey() {
    return TNS_NS_KEY;
  }

  /**
  * gets the target namespace key for 2.0 version
  * @returns {string} the key
  */
  getTargetNamespaceKey() {
    return TARGETNAMESPACE_KEY;
  }

  /**
  * gets the xml policy namespace url for 2.0 version
  * @returns {string} the url
  */
  getXMLPolicyURL() {
    return XML_POLICY;
  }

  /**
   * gets the http method for the operation
   * @param {object} bindingOperation the binding operation object
   * @param {object} httpNamespace the wsdl http namespace object
   * @returns {string} the verb
   */
  getOperationHttpMethod(bindingOperation, httpNamespace) {
    let readVerb = getAttributeByName(bindingOperation, httpNamespace.key + XML_NAMESPACE_SEPARATOR +
      ATTRIBUTE_METHOD);

    return getHttpVerb(readVerb);
  }

  /**
  * Looks up for the style property in the binding operation tag
  * @param {string} bindingOperation the binding operation object
  * @param {string} bindingTagInfo the binding's binding son tag information
  * @returns {string} the style's property's value property
  */
  getStyleFromBindingOperation() {
    return '';
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
      xpath: `//${WSDL_ROOT}//${BINDING_TAG}[@${ATTRIBUTE_NAME}="${bindingName}"]` +
        `//${OPERATION_TAG}[@${ATTRIBUTE_REF}="${tnsNamespace.key + ':' + operationName}"]`,
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
      throw new WsdlError('Cannot get style info from operation undefined or null object');
    }
    try {
      if (bindingTagInfo.protocol === HTTP_PROTOCOL) {
        return getAttributeByName(operation, bindingTagInfo.protocolPrefix +
          XML_NAMESPACE_SEPARATOR + ATTRIBUTE_LOCATION);
      }
    }
    catch (error) {
      throw new WsdlError('Cannot get location info from operation');
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
  getOperationDocumentation(interfaceOperation, principalPrefix) {
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
    const type = getAttributeByName(binding, ATTRIBUTE_TYPE);
    let protocol = '',
      verb = '',
      readVerb = '',
      bindingName = '',
      protocolPrefix = '';

    if ((soapNamespace && type === SOAP_NS_URL) || (soap12Namespace && type === SOAP_12_NS_URL)) {
      let namespaceKey = soapNamespace ? soapNamespace.key : soap12Namespace.key,
        version = getAttributeByName(binding, namespaceKey + XML_NAMESPACE_SEPARATOR + ATTRIBUTE_VERSION);
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
        ATTRIBUTE_METHOD_DEFAULT);
      if (!readVerb) {
        verb = undefined;
      }
      else {
        verb = getHttpVerb(readVerb);
      }
      protocolPrefix = httpNamespace.key;
    }
    else {
      throw new WsdlError('Cannot find protocol in those namespaces');
    }
    bindingName = getAttributeByName(binding, ATTRIBUTE_NAME);
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
  getServiceAndExpossedInfoByBindingName(bindingName, services, principalPrefix, wsdlObject) {
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
        port: endpoint
      };
    }
    catch (error) {
      throw new WsdlError('Cannot get service endpoint from object');
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
  getAbstractOperationByName(interfaceName, operationName,
    parsedXml, principalPrefix) {
    let interfaceFound, operationReturn, operations;
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Cannot get porttype from undefined or null object');
    }
    if (!interfaceName) {
      throw new WsdlError('Cannot get port type with no filter name');
    }
    if (!operationName) {
      throw new WsdlError('Cannot get port type with no filter operationName');
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
      throw new WsdlError('Cannot get port type from object');
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
      throw new WsdlError('Cannot interface from undefined or null object');
    }
    if (!interfaceName) {
      throw new WsdlError('Cannot get interface with no filter name');
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
      throw new WsdlError('Cannot get interface from object');
    }
  }

  /**
   * finds the element from the interface operation object
   * @param {object} parsedXML the parsed xml object from the parser
   * @param {object} interfaceOperation interface operation to find the element
   * @param {object} elementsFromWSDL all the elements of the document
   * @param {string} principalPrefix the principal prefix of the document
   * @param {string} tag the tag for search of could be input output fault
   * @param {string} portTypeInterfaceName interface name
   * @returns {object} the WSDLObject
   */
  getElementFromPortTypeInterfaceOperation(parsedXML, interfaceOperation, elementsFromWSDL,
    principalPrefix, tag, portTypeInterfaceName) {

    let interfaceElement = this.getInterfaceByInterfaceName(portTypeInterfaceName,
      parsedXML, principalPrefix);
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
      elementName = getAttributeByName(information, ATTRIBUTE_ELEMENT);
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
    const faultReference = getAttributeByName(information, ATTRIBUTE_REF);

    if (faultReference) {
      faults = getArrayFrom(getNodeByName(interfaceElement, principalPrefix, FAULT_TAG));
      if (faults) {
        let foundFault = faults.find((fault) => {
          let fixedName = getQNameLocal(faultReference);
          return getAttributeByName(fault, ATTRIBUTE_NAME) === fixedName;
        });
        if (foundFault) {
          let elementName = getAttributeByName(foundFault, ATTRIBUTE_ELEMENT),
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
  WsdlInformationService20
};
