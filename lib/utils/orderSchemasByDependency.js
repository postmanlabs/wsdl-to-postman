const { Namespace } = require('libxmljs');
const traverseUtility = require('traverse');
const { getArrayFrom } = require('./objectUtils');
const { getXMLNodeByName, getXMLAttributeByName } = require('./XMLParsedUtils');

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

orderSchemasAccordingToDependencies2 = (schemaItemsToOrder) => {
  return schemaItemsToOrder
}

/**
 *
 * @description takes an array of schema elements
 * from xsd2json and orders them
 * the independant first and the dependant later
 *
 * @param {Array} schemasToOrder array of elements from the xsd2json
 * @returns {string} validation
 */
orderSchemasAccordingToDependencies = (schemasToOrderInformation) => {
  let independent = [],
    dependent = [];
  schemasToOrderInformation.forEach((schemaAndInformation) => {
    let isDependant = false;
    schema = schemaAndInformation.foundSchemaTag,
      namespace = schemaAndInformation.foundLocalSchemaNamespace,
      schemaAndInformation.dependencies = new Set();

    let imports = getArrayFrom(getXMLNodeByName(schema, namespace.prefixFilter, 'import'))

    if (imports && imports.length > 0) {

      imports.forEach((importElement) => {
        schemaAndInformation.dependencies.add(
          getXMLAttributeByName(importElement, '@_', 'namespace'));

      })
      isDependant = true;
    }
    if (!isDependant) {
      independent.push(schemaAndInformation);
    }
    else {
      pushDependantInOrder({
        arrayOfDependants: dependent,
        element: schemaAndInformation
      });
    }
  });
  return independent.concat(dependent);
};

module.exports = {
  orderSchemasAccordingToDependencies
};
