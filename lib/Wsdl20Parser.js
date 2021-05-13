const
  WsdlObject = require('./WSDLObject').WsdlObject,
  Operation = require('./WSDLObject').Operation,
  {
    getPrincipalPrefix,
    getNamespaceByURL,
    getNamespaceByKey,
    getAllNamespaces,
    getServices,
    getBindings,
    getElementsFromWSDL,
    getSchemaNamespace,
    getAttributeByName,
    TARGET_NAMESPACE_SPEC,
    THIS_NS_PREFIX,
    getBindingOperation,
    assignSecurity,
    getWSDLDocumentation
  } = require('./WsdlParserCommon'),
  WSDL_ROOT = 'description',
  WSDL_NS_URL = 'http://www.w3.org/ns/wsdl',
  SOAP_12_NS_URL = 'http://www.w3.org/ns/wsdl/soap',
  TNS_NS_KEY = 'xmlns:tns',
  SOAP_NS_KEY = 'xmlns:wsoap',
  HTTP_NS_KEY = 'xmlns:whttp',
  XML_POLICY = 'http://schemas.xmlsoap.org/ws/2004/09/policy',
  ATTRIBUTE_REF = 'ref',
  NAME_TAG = 'name',
  INPUT_TAG = 'input',
  OUTPUT_TAG = 'output',
  OUTFAULT_TAG = 'outfault',
  INTERFACE_TAG = 'interface',
  WsdlError = require('./WsdlError');

class Wsdl20Parser {

  constructor(informationService) {
    this.informationService = informationService;
  }

  /**
   * Creates a WSDLObject
   * that represents the information of a WSDL object and that is
   * required to create a Postman collection
   * @param {string} xmlDocumentContent the content file in string
   * @param {XMLParser} xmlParser object to parser xml string to object
   * @returns {object} the WSDLObject
   */
  getWsdlObject(xmlDocumentContent, xmlParser) {
    if (!xmlDocumentContent) {
      throw new WsdlError('xmlDocumentContent must have a value');
    }
    const parsedXml = xmlParser.parseToObject(xmlDocumentContent);
    let wsdlObject = new WsdlObject();
    wsdlObject = this.assignNamespaces(wsdlObject, parsedXml);
    wsdlObject = this.assignOperations(wsdlObject, parsedXml);
    wsdlObject = this.assignSecurity(wsdlObject, parsedXml);
    wsdlObject = this.assignDocumentation(wsdlObject, parsedXml);
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
    const allNameSpaces = getAllNamespaces(parsedXml, WSDL_ROOT),
      wsdlNamespace = getNamespaceByURL(parsedXml, WSDL_NS_URL, WSDL_ROOT),
      soapNamespace = getNamespaceByKey(parsedXml, SOAP_NS_KEY, WSDL_ROOT),
      soap12Namespace = getNamespaceByURL(parsedXml, SOAP_12_NS_URL, WSDL_ROOT),
      schemaNamespace = getSchemaNamespace(parsedXml, WSDL_ROOT),
      HTTPNamespace = getNamespaceByKey(parsedXml, HTTP_NS_KEY, WSDL_ROOT),
      tnsNamespace = getNamespaceByKey(parsedXml, TNS_NS_KEY, WSDL_ROOT),
      targetNamespace = getNamespaceByKey(parsedXml, TARGET_NAMESPACE_SPEC, WSDL_ROOT),
      securityPolicyNamespace = getNamespaceByURL(parsedXml, XML_POLICY, WSDL_ROOT);

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

  /**
   * Reads the parsedXML object, look for the operations
   * every operation will map to a PostmanCollection request
   * build the objects and assign to the WSDLObject
   * creates new object of the entry
   * @param {WsdlObject} wsdlObject the object to populate
   * @param {object} parsedXml the content file in javascript object representation
   * @returns {object} the WSDLObject
   */
  assignOperations(wsdlObject, parsedXml) {
    let newWsdlObject = { ...wsdlObject },
      wsdlOperations = [];
    const principalPrefix = getPrincipalPrefix(parsedXml, WSDL_ROOT),

      services = getServices(parsedXml, WSDL_ROOT),
      bindings = getBindings(parsedXml, WSDL_ROOT, wsdlObject),
      elements = getElementsFromWSDL(parsedXml, principalPrefix, WSDL_ROOT,
        wsdlObject.schemaNamespace, wsdlObject.tnsNamespace);

    bindings.forEach((binding) => {
      const bindingOperations = getBindingOperation(binding, principalPrefix, newWsdlObject),
        bindingInterfaceName =
          getAttributeByName(binding, INTERFACE_TAG).replace(THIS_NS_PREFIX, ''),
        bindingTagInfo = this.informationService.getBindingInfoFromBindingTag(binding,
          newWsdlObject.SOAPNamespace,
          newWsdlObject.SOAP12Namespace,
          newWsdlObject.HTTPNamespace),
        interfaceElement = this.informationService.getInterfaceByInterfaceName(
          bindingInterfaceName,
          parsedXml,
          principalPrefix
        );

      bindingOperations.forEach((bindingOperation) => {
        let interfaceOperationDocumentation = {},
          wsdlOperation = new Operation(),

          wsdlOperationRef = getAttributeByName(bindingOperation, ATTRIBUTE_REF).replace(THIS_NS_PREFIX, ''),
          serviceAndEndpoint = this.informationService.getServiceAndServiceEndpointByBindingName(
            getAttributeByName(binding, NAME_TAG),
            services,
            principalPrefix,
            newWsdlObject
          ),
          serviceEndpoint = serviceAndEndpoint ? serviceAndEndpoint.endpoint : undefined,
          interfaceOperation = this.informationService.getInterfaceOperationByInterfaceNameAndOperationName(
            bindingInterfaceName,
            wsdlOperationRef,
            parsedXml, principalPrefix),
          service = serviceAndEndpoint ? serviceAndEndpoint.service : undefined;
        interfaceOperationDocumentation = this.informationService.getInterfaceOperationDocumentation(
          interfaceOperation,
          principalPrefix
        );

        wsdlOperation.name = getAttributeByName(interfaceOperation, NAME_TAG);
        wsdlOperation.url = this.informationService.getServiceURL(serviceEndpoint, bindingOperation, bindingTagInfo);
        wsdlOperation.method = bindingTagInfo.verb ? bindingTagInfo.verb :
          this.informationService.getMethodFromBindingOperation(bindingOperation, newWsdlObject.HTTPNamespace);
        wsdlOperation.protocol = bindingTagInfo.protocol;
        wsdlOperation.portName = this.informationService.getPortName(serviceEndpoint);
        wsdlOperation.serviceName = this.informationService.getServiceName(service);
        wsdlOperation.description = interfaceOperationDocumentation;

        wsdlOperation.input = this.informationService.getElementFromInterfaceOperation(
          interfaceElement,
          interfaceOperation,
          elements,
          principalPrefix,
          INPUT_TAG
        );
        wsdlOperation.output = this.informationService.getElementFromInterfaceOperation(
          interfaceElement,
          interfaceOperation,
          elements,
          principalPrefix,
          OUTPUT_TAG
        );
        wsdlOperation.fault = this.informationService.getElementFromInterfaceOperation(
          interfaceElement,
          interfaceOperation,
          elements,
          principalPrefix,
          OUTFAULT_TAG
        );
        wsdlOperation.xpathInfo = this.informationService.getOperationxPathInfo(
          bindingTagInfo.bindingName,
          wsdlOperation.name,
          wsdlObject.wsdlNamespace.url,
          wsdlObject.tnsNamespace
        );

        wsdlOperations.push(wsdlOperation);
      });
    });
    newWsdlObject.operationsArray = wsdlOperations;
    return newWsdlObject;
  }

  assignSecurity(wsdlObject, parsedXml) {
    return assignSecurity(wsdlObject, parsedXml, WSDL_ROOT);
  }

  assignDocumentation(wsdlObject, parsedXml) {
    let newWsdlObject = { ...wsdlObject };
    newWsdlObject.documentation = getWSDLDocumentation(parsedXml, WSDL_ROOT);
    return newWsdlObject;
  }
}

module.exports = {
  Wsdl20Parser,
  WSDL_NS_URL,
  WSDL_ROOT
};
