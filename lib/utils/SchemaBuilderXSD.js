const
  Element = require('../WsdlObject').Element,
  WsdlError = require('../WsdlError'),
  Xsd2JsonSchema = require("xsd2jsonschema").Xsd2JsonSchema,
  {
    isKnownType
  } = require('./knownTypes'),
  TYPES_TAG = 'types',
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER = '@_',
  ATRIBUTE_TARGET_NAMESPACE = 'targetNamespace',
  SCHEMA_TAG = 'schema',
  ELEMENT_TAG = 'element',
  COMPLEX_TYPE_TAG = 'complexType',
  ATRIBUTE_NAME = 'name',
  ATRIBUTE_TYPE = 'type',
  XML_NAMESPACE_SEPARATOR = ':',
  ATRIBUTE_MIN_OCCURS = 'minOccurs',
  ATRIBUTE_MAX_OCCURS = 'maxOccurs',
  traverseUtility = require('traverse'),
  {
    getArrayFrom,
  } = require('../WsdlParserCommon');

/**
 * Class to map types schemas from xml parsed document
 * into an array of elements nodes
 */
class SchemaBuilderXSD {

  parseSchema(schema) {
    const xs2js = new Xsd2JsonSchema();

    let convertedSchemas = xs2js.processAllSchemas({
      schemas: {
        "hello_world.xsd": schema
      },
    });
    return convertedSchemas["hello_world.xsd"].getJsonSchema();
  }

  /**
   * Build the WSDLObject elements
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[Element]} the information of the types
   */
  getElements(parsedXml, schema, principalPrefix, wsdlRoot, schemaPrefix) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get elements from undefined or null object');
    }
    let elements = [];
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);
    types.forEach((type) => {
      const schemaTag =
        type[schemaPrefix + SCHEMA_TAG],
        //elementsFromWSDL = this.getElementsFromSchema(schemaTag, schemaPrefix),
        targetNamespace =
        schemaTag[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TARGET_NAMESPACE];

      elements = this.getElementsFromType(type, this.parseSchema(schema), schemaPrefix, targetNamespace)

    });

    return elements;
  }

  /**
   * Build the WSDLObject elements
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[Element]} the information of the types
   */
  getElementsFromType(type, parsedSchema, schemaPrefix,
    targetNamespace) {
    if (!parsedSchema || typeof parsedSchema !== 'object') {
      throw new WsdlError('Can not get elements from undefined or null object');
    }
    let elements = [];
    const definitionsNames = Object.keys(parsedSchema.definitions);

    const scTag = type[schemaPrefix + SCHEMA_TAG];
    let complexTypesFromWSDL = this.getComplexTypesFromSchema(scTag, schemaPrefix);
    let complexTypesNamesFromWSDL = complexTypesFromWSDL.map((complexType) => {
      return complexType[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME];
    });

    let elementsFromWSDL = definitionsNames.filter((definitionName) => {
      return !complexTypesNamesFromWSDL.includes(definitionName)
    }).map((definitionName) => {
      return {
        ...parsedSchema.definitions[definitionName],
        name: definitionName
      };
    });

    let complexTypes = definitionsNames.filter((definitionName) => {
      return complexTypesNamesFromWSDL.includes(definitionName)
    }).map((definitionName) => {
      return {
        ...parsedSchema.definitions[definitionName],
        name: definitionName
      };
    });


    if (elementsFromWSDL) {
      elementsFromWSDL.forEach((element) => {
        let wsdlElement = new Element();
        //this.searchAndAssignComplex(element, parsedXml, principalPrefix, wsdlRoot, schemaPrefix);
        wsdlElement.namespace = targetNamespace;
        wsdlElement.name = element.name;
        wsdlElement.type = this.getTypeOfElement(element);
        wsdlElement.isComplex = wsdlElement.type === 'complex';
        //wsdlElement.minOccurs = this.getMinOccursOfElement(element);
        //wsdlElement.maxOccurs = this.getMaxOccursOfElement(element);
        //this.getChildren(element, wsdlElement, schemaPrefix);
        elements.push(wsdlElement);
      });
    }
    return elements;
  }

  /**
   * Gets the type of the element if not found then
   * is treated as complex
   * @param {element} element the string name of the type
   * @returns {string} assigns elements to object
   */
  getTypeOfElement(element) {
    return element.type === "object" ? 'complex' : element.type;
  }


  /**
   * Get the complex types from the schema
   * always returns an array
   * @param {object} schemaTag the binding operation object
   * @param {string} schemaPrefix the schema namespace prefix
   * @param {string} complexTypeName the name of the complex type
   * @returns {[object]} complex types from the wsdl
   */
  getComplexTypesFromSchema(schemaTag, schemaPrefix) {
    return getArrayFrom(schemaTag[schemaPrefix + COMPLEX_TYPE_TAG]);
  }

  /**
   * Get the types of the document
   * always returns an array
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @returns {[object]} the information of the types
   */
  getTypes(parsedXml, principalPrefix, wsdlRoot) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get types from undefined or null object');
    }
    try {
      const definitions = parsedXml[principalPrefix + wsdlRoot];
      return getArrayFrom(definitions[principalPrefix + TYPES_TAG]);
    }
    catch (error) {
      throw new WsdlError('Can not get types from object');
    }
  }

  /**
   * Traverse the element identifies if a property is a complex type
   * if it is a complex type then obtain the complex type and
   * assign it as a son then call again itself
   * @param {object} rootElement the element of the wsdl
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[Element]} the information of the types
   */
  searchAndAssignComplex(rootElement, parsedXml, principalPrefix, wsdlRoot, schemaPrefix) {
    traverseUtility(rootElement).forEach((x) => {
      let hasNonKnownType = Object.keys(x)
        .find(
          (key) => {
            return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE && !isKnownType(x[key]);
          }
        );
      if (hasNonKnownType) {
        let complexType = '',
          type = x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE];
        type = type.includes(':') ? x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE]
          .split(XML_NAMESPACE_SEPARATOR)[1] : type;
        complexType = this.getComplexTypeByName(parsedXml,
          principalPrefix, wsdlRoot, schemaPrefix, type);
        x[schemaPrefix + COMPLEX_TYPE_TAG] = complexType;
        this.searchAndAssignComplex(x[schemaPrefix + COMPLEX_TYPE_TAG], parsedXml,
          principalPrefix, wsdlRoot, schemaPrefix);
      }
    });
  }
}

module.exports = {
  SchemaBuilderXSD
};
