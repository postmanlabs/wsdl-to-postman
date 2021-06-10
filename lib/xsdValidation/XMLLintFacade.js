const { XSDValidationError } = require('./XSDValidationError'),
  xmllint = require('xmllint'),
  INVALID_TYPE = 'is not a valid value of the atomic type',
  NOT_EXPECTED = 'This element is not expected',
  NOT_ALLOWED = 'Character content is not allowed',
  ERROR_STRING_PLACE = 'Schemas validity error : ';

/**
 * Class to validate XML against an XSD schema.
 * Facade to xmllint package
 */
class XMLLintFacade {

  /**
   *  Validates the xml against schema
   * @param {string} xml the xml to validate
   * @param {string} schema the xsd schema to use in validation
   * @returns {object} the parsed object
   */
  validate(xml, schema) {
    var res = xmllint.validateXML({
      xml: xml,
      schema: schema
    });
    return res;
  }

  /**
   *  Takes in the xmllint errors and convert them
   * into a known XSDValidationError object
   * @param {object} errors the result for xmllint validation
   * @param {string} schema the xsd schema to use in validation
   * @returns {Array} array of XSDValidationError
   */
  mapErrors(errors) {
    let adaptedErrors = [];
    if (!errors || !errors.errors) {
      return [];
    }
    errors.errors.forEach((error) => {
      let code,
        message,
        str1,
        valError;
      if (error.includes(INVALID_TYPE)) {
        code = 1824;
        message = error.split(ERROR_STRING_PLACE)[1];
        str1 = message.split('Element \'message\': ')[1].split('\'')[1];
        valError = new XSDValidationError(code, message + '\n', str1);
        adaptedErrors.push(valError);
      }
      else if (error.includes(NOT_EXPECTED)) {
        code = 1871;
        message = error.split(ERROR_STRING_PLACE)[1];
        valError = new XSDValidationError(code, message + '\n', undefined);
        adaptedErrors.push(valError);
      }
      else if (error.includes(NOT_ALLOWED)) {
        code = 1841;
        message = error.split(ERROR_STRING_PLACE)[1];
        valError = new XSDValidationError(code, message + '\n', undefined);
        adaptedErrors.push(valError);
      }
    });
    return adaptedErrors;
  }

}

module.exports = {
  XMLLintFacade
};
