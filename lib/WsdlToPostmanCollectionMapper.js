const Collection = require('postman-collection').Collection,
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
          header: {
            'Content-Type': 'text/xml; charset=utf-8'
          },
          body: {
            mode: 'raw',
            raw: this.getBodyMessage(operation.input, operation.protocol),
            urlencoded: 'pending to fill'
          }
        }
      };
      return postmanItem;
    });
    return items;
  }
  getBodyMessage(nodeElement, protocol) {
    const sOAPParametersUtils = new SOAPParametersUtils();
    return sOAPParametersUtils.converObjectParametersToXML(nodeElement, protocol);
  }
}
module.exports = {
  WsdlToPostmanCollectionMapper
};
