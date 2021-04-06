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
    this.log = new Log();
  }
}

class NameSpace {
  constructor() {
    this.key = '';
    this.url = '';
    this.prefixFilter = '';
    this.isDefault = '';
  }
}

class ComplexType {
  constructor() {
    this.name = '';
    this.elements = '';
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
    this.enumValues = '';
  }
}

class Operation {
  constructor() {
    this.name = '';
    this.description = '';
    this.style = '';
    this.url = '';
    this.input = '';
    this.output = '';
    this.fault = '';
    this.portName = '';
    this.serviceName = '';
    this.method = '';
    this.protocol = '';
  }
}

module.exports = {
  WsdlObject: WsdlObject,
  Operation: Operation,
  Element: Element,
  ComplexType: ComplexType,
  NameSpace: NameSpace,
  Log: Log
};
