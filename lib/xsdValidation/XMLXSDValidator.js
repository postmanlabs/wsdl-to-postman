const { XMLXSDValidatorFactory } = require('./XMLXSDValidatorFactory');

/**
 * Class to validate XML against an XSD schema.
 * Facade to xmllint package
 */
class XMLXSDValidator {

  constructor(option = '') {
    this.option = option;
  }

  /**
   *  Gets the library facad for validation
   * @returns {object} the library facade
   */
  getValidatorLibrary() {
    return new XMLXSDValidatorFactory().getValidator(this.option);
  }

  /**
   *  Validates the xml against schema
   * @param {string} xml the xml to validate
   * @param {string} schema the xsd schema to use in validation
   * @returns {object} the parsed object
   */
  validate(xml, schema) {
    let validatorLibrary =  this.getValidatorLibrary(),
    rawErrors  = validatorLibrary.validate(xml, schema);
    return validatorLibrary.mapErrors(rawErrors);
  }

}

module.exports = {
  XMLXSDValidator
};
