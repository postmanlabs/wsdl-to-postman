const RandExp = require('randexp'),
  DATE_PATTERN = '-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])' +
    '-(0[1-9]|[12][0-9]|3[01])(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?',
  NUMERIC_MINIMUM_RANDOM = 2,
  NUMERIC_MAXIMUM_RANDOM = 100,
  NUMERIC_MAXIMUM = 18446744073709,
  STRING_MAXIMUM_LENGTH = 500;

/**
 * Returns an example of the element information when is numeric
 * @param {Element} element the element for getting and example
 * @returns {number} example value
 */
function getFromNumeric(element) {
  if (element.enumValues) {
    return element.enumValues[0];
  }
  let minimum = NUMERIC_MINIMUM_RANDOM,
    maximum = NUMERIC_MAXIMUM_RANDOM;

  if (element.minimum) {
    if (element.minimum < NUMERIC_MAXIMUM_RANDOM) {
      if (element.minimum > NUMERIC_MINIMUM_RANDOM) {
        minimum = element.minimum;
      }
    }
    else {
      minimum = element.minimum;
      maximum = element.minimum;
    }
  }

  if (element.maximum) {
    if (element.maximum < NUMERIC_MINIMUM_RANDOM) {
      maximum = element.maximum;
    }
    else if (element.maximum > NUMERIC_MAXIMUM_RANDOM) {
      if (minimum < NUMERIC_MAXIMUM_RANDOM) {
        minimum = NUMERIC_MAXIMUM_RANDOM;
      }
      else {
        maximum = element.maximum;
      }
    }
    else {
      maximum = element.maximum;
    }
  }
  maximum = minimum > maximum ? NUMERIC_MAXIMUM : maximum;
  return Math.floor(Math.random() * (maximum - minimum) + minimum);
}

/**
 * Returns an example of a date
 * @returns {string} the generated example
 */
function getFromDate() {
  let today = new Date();
  return `${today.toISOString().split('T')[0]}Z`;
}

/**
 * Determines if the element has a date pattern
 * @param {Element} element the element for getting and example
 * @returns {boolean} if is a date pattern
 */
function isDatePattern(element) {
  return element.pattern === DATE_PATTERN;
}

/**
 * Returns an example of the element information when is string and uses
 * a pattern
 * @param {Element} element the element for getting and example
 * @returns {string} the generated example
 */
function getFromPattern(element) {
  let result = isDatePattern(element) ? getFromDate(element) :
    new RandExp(
      element.pattern
    ).gen();
  return result;
}

/**
 * Returns an example of the element information when is string
 * @param {Element} element the element for getting and example
 * @returns {string} the generated example
 */
function getFromString(element) {
  let baseValue = 'string',
    length,
    minLength,
    maxLength;
  if (element.pattern) {
    return getFromPattern(element);
  }
  if (element.enumValues) {
    return element.enumValues[0];
  }
  minLength = element.minLength ? element.minLength : 0;
  maxLength = element.maxLength ? element.maxLength : STRING_MAXIMUM_LENGTH;
  if (minLength > 0) {
    length = minLength;
  }
  else if (maxLength < STRING_MAXIMUM_LENGTH) {
    length = maxLength + 1;
  }
  else {
    return 'string';
  }
  if (length < 6) {
    baseValue = 's' + new Array(length).join('.');
  }
  else {
    baseValue += new Array(length - 6).join('.');
  }
  return baseValue;
}

/**
 * Returns an example of the element information when is boolean
 * @param {Element} element the element for getting and example
 * @returns {boolean} wether is a known type or not
 */
function getFromBoolean() {
  return true;
}

let knownTypes = {
    'integer': getFromNumeric,
    'number': getFromNumeric,
    'string': getFromString,
    'date': getFromDate,
    'boolean': getFromBoolean,
    'decimal': getFromNumeric,
    'float': getFromNumeric,
    'double': getFromNumeric,
    'int': getFromNumeric,
    'long': getFromNumeric,
    'short': getFromNumeric,
    'unsignedInt': getFromNumeric,
    'unsignedLong': getFromNumeric,
    'unsignedShort': getFromNumeric,
    'default': 'default value'
  },
  XML_NAMESPACE_SEPARATOR = ':';

/**
 * Determines if the type is a known type (scalar xsd types)
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
    return knownTypes.default;
  }
  return fun(element);
}

module.exports = {
  getValueExample,
  isKnownType,
  knownTypes
};
