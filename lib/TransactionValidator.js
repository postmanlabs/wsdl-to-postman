const Ajv = require('ajv'),
  transactionSchema = require('./constants/transactionSchema'),
  sdk = require('postman-collection'),
  {
    parseFromXmlToObject,
    getPrincipalPrefix,
    getNamespaceByURL
  } = require('./WsdlParserCommon'),
  {
    SOAP_ENVELOPE_NS_URL,
    SOAP_12_ENVELOPE_NS_URL,
    MESSAGE_TAG_ENVELOPE,
    MESSAGE_TAG_BODY,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL
  } = require('./constants/processConstants');

class TransactionValidator {

  validateTransaction(items, wsdlObject) {
    let matched = true,
      result = {
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

  validateItems(items, wsdlObject, result) {
    let localResult = {
      ...result
    };
    items.forEach((requestItem) => {
      localResult.requests[requestItem.id] = {};
      localResult.requests[requestItem.id].requestId = requestItem.id;
      localResult.requests[requestItem.id].endpoints = [];
      let processedInfo = this.getItemRequestProcessedInfo(requestItem.request),
        operationFromWSDL = this.getOperationFromWSDLObjectByUrlNameProtocol(processedInfo, wsdlObject);
      // si operationFromWSDL es undefined o null entonces se debe de mandar como que el request esta de mas
      // buscar de las operacioens en wsdl las que no estan en los items de la colleccion y mandarlos como que faltan en la colleccion
      localResult.requests[requestItem.id].endpoints[0] = {
        matched: true,
        endpointMatchScore: 1,
        endpoint: operationFromWSDL.name, // i.e. "POST /organization/user"
        mismatches: [],
        responses: {}
      };

      requestItem.response.forEach((responseInItem) => {
        let responseObject = {
          id: responseInItem.id,
          matched: true,
          mismatches: []
        };
        localResult.requests[requestItem.id].endpoints[0].responses[responseInItem.id] = responseObject;
      });

    });
    return localResult;
  }

  getOperationFromWSDLObjectByUrlNameProtocol(itemRequestProcessedInfo, wsdlObject) {
    return wsdlObject.operationsArray.find((operation) => {
      return operation.url === itemRequestProcessedInfo.url && operation.name === itemRequestProcessedInfo.name &&
        operation.protocol === itemRequestProcessedInfo.protocol;
    });
  }

  getRawURL(requestUrl) {
    if (typeof requestUrl === 'object') {
      requestUrl.variable.forEach((pathVar) => {
        if (pathVar.value === null || (typeof pathVar.value === 'string' && pathVar.value.trim.length === 0)) {
          pathVar.value = ':' + pathVar.key;
        }
      });
      return (new sdk.Url(requestUrl)).toString();
    }
    return requestUrl;
  }


  validateStructure(transactions) {
    try {
      let ajv = new Ajv({
          allErrors: true
        }),
        validate = ajv.compile(transactionSchema),
        res = validate(transactions);

      if (!res) {
        throw new Error('Invalid syntax provided for requestList', validate.errors);
      }
    }
    catch (e) {
      throw new Error('Invalid syntax provided for requestList', e);
    }
  }

  validateRequiredFields(items) {
    const invalidItem = items.find((item) => {
      return !item.id || Object.keys(item.request).length === 0;
    });
    if (invalidItem) {
      throw Error('Required field is null, empty or undefined');
    }
  }

  getItemRequestProcessedInfo(itemRequest) {
    let parsed = parseFromXmlToObject(itemRequest.body.raw), // todo si no tiene body manejar escenario
      rawURL = this.getRawURL(itemRequest.url),
      isSoap = true,
      namespaceSoap = getNamespaceByURL(parsed, SOAP_ENVELOPE_NS_URL, MESSAGE_TAG_ENVELOPE);
    if (!namespaceSoap) {
      isSoap = false
      namespaceSoap = getNamespaceByURL(parsed, SOAP_12_ENVELOPE_NS_URL, MESSAGE_TAG_ENVELOPE);
    }
    let protocol = isSoap ? SOAP_PROTOCOL : SOAP12_PROTOCOL,
      envelope = parsed[namespaceSoap.prefixFilter + MESSAGE_TAG_ENVELOPE],
      body = envelope[namespaceSoap.prefixFilter + MESSAGE_TAG_BODY],
      methodName = Object.keys(body)[0];
    // agregar el metodo
    return {
      url: rawURL,
      name: methodName,
      protocol: protocol
    };
  }

  parseFromXmlToObject(xmlDocumentContent) {
    return parseFromXmlToObject(xmlDocumentContent);
  }

  buildMissmatch(property, schemaPath, transactionPath, reasonCode, message) {
    return {
      property: property, // "One of QUERYPARAM /PATHVARIABLE / HEADER / BODY / RESPONSE_HEADER / RESPONSE_BODY",
      schemaPath: schemaPath, // "jsonPath of the schema rule that was broken (nullable)",
      transactionPath: transactionPath, // "jsonPath of the part of the item that broke the rule (nullable)",
      reasonCode: reasonCode, // "TBD. Enum of reasons for mismatch (could be wrong_type or missing_required_field, for example)",
      message: message // "A human readable message that tries to explain the problem"

    }
  }

}

module.exports = {
  TransactionValidator
};
