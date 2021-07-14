const {
  SOAP_PROTOCOL,
  SOAP12_PROTOCOL,
  SOAP_METHOD_PROPERTY = 'SOAP_METHOD',
  INVALID_SOAP_METHOD_REASON_CODE = 'INVALID_SOAP_METHOD'
} = require('../constants/processConstants');

/**
 * Class to validate a postman request http method
 */
class MethodValidator {

  /**
   * Validate that the request uses POST method due that is the used for SOAP Protocol
   * @param {Array} protocol the WSDL operation protocol
   * @param {Object} method The Request Http Method
   * @param {Object} operationFromWSDL The wsdlObject operation's
   * @param {Object} validationPropertiesToIgnore option for ignoring properties in validation
   * @returns {Array} mismatches array
   */
  validate(protocol, method, operationFromWSDL, validationPropertiesToIgnore) {
    const postProtocols = [SOAP_PROTOCOL, SOAP12_PROTOCOL];
    let mismatches = [];
    if (validationPropertiesToIgnore && validationPropertiesToIgnore.includes(SOAP_METHOD_PROPERTY)) {
      return mismatches;
    }
    if (postProtocols.includes(protocol.toLowerCase()) && method.toLowerCase() !== 'post') {
      mismatches = [
        {
          property: SOAP_METHOD_PROPERTY,
          transactionJsonPath: '$.request.method',
          schemaJsonPath: operationFromWSDL.xpathInfo.xpath,
          reasonCode: INVALID_SOAP_METHOD_REASON_CODE,
          reason: 'Soap requests must use POST method.'
        }
      ];
    }
    return mismatches;
  }
}

module.exports = {
  MethodValidator
};
