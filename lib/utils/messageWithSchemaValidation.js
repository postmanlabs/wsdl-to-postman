const libxml = require('libxmljs'),
  {
    SOAPParametersUtils
  } = require('./SOAPParametersUtils'),
  {
    getPrincipalPrefix
  } = require('./../WsdlParserCommon'),
  WSDL_V11 = '1.1',
  WSDL_V20 = '2.0',
  WSDL11_root = 'definitions',
  WSDL20_root = 'description';

/**
 * Return body message from request body message
 * @param {string} message body message generated for all operations
 * @param {string} protocol protocol being used
 * @returns {string} the unwrapped bodyMessage
 */
function unwrapAndCleanBody(message, protocol) {
  const regex = /\S*=[\S"'].*"/,
    messageLines = message.split('\n').slice(1).filter((line) => {
      return !line.includes(`${protocol}:`);
    }),
    cleanMessage = messageLines.map((line) => {
      return line.replace(regex, '');
    }).join('\n');
  return cleanMessage;
}

/**
 * Generates the body message from a nodeElement
 * @param {Element} nodeElement node taken from parsedXml
 * @param {string} protocol Protocol being used
 * @returns {string} Unwrapped body message without attributes
 */
function getBodyMessage(nodeElement, protocol) {
  const utils = new SOAPParametersUtils(),
    bodyMessage = utils.converObjectParametersToXML(nodeElement, protocol),
    cleanBodyMessage = unwrapAndCleanBody(bodyMessage, protocol);
  return cleanBodyMessage;
}

/**
 * Validates that bodyMessage provided matches with schema in xmlDocument
 * @param {string} message BodyMessage
 * @param {message} schema Schema extracted from a xmlDocument
 * @returns {array} An array with all errors from message validation
 */
function validateMessageWithSchema(message, schema) {
  const xsdParsed = libxml.parseXmlString(schema),
    messageParsed = libxml.parseXmlString(message);
  messageParsed.validate(xsdParsed);
  return messageParsed.validationErrors;
}

/**
 * Validate all messages generated from the wsdlObject operationsArray
 * @param {WSDLObject} wsdlObject wsdlObject generated from a xmlDocument
 * @param {string} schemaBase Schema base from xmlDocument
 * @returns {array} An array with all errors from all generated bodies from a wsdlObject
 */
function validateOperationMessagesWithSchema(wsdlObject, schemaBase) {
  const operations = wsdlObject.operationsArray;
  let validationErrors = [];
  operations.forEach((operation) => {
    let protocol = operation.protocol,
      bodyMessage = getBodyMessage(operation.input, protocol);
    if (protocol === 'HTTP') {
      return validationErrors;
    }
    try {
      validationErrors = [...validationErrors, ...validateMessageWithSchema(bodyMessage, schemaBase)];
    }
    catch (error) {
      console.error('There was an error validating body message vs schema', error);
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
 * Returns the schema without extra attributes and without empty complexType tags
 * @param {object} parsedXml the parsed xml generated from a xmlDocument
 * @param {namespace} schemaNamespace the main namespace in schema
 * @param {string} wsdl_version The wsdl version '1.1' or '2.0'
 * @returns {string} The schemaBase
 */
function getCleanSchema(parsedXml, schemaNamespace, wsdl_version) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new Error('Can not get schema from undefined or null object');
  }
  try {
    let wsdl_root = getWsdlRootTag(wsdl_version),
      principalPrefix = getPrincipalPrefix(parsedXml, wsdl_root),
      definitions,
      types,
      schemaContent,
      schemaObject = {},
      utils = new SOAPParametersUtils(),
      schema;

    definitions = parsedXml[principalPrefix + wsdl_root];
    types = definitions[principalPrefix + 'types'];
    schemaContent = getSchemaContentWithoutAttributes(types[`${schemaNamespace.key}:schema`]);
    schemaContent[`@_xmlns:${schemaNamespace.key}`] = schemaNamespace.url;
    schemaObject[`${schemaNamespace.key}:schema`] = schemaContent;
    schema = utils.parseObjectToXML(schemaObject)
      .replace(/tns:/g, '')
      .replace(/\s*<[\w]*:?complexType>\s*<\/[\w]*:?complexType>/g, '');
    return schema;
  }
  catch (error) {
    throw new Error('Can not get schema from object');
  }
}

module.exports = {
  validateOperationMessagesWithSchema,
  getCleanSchema,
  validateMessageWithSchema,
  getBodyMessage,
  unwrapAndCleanBody
};
