const {
  getProtocolAndHost
} = require('./utils/urlUtils');

const XML = 'xml',
  {
    Collection,
    Response,
    ItemGroup,
    Item
  } = require('postman-collection'),
  InputError = require('./InputError'),
  {
    SOAPMessageHelper
  } = require('../lib/utils/SOAPMessageHelper'),
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
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @param {string} collectionName optional collection name
   * @returns {object} A PostmanCollection object.
   */
  getPostmanCollection(options, xmlParser, collectionName = '') {
    let name = this.getCollectionName(collectionName),
      postmanCollectionDefinition = this.generateMappingObject(this.wsdlObject, options, name, xmlParser),
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
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {object} An object with postman collection definition format.
   */
  generateMappingObject(wsdlObject, options, name, xmlParser) {
    let urlsData = this.getUrlDataFromOperations(wsdlObject.operationsArray),
      urlVariablesData = this.getVariablesFromUrlDataList(urlsData),
      urlVariablesOnly = urlVariablesData.map((variableData) => {
        return {
          key: variableData.key,
          value: variableData.value
        };
      }),
      groupsInfo = this.groupOperations(wsdlObject.operationsArray, options),
      items = this.createItemsFromOperationsFolderStrategy(
        groupsInfo,
        urlVariablesData,
        wsdlObject.securityPolicyArray,
        xmlParser
      ),
      description = this.getCollectionDescription(wsdlObject, groupsInfo),
      collectionDefinition = {};
    collectionDefinition = {
      info: {
        name: name,
        version: '1.0.0',
        description: description
      },
      item: items,
      variable: [...urlVariablesOnly]
    };

    return collectionDefinition;
  }

  /**
   * Groups the operations according to the folder strategy
   * @param {object} wsdlObject JSON parsed object from a wsdl document
   * @param {object} groupsInfo the generated information for grouping requests in folders
   * @returns {string} the collection description in string representation
   */
  getCollectionDescription(wsdlObject, groupsInfo) {
    let messagesFromGrouping = [],
      generatedDocumentation = wsdlObject.documentation + '\n' + wsdlObject.log.errors;
    if (groupsInfo && groupsInfo.isGrouped) {
      messagesFromGrouping = groupsInfo.groups.filter((groupedRequests) => {
        if (groupedRequests.message) {
          return true;
        }
      }).map((filtered) => {
        return filtered.message;
      });

      messagesFromGrouping.forEach((message) => {
        generatedDocumentation += '\n' + message;
      });
    }
    return generatedDocumentation;
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
    let groups = [],
      messageKey = '',
      message = '';
    allKeys.forEach((valueKey) => {
      let operationsByKey = operations.filter((operation) => {
        return operation[key] === valueKey;
      });
      if (valueKey === '') {
        messageKey = key === 'portName' ? 'Port' : 'Service';
        valueKey = `Unnamed ${messageKey}`;
        message = `Could not get name for folder from ${messageKey}. Using default instead.`;
      }

      groups.push({
        groupName: valueKey,
        operations: operationsByKey,
        message: message
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
  getUrlDataFromOperations(operations) {
    let urlsData = [],
      portNames = new Set();
    operations.forEach((operation) => {
      const {
        portName,
        // protocol,
        url
      } = operation;
      if (!portNames.has(portName)) {
        urlsData.push({
          portName,
          url
        });
      }
      portNames.add(portName);
    });
    return [...urlsData];
  }

  /**
   * Extract url variables from urls list
   * @param {array} urlDataList An array of urls with urlData
   * @returns {array} an array of variables with format {key: <string>, value: <string>}
   */
  getVariablesFromUrlDataList(urlDataList) {
    let variables = urlDataList.filter((urlData) => {
      if (urlData.url) {
        return urlData;
      }
    }).map((urlData) => {
      const {
        protocol,
        host
      } = getProtocolAndHost(urlData.url);
      return {
        key: `${urlData.portName}BaseUrl`,
        value: `${protocol}${host}`,
        urlData
      };
    });
    return variables;
  }

  /**
   * Substitutes a url value by a variable that corresponds with that value
   * @param {string} operation An operation object
   * @param {array} variablesData An array of all variables with urlData
   * @returns {string} a url with values, if any matches, replaced by variables
   */
  replaceVariableInUrl(operation, variablesData) {
    const {
      portName,
      url
    } = operation;
    let variableInUrl = variablesData.find((variable) => {
      const portNameMatch = variable.urlData.portName === portName;
      return portNameMatch;
    });
    if (variableInUrl) {
      return url.replace(variableInUrl.value, `{{${variableInUrl.key}}}`);
    }
  }

  /**
   * Generate an array with Items in postman definition format from an array of operations parsed from
   * a wsdl file determines if there is a folder strategy and implements
   * @param {array} groupsInfo the grouped operations information
   * @param {array} urlVariablesData An array with all variables with urlData from operations
   * @param {array} securityPolicyArray An array with all security policies
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {array} An array with all items generated in postman item definition format
   */
  createItemsFromOperationsFolderStrategy(groupsInfo, urlVariablesData, securityPolicyArray,
    xmlParser) {
    let items = [];
    if (!groupsInfo.isGrouped) {
      return this.createItemsFromOperations(groupsInfo.operations, urlVariablesData, securityPolicyArray,
        xmlParser);
    }
    else if (groupsInfo.isGrouped && groupsInfo.groups.length === 1) {
      return this.createItemsFromOperations(groupsInfo.groups[0].operations, urlVariablesData, securityPolicyArray,
        xmlParser);
    }
    groupsInfo.groups.forEach((group) => {
      let operationItems = this.createItemsFromOperations(group.operations, urlVariablesData, securityPolicyArray,
        xmlParser);
      items.push(new ItemGroup({
        name: group.groupName,
        item: operationItems,
        description: group.operations[0].serviceDescription
      }));
    });
    return items;
  }


  /**
   * Generate an array with Items in postman definition format from an array of operations parsed from
   * a wsdl file
   * @param {object} wsdlObject JSON parsed object from a wsdl document
   * @param {array} operation  WSDLOPeration in json format parsed from a wsdl document
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {array} An array with all items generated in postman item definition format
   */
  createSingleItemAndVariablesFromOperation(wsdlObject, operation, xmlParser) {
    let urlsData = this.getUrlDataFromOperations(wsdlObject.operationsArray),
      urlVariablesData = this.getVariablesFromUrlDataList(urlsData),
      urlVariablesOnly = urlVariablesData.map((variableData) => {
        return {
          key: variableData.key,
          value: variableData.value
        };
      }),
      postmanItem = this.createItemsFromOperations(operation, urlVariablesData, wsdlObject.securityPolicyArray,
        xmlParser)[0],
      resultItem = new Item({
        name: postmanItem.name,
        request: postmanItem.request,
        response: postmanItem.response
      }),
      suggestedEndpointJson = resultItem.toJSON(),
      result = {
        request: suggestedEndpointJson,
        variables: [...urlVariablesOnly]
      };
    return result;
  }

  /**
   * Generate an array with Items in postman definition format from an array of operations parsed from
   * a wsdl file
   * @param {array} operations An array of operations in json format parsed from a wsdl document
   * @param {array} urlVariablesData An array with all variables with urlData from operations
   * @param {array} securityPolicyArray An array with all security policies
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {array} An array with all items generated in postman item definition format
   */
  createItemsFromOperations(operations, urlVariablesData, securityPolicyArray, xmlParser) {
    let items = operations.map((operation) => {
      let postmanItem = {
        name: operation.name,
        request: {
          description: operation.description,
          url: this.replaceVariableInUrl(operation, urlVariablesData),
          method: operation.method,
          header: this.getXMLHeader(),
          body: {
            mode: 'raw',
            raw: this.getBodyMessage(operation.input, securityPolicyArray, operation.protocol,
              xmlParser),
            options: {
              raw: {
                language: XML
              }
            }
          }
        },
        response: this.getResponses(operation, securityPolicyArray, xmlParser)
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
   * @param {array} securityPolicyArray An array with all security policies
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {string} the message xml with the structure determined in the
   * elements and the default values examples
   */
  getBodyMessage(nodeElement, securityPolicyArray, protocol, xmlParser) {
    const soapMessageHelper = new SOAPMessageHelper();
    return soapMessageHelper.convertInputToMessage(nodeElement, securityPolicyArray, protocol,
      xmlParser);
  }

  /**
   * Generates the responses also knwon as examples of an operation
   * if the operation has output and fault returns the corresponding array of
   * responses
   * @param {Operation} operation the WSDL Operation
   * @param {array} securityPolicyArray An array with all security policies
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {Array} the array of responses
   */
  getResponses(operation, securityPolicyArray, xmlParser) {
    let incorrectResponse,
      correctResponse,
      responses = [];
    if (operation.output) {
      correctResponse = this.buildResponseObject(' response', 'OK', 200,
        operation, this.getBodyMessage(operation.input, securityPolicyArray, operation.protocol, xmlParser),
        operation.output,
        xmlParser);
      responses.push(correctResponse);
    }
    if (operation.fault) {
      incorrectResponse = this.buildResponseObject(' fault', 'not OK', 500,
        operation, 'incorrect body message', operation.fault, xmlParser);
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
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {Response} the Postman response object
   */
  buildResponseObject(sufixName, status, code, operation, requestBodyMessage,
    responseBodyElement, xmlParser) {
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
      body: this.getBodyMessage(responseBodyElement, undefined, operation.protocol,
        xmlParser)
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
