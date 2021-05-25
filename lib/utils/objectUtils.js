/**
 * if an element is not an array then convert it to an array
 * @param {object} element the element the return as array
 * @returns {[object]} the array of objects
 */
function getArrayFrom(element) {
  if (element && !Array.isArray(element)) {
    return [element];
  }
  return element;
}

/**
 * if an element is not an array then convert it to an array
 * if is empty string also returns array of strings
 * @param {object} element the element the return as array
 * @returns {[object]} the array of elements
 */
function getStringArrayFrom(element) {
  if (element && !Array.isArray(element) || element === '') {
    return [element];
  }
  return element;
}


module.exports = {
  getArrayFrom,
  getStringArrayFrom
};
