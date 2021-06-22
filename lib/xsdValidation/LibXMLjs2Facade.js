const libxml = require('libxmljs2'),
  {
    XSDValidationError
  } = require('./XSDValidationError');


/**
 * Class to validate XML against an XSD schema.
 * Facade to libxmljs package
 */
class LibXMLjs2Facade {

  /**
   *  Validates the xml against schema
   * @param {string} xml the xml to validate
   * @param {string} schema the xsd schema to use in validation
   * @returns {object} the parsed object
   */
  validate(xml, schema) {
    const xsdParsed = libxml.parseXmlString(schema),
      messageParsed = libxml.parseXmlString(xml);
    messageParsed.validate(xsdParsed);
    return messageParsed.validationErrors;
  }

  /**
   *  Takes in the libxmljs2 errors and convert them
   * into a known XSDValidationError object
   * @param {Array} errors the result for libxmljs2 validation
   * @param {string} schema the xsd schema to use in validation
   * @returns {Array} array of XSDValidationError
   */
  mapErrors(errors) {
    let adaptedErrors = errors.map((error) => {
      return new XSDValidationError(error.code, error.message, error.str1);
    });
    return adaptedErrors;
  }

  findByXpathInXmlString(xmlString, xpath) {
    const document = libxml.parseXmlString(xmlString),
      elements = document.find(xpath);
    return elements;
  }

  parseXmlString(xmlString) {
    return libxml.parseXmlString(xmlString);
  }

  getElementText(element) {
    const text = element.length > 0 ? element[0].text() : '';
    return text;
  }

  getChildrenAsString(element) {
    const result = element[0].childNodes().filter((child) => {
      return child.name() !== 'text';
    }).map((element) => {
      return element.toString();
    }).join('\n');
    return result;
  }

  getChildrenElements(node) {
    const children = node.childNodes().filter((child) => {
      return child.name() !== 'text';
    });
    return children;
  }
}

module.exports = {
  LibXMLjs2Facade
};
