const traverseUtility = require('traverse');

/**
 *
 * @description pushes the element in the rigth position
 * next to the last dependency
 *
 * @param {Array} arrayOfDependants array of elements
 * @param {object} element the element to push in array
 * @returns {undefined} nothing
 */
pushDependantInOrder = ({
  arrayOfDependants,
  element
}) => {
  let dependencyArray = [...element.dependencies],
    lastIndex = -1;
  for (i = 0; i < arrayOfDependants.length; i++) {
    if (dependencyArray.includes(arrayOfDependants[i].name)) {
      lastIndex = i;
    }
  }
  if (lastIndex === -1) {
    arrayOfDependants.unshift(element);
  }
  else {
    arrayOfDependants.splice(2, lastIndex + 1, element);
  }
};

/**
 *
 * @description takes an array of schema elements
 * from xsd2json and orders them
 * the independant first and the dependant later
 *
 * @param {Array} schemaItemsToOrder array of elements from the xsd2json
 * @returns {string} validation
 */
orderElementsAccordingToDependencies = (schemaItemsToOrder) => {
  let independent = [],
    dependent = [];
  schemaItemsToOrder.forEach((element) => {
    let isDependant = false;
    element.dependencies = new Set();
    traverseUtility(element).forEach(function (property) {
      if (property) {
        hasRef = Object.keys(property)
          .find(
            (key) => {
              return key === '$ref';
            }
          );
        if (hasRef) {
          element.dependencies.add(property.$ref);
          isDependant = true;
        }
      }
    });
    if (!isDependant) {
      independent.push(element);
    }
    else {
      pushDependantInOrder({
        arrayOfDependants: dependent,
        element: element
      });
    }

  });
  return independent.concat(dependent);
};

module.exports = {
  orderElementsAccordingToDependencies
};
