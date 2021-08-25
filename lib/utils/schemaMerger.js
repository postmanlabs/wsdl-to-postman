
/**
*
* @description Takes in a string and returns a constant verb
*
* @param {Array} schemasToMerge RequestList
* @returns {string} validation
*/
function mergeSchemas(schemasToMerge) {
  let schemaResult = {},
    elementsToSchema = [],
    simpleTypeToSchema = [],
    complexTypeToSchema = [];

  schemasToMerge.forEach((schema) => {
    let elements = schema['xsd:element'],
      complexType = schema['xsd:complexType'],
      simpleType = schema['xsd:simpleType'];
    if (elements) {
      elementsToSchema = elementsToSchema.concat(elements);
    }
    if (complexType) {
      complexTypeToSchema = complexTypeToSchema.concat(complexType);
    }
    if (simpleType) {
      simpleTypeToSchema = simpleTypeToSchema.concat(simpleType);
    }

  });
  schemaResult['xsd:element'] = elementsToSchema;
  schemaResult['xsd:simpleType'] = simpleTypeToSchema;
  schemaResult['xsd:complexType'] = complexTypeToSchema;

  return schemaResult;
}

module.exports = {
  mergeSchemas
};
