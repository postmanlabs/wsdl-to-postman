const {
    readInput
  } = require('../utils/readInput'),
  WSDL_11_VALIDATOR = 'definitions>',
  WSDL_20_VALIDATOR = 'description>';

class Validator {
  result(result, reason = null) {
    return {
      result,
      reason
    };
  }

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

  inputNotProvided(input) {
    if (input) {
      return false;
    }
    return true;
  }

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
