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
  FOLDER_OPTIONS = {
    noFolders: 'No folders',
    portEndpoint: 'Port/Endpoint',
    service: 'Service'
  },
  keyByOption = {
    [FOLDER_OPTIONS.portEndpoint]: 'portName',
    [FOLDER_OPTIONS.service]: 'serviceName'
  },
  DEFAULT_COLLECTION_NAME = 'WSDL To Postman Generated';

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
    let name = this.getCollectionName(collectionName),
      postmanCollectionDefinition = this.generateMappingObject(this.wsdlObject, options, name),
      collection = new Collection(postmanCollectionDefinition);
    return collection;
  }

  /**
   * Gets the collection name from the file if the input is not empty
   * from the target namespaces if the input is emtpy
   * and a default value if both are empty
   * @param {string} collectionName optional collection name
   * @returns {string} collection's name.
   */
  getCollectionName(collectionName = '') {
    if (!this.wsdlObject.targetNamespace) {
      return DEFAULT_COLLECTION_NAME;
    }
    let name = (collectionName) ? collectionName : this.wsdlObject.targetNamespace.url;
    return name ? name : DEFAULT_COLLECTION_NAME;
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
    let key = '',
      {
        folderStrategy
      } = options,
      defaultOption = FOLDER_OPTIONS.portEndpoint;
    if (!folderStrategy) {
      key = keyByOption[defaultOption];
    }
    else if (Object.values(FOLDER_OPTIONS).includes(folderStrategy)) {
      if (folderStrategy === FOLDER_OPTIONS.noFolders) {
        return {
          isGrouped: false,
          operations: operations
        };
      }
      key = keyByOption[folderStrategy];
    }
    else {
      throw Error(`Provided folderStrategy option is not supported. 
        Options are ${Object.values(FOLDER_OPTIONS).join(', ')}`);
    }
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
        value: `${newUrl.protocol}//${newUrl.host}`
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
      return url.replace(variableInUrl.value, `{{${variableInUrl.key}}}/`);
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

  /**
   * Generates the xml body message
   * Takes in a node representing the message for a soap call
   * returns an string with the body message
   * @param {*} nodeElement the root node for the message parameters
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @returns {string} the message xml with the structure determined in the
   * elements and the default values examples
   */
  getBodyMessage(nodeElement, protocol) {
    const sOAPParametersUtils = new SOAPParametersUtils();
    return sOAPParametersUtils.converObjectParametersToXML(nodeElement, protocol);
  }

  /**
   * Generates the responses also knwon as examples of an operation
   * if the operation has output and fault returns the corresponding array of
   * responses
   * @param {Operation} operation the WSDL Operation
   * @returns {Array} the array of responses
   */
  getResponses(operation) {
    let incorrectResponse,
      correctResponse,
      responses = [];
    if (operation.output) {
      correctResponse = this.buildResponseObject(' response', 'OK', 200,
        operation, this.getBodyMessage(operation.input, operation.protocol), operation.output);
      responses.push(correctResponse);
    }
    if (operation.fault) {
      incorrectResponse = this.buildResponseObject(' fault', 'not OK', 500,
        operation, 'incorrect body message', operation.fault);
      responses.push(incorrectResponse);
    }
    return responses;
  }

  /**
   * build a Postman collection response object
   * @param {string} sufixName the sufix that will be applied to the response name
   * @param {string} status the status operation
   * @param {Number} code the code operation
   * @param {Operation} operation the WSDL Operation
   * @param {string} requestBodyMessage the request body message in string rep
   * @param {Element} responseBodyElement the WSDL Operation Element
   * @returns {Response} the Postman response object
   */
  buildResponseObject(sufixName, status, code, operation, requestBodyMessage, responseBodyElement) {
    let response = new Response({
      name: operation.name + sufixName,
      status: status,
      code: code,
      header: this.getXMLHeader(),
      originalRequest: {
        url: operation.url,
        method: operation.method,
        header: this.getXMLHeader(),
        body: {
          mode: 'raw',
          raw: requestBodyMessage,
          options: {
            raw: {
              language: XML
            }
          }
        }
      },
      body: this.getBodyMessage(responseBodyElement, operation.protocol)
    });
    response._postman_previewlanguage = XML;
    return response;
  }

  /**
   * Returns the defined xml header
   * returns the object that represents a header for Postman
   * whit the values for xml
   * @returns {Object} the header object
   */
  getXMLHeader() {
    return {
      'Content-Type': 'text/xml; charset=utf-8'
    };
  }
}
module.exports = {
  WsdlToPostmanCollectionMapper,
  DEFAULT_COLLECTION_NAME
};
