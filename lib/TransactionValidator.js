const Ajv = require('ajv'),
  transactionSchema = require('./constants/transactionSchema'),
  sdk = require('postman-collection'),
  {
    parseFromXmlToObject,
    getPrincipalPrefix,
    getNamespaceByURL
  } = require('./WsdlParserCommon');

class TransactionValidator {

  validateTransaction(items, wsdlObject) {
    let matched = true,
      result = {
        matched: true,
        requests: {}
      }

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
      let processedInfo = this.getItemRequestProcessedInfo(requestItem.request);
      let operationFromWSDL = this.getOperationFromWSDLObjectByUrlNameProtocol(processedInfo, wsdlObject);
      localResult.requests[requestItem.id].endpoints[0] = {
        matched: true,
        endpointMatchScore: 1,
        endpoint: operationFromWSDL.name, //i.e. "POST /organization/user"
        mismatches: [],
        responses: {}
      };

      requestItem.response.forEach((responseInItem) => {
        let responseObject = {
          id: responseInItem.id,
          matched: true,
          mismatches: []
        }
        localResult.requests[requestItem.id].endpoints[0].responses[responseInItem.id] = responseObject;
      });

    });
    return localResult;
  }

  getOperationFromWSDLObjectByUrlNameProtocol(itemRequestProcessedInfo, wsdlObject) {
    return wsdlObject.operationsArray.find((operation) => {
      return operation.url === itemRequestProcessedInfo.url && operation.name === itemRequestProcessedInfo.name &&
        operation.protocol === itemRequestProcessedInfo.protocol;
    })
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
    let parsed = parseFromXmlToObject(itemRequest.body.raw), //todo si no tiene body manejar escenario
      rawURL = this.getRawURL(itemRequest.url);
    let isSoap = true;
    let namespaceSoap = getNamespaceByURL(parsed, 'http://schemas.xmlsoap.org/soap/envelope/', 'Envelope')
    if (!namespaceSoap) {
      isSoap = false
      namespaceSoap = getNamespaceByURL(parsed, 'http://www.w3.org/2003/05/soap-envelope', 'Envelope')
    }
    let protocol = isSoap ? 'soap' : 'soap12'
    let envelope = parsed[namespaceSoap.prefixFilter + 'Envelope']
    let body = envelope[namespaceSoap.prefixFilter + 'Body']
    let methodName = Object.keys(body)[0];
    return {
      url: rawURL,
      name: methodName,
      protocol: protocol
    }
  }

  parseFromXmlToObject(xmlDocumentContent) {
    return parseFromXmlToObject(xmlDocumentContent);
  }

}

module.exports = {
  TransactionValidator
};
