

const Xsd2JsonSchema = require('../assets/xsd2jsonschemafaker').Xsd2JsonSchema;


/**
 * Class to parse and input XSD (string xml) into a
 * jsonSchema
 */
class XSDToJsonSchemaParser {

  /**
   * Takes the schema xml (XSD) and convert it to a
   * jsonSchema
   * @param {string} schema xml schema (XSD)
   * @returns {object} JsonSchema representing the XSD
   */
  parseSchema(schema) {
    let convertedSchemas,
      jsonSchema;
    const xs2js = new Xsd2JsonSchema();
    try {
      convertedSchemas = xs2js.processAllSchemas({
        schemas: {
          'schema.xsd': schema
        }
      });
      jsonSchema = convertedSchemas['schema.xsd'].getJsonSchema();
      return jsonSchema;
    }
    catch (error) {
      console.error('There was an error getting json schema from xsd ', error);
    }
    return undefined;
  }


  /**
   * Takes all the xsd schemas to convert to json schema
   * @param {Array} schemas array of xml string schemas (XSD)
   * @returns {Array} JsonSchemas representing the XSDs
   */
  parseAllSchemas(schemas) {
    let schemasToParse = {},
      convertedSchemas,
      jsonSchemas = [];
    const xs2js = new Xsd2JsonSchema();
    for (let index = 0; index < schemas.length; index++) {
      const schema = schemas[index];
      schemasToParse[`schema_${index}.xsd`] = schema;
    }
    try {
      convertedSchemas = xs2js.processAllSchemas({ schemas: schemasToParse });
      for (let index = 0; index < schemas.length; index++) {
        jsonSchemas.push(convertedSchemas[`schema_${index}.xsd`].getJsonSchema());
      }
      return jsonSchemas;
    }
    catch (error) {
      console.error('There was an error getting json schemas from xsd ', error);
    }
    return jsonSchemas;
  }
}

module.exports = {
  XSDToJsonSchemaParser
};
