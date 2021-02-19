const Collection = require('postman-collection').Collection,
  InputError = require('./InputError');

/**
 * Class to map a json parsed WSDL object to a PostmanCollection object
 * @param {object} wsdlObject Contains parsed data from a xml document to json format
 */
class WsdlToPostmanCollectionMapper {
  constructor(wsdlObject) {
    if (!wsdlObject) {
      throw new InputError('Wsdl Object must be provided and must not be empty');
    }
    this.wsdlObject = wsdlObject;
  }

  /**
   * Generates a PostmanCollection Object
   * @returns {object} A PostmanCollection object.
   */
  getPostmanCollection() {
    let postmanCollectionDefinition = this.generateMappingObject(this.wsdlObject),
      collection = new Collection(postmanCollectionDefinition);
    return collection;
  }

  /**
   * Takes a json wsdl parsed object and generates a postman collection definition format.
   * @param {object} wsdlObject JSON parsed object from a wsdl document
   * @returns {object} An object with postman collection definition format.
   */
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

  /**
   * Extract urls from operations array and returns an array of urls
   * @param {array} operations An array of parsed WSDL operations in json format.
   * @returns {array} An array of unique urls <string>
   */
  getUrlFromOperations(operations) {
    let urlsSet = new Set();
    operations.forEach((operation) => {
      urlsSet.add(operation.url);
    });
    return [...urlsSet];
  }

  /**
   * Extract url variables from urls list
   * @param {array} urlList An array of urls <string>
   * @returns {array} an array of variables with format {key: <string>, value: <string>}
   */
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

  /**
   * Substitutes a url value by a variable that corresponds with that value
   * @param {string} url A url value
   * @param {array} variables An array of all url document variables
   * @returns {string} a url with values, if any matches, replaced by variables
   */
  replaceVariableInUrl(url, variables) {
    let variableInUrl = variables.find((variable) => {
      return url.includes(variable.value);
    });
    if (variableInUrl) {
      return url.replace(variableInUrl.value, `{{${variableInUrl.key}}}`);
    }
  }

  /**
   * Generate an array with Items in postman definition format from an array of operations parsed from
   * a wsdl file
   * @param {array} operations An array of operations in json format parsed from a wsdl document
   * @param {array} urlVariables An array with all url variables generated from operations data
   * @returns {array} An array with all items generated in postman item definition format
   */
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
