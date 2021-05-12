const
  WsdlObject = require('./WSDLObject').WsdlObject,
  Operation = require('./WSDLObject').Operation,
  WsdlError = require('./WsdlError'),
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
    getBindingOperation,
    assignSecurity,
    getWSDLDocumentation
  } = require('./WsdlParserCommon');

class WsdlParser {

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
    wsdlObject.version = this.informationService.getVersion();
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
    const allNameSpaces = getAllNamespaces(parsedXml, this.informationService.getRootTag()),
      wsdlNamespace = getNamespaceByURL(parsedXml, this.informationService.getWSDLNamespaceURL(),
        this.informationService.getRootTag()),
      soapNamespace = getNamespaceByKey(parsedXml, this.informationService.getSOAPNamespaceKey(),
        this.informationService.getRootTag()),
      soap12Namespace = getNamespaceByKey(parsedXml, this.informationService.getSOAP12NamespaceKey(),
        this.informationService.getRootTag()),
      schemaNamespace = getSchemaNamespace(parsedXml, this.informationService.getRootTag()),
      HTTPNamespace = getNamespaceByKey(parsedXml, this.informationService.getHTTPNamespaceKey(),
        this.informationService.getRootTag()),
      tnsNamespace = getNamespaceByKey(parsedXml, this.informationService.getTHISNamespaceKey(),
        this.informationService.getRootTag()),
      targetNamespace = getNamespaceByKey(parsedXml, this.informationService.getTargetNamespaceKey(),
        this.informationService.getRootTag()),
      securityPolicyNamespace = getNamespaceByURL(parsedXml, this.informationService.getXMLPolicyURL(),
        this.informationService.getRootTag());

    newWsdlObject.targetNamespace = targetNamespace;
    newWsdlObject.wsdlNamespace = wsdlNamespace;
    newWsdlObject.SOAPNamespace = soapNamespace;
    newWsdlObject.SOAP12Namespace = soap12Namespace;
    newWsdlObject.SOAP12Namespace = soap12Namespace;
    newWsdlObject.schemaNamespace = schemaNamespace;
    newWsdlObject.tnsNamespace = tnsNamespace;
    newWsdlObject.allNameSpaces = allNameSpaces;
    newWsdlObject.HTTPNamespace = HTTPNamespace;
    newWsdlObject.securityPolicyNamespace = securityPolicyNamespace;

    return newWsdlObject;
  }

  assignSecurity(wsdlObject, parsedXml) {
    return assignSecurity(wsdlObject, parsedXml, this.informationService.getRootTag());
  }

  assignDocumentation(wsdlObject, parsedXml) {
    let newWsdlObject = { ...wsdlObject };
    newWsdlObject.documentation = getWSDLDocumentation(parsedXml, this.informationService.getRootTag());
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
    const principalPrefix = getPrincipalPrefix(parsedXml, this.informationService.getRootTag()),
      services = getServices(parsedXml, this.informationService.getRootTag()),
      bindings = getBindings(parsedXml, this.informationService.getRootTag(), wsdlObject),
      elements = getElementsFromWSDL(parsedXml, principalPrefix, this.informationService.getRootTag(),
        wsdlObject.schemaNamespace, wsdlObject.tnsNamespace);

    bindings.forEach((binding) => {
      const bindingTagInfo =
        this.informationService.getBindingInfoFromBindingTag(binding,
          newWsdlObject.SOAPNamespace,
          newWsdlObject.SOAP12Namespace,
          newWsdlObject.HTTPNamespace),
        bindingOperations = getBindingOperation(binding, principalPrefix, newWsdlObject),

        portTypeInterfaceName = this.informationService.getPortTypeInterfaceName(binding);

      bindingOperations.forEach((bindingOperation) => {
        let wsdlOperation = new Operation(),
          servicePort,
          service,
          portTypeInterfaceOperation,
          serviceAndPort,
          operationDocumentation,
          bindingOperationName =
            this.informationService.getBindingOperationName(bindingOperation);

        serviceAndPort = this.informationService.getServiceAndServicePortEndpointByBindingName(
          getAttributeByName(binding, this.informationService.getNameTag()),
          services, principalPrefix, newWsdlObject
        );
        service = serviceAndPort ? serviceAndPort.service : undefined;
        servicePort = serviceAndPort ? serviceAndPort.port : undefined;
        wsdlOperation.name = bindingOperationName;
        portTypeInterfaceOperation =
          this.informationService.getPortTypeInterfaceOperationByPortTypeNameAndOperationName(
            portTypeInterfaceName,
            wsdlOperation.name,
            parsedXml, principalPrefix
          );
        operationDocumentation = this.informationService.getOperationDocumentation(
          portTypeInterfaceOperation,
          principalPrefix
        );

        wsdlOperation.url = this.informationService.getServiceURL(servicePort, bindingOperation, bindingTagInfo);
        wsdlOperation.method = bindingTagInfo.verb ? bindingTagInfo.verb :
          this.informationService.getMethodFromBindingOperation(bindingOperation, newWsdlObject.HTTPNamespace);
        wsdlOperation.protocol = bindingTagInfo.protocol;
        wsdlOperation.portName = this.informationService.getPortName(servicePort);
        wsdlOperation.serviceName = this.informationService.getServiceName(service);
        wsdlOperation.description = operationDocumentation;

        wsdlOperation.style = this.informationService.getStyleFromBindingOperation(
          bindingOperation,
          bindingTagInfo
        );

        wsdlOperation.input = this.informationService.getElementFromPortTypeInterfaceOperation(
          parsedXml,
          portTypeInterfaceOperation,
          elements,
          principalPrefix,
          this.informationService.getInputTag(),
          portTypeInterfaceName
        );
        wsdlOperation.output = this.informationService.getElementFromPortTypeInterfaceOperation(
          parsedXml,
          portTypeInterfaceOperation,
          elements,
          principalPrefix,
          this.informationService.getOuputTag(),
          portTypeInterfaceName
        );
        wsdlOperation.fault = this.informationService.getElementFromPortTypeInterfaceOperation(
          parsedXml,
          portTypeInterfaceOperation,
          elements,
          principalPrefix,
          this.informationService.getFaultTag(),
          portTypeInterfaceName
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
}

module.exports = {
  WsdlParser
};
