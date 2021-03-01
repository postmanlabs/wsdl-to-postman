/**
 * Returns an example of the element information when is an integer
 * @param {Element} element the element for getting and example
 * @returns {boolean} wether is a known type or not
 */
function getFromInteger(element) {
  if (element.minimum) {
    return element.minimum;
  }
  else if (element.maximum) {
    return element.maximum;
  }
  return 1;
}

/**
 * Returns an example of the element information when is a number
 * @param {Element} element the element for getting and example
 * @returns {boolean} wether is a known type or not
 */
function getFromNumber(element) {
  if (element.minimum) {
    return element.minimum;
  }
  else if (element.maximum) {
    return element.maximum;
  }
  return 1;
}

/**
 * Returns an example of the element information when is string
 * @param {Element} element the element for getting and example
 * @returns {boolean} wether is a known type or not
 */
function getFromString(element) {
  return 'this is a string';
}

/**
 * Returns an example of the element information when is boolean
 * @param {Element} element the element for getting and example
 * @returns {boolean} wether is a known type or not
 */
function getFromBoolean(element) {
  return true;
}

const knownTypes = {
    'integer': getFromInteger,
    'number': getFromNumber,
    'string': getFromString,
    'date': 'date',
    'boolean': getFromBoolean,
    'default': 'default value'
  },
  XML_NAMESPACE_SEPARATOR = ':';

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

/**
 * return a value example for known types
 * Determine the type and call the function
 * @param {element} element the element for getting and example
 * @returns {*} value example
 */
function getValueExample(element) {
  if (!element || !element.type) {
    return knownTypes.default;
  }
  let fun = knownTypes[element.type];
  if (!fun) {
    fun = knownTypes.default;
  }
  return fun(element);
}

module.exports = {
  getValueExample,
  isKnownType,
  knownTypes
};
