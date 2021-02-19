const XML = 'xml',
  {
    Collection,
    Response
  } = require('postman-collection'),
  InputError = require('./InputError'),
  {
    SOAPParametersUtils
  } = require('../lib/utils/SOAPParametersUtils');

class WsdlToPostmanCollectionMapper {
  constructor(wsdlObject) {
    if (!wsdlObject) {
      throw new InputError('Wsdl Object must be provided and must not be empty');
    }
    this.wsdlObject = wsdlObject;
  }

  getPostmanCollection() {
    let postmanCollectionDefinition = this.generateMappingObject(this.wsdlObject),
      collection = new Collection(postmanCollectionDefinition);
    return collection;
  }

  generateMappingObject(wsdlObject) {
    let items = this.createItemsFromOperations(wsdlObject.operationsArray),
      collectionDefinition = {
        info: {
          name: 'Find the way to get the name of the collection.',
          version: '1.0.0'
        },
        item: items,
        variables: [{}]
      };
    return collectionDefinition;
  }

  createItemsFromOperations(operations) {
    let items = operations.map((operation) => {
      let postmanItem = {
        name: operation.name,
        description: operation.description,
        request: {
          url: operation.url,
          method: operation.method,
          header: this.getXMLHeader(),
          body: {
            mode: 'raw',
            raw: this.getBodyMessage(operation.input, operation.protocol),
            options: {
              raw: {
                language: XML
              }
            }
          }
        },
        response: this.getResponses(operation)
      };
      return postmanItem;
    });
    return items;
  }
  getBodyMessage(nodeElement, protocol) {
    const sOAPParametersUtils = new SOAPParametersUtils();
    return sOAPParametersUtils.converObjectParametersToXML(nodeElement, protocol);
  }

  getResponses(operation) {
    let incorrectResponse,
      correctResponse,
      responses = [];
    if (operation.output) {
      correctResponse = new Response({
        name: operation.name + ' response',
        status: 'OK',
        code: 200,
        header: this.getXMLHeader(),
        originalRequest: {
          url: operation.url,
          method: operation.method,
          header: this.getXMLHeader(),
          body: {
            mode: 'raw',
            raw: this.getBodyMessage(operation.input, operation.protocol),
            options: {
              raw: {
                language: XML
              }
            }
          }
        },
        body: this.getBodyMessage(operation.output, operation.protocol)
      });
      correctResponse._postman_previewlanguage = XML;
      responses.push(correctResponse);
    }
    if (operation.fault) {
      incorrectResponse = new Response({
        name: operation.name + ' fault',
        status: 'not OK',
        code: 500,
        header: this.getXMLHeader(),
        originalRequest: {
          url: operation.url,
          method: operation.method,
          header: this.getXMLHeader(),
          body: {
            mode: 'raw',
            raw: 'incorrect body message',
            options: {
              raw: {
                language: XML
              }
            }
          }
        },
        body: this.getBodyMessage(operation.fault, operation.protocol)
      });
      incorrectResponse._postman_previewlanguage = XML;
      responses.push(incorrectResponse);
    }
    return responses;
  }

  getXMLHeader() {
    return {
      'Content-Type': 'text/xml; charset=utf-8'
    };
  }
}
module.exports = {
  WsdlToPostmanCollectionMapper
};
