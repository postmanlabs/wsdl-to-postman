const fastXMLParser = require('fast-xml-parser'),
  optionsForFastXMLParser = {
    ignoreAttributes: false,
    ignoreNameSpace: false,
    parseNodeValue: true,
    trimValues: true
  },
  {
    getArrayFrom
  } = require('./utils/objectUtils'),
  SchemaBuilderXSD = require('../lib/utils/SchemaBuilderXSD').SchemaBuilderXSD,
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER = '@_',
  WsdlError = require('./WsdlError'),
  XML_NAMESPACE_DECLARATION = 'xmlns',
  TARGET_NAMESPACE_SPEC = 'targetNamespace',
  XML_NAMESPACE_SEPARATOR = ':',
  SERVICE_TAG = 'service',
  BINDING_TAG = 'binding',
  SCHEMA_TAG = 'schema',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  THIS_NS_PREFIX = 'tns:',
  ATRIBUTE_TYPES = 'types';

/**
 *  converts from string xml into js object
 * @param {string} xmlDocumentContent the binding operation object
 * @returns {object} the parsed object
 */
function parseFromXmlToObject(xmlDocumentContent) {
  if (!xmlDocumentContent) {
    throw new WsdlError('Empty input was proportionated');
  }
  const parsed = fastXMLParser.parse(xmlDocumentContent, optionsForFastXMLParser);
  if (!parsed) {
    throw new WsdlError('Not xml file found in your document');
  }
  return parsed;
}

/**
 * Gets a node (tag) by prefix and name
 * @param {parentNode} parentNode the xml node to search in for tag
 * @param {prefix} prefix prefix e.g. principal for wsdl root and schema prefix for schemas
 * @param {nodeName} nodeName the tag name we are looking for
 * @returns {object} the parsed object
 */
function getNodeByName(parentNode, prefix, nodeName) {
  return parentNode[prefix + nodeName];
}

/**
 * Gets an atribute (attr) by name
 * @param {parentNode} parentNode the xml node to search in for tag
 * @param {attName} attName the attribute name we are looking for
 * @returns {object} the parsed object
 */
function getAttributeByName(parentNode, attName) {
  return parentNode[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + attName];
}


/**
 * Finds the namespace for all the wsdl document
 * creates a namespace object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {NameSpace} the  new NameSpace object
 */
function getPrincipalPrefix(parsedXml, wsdlRoot) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Can not get prefix from undefined or null object');
  }
  let namespace = Object.keys(parsedXml).find((key) => {
    if (key.includes(wsdlRoot)) {
      return true;
    }
  });
  if (namespace === undefined) {
    throw new WsdlError('Can not get prefix from object');
  }
  return namespace.substring(0, namespace.indexOf(XML_NAMESPACE_SEPARATOR) + 1);
}

/**
 * Finds the namespace lookin by url
 * creates a namespace object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} url the url to look for
 * @param {string} wsdlRoot the root tag for the document
 * @returns {NameSpace} the  new NameSpace object
 */
function getNamespaceByURL(parsedXml, url, wsdlRoot) {
  if (!url) {
    throw new WsdlError('URL must not be empty');
  }
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Can not get namespace from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    let namespaceKey = Object.keys(definitions)
      .find((key) => {
        return definitions[key] === url;
      });
    if (namespaceKey) {
      let namespace = namespaceKey.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, '');
      var res = namespace.substring(namespace.indexOf(XML_NAMESPACE_SEPARATOR) + 1, namespace.length);
      return {
        key: res,
        prefixFilter: res + XML_NAMESPACE_SEPARATOR,
        url: url,
        isDefault: res === XML_NAMESPACE_DECLARATION
      };
    }
    return null;
  }
  catch (error) {
    throw new WsdlError('Can not get namespace from object');
  }
}

/**
 * Finds the namespace lookgin by its key
 * creates a namespace object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} key the key to look for
 * @param {string} wsdlRoot the root tag for the document
 * @returns {NameSpace} the  new NameSpace object
 */
function getNamespaceByKey(parsedXml, key, wsdlRoot) {
  if (!key) {
    throw new WsdlError('key must not be empty');
  }
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Can not get namespace from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    let res = getAttributeByName(definitions, key),
      foundKey = key.includes(XML_NAMESPACE_SEPARATOR) ? key.split(XML_NAMESPACE_SEPARATOR)[1] : key;

    return {
      key: foundKey,
      prefixFilter: key + XML_NAMESPACE_SEPARATOR,
      url: res,
      isDefault: key === XML_NAMESPACE_DECLARATION
    };
  }
  catch (error) {
    throw new WsdlError('Can not get namespace from object');
  }
}

/**
 * Finds all the  namespaces of the document
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {[NameSpace]} the new [NameSpace] object
 */
function getAllNamespaces(parsedXml, wsdlRoot) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Can not get namespaces from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    let namespace = Object.keys(definitions)
      .filter(
        (key) => {
          return key.startsWith(PARSER_ATRIBUTE_NAME_PLACE_HOLDER + XML_NAMESPACE_DECLARATION) ||
            key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + TARGET_NAMESPACE_SPEC;
        }
      )
      .map((key) => {
        return getNamespaceByKey(parsedXml, key.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, ''), wsdlRoot);
      });

    return namespace;
  }
  catch (error) {
    throw new WsdlError('Can not get namespaces from object');
  }
}

/**
 * Finds all the services of the document
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {[NameSpace]} the [services] object
 */
function getServices(parsedXml, wsdlRoot) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Can not get services from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    return getArrayFrom(getNodeByName(definitions, principalPrefix, SERVICE_TAG));
  }
  catch (error) {
    throw new WsdlError('Can not get services from object');
  }
}

/**
 * Get the bindngs  of the document
 * always returns an array
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {[object]} the information of the bindings
 */
function getBindings(parsedXml, wsdlRoot) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Can not get bindings from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    return getArrayFrom(getNodeByName(definitions, principalPrefix, BINDING_TAG));
  }
  catch (error) {
    throw new WsdlError('Can not get bindings from object');
  }
}

/**
 * Finds all the elements from the types
 * @param {object} parsedXml the binding operation object
 * @param {string} principalPrefix the wsdl prefix
 * @param {string} wsdlRoot the wsdl root
 * @param {Namespace} schemaNameSpace the schema Namespace
 * @param {Namespace} thisNameSpace the Namespace of tns
 * @returns {[object]} the [elements] object
 */
function getElementsFromWSDL(parsedXml, principalPrefix, wsdlRoot, schemaNameSpace, thisNameSpace) {
  const builder = new SchemaBuilderXSD();
  return builder.getElements(
    parsedXml,
    principalPrefix,
    wsdlRoot,
    schemaNameSpace, thisNameSpace
  );
}

/**
 * Finds the schema namespace, could be on root or
 * defined in the types schema tag
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {[object]} the [elements] object
 */
function getSchemaNamespace(parsedXml, wsdlRoot) {
  let schemaNamespace = getNamespaceByURL(parsedXml, SCHEMA_NS_URL, wsdlRoot);
  if (!schemaNamespace) {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      descriptions = getNodeByName(parsedXml, principalPrefix, wsdlRoot),
      types = getNodeByName(descriptions, principalPrefix, ATRIBUTE_TYPES),
      schemaTag = Object.keys(types).find((key) => {
        if (key.includes(SCHEMA_TAG)) {
          return true;
        }
      }).split(XML_NAMESPACE_SEPARATOR)[0],
      schemaNode = getNodeByName(types, schemaTag, XML_NAMESPACE_SEPARATOR + SCHEMA_TAG),
      nameSpaceURL = getAttributeByName(schemaNode, XML_NAMESPACE_DECLARATION +
        XML_NAMESPACE_SEPARATOR + schemaTag);
    return {
      key: schemaTag,
      prefixFilter: schemaTag + XML_NAMESPACE_SEPARATOR,
      url: nameSpaceURL,
      isDefault: false
    };
  }
  return schemaNamespace;
}

module.exports = {
  parseFromXmlToObject,
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER,
  getPrincipalPrefix,
  getNamespaceByURL,
  getNamespaceByKey,
  getAllNamespaces,
  XML_NAMESPACE_SEPARATOR,
  XML_NAMESPACE_DECLARATION,
  TARGET_NAMESPACE_SPEC,
  getServices,
  getArrayFrom,
  getBindings,
  getElementsFromWSDL,
  getSchemaNamespace,
  getNodeByName,
  getAttributeByName,
  THIS_NS_PREFIX
};
