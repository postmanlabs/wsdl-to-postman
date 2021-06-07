const libxml = require('libxmljs'),
  {
    XSDValidationError
  } = require('./XSDValidationError');


/**
 * Class to validate XML against an XSD schema.
 * Facade to libxmljs package
 */
class LibXMLjsFacade {

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

  mapErrors(errors) {
    let adaptedErrors = errors.map((error) => {
      return new XSDValidationError(error.code, error.message, error.str1);
    });
    return adaptedErrors;
  }

}

module.exports = {
  LibXMLjsFacade
};
