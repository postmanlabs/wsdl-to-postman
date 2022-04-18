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


module.exports = {
  createErrorElement,
  createEmptyElement
};
