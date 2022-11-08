
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
function pushDependentInOrder({
  arrayOfDependents,
  element
}) {
  let dependencyArray,
    lastIndex = -1,
    exists = arrayOfDependents.findIndex((added) => {
      return added.targetNamespace === element.targetNamespace;
    });
  if (exists !== -1) {
    return;
  }
  dependencyArray = [...element.dependencies];
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
}

/**
*
* @description pushes the element if is not previously added
*
* @param {Array} arrayOfIndependent array of elements
* @param {object} element the element to push in array
* @returns {undefined} nothing
*/
function pushIndependent(
  arrayOfIndependent,
  element
) {
  let exists = arrayOfIndependent.findIndex((added) => {
    return added.targetNamespace === element.targetNamespace;
  });
  if (exists !== -1) {
    return;
  }
  arrayOfIndependent.push(element);
}

/**
*
* @description returns the namespace from the WSDL
*
* @param {Array} allNameSpaces array of all the namespaces in wsdl definition
* @param {string} url the url to search the namespace
* @returns {object} the found namespace
*/
function getNotCommonNamespaces(allNameSpaces) {
  let commonNamespaces = ['targetNamespace', 'xmlns', 'soap', 'xsd', 'tns', 'soap12'];
  if (allNameSpaces) {
    return allNameSpaces.filter((namespace) => { return !commonNamespaces.includes(namespace.key); });
  }
  return [];
}

/**
*
* @description takes an schema element
* from xsd2json and determines if has imports or not
* if has imports call again with dependencies
*
* @param {Array} schemaAndInformation array of elements from the xsd2json
* @param {Array} namespacesFromWSDL schemas with no imports to fill
* @param {string} attributePlaceHolder parser character for attributes
* @returns {undefined} nothing
*/
function assignNamespacesToSchema(schemaAndInformation, namespacesFromWSDL, attributePlaceHolder) {
  namespacesFromWSDL.forEach((namespace) => {
    schemaAndInformation.foundSchemaTag[`${attributePlaceHolder}xmlns:${namespace.key}`] = namespace.url;
  });
}

/**
*
* @description takes an schema element
* from xsd2json and determines if has imports or not
* if has imports call again with dependencies
*
* @param {Array} schemaAndInformation array of elements from the xsd2json
* @param {Array} independent schemas with no imports to fill
* @param {string} attributePlaceHolder parser character for attributes
* @param {Array} dependent array of schemas with imports
* @param {Array} schemasToOrderInformation all the schemas to order
* @param {Array} allNameSpaces array of all the namespaces in wsdl definition
* @param {Array} processedSchemas array of all the processed schemas
* @returns {undefined} nothing
*/
function processSchema(schemaAndInformation, independent, attributePlaceHolder, dependent, schemasToOrderInformation,
  allNameSpaces, processedSchemas) {
  let imports,
    schema = schemaAndInformation.foundSchemaTag,
    namespace = schemaAndInformation.foundLocalSchemaNamespace;
  schemaAndInformation.dependencies = new Set();

  imports = getArrayFrom(getXMLNodeByName(schema, namespace.prefixFilter, 'import'));

  if (!imports || imports.length === 0) {
    pushIndependent(independent, schemaAndInformation);
    return;
  }

  if (imports && imports.length > 0) {
    imports.forEach((importElement) => {
      let importedName = getXMLAttributeByName(importElement, attributePlaceHolder, 'namespace'),
        namespacesFromWSDL = getNotCommonNamespaces(allNameSpaces, importedName),
        toProcess = schemasToOrderInformation.find((schema) => {
          return schema.targetNamespace === importedName;
        });
      schemaAndInformation.dependencies.add(
        getXMLAttributeByName(importElement, attributePlaceHolder, 'namespace'));
      assignNamespacesToSchema(schemaAndInformation, namespacesFromWSDL, attributePlaceHolder);
      if (toProcess && processedSchemas.find((schema) => { return importedName === schema; }) === undefined) {
        processedSchemas.push(importedName);
        processSchema(toProcess, independent, attributePlaceHolder, dependent, schemasToOrderInformation,
          allNameSpaces, processedSchemas);
      }
    });
    pushDependentInOrder({
      arrayOfDependents: dependent,
      element: schemaAndInformation
    });
  }
}

/**
*
* @description takes an array of schema elements
* from xsd2json and orders them
* the independent first and the dependent later
*
* @param {Array} schemasToOrderInformation array of elements from the xsd2json
* @param {string} attributePlaceHolder parser character for attributes
* @param {Array} allNameSpaces array of all the namespaces in wsdl definition
* @returns {string} validation
*/
function orderSchemasAccordingToDependencies(schemasToOrderInformation, attributePlaceHolder,
  allNameSpaces) {
  let independent = [],
    dependent = [];
  schemasToOrderInformation.forEach((schemaAndInformation) => {
    processSchema(schemaAndInformation, independent, attributePlaceHolder, dependent,
      schemasToOrderInformation, allNameSpaces, []);
  });
  return independent.concat(dependent);
}

module.exports = {
  orderSchemasAccordingToDependencies
};
