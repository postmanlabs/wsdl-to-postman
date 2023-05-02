const
  _ = require('lodash'),
  WsdlObject = require('./WSDLObject').WsdlObject,
  Operation = require('./WSDLObject').Operation,
  UserError = require('./UserError'),
  {
    getPrincipalPrefix,
    getNamespaceByURL,
    getNamespaceByKey,
    getTnsNamespace,
    getAllNamespaces,
    getServices,
    getBindings,
    getElementsFromWSDL,
    getSchemaNamespace,
    getAttributeByName,
    getBindingOperation,
    assignSecurity,
    getWSDLDocumentation,
    getServiceDocumentation
  } = require('./WsdlParserCommon'),
  {
    getLastSegmentURL
  } = require('../lib/utils/textUtils'),
  {
    decodeFromXML
  } = require('./utils/urlUtils');

class WsdlParser {

  constructor(informationService) {
    this.informationService = informationService;
  }

  /**
   * Creates a WSDLObject
   * that represents the information of a WSDL object and that is
   * required to create a Postman collection
   * @param {object} parsedXml the already parsed to object xml
   * @param {XMLParser} xmlParser object to parse xml string to object
   * @returns {object} the WSDLObject
   */
  getWsdlObject(parsedXml) {
    if (!parsedXml) {
      throw new UserError('Provided WSDL definition is invalid XML.');
    }
    let wsdlObject = new WsdlObject();
    wsdlObject = this.assignNamespaces(wsdlObject, parsedXml);
    wsdlObject = this.assignOperations(wsdlObject, parsedXml);
    wsdlObject = this.assignSecurity(wsdlObject, parsedXml);
    wsdlObject = this.assignDocumentation(wsdlObject, parsedXml);
    wsdlObject.xmlParsed = parsedXml;
    wsdlObject.version = this.informationService.version;
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
    const allNameSpaces = getAllNamespaces(parsedXml, this.informationService.RootTagName),
      wsdlNamespace = getNamespaceByURL(parsedXml, this.informationService.WSDLNamespaceURL,
        this.informationService.RootTagName),
      soapNamespace = getNamespaceByURL(parsedXml, this.informationService.SOAPNamesapceURL,
        this.informationService.RootTagName) ||
        getNamespaceByKey(parsedXml, this.informationService.SOAPNamespaceKey, this.informationService.RootTagName),
      soap12Namespace = getNamespaceByURL(parsedXml, this.informationService.SOAP12NamesapceURL,
        this.informationService.RootTagName),
      targetNamespace = getNamespaceByKey(parsedXml, this.informationService.TargetNamespaceKey,
        this.informationService.RootTagName),
      tnsNamespace = getTnsNamespace(parsedXml, this.informationService.THISNamespaceKey,
        targetNamespace, allNameSpaces, this.informationService.RootTagName),
      { globalSchemaNamespace, localSchemaNamespaces } = getSchemaNamespace(parsedXml,
        this.informationService.RootTagName, tnsNamespace),
      HTTPNamespace = getNamespaceByURL(parsedXml, this.informationService.HTTPNamespaceURL,
        this.informationService.RootTagName) ||
        getNamespaceByKey(parsedXml, this.informationService.HTTPNamespaceKey, this.informationService.RootTagName),
      securityPolicyNamespace = getNamespaceByURL(parsedXml, this.informationService.XMLPolicyURL,
        this.informationService.RootTagName);

    newWsdlObject.targetNamespace = targetNamespace;
    newWsdlObject.wsdlNamespace = wsdlNamespace;
    newWsdlObject.SOAPNamespace = soapNamespace;
    newWsdlObject.SOAP12Namespace = soap12Namespace;
    newWsdlObject.SOAP12Namespace = soap12Namespace;
    newWsdlObject.schemaNamespace = globalSchemaNamespace;
    newWsdlObject.localSchemaNamespaces = localSchemaNamespaces;
    newWsdlObject.tnsNamespace = tnsNamespace;
    newWsdlObject.allNameSpaces = allNameSpaces;
    newWsdlObject.HTTPNamespace = HTTPNamespace;
    newWsdlObject.securityPolicyNamespace = securityPolicyNamespace;

    return newWsdlObject;
  }

  /**
  * Assigns wsdl security to the wsdl object
  * @param {WsdlObject} wsdlObject the object to populate
  * @param {object} parsedXml the content file in javascript object representation
  * @returns {object} the WSDLObject
  */
  assignSecurity(wsdlObject, parsedXml) {
    return assignSecurity(wsdlObject, parsedXml, this.informationService.RootTagName);
  }

  /**
   * Assigns wsdl documentation to the wsdl object
   * @param {WsdlObject} wsdlObject the object to populate
   * @param {object} parsedXml the content file in javascript object representation
   * @returns {object} the WSDLObject
   */
  assignDocumentation(wsdlObject, parsedXml) {
    let newWsdlObject = { ...wsdlObject },
      neWSDLDocumentation = getWSDLDocumentation(parsedXml, this.informationService.RootTagName, newWsdlObject);
    if (neWSDLDocumentation === '') {
      let serviceInfo = this.getServicesAndDocumentation(parsedXml);
      if (serviceInfo && serviceInfo.length === 1) {
        this.name = serviceInfo[0].name;
        neWSDLDocumentation = serviceInfo[0].description;
      }
    }
    newWsdlObject.documentation = neWSDLDocumentation;
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
    const principalPrefix = getPrincipalPrefix(parsedXml, this.informationService.RootTagName),
      services = getServices(parsedXml, this.informationService.RootTagName),
      bindings = getBindings(parsedXml, this.informationService.RootTagName, wsdlObject),
      elements = getElementsFromWSDL(parsedXml, principalPrefix, this.informationService.RootTagName,
        wsdlObject);

    bindings.forEach((binding) => {
      const bindingTagInfo =
        this.informationService.getBindingInfoFromBindingTag(binding,
          newWsdlObject.SOAPNamespace,
          newWsdlObject.SOAP12Namespace,
          newWsdlObject.HTTPNamespace,
          newWsdlObject.allNameSpaces),
        bindingOperations = getBindingOperation(binding, principalPrefix, newWsdlObject),

        portTypeInterfaceName = this.informationService.getAbstractDefinitionName(binding, newWsdlObject.tnsNamespace);

      bindingOperations.forEach((bindingOperation) => {
        let wsdlOperation = new Operation(),
          servicePort,
          service,
          portTypeInterfaceOperation,
          serviceAndPort,
          operationDocumentation,
          bindingOperationName =
            this.informationService.getBindingOperationName(bindingOperation, newWsdlObject.tnsNamespace);

        serviceAndPort = this.informationService.getServiceAndExpossedInfoByBindingName(
          getAttributeByName(binding, this.informationService.NameTag),
          services, principalPrefix, newWsdlObject
        );
        service = serviceAndPort ? serviceAndPort.service : undefined;
        servicePort = serviceAndPort ? serviceAndPort.port : undefined;
        wsdlOperation.name = bindingOperationName;
        portTypeInterfaceOperation =
          this.informationService.getAbstractOperationByName(
            portTypeInterfaceName,
            wsdlOperation.name,
            parsedXml, principalPrefix
          );
        operationDocumentation = this.informationService.getOperationDocumentation(
          portTypeInterfaceOperation,
          principalPrefix
        );

        wsdlOperation.serviceDescription = getServiceDocumentation(service, principalPrefix);
        wsdlOperation.method = bindingTagInfo.verb ? bindingTagInfo.verb :
          this.informationService.getOperationHttpMethod(bindingOperation, newWsdlObject.HTTPNamespace);
        wsdlOperation.protocol = bindingTagInfo.protocol;
        wsdlOperation.portName = this.informationService.getPortName(servicePort);
        wsdlOperation.serviceName = this.informationService.getServiceName(service);
        wsdlOperation.description = operationDocumentation;

        wsdlOperation.style = this.informationService.getStyleFromBindingOperation(
          bindingOperation,
          bindingTagInfo
        );

        wsdlOperation.soapAction = this.informationService.getSOAPActionFromBindingOperation(
          bindingOperation,
          bindingTagInfo
        );
        wsdlOperation.soapActionSegment = getLastSegmentURL(wsdlOperation.soapAction);
        wsdlOperation.input = this.informationService.getElementFromPortTypeInterfaceOperation(
          parsedXml,
          portTypeInterfaceOperation,
          elements,
          principalPrefix,
          this.informationService.InputTagName,
          newWsdlObject.tnsNamespace,
          portTypeInterfaceName
        );
        wsdlOperation.output = this.informationService.getElementFromPortTypeInterfaceOperation(
          parsedXml,
          portTypeInterfaceOperation,
          elements,
          principalPrefix,
          this.informationService.OutputTagName,
          newWsdlObject.tnsNamespace,
          portTypeInterfaceName
        );
        wsdlOperation.fault = this.informationService.getElementFromPortTypeInterfaceOperation(
          parsedXml,
          portTypeInterfaceOperation,
          elements,
          principalPrefix,
          this.informationService.FaultTagName,
          newWsdlObject.tnsNamespace,
          portTypeInterfaceName
        );
        wsdlOperation.xpathInfo = this.informationService.getOperationxPathInfo(
          bindingTagInfo.bindingName,
          wsdlOperation.name,
          _.get(wsdlObject, 'wsdlNamespace.url'),
          wsdlObject.tnsNamespace
        );
        wsdlOperation.mimeContentInput = this.informationService.getMimeContentInfo(bindingOperation,
          principalPrefix, this.informationService.InputTagName);
        wsdlOperation.mimeContentOutput = this.informationService.getMimeContentInfo(bindingOperation,
          principalPrefix, this.informationService.OutputTagName);
        wsdlOperation.url = this.informationService.getServiceURL(servicePort, bindingOperation, bindingTagInfo,
          decodeFromXML, wsdlOperation.mimeContentInput, wsdlOperation.input[0]);

        wsdlOperations.push(wsdlOperation);
      });
    });
    newWsdlObject.operationsArray = wsdlOperations;

    return newWsdlObject;
  }

  /**
   * Reads the parsedXML object, look for the services and return the information
   * @param {object} parsedXml the content file in javascript object representation
   * @returns {Array} services with name and description
   */
  getServicesAndDocumentation(parsedXml) {
    const informationService = this.informationService,
      principalPrefix = getPrincipalPrefix(parsedXml, this.informationService.RootTagName);

    let services = getServices(parsedXml, this.informationService.RootTagName);
    if (services) {
      let result = services.map((service) => {
        let name = getAttributeByName(service, informationService.NameTag),
          serviceDescription = getServiceDocumentation(service, principalPrefix);
        return {
          name: name,
          description: serviceDescription
        };
      });
      return result;
    }
    return [];
  }

}

module.exports = {
  WsdlParser
};
