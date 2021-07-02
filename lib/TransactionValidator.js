const { getBodyMismatchObject, getMismatchWithSuggestedFix } = require('./utils/mismatchUtils');
const { SOAPMessageHelper } = require('./utils/SOAPMessageHelper');

const Ajv = require('ajv'),
  {
    getCleanSchema,
    validateMessageWithSchema,
    unwrapAndCleanBody,
    getMessagePayload,
    getMessageNamespace
  } = require('./utils/messageWithSchemaValidation'),
  transactionSchema = require('./constants/transactionSchema'),
  { parseFromXmlToObject, getNamespaceByURL } = require('./WsdlParserCommon'),
  HEADER_PROPERTY = 'HEADER',
  ENDPOINT_PROPERTY = 'ENDPOINT',
  MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  MISSING_ENDPOINT_REASON_CODE = 'MISSING_ENDPOINT',
  CONTENT_TYPE_HEADER_KEY = 'Content-Type',
  INVALID_BODY_REASON_CODE = 'INVALID_BODY',
  INVALID_RESPONSE_BODY_REASON_CODE = 'INVALID_RESPONSE_BODY',
  INVALID_SOAP_METHOD_REASON_CODE = 'INVALID_SOAP_METHOD',
  RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
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
    isPmVariable,
    getLastSegmentURL
  } = require('./utils/textUtils'),
  {
    getArrayFrom
  } = require('./utils/objectUtils'),
  {
    WsdlToPostmanCollectionMapper
  } = require('./WsdlToPostmanCollectionMapper');

class TransactionValidator {
  /**
   *
   * @description Validates item transactions (requests)
   *
   * @param {*} items RequestList
   * @param {*} wsdlObject WSDLObject from wsdl file
   * @param {XMLParser} xmlParser object to parse xml string to object
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
   * @param {XMLParser} xmlParser object to parse xml string to object
   * @param {object} options contains options to modify validation
   * @returns {object} validation results
   */
  validateItems(items, wsdlObject, xmlParser, options) {
    let processedInfoItems = [],
      endpointMatched = true,
      requests = {},
      validationResult = {},
      {
        validateHeader,
        validationPropertiesToIgnore
      } = options,
      validateHeadersDefault = false,
      validateHeadersOption = validateHeader ? true : validateHeadersDefault;

    items.forEach((requestItem) => {
      let endpoints = [],
        requestBody,
        operationFromWSDL = null;
      if (requestItem.request.body && requestItem.request.body.mode === 'raw') {
        try {
          requestBody = requestItem.request.body.raw;
          const parsedXmlMessage = xmlParser.parseToObject(requestBody),
            processedInfo = this.getItemRequestProcessedInfo(requestItem.request, parsedXmlMessage);
          operationFromWSDL = this.getOperationFromWSDLObjectByUrlPathNameProtocol(
            processedInfo,
            wsdlObject
          );
          processedInfoItems.push(processedInfo);
        }
        catch (error) {
          operationFromWSDL = undefined;
        }
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
            xmlParser,
            operationFromWSDL.input[0]
          ),

          soapMethodMismatches = this.validateSoapMethod(protocol, requestItem.request.method, operationFromWSDL,
            validationPropertiesToIgnore),
          endpointMismatches = [
            ...headerMismatches,
            ...requestBodyMismatches,
            ...soapMethodMismatches
          ],
          { responses, responsesMatched } = this.getResponsesValidation(requestItem.response, wsdlObject,
            operationFromWSDL, validateHeadersOption, options, xmlParser, validationPropertiesToIgnore);

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
        processedInfoItems,
        options,
        wsdlObject,
        xmlParser
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
   * @param {boolean} validateHeadersOption if validate headers option value, False by default
   * @param {object} options options for validation process
   * @param {object} xmlParser the parse class to parse xml to object or vice versa
   * @param {Array} validationPropertiesToIgnore properties to ignore during validation
   * @returns {Object} {responses, responsesMatched} responses contains the list of validated responses
   *                    responsesMatched is false if any response failed
   */
  getResponsesValidation(responseItem, wsdlObject, operationFromWSDL, validateHeadersOption,
    options, xmlParser, validationPropertiesToIgnore) {
    let responses = {},
      responsesMatched = true;
    responseItem.forEach((response) => {
      const header = response.header,
        id = response.id,
        headerMismatches = this.validateHeaders(header, id, validateHeadersOption, true, options);
      let bodyMismatches = [],
        mismatches,
        matched;
      if (!response.body || response.body === '') {
        if (!validationPropertiesToIgnore || !validationPropertiesToIgnore.includes(RESPONSE_BODY_PROPERTY)) {
          bodyMismatches = [
            {
              property: RESPONSE_BODY_PROPERTY,
              transactionJsonPath: '$.response.body',
              schemaJsonPath: operationFromWSDL.xpathInfo.xpath,
              reasonCode: INVALID_RESPONSE_BODY_REASON_CODE,
              reason: RESPONSE_BODY_NOT_PROVIDED_MSG
            }
          ];
        }
      }
      else {
        let parsedXmlMessage = xmlParser.parseToObject(response.body),
          info = this.getItemRequestProcessedInfo(response, parsedXmlMessage),
          operationOutput = operationFromWSDL.output.find((currentOutput) => {
            return currentOutput.name === info.name;
          });

        if (!operationOutput) {
          operationOutput = operationFromWSDL.fault.find((currentFault) => {
            return currentFault.name === info.name;
          });

        }

        bodyMismatches = this.validateBody(response.body, wsdlObject, operationFromWSDL, true,
          options, xmlParser, operationOutput);
      }
      mismatches = [...headerMismatches, ...bodyMismatches];
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
  validateBody(body, wsdlObject, operationFromWSDL, isResponse, options, xmlParser,
    elementFromWSDLMessage) {
    let mismatches = [],
      filteredErrors,
      errors,
      namespaceURL,
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
      const parsedXml = wsdlObject.xmlParsed;
      namespaceURL = getMessageNamespace(body, elementFromWSDLMessage.name);
      let { cleanSchema, isSchemaXSDDefault } = getCleanSchema(parsedXml, wsdlObject, wsdlObject.version,
        xmlParser, namespaceURL);
      if (!isSchemaXSDDefault) {
        rawXmlMessage = unwrapAndCleanBody(body, elementFromWSDLMessage.name);
      }
      else {
        rawXmlMessage = getMessagePayload(body, elementFromWSDLMessage.name);
      }
      errors = validateMessageWithSchema(rawXmlMessage, cleanSchema);
      if (errors.length > 0) {
        filteredErrors = this.filterSchemaValidationErrors(errors, options);
        filteredErrors = this.handleDetailedBlobValidation(filteredErrors, detailedBlobValidation);
        mismatches = filteredErrors.map((error) => {
          let mismatch = getBodyMismatchObject(operationFromWSDL, error, isResponse, options);
          if (suggestAvailableFixes) {
            const currentBody = detailedBlobValidation ? rawXmlMessage : body,
              expectedBody = this.getBodyFromSchema(
                wsdlObject,
                operationFromWSDL,
                elementFromWSDLMessage,
                xmlParser,
                detailedBlobValidation
              );
            mismatch = getMismatchWithSuggestedFix(
              mismatch,
              currentBody,
              expectedBody,
              detailedBlobValidation,
              cleanSchema
            );
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
      showMissingInSchemaErrors
    } = options;
    if (ignoreUnresolvedVariables) {
      filteredErrors = errors.filter((error) => {
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
   *
   * @description Finds the operation from wsdl according
   * to the specified request info by url name protocol method
   *
   * @param {*} itemRequestProcessedInfo itemRequestProcessedInfo
   * @param {*} wsdlObject WSDLObject from wsdl file
   * @returns {object} validation results
   */
  getOperationFromWSDLObjectByUrlPathNameProtocol(itemRequestProcessedInfo, wsdlObject) {
    let found = wsdlObject.operationsArray.find(this.filterOperationsQuery(itemRequestProcessedInfo));
    if (!found) {
      found = wsdlObject.operationsArray.find(this.filterOperationsQueryElementName(itemRequestProcessedInfo));
    }
    return found;
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
      soapActionName = '',
      soapActionHeader,
      requestHeaderArray = [],
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
    if (itemRequest.header) {
      if (!Array.isArray(itemRequest.header)) {
        requestHeaderArray = [itemRequest.header];
      }
      else {
        requestHeaderArray = itemRequest.header;
      }
      soapActionHeader = requestHeaderArray.find((header) => {
        return header.key === 'SOAPAction';
      });
      if (soapActionHeader) {
        soapActionName = getLastSegmentURL(soapActionHeader.value);
      }
    }

    return {
      url: rawURL,
      name: methodName,
      protocol: protocol,
      method: itemRequest.method,
      soapActionSegment: soapActionName
    };
  }

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
   * @param {object} options options validation process
   * @param {*} wsdlObject WSDLObject from wsdl file
   * @param {XMLParser} xmlParser object to parse xml string to object
   * @returns {Array} notFoundCollectionEndpoints
   */
  getMissingCollectionEndpoints(wsdlOperationsArray, processedInfoItems, options,
    wsdlObject, xmlParser) {
    let notFoundCollectionEndpoints = [];
    wsdlOperationsArray.forEach((operation) => {
      let foundItem = processedInfoItems.find(this.filterOperationsQuery(operation));
      if (!foundItem) {
        foundItem = processedInfoItems.find(this.filterOperationsQueryElementName(operation));
      }

      if (!foundItem && (operation.protocol === SOAP_PROTOCOL ||
        operation.protocol === SOAP12_PROTOCOL)) {
        let missingEndpoint = {
          property: ENDPOINT_PROPERTY,
          transactionJsonPath: null,
          schemaJsonPath: `${operation.protocol} ${operation.name}`,
          reasonCode: MISSING_ENDPOINT_REASON_CODE,
          reason: `The endpoint "${operation.method} ${operation.protocol} ${operation.name}" is missing in collection`,
          endpoint: `${operation.method} ${operation.protocol} ${operation.name}`
        };
        if (options && options.suggestAvailableFixes) {
          let mapper = new WsdlToPostmanCollectionMapper(wsdlObject),
            suggestedValue = mapper.createSingleItemAndVariablesFromOperation(wsdlObject,
              getArrayFrom(operation), xmlParser);
          missingEndpoint.suggestedFix = {
            key: 'get',
            actualValue: null,
            suggestedValue: suggestedValue
          };
        }
        notFoundCollectionEndpoints.push(missingEndpoint);
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
        (isIncludedOrEmpty &&
          operation.name === itemRequestProcessedInfo.name &&
          operation.protocol === itemRequestProcessedInfo.protocol) ||
        (operation.soapActionSegment !== '' &&
          operation.soapActionSegment === itemRequestProcessedInfo.soapActionSegment)
      );
    };
  }

  /**
 *
 * @description  function to filter operations by url name protocol method
 * @param {object} operation operation
 * @returns {Function} filter function
 */
  filterOperationsQueryElementName(operation) {
    return (itemRequestProcessedInfo) => {
      const isWsdlObjectOperation = Object.keys(operation).includes('style');
      let sameElementName = '';
      if (isWsdlObjectOperation) {
        sameElementName = operation.input[0].name === itemRequestProcessedInfo.name;
      }
      else {
        sameElementName = itemRequestProcessedInfo.input[0].name === operation.name;
      }
      return sameElementName && operation.protocol === itemRequestProcessedInfo.protocol;
    };
  }
}

module.exports = {
  TransactionValidator
};
