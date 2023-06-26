const IS_COMPLEX = false,
  {
    Element
  } = require('../WSDLObject'),
  {
    ERROR_ELEMENT_IDENTIFIER,
    EMPTY_ELEMENT_BY_DEFAULT
  } = require('../constants/processConstants');

/**
 * creates a WSDLObject.Element representing an error
 * @param {object} property the property object with error
 * @param {string} name the name the element will receive
 * @returns {[object]} the array of objects
 */
function createErrorElement(property, name) {
  let element = new Element();

  element.children = [];
  element.name = name;
  element.isComplex = IS_COMPLEX;
  element.type = ERROR_ELEMENT_IDENTIFIER;
  element.originalType = property.complexName ? property.complexName.split('/').reverse()[0] : undefined;
  return element;
}

/**
 * creates a WSDLObject.Element representing an error
 * @param {string} name the name the element will receive
 * @returns {[object]} the array of objects
 */
function createEmptyElement(name) {
  let element = new Element();
  element.children = [];
  element.name = name;
  element.isComplex = IS_COMPLEX;
  element.type = EMPTY_ELEMENT_BY_DEFAULT;
  element.originalType = name;
  return element;
}

/**
 * Generates element name with prefix based on `attributeFormDefault` and `elementFormDefault` attributes
 * for the provided element.
 * `attributeFormDefault` and `elementFormDefault` are inherited from the parent schema of corresponding element
 *
 * @param {object} element WSDL element from which the name is to be generated
 * @returns {string} Generated element name with prefix
 */
function generatePrefixedElementName (element) {
  let elementName = element.name,
    prefixedElementName = elementName;

  if (typeof elementName !== 'string') {
    return '';
  }

  if (elementName.startsWith(element.nsPrefix + ':') || elementName.startsWith('@' + element.nsPrefix + ':') ||
    !element.nsPrefix) {
    return elementName;
  }

  if (elementName.startsWith('@') && element.attributeFormDefault) {
    prefixedElementName = '@' + element.nsPrefix + ':' + elementName.slice(1);
  }
  else if (!elementName.startsWith('@') && element.elementFormDefault) {
    prefixedElementName = element.nsPrefix + ':' + elementName;
  }

  return prefixedElementName;
}


module.exports = {
  createErrorElement,
  createEmptyElement,
  generatePrefixedElementName
};
