const {
    SecurityAssertionsHelper
  } = require('./security/SecurityAssertionsHelper'),
  {
    getArrayFrom,
    getStringArrayFrom
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
  IMPORT_TAG = 'import',
  ATTRIBUTE_NAMESPACE = 'namespace',
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
 * Gets a node (tag) by prefix and name
 * @param {parentNode} parentNode the xml node to search in for tag
 * @param {nodeName} nodeName the tag name we are looking for
 * @returns {object} the parsed object
 */
function getNodeByQNameLocal(parentNode, nodeName) {

  let key = Object.keys(parentNode).find((key) => {
    if (key.includes(':')) {
      let localName = getQNameLocal(key);
      return nodeName === localName;
    }
    return key === nodeName;
  });

  return parentNode[key];
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
 * @param {string} tnsDefinitionURL targetnamespace url
 * @returns {NameSpace} the generated NameSpace
 */
function buildNamespace(isDefault, key, prefixFilter, url, tnsDefinitionURL) {
  let namespace = new NameSpace();
  namespace.isDefault = isDefault;
  namespace.key = key;
  namespace.prefixFilter = prefixFilter;
  namespace.url = url;
  namespace.tnsDefinitionURL = tnsDefinitionURL;
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
 * @param {Namespace} wsdlObject the wsdl memory parsed object
 * @returns {Array} the [elements] object
 */
function getElementsFromWSDL(parsedXml, principalPrefix, wsdlRoot, wsdlObject) {
  const builder = new SchemaBuilderXSD();
  return builder.getElements(
    parsedXml,
    principalPrefix,
    wsdlRoot,
    wsdlObject,
    PARSER_ATTRIBUTE_NAME_PLACE_HOLDER
  );
}

/**
 * Finds the schema namespace from the definitio of types
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @param {string} principalPrefix the principal prefix
 * @param {string} globalSchemaNamespace documents schema namespace globally declared
 * @returns {Array} the [elements] object
 */
function getSchemaNamespacesFromTypesDefinitions(parsedXml, wsdlRoot, principalPrefix, globalSchemaNamespace) {
  let localSchemaNamespaces = [];
  const descriptions = getNodeByName(parsedXml, principalPrefix, wsdlRoot),
    types = getArrayFrom(getNodeByName(descriptions, principalPrefix, ATTRIBUTE_TYPES));
  if (!types) {
    return localSchemaNamespaces;
  }

  types.forEach((type) => {
    let schemaPrefixes = getStringArrayFrom(Object.keys(type).filter((key) => {
      if (key.includes(SCHEMA_TAG)) {
        return true;
      }
    }).map((schemaTag) => {
      return getQNamePrefix(schemaTag);
    }));
    schemaPrefixes.forEach((schemaTag) => {
      let schemaNode = getNodeByName(type, schemaTag,
        schemaTag === '' ? SCHEMA_TAG : XML_NAMESPACE_SEPARATOR + SCHEMA_TAG);
      if (schemaNode) {
        let urlAtribute,
          targetNamespace,
          prefixFilter;
        urlAtribute = schemaTag === '' ? schemaTag : XML_NAMESPACE_SEPARATOR + schemaTag;
        nameSpaceURL = getAttributeByName(schemaNode, XML_NAMESPACE_DECLARATION +
          urlAtribute);
        targetNamespace = getAttributeByName(schemaNode,
          TARGET_NAMESPACE_SPEC);
        prefixFilter = schemaTag === '' ? '' : schemaTag + XML_NAMESPACE_SEPARATOR;
        if (globalSchemaNamespace && globalSchemaNamespace.prefixFilter !== prefixFilter ||
          !globalSchemaNamespace) {
          localSchemaNamespaces.push(buildNamespace(false, schemaTag, prefixFilter, nameSpaceURL, targetNamespace));
        }
      }
    });
  });
  return localSchemaNamespaces;
}

/**
 * Finds the schema namespace, could be on root or
 * defined in the types schema tag
 * creates a namespace array object with the found information
 * @param {object} parsedXml the binding operation object
 * @param {string} wsdlRoot the root tag for the document
 * @param {object} tnsNamespace this namespace from wsdl
 * @returns {Array} the [elements] object
 */
function getSchemaNamespace(parsedXml, wsdlRoot, tnsNamespace) {
  const principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot);
  let globalSchemaNamespace,
    localSchemaNamespaces;
  globalSchemaNamespace = getNamespaceByURL(parsedXml, SCHEMA_NS_URL, wsdlRoot);
  if (globalSchemaNamespace) {
    globalSchemaNamespace.tnsDefinitionURL = tnsNamespace.url;
  }
  localSchemaNamespaces = getSchemaNamespacesFromTypesDefinitions(parsedXml, wsdlRoot, principalPrefix,
    globalSchemaNamespace);
  if (!globalSchemaNamespace) {
    globalSchemaNamespace = localSchemaNamespaces[0];
  }
  return { globalSchemaNamespace, localSchemaNamespaces };
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

/**
 *  Gets the service documentation if is a node or a string
 *  if not found any returns empty string
 * @param {object} service the service from the wsdl
 * @param {string} principalPrefix principal document prefix
 * @returns {string} service from documentation
 */
function getServiceDocumentation(service, principalPrefix) {
  if (!service || typeof service !== 'object') {
    return '';
  }
  try {
    let documentation = getNodeByName(service, principalPrefix, DOCUMENTATION_TAG);
    return documentation ? getDocumentationStringFromNode(documentation) : '';
  }
  catch (error) {
    throw new WsdlError('Cannot get documentation from object');
  }
}

/**
 * Removes xml separator from string
 * @param {string} elementName the root tag for the document to remove xml ns separator
 * @returns {string} the elementName without ":"
 */
function excludeSeparatorFromName(elementName) {
  return elementName ? elementName.split(XML_NAMESPACE_SEPARATOR).reverse()[0] : elementName;
}

/**
 * Gets the import nodes from a parsed wsdl from root or schema
 * @param {object} xmlParsed the parsed document
 * @param {string} principalPrefix principal prefix of the document
 * @param {string} wsdlRoot the root tag for the document to remove xml ns separator
 * @returns {Array} all the import nodes
 */
function getWSDLImports(xmlParsed, principalPrefix, wsdlRoot) {
  let types,
    globalImports = [];

  if (getNodeByName(xmlParsed[principalPrefix + wsdlRoot], principalPrefix, IMPORT_TAG)) {
    globalImports.push(xmlParsed[principalPrefix + wsdlRoot][IMPORT_TAG]);
  }
  types = getArrayFrom(getNodeByName(xmlParsed[principalPrefix + wsdlRoot], principalPrefix, ATTRIBUTE_TYPES));
  if (types && types.length > 0) {
    types.forEach((type) => {
      let schemaProperties = Object.keys(type).filter((propertyName) => {
        return propertyName.includes(SCHEMA_TAG);
      });
      if (schemaProperties && schemaProperties.length > 0) {
        let schemas = schemaProperties.map((schemaProperty) => {
          return type[schemaProperty];
        });
        schemas.filter((schema) => {
          let importProperties = Object.keys(schema).filter((propertyName) => {
            return propertyName.includes(IMPORT_TAG);
          });
          if (importProperties) {
            let imports = getArrayFrom(schema[importProperties]);
            if (imports && importProperties.length > 0) {
              globalImports = globalImports.concat(imports);
            }
            return schema[importProperties];
          }
        });
      }
    });
  }
  return globalImports;
}

/**
 * returns if document has import nodes in root or schema
 * @param {object} xmlParsed the parsed document
 * @param {string} principalPrefix principal prefix of the document
 * @param {string} wsdlRoot the root tag for the document to remove xml ns separator
 * @returns {boolean} if the document has imports
 */
function wsdlHasImports(xmlParsed, principalPrefix, wsdlRoot) {
  return getWSDLImports(xmlParsed, principalPrefix, wsdlRoot).length > 0;
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
  SERVICE_TAG,
  IMPORT_TAG,
  SCHEMA_TAG,
  ATTRIBUTE_TYPES,
  ATTRIBUTE_NAMESPACE,
  SCHEMA_NS_URL,
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
  getWSDLDocumentation,
  excludeSeparatorFromName,
  getWSDLImports,
  wsdlHasImports,
  getNodeByQNameLocal,
  getServiceDocumentation
};
