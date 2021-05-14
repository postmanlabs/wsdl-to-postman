const {
    SecurityAssertionsHelper
  } = require('./security/SecurityAssertionsHelper'),
  {
    getArrayFrom
  } = require('./utils/objectUtils'),
  {
    removeLineBreak
  } = require('./utils/textUtils'),
  SchemaBuilderXSD = require('../lib/utils/SchemaBuilderXSD').SchemaBuilderXSD,
  PARSER_ATTRIBUTE_NAME_PLACE_HOLDER = '@_',
  WsdlError = require('./WsdlError'),
  {
    NameSpace
  } = require('./WSDLObject'),
  XML_NAMESPACE_DECLARATION = 'xmlns',
  TARGET_NAMESPACE_SPEC = 'targetNamespace',
  SERVICE_TAG = 'service',
  DOCUMENTATION_TAG = 'documentation',
  BINDING_TAG = 'binding',
  SCHEMA_TAG = 'schema',
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema',
  THIS_NS_PREFIX = 'tns:',
  ATTRIBUTE_TYPES = 'types',
  OPERATION_TAG = 'operation',
  {
    DOC_HAS_NO_BINDINGS_MESSAGE,
    DOC_HAS_NO_BINDINGS_OPERATIONS_MESSAGE
  } = require('./constants/messageConstants'),
  {
    getXMLNodeByName,
    getXMLAttributeByName,
    XML_NAMESPACE_SEPARATOR,
    getQNamePrefixFilter,
    getQNameLocal,
    getQNamePrefix
  } = require('./utils/XMLParsedUtils');

/**
 * Gets a node (tag) by prefix and name
 * @param {parentNode} parentNode the xml node to search in for tag
 * @param {prefix} prefix prefix e.g. principal for wsdl root and schema prefix for schemas
 * @param {nodeName} nodeName the tag name we are looking for
 * @returns {object} the parsed object
 */
function getNodeByName(parentNode, prefix, nodeName) {
  return getXMLNodeByName(parentNode, prefix, nodeName);
}

/**
 * Gets an ATTRIBUTE (attr) by name
 * @param {parentNode} parentNode the xml node to search in for tag
 * @param {attName} attName the attribute name we are looking for
 * @returns {object} the parsed object
 */
function getAttributeByName(parentNode, attName) {
  return getXMLAttributeByName(parentNode, PARSER_ATTRIBUTE_NAME_PLACE_HOLDER, attName);
}


/**
 * Get the bindngs operations of the document
 * always returns an array
 * @param {boolean} isDefault if is the default namespace
 * @param {string} key the namespace qname
 * @param {string} prefixFilter qname plus :
 * @param {string} url namespace url
 * @returns {NameSpace} the generated NameSpace
 */
function buildNamespace(isDefault, key, prefixFilter, url) {
  let namespace = new NameSpace();
  namespace.isDefault = isDefault;
  namespace.key = key;
  namespace.prefixFilter = prefixFilter;
  namespace.url = url;
  return namespace;
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
    throw new WsdlError('Cannot get prefix from undefined or null object');
  }
  let namespace = Object.keys(parsedXml).find((key) => {
    if (key.includes(wsdlRoot)) {
      return true;
    }
  });
  if (namespace === undefined) {
    throw new WsdlError('Cannot get prefix from object');
  }
  return getQNamePrefixFilter(namespace);
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
    throw new WsdlError('Cannot get namespace from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    let namespaceKey = Object.keys(definitions)
      .find((key) => {
        return definitions[key] === url;
      });
    if (namespaceKey) {
      let namespace = namespaceKey.replace(PARSER_ATTRIBUTE_NAME_PLACE_HOLDER, ''),
        res = getQNameLocal(namespace);
      return buildNamespace(res === XML_NAMESPACE_DECLARATION, res, res + XML_NAMESPACE_SEPARATOR, url);
    }
    return null;
  }
  catch (error) {
    throw new WsdlError('Cannot get namespace from object');
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
    throw new WsdlError('Cannot get namespace from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    let res = getAttributeByName(definitions, key),
      foundKey = getQNameLocal(key);
    return buildNamespace(key === XML_NAMESPACE_DECLARATION, foundKey, key + XML_NAMESPACE_SEPARATOR, res);
  }
  catch (error) {
    throw new WsdlError('Cannot get namespace from object');
  }
}

/**
 * Finds all the  namespaces of the document
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {Array} the new [NameSpace] object
 */
function getAllNamespaces(parsedXml, wsdlRoot) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Cannot get namespaces from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    let namespace = Object.keys(definitions)
      .filter(
        (key) => {
          return key.startsWith(PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + XML_NAMESPACE_DECLARATION) ||
            key === PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + TARGET_NAMESPACE_SPEC;
        }
      )
      .map((key) => {
        return getNamespaceByKey(parsedXml, key.replace(PARSER_ATTRIBUTE_NAME_PLACE_HOLDER, ''), wsdlRoot);
      });

    return namespace;
  }
  catch (error) {
    throw new WsdlError('Cannot get namespaces from object');
  }
}

/**
 * Finds all the services of the document
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {Array} the [services] object
 */
function getServices(parsedXml, wsdlRoot) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Cannot get services from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    return getArrayFrom(getNodeByName(definitions, principalPrefix, SERVICE_TAG));
  }
  catch (error) {
    throw new WsdlError('Cannot get services from object');
  }
}

/**
 * Get the bindngs  of the document
 * always returns an array
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @param {WSDLObject} wsdlObject the object we are building
 * @returns {Array} the information of the bindings
 */
function getBindings(parsedXml, wsdlRoot, wsdlObject) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Cannot get bindings from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot),
      bindings = getArrayFrom(getNodeByName(definitions, principalPrefix, BINDING_TAG));
    if (!bindings) {
      wsdlObject.log.logError(DOC_HAS_NO_BINDINGS_MESSAGE);
      return [];
    }
    return bindings;
  }
  catch (error) {
    throw new WsdlError('Cannot get bindings from object');
  }
}

/**
 * Finds all the elements from the types
 * @param {object} parsedXml the binding operation object
 * @param {string} principalPrefix the wsdl prefix
 * @param {string} wsdlRoot the wsdl root
 * @param {Namespace} schemaNameSpace the schema Namespace
 * @param {Namespace} thisNameSpace the Namespace of tns
 * @returns {Array} the [elements] object
 */
function getElementsFromWSDL(parsedXml, principalPrefix, wsdlRoot, schemaNameSpace, thisNameSpace) {
  const builder = new SchemaBuilderXSD();
  return builder.getElements(
    parsedXml,
    principalPrefix,
    wsdlRoot,
    schemaNameSpace,
    thisNameSpace,
    PARSER_ATTRIBUTE_NAME_PLACE_HOLDER
  );
}

/**
 * Finds the schema namespace, could be on root or
 * defined in the types schema tag
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {Array} the [elements] object
 */
function getSchemaNamespace(parsedXml, wsdlRoot) {
  let schemaNamespace = getNamespaceByURL(parsedXml, SCHEMA_NS_URL, wsdlRoot);
  if (!schemaNamespace) {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      descriptions = getNodeByName(parsedXml, principalPrefix, wsdlRoot),
      types = getNodeByName(descriptions, principalPrefix, ATTRIBUTE_TYPES);
    if (!types) {
      return schemaNamespace;
    }
    let schemaTag = getQNamePrefix(Object.keys(types).find((key) => {
        if (key.includes(SCHEMA_TAG)) {
          return true;
        }
      })),

      schemaNode = getNodeByName(types, schemaTag, XML_NAMESPACE_SEPARATOR + SCHEMA_TAG),
      nameSpaceURL = getAttributeByName(schemaNode, XML_NAMESPACE_DECLARATION +
        XML_NAMESPACE_SEPARATOR + schemaTag);
    return buildNamespace(false, schemaTag, schemaTag + XML_NAMESPACE_SEPARATOR, nameSpaceURL);
  }
  return schemaNamespace;
}


/**
 * Get the bindngs operations of the document
 * always returns an array
 * @param {object} binding the binding operation object
 * @param {object} principalPrefix the principal prefix
 * @param {object} wsdlObject wsdl object we are building
 * @returns {Array} the information of the operation bindings
 */
function getBindingOperation(binding, principalPrefix, wsdlObject) {
  if (!binding || typeof binding !== 'object') {
    throw new WsdlError('Cannot get operations from undefined or null object');
  }
  try {
    const operations = getArrayFrom(getNodeByName(binding, principalPrefix, OPERATION_TAG));
    if (!operations) {
      wsdlObject.log.logError(DOC_HAS_NO_BINDINGS_OPERATIONS_MESSAGE);
      return [];
    }
    return operations;
  }
  catch (error) {
    throw new WsdlError('Cannot get binding operations from object');
  }
}

/**
 * Get security content from parsedXml
 * @param {string} parsedXml Parsed xml document content
 * @param {*} securityNS Namespace for security data in document
 * @param {*} wsdlRoot Wsdl document root tag
 * @returns {Array} Security policies in document
 */
function getSecurity(parsedXml, securityNS, wsdlRoot) {
  if (!securityNS) {
    return undefined;
  }
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Cannot get security from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    return getArrayFrom(getNodeByName(definitions, securityNS.prefixFilter, 'Policy'));
  }
  catch (error) {
    throw new WsdlError('Cannot get security from object');
  }
}

/**
 * Returns a wsdlObject with security data added
 * @param {object} wsdlObject wsdlObject
 * @param {*} parsedXml Parsed xml document content
 * @param {*} wsdlRoot Wsdl root tag
 * @returns {object} New wsdlObject with security data
 */
function assignSecurity(wsdlObject, parsedXml, wsdlRoot) {
  let newWsdlObject = {
    ...wsdlObject
  };
  const helper = new SecurityAssertionsHelper(),
    securityContent = getSecurity(parsedXml, wsdlObject.securityPolicyNamespace, wsdlRoot),
    securityAssertions = helper.getSecurityAssertions(securityContent, wsdlObject.securityPolicyNamespace);
  newWsdlObject.securityPolicyArray = securityAssertions;
  return newWsdlObject;
}

/**
 * if the element is a object then the parser populated
 * the propety #text then the node is the string
 * also replaces tabs and new lines from the string
 * @param {*} node the element the return as array
 * @returns {string} the documentation
 */
function getDocumentationStringFromNode(node) {
  if (typeof node === 'object') {
    return removeLineBreak(node['#text']);
  }
  return removeLineBreak(node);
}

/**
 * Finds all the services of the document
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @returns {Array} the [services] object
 */
function getWSDLDocumentation(parsedXml, wsdlRoot) {
  if (!parsedXml || typeof parsedXml !== 'object') {
    throw new WsdlError('Cannot get documentation from undefined or null object');
  }
  try {
    const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
      definitions = getNodeByName(parsedXml, principalPrefix, wsdlRoot);
    let documentation = getNodeByName(definitions, principalPrefix, DOCUMENTATION_TAG);
    return documentation ? getDocumentationStringFromNode(documentation) : '';
  }
  catch (error) {
    throw new WsdlError('Cannot get documentation from object');
  }
}

module.exports = {
  PARSER_ATTRIBUTE_NAME_PLACE_HOLDER,
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
  THIS_NS_PREFIX,
  getBindingOperation,
  assignSecurity,
  getSecurity,
  getDocumentationStringFromNode,
  getWSDLDocumentation
};
