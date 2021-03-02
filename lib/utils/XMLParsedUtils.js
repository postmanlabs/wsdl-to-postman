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


module.exports = {
  getXMLNodeByName,
  getXMLAttributeByName
};
