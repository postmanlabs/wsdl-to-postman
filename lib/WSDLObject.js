'use strict';
class Log {
  constructor() {
    this.errors = '';
  }
  logError(errorDescription) {
    this.errors = this.errors + '\n' + errorDescription;
  }
}
class WsdlObject {
  constructor() {
    this.operationsArray = '';
    this.targetNamespace = '';
    this.wsdlNamespace = '';
    this.SOAPNamespace = '';
    this.SOAP12Namespace = '';
    this.HTTPNamespace = '';
    this.schemaNamespace = '';
    this.tnsNamespace = '';
    this.allNameSpaces = '';
    this.fileName = '';
    this.securityPolicyArray = '';
    this.log = new Log();
    this.xmlParsed = '';
    this.version = '';
    this.documentation = '';
    this.localSchemaNamespaces = '';
  }
}

class NameSpace {
  constructor() {
    this.key = '';
    this.url = '';
    this.prefixFilter = '';
    this.isDefault = '';
    this.tnsDefinitionURL = '';
  }
}

class Element {
  constructor() {
    this.children = '';
    this.minOccurs = '';
    this.maxOccurs = '';
    this.name = '';
    this.type = '';
    this.isComplex = '';
    this.namespace = '';
    this.maximum = '';
    this.minimum = '';
    this.maxLength = '';
    this.minLength = '';
    this.pattern = '';
    this.enum = '';
  }
}

class Operation {
  constructor() {
    this.name = '';
    this.description = '';
    this.style = '';
    this.url = '';
    this.input = '';
    this.header = '';
    this.output = '';
    this.fault = '';
    this.portName = '';
    this.serviceName = '';
    this.serviceDescription = '';
    this.method = '';
    this.protocol = '';
    this.xpathInfo = '';
    this.soapActionSegment = '';
    this.soapAction = '';
    this.mimeContentInput = '';
    this.mimeContentOutput = '';
  }
}
class BindingExtraInformation {
  constructor() {
    this.mimeType = '';
    this.type = '';
    this.part = '';
  }
}

module.exports = {
  WsdlObject: WsdlObject,
  Operation: Operation,
  Element: Element,
  NameSpace: NameSpace,
  Log: Log,
  BindingExtraInformation: BindingExtraInformation
};
