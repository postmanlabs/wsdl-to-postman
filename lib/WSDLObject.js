'use strict';

class WsdlObject {
  operationsArray;
  targetNamespace;
  wsdlNamespace;
  SOAPNamespace;
  SOAP12Namespace;
  HTTPNamespace;
  schemaNamespace;
  tnsNamespace;
  allNameSpaces;
  fileName;
}

class NameSpace {
  key;
  url;
  prefixFilter;
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
  namespace;
  maximum;
  minimum;
  maxLength;
  minLength;
  pattern;
  enumValues;
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
