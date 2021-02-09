const WsdlObject = require('./WsdlObject');

class Wsdl20Parser {
  constructor(xmlDocumentContent) {
    this.parser = xmlDocumentContent; // TODO: Define and fill it with third party xml parser
  }

  getWsdlObject() {
    return new WsdlObject();
  }

  getWsdlOperations() {
    return {};
  }
}

module.exports = {
  Wsdl20Parser
};
