const Collection = require('postman-collection').Collection,
  InputError = require('./InputError');

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
    let urls = this.getUrlFromOperations(wsdlObject.operationsArray),
      urlVariables = this.getVariablesFromUrlList(urls),
      items = this.createItemsFromOperations(wsdlObject.operationsArray, urlVariables),
      collectionDefinition = {};
    collectionDefinition = {
      info: {
        name: 'Find the way to get the name of the collection.',
        version: '1.0.0'
      },
      item: items,
      variable: [...urlVariables]
    };
    return collectionDefinition;
  }

  getUrlFromOperations(operations) {
    let urlsSet = new Set();
    operations.forEach((operation) => {
      urlsSet.add(operation.url);
    });
    return [...urlsSet];
  }

  getVariablesFromUrlList(urlList) {
    let variables = urlList.map((url, index) => {
      let newUrl = {};
      newUrl.protocol = url.split('//')[0];
      newUrl.host = url.split('//')[1].split('/')[0];
      return {
        key: `url_variable_${index}`,
        value: `${newUrl.protocol}//${newUrl.host}/`
      };
    });
    return variables;
  }

  replaceVariableInUrl(url, variables) {
    let variableInUrl = variables.find((variable) => {
      return url.includes(variable.value);
    });
    if (variableInUrl) {
      return url.replace(variableInUrl.value, `{{${variableInUrl.key}}}`);
    }
  }

  createItemsFromOperations(operations, urlVariables) {
    let items = operations.map((operation) => {
      let postmanItem = {
        name: operation.name,
        description: operation.description,
        request: {
          url: this.replaceVariableInUrl(operation.url, urlVariables),
          method: operation.method,
          header: {
            'Content-Type': 'text/xml; charset=utf-8'
          },
          body: {
            mode: 'raw',
            raw: 'Pending to fill',
            urlencoded: 'pending to fill'
          }
        }
      };
      return postmanItem;
    });
    return items;
  }
}
module.exports = {
  WsdlToPostmanCollectionMapper
};
