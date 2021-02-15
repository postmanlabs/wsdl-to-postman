const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>',
  Parser = require('fast-xml-parser').j2xParser,
  {
    BFSSoapParametersHelper
  } = require('../../lib/utils/BFSSoapParametersHelper'),
  parserOptions = {
    ignoreAttributes: false,
    cdataTagName: '__cdata',
    format: true,
    indentBy: '  ',
    supressEmptyNode: false
  };

class SOAPParametersUtils {


  parseObjectToXML(jsonObject) {
    let parser = new Parser(parserOptions),
      xml = parser.parse(jsonObject);
    return xml;
  }

  buildObjectParameters(element, protocol) {
    const parametersUtils = new BFSSoapParametersHelper();
    return parametersUtils.Traverse(element, protocol);
  }

}

module.exports = {
  SOAPParametersUtils,
  xmlHeader
};
