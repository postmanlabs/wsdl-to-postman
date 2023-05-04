const { SOAPMessageHelper } = require('./SOAPMessageHelper'),
  {
    getPrincipalPrefix
  } = require('./../WsdlParserCommon'),
  { XMLParser } = require('./../XMLParser'),
  UserError = require('../UserError'),
  { removeDoubleQuotes } = require('./../utils/textUtils'),
  { mergeSchemas } = require('./../utils/schemaMerger'),
  { XMLXSDValidator } = require('./../xsdValidation/XMLXSDValidator'),
  {
    HTTP_PROTOCOL
  } = require('./../constants/processConstants'),
  {
    SCHEMA_NS_URL,
    SCHEMA_NS_URL_XSD
  } = require('./../WsdlParserCommon'),
  WSDL_V11 = '1.1',
  WSDL_V20 = '2.0',
  WSDL11_root = 'definitions',
  WSDL20_root = 'description';


/**
 * Gets the whole SOAP Message and returns only the payload
 * @param {string} message body message generated for all operations
 * @param {string} tagName name of the message tag
 * @returns {string} the unwrapped bodyMessage
 */
function getMessagePayload(message, tagName) {
  const regex = new RegExp(`<${tagName}[\\s\\S]*?>[\\s\\S]*?<\\/${tagName}>|<${tagName}[\\s\\S]*?\\/>`, 'g'),
    result = regex.exec(message);
  return result ? result[0] : undefined;
}

/**
 * Removes xmlns declaration from message (needed for validation)
 * @param {string} message body message generated for all operations
 * @param {string} tagName name of the message tag
 * @returns {string} the bodyMessage without xmlns declaration
 */
function removeXMLNSFromRoot(message) {
  const nameSpaceRegex = /\S*=[\S"'].*"/,
    cleanMessage = message ? message.replace(nameSpaceRegex, '') : '';
  return cleanMessage;
}

/**
 * Gets the namespace def from the first element
 * @param {string} message body message generated for all operations
 * @param {string} tagName name of the message tag
 * @returns {string} the url for the namespace
 */
function getMessageNamespace(message, tagName) {
  const nameSpaceRegex = /\S*=[\S"'].*"/;
  let payload = getMessagePayload(message, tagName),
    namespaceURL = '',
    result = nameSpaceRegex.exec(payload);
  if (result) {
    namespaceURL = removeDoubleQuotes(result[0].substring(result[0].indexOf('=') + 1));
  }
  return namespaceURL;
}

/**
 * Return body message from request body message
 * @param {string} message body message generated for all operations
 * @param {string} tagName name of the message tag
 * @returns {string} the unwrapped bodyMessage
 */
function unwrapAndCleanBody(message, tagName) {
  return removeXMLNSFromRoot(getMessagePayload(message, tagName));
}

/**
 * Generates the body message from a nodeElement
 * @param {Element} nodeElement node taken from parsedXml
 * @param {string} protocol Protocol being used
 * @param {boolean} cleanBody indicates if xmlns should be removed from the root node
 * @returns {string} Unwrapped body message without attributes
 */
function getBodyMessage(nodeElement, protocol, cleanBody = true) {
  const soapMessageHelper = new SOAPMessageHelper();
  bodyMessage = soapMessageHelper.convertInputToMessage(nodeElement, [], protocol,
    new XMLParser());
  if (cleanBody) {
    cleanBodyMessage = nodeElement ? unwrapAndCleanBody(bodyMessage, nodeElement.name) : '';
  }
  else {
    cleanBodyMessage = nodeElement ? getMessagePayload(bodyMessage, nodeElement.name) : '';
  }
  return cleanBodyMessage;
}

/**
 * Validates that bodyMessage provided matches with schema in xmlDocument
 * @param {string} message BodyMessage
 * @param {message} schema Schema extracted from a xmlDocument
 * @returns {array} An array with all errors from message validation
 */
function validateMessageWithSchema(message, schema) {
  const validator = new XMLXSDValidator();
  try {
    return validator.validate(message, schema);
  }
  catch (err) {
    return [{
      message: 'Error validating message',
      code: 1
    }];
  }
}


/**
 * Identifies if the ns: declarations should be removed from schema
 * to pass validation
 * @param {array} allNamespaces all the namespaces from the document
 * @param {string} schemaTargetNamespace the url from the target Namespace
 * @returns {array} the filtered namespaces
 */
function findNamespaceWithSameTargetThanSchema(allNamespaces, schemaTargetNamespace) {
  if (!allNamespaces) {
    return;
  }
  return allNamespaces.filter((namespace) => {
    return namespace.url === schemaTargetNamespace;
  });
}

/**
 *  Returns namespace's keys that have the same value in url than the
 * schema target namespace
 * @param {array} allNamespaces all the namespaces from the document
 * @param {string} schemaTargetNamespace the url from the target Namespace
 * @returns {array} The keys that correspond to the same target namespace
 */
function findNSKeysWithSameTargetThanSchema(allNamespaces, schemaTargetNamespace) {
  const namespacesToChange = findNamespaceWithSameTargetThanSchema(allNamespaces, schemaTargetNamespace);
  if (namespacesToChange) {
    return namespacesToChange.map((namespacesToChange) => {
      return namespacesToChange.key;
    });
  }
}

/**
 * replace in schema elements
 * the keys in schema of namespaces that has the same TargetNamespace
 * than the schema this is needed to perform validation
 * e.g. if the wd:url namespaces is the same target namespace of the schema
 * <schema targetNamespace:rul>
 * and there are elements like <wd:some> the wd: will be replaced
 * @param {array} keys the namespace's keys that have the value in url equal to schema's targetnamespace
 * @param {string} schema the xml of the schema to use in validation
 * @returns {string} The schemaBase
 */
function replaceNSKeysWithSameTargetThanSchema(keys, schema) {
  let changedSchema = schema;
  if (Array.isArray(keys) && keys.length > 0) {
    keys.forEach((key) => {
      const regularExpRemoveNSINProperties = new RegExp('"' + key + ':', 'g'),
        regularExpRemoveNSINAtt = new RegExp('[\\s]' + key + ':', 'g'),
        regularExpRemoveTag = new RegExp('<' + key + ':', 'g'),
        regularExpRemoveCloseTag = new RegExp('<\/' + key + ':', 'g');
      changedSchema = changedSchema.replace(regularExpRemoveNSINProperties, '"')
        .replace(regularExpRemoveNSINAtt, ' ')
        .replace(regularExpRemoveTag, '<')
        .replace(regularExpRemoveCloseTag, '</');
    });
  }
  return changedSchema;
}

/**
 * Validate all messages generated from the wsdlObject operationsArray
 * @param {WSDLObject} wsdlObject wsdlObject generated from a xmlDocument
 * @param {string} schemaBase Schema base from xmlDocument
 * @param {boolean} isSchemaXSDDefault if the xsd ns is the default one
 * @param {string} schemaTargetNamespace schema target namespace
 * @returns {array} An array with all errors from all generated bodies from a wsdlObject
 */
function validateOperationMessagesWithSchema(wsdlObject, schemaBase, isSchemaXSDDefault,
  schemaTargetNamespace) {
  const operations = wsdlObject.operationsArray;
  let validationErrors = [];
  operations.forEach((operation) => {
    let protocol = operation.protocol,
      bodyMessage = getBodyMessage(operation.input[0], protocol, !isSchemaXSDDefault);
    if (!bodyMessage && !schemaBase || operation.input.length === 0) {
      return;
    }
    if (protocol === HTTP_PROTOCOL) {
      return validationErrors;
    }
    try {
      let keysFromNSSameTargetThanSchema = findNSKeysWithSameTargetThanSchema(wsdlObject.allNameSpaces,
          schemaTargetNamespace),
        cleanBodyMessage = replaceNSKeysWithSameTargetThanSchema(keysFromNSSameTargetThanSchema, bodyMessage);
      validationErrors = [...validationErrors, ...validateMessageWithSchema(cleanBodyMessage, schemaBase)];
    }
    catch (error) {
      console.error('There was an error validating body message vs schema ' + operation.name, error);
    }
  });
  return validationErrors;
}

/**
 * Get the wsdl root tag of wsdl specification used based on its version
 * @param {string} version wsdl spec version '1.1' or '2.0'
 * @returns {string} The root tag for the provided version
 */
function getWsdlRootTag(version) {
  let wsdl_root;
  if (version === WSDL_V11) {
    wsdl_root = WSDL11_root;
  }
  else if (version === WSDL_V20) {
    wsdl_root = WSDL20_root;
  }
  else {
    throw new UserError('Provided WSDL definition is invalid.');
  }
  return wsdl_root;
}

/**
 * Returns the schema content without tns namespace and empty complexType tags
 * @param {object} schemaContent schema object taken from a parsed xmlDocumentContent
 * @param {string} xmlParserAttPlaceHolder character to identify attributes in xml parser
 * @returns {string} The schema with only the xmlns attribute
 */
function getSchemaContentWithoutAttributes(schemaContent, xmlParserAttPlaceHolder) {
  let transformedSchemaContent = Object.assign({}, schemaContent);
  const schemaAttributes = Object.keys(transformedSchemaContent).filter((key) => {
    return key.includes(xmlParserAttPlaceHolder);
  });
  schemaAttributes.forEach((key) => {
    delete transformedSchemaContent[key];
  });
  return transformedSchemaContent;
}

/**
 * Returns if found the local namespace definition in the types
 * @param {object} wsdlTypes The types from the parsed object scheam definition
 * @param {string} namespaceURL The defined namespace url
 * @param {object} xmlParser The xmlparser
 * @returns {object} The schema content and its corresponding namespace object
 */
function getSchemaByNSURL(wsdlTypes, namespaceURL, xmlParser) {
  let foundKey = Object.keys(wsdlTypes).find((schema) => {
    let schemaTag = wsdlTypes[schema];
    return schemaTag[`${xmlParser.attributePlaceHolder}targetNamespace`] === namespaceURL;
  });
  if (foundKey) {
    return wsdlTypes[foundKey];
  }
  return undefined;
}

/**
 * Returns if found the local namespace definition in the types
 * @param {object} schemaObject The schema to validate with
 * @param {object} xmlParser The xmlparser
 * @returns {object} The schema content and its corresponding namespace object
 */
function getTargetNamespaceFromSchema(schemaObject, xmlParser) {
  return schemaObject[`${xmlParser.attributePlaceHolder}targetNamespace`];
}


/**
 * Returns schema by namespace
 * @param {WSDLObject} wsdlObject the parsed WSDLObject
 * @param {object} wsdlTypes The types from the parsed object scheam definition
 * @param {string} namespaceURL The defined namespace url
 * @param {object} xmlParser The xmlparser
 * @returns {object} The schema content and its corresponding namespace object
 */
function locateSchemaByNamespaceURL(wsdlObject, wsdlTypes, namespaceURL, xmlParser) {
  let schemaContent,
    schemaTargetNamespace;
  schemaByNS = getSchemaByNSURL(wsdlTypes, namespaceURL, xmlParser);
  if (schemaByNS) {
    schemaContent = getSchemaContentWithoutAttributes(schemaByNS, xmlParser.attributePlaceHolder);
    schemaTargetNamespace = getTargetNamespaceFromSchema(schemaByNS, xmlParser);
    if (wsdlObject.localSchemaNamespaces) {
      let namespaceWSDL = wsdlObject.localSchemaNamespaces.find((localNamespace) => {
        return localNamespace.tnsDefinitionURL === namespaceURL;
      });
      if (namespaceWSDL) {
        return {
          schemaContent,
          foundNamespace: namespaceWSDL,
          targetNamespace: schemaTargetNamespace
        };
      }
    }
    if (wsdlObject.schemaNamespace && wsdlObject.schemaNamespace.tnsDefinitionURL === namespaceURL) {
      return {
        schemaContent,
        foundNamespace: wsdlObject.schemaNamespace,
        targetNamespace: schemaTargetNamespace
      };
    }
  }
  return;
}

/**
 * Try to find the schema from local definitions
 * @param {WSDLObject} wsdlObject the parsed WSDLObject
 * @param {object} wsdlTypes The types from the parsed object scheam definition
 * @param {object} xmlParser The xmlparser
 * @returns {object} The schema content and its corresponding namespace object
 */
function locateSchemaFromLocalSchemas(wsdlObject, wsdlTypes, xmlParser) {
  if (wsdlObject.localSchemaNamespaces) {
    for (let index = 0; index < wsdlObject.localSchemaNamespaces.length; index++) {
      let schemaFilter = wsdlObject.localSchemaNamespaces[index].key === '' ? 'schema' :
        `${wsdlObject.localSchemaNamespaces[index].key}:schema`;
      schemaContent =
        getSchemaContentWithoutAttributes(wsdlTypes[schemaFilter], xmlParser.attributePlaceHolder);
      if (schemaContent) {
        let schemaTargetNamespace = getTargetNamespaceFromSchema(wsdlTypes[schemaFilter], xmlParser);
        return {
          schemaContent,
          foundNamespace: wsdlObject.localSchemaNamespaces[index],
          targetNamespace: schemaTargetNamespace
        };
      }
    }
  }
  return;
}

/**
 * Try to find the schema from local definitions
 * @param {object} schemaContentArray The types from the parsed object scheam definition
 * @param {object} xmlParserAttPlaceHolder The xmlparser character for att
 * @param {WSDLObject} wsdlObject the parsed WSDLObject
 * @returns {object} The schema content and its corresponding namespace object
 */
function mergeSchemasAndClean(schemaContentArray, xmlParserAttPlaceHolder, wsdlObject) {
  let mergedSchema = mergeSchemas(schemaContentArray);
  schemaContent =
  getSchemaContentWithoutAttributes(mergedSchema, xmlParserAttPlaceHolder);
  if (schemaContent) {
    return {
      schemaContent,
      foundNamespace: wsdlObject.schemaNamespace
    };
  }
}

/**
 * Returns if found the local namespace definition in the types
 * @param {WSDLObject} wsdlObject the parsed WSDLObject
 * @param {object} wsdlTypes The types from the parsed object scheam definition
 * @param {string} namespaceURL The defined namespace url
 * @param {object} xmlParser The xmlparser
 * @returns {object} The schema content and its corresponding namespace object
 */
function getLocalNamespaceDefinition(wsdlObject, wsdlTypes, namespaceURL, xmlParser) {
  let schemaContent,
    schemaTargetNamespace;
  schemaContent = locateSchemaByNamespaceURL(wsdlObject, wsdlTypes, namespaceURL, xmlParser);
  if (schemaContent) {
    return schemaContent;
  }
  schemaContent = locateSchemaFromLocalSchemas(wsdlObject, wsdlTypes, xmlParser);
  if (schemaContent) {
    return schemaContent;
  }
  if (Array.isArray(wsdlTypes[`${wsdlObject.schemaNamespace.key}:schema`])) {
    schemaContent = mergeSchemasAndClean(wsdlTypes[`${wsdlObject.schemaNamespace.key}:schema`],
      xmlParser.attributePlaceHolder, wsdlObject);
    if (schemaContent) {
      return schemaContent;
    }
  }
  schemaContent = getSchemaContentWithoutAttributes(wsdlTypes[`${wsdlObject.schemaNamespace.key}:schema`],
    xmlParser.attributePlaceHolder);
  schemaTargetNamespace = getTargetNamespaceFromSchema(wsdlTypes[`${wsdlObject.schemaNamespace.key}:schema`],
    xmlParser);
  return {
    schemaContent,
    foundNamespace: wsdlObject.schemaNamespace,
    targetNamespace: schemaTargetNamespace
  };
}

/**
 * Identifies if the ns: declarations should be removed from schema
 * to pass validation
 * @param {object} schemaContent the parsed xml generated from a xmlDocument
 * @param {object} foundNamespace the parsed WSDLObject
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {object} wsdlObject the documents WSDL representation
 * @param {string} schemaTargetNamespace the schema target namespace
 * @returns {string} The schemaBase
 */
function getCleanSchemaCheckNamespace(schemaContent, foundNamespace, xmlParser, wsdlObject, schemaTargetNamespace) {
  let schema,
    schemaTag,
    schemaObject = {},
    tnsPrefix = 'tns',
    regularExpRemoveNSINProperties,
    regularExpRemoveNSINAtt,
    utils = new SOAPMessageHelper(),
    tnsNamespace = wsdlObject.tnsNamespace,
    keysFromNSSameTargetThanSchema = findNSKeysWithSameTargetThanSchema(wsdlObject.allNameSpaces,
      schemaTargetNamespace);

  if (tnsNamespace) {
    tnsPrefix = tnsNamespace.key;
  }

  if (foundNamespace.key === '') {
    nsKey = `${xmlParser.attributePlaceHolder}xmlns${foundNamespace.key}`;
    schemaTag = `${foundNamespace.key}schema`;
    schemaContent[nsKey] = foundNamespace.url;
    schemaContent[`${xmlParser.attributePlaceHolder}targetNamespace`] = foundNamespace.tnsDefinitionURL;
    schemaContent[`${xmlParser.attributePlaceHolder}xmlns:${tnsPrefix}`] = foundNamespace.tnsDefinitionURL;
    schemaContent[`${xmlParser.attributePlaceHolder}elementFormDefault`] = 'qualified';
    schemaContent[nsKey] = foundNamespace.url;
    schemaObject[schemaTag] = schemaContent;
    schema = utils.parseObjectToXML(schemaObject, xmlParser)
      .replace(/\s*<[\w]*:?complexType>\s*<\/[\w]*:?complexType>/g, '');
  }
  else {
    nsKey = `${xmlParser.attributePlaceHolder}xmlns:${foundNamespace.key}`;
    schemaTag = `${foundNamespace.key}:schema`;
    schemaContent[nsKey] = foundNamespace.url;
    importTag = {};
    importTag['@_namespace'] = SCHEMA_NS_URL;
    importTag['@_schemaLocation'] = SCHEMA_NS_URL_XSD;

    let returnedTarget = {};
    returnedTarget[`${foundNamespace.key}:import`] = importTag;
    returnedTarget = { ...returnedTarget, ...schemaContent };
    schemaObject[schemaTag] = schemaContent;

    regularExpRemoveNSINProperties = new RegExp('"' + tnsPrefix + ':', 'g');
    regularExpRemoveNSINAtt = new RegExp('[\\s]' + tnsPrefix + ':', 'g');
    schema = utils.parseObjectToXML(schemaObject, xmlParser)
      .replace(regularExpRemoveNSINProperties, '"')
      .replace(regularExpRemoveNSINAtt, ' ')
      .replace(/\s*<[\w]*:?complexType>\s*<\/[\w]*:?complexType>/g, '');
  }
  schema = replaceNSKeysWithSameTargetThanSchema(keysFromNSSameTargetThanSchema, schema);
  return schema;
}


/**
 * Returns the schema without extra attributes and without empty complexType tags
 * @param {object} parsedXml the parsed xml generated from a xmlDocument
 * @param {WSDLObject} wsdlObject the parsed WSDLObject
 * @param {string} wsdl_version The wsdl version '1.1' or '2.0'
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {string} namespaceURL the identifier for the schema
 * @returns {object} The schemaBase and isXSDDefault property {string, bool}
 */
function getCleanSchema(parsedXml, wsdlObject, wsdl_version, xmlParser, namespaceURL) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new UserError('Provided WSDL definition is invalid XML.');
  }
  try {
    let wsdl_root = getWsdlRootTag(wsdl_version),
      principalPrefix = getPrincipalPrefix(parsedXml, wsdl_root),
      definitions,
      types,
      schema;

    definitions = parsedXml[principalPrefix + wsdl_root];
    types = definitions[principalPrefix + 'types'];
    if (!types) {
      return { cleanSchema: types, isSchemaXSDDefault: types };
    }
    const { schemaContent, foundNamespace, targetNamespace } =
     getLocalNamespaceDefinition(wsdlObject, types, namespaceURL, xmlParser);
    schema = getCleanSchemaCheckNamespace(schemaContent, foundNamespace, xmlParser, wsdlObject,
      targetNamespace);
    return {
      cleanSchema: schema,
      isSchemaXSDDefault: foundNamespace.key === '',
      schemaTargetNamespace: targetNamespace
    };
  }
  catch (error) {
    throw new Error('Cannot get schema from object');
  }
}

module.exports = {
  validateOperationMessagesWithSchema,
  getCleanSchema,
  validateMessageWithSchema,
  getBodyMessage,
  unwrapAndCleanBody,
  getMessagePayload,
  getMessageNamespace,
  findNSKeysWithSameTargetThanSchema,
  replaceNSKeysWithSameTargetThanSchema
};
