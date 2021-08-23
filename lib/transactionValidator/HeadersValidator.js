const MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  CONTENT_TYPE_HEADER_KEY = 'Content-Type',
  SOAP_ACTION_HEADER_KEY = 'SOAPAction',
  VALID_CONTENT_TYPES = ['text/xml', 'application/soap+xml'],
  HEADER_PROPERTY = 'HEADER',
  {
    isPmVariable
  } = require('../utils/textUtils');

/**
 * Class to validate postman request headers
 */
class HeadersValidator {

  /**
   *
   * @description validates request or response headers
   * @param {object} requestHeaders headers list
   * @param {string} entityId request or response id
   * @param {boolean} validateHeadersOption if validateHeadersOption option value, False by default
   * @param {boolean} isResponse true if the entity is response false if not
   * @param {object} options options validation process
   * @param {Operation} operationFromWSDL wsdl operation that corresponds to either the request or response
   * @returns {Array} missmatchs array
   */
  validate(requestHeaders, entityId, validateHeadersOption, isResponse, options, operationFromWSDL) {
    let missmatches = [],
      contentTypeMissmatch,
      soapActionMissmatch;
    if (validateHeadersOption) {
      contentTypeMissmatch = this.validateContentTypeHeader(requestHeaders, entityId, isResponse, options);
      soapActionMissmatch = this.validateSoapActionHeader(requestHeaders, isResponse, options,
        operationFromWSDL);
    }
    if (contentTypeMissmatch) {
      missmatches.push(contentTypeMissmatch);
    }
    if (soapActionMissmatch) {
      missmatches.push(soapActionMissmatch);
    }
    return missmatches;
  }

  /**
   *
   * @description validates if the content type header is pressent and if has value of text/xml
   * @param {object} headers headers list
   * @param {string} entityId request or response id
   * @param {boolean} isResponse true if the entity is response false if not
   * @param {object} options options validation process
   * @returns {object} missmatch object if the case
   */
  validateContentTypeHeader(headers, entityId, isResponse, options) {
    let index = headers.findIndex((header) => { return header.key === CONTENT_TYPE_HEADER_KEY; }),
      foundHeader,
      contentTypeHeader = headers[index];
    const { ignoreUnresolvedVariables } = options;
    if (!contentTypeHeader) {
      return {
        property: HEADER_PROPERTY,
        transactionJsonPath: isResponse ? `$.responses[${entityId}].header` : '$.request.header',
        schemaJsonPath: 'schemaPathPrefix',
        reasonCode: MISSING_IN_REQUEST_REASON_CODE,
        reason: 'The header "Content-Type" was not found in the transaction'
      };
    }
    if (ignoreUnresolvedVariables && isPmVariable(contentTypeHeader.value)) {
      return;
    }
    foundHeader = VALID_CONTENT_TYPES.find((validContent) => {
      return contentTypeHeader.value.includes(validContent);
    });
    if (!foundHeader) {
      return {
        property: HEADER_PROPERTY,
        transactionJsonPath: isResponse ? `$.responses[${entityId}].header[${index}].value` :
          `$.request.header[${index}].value`,
        schemaJsonPath: 'schemaPathPrefix',
        reasonCode: INVALID_TYPE_REASON_CODE,
        reason: `The header "Content-Type" needs to be "${VALID_CONTENT_TYPES[0]}" or "${VALID_CONTENT_TYPES[1]}" ` +
        `but we found "${contentTypeHeader.value}" instead`
      };
    }
  }

  /**
   *
   * @description validates if the content type header is pressent and if has value of text/xml
   * @param {object} headers headers list
   * @param {boolean} isResponse true if the entity is response false if not
   * @param {object} options options validation process
   * @param {Operation} operationFromWSDL wsdl operation that corresponds to either the request or response
   * @returns {object} missmatch object if the case
   */
  validateSoapActionHeader(headers, isResponse, options, operationFromWSDL) {
    let index = headers.findIndex((header) => { return header.key === SOAP_ACTION_HEADER_KEY; }),
      soapActionHeader = headers[index];
    const { ignoreUnresolvedVariables } = options;
    if (isResponse || !operationFromWSDL.soapAction) {
      return;
    }
    if (!soapActionHeader) {
      return {
        property: HEADER_PROPERTY,
        transactionJsonPath: '$.request.header',
        schemaJsonPath: 'schemaPathPrefix',
        reasonCode: MISSING_IN_REQUEST_REASON_CODE,
        reason: 'The header "SoapAction" was not found in the transaction'
      };
    }
    if (ignoreUnresolvedVariables && isPmVariable(soapActionHeader.value)) {
      return;
    }
    if (soapActionHeader.value !== operationFromWSDL.soapAction) {
      return {
        property: HEADER_PROPERTY,
        transactionJsonPath: `$.request.header[${index}].value`,
        schemaJsonPath: 'schemaPathPrefix',
        reasonCode: INVALID_TYPE_REASON_CODE,
        reason: `The header "SoapAction" needs to be "${operationFromWSDL.soapAction}" ` +
        `but we found "${soapActionHeader.value}" instead`
      };
    }
  }

}

module.exports = {
  HeadersValidator
};
