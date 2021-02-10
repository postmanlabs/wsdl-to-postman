'use strict';
class WsdlObject {
  operationsArray;
  targetNamespace;
  wsdlNamespace;
  SOAPNamespace;
  SOAP12Namespace;
  schemaNamespace;
  tnsNamespace;
  allNameSpaces;
  fileName;
}

class NameSpace {
  key;
  url;
  isDefault;
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
