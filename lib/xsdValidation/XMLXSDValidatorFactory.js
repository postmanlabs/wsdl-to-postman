const {
    LibXMLjsFacade
  } = require('./LibXMLjsFacade'),
  {
    XMLLintFacade
  } = require('./XMLLintFacade');

/**
 * Class to get a package validator for
 * validate XML against an XSD schema.
 */
class XMLXSDValidatorFactory {

  /**
   *  Gets the xsd validator library facade
   * @param {string} option if want an specific validator send the name (libxmljs, xmllint)
   * @returns {object} the facade object
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
