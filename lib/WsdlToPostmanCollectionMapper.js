const XML = 'xml',
  {
    Collection,
    Response,
    ItemGroup
  } = require('postman-collection'),
  InputError = require('./InputError'),
  {
    SOAPParametersUtils
  } = require('../lib/utils/SOAPParametersUtils'),
  keyByOption = {
    'Port/Endpoint': 'portName',
    'Service': 'serviceName'
  };

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
   * @param {object} options options from the process
   * @param {string} collectionName optional collection name
   * @returns {object} A PostmanCollection object.
   */
  getPostmanCollection(options, collectionName = '') {
    let name = (collectionName) ? collectionName : this.wsdlObject.targetNamespace.url,
      postmanCollectionDefinition = this.generateMappingObject(this.wsdlObject, options, name),
      collection = new Collection(postmanCollectionDefinition);
    return collection;
  }

  /**
   * Takes a json wsdl parsed object and generates a postman collection definition format.
   * @param {object} wsdlObject JSON parsed object from a wsdl document
   * @param {object} options options from the process
   * @param {string} name optional collection name
   * @returns {object} An object with postman collection definition format.
   */
  generateMappingObject(wsdlObject, options, name) {
    let urls = this.getUrlFromOperations(wsdlObject.operationsArray),
      urlVariables = this.getVariablesFromUrlList(urls),
      groupsInfo = this.groupOperations(wsdlObject.operationsArray, options),
      items = this.createItemsFromOperationsFolderStrategy(groupsInfo, urlVariables),
      description = this.getCollectionDescription(wsdlObject),
      collectionDefinition = {};
    collectionDefinition = {
      info: {
        name: name,
        version: '1.0.0',
        description: description
      },
      item: items,
      variable: [...urlVariables]
    };

    return collectionDefinition;
  }

  /**
   * Groups the operations according to the folder strategy
   * @param {object} wsdlObject JSON parsed object from a wsdl document
   * @returns {string} the collection description in string representation
   */
  getCollectionDescription(wsdlObject) {
    return wsdlObject.log.errors;
  }

  /**
   * Groups the operations according to the folder strategy
   * @param {array} operations An array of parsed WSDL operations in json format.
   * @param {array} options the options from the process
   * @returns {object} object with the properties isGrouped if has some
   * groups by folder and the groups
   * if no groups returns the original operations
   */
  groupOperations(operations, options) {
    let key = '';

    if (!options || !options.folderStrategy || options.folderStrategy === 'No folders') {
      return {
        isGrouped: false,
        operations: operations
      };
    }
    key = keyByOption[options.folderStrategy];
    return this.getGroupsFromKey(operations, key);
  }

  /**
   * Gets the group object from the operations by the key
   * @param {array} operations An array of parsed WSDL operations in json format.
   * @param {string} key the key to group operations by
   * @returns {object} object with the properties isGrouped if has some
   * groups by folder and the groups
   */
  getGroupsFromKey(operations, key) {
    const allKeys = [...new Set(operations.map((operation) => {
      return operation[key];
    }))];
    let groups = [];
    allKeys.forEach((valueKey) => {
      let operationsByKey = operations.filter((operation) => {
        return operation[key] === valueKey;
      });
      groups.push({
        groupName: valueKey,
        operations: operationsByKey
      });
    });
    return {
      isGrouped: true,
      groups: groups
    };
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
    let variables = urlList.filter((url) => {
      if (url) {
        return url;
      }
    }).map((url, index) => {
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
   * a wsdl file determines if there is a folder strategy and implements
   * @param {array} groupsInfo the grouped operations information
   * @param {array} urlVariables An array with all url variables generated from operations data
   * @returns {array} An array with all items generated in postman item definition format
   */
  createItemsFromOperationsFolderStrategy(groupsInfo, urlVariables) {
    let items = [];
    if (!groupsInfo.isGrouped) {
      return this.createItemsFromOperations(groupsInfo.operations, urlVariables);
    }
    groupsInfo.groups.forEach((group) => {
      let operationItems = this.createItemsFromOperations(group.operations, urlVariables);
      items.push(new ItemGroup({
        name: group.groupName,
        item: operationItems
      }));
    });
    return items;
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
