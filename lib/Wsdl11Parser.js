const
  WsdlObject = require('./WSDLObject').WsdlObject,
  Operation = require('./WSDLObject').Operation,
  WsdlError = require('./WsdlError'),
  WSDL_ROOT = 'definitions',
  NAME_TAG = 'name',
  INPUT_TAG = 'input',
  OUTPUT_TAG = 'output',
  FAULT_TAG = 'fault',
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
  ATRIBUTE_TYPE = 'type',
  TARGETNAMESPACE_KEY = 'targetNamespace',
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
    THIS_NS_PREFIX,
    getBindingOperation,
    assignSecurity,
    getWSDLDocumentation
  } = require('./WsdlParserCommon'),
  {
    HTTP_PROTOCOL,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL
  } = require('./constants/processConstants');

class Wsdl11Parser {

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
    const allNameSpaces = getAllNamespaces(parsedXml, WSDL_ROOT),
      wsdlNamespace = getNamespaceByURL(parsedXml, WSDL_NS_URL, WSDL_ROOT),
      soapNamespace = getNamespaceByKey(parsedXml, SOAP_NS_KEY, WSDL_ROOT),
      soap12Namespace = getNamespaceByKey(parsedXml, SOAP_12_NS_KEY, WSDL_ROOT),
      schemaNamespace = getSchemaNamespace(parsedXml, WSDL_ROOT),
      HTTPNamespace = getNamespaceByKey(parsedXml, HTTP_NS_KEY, WSDL_ROOT),
      tnsNamespace = getNamespaceByKey(parsedXml, TNS_NS_KEY, WSDL_ROOT),
      targetNamespace = getNamespaceByKey(parsedXml, TARGETNAMESPACE_KEY, WSDL_ROOT),
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

  assignSecurity(wsdlObject, parsedXml) {
    return assignSecurity(wsdlObject, parsedXml, WSDL_ROOT);
  }

  assignDocumentation(wsdlObject, parsedXml) {
    let newWsdlObject = { ...wsdlObject };
    newWsdlObject.documentation = getWSDLDocumentation(parsedXml, WSDL_ROOT);
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
      services = getServices(parsedXml, WSDL_ROOT),
      bindings = getBindings(parsedXml, WSDL_ROOT, wsdlObject),
      elements = getElementsFromWSDL(parsedXml, principalPrefix, WSDL_ROOT,
        wsdlObject.schemaNamespace, wsdlObject.tnsNamespace);

    bindings.forEach((binding) => {
      const bindingTagInfo =
        this.informationService.getBindingInfoFromBindingTag(binding,
          newWsdlObject.SOAPNamespace,
          newWsdlObject.SOAP12Namespace,
          newWsdlObject.HTTPNamespace),
        bindingOperations = getBindingOperation(binding, principalPrefix, newWsdlObject),
        bindingTypeFilter =
          getAttributeByName(binding, ATRIBUTE_TYPE).replace(THIS_NS_PREFIX, '');

      bindingOperations.forEach((bindingOperation) => {
        let wsdlOperation = new Operation(),
          servicePort,
          service,
          portTypeOperation,
          serviceAndPort,
          portTypeOperationDocumentation;

        serviceAndPort = this.informationService.getServiceAndServicePortByBindingName(
          getAttributeByName(binding, NAME_TAG),
          services, principalPrefix, wsdlObject
        );
        service = serviceAndPort ? serviceAndPort.service : undefined;
        servicePort = serviceAndPort ? serviceAndPort.port : undefined;
        wsdlOperation.name = getAttributeByName(bindingOperation, ATRIBUTE_NAME);
        portTypeOperation = this.informationService.getPortTypeOperationByPortTypeNameAndOperationName(
          bindingTypeFilter,
          wsdlOperation.name,
          parsedXml, principalPrefix
        );
        portTypeOperationDocumentation = this.informationService.getPortTypeOperationDocumentation(
          portTypeOperation,
          principalPrefix
        );
        wsdlOperation.method = bindingTagInfo.verb;
        wsdlOperation.protocol = bindingTagInfo.protocol;
        wsdlOperation.style = this.informationService.getStyleFromBindingOperation(
          bindingOperation,
          bindingTagInfo
        );
        wsdlOperation.portName = this.informationService.getPortName(servicePort);
        wsdlOperation.serviceName = this.informationService.getServiceName(service);
        wsdlOperation.description = portTypeOperationDocumentation;

        wsdlOperation.input = this.informationService.getElementFromPortTypeOperation(
          parsedXml,
          portTypeOperation,
          elements,
          principalPrefix,
          INPUT_TAG
        );
        wsdlOperation.output = this.informationService.getElementFromPortTypeOperation(
          parsedXml,
          portTypeOperation,
          elements,
          principalPrefix,
          OUTPUT_TAG
        );
        wsdlOperation.fault = this.informationService.getElementFromPortTypeOperation(
          parsedXml,
          portTypeOperation,
          elements,
          principalPrefix,
          FAULT_TAG
        );
        wsdlOperation.url = this.informationService.getServiceURL(servicePort, bindingOperation, bindingTagInfo);
        wsdlOperation.xpathInfo = this.informationService.getOperationxPathInfo(
          bindingTagInfo.bindingName,
          wsdlOperation.name,
          wsdlObject.wsdlNamespace.url
        );
        wsdlOperations.push(wsdlOperation);
      });
    });
    newWsdlObject.operationsArray = wsdlOperations;

    return newWsdlObject;
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
  WSDL_ROOT
};
