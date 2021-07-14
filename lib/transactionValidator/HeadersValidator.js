const MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  CONTENT_TYPE_HEADER_KEY = 'Content-Type',
  VALID_CONTENT_TYPES = ['text/xml', 'application/soap+xml'],
  HEADER_PROPERTY = 'HEADER';

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
   * @returns {Array} missmatchs array
   */
  validate(requestHeaders, entityId, validateHeadersOption, isResponse, options) {
    let missmatches = [],
      contentTypeMissmatch;
    if (validateHeadersOption) {
      contentTypeMissmatch = this.validateContentTypeHeader(requestHeaders, entityId, isResponse, options);
    }
    if (contentTypeMissmatch) {
      missmatches.push(contentTypeMissmatch);
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

}

module.exports = {
  HeadersValidator
};
