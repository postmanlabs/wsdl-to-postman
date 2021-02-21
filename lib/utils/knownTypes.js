const knownTypes = {
    'unsignedLong': 500,
    'int': 1,
    'decimal': 500,
    'string': 'this is a string',
    'default': 'default value'
  },
  XML_NAMESPACE_SEPARATOR = ':';


/**
 * return a value example for known types
 * @param {string} type the string name of the type
 * @returns {*} value example
 */
function getValueExample(type) {
  return (knownTypes[type] || knownTypes.default);
}

/**
 * Determines if the type is a known type
 * @param {object} type the string name of the type
 * @returns {boolean} wether is a known type or not
 */
function isKnownType(type) {
  return Object.keys(knownTypes).includes(type.split(XML_NAMESPACE_SEPARATOR)[1]);
}

module.exports = {
  getValueExample,
  isKnownType,
  knownTypes
};
