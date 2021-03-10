const {
  Element
} = require('../WSDLObject'), {
  ERROR_ELEMENT_IDENTIFIER
} = require('../constants/processConstants');

/**
 * if an element is not an array then convert it to an array
 * @param {object} element the element the return as array
 * @returns {[object]} the array of objects
 */
function createErrorElement(name) {
  let element = new Element();

  element.children = [];
  element.name = name;
  element.isComplex = false;
  element.type = ERROR_ELEMENT_IDENTIFIER;
  return element;
}


module.exports = {
  createErrorElement
};
