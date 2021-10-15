const { BodyMismatch } = require('./../utils/BodyMismatch'),
  { SOAPMessageHelper } = require('../utils/SOAPMessageHelper'),
  {
    getCleanSchema,
    validateMessageWithSchema,
    unwrapAndCleanBody,
    getMessagePayload,
    getMessageNamespace,
    findNSKeysWithSameTargetThanSchema,
    replaceNSKeysWithSameTargetThanSchema
  } = require('../utils/messageWithSchemaValidation'),
  INVALID_BODY_REASON_CODE = 'INVALID_BODY',
  INVALID_RESPONSE_BODY_REASON_CODE = 'INVALID_RESPONSE_BODY',
  RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
  BODY_PROPERTY = 'BODY',
  RESPONSE_BODY_NOT_PROVIDED_MSG = 'Response body not provided',
  REQUEST_BODY_NOT_PROVIDED_MSG = 'Request body not provided',
  MISSING_SCHEMA_ERROR_PART = 'This element is not expected',
  {
    isPmVariable
  } = require('../utils/textUtils'),
  {
    GET_METHOD
  } = require('../utils/httpUtils');

/**
 * Class to validate a postman request body
 */
class BodyValidatorRawSOAP {

  /**
   * Validate body string and return mismatches
   * @param {String} body Message in body
   * @param {Object} wsdlObject Object generated from wsdl document
   * @param {Object} operationFromWSDL wsdlObject operation's
   * @param {Boolean} isResponse True if provided message is in a response, False if is in a request
   * @param {object} options options validation process
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @param {object} elementFromWSDLMessage the element from message
   * @returns {Array} List of mismatches found
   */
  validate(body, wsdlObject, operationFromWSDL, isResponse, options, xmlParser,
    elementFromWSDLMessage) {
    let mismatches = [],
      filteredErrors,
      errors,
      namespaceURL,
      keysFromNSSameTargetThanSchema,
      rawXmlMessage;
    const {
        validationPropertiesToIgnore,
        detailedBlobValidation
      } = options,
      mismatchProperty = isResponse ? RESPONSE_BODY_PROPERTY : BODY_PROPERTY;

    if (validationPropertiesToIgnore && validationPropertiesToIgnore.includes(mismatchProperty)) {
      return mismatches;
    }

    if (body) {
      const parsedXml = wsdlObject.xmlParsed;
      namespaceURL = getMessageNamespace(body, elementFromWSDLMessage.name);
      let { cleanSchema, isSchemaXSDDefault, schemaTargetNamespace } =
        getCleanSchema(parsedXml, wsdlObject, wsdlObject.version, xmlParser, namespaceURL);
      if (!isSchemaXSDDefault) {
        rawXmlMessage = unwrapAndCleanBody(body, elementFromWSDLMessage.name);
      }
      else {
        rawXmlMessage = getMessagePayload(body, elementFromWSDLMessage.name);
      }

      keysFromNSSameTargetThanSchema = findNSKeysWithSameTargetThanSchema(wsdlObject.allNameSpaces,
        schemaTargetNamespace);
      rawXmlMessage = replaceNSKeysWithSameTargetThanSchema(keysFromNSSameTargetThanSchema, rawXmlMessage);

      errors = validateMessageWithSchema(rawXmlMessage, cleanSchema);
      if (errors.length > 0) {
        filteredErrors = this.filterSchemaValidationErrors(errors, options);
        filteredErrors = this.handleDetailedBlobValidation(filteredErrors, detailedBlobValidation);
        mismatches = filteredErrors.map((error) => {
          const currentBody = detailedBlobValidation ? rawXmlMessage : body,
            expectedBody = this.getBodyFromSchema(
              wsdlObject,
              operationFromWSDL,
              elementFromWSDLMessage,
              xmlParser,
              detailedBlobValidation
            ),
            mismatch = new BodyMismatch(error, currentBody, expectedBody, operationFromWSDL, isResponse, options);
          return mismatch.getMismatch();
        });
      }
    }
    else if (operationFromWSDL.method !== GET_METHOD) {
      mismatches = [
        {
          property: isResponse ? RESPONSE_BODY_PROPERTY : BODY_PROPERTY,
          transactionJsonPath: isResponse ? '$.response.body' : '$.request.body',
          schemaJsonPath: operationFromWSDL.xpathInfo.xpath,
          reasonCode: isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE,
          reason: isResponse ? RESPONSE_BODY_NOT_PROVIDED_MSG : REQUEST_BODY_NOT_PROVIDED_MSG
        }
      ];
    }
    return mismatches;
  }

  /**
   * @description Filter the obtained schema validation errors
   * according to the sent options
   * @param {Array} errors schema validation errors
   * @param {object} options options validation process
   * @returns {Array} filtered validation errors
   */
  filterSchemaValidationErrors(errors, options) {
    let filteredErrors = errors;
    const {
      ignoreUnresolvedVariables,
      showMissingInSchemaErrors
    } = options;
    if (ignoreUnresolvedVariables) {
      filteredErrors = errors.filter((error) => {
        if (error.code !== 1824) {
          return true;
        }
        return error.code === 1824 && !isPmVariable(error.str1);
      });
    }

    if (showMissingInSchemaErrors !== undefined && showMissingInSchemaErrors === false) {
      filteredErrors = filteredErrors.filter((error) => {
        const isMissingInSchemaError = (
          error.code === 1871 &&
          error.message.includes(MISSING_SCHEMA_ERROR_PART)
        );
        return !isMissingInSchemaError;
      });
    }
    return filteredErrors;
  }

  /**
 * filter errors depending on detailedBlobValidation option
 * @param {array} errors the array of errors to report
 * @param {boolean} detailedBlobValidation option to define if error will be reported with detail or not
 * @returns {array} an array with errors depending on detailedBlobValidation option
 */
  handleDetailedBlobValidation(errors, detailedBlobValidation) {
    if (!detailedBlobValidation && errors.length > 0) {
      return [errors[0]];
    }
    return errors;
  }

  /**
   * generate a correct body from the wsdl schema
   * @param {object} wsdlObject the wsdlObject from the wsdl file
   * @param {object} operationFromWsdl the current operation object
   * @param {object} elementFromWSDLMessage the wsdl element for creating the message
   * @param {object} xmlParser injects the parse that will be used
   * @param {boolean} detailed defines if generated body will contain all namespaces and envelope tags or not
   * @returns {string} the correct body from the wsdl document schema
   */
  getBodyFromSchema(wsdlObject, operationFromWsdl, elementFromWSDLMessage, xmlParser, detailed) {
    const messageHelper = new SOAPMessageHelper();
    let message = messageHelper.convertInputToMessage(elementFromWSDLMessage,
      wsdlObject.securityPolicyArray,
      operationFromWsdl.protocol,
      xmlParser
    );
    if (detailed) {
      message = unwrapAndCleanBody(message, elementFromWSDLMessage.name);
    }
    return message;
  }

}

module.exports = {
  BodyValidatorRawSOAP
};
