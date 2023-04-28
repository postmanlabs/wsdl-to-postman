const sdk = require('postman-collection'),
  {
    QueryParamsValidator
  } = require('./transactionValidator/QueryParamsValidator'),
  {
    HeadersValidator
  } = require('./transactionValidator/HeadersValidator'),
  {
    MethodValidator
  } = require('./transactionValidator/MethodValidator'),
  {
    BodyValidator
  } = require('./transactionValidator/BodyValidator'),
  Ajv = require('ajv'),
  transactionSchema = require('./constants/transactionSchema'),
  { parseFromXmlToObject, getNamespaceByURL } = require('./WsdlParserCommon'),
  UserError = require('./UserError'),
  ENDPOINT_PROPERTY = 'ENDPOINT',
  MISSING_ENDPOINT_REASON_CODE = 'MISSING_ENDPOINT',
  INVALID_RESPONSE_BODY_REASON_CODE = 'INVALID_RESPONSE_BODY',
  RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
  RESPONSE_BODY_NOT_PROVIDED_MSG = 'Response body not provided',
  {
    SOAP_ENVELOPE_NS_URL,
    SOAP_12_ENVELOPE_NS_URL,
    MESSAGE_TAG_ENVELOPE,
    MESSAGE_TAG_BODY,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL,
    HTTP_PROTOCOL,
    EMPTY_ELEMENT_BY_DEFAULT
  } = require('./constants/processConstants'),
  {
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
      throw new UserError('wsdlObject not provided');
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
        parsedXmlMessage,
        processedInfo,
        operationFromWSDL = null;
      try {
        if (requestItem.request.body && requestItem.request.body.mode === 'raw') {
          requestBody = requestItem.request.body.raw;
          parsedXmlMessage = xmlParser.parseToObject(requestBody);
        }
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

      if (operationFromWSDL) {
        const { protocol, method, name } = operationFromWSDL,
          headerMismatches = this.validateHeaders(
            requestItem.request.header,
            requestItem.id,
            validateHeadersOption,
            false,
            options,
            operationFromWSDL
          ),
          requestBodyMismatches = this.validateBody(
            requestItem.request.body,
            wsdlObject,
            operationFromWSDL,
            false,
            options,
            xmlParser,
            operationFromWSDL.input[0]
          ),

          soapMethodMismatches = this.validateSoapMethod(protocol, requestItem.request.method, operationFromWSDL,
            validationPropertiesToIgnore),
          queryParamsMismatches = this.validateQueryParams({ itemRequestProcessedInfo: processedInfo,
            operationFromWSDL, options }),
          endpointMismatches = [
            ...headerMismatches,
            ...requestBodyMismatches,
            ...soapMethodMismatches,
            ...queryParamsMismatches
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
      isEmptyType = false,
      responsesMatched = true;
    responseItem.forEach((response) => {
      const header = response.header,
        id = response.id,
        headerMismatches = this.validateHeaders(header, id, validateHeadersOption, true, options,
          operationFromWSDL);
      let bodyMismatches = [],
        mismatches,
        matched;

      if (!response.body || response.body === '') {
        if (operationFromWSDL.output.length === 1 && operationFromWSDL.output[0].type === EMPTY_ELEMENT_BY_DEFAULT) {
          isEmptyType = true;
        }
        if ((!validationPropertiesToIgnore || !validationPropertiesToIgnore.includes(RESPONSE_BODY_PROPERTY)) &&
          !isEmptyType) {
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
          info = this.getItemRequestProcessedInfo(response, parsedXmlMessage, operationFromWSDL),
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
    const validator = new MethodValidator();
    return validator.validate(protocol, method, operationFromWSDL, validationPropertiesToIgnore);
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
    const validator = new BodyValidator();
    return validator.validate(body, wsdlObject, operationFromWSDL, isResponse,
      options, xmlParser, elementFromWSDLMessage);
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
   * @description  Gets the url last path
   *
   * @param {object} requestUrl Request url postman object
   * @returns {string} the last segment in path
   */
  getLastURLPath(requestUrl) {
    if (typeof requestUrl === 'object') {
      if (requestUrl.path) {
        return requestUrl.path[requestUrl.path.length - 1];
      }
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
        throw new UserError(
          'Invalid syntax provided for requestList',
          validate.errors
        );
      }
    }
    catch (e) {
      throw new UserError('Invalid syntax provided for requestList', e);
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
      throw new UserError('Provided requestList is invalid.');
    }
  }

  /**
   *
   * @description  Gets information from the request
   * like raw url, name, protocol, method
   * throws error
   * @param {object} itemRequest Request
   * @param {object} parsedXmlMessage parsed xml message
   * @param {object} operationFromWSDL if the operation has been resolved takes information from there
   * @returns {object} {url, name, protocol, method}
   */
  getItemRequestProcessedInfo(itemRequest, parsedXmlMessage, operationFromWSDL) {
    let rawURL = this.getUrlPath(itemRequest.url),
      soapActionName = '',
      fullURL = (new sdk.Url(itemRequest.url)).toString(),
      soapActionHeader,
      requestHeaderArray = [],
      { methodName, protocol } = this.resolveMethodNameAndProtocol(itemRequest, parsedXmlMessage, operationFromWSDL);

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
      fullURL: fullURL,
      name: methodName,
      protocol: protocol,
      method: itemRequest.method,
      soapActionSegment: soapActionName
    };
  }

  /**
   *
   * @description  Gets information from the request
   *   methodName, protocol
   * throws error
   * @param {object} itemRequest Request
   * @param {object} parsedXmlMessage parsed xml message
   * @param {object} operationFromWSDL if the operation has been resolved takes information from there
   * @returns {object} {methodName, protocol}
   */
  resolveMethodNameAndProtocol(itemRequest, parsedXmlMessage, operationFromWSDL) {
    let isSoap = true,
      protocol = '',
      envelope = '',
      body = '',
      methodName = '',
      namespaceSoap;

    if (operationFromWSDL && operationFromWSDL.mimeContentOutput &&
       operationFromWSDL.mimeContentOutput.mimeType === 'xml') {
      methodName = Object.keys(parsedXmlMessage)[0];
      protocol = operationFromWSDL.protocol;
      return { methodName, protocol };
    }
    if (parsedXmlMessage) {
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
      return { methodName, protocol };
    }

    if (itemRequest.method && methodName === '') {
      methodName = this.getLastURLPath(itemRequest.url);
      protocol = HTTP_PROTOCOL;
      return { methodName, protocol };
    }
  }

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
  validateHeaders(requestHeaders, entityId, validateHeadersOption, isResponse, options, operationFromWSDL) {
    const validator = new HeadersValidator();
    return validator.validate(requestHeaders, entityId, validateHeadersOption, isResponse, options,
      operationFromWSDL);
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
          operation.method === itemRequestProcessedInfo.method &&
          operation.protocol === itemRequestProcessedInfo.protocol) ||
        (operation.soapActionSegment !== '' &&
          operation.soapActionSegment === itemRequestProcessedInfo.soapActionSegment)
      );
    };
  }

  /**
   *
   * @description  function to filter operations by element name
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

  /**
   *
   * @description validates query params
   * @param {object} itemRequestProcessedInfo  operationFromWSDL, options
   * @returns {Array} missmatches array
   */
  validateQueryParams({ itemRequestProcessedInfo, operationFromWSDL, options }) {
    const paramsValidator = new QueryParamsValidator();
    return paramsValidator.validate({ itemRequestProcessedInfo, operationFromWSDL, options });
  }
}

module.exports = {
  TransactionValidator
};
