const { BodyValidatorRawSOAP } = require('./BodyValidatorRawSOAP'),
  { BodyFormEncodedValidator } = require('./BodyFormEncodedValidator'),
  { GET_METHOD } = require('../utils/httpUtils');

/**
 * Class to validate a postman request body
 */
class BodyValidator {

  /**
   * Validate body string and return mismatches
   * @param {object} postmanBody postman request body
   * @param {Object} wsdlObject Object generated from wsdl document
   * @param {Object} operationFromWSDL wsdlObject operation's
   * @param {Boolean} isResponse True if provided message is in a response, False if is in a request
   * @param {object} options options validation process
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @param {object} elementFromWSDLMessage the element from message
   * @returns {Array} List of mismatches found
   */
  validate(postmanBody, wsdlObject, operationFromWSDL, isResponse, options, xmlParser,
    elementFromWSDLMessage) {

    if (postmanBody && postmanBody.mode === 'raw') {
      let validator = new BodyValidatorRawSOAP();
      return validator.validate(postmanBody.raw, wsdlObject,
        operationFromWSDL, isResponse, options, xmlParser, elementFromWSDLMessage);
    }
    if (typeof postmanBody === 'string') {
      let validator = new BodyValidatorRawSOAP();
      return validator.validate(postmanBody, wsdlObject,
        operationFromWSDL, isResponse, options, xmlParser, elementFromWSDLMessage);
    }
    if (postmanBody && postmanBody.mode === 'urlencoded') {
      let validator = new BodyFormEncodedValidator();
      return validator.validate({ body: postmanBody, operationFromWSDL: operationFromWSDL,
        options: options, isResponse: isResponse });
    }
    if (operationFromWSDL.method === GET_METHOD) {
      return [];
    }

  }

}

module.exports = {
  BodyValidator
};
