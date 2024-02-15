const
  _ = require('lodash'),
  {
    getHttpVerb,
    POST_METHOD
  } = require('../lib/utils/httpUtils'),
  WsdlError = require('./WsdlError'),
  UserError = require('./UserError'),
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
  SOAP_NS_KEY = 'xmlns:soap',
  HTTP_NS_URL = 'http://schemas.xmlsoap.org/wsdl/http/',
  HTTP_NS_KEY = 'xmlns:http',
  SOAP_12_NS_URL = 'http://schemas.xmlsoap.org/wsdl/soap12/',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  SOAP_TRANSPORT_URL = 'http://schemas.xmlsoap.org/soap/http',
  TNS_NS_KEY = 'xmlns:tns',
  XMLNS_ATTRIBUTE = 'xmlns',
  ATTRIBUTE_NAME = 'name',
  ATTRIBUTE_STYLE = 'style',
  ATTRIBUTE_VERB = 'verb',
  ATTRIBUTE_MESSAGE = 'message',
  ATTRIBUTE_ELEMENT = 'element',
  TARGETNAMESPACE_KEY = 'targetNamespace',
  ATTRIBUTE_LOCATION = 'location',
  ATTRIBUTE_TYPE = 'type',
  ATTRIBUTE_TRANSPORT = 'transport',
  ATTRIBUTE_PART = 'part',
  XML_POLICY = 'http://schemas.xmlsoap.org/ws/2004/09/policy',
  INPUT_TAG = 'input',
  OUTPUT_TAG = 'output',
  FAULT_TAG = 'fault',
  MIME_CONTENT_TAG = 'mime:content',
  MIME_XML_TAG = 'mime:mimeXml',
  URL_ENCODED_TAG = 'http:urlEncoded',
  ATTRIBUTE_SOAP_ACTION = 'soapAction',
  ATTRIBUTE_METHOD = 'method',
  {
    getArrayFrom
  } = require('./utils/objectUtils'),
  {
    getPrincipalPrefix,
    getNodeByName,
    getAttributeByName,
    THIS_NS_PREFIX,
    getDocumentationStringFromNode,
    excludeSeparatorFromName,
    SERVICE_TAG
  } = require('./WsdlParserCommon'),
  {
    getQNamePrefixFilter,
    getQNamePrefix,
    getQNameLocal,
    XML_NAMESPACE_SEPARATOR
  } = require('./utils/XMLParsedUtils'),
  {
    DOC_HAS_NO_SERVICE_MESSAGE,
    DOC_HAS_NO_SERVICE_PORT_MESSAGE_1,
    DOC_HAS_NO_SERVICE_PORT_MESSAGE_2
  } = require('./constants/messageConstants'),
  {
    HTTP_PROTOCOL,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL,
    MIME_TYPE_CONTENT,
    MIME_TYPE_XML,
    URL_ENCODED_GET,
    EMPTY_ELEMENT_BY_DEFAULT
  } = require('./constants/processConstants'),
  {
    createErrorElement, createEmptyElement
  } = require('./utils/WSDLElementUtils'),
  {
    URLWithParamsHelper
  } = require('./utils/URLWithParamsHelper'),
  { BindingExtraInformation } = require('./WSDLObject');

class WsdlInformationService11 {
  constructor() {
    this.version = '1.1';
    this.InputTagName = INPUT_TAG;
    this.NameTag = NAME_TAG;
    this.OutputTagName = OUTPUT_TAG;
    this.FaultTagName = FAULT_TAG;
    this.SOAPNamesapceURL = SOAP_NS_URL;
    this.SOAP12NamesapceURL = SOAP_12_NS_URL;
    this.SOAPNamespaceKey = SOAP_NS_KEY;
    this.SchemaNamespaceURL = SCHEMA_NS_URL;
    this.RootTagName = WSDL_ROOT;
    this.WSDLNamespaceURL = WSDL_NS_URL;
    this.HTTPNamespaceURL = HTTP_NS_URL;
    this.HTTPNamespaceKey = HTTP_NS_KEY;
    this.THISNamespaceKey = TNS_NS_KEY;
    this.TargetNamespaceKey = TARGETNAMESPACE_KEY;
    this.XMLPolicyURL = XML_POLICY;
    this.AbstractInterfaceTag = PORT_TYPE_TAG;
    this.ConcreteInterfaceTag = BINDING_TAG;
    this.ConcreteServiceTag = SERVICE_TAG;
  }

  /**
   * gets the binding operation name from the binding object
  * @param {object} bindingOperation the WSDL Binding operation
   * @returns {string} the fault tag name
   */
  getBindingOperationName(bindingOperation) {
    return getAttributeByName(bindingOperation, ATTRIBUTE_NAME);
  }

  /**
  * gets the port type name corresponding to the sent binding
  * found by the tag type
  * @param {string} binding the binding object from wsdl
  * @param {object} tnsNamespace tns namespace object
  * @returns {string} the porttype name
  */
  getAbstractDefinitionName(binding, tnsNamespace) {
    let tnsNamespacePrefix = (tnsNamespace && tnsNamespace.key === 'string') ? tnsNamespace.key + ':' : THIS_NS_PREFIX,
      attribute = getAttributeByName(binding, ATTRIBUTE_TYPE);

    if (typeof attribute === 'string') {
      return attribute.replace(tnsNamespacePrefix, '');
    }
    return '';
  }

  getOperationxPathInfo(bindingName, operationName, wsdlNamespaceUrl) {
    return {
      xpath: `//${WSDL_ROOT}//${BINDING_TAG}[@${ATTRIBUTE_NAME}="${bindingName}"]` +
        `//${OPERATION_TAG}[@${ATTRIBUTE_NAME}="${operationName}"]`,
      wsdlNamespaceUrl: wsdlNamespaceUrl
    };
  }

  /**
   * Gets the service url
   * if the service port is not defined return empty string
   * @param {object} servicePort the service port element tag information
   * @param {object} bindingOperation the binding operation element tag information
   * @param {object} bindingTagInfo the binding information for the binding
   * @param {function} decodeFunction a function to decode the url
   * @param {object} mimeContentInput input information binding details
   * @param {object} elementInput the schema input of the service
   * @returns {string} the service url
   */
  getServiceURL(servicePort, bindingOperation, bindingTagInfo, decodeFunction, mimeContentInput,
    elementInput) {
    if (!servicePort) {
      return '';
    }
    let url,
      keys = Object.keys(servicePort),
      addressKey = keys.find((key) => {
        if (key.includes(ADDRESS_TAG)) { return true; }
      }),
      serviceLocation = this.getLocationFromBindingOperation(bindingOperation, bindingTagInfo),
      address = servicePort[addressKey] || {};
    serviceLocation = serviceLocation ? serviceLocation : '';
    url = getAttributeByName(address, LOCATION_TAG) + serviceLocation;

    if (mimeContentInput && mimeContentInput.mimeType === URL_ENCODED_GET) {
      const helper = new URLWithParamsHelper(),
        parametersURL = helper.convertInputToURLParams(elementInput);
      url += '?' + parametersURL;
    }

    return decodeFunction(url);
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
  getOperationDocumentation(portTypeOperation, principalPrefix) {
    try {
      let documentation = getNodeByName(portTypeOperation, principalPrefix, DOCUMENTATION_TAG);
      return documentation ? getDocumentationStringFromNode(documentation) : '';
    }
    catch (error) {
      return '';
    }
  }

  /**
   * finds the element from the port type operation object
   * @param {object} parsedXml the content file in javascript object representation
   * @param {object} portTypeOperation por type operation to find the element
   * @param {object} elementsFromWSDL all the elements of the document
   * @param {string} principalPrefix the principal prefix of the document
   * @param {string} tag the tag for search of could be input output fault
   * @param {object} tnsNamespace tns namespace object
   * @returns {object} the WSDLObject
   */
  getElementFromPortTypeInterfaceOperation(parsedXml, portTypeOperation, elementsFromWSDL, principalPrefix, tag,
    tnsNamespace) {
    let information = getNodeByName(portTypeOperation, principalPrefix, tag),
      messageName, elementName,
      elementsArray = [];
    if (information) {
      if (!Array.isArray(information)) {
        information = [information];
      }
      information.forEach((informationTag) => {
        let foundElement;
        messageName = getAttributeByName(informationTag, ATTRIBUTE_MESSAGE);
        elementName = this.getMessageElementNameByMessageName(parsedXml, principalPrefix, messageName, tnsNamespace);
        if (elementName === EMPTY_ELEMENT_BY_DEFAULT) {
          elementsArray.push(createEmptyElement(elementName));
          return;
        }
        elementName = excludeSeparatorFromName(elementName);

        if (Array.isArray(elementsFromWSDL)) {
          foundElement = elementsFromWSDL.find((element) => {
            return element.name === elementName;
          });
        }

        if (foundElement === undefined) {
          elementsArray.push(createErrorElement({}, elementName));
        }
        else {
          elementsArray.push(foundElement);
        }
      });
      return elementsArray;
    }
    return [];
  }


  /**
   * finds the element from the port type operation object
   * @param {object} parsedXml the content file in javascript object representation
   * @param {string} principalPrefix the principal prefix of the document
   * @param {string} messageName the name too look up for
   * @param {object} tnsNamespace tns namespace object
   * @returns {object} the message from WSDLObject
   */
  getMessageElementNameByMessageName(parsedXml, principalPrefix, messageName, tnsNamespace) {
    let definitions = getNodeByName(parsedXml, principalPrefix, WSDL_ROOT),
      tnsNamespacePrefix = (tnsNamespace && typeof (tnsNamespace.key) === 'string') ?
        tnsNamespace.key + ':' : THIS_NS_PREFIX,
      part, elementName,
      messageOnlyName = getQNameLocal(messageName),
      messages = getArrayFrom(getNodeByName(definitions, principalPrefix, MESSAGE_TAG)),
      foundMessage = Array.isArray(messages) && messages.find((message) => {
        return getAttributeByName(message, ATTRIBUTE_NAME) === messageOnlyName;
      });

    if (foundMessage) {
      part = getNodeByName(foundMessage, principalPrefix, PART_TAG);
      elementName = this.resolvePartName(part);
      if (!elementName || Array.isArray(elementName)) {
        return messageName.replace(tnsNamespacePrefix, '');
      }
      elementName = elementName.replace(tnsNamespacePrefix, '');
    }
    return elementName;
  }

  resolvePartName(partElement) {
    let partIsEmpty = !partElement;
    if (partIsEmpty) {
      return EMPTY_ELEMENT_BY_DEFAULT;
    }
    return getAttributeByName(partElement, ATTRIBUTE_ELEMENT);
  }

  /**
   * Looks up for the service by binding name
   * @param {string} bindingName the object to populate
   * @param {array} services the object to populate
   * @param {string} principalPrefix the principal wsdl prefix
   * @param {WSDLObject} wsdlObject the wsdl object we are building
   * @returns {object} parsedXML service representation
   */
  getServiceAndExpossedInfoByBindingName(bindingName, services, principalPrefix, wsdlObject) {
    if (!bindingName) {
      throw new UserError('Definition contains binding without required property "name".');
    }
    if (principalPrefix === undefined || principalPrefix === null) {
      throw new UserError('Definition doesn\'t contain any principal prefix.');
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
          return getQNameLocal(getAttributeByName(port, BINDING_TAG)) === bindingName;
        });
        if (port) {
          foundService = services[i];
          break;
        }
      }
      if (!port) {
        wsdlObject.log
          .logError(`${DOC_HAS_NO_SERVICE_PORT_MESSAGE_1} ${bindingName} ${DOC_HAS_NO_SERVICE_PORT_MESSAGE_2}`);
        return;
      }

      return {
        service: foundService,
        port: port
      };
    }
    catch (error) {
      if (error instanceof UserError) {
        throw error;
      }

      throw new WsdlError('Cannot get service port from WSDL');
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

  getAbstractOperationByName(portTypeName, operationName,
    parsedXml, principalPrefix) {
    let portTypeFound, operationReturn, operations, localPortname;
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new UserError('Provided WSDL definition is invalid XML.');
    }
    if (!portTypeName) {
      throw new UserError('Definition contains portType without required property "name".');
    }
    if (!operationName) {
      throw new UserError('Definition contains operation without required property "name".');
    }
    try {
      localPortname = getQNameLocal(portTypeName);
      const definitions = getNodeByName(parsedXml, principalPrefix, WSDL_ROOT),
        arrayPortTypes = getArrayFrom(getNodeByName(definitions, principalPrefix, PORT_TYPE_TAG));
      portTypeFound = arrayPortTypes && arrayPortTypes.find((portType) => {
        return getAttributeByName(portType, NAME_TAG) === localPortname;
      });
      operations = getArrayFrom(getNodeByName(portTypeFound, principalPrefix, OPERATION_TAG));

      operationReturn = operations && operations.find((operation) => {
        return getAttributeByName(operation, NAME_TAG) === operationName;
      }) || {};

      return operationReturn;
    }
    catch (error) {
      if (error instanceof UserError) {
        throw error;
      }

      throw new WsdlError('Cannot get port type from WSDL');
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
      throw new UserError('Definition contains invalid binding operation.');
    }
    try {
      if (bindingTagInfo.protocol === SOAP_PROTOCOL ||
        bindingTagInfo.protocol === SOAP12_PROTOCOL) {
        return getAttributeByName(getNodeByName(bindingOperation, bindingTagInfo.protocolPrefix, OPERATION_TAG),
          ATTRIBUTE_STYLE);
      }
    }
    catch (error) {
      return '';
    }
    return '';
  }


  /**
   * Looks up for the soapAction property in the binding operation tag
   * @param {string} bindingOperation the binding operation object
   * @param {string} bindingTagInfo the binding's binding son tag information
   * @returns {string} the style's property's value property
   */
  getSOAPActionFromBindingOperation(bindingOperation, bindingTagInfo) {
    if (!bindingOperation || typeof bindingOperation !== 'object') {
      throw new UserError('Definition contains invalid binding operation.');
    }
    try {
      if (bindingTagInfo.protocol === SOAP_PROTOCOL ||
        bindingTagInfo.protocol === SOAP12_PROTOCOL) {
        return getAttributeByName(getNodeByName(bindingOperation, bindingTagInfo.protocolPrefix, OPERATION_TAG),
          ATTRIBUTE_SOAP_ACTION);
      }
    }
    catch (error) {
      return '';
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
      throw new UserError('Definition contains invalid binding operation.');
    }
    try {
      if (bindingTagInfo.protocol === HTTP_PROTOCOL) {
        return getAttributeByName(getNodeByName(bindingOperation, bindingTagInfo.protocolPrefix, OPERATION_TAG),
          ATTRIBUTE_LOCATION);
      }
    }
    catch (error) {
      return '';
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
      throw new UserError('Provided WSDL definition is invalid XML.');
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
      if (error instanceof UserError) {
        throw error;
      }

      throw new WsdlError('Cannot get portypes from WSDL');
    }
  }

  /**
   * gets the next information from the binding tag:
   * name, protocol, protocol prefix and the default verb
   * @param {object} binding the WSDL's binding object
   * @param {NameSpace} soapNamespace the soap namespace information
   * @param {NameSpace} soap12Namespace the sopa 1.2 namespace information
   * @param {NameSpace} httpNamespace the http namespace information
   * @param {Array} allNameSpaces All namespaces present in wsdl definition
   * @returns {object} a new object with the information
   */
  getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace, httpNamespace, allNameSpaces) {
    if (!binding || typeof binding !== 'object') {
      throw new UserError('Definition contains invalid binding.');
    }
    let protocol = '',
      verb = '',
      protocolPrefix = '',
      bindingName = '',
      namespace = Object.keys(binding).find((key) => {
        if (key.includes(BINDING_TAG)) {
          return true;
        }
      }),
      isProtocolSoap12,
      isProtocolSoap,
      isProtocolHttp;

    if (namespace === undefined) {
      throw new UserError('Definition contains a binding for which namespace could not be found.');
    }

    const protocolKey = getQNamePrefix(namespace);
    protocolPrefix = getQNamePrefixFilter(namespace);

    /**
     * There can be multiple namespaces defined with same binding URL.
     * In such cases detect binding namespaces by going through all namespaces and
     *  identifying correct one via URL.
     */
    isProtocolSoap12 = soap12Namespace && (protocolKey === soap12Namespace.key ||
      _.some(allNameSpaces, (namespace) => {
        return soap12Namespace.url === namespace.url && soap12Namespace.key !== namespace.key;
      }));

    if (!isProtocolSoap12) {
      isProtocolSoap = soapNamespace && (protocolKey === soapNamespace.key ||
        _.some(allNameSpaces, (namespace) => {
          return soapNamespace.url === namespace.url && soapNamespace.key !== namespace.key;
        }));
    }

    if (!isProtocolSoap12 && !isProtocolSoap) {
      isProtocolHttp = httpNamespace && (protocolKey === httpNamespace.key ||
        _.some(allNameSpaces, (namespace) => {
          return httpNamespace.url === namespace.url && httpNamespace.key !== namespace.key;
        }));
    }

    if (isProtocolSoap12) {
      protocol = SOAP12_PROTOCOL;
      verb = POST_METHOD;
    }
    else if (isProtocolSoap) {
      protocol = SOAP_PROTOCOL;
      verb = POST_METHOD;
    }
    else if (isProtocolHttp) {
      protocol = HTTP_PROTOCOL;
      verb = getHttpVerb(getAttributeByName(binding[namespace], ATTRIBUTE_VERB));
    }
    else if (protocolKey === '') {
      const innerBinding = getNodeByName(binding, protocolPrefix, BINDING_TAG),
        transport = getAttributeByName(innerBinding, ATTRIBUTE_TRANSPORT),
        xmlns = getAttributeByName(innerBinding, XMLNS_ATTRIBUTE);
      if (transport === SOAP_TRANSPORT_URL && xmlns === SOAP_NS_URL) {
        protocol = SOAP_PROTOCOL;
        verb = POST_METHOD;
      }
      else if (transport === SOAP_TRANSPORT_URL && xmlns === SOAP_12_NS_URL) {
        protocol = SOAP12_PROTOCOL;
        verb = POST_METHOD;
      }
    }
    else {
      throw new UserError('Definition contains a binding for which protocol could not be determined.');
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
   * gets the operation's mime content information
   * @param {object} bindingOperation the binding operation object
   * @param {string} principalPrefix the wsdl http namespace object
   * @param {string} tag the tag for input or output
   * @returns {string} the verb
   */
  getMimeContentInfo(bindingOperation, principalPrefix, tag) {
    try {
      const input = getNodeByName(bindingOperation, principalPrefix, tag);
      let mimeXMLTag,
        urlEncoded,
        mimeContentTag = getNodeByName(input, '', MIME_CONTENT_TAG);
      if (mimeContentTag) {
        let mime = new BindingExtraInformation();
        mime.mimeType = MIME_TYPE_CONTENT;
        mime.type = getAttributeByName(mimeContentTag, ATTRIBUTE_TYPE);
        return mime;
      }
      urlEncoded = getNodeByName(input, '', URL_ENCODED_TAG);
      if (urlEncoded !== undefined) {
        let mime = new BindingExtraInformation();
        mime.mimeType = URL_ENCODED_GET;
        return mime;
      }
      mimeXMLTag = getNodeByName(input, '', MIME_XML_TAG);
      if (mimeXMLTag) {
        let mime = new BindingExtraInformation();
        mime.mimeType = MIME_TYPE_XML;
        mime.part = getAttributeByName(mimeXMLTag, ATTRIBUTE_PART);
        return mime;
      }
    }
    catch (error) {
      return undefined;
    }
  }

}

module.exports = {
  WsdlInformationService11
};
