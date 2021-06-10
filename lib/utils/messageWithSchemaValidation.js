const {
    SOAPMessageHelper
  } = require('./SOAPMessageHelper'),
  {
    getPrincipalPrefix
  } = require('./../WsdlParserCommon'),
  { XMLParser } = require('./../XMLParser'),
  { XMLXSDValidator } = require('./../xsdValidation/XMLXSDValidator'),
  {
    HTTP_PROTOCOL
  } = require('./../constants/processConstants'),
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
  return validator.validate(message, schema);
}

/**
 * Validate all messages generated from the wsdlObject operationsArray
 * @param {WSDLObject} wsdlObject wsdlObject generated from a xmlDocument
 * @param {string} schemaBase Schema base from xmlDocument
 * @param {boolean} isSchemaXSDDefault if the xsd ns is the default one
 * @returns {array} An array with all errors from all generated bodies from a wsdlObject
 */
function validateOperationMessagesWithSchema(wsdlObject, schemaBase, isSchemaXSDDefault) {
  const operations = wsdlObject.operationsArray;
  let validationErrors = [];
  operations.forEach((operation) => {
    let protocol = operation.protocol,
      bodyMessage = getBodyMessage(operation.input, protocol, !isSchemaXSDDefault);
    if (!bodyMessage && !schemaBase) {
      return;
    }
    if (protocol === HTTP_PROTOCOL) {
      return validationErrors;
    }
    try {
      validationErrors = [...validationErrors, ...validateMessageWithSchema(bodyMessage, schemaBase)];
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
    throw Error('Not WSDL spec found');
  }
  return wsdl_root;
}

/**
 * Returns the schema content without tns namespace and empty complexType tags
 * @param {object} schemaContent schema object taken from a parsed xmlDocumentContent
 * @returns {string} The schema with only the xmlns attribute
 */
function getSchemaContentWithoutAttributes(schemaContent) {
  let transformedSchemaContent = Object.assign({}, schemaContent);
  const schemaAttributes = Object.keys(transformedSchemaContent).filter((key) => {
    return key.includes('@_');
  });
  schemaAttributes.forEach((key) => {
    delete transformedSchemaContent[key];
  });
  return transformedSchemaContent;
}

/**
 * Returns if found the local namespace definition in the types
 * @param {WSDLObject} wsdlObject the parsed WSDLObject
 * @param {object} wsdlTypes The types from the parsed object scheam definition
 * @returns {object} The schema content and its corresponding namespace object
 */
function getLocalNamespaceDefinition(wsdlObject, wsdlTypes) {
  let schemaContent = getSchemaContentWithoutAttributes(wsdlTypes[`${wsdlObject.schemaNamespace.key}:schema`]);
  if (!schemaContent || Object.keys(schemaContent).length === 0) {
    for (let index = 0; index < wsdlObject.localSchemaNamespaces.length; index++) {
      let schemaFilter = wsdlObject.localSchemaNamespaces[index].key === '' ? 'schema' :
        `${wsdlObject.localSchemaNamespaces[index].key}:schema`;
      schemaContent =
        getSchemaContentWithoutAttributes(wsdlTypes[schemaFilter]);
      if (schemaContent) {
        return {
          schemaContent,
          foundNamespace: wsdlObject.localSchemaNamespaces[index]
        };
      }
    }
  }
  return {
    schemaContent,
    foundNamespace: wsdlObject.schemaNamespace
  };
}

/**
 * Identifies if the ns: declarations should be removed from schema
 * to pass validation
 * @param {object} schemaContent the parsed xml generated from a xmlDocument
 * @param {object} foundNamespace the parsed WSDLObject
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @returns {string} The schemaBase
 */
function getCleanSchemaCheckNamespace(schemaContent, foundNamespace, xmlParser) {
  let schema,
    schemaTag,
    schemaObject = {},
    utils = new SOAPMessageHelper();

  if (foundNamespace.key === '') {
    nsKey = `@_xmlns${foundNamespace.key}`;
    schemaTag = `${foundNamespace.key}schema`;
    schemaContent[nsKey] = foundNamespace.url;
    schemaContent['@_targetNamespace'] = foundNamespace.tnsDefinitionURL;
    schemaContent['@_xmlns:tns'] = foundNamespace.tnsDefinitionURL;
    schemaContent['@_elementFormDefault'] = 'qualified';
    schemaContent[nsKey] = foundNamespace.url;
    schemaObject[schemaTag] = schemaContent;
    schema = utils.parseObjectToXML(schemaObject, xmlParser)
      .replace(/\s*<[\w]*:?complexType>\s*<\/[\w]*:?complexType>/g, '');
  }
  else {
    nsKey = `@_xmlns:${foundNamespace.key}`;
    schemaTag = `${foundNamespace.key}:schema`;
    schemaContent[nsKey] = foundNamespace.url;
    schemaObject[schemaTag] = schemaContent;
    schema = utils.parseObjectToXML(schemaObject, xmlParser)
      .replace(/tns:/g, '')
      .replace(/\s*<[\w]*:?complexType>\s*<\/[\w]*:?complexType>/g, '');
  }
  return schema;
}

/**
 * Returns the schema without extra attributes and without empty complexType tags
 * @param {object} parsedXml the parsed xml generated from a xmlDocument
 * @param {WSDLObject} wsdlObject the parsed WSDLObject
 * @param {string} wsdl_version The wsdl version '1.1' or '2.0'
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @returns {string} The schemaBase
 */
function getCleanSchema(parsedXml, wsdlObject, wsdl_version, xmlParser) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new Error('Cannot get schema from undefined or null object');
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
    const { schemaContent, foundNamespace } = getLocalNamespaceDefinition(wsdlObject, types);
    schema = getCleanSchemaCheckNamespace(schemaContent, foundNamespace, xmlParser);
    return { cleanSchema: schema, isSchemaXSDDefault: foundNamespace.key === '' };
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
  getMessagePayload
};
