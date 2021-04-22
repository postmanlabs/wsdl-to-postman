const {
    getCleanSchema,
    validateMessageWithSchema,
    unwrapAndCleanBody
  } = require('./utils/messageWithSchemaValidation'),
  Ajv = require('ajv'),
  transactionSchema = require('./constants/transactionSchema'),
  sdk = require('postman-collection'),
  { parseFromXmlToObject, getNamespaceByURL } = require('./WsdlParserCommon'),
  HEADER_PROPERTY = 'HEADER',
  ENDPOINT_PROPERTY = 'ENDPOINT',
  MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  MISSING_ENDPOINT_REASON_CODE = 'MISSING_ENDPOINT',
  CONTENT_TYPE_HEADER_KEY = 'Content-Type',
  INVALID_BODY_REASON_CODE = 'INVALID_BODY',
  INVALID_RESPONSE_BODY_REASON_CODE = 'INVALID_RESPONSE_BODY',
  RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
  BODY_PROPERTY = 'BODY',
  {
    SOAP_ENVELOPE_NS_URL,
    SOAP_12_ENVELOPE_NS_URL,
    MESSAGE_TAG_ENVELOPE,
    MESSAGE_TAG_BODY,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL
  } = require('./constants/processConstants');

class TransactionValidator {
  /**
   *
   * @description Validates item transactions (requests)
   *
   * @param {*} items RequestList
   * @param {*} wsdlObject WSDLObject from wsdl file
   * @returns {object} validation results
   */
  validateTransaction(items, wsdlObject) {
    let result = {
      matched: true,
      requests: {}
    };

    if (!wsdlObject) {
      throw new Error('wsdlObject not provided');
    }
    this.validateStructure(items);
    this.validateRequiredFields(items);
    result = this.validateItems(items, wsdlObject);
    return result;
  }

  /**
   *
   * @description Validates item transactions (requests item)
   *
   * @param {*} items RequestList
   * @param {*} wsdlObject WSDLObject from wsdl file
   * @param {*} result result for shallow copy
   * @returns {object} validation results
   */
  validateItems(items, wsdlObject) {
    let processedInfoItems = [],
      endpointMatched = true,
      requests = {},
      validationResult = {};

    items.forEach((requestItem) => {
      const requestBody = requestItem.request.body.raw;
      let endpoints = [],
        operationFromWSDL = null;


      if (requestBody) {
        const parsedXmlMessage = this.parseBodyMessage(requestBody),
          processedInfo = this.getItemRequestProcessedInfo(requestItem.request, parsedXmlMessage);
        operationFromWSDL = this.getOperationFromWSDLObjectByUrlNameProtocolMethod(
          processedInfo,
          wsdlObject
        );
        processedInfoItems.push(processedInfo);
      }


      if (operationFromWSDL) {
        const { protocol, method, name } = operationFromWSDL,
          headerMismatches = this.validateHeaders(requestItem.request.header, requestItem.id, false),
          requestBodyMismatches = this.validateBody(
            unwrapAndCleanBody(requestBody, protocol),
            wsdlObject,
            false
          ),
          endpointMismatches = [...headerMismatches, ...requestBodyMismatches],
          { responses, responsesMatched } = this.getResponsesValidation(requestItem.response, protocol, wsdlObject);

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
   * @param {string} protocol The request protocol
   * @param {Object} wsdlObject The wsdlObject generated from wsdl document
   * @returns {Object} {responses, responsesMatched} responses contains the list of validated responses
   *                    responsesMatched is false if any response failed
   */
  getResponsesValidation(responseItem, protocol, wsdlObject) {
    let responses = {},
      responsesMatched = true;
    responseItem.forEach((response) => {
      const body = unwrapAndCleanBody(response.body, protocol),
        header = response.header,
        id = response.id,
        headerMismatches = this.validateHeaders(header, id, true),
        bodyMismatches = this.validateBody(body, wsdlObject, true),
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
   * Validate body string and return mismatches
   * @param {String} rawXmlMessage Message in body
   * @param {Object} wsdlObject Object generated from wsdl document
   * @param {Boolean} isResponse True if provided message is in a response, False if is in a request
   * @returns {Array} List of mismatches found
   */
  validateBody(rawXmlMessage, wsdlObject, isResponse) {
    let mismatches = [];
    if (rawXmlMessage) {
      const parsedXml = wsdlObject.xmlParsed,
        cleanSchema = getCleanSchema(parsedXml, wsdlObject.schemaNamespace, wsdlObject.version),
        errors = validateMessageWithSchema(rawXmlMessage, cleanSchema);
      if (errors.length > 0) {
        mismatches = errors.map((error) => {
          return {
            property: isResponse ? RESPONSE_BODY_PROPERTY : BODY_PROPERTY,
            transactionJsonPath: isResponse ? '$.response.body' : '$.request.body',
            schemaJsonPath: 'schemaPathPrefix',
            reasonCode: isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE,
            reason: error.message
          };
        });
      }
    }
    else {
      mismatches = [
        {
          property: RESPONSE_BODY_PROPERTY,
          transactionJsonPath: '$.response.body',
          schemaJsonPath: 'schemaPathPrefix',
          reasonCode: INVALID_RESPONSE_BODY_REASON_CODE,
          reason: 'Response body not provided'
        }
      ];
    }
    return mismatches;
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
  getOperationFromWSDLObjectByUrlNameProtocolMethod(
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
  getRawURL(requestUrl) {
    if (typeof requestUrl === 'object') {
      requestUrl.variable.forEach((pathVar) => {
        if (pathVar.value === null ||
          (typeof pathVar.value === 'string' && pathVar.value.trim.length === 0)
        ) {
          pathVar.value = ':' + pathVar.key;
        }
      });
      return new sdk.Url(requestUrl).toString();
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
      let ajv = new Ajv({ allErrors: true }),
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
    let rawURL = this.getRawURL(itemRequest.url),
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
    // agregar el metodo
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
   * @param {boolean} isResponse true if the entity is response false if not
   * @returns {Array} missmatchs array
   */
  validateHeaders(requestHeaders, entityId, isResponse) {
    let missmatches = [],
      contentTypeMissmatch = this.validateContentTypeHeader(requestHeaders, entityId, isResponse);
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
   * @returns {object} missmatch object if the case
   */
  validateContentTypeHeader(headers, entityId, isResponse) {
    let index = headers.findIndex((header) => { return header.key === CONTENT_TYPE_HEADER_KEY; }),
      contentTypeHeader = headers[index];
    if (!contentTypeHeader) {
      return {
        property: HEADER_PROPERTY,
        transactionJsonPath: isResponse ? `$.responses[${entityId}].header` : '$.request.header',
        schemaJsonPath: 'schemaPathPrefix',
        reasonCode: MISSING_IN_REQUEST_REASON_CODE,
        reason: 'The header "Content-Type" was not found in the transaction'
      };
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
      return (
        operation.url === itemRequestProcessedInfo.url &&
        operation.name === itemRequestProcessedInfo.name &&
        operation.protocol === itemRequestProcessedInfo.protocol &&
        itemRequestProcessedInfo.method === operation.method
      );
    };
  }

  /**
   *
   * @description  builds a missmatch
   * @param {object} { property,  schemaPath, transactionPath, reasonCode, message }
   * @returns {object} missmatch
   */
  buildMissmatch({
    property,
    schemaPath,
    transactionPath,
    reasonCode,
    message
  }) {
    return {
      property: property, // "One of QUERYPARAM /PATHVARIABLE / HEADER / BODY / RESPONSE_HEADER / RESPONSE_BODY",
      schemaPath: schemaPath, // "jsonPath of the schema rule that was broken (nullable)",
      transactionPath: transactionPath, // "jsonPath of the part of the item that broke the rule (nullable)",
      reasonCode: reasonCode, // "Enum of reasons for mismatch (e.g. could be wrong_type or missing_required_field)",
      message: message // "A human readable message that tries to explain the problem"
    };
  }
}

module.exports = {
  TransactionValidator
};
