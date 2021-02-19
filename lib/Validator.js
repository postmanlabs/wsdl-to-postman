const WSDL_11_VALIDATOR = 'definitions>',
  {
    readInput
  } = require('./utils/readInput'),
  WSDL_20_VALIDATOR = 'description>';

/**
 * Class to validate inputObject.
 */
class Validator {
  /**
   * generates a valid result object.
   * @param {boolean} result true when input is valid and viceversa
   * @param {string} reason Return the reason of the result
   * @returns {object} A valid Result object with format {result: <boolean>, reason: <string>}
   */
  result(result, reason = null) {
    return {
      result,
      reason
    };
  }

  /**
   * Validates if input contains necessary format and content.
   * In case of files it validates if provided file path exists.
   * @param {object} input  Contains type (string/file) of input and data (stringValue/filePath)
   *                        Format: {data: <string>, type: <string>}
   * @returns {object} A valid result object with format {result: <boolean>, reason: <string>}
   */
  validate(input) {
    let xml;
    if (this.inputNotProvided(input.data)) {
      return this.result(false, 'Input not provided');
    }

    try {
      xml = readInput(input);
    }
    catch (inputError) {
      return this.result(false, inputError.message);
    }

    if (this.notContainsWsdlSpec(xml)) {
      return this.result(false, 'Not WSDL Specification found in your document');
    }

    return this.result(true, 'Success');
  }

  /**
   * Validates if input.data is provided.
   * @param {string} input input.data content
   * @returns {boolean} result of validation
   */
  inputNotProvided(input) {
    if (input) {
      return false;
    }
    return true;
  }

  /**
   * Validates if string/file content contains a valid WSDL specification.
   * @param {string} xml input.data content
   * @returns {bioolean} result of validation
   */
  notContainsWsdlSpec(xml) {
    if (xml.includes(WSDL_11_VALIDATOR) || xml.includes(WSDL_20_VALIDATOR)) {
      return false;
    }
    return true;
  }
}

module.exports = {
  Validator
};
