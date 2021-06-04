const traverseUtility = require('traverse');

/**
 *
 * @description pushes the element in the rigth position
 * next to the last dependency
 *
 * @param {Array} arrayOfDependents array of elements
 * @param {object} element the element to push in array
 * @returns {undefined} nothing
 */
pushDependentInOrder = ({
  arrayOfDependents,
  element
}) => {
  let dependencyArray = [...element.dependencies],
    lastIndex = -1;
  for (i = 0; i < arrayOfDependents.length; i++) {
    if (dependencyArray.includes(arrayOfDependents[i].name)) {
      lastIndex = i;
    }
  }
  if (lastIndex === -1) {
    arrayOfDependents.unshift(element);
  }
  else {
    arrayOfDependents.splice(2, lastIndex + 1, element);
  }
};

/**
 *
 * @description takes an array of schema elements
 * from xsd2json and orders them
 * the independent first and the dependent later
 *
 * @param {Array} schemaItemsToOrder array of elements from the xsd2json
 * @returns {string} validation
 */
orderElementsAccordingToDependencies = (schemaItemsToOrder) => {
  let independent = [],
    dependent = [];
  schemaItemsToOrder.forEach((element) => {
    let isDependent = false;
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
          isDependent = true;
        }
      }
    });
    if (!isDependent) {
      independent.push(element);
    }
    else {
      pushDependentInOrder({
        arrayOfDependents: dependent,
        element: element
      });
    }

  });
  return independent.concat(dependent);
};

module.exports = {
  orderElementsAccordingToDependencies
};
