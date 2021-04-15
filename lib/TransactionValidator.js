const Ajv = require('ajv'),
  transactionSchema = require('./constants/transactionSchema'),
  sdk = require('postman-collection'),
  { parseFromXmlToObject, getNamespaceByURL } = require('./WsdlParserCommon'),
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
    result = this.validateItems(items, wsdlObject, result);
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
  validateItems(items, wsdlObject, result) {
    let processedInfoItems = [],
      localResult = {
        ...result
      };

    items.forEach((requestItem) => {
      localResult.requests[requestItem.id] = {};
      localResult.requests[requestItem.id].requestId = requestItem.id;
      localResult.requests[requestItem.id].endpoints = [];
      let processedInfo = this.getItemRequestProcessedInfo(requestItem.request),
        operationFromWSDL = this.getOperationFromWSDLObjectByUrlNameProtocolMethod(
          processedInfo,
          wsdlObject
        );
      processedInfoItems.push(processedInfo);
      if (operationFromWSDL) {
        localResult.requests[requestItem.id].endpoints[0] = {
          matched: true,
          endpointMatchScore: 1,
          endpoint: operationFromWSDL.name, //  endpoint: `${operation.method} ${operation.protocol} ${operation.name}`
          mismatches: [],
          responses: {}
        };

        requestItem.response.forEach((responseInItem) => {
          let responseObject = {
            id: responseInItem.id,
            matched: true,
            mismatches: []
          };
          localResult.requests[requestItem.id].endpoints[0].responses[
            responseInItem.id
          ] = responseObject;
        });
      }
    });

    localResult.missingEndpoints = this.getMissingCollectionEndpoints(
      wsdlObject.operationsArray,
      processedInfoItems
    );
    return localResult;
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
    return wsdlObject.operationsArray.find((operation) => {
      return (
        operation.url === itemRequestProcessedInfo.url &&
        operation.name === itemRequestProcessedInfo.name &&
        operation.protocol === itemRequestProcessedInfo.protocol &&
        itemRequestProcessedInfo.method === operation.method
      );
    });
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
        if (
          pathVar.value === null ||
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
      let ajv = new Ajv({
          allErrors: true
        }),
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
   * @returns {object} {url, name, protocol, method}
   */
  getItemRequestProcessedInfo(itemRequest) {
    let parsed = this.parseBodyMessage(itemRequest.body.raw), // todo si no tiene body manejar escenario
      rawURL = this.getRawURL(itemRequest.url),
      isSoap = true,
      protocol = '',
      envelope = '',
      body = '',
      methodName = '',
      namespaceSoap = getNamespaceByURL(
        parsed,
        SOAP_ENVELOPE_NS_URL,
        MESSAGE_TAG_ENVELOPE
      );
    if (!namespaceSoap) {
      isSoap = false;
      namespaceSoap = getNamespaceByURL(
        parsed,
        SOAP_12_ENVELOPE_NS_URL,
        MESSAGE_TAG_ENVELOPE
      );
    }
    protocol = isSoap ? SOAP_PROTOCOL : SOAP12_PROTOCOL;
    envelope = parsed[namespaceSoap.prefixFilter + MESSAGE_TAG_ENVELOPE];
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
      let foundItem = processedInfoItems.find((itemRequestProcessedInfo) => {
        return (
          operation.url === itemRequestProcessedInfo.url &&
          operation.name === itemRequestProcessedInfo.name &&
          operation.protocol === itemRequestProcessedInfo.protocol &&
          itemRequestProcessedInfo.method === operation.method
        );
      });

      if (!foundItem) {
        notFoundCollectionEndpoints.push({
          property: 'ENDPOINT',
          transactionJsonPath: null,
          schemaJsonPath: `${operation.protocol} ${operation.name}`,
          reasonCode: 'MISSING_ENDPOINT',
          reason: `The endpoint "${operation.method} ${operation.protocol} ${operation.name}" is missing in collection`,
          endpoint: `${operation.method} ${operation.protocol} ${operation.name}`
        });
      }
    });
    return notFoundCollectionEndpoints;
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
