const knownTypes = {
    'unsignedLong': 500,
    'int': 1,
    'integer': 1,
    'decimal': 500,
    'number': 500,
    'double': 500.1,
    'string': 'this is a string',
    'date': 'date',
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
  if (!type) {
    return false;
  }
  let filterType = type.includes(XML_NAMESPACE_SEPARATOR) ? type.split(XML_NAMESPACE_SEPARATOR)[1] : type;
  return Object.keys(knownTypes).includes(filterType);
}

module.exports = {
  getValueExample,
  isKnownType,
  knownTypes
};
