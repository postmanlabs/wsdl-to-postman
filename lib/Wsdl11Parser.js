const WsdlObject = require('./WSDLObject');


class Wsdl11Parser {
  constructor(xmlDocumentContent) {
    this.parser = xmlDocumentContent;
  }

  getWsdlObject() {
    return new WsdlObject();
  }

  getWsdlOperations() {
    return {};
  }
}


module.exports = {
  Wsdl11Parser
};
