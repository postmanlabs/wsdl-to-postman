const IS_COMPLEX = false,
  {
    Element
  } = require('../WSDLObject'),
  {
    ERROR_ELEMENT_IDENTIFIER
  } = require('../constants/processConstants');

/**
 * creates a WSDLObject.Element representing an error
 * @param {string} name the name the element will receive
 * @returns {[object]} the array of objects
 */
function createErrorElement(name) {
  let element = new Element();

  element.children = [];
  element.name = name;
  element.isComplex = IS_COMPLEX;
  element.type = ERROR_ELEMENT_IDENTIFIER;
  return element;
}


module.exports = {
  createErrorElement
};
