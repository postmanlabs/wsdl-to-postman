const { SOAPMessageHelper } = require('./utils/SOAPMessageHelper');

const Ajv = require('ajv'),
  {
    getCleanSchema,
    validateMessageWithSchema,
    unwrapAndCleanBody,
    getMessagePayload
  } = require('./utils/messageWithSchemaValidation'),
  transactionSchema = require('./constants/transactionSchema'),
  { parseFromXmlToObject, getNamespaceByURL } = require('./WsdlParserCommon'),
  HEADER_PROPERTY = 'HEADER',
  ENDPOINT_PROPERTY = 'ENDPOINT',
  MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  MISSING_IN_SCHEMA_REASON_CODE = 'MISSING_IN_SCHEMA',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  MISSING_ENDPOINT_REASON_CODE = 'MISSING_ENDPOINT',
  CONTENT_TYPE_HEADER_KEY = 'Content-Type',
  INVALID_BODY_REASON_CODE = 'INVALID_BODY',
  INVALID_RESPONSE_BODY_REASON_CODE = 'INVALID_RESPONSE_BODY',
  INVALID_SOAP_METHOD_REASON_CODE = 'INVALID_SOAP_METHOD',
  RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
  INVALID_BODY_DEFAULT_MESSAGE = 'The request body didn\'t match the specified schema',
  BODY_PROPERTY = 'BODY',
  RESPONSE_BODY_NOT_PROVIDED_MSG = 'Response body not provided',
  REQUEST_BODY_NOT_PROVIDED_MSG = 'Request body not provided',
  SOAP_METHOD_PROPERTY = 'SOAP_METHOD',
  MISSING_SCHEMA_ERROR_PART = 'This element is not expected',
  {
    SOAP_ENVELOPE_NS_URL,
    SOAP_12_ENVELOPE_NS_URL,
    MESSAGE_TAG_ENVELOPE,
    MESSAGE_TAG_BODY,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL
  } = require('./constants/processConstants'),
  {
    isPmVariable
  } = require('./utils/textUtils');

class TransactionValidator {
  /**
   *
   * @description Validates item transactions (requests)
   *
   * @param {*} items RequestList
   * @param {*} wsdlObject WSDLObject from wsdl file
   * @param {XMLParser} xmlParser object to parser xml string to object
   * @param {object} options contains options to modify validation
   * @returns {object} validation results
   */
  validateTransaction(items, wsdlObject, xmlParser, options = {}) {
    let result = {
      matched: true,
      requests: {}
    };

    if (!wsdlObject) {
      throw new Error('wsdlObject not provided');
    }
    this.validateStructure(items);
    this.validateRequiredFields(items);
    result = this.validateItems(items, wsdlObject, xmlParser, options);
    return result;
  }

  /**
   *
   * @description Validates item transactions (requests item)
   *
   * @param {*} items RequestList
   * @param {*} wsdlObject WSDLObject from wsdl file
   * @param {XMLParser} xmlParser object to parser xml string to object
   * @param {object} options contains options to modify validation
   * @returns {object} validation results
   */
  validateItems(items, wsdlObject, xmlParser, options) {
    let processedInfoItems = [],
      endpointMatched = true,
      requests = {},
      validationResult = {},
      {
        validateContentType,
        validationPropertiesToIgnore
      } = options,
      validateHeadersDefault = false,
      validateHeadersOption = validateContentType ? true : validateHeadersDefault;

    items.forEach((requestItem) => {
      const requestBody = requestItem.request.body.raw;
      let endpoints = [],
        operationFromWSDL = null;


      if (requestBody) {
        const parsedXmlMessage = xmlParser.parseToObject(requestBody),
          processedInfo = this.getItemRequestProcessedInfo(requestItem.request, parsedXmlMessage);
        operationFromWSDL = this.getOperationFromWSDLObjectByUrlPathNameProtocol(
          processedInfo,
          wsdlObject
        );
        processedInfoItems.push(processedInfo);
      }

      if (operationFromWSDL) {
        const { protocol, method, name } = operationFromWSDL,
          headerMismatches = this.validateHeaders(
            requestItem.request.header,
            requestItem.id,
            validateHeadersOption,
            false,
            options
          ),
          requestBodyMismatches = this.validateBody(
            requestBody,
            wsdlObject,
            operationFromWSDL,
            false,
            options,
            xmlParser
          ),

          soapMethodMismatches = this.validateSoapMethod(protocol, requestItem.request.method, operationFromWSDL,
            validationPropertiesToIgnore),
          endpointMismatches = [
            ...headerMismatches,
            ...requestBodyMismatches,
            ...soapMethodMismatches
          ],
          { responses, responsesMatched } = this.getResponsesValidation(requestItem.response, wsdlObject,
            operationFromWSDL, validateHeadersOption, options, xmlParser);

        endpoints = [
          this.getEndpointResult(endpointMismatches, `${method} ${protocol} ${name}`, responses)
        ];
        if (endpointMismatches.length > 0 || !responsesMatched) {
          endpointMatched = false;
        }
      }

      requests[requestItem.id] = {
        requestId: requestItem.id,
        endpoints
      };
    });

    validationResult = {
      matched: endpointMatched,
      requests,
      missingEndpoints: this.getMissingCollectionEndpoints(
        wsdlObject.operationsArray,
        processedInfoItems
      )
    };
    return validationResult;
  }

  /**
   * Generates endpoint object
   * @param {Array} mismatches List of endpoint mismatches found
   * @param {string} endpoint ${endpointMethod} ${endpointProtocol} ${endpointName} string format
   * @param {Object} responses Object with responsesValidation of endpoint
   * @returns {Object} An endpoint object generated from provided data
   */
  getEndpointResult(mismatches, endpoint, responses) {
    let matched,
      responsesHasMismatches = Object.keys(responses).find((responseID) => {
        return responses[responseID].matched === false;
      });
    matched = !(responsesHasMismatches || mismatches.length > 0);
    return {
      matched,
      endpointMatchScore: 1,
      endpoint,
      mismatches,
      responses
    };
  }

  /**
   * Validate and return result from provided responses in a request
   * @param {Array} responseItem List of responses in request
   * @param {Object} wsdlObject The wsdlObject generated from wsdl document
   * @param {Object} operationFromWSDL The wsdlObject operation's
   * @param {boolean} validateHeadersOption if validateContentType option value, False by default
   * @param {object} options options for validation process
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {Object} {responses, responsesMatched} responses contains the list of validated responses
   *                    responsesMatched is false if any response failed
   */
  getResponsesValidation(responseItem, wsdlObject, operationFromWSDL, validateHeadersOption,
    options, xmlParser) {
    let responses = {},
      responsesMatched = true;
    responseItem.forEach((response) => {
      const header = response.header,
        id = response.id,
        headerMismatches = this.validateHeaders(header, id, validateHeadersOption, true, options),
        bodyMismatches = this.validateBody(response.body, wsdlObject, operationFromWSDL, true,
          options, xmlParser),
        mismatches = [...headerMismatches, ...bodyMismatches],
        matched = !mismatches.length > 0;
      if (!matched) {
        responsesMatched = false;
      }

      responses[id] = {
        id,
        matched,
        mismatches
      };
    });
    return {
      responses,
      responsesMatched
    };
  }

  /**
   * Validate that the request uses POST method due that is the used for SOAP Protocol
   * @param {Array} protocol the WSDL operation protocol
   * @param {Object} method The Request Http Method
   * @param {Object} operationFromWSDL The wsdlObject operation's
   * @param {Object} validationPropertiesToIgnore option for ignoring properties in validation
   * @returns {Array} mismatches array
   */
  validateSoapMethod(protocol, method, operationFromWSDL, validationPropertiesToIgnore) {
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

  getBodyMismatchObject(operationFromWSDL, error, isResponse, options, reason = '') {
    const {
        detailedBlobValidation
      } = options,
      mismatchReason = reason !== '' ? reason : (
        detailedBlobValidation === true ?
          error.message :
          INVALID_BODY_DEFAULT_MESSAGE
      );
    let mismatch = {
      property: isResponse ? RESPONSE_BODY_PROPERTY : BODY_PROPERTY,
      transactionJsonPath: isResponse ? '$.response.body' : '$.request.body',
      schemaJsonPath: operationFromWSDL.xpathInfo.xpath,
      reasonCode: this.getMismatchReasonCode(error, detailedBlobValidation, isResponse),
      reason: mismatchReason
    };
    return mismatch;
  }

  getMismatchWithSuggestedFix(mismatch, currentBody, bodyFromSchema, detailedBlobValidation) {
    let newMismatch = JSON.parse(JSON.stringify(mismatch)),
      key,
      actualValue,
      suggestedValue;
    const {
      reasonCode,
      reason
    } = newMismatch;

    if (!detailedBlobValidation) {
      key = 'body';
      actualValue = currentBody;
      suggestedValue = bodyFromSchema;
    }
    else {
      const suggestedKey = (reasonCode === MISSING_IN_REQUEST_REASON_CODE) ?
        this.getMissingChildKeyFromReason(reason) :
        this.getKeyFromReason(reason);
      key = this.getKeyFromReason(reason);
      actualValue = this.getElementLineFromBody(currentBody, key);
      suggestedValue = this.getElementLineFromBody(
        bodyFromSchema,
        suggestedKey
      );
    }
    newMismatch.suggestedFix = {
      key,
      actualValue,
      suggestedValue
    };
    return newMismatch;
  }

  getKeyFromReason(mismatchReason) {
    const element = new RegExp(/Element '([^']+)':/),
      quotedTextInElement = mismatchReason.match(element)[1];
    return quotedTextInElement;
  }

  getMissingChildKeyFromReason(mismatchReason) {
    const element = new RegExp(/Expected is \( ([A-Za-z]+) \)/),
      quotedTextInElement = mismatchReason.match(element)[1];
    return quotedTextInElement;
  }

  getElementLineFromBody(body, elementKey) {
    const tagPattern = new RegExp(`<${elementKey}>[\\s\\S]*?<\/${elementKey}>|<${elementKey}[\\s\\S]*?\/>`),
      matched = body.match(tagPattern);
    return matched ? matched[0] : '';
  }

  getBodyFromSchema(wsdlObject, operationFromWsdl, isResponse) {
    const messageHelper = new SOAPMessageHelper(),
      message = messageHelper.convertInputToMessage(
        isResponse ? operationFromWsdl.output : operationFromWsdl.input,
        wsdlObject.securityPolicyArray,
        operationFromWsdl.protocol
      );
    return message;
  }

  getMismatchReasonCode(error, detailedBlobValidation, isResponse) {
    const MISSING_SCHEMA_MESSAGE_PART = 'This element is not expected',
      MISSING_REQUEST_MESSAGE_PART = 'Missing child element(s)',
      isTypeInvalidError = error.code === 1824,
      isMissingSchemaError = error.code === 1871 && error.message.includes(MISSING_SCHEMA_MESSAGE_PART),
      isMissingRequestError = error.code === 1871 && error.message.includes(MISSING_REQUEST_MESSAGE_PART),
      isInvalidBodyError = error.code === 1841;
    let reasonCode = INVALID_BODY_REASON_CODE;
    if (!detailedBlobValidation) {
      reasonCode = isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
    }
    else if (isTypeInvalidError) {
      reasonCode = INVALID_TYPE_REASON_CODE;
    }
    else if (isMissingSchemaError) {
      reasonCode = MISSING_IN_SCHEMA_REASON_CODE;
    }
    else if (isMissingRequestError) {
      reasonCode = MISSING_IN_REQUEST_REASON_CODE;
    }
    else if (isInvalidBodyError) {
      reasonCode = isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
    }
    return reasonCode;
  }

  /**
   * Validate body string and return mismatches
   * @param {String} body Message in body
   * @param {Object} wsdlObject Object generated from wsdl document
   * @param {Object} operationFromWSDL wsdlObject operation's
   * @param {Boolean} isResponse True if provided message is in a response, False if is in a request
   * @param {object} options options validation process
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {Array} List of mismatches found
   */
  validateBody(body, wsdlObject, operationFromWSDL, isResponse, options, xmlParser) {
    let mismatches = [],
      filteredErrors,
      errors,
      operationName,
      rawXmlMessage;
    const {
        validationPropertiesToIgnore,
        suggestAvailableFixes,
        detailedBlobValidation
      } = options,
      mismatchProperty = isResponse ? RESPONSE_BODY_PROPERTY : BODY_PROPERTY;

    if (validationPropertiesToIgnore && validationPropertiesToIgnore.includes(mismatchProperty)) {
      return mismatches;
    }

    if (body) {
      const parsedXml = wsdlObject.xmlParsed,
        { cleanSchema, isSchemaXSDDefault } = getCleanSchema(parsedXml, wsdlObject, wsdlObject.version, xmlParser);
      operationName = isResponse ? operationFromWSDL.output.name : operationFromWSDL.input.name;
      if (!isSchemaXSDDefault) {
        rawXmlMessage = unwrapAndCleanBody(body, operationName);
      }
      else {
        rawXmlMessage = getMessagePayload(body, operationName);
      }
      errors = validateMessageWithSchema(rawXmlMessage, cleanSchema);
      if (errors.length > 0) {
        filteredErrors = this.filterSchemaValidationErrors(errors, options);
        mismatches = filteredErrors.map((error) => {
          let mismatch = this.getBodyMismatchObject(operationFromWSDL, error, isResponse, options),
            bodyFromSchema;
          if (suggestAvailableFixes) {
            bodyFromSchema = this.getBodyFromSchema(wsdlObject, operationFromWSDL, isResponse);
            mismatch = this.getMismatchWithSuggestedFix(mismatch, body, bodyFromSchema, detailedBlobValidation);
          }
          return mismatch;
        });
      }
    }
    else {
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
      showMissingSchemaErrors
    } = options;
    if (ignoreUnresolvedVariables) {
      filteredErrors = errors.filter((error) => {
        return error.code === 1824 && !isPmVariable(error.str1);
      });
    }

    if (showMissingSchemaErrors !== undefined && showMissingSchemaErrors === false) {
      filteredErrors = filteredErrors.filter((error) => {
        const isMissingSchemaError = (
          error.code === 1871 &&
          error.message.includes(MISSING_SCHEMA_ERROR_PART)
        );
        return !isMissingSchemaError;
      });
    }
    return filteredErrors;
  }

  /**
   *
   * @description Finds the operation from wsdl according
   * to the specified request info by url name protocol method
   *
   * @param {*} itemRequestProcessedInfo itemRequestProcessedInfo
   * @param {*} wsdlObject WSDLObject from wsdl file
   * @returns {object} validation results
   */
  getOperationFromWSDLObjectByUrlPathNameProtocol(
    itemRequestProcessedInfo,
    wsdlObject
  ) {
    return wsdlObject.operationsArray.find(this.filterOperationsQuery(itemRequestProcessedInfo));
  }

  /**
   *
   * @description  Gets the url raw form
   *
   * @param {object} requestUrl Request url postman object
   * @returns {string} raw url
   */
  getUrlPath(requestUrl) {
    if (typeof requestUrl === 'object') {
      if (requestUrl.variable) {
        requestUrl.variable.forEach((pathVar) => {
          if (pathVar.value === null ||
            (typeof pathVar.value === 'string' && pathVar.value.trim.length === 0)
          ) {
            pathVar.value = ':' + pathVar.key;
          }
        });
      }
      return requestUrl.path ? requestUrl.path.join('/') : '';
    }
    return requestUrl;
  }

  /**
   *
   * @description  Validates the object according to json Schema validation
   * throws error
   * @param {object} transactions Request lists
   * @returns {null} nothing
   */
  validateStructure(transactions) {
    try {
      let ajv = new Ajv({ allErrors: true, strict: false }),
        validate = ajv.compile(transactionSchema),
        res = validate(transactions);

      if (!res) {
        throw new Error(
          'Invalid syntax provided for requestList',
          validate.errors
        );
      }
    }
    catch (e) {
      throw new Error('Invalid syntax provided for requestList', e);
    }
  }

  /**
   *
   * @description  Validates the required fields for items requests
   * throws error
   * @param {object} items Request lists
   * @returns {null} nothing
   */
  validateRequiredFields(items) {
    const invalidItem = items.find((item) => {
      return !item.id || Object.keys(item.request).length === 0;
    });
    if (invalidItem) {
      throw Error('Required field is null, empty or undefined');
    }
  }

  /**
   *
   * @description  Gets information from the request
   * like raw url, name, protocol, method
   * throws error
   * @param {object} itemRequest Request
   * @param {object} parsedXmlMessage parsed xml message
   * @returns {object} {url, name, protocol, method}
   */
  getItemRequestProcessedInfo(itemRequest, parsedXmlMessage) {
    let rawURL = this.getUrlPath(itemRequest.url),
      isSoap = true,
      protocol = '',
      envelope = '',
      body = '',
      methodName = '',
      namespaceSoap = getNamespaceByURL(
        parsedXmlMessage,
        SOAP_ENVELOPE_NS_URL,
        MESSAGE_TAG_ENVELOPE
      );
    if (!namespaceSoap) {
      isSoap = false;
      namespaceSoap = getNamespaceByURL(
        parsedXmlMessage,
        SOAP_12_ENVELOPE_NS_URL,
        MESSAGE_TAG_ENVELOPE
      );
    }
    protocol = isSoap ? SOAP_PROTOCOL : SOAP12_PROTOCOL;
    envelope = parsedXmlMessage[namespaceSoap.prefixFilter + MESSAGE_TAG_ENVELOPE];
    body = envelope[namespaceSoap.prefixFilter + MESSAGE_TAG_BODY];
    methodName = Object.keys(body)[0];

    return {
      url: rawURL,
      name: methodName,
      protocol: protocol,
      method: itemRequest.method
    };
  }

  /**
   *
   * @description validates request or response headers
   * @param {object} requestHeaders headers list
   * @param {string} entityId request or response id
   * @param {boolean} validateHeadersOption if validateContentType option value, False by default
   * @param {boolean} isResponse true if the entity is response false if not
   * @param {object} options options validation process
   * @returns {Array} missmatchs array
   */
  validateHeaders(requestHeaders, entityId, validateHeadersOption, isResponse, options) {
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
    if (!contentTypeHeader.value.includes('text/xml')) {
      return {
        property: HEADER_PROPERTY,
        transactionJsonPath: isResponse ? `$.responses[${entityId}].header[${index}].value` :
          `$.request.header[${index}].value`,
        schemaJsonPath: 'schemaPathPrefix',
        reasonCode: INVALID_TYPE_REASON_CODE,
        reason: `The header "Content-Type" needs to be "text/xml" but we found "${contentTypeHeader.value}" instead`
      };
    }
  }

  /**
   *
   * @description  parses the message
   * @param {string} xmlDocumentContent xml message content
   * @returns {object} parsed document
   */
  parseBodyMessage(xmlDocumentContent) {
    return parseFromXmlToObject(xmlDocumentContent);
  }

  /**
   *
   * @description  gets the endpoints missing in collection
   * @param {object} wsdlOperationsArray operations in wsdl
   * @param {object} processedInfoItems info request
   * @returns {Array} notFoundCollectionEndpoints
   */
  getMissingCollectionEndpoints(wsdlOperationsArray, processedInfoItems) {
    let notFoundCollectionEndpoints = [];
    wsdlOperationsArray.forEach((operation) => {
      let foundItem = processedInfoItems.find(this.filterOperationsQuery(operation));

      if (!foundItem) {
        notFoundCollectionEndpoints.push({
          property: ENDPOINT_PROPERTY,
          transactionJsonPath: null,
          schemaJsonPath: `${operation.protocol} ${operation.name}`,
          reasonCode: MISSING_ENDPOINT_REASON_CODE,
          reason: `The endpoint "${operation.method} ${operation.protocol} ${operation.name}" is missing in collection`,
          endpoint: `${operation.method} ${operation.protocol} ${operation.name}`
        });
      }
    });
    return notFoundCollectionEndpoints;
  }

  /**
   *
   * @description  function to filter operations by url name protocol method
   * @param {object} operation operation
   * @returns {Function} filter function
   */
  filterOperationsQuery(operation) {
    return (itemRequestProcessedInfo) => {
      const isWsdlObjectOperation = Object.keys(operation).includes('style');
      let isIncludedOrEmpty;
      if (isWsdlObjectOperation) {
        isIncludedOrEmpty = itemRequestProcessedInfo.url === '' ||
          operation.url.includes(itemRequestProcessedInfo.url);
      }
      else {
        isIncludedOrEmpty = operation.url === '' ||
          itemRequestProcessedInfo.url.includes(operation.url);
      }

      return (
        isIncludedOrEmpty &&
        operation.name === itemRequestProcessedInfo.name &&
        operation.protocol === itemRequestProcessedInfo.protocol
      );
    };
  }
}

module.exports = {
  TransactionValidator
};
