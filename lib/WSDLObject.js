'use strict';
class WsdlObject {
  constructor() {
    this.operationsArray = [];
    this.targetNamespace = '';
    this.wsdlNamespace = '';
    this.SOAPNamespace = '';
    this.SOAP12Namespace = '';
    this.schemaNamespace = '';
    this.tnsNamespace = '';
    this.allNameSpaces = [];
    this.fileName = '';
  }
}

class NameSpace {
  constructor() {
    this.key = '';
    this.url = '';
    this.isDefault = false;
  }
}

class ComplexType {
  name;
  elements;
}

class Element {
  children;
  minOccurs;
  maxOccurs;
  name;
  type;
  isComplex;
}

class Operation {
  name;
  description;
  style;
  url;
  input;
  output;
  fault;
  portName;
  serviceName;
  method;
  protocol;
}
module.exports = {
  WsdlObject: WsdlObject,
  Operation: Operation,
  Element: Element,
  ComplexType: ComplexType,
  NameSpace: NameSpace
};
