const Wsdl11Parser = require('./Wsdl11Parser');
const Wsdl20Parser = require('./Wsdl20Parser'),
  V11 = '1.1',
  wsdlError = require('./wsdlError'),
  V20 = '2.0';

class ParserFactory {
  getParser(xmlDocumentContent) {
    let version = this.getWsdlVersion(xmlDocumentContent);

    if (version === V11) {
      return new Wsdl11Parser(xmlDocumentContent);
    }
    else if (version === V20) {
      return new Wsdl20Parser(xmlDocumentContent);
    }
    console.error('Not supported version. 1.1 and 2.0 are both supported.');
  }

  getWsdlVersion(xmlDocumentContent) {
    if (!xmlDocumentContent) {
      throw new wsdlError('Empty input was proportionated');
    }
    if (xmlDocumentContent.includes('definitions>')) {
      return V11;
    }
    if (xmlDocumentContent.includes('description>')) {
      return V20;
    }
    throw new wsdlError('Not WSDL Specification found in your document');
  }
}


module.exports = {
  ParserFactory,
  V11,
  V20
};
