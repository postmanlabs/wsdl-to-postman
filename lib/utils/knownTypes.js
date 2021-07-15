const RandExp = require('randexp'),
  DATE_PATTERN = '-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])' +
    '-(0[1-9]|[12][0-9]|3[01])(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?',
  DATE_TIME_PATTERN = '-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])' +
    '-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]' +
    '(\\.[0-9]+)?|(24:00:00(\\.0+)?))(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?',
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
  if (element.enum) {
    return element.enum[0];
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
 * Returns an example of a date
 * @returns {string} the generated example
 */
function getFromDateTime() {
  return new Date().toISOString();
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
 * Determines if the element has a date pattern
 * @param {Element} element the element for getting and example
 * @returns {boolean} if is a date pattern
 */
function isDateTimePattern(element) {
  return element.pattern === DATE_TIME_PATTERN;
}

/**
 * Returns an example of the element information when is string and uses
 * a pattern
 * @param {Element} element the element for getting and example
 * @returns {string} the generated example
 */
function getFromPattern(element) {
  if (isDatePattern(element)) {
    return getFromDate(element);
  }
  if (isDateTimePattern(element)) {
    return getFromDateTime(element);
  }
  return new RandExp(
    element.pattern
  ).gen();
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
  if (element.enum) {
    return element.enum[0];
  }
  minLength = element.minLength ? element.minLength : 0;
  maxLength = element.maxLength ? element.maxLength : STRING_MAXIMUM_LENGTH;
  if (minLength > 0) {
    length = minLength;
  }
  else if (maxLength < STRING_MAXIMUM_LENGTH) {
    length = maxLength;
  }
  else {
    return 'string';
  }
  if (length < 6) {
    baseValue = 's' + new Array(length).join('.');
  }
  else {
    baseValue += new Array(length - 5).join('.');
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

/**
 * Returns whether the value is a correct integer
 * @param {*} value the value to check
 * @param {element} element the element for getting and example
 * @returns {boolean} true or false
 */
function isValidInteger(value, element) {
  const isInteger = !isNaN(value) && Number.isInteger(Number(value));
  if (!isInteger) {
    return false;
  }
  if (element.enum) {
    let foundValue = element.enum.find((currentItem) =>{
      return currentItem === value;
    });
    if (!foundValue) {
      return false;
    }
  }
  if (element.minimum && value < element.minimum) {
    return false;
  }
  if (element.maximum && value > element.maximum) {
    return false;
  }
  return true;
}

/**
 * Returns whether the value is a correct integer
 * @param {*} value the value to check
 * @param {element} element the element for getting and example
 * @returns {boolean} true or false
 */
function isValidNumber(value, element) {
  const isInteger = !isNaN(value);
  if (!isInteger) {
    return false;
  }
  if (element.enum) {
    let foundValue = element.enum.find((currentItem) =>{
      return currentItem === value;
    });
    if (!foundValue) {
      return false;
    }
  }
  if (element.minimum && value < element.minimum) {
    return false;
  }
  if (element.maximum && value > element.maximum) {
    return false;
  }
  return true;
}

/**
 * Returns whether the value is match the pattern
 * @param {string} value the value to check
 * @param {string} pattern the regexp patern
 * @returns {boolean} true or false
 */
function validatePattern(value, pattern) {
  const globalRegex = new RegExp(pattern, 'g');
  return globalRegex.test(value);
}

/**
 * Returns whether the value is match the pattern
 * @param {string} value the value to check
 * @param {string} element the element for getting and example
 * @returns {boolean} true or false
 */
function isValidString(value, element) {
  if (typeof value !== 'string') {
    return false;
  }
  if (element.pattern) {
    return validatePattern(value, element.pattern);
  }
  if (element.enum) {
    let foundValue = element.enum.find((currentItem) => {
      return currentItem === value;
    });
    if (!foundValue) {
      return false;
    }
  }
  if (element.minLength && value.length < element.minLength) {
    return false;
  }
  if (element.maxLength && value.length > element.maxLength) {
    return false;
  }
  return true;
}

/**
 * Returns whether the value is a boolean
 * @param {*} value the value to check
 * @returns {boolean} true or false
 */
function isValidBoolean(value) {
  return value === false || value === true || value === 'true' || value === 'false';
}

/**
 * Returns whether the value is a unsigned number
 * @param {*} value the value to check
 * @param {element} element the element for getting and example
 * @returns {boolean} true or false
 */
function isValidUnsignedNumber(value, element) {
  const isInteger = !isNaN(value);
  if (!isInteger) {
    return false;
  }
  if (value < 0) {
    return false;
  }
  if (element.enum) {
    let foundValue = element.enum.find((currentItem) =>{
      return currentItem === value;
    });
    if (!foundValue) {
      return false;
    }
  }
  if (element.minimum && value < element.minimum) {
    return false;
  }
  if (element.maximum && value > element.maximum) {
    return false;
  }
  return true;
}

/**
 * Returns whether the value is a boolean
 * @param {*} value the value to check
 * @returns {boolean} true or false
 */
function isValidDate(value) {
  return validatePattern(value, DATE_PATTERN);
}

let knownTypes = {
    'integer': { get: getFromNumeric, valid: isValidInteger },
    'number': { get: getFromNumeric, valid: isValidNumber },
    'string': { get: getFromString, valid: isValidString },
    'date': { get: getFromDate, valid: isValidDate },
    'boolean': { get: getFromBoolean, valid: isValidBoolean },
    'decimal': { get: getFromNumeric, valid: isValidNumber },
    'float': { get: getFromNumeric, valid: isValidNumber },
    'double': { get: getFromNumeric, valid: isValidNumber },
    'int': { get: getFromNumeric, valid: isValidInteger },
    'long': { get: getFromNumeric, valid: isValidNumber },
    'short': { get: getFromNumeric, valid: isValidNumber },
    'unsignedInt': { get: getFromNumeric, valid: isValidUnsignedNumber },
    'unsignedLong': { get: getFromNumeric, valid: isValidUnsignedNumber },
    'unsignedShort': { get: getFromNumeric, valid: isValidUnsignedNumber },
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
  let typeFound,
    fun;
  if (!element || !element.type) {
    return knownTypes.default;
  }
  typeFound = knownTypes[element.type];
  if (!typeFound) {
    return knownTypes.default;
  }
  fun = typeFound.get;
  return fun(element);
}

/**
 * return a value example for known types
 * Determine the type and call the function
 * @param {object} value the value to validate against wsdl element
 * @param {element} element the element for getting and example
 * @returns {*} value example
 */
function isValidType(value, element) {
  let typeFound,
    fun;
  if (!element || !element.type) {
    return true;
  }
  typeFound = knownTypes[element.type];
  if (!typeFound) {
    return knownTypes.default;
  }
  fun = typeFound.valid;
  return fun(value, element);
}

module.exports = {
  getValueExample,
  isKnownType,
  knownTypes,
  isValidType
};
