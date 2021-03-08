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
    getXMLAttributeByName,
    getXMLNodeByName
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
  MESSAGE_TAG = 'message',
  COMPLEX_TYPE_TAG = 'complexType',
  SIMPLE_TYPE_TAG = 'simpleType',
  ATRIBUTE_NAME = 'name',
  ATRIBUTE_PART = 'part',
  ATRIBUTE_TYPE = 'type',
  ATRIBUTE_ELEMENT = 'element',
  traverseUtility = require('traverse'),
  IS_KNOWN_TYPE = 'knownType',
  IS_ELEMENT = 'isElement',
  IS_SIMPLE_TYPE = 'isSimpleType',
  IS_COMPLEX_TYPE = 'isComplexType',
  ANONIMOUS = 'anonimous';

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
    let elementsFromMessages = [],
      allElements = {};
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);
    types.forEach((type) => {
      const schemaTag =
        type[schemaNamespace.prefixFilter + SCHEMA_TAG],
        targetNamespace =
        getXMLAttributeByName(schemaTag, parserPlaceholder, ATRIBUTE_TARGET_NAMESPACE);
      let schema = this.getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespace, parserPlaceholder);
      allElements = this.getElementsFromType(type, this.parseSchema(schema),
        schemaNamespace.prefixFilter, targetNamespace, parserPlaceholder);
    });
    elementsFromMessages = this.getElementsFromMesages(parsedXml, principalPrefix,
      allElements.elements, allElements.simpleTypeElements, allElements.complexTypeElements,
      parserPlaceholder, wsdlRoot);
    return allElements.elements.concat(elementsFromMessages);
  }

  /**
   * Gets the wsdlobject elements defined in messages instead of
   * in the types tag.
   * creates elements for simple types complex types and elements of the wsdl
   * @param {object} parsedXML the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {Array} elementsInTypes the elements from the types tag
   * @param {Array} simpleTypes the simple types from the types tag
   * @param {Array} complexTypes the complex types from the types tag
   * @param {string} parserPlaceholder the corresponding parser prefix for atributes
   * @param {string} wsdlRoot the corresponding wsdl root definitions or descriptions
   * @returns {[Element]} the information of the types
   */
  getElementsFromMesages(parsedXML, principalPrefix, elementsInTypes, simpleTypes, complexTypes, parserPlaceholder,
    wsdlRoot) {
    let filtered = '',
      newElements = [];
    const definitions = parsedXML[principalPrefix + wsdlRoot],
      messages = getArrayFrom(getXMLNodeByName(definitions, principalPrefix, MESSAGE_TAG));
    if (!messages) {
      return newElements;
    }
    filtered = messages.filter((message) => {
      let part = getXMLNodeByName(message, principalPrefix, ATRIBUTE_PART);
      if (part.length > 1) {
        return message;
      }
    });

    filtered.forEach((message) => {
      let parts = [],
        wsdlElement = new Element();
      wsdlElement.name = getXMLAttributeByName(message, parserPlaceholder, ATRIBUTE_NAME);
      wsdlElement.type = ANONIMOUS;
      wsdlElement.isComplex = true;
      wsdlElement.minOccurs = 0;
      wsdlElement.maxOccurs = 1;
      wsdlElement.children = [];
      parts = getXMLNodeByName(message, principalPrefix, ATRIBUTE_PART);

      parts.forEach((part) => {
        let realPartTypeorelement = '',
          partType = getXMLAttributeByName(part, parserPlaceholder, ATRIBUTE_TYPE),
          partName = getXMLAttributeByName(part, parserPlaceholder, ATRIBUTE_NAME);
        if (!partType) {
          realPartTypeorelement = getXMLAttributeByName(part, parserPlaceholder, ATRIBUTE_ELEMENT);
        }
        else {
          realPartTypeorelement = partType;
        }
        realPartTypeorelement = realPartTypeorelement.split(':')[1];

        if (realPartTypeorelement) {
          let foundType = this.findMessageParameterAndType(realPartTypeorelement, elementsInTypes,
            simpleTypes, complexTypes);
          if (foundType.typeOfType === IS_KNOWN_TYPE) {
            let element = new Element();
            element.name = partName;
            element.type = realPartTypeorelement;
            element.children = [];
            wsdlElement.children.push(element);
          }
          if (foundType.typeOfType === IS_COMPLEX_TYPE ||
            foundType.typeOfType === IS_SIMPLE_TYPE ||
            foundType.typeOfType === IS_ELEMENT) {
            let type = foundType.type;
            if (type) {
              let element = this.getCopyOfElement(type);
              wsdlElement.children.push(element);
            }
          }
        }
      });
      newElements.push(wsdlElement);
    });
    return newElements;
  }

  /**
   * Copy the element to a new object
   * @param {Element} element the element to copy
   * @return {Element} a copy of the element
   */
  getCopyOfElement(element) {
    let newElement = {
      ...element
    };
    return newElement;
  }

  /**
   * Finds the type of the parameter that could be:
   * element simple type complex type or an scalar type
   * in the types tag.
   * creates elements for simple types complex types and elements of the wsdl
   * @param {string} typeOrElementName the name of the parameter (type or element)
   * @param {Array} elementsInTypes the elements from the types tag
   * @param {Array} simpleTypes the simple types from the types tag
   * @param {Array} complexTypes the complex types from the types tag
   * @returns {[Object]} the type of the parameter and the object of the parameter
   */
  findMessageParameterAndType(typeOrElementName, elementsInTypes, simpleTypes, complexTypes) {
    let found;
    if (isKnownType(typeOrElementName)) {
      return {
        typeOfType: IS_KNOWN_TYPE
      };
    }
    if (elementsInTypes) {
      found = elementsInTypes.find((element) => {
        return element.name === typeOrElementName;
      });
      if (found) {
        return {
          typeOfType: IS_ELEMENT,
          type: found
        };
      }
    }
    if (simpleTypes) {
      found = simpleTypes.find((element) => {
        return element.name === typeOrElementName;
      });
      if (found) {
        return {
          typeOfType: IS_SIMPLE_TYPE,
          type: found
        };
      }
    }
    if (complexTypes) {
      found = complexTypes.find((element) => {
        return element.name === typeOrElementName;
      });
      if (found) {
        return {
          typeOfType: IS_COMPLEX_TYPE,
          type: found
        };
      }
    }
    return '';
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
          'schema.xsd': schema
        }
      }),
      jsonSchema = convertedSchemas['schema.xsd'].getJsonSchema();
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
      elementTypesFromWSDL = [],
      complexTypes,
      simpleTypes,
      elementsFromWSDL,
      complexTypeElements = [],
      simpleTypeElements = [];
    const definitionsNames = Object.keys(parsedSchema.definitions),
      scTag = type[schemaPrefixFilter + SCHEMA_TAG];
    complexTypesFromWSDL = getArrayFrom(this.getComplexTypesFromSchema(scTag,
      schemaPrefixFilter));
    simpleTypesFromWSDL = getArrayFrom(this.getSimpleTypesFromSchema(scTag,
      schemaPrefixFilter));
    elementTypesFromWSDL = getArrayFrom(this.getElementsFromSchema(scTag,
      schemaPrefixFilter));

    if (!complexTypesFromWSDL) {
      complexTypesFromWSDL = [];
    }
    if (!simpleTypesFromWSDL) {
      simpleTypesFromWSDL = [];
    }
    if (!elementTypesFromWSDL) {
      elementTypesFromWSDL = [];
    }

    elementsFromWSDL = this.getTypesFromDefinitions(parsedSchema, elementTypesFromWSDL,
      definitionsNames, parserPlaceholder);
    complexTypes = this.getTypesFromDefinitions(parsedSchema, complexTypesFromWSDL,
      definitionsNames, parserPlaceholder);
    simpleTypes = this.getTypesFromDefinitions(parsedSchema, simpleTypesFromWSDL,
      definitionsNames, parserPlaceholder);

    if (complexTypes) {
      complexTypes.forEach((element) => {
        let wsdlElement = new Element();
        this.searchAndAssignComplex(JSON.parse(JSON.stringify(element)),
          parsedSchema, complexTypes,
          simpleTypes);
        wsdlElement.namespace = targetNamespace;
        wsdlElement.name = element.name;
        wsdlElement.type = this.getTypeOfElement(element);
        wsdlElement.isComplex = wsdlElement.type === 'complex';
        wsdlElement.minOccurs = this.getMinOccursOfElement(element, wsdlElement.name);
        wsdlElement.maxOccurs = this.getMaxOccursOfElement(element, wsdlElement.name);
        wsdlElement.minimum = element.minimum;
        wsdlElement.maximum = element.maximum;
        wsdlElement.maxLength = element.maxLength;
        wsdlElement.minLength = element.minLength;
        wsdlElement.pattern = element.pattern;
        wsdlElement.enumValues = element.enumValues;

        this.getChildren(element, wsdlElement);
        complexTypeElements.push(wsdlElement);
      });
    }

    if (simpleTypes) {
      simpleTypes.forEach((element) => {
        let wsdlElement = new Element();
        this.searchAndAssignComplex(JSON.parse(JSON.stringify(element)), parsedSchema,
          complexTypes, simpleTypes);
        wsdlElement.namespace = targetNamespace;
        wsdlElement.name = element.name;
        wsdlElement.type = this.getTypeOfElement(element);
        wsdlElement.isComplex = wsdlElement.type === 'complex';
        wsdlElement.minOccurs = this.getMinOccursOfElement(element, wsdlElement.name);
        wsdlElement.maxOccurs = this.getMaxOccursOfElement(element, wsdlElement.name);
        wsdlElement.minimum = element.minimum;
        wsdlElement.maximum = element.maximum;
        wsdlElement.maxLength = element.maxLength;
        wsdlElement.minLength = element.minLength;
        wsdlElement.pattern = element.pattern;
        wsdlElement.enumValues = element.enum;

        this.getChildren(element, wsdlElement);
        simpleTypeElements.push(wsdlElement);
      });
    }

    if (elementsFromWSDL) {
      elementsFromWSDL.forEach((element) => {
        let wsdlElement = new Element();
        this.searchAndAssignComplex(element, parsedSchema,
          complexTypes,
          simpleTypes);
        wsdlElement.namespace = targetNamespace;
        wsdlElement.name = element.name;
        wsdlElement.type = this.getTypeOfElement(element);
        wsdlElement.isComplex = wsdlElement.type === 'complex';
        wsdlElement.minOccurs = this.getMinOccursOfElement(element, wsdlElement.name);
        wsdlElement.maxOccurs = this.getMaxOccursOfElement(element, wsdlElement.name);
        wsdlElement.minimum = element.minimum;
        wsdlElement.maximum = element.maximum;
        wsdlElement.maxLength = element.maxLength;
        wsdlElement.minLength = element.minLength;
        wsdlElement.pattern = element.pattern;
        wsdlElement.enumValues = element.enumValues;

        this.getChildren(element, wsdlElement);
        elements.push(wsdlElement);
      });
    }
    return {
      elements,
      simpleTypeElements,
      complexTypeElements
    };
  }


  /**
   * Find the objects from definitions
   * receives the names and find them in definitions
   * always returns an array
   * @param {object} parsedSchema the parsed schema element from a WSDL File
   * @param {object} typesFromWSDL the list to filter could be simple types complex or elements
   * @param {object} definitionsNames the found names in definitions
   * @param {string} parserPlaceholder the parser placeholder
   * @returns {Array} definitionsElements the objects from definitions
   */
  getTypesFromDefinitions(parsedSchema, typesFromWSDL, definitionsNames, parserPlaceholder) {
    let namesFromWSDL = typesFromWSDL.map((type) => {
        return getXMLAttributeByName(type, parserPlaceholder, ATRIBUTE_NAME);
      }),
      definitionsElements = definitionsNames.filter((definitionName) => {
        return namesFromWSDL.includes(definitionName);
      }).map((definitionName) => {
        return {
          ...parsedSchema.definitions[definitionName],
          name: definitionName
        };
      });
    return definitionsElements;
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
              element.enumValues = properties[key].enumValues;
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
    return getArrayFrom(schemaTag[schemaPrefix + COMPLEX_TYPE_TAG]);
  }

  /**
   * Get the simple types from the schema
   * always returns an array
   * @param {object} schemaTag the binding operation object
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[object]} simple types from the wsdl
   */
  getSimpleTypesFromSchema(schemaTag, schemaPrefix) {
    return getArrayFrom(schemaTag[schemaPrefix + SIMPLE_TYPE_TAG]);
  }

  /**
   * Get the simple types from the schema
   * always returns an array
   * @param {object} schemaTag the binding operation object
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[object]} simple types from the wsdl
   */
  getElementsFromSchema(schemaTag, schemaPrefix) {
    return getArrayFrom(schemaTag[schemaPrefix + 'element']);
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
   * @param {object} parsedSchema the parsed schema
   * @param {Array} complexTypes the identified complex types of the wsdl
   * @param {Array} simpleTypes the identified simple types of the wsdl
   * @returns {[Element]} the information of the types
   */
  searchAndAssignComplex(rootElement, parsedSchema, complexTypes, simpleTypes) {
    traverseUtility(rootElement).forEach((property) => {
      if (property) {
        let hasNonKnownType,
          isArray;
        isArray = Object.keys(property)
          .find(
            (key) => {
              return key === 'oneOf' || key === 'anyOf';
            }
          );
        if (isArray && property[isArray]) {
          if (property[isArray][0].$ref) {
            property.$ref = property[isArray][0].$ref;
            property[isArray] = undefined;
          }
          else {
            property.type = property[isArray][0].type;
            property.minLength = property[isArray][0].minLength;
            property.maxLength = property[isArray][0].maxLength;
            property.maximum = property[isArray][0].maximum;
            property.minimum = property[isArray][0].minimum;
            property.pattern = property[isArray][0].pattern;
            property.$ref = undefined;
          }
        }
        hasNonKnownType = Object.keys(property)
          .find(
            (key) => {
              return key === '$ref' && property[key] !== undefined;
            }
          );

        if (hasNonKnownType) {
          let complexType = '',
            type = property[hasNonKnownType];
          complexType = this.getComplexTypeByName(type, complexTypes);
          if (complexType) {
            property.properties = {};
            property.properties = complexType;
            property.type = 'complex';
            property.complexName = complexType.name;
            this.searchAndAssignComplex(property.properties, parsedSchema, complexTypes, simpleTypes);
          }
          else {
            this.processSimpleType(type, simpleTypes, property);
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
    if (simpleType.allOf) {
      this.processSimpleType(simpleType.allOf[0].$ref, simpleTypes, traverseObject);
      if (simpleType.allOf[1]) {
        let definition = simpleType.allOf[1];
        traverseObject.minLength = definition.minLength !== undefined ? definition.minLength : traverseObject.minLength;
        traverseObject.maxLength = definition.maxLength !== undefined ? definition.maxLength : traverseObject.maxLength;
        traverseObject.maximum = definition.maximum !== undefined ? definition.maximum : traverseObject.maximum;
        traverseObject.minimum = definition.minimum !== undefined ? definition.minimum : traverseObject.minimum;
        traverseObject.pattern = definition.pattern !== undefined ? definition.pattern : traverseObject.pattern;
      }
    }
    else if (simpleType.enum) {
      traverseObject.type = simpleType.type;
      traverseObject.enumValues = simpleType.enum;
      traverseObject.$ref = undefined;
    }
    else {
      traverseObject.type = simpleType.type;
      traverseObject.minLength = simpleType.minLength;
      traverseObject.maxLength = simpleType.maxLength;
      traverseObject.maximum = simpleType.maximum;
      traverseObject.minimum = simpleType.minimum;
      traverseObject.pattern = simpleType.pattern;
      traverseObject.$ref = undefined;
    }
  }

  /**
   * Get the complex type by name
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
   * Get the simple type by name
   * always returns an array
   * @param {string} simpleTypeName the simple type name too look for
   * @param {Array} simpleTypes the identified simple types
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

}

module.exports = {
  SchemaBuilderXSD
};
