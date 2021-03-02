const
  Parser = require('fast-xml-parser').j2xParser,
  parserOptions = {
    ignoreAttributes: false,
    cdataTagName: '__cdata',
    format: true,
    indentBy: '  ',
    supressEmptyNode: false
  },
  {
    getArrayFrom
  } = require('./objectUtils'),
  {
    getXMLAttributeByName
  } = require('./XMLParsedUtils'),
  Element = require('../WsdlObject').Element,
  WsdlError = require('../WsdlError'),
  Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema,
  {
    isKnownType
  } = require('./knownTypes'),
  TYPES_TAG = 'types',
  ATRIBUTE_TARGET_NAMESPACE = 'targetNamespace',
  SCHEMA_TAG = 'schema',
  COMPLEX_TYPE_TAG = 'complexType',
  SIMPLE_TYPE_TAG = 'simpleType',
  ATRIBUTE_NAME = 'name',
  traverseUtility = require('traverse');

/**
 * Class to map types schemas from xml parsed document
 * into an array of elements nodes
 */
class SchemaBuilderXSD {

  /**
   * Build the WSDLObject elements
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @param {NameSpace} schemaNamespace the schema namespace wsdlObject
   * @param {NameSpace} tnsNamespace the tns NameSpace from wsdlObject
   * @param {string} parserPlaceholder the corresponding parser prefix for atributes
   * @returns {[Element]} the information of the types
   */
  getElements(parsedXml, principalPrefix, wsdlRoot, schemaNamespace, tnsNamespace, parserPlaceholder) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get elements from undefined or null object');
    }
    let elements = [];
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);
    types.forEach((type) => {
      const schemaTag =
        type[schemaNamespace.prefixFilter + SCHEMA_TAG],
        targetNamespace =
        getXMLAttributeByName(schemaTag, parserPlaceholder, ATRIBUTE_TARGET_NAMESPACE);
      let schema = this.getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespace, parserPlaceholder);
      elements = this.getElementsFromType(type, this.parseSchema(schema),
        schemaNamespace.prefixFilter, targetNamespace, parserPlaceholder);
    });

    return elements;
  }

  /**
   * Takes the schema xml (XSD) and convert it to a
   * jsonSchema
   * @param {string} schema xml schema (XSD)
   * @returns {object} JsonSchema representing the XSD
   */
  parseSchema(schema) {
    const xs2js = new Xsd2JsonSchema(),
      convertedSchemas = xs2js.processAllSchemas({
        schemas: {
          'hello_world.xsd': schema
        }
      }),
      jsonSchema = convertedSchemas['hello_world.xsd'].getJsonSchema();
    return jsonSchema;
  }

  /**
   * Takes the schema object add the needed namespaces
   * and return the xml of the schema
   * @param {object} schemaTag the wsdl schema information object
   * @param {NameSpace} schemaNamespace  the schema namespace information from the wsdl
   * @param {NameSpace} tnsNamespace  the this namespace information from the wsdl
   * @param {string} parserPlaceholder the corresponding parser prefix for atributes
   * @returns {string} the xml representation of the object
   */
  getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespace, parserPlaceholder) {
    let localSchemaTag = {
        ...schemaTag
      },
      objectSchema = {};
    localSchemaTag[parserPlaceholder + 'xmlns:' + schemaNamespace.key] = schemaNamespace.url;
    localSchemaTag[parserPlaceholder + 'xmlns:' + tnsNamespace.key] = tnsNamespace.url;
    objectSchema = {};
    objectSchema[schemaNamespace.prefixFilter + SCHEMA_TAG] = localSchemaTag;
    return this.parseObjectToXML(
      objectSchema);
  }

  /**
   * Takes a jsonObject and parses to xml
   * @param {object} jsonObject the object to convert into xml
   * @returns {string} the xml representation of the object
   */
  parseObjectToXML(jsonObject) {
    if (jsonObject === null || jsonObject === undefined) {
      throw new WsdlError('Cannot convert undefined or null to xml');
    }
    let parser = new Parser(parserOptions),
      xml = parser.parse(jsonObject);
    return xml;
  }

  /**
   * Build the WSDLObject elements
   * @param {object} type the binding operation object
   * @param {string} parsedSchema the principal prefix of document
   * @param {string} schemaPrefixFilter the schema namespace prefix
   * @param {string} targetNamespace the schema namespace prefix
   * @param {string} parserPlaceholder the corresponding parser prefix for atributes
   * @returns {[Element]} the information of the types
   */
  getElementsFromType(type, parsedSchema, schemaPrefixFilter,
    targetNamespace, parserPlaceholder) {
    if (!parsedSchema || typeof parsedSchema !== 'object') {
      throw new WsdlError('Can not get elements from undefined or null object');
    }
    let elements = [],
      complexTypesFromWSDL = [],
      simpleTypesFromWSDL = [],
      complexTypesNamesFromWSDL,
      simpleTypesNamesFromWSDL,
      complexTypes,
      simpleTypes,
      elementsFromWSDL;
    const definitionsNames = Object.keys(parsedSchema.definitions),
      scTag = type[schemaPrefixFilter + SCHEMA_TAG];
    complexTypesFromWSDL = this.getArrayFrom(this.getComplexTypesFromSchema(scTag,
      schemaPrefixFilter));
    simpleTypesFromWSDL = this.getArrayFrom(this.getSimpleTypesFromSchema(scTag,
      schemaPrefixFilter));
    if (!complexTypesFromWSDL) {
      complexTypesFromWSDL = [];
    }
    if (!simpleTypesFromWSDL) {
      simpleTypesFromWSDL = [];
    }
    complexTypesNamesFromWSDL = complexTypesFromWSDL.map((complexType) => {
      return getXMLAttributeByName(complexType, parserPlaceholder, ATRIBUTE_NAME);
    });

    simpleTypesNamesFromWSDL = simpleTypesFromWSDL.map((simpleType) => {
      return getXMLAttributeByName(simpleType, parserPlaceholder, ATRIBUTE_NAME);
    });

    elementsFromWSDL = definitionsNames.filter((definitionName) => {
      return !complexTypesNamesFromWSDL.includes(definitionName) && !simpleTypesNamesFromWSDL.includes(definitionName);
    }).map((definitionName) => {
      return {
        ...parsedSchema.definitions[definitionName],
        name: definitionName
      };
    });

    complexTypes = definitionsNames.filter((definitionName) => {
      return complexTypesNamesFromWSDL.includes(definitionName);
    }).map((definitionName) => {
      return {
        ...parsedSchema.definitions[definitionName],
        name: definitionName
      };
    });

    simpleTypes = definitionsNames.filter((definitionName) => {
      return simpleTypesNamesFromWSDL.includes(definitionName);
    }).map((definitionName) => {
      return {
        ...parsedSchema.definitions[definitionName],
        name: definitionName
      };
    });

    if (elementsFromWSDL) {
      elementsFromWSDL.forEach((element) => {
        let wsdlElement = new Element();
        this.searchAndAssignComplex(element, parsedSchema, complexTypes, simpleTypes);
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
   * @param {object} schemaElement the parsed schema element from a WSDL File
   * @param {string} fieldName the name of the field to look up
   * @returns {string} the value of the min occurs if there is no value then returns 1
   */
  getMinOccursOfElement(schemaElement, fieldName) {
    if (schemaElement.required) {
      return schemaElement.required.includes(fieldName) ? '1' : '0';
    }
    return '1';
  }

  /**
   * Get the min occurs of an element
   * always returns an array
   * @param {object} schemaElement the parsed schema element from a WSDL File
   * @param {string} fieldName the name of the field to look up
   * @returns {string} the value of the min occurs if there is no value then returns 1
   */
  getMaxOccursOfElement(schemaElement, fieldName) {
    if (schemaElement && fieldName !== '') {
      return '1';
    }
    return '1';
  }

  /**
   * Creates recursively the children nodes of an element
   * Assign children and if a complex type is found then
   * call itself
   * @param {object} rootElement the wsdl element to traverse
   * @param {Element} wsdlElement the string name of the type
   * @returns {object} assigns elements to object
   */
  getChildren(rootElement, wsdlElement) {
    let children = [];
    wsdlElement.children = children;
    traverseUtility(rootElement).forEach((x) => {
      if (x) {
        let properties = x.properties;
        if (properties) {
          let keys = Object.keys(properties);

          keys.forEach((key) => {
            let hasRef = properties[key].$ref;
            if (properties[key].type !== 'object' && !hasRef && isKnownType(properties[key].type)) {
              let element = new Element();
              element.name = key;
              element.type = properties[key].type;
              element.minimum = properties[key].minimum;
              element.maximum = properties[key].maximum;
              element.maxLength = properties[key].maxLength;
              element.minLength = properties[key].minLength;
              element.pattern = properties[key].pattern;
              element.isComplex = false;
              element.children = [];
              element.minOccurs = this.getMinOccursOfElement(x, key);
              element.maxOccurs = this.getMaxOccursOfElement(x, key);
              children.push(element);
              wsdlElement.children = children;
            }
            else if (properties[key].type === 'object' || hasRef) {
              let element = new Element();
              wsdlElement.children = [];
              element.name = key;
              element.type = properties[key].complexName;
              element.isComplex = true;
              element.minOccurs = this.getMinOccursOfElement(x, key);
              element.maxOccurs = this.getMaxOccursOfElement(x, key);
              wsdlElement.children.push(element);
              this.getChildren(x.properties[key], element);
              x.properties[key] = {};
            }
          });
        }
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
    return element.type === 'object' ? 'complex' : element.type;
  }

  /**
   * Get the complex types from the schema
   * always returns an array
   * @param {object} schemaTag the binding operation object
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[object]} complex types from the wsdl
   */
  getComplexTypesFromSchema(schemaTag, schemaPrefix) {
    return this.getArrayFrom(schemaTag[schemaPrefix + COMPLEX_TYPE_TAG]);
  }

  /**
   * Get the simple types from the schema
   * always returns an array
   * @param {object} schemaTag the binding operation object
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[object]} simple types from the wsdl
   */
  getSimpleTypesFromSchema(schemaTag, schemaPrefix) {
    return this.getArrayFrom(schemaTag[schemaPrefix + SIMPLE_TYPE_TAG]);
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
   * @param {object} parsedSchema the parsed schema
   * @param {[object]} complexTypes the identified complex types of the wsdl
   * @returns {[Element]} the information of the types
   */
  searchAndAssignComplex(rootElement, parsedSchema, complexTypes, simpleTypes) {
    traverseUtility(rootElement).forEach((x) => {
      if (x) {
        let hasNonKnownType,
          isArray;
        isArray = Object.keys(x)
          .find(
            (key) => {
              return key === 'oneOf';
            }
          );
        if (isArray) {
          x.$ref = x.oneOf[0].$ref;
          x.oneOf = undefined;
        }
        hasNonKnownType = Object.keys(x)
          .find(
            (key) => {
              return key === '$ref' && key !== 'oneOf';
            }
          );

        if (hasNonKnownType) {
          let complexType = '',
            simpleType = '',
            type = x[hasNonKnownType];
          complexType = this.getComplexTypeByName(type, complexTypes);
          if (complexType) {
            x.properties = {};
            x.properties = complexType;
            x.type = 'complex';
            x.complexName = complexType.name;
            this.searchAndAssignComplex(x.properties, parsedSchema, complexTypes);
          }
          else {
            this.processSimpleType(type, simpleTypes, x);
          }
        }
      }
    });
  }

  /**
   * reads the simple type and assign the properties directly
   * always returns an array
   * @param {string} typeName the simple type name too look for
   * @param {array} simpleTypes the simple types from the wsdl
   * @param {object} traverseObject the traversing object
   * @returns {object} the data
   */
  processSimpleType(typeName, simpleTypes, traverseObject) {
    let simpleType = this.getSimpleTypeByName(typeName, simpleTypes);
    traverseObject.type = simpleType.type;
    traverseObject.minLength = simpleType.minLength;
    traverseObject.maxLength = simpleType.maxLength;
    traverseObject.maximum = simpleType.maximum;
    traverseObject.minimum = simpleType.minimum;
    traverseObject.pattern = simpleType.pattern;
    traverseObject.$ref = undefined;
  }

  /**
   * Get the types of the document
   * always returns an array
   * @param {string} complexTypeName the complex type name too look for
   * @param {string} complexTypes the identified complex types
   * @returns {object} the found complex type
   */
  getComplexTypeByName(complexTypeName, complexTypes) {
    let complexType,
      complexTypeNameFound = complexTypeName.replace('#/definitions/', '');
    complexType = complexTypes.find((complexType) => {
      return complexType.name === complexTypeNameFound;
    });
    return complexType;
  }

  /**
   * Get the types of the document
   * always returns an array
   * @param {string} complexTypeName the complex type name too look for
   * @param {string} complexTypes the identified complex types
   * @returns {object} the found complex type
   */
  getSimpleTypeByName(simpleTypeName, simpleTypes) {
    let simpleType,
      simpleTypeNameFound = simpleTypeName.replace('#/definitions/', '');
    simpleType = simpleTypes.find((simpleType) => {
      return simpleType.name === simpleTypeNameFound;
    });
    return simpleType;
  }

  /**
   * if an element is not an array then convert it to an array
   * @param {object} element the element the return as array
   * @returns {[object]} the array of objects
   */
  getArrayFrom(element) {
    return getArrayFrom(element);
  }

}

module.exports = {
  SchemaBuilderXSD
};
