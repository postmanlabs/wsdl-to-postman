const fastXMLParser = require('fast-xml-parser'),
  optionsForFastXMLParser = {
    ignoreAttributes: false,
    ignoreNameSpace: false,
    parseNodeValue: true,
    trimValues: true
  },
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER = '@_',
  WsdlError = require('./WsdlError'),
  XML_NAMESPACE_DECLARATION = 'xmlns',
  TARGET_NAMESPACE_SPEC = 'targetNamespace',
  XML_NAMESPACE_SEPARATOR = ':';

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
      definitions = parsedXml[principalPrefix + wsdlRoot];
    let namespaceKey = Object.keys(definitions)
      .find((key) => {
        return definitions[key] === url;
      });
    if (namespaceKey) {
      let namespace = namespaceKey.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, '');
      var res = namespace.substring(namespace.indexOf(XML_NAMESPACE_SEPARATOR) + 1, namespace.length);
      return {
        key: res,
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
      definitions = parsedXml[principalPrefix + wsdlRoot];
    let res = definitions[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + key];

    return {
      key: key.replace(PARSER_ATRIBUTE_NAME_PLACE_HOLDER, ''),
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
      definitions = parsedXml[principalPrefix + wsdlRoot];
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

module.exports = {
  parseFromXmlToObject,
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER,
  getPrincipalPrefix,
  getNamespaceByURL,
  getNamespaceByKey,
  getAllNamespaces
};