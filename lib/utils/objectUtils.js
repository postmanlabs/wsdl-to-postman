const clone = require('clone');

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
 * if an element is not an array or is empty then convert it to an array
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


/**
 * Gets a shallow copy on an element in a new object
 * @param {Element} element the element to copy
 * @return {Element} a copy of the element
 */
function getShallowCopyOfObject(element) {
  let newElement = {
    ...element
  };
  return newElement;
}

/**
 * Gets a deep copy on an element in a new object
 * @param {Element} element the element to copy
 * @return {Element} a copy of the element
 */
function getDeepCopyOfObject(element) {
  // let parsedClone = JSON.parse(JSON.stringify(element));
  let clonedclone = clone(element);
  return clonedclone;
}

module.exports = {
  getArrayFrom,
  getStringArrayFrom,
  getShallowCopyOfObject,
  getDeepCopyOfObject
};
