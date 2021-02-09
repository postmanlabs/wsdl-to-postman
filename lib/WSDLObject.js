class WsdlObject {
  constructor() {}

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
  constructor() {}

  key;
  url;
  isDefault;
}

class ComplexType {
  constructor() {}

  name;
  elements;
}

class Element {
  constructor() {}
  children;
  minOccurs;
  maxOccurs;
  name;
  type;
  isComplex;
}

class Operation {
  constructor() {}
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
  NameSpace: NameSpace,
};
