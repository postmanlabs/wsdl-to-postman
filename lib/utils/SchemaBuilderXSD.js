const {
  parse
} = require('fast-xml-parser');
const {
  ID
} = require('xsd2jsonschema/src/xmlschema/xsdAttributes'),
  Parser = require('fast-xml-parser').j2xParser, {
    BFSSoapParametersHelper
  } = require('../../lib/utils/BFSSoapParametersHelper'),
  parserOptions = {
    ignoreAttributes: false,
    cdataTagName: '__cdata',
    format: true,
    indentBy: '  ',
    supressEmptyNode: false
  },
  Element = require('../WsdlObject').Element,
  WsdlError = require('../WsdlError'),
  Xsd2JsonSchema = require("xsd2jsonschema").Xsd2JsonSchema, {
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
  traverseUtility = require('traverse'), {
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
    let jsonChema = convertedSchemas["hello_world.xsd"].getJsonSchema();
    return jsonChema;
  }

  getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespace) {
    let localSchemaTag = {
      ...schemaTag
    };
    localSchemaTag[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'xmlns:' + schemaNamespace.key] = schemaNamespace.url;
    localSchemaTag[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'xmlns:' + tnsNamespace.key] = tnsNamespace.url;
    let objectSchema = {};
    objectSchema[schemaNamespace.key + XML_NAMESPACE_SEPARATOR + 'schema'] = localSchemaTag;
    return this.parseObjectToXML(
      objectSchema)
  }

  /**
   * Takes a jsonObject and parses to xml
   * @param {object} jsonObject the object to convert into xml
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @returns {string} the xml representation of the object
   */
  parseObjectToXML(jsonObject) {
    if (jsonObject === null || jsonObject === undefined) {
      throw new WsdlError('Cannot convert undefined or null to object');
    }
    let parser = new Parser(parserOptions),
      xml = parser.parse(jsonObject);
    return xml;
  }

  /**
   * Build the WSDLObject elements
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[Element]} the information of the types
   */
  getElements(parsedXml, principalPrefix, wsdlRoot, schemaNamespace, tnsNamespace) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get elements from undefined or null object');
    }
    let elements = [];
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);
    types.forEach((type) => {
      const schemaTag =
        type[schemaNamespace.key + XML_NAMESPACE_SEPARATOR + SCHEMA_TAG],
        targetNamespace =
        schemaTag[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TARGET_NAMESPACE];

      let schema = this.getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespace)
      elements = this.getElementsFromType(type, this.parseSchema(schema), schemaNamespace.key, targetNamespace)

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

    const scTag = type[schemaPrefix + XML_NAMESPACE_SEPARATOR + SCHEMA_TAG];
    let complexTypesFromWSDL = this.getArrayFrom(this.getComplexTypesFromSchema(scTag, schemaPrefix + XML_NAMESPACE_SEPARATOR));
    if (!complexTypesFromWSDL) {
      complexTypesFromWSDL = [];
    }
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
        this.searchAndAssignComplex(element, parsedSchema, complexTypes);
        wsdlElement.namespace = targetNamespace;
        wsdlElement.name = element.name;
        wsdlElement.type = this.getTypeOfElement(element);
        wsdlElement.isComplex = wsdlElement.type === 'complex';
        wsdlElement.minOccurs = this.getMinOccursOfElement(element, wsdlElement.name);
        wsdlElement.maxOccurs = this.getMaxOccursOfElement(element, wsdlElement.name);
        this.getChildren(element, wsdlElement);
        elements.push(wsdlElement);
      });
    }
    return elements;
  }


  /**
   * Get the min occurs of an element
   * always returns an array
   * @param {object} element the parsed element from a WSDL File
   * @returns {string} the value of the min occurs if there is no value then returns 1
   */
  getMinOccursOfElement(schemaElement, fieldName) {
    if (schemaElement.required) {
      return schemaElement.required.includes(fieldName) ? '1' : '0'
    }
    return '1';
  }

  /**
   * Get the min occurs of an element
   * always returns an array
   * @param {object} element the parsed element from a WSDL File
   * @returns {string} the value of the min occurs if there is no value then returns 1
   */
  getMaxOccursOfElement(schemaElement, fieldName) {
    return '1';
  }

  /**
   * Creates recursively the children nodes of an element
   * Assign children and if a complex type is found then
   * call itself
   * @param {object} rootElement the wsdl element to traverse
   * @param {Element} wsdlElement the string name of the type
   * @param {string} schemaPrefix the string name of the type
   * @returns {object} assigns elements to object
   */
  getChildren(rootElement, wsdlElement) {
    let children = [];
    wsdlElement.children = children;
    traverseUtility(rootElement).forEach((x) => {
      let properties = x.properties;
      if (properties) {
        let keys = Object.keys(properties);

        keys.forEach((key) => {
          let hasRef = properties[key].$ref;
          if (properties[key].type !== "object" && !hasRef && isKnownType(properties[key].type)) {
            let element = new Element();
            element.name = key;
            element.type = properties[key].type;
            element.minimum = properties[key].minimum;
            element.maximum = properties[key].maximum;
            element.isComplex = false;
            element.children = [];
            element.minOccurs = this.getMinOccursOfElement(x, key);
            element.maxOccurs = this.getMaxOccursOfElement(x, key);
            children.push(element);
            wsdlElement.children = children;
          }
          else if (properties[key].type === "object" || hasRef) {
            let element = new Element();
            wsdlElement.children = [];
            element.name = key;
            element.type = properties[key].complexName;
            element.isComplex = true;
            element.minOccurs = this.getMinOccursOfElement(x, key);
            element.maxOccurs = this.getMaxOccursOfElement(x, key);
            wsdlElement.children.push(element);
            this.getChildren(x['properties'][key], element);
            x['properties'][key] = {};
          }
        });
      }
    });
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
    return this.getArrayFrom(schemaTag[schemaPrefix + COMPLEX_TYPE_TAG]);
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
      return this.getArrayFrom(definitions[principalPrefix + TYPES_TAG]);
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
  searchAndAssignComplex(rootElement, parsedSchema, complexTypes) {
    traverseUtility(rootElement).forEach((x) => {
      let hasNonKnownType = Object.keys(x)
        .find(
          (key) => {
            return key === '$ref';
          }
        );
      if (hasNonKnownType) {
        let complexType = '',
          type = x[hasNonKnownType];
        complexType = this.getComplexTypeByName(parsedSchema, type, complexTypes);
        x['properties'] = {};
        x['properties'] = complexType;
        x['complexName'] = complexType.name;
        this.searchAndAssignComplex(x['properties'], parsedSchema, complexTypes);
      }
    });
  }

  /**
   * Get the types of the document
   * always returns an array
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @param {string} schemaPrefix the schema namespace prefix
   * @param {string} complexTypeName the name of the complex type
   * @returns {[object]} the information of the types
   */
  getComplexTypeByName(parsedSchema, complexTypeName, complexTypes) {
    let complexType;
    const properties = parsedSchema.properties;

    let complexTypeNameFound = Object.keys(properties)
      .find(
        (key) => {
          return properties[key]['$ref'] === complexTypeName;
        }
      );
    complexType = complexTypes.find((complexType) => {
      return complexType.name === complexTypeNameFound;
    });
    return complexType;
  }

  /**
   * if an element is not an array then convert it to an array
   * @param {object} element the element the return as array
   * @returns {[object]} the array of objects
   */
  getArrayFrom(element) {
    if (element && !Array.isArray(element)) {
      return [element];
    }
    return element;
  }


}

module.exports = {
  SchemaBuilderXSD
};
