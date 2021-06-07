const xmllint = require("xmllint"); 

/**
 * Class to validate XML against an XSD schema.
 */
class XSDValidXML {

  /**
   *  Validats the message against schema
   * @param {string} message the xml message to validate
   * @param {string} schema the xsd schema to use in validation
   * @returns {object} the parsed object
   */
   validateMessageWithSchema(message, schema) {
    var res = xmllint.validateXML({
      xml: message,
      schema: schema
    });
    return res;
  }
 
}

module.exports = {
  XSDValidXML
};
