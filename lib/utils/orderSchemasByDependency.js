
const { getArrayFrom } = require('./objectUtils'),
  { getXMLNodeByName, getXMLAttributeByName } = require('./XMLParsedUtils');

/**
 *
 * @description pushes the element in the rigth position
 * next to the last dependency
 *
 * @param {Array} arrayOfDependents array of elements
 * @param {object} element the element to push in array
 * @returns {undefined} nothing
 */
function pushDependentInOrder ({
  arrayOfDependents,
  element
}) {
  let dependencyArray = [...element.dependencies],
    lastIndex = -1;
  for (i = 0; i < arrayOfDependents.length; i++) {
    if (dependencyArray.includes(arrayOfDependents[i].targetNamespace)) {
      lastIndex = i;
    }
  }
  if (lastIndex === -1) {
    arrayOfDependents.unshift(element);
  }
  else {
    arrayOfDependents.splice(lastIndex + 1, 0, element);
  }
};

/**
 *
 * @description takes an array of schema elements
 * from xsd2json and orders them
 * the independent first and the dependent later
 *
 * @param {Array} schemasToOrderInformation array of elements from the xsd2json
 * @param {string} attributePlaceHolder parser character for attributes
 * @returns {string} validation
 */
function orderSchemasAccordingToDependencies (schemasToOrderInformation, attributePlaceHolder) {
  let independent = [],
    dependent = [];
  schemasToOrderInformation.forEach((schemaAndInformation) => {
    let isDependent = false,
      imports,
      schema = schemaAndInformation.foundSchemaTag,
      namespace = schemaAndInformation.foundLocalSchemaNamespace;
    schemaAndInformation.dependencies = new Set();

    imports = getArrayFrom(getXMLNodeByName(schema, namespace.prefixFilter, 'import'));

    if (imports && imports.length > 0) {

      imports.forEach((importElement) => {
        schemaAndInformation.dependencies.add(
          getXMLAttributeByName(importElement, attributePlaceHolder, 'namespace'));
      });
      isDependent = true;
    }
    if (!isDependent) {
      independent.push(schemaAndInformation);
    }
    else {
      pushDependentInOrder({
        arrayOfDependents: dependent,
        element: schemaAndInformation
      });
    }
  });
  return independent.concat(dependent);
}

module.exports = {
  orderSchemasAccordingToDependencies
};
