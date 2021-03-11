const XML_NAMESPACE_SEPARATOR = ':';

/**
 * Gets a node (tag) by prefix and name
 * @param {parentNode} parentNode the xml node to search in for tag
 * @param {prefix} prefix prefix e.g. principal for wsdl root and schema prefix for schemas
 * @param {nodeName} nodeName the tag name we are looking for
 * @returns {object} the parsed object
 */
function getXMLNodeByName(parentNode, prefix, nodeName) {
  return parentNode[prefix + nodeName];
}

/**
 * Gets an atribute (attr) by name
 * @param {parentNode} parentNode the xml node to search in for tag
 * @param {atributeFilter} atributeFilter the attribute prefix for the parser
 * @param {attName} attName the attribute name we are looking for
 * @returns {object} the parsed object
 */
function getXMLAttributeByName(parentNode, atributeFilter, attName) {
  return parentNode[atributeFilter + attName];
}

/**
 * Gets the prefix of the qualified name
 * @param {string} qName the qName to get the prefix from
 * @returns {string} the prefix
 */
function getQNamePrefix(qName) {
  let i = qName.indexOf(XML_NAMESPACE_SEPARATOR),
    qualName = i < 0 ? ['', qName] : qName.split(XML_NAMESPACE_SEPARATOR);
  return qualName[0];
}

/**
 * Gets the local of the qualified name
 * @param {string} qName the qName to get the local from
 * @returns {string} the local
 */
function getQNameLocal(qName) {
  let i = qName.indexOf(XML_NAMESPACE_SEPARATOR),
    qualName = i < 0 ? ['', qName] : qName.split(XML_NAMESPACE_SEPARATOR);
  return qualName[1];
}

/**
 * Gets prefix filter of the qname
 * @param {string} qName the qName to get the local from
 * @returns {string} the prefix filter
 */
function getQNamePrefixFilter(qName) {
  return qName.substring(0, qName.indexOf(XML_NAMESPACE_SEPARATOR) + 1);
}

module.exports = {
  getXMLNodeByName,
  getXMLAttributeByName,
  getQNamePrefix,
  getQNameLocal,
  getQNamePrefixFilter,
  XML_NAMESPACE_SEPARATOR
};
