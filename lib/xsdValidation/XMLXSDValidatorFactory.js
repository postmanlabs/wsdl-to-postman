const {
  LibXMLjsFacade
} = require("./LibXMLjsFacade"), 
{
  XMLLintFacade
} = require("./XMLLintFacade");

/**
 * Class to get a package validator for
 * validate XML against an XSD schema.
 */
class XMLXSDValidatorFactory {

  /**
   *  Validates the xml against schema
   * @param {string} xml the xml to validate
   * @param {string} schema the xsd schema to use in validation
   * @returns {object} the parsed object
   */
  getValidator(option = '') {
    if (option === '' || option === 'libxmljs') {
      return new LibXMLjsFacade();
    }
    else if (option === 'xmllint') {
      return new XMLLintFacade();
    }
  }

}

module.exports = {
  XMLXSDValidatorFactory
};
