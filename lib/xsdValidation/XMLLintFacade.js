const { XSDValidationError } = require('./XSDValidationError');

const xmllint = require("xmllint"),
  INVALID_TYPE = 'is not a valid value of the atomic type',
  NOT_EXPECTED = 'This element is not expected',
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

  mapErrors(errors) {
    let adaptedErrors = [];
    if (!errors || !errors.errors) {
      return [];
    }
    errors.errors.forEach((error) => {
      if (error.includes(INVALID_TYPE)) {
        let code = 1824;
        let message = error.split(ERROR_STRING_PLACE)[1];
        let str1 = message.split('Element \'message\': ')[1].split('\'')[1];
        let valError = new XSDValidationError(code, message + '\n', str1);
        adaptedErrors.push(valError);
      }
      else if (error.includes(NOT_EXPECTED)) {
        let code = 1871;
        let message = error.split(ERROR_STRING_PLACE)[1];
        let valError = new XSDValidationError(code, message + '\n', undefined);
        adaptedErrors.push(valError);
      }
      else if (error.includes('Character content is not allowed')) {
        let code = 1841;
        let message = error.split(ERROR_STRING_PLACE)[1];
        let valError = new XSDValidationError(code, message + '\n', undefined);
        adaptedErrors.push(valError);
      }
    });
    return adaptedErrors;
  }

}

module.exports = {
  XMLLintFacade
};
