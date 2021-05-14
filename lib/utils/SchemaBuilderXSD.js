const Parser = require('fast-xml-parser').j2xParser,
  parserOptions = {
    ignoreAttributes: false,
    cdataTagName: '__cdata',
    format: true,
    indentBy: '  ',
    supressEmptyNode: false
  },
  {
    ERROR_ELEMENT_IDENTIFIER
  } = require('../constants/processConstants'),
  {
    getArrayFrom
  } = require('./objectUtils'),
  {
    getXMLAttributeByName,
    getXMLNodeByName
  } = require('./XMLParsedUtils'),
  Element = require('../WSDLObject').Element,
  WsdlError = require('../WsdlError'),
  Xsd2JsonSchema = require('../../assets/xsd2jsonschemafaker').Xsd2JsonSchema,
  {
    isKnownType
  } = require('./knownTypes'),
  TYPES_TAG = 'types',
  ATTRIBUTE_TARGET_NAMESPACE = 'targetNamespace',
  SCHEMA_TAG = 'schema',
  MESSAGE_TAG = 'message',
  COMPLEX_TYPE_TAG = 'complexType',
  SIMPLE_TYPE_TAG = 'simpleType',
  ATTRIBUTE_NAME = 'name',
  ATTRIBUTE_PART = 'part',
  ATTRIBUTE_TYPE = 'type',
  ATTRIBUTE_ELEMENT = 'element',
  traverseUtility = require('traverse'),
  IS_KNOWN_TYPE = 'knownType',
  IS_ELEMENT = 'isElement',
  IS_SIMPLE_TYPE = 'isSimpleType',
  IS_COMPLEX_TYPE = 'isComplexType',
  ANONIMOUS = 'anonimous',
  REPLACE_CASES = [{
    tagName: 'all',
    newTagName: 'sequence'
  }],
  DEFINITIONS_FILTER = '#/definitions/',
  {
    createErrorElement
  } = require('./WSDLElementUtils'),
  {
    orderElementsAccordingToDependencies
  } = require('./orderSchemaItemsUtils');

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
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTEs
   * @returns {[Element]} the information of the types
   */
  getElements(parsedXml, principalPrefix, wsdlRoot, schemaNamespace, tnsNamespace, parserPlaceholder) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Cannot get elements from undefined or null object');
    }
    let elementsFromMessages = [],
      allElements = {};
    allElements.elements = [];
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);
    types.forEach((type) => {
      const schemaTag =
        type[schemaNamespace.prefixFilter + SCHEMA_TAG],
        targetNamespace =
          getXMLAttributeByName(schemaTag, parserPlaceholder, ATTRIBUTE_TARGET_NAMESPACE);
      let schema = this.getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespace, parserPlaceholder);
      allElements = this.getElementsFromType(type, this.parseSchema(schema),
        schemaNamespace.prefixFilter, targetNamespace, parserPlaceholder);
    });
    elementsFromMessages = this.getElementsFromMessages(parsedXml, principalPrefix,
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
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTEs
   * @param {string} wsdlRoot the corresponding wsdl root definitions or descriptions
   * @returns {[Element]} the information of the types
   */
  getElementsFromMessages(parsedXML, principalPrefix, elementsInTypes, simpleTypes, complexTypes, parserPlaceholder,
    wsdlRoot) {
    let filtered = '',
      newElements = [];
    const definitions = parsedXML[principalPrefix + wsdlRoot],
      messages = getArrayFrom(getXMLNodeByName(definitions, principalPrefix, MESSAGE_TAG));
    if (!messages) {
      return newElements;
    }
    filtered = messages.filter((message) => {
      let part = getXMLNodeByName(message, principalPrefix, ATTRIBUTE_PART),
        hasPartKey = Object.keys(part).find((key) => {
          if (key === '@_type') {
            return true;
          }
        });
      if (part.length > 1 || hasPartKey) {
        return message;
      }
    });

    filtered.forEach((message) => {
      let parts = [],
        wsdlElement = new Element();
      wsdlElement.name = getXMLAttributeByName(message, parserPlaceholder, ATTRIBUTE_NAME);
      wsdlElement.type = ANONIMOUS;
      wsdlElement.isComplex = true;
      wsdlElement.minOccurs = 0;
      wsdlElement.maxOccurs = 1;
      wsdlElement.children = [];
      parts = getArrayFrom(getXMLNodeByName(message, principalPrefix, ATTRIBUTE_PART));

      parts.forEach((part) => {
        let realPartTypeorelement = '',
          partType = getXMLAttributeByName(part, parserPlaceholder, ATTRIBUTE_TYPE),
          partName = getXMLAttributeByName(part, parserPlaceholder, ATTRIBUTE_NAME);
        if (!partType) {
          realPartTypeorelement = getXMLAttributeByName(part, parserPlaceholder, ATTRIBUTE_ELEMENT);
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
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTEs
   * @returns {string} the xml representation of the object
   */
  getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespace, parserPlaceholder) {
    let localSchemaTag = { ...schemaTag },
      objectSchema = {},
      schema;
    localSchemaTag[parserPlaceholder + 'xmlns:' + schemaNamespace.key] = schemaNamespace.url;
    localSchemaTag[parserPlaceholder + 'xmlns:' + tnsNamespace.key] = tnsNamespace.url;
    objectSchema = {};
    objectSchema[schemaNamespace.prefixFilter + SCHEMA_TAG] = localSchemaTag;
    schema = this.parseObjectToXML(objectSchema);
    REPLACE_CASES.forEach((replaceCase) => {
      schema = this.replaceTagInSchema(schema, schemaNamespace, replaceCase.tagName, replaceCase.newTagName);
    });
    return schema;
  }

  replaceTagInSchema(schema, schemaNamespace, tagName, newTagName) {
    if (!schema.includes(`<${schemaNamespace.prefixFilter}${tagName}>`)) {
      return schema;
    }
    let openTagRegexp = new RegExp(`<${schemaNamespace.prefixFilter}?${tagName}>`, 'g'),
      closeTagRegexp = new RegExp(`</${schemaNamespace.prefixFilter}?${tagName}>`, 'g'),
      newSchema = schema.replace(openTagRegexp, `<${schemaNamespace.prefixFilter}${newTagName}>`);

    newSchema = newSchema.replace(closeTagRegexp, `</${schemaNamespace.prefixFilter}${newTagName}>`);
    return newSchema;
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
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTEs
   * @returns {[Element]} the information of the types
   */
  getElementsFromType(type, parsedSchema, schemaPrefixFilter,
    targetNamespace, parserPlaceholder) {
    if (!parsedSchema || typeof parsedSchema !== 'object') {
      throw new WsdlError('Cannot get elements from undefined or null object');
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
    complexTypesFromWSDL = getArrayFrom(this.getComplexTypesFromSchema(scTag, schemaPrefixFilter));
    simpleTypesFromWSDL = getArrayFrom(this.getSimpleTypesFromSchema(scTag, schemaPrefixFilter));
    elementTypesFromWSDL = getArrayFrom(this.getElementsFromSchema(scTag, schemaPrefixFilter));

    complexTypesFromWSDL = complexTypesFromWSDL ? complexTypesFromWSDL : [];
    simpleTypesFromWSDL = simpleTypesFromWSDL ? simpleTypesFromWSDL : [];
    elementTypesFromWSDL = elementTypesFromWSDL ? elementTypesFromWSDL : [];

    elementsFromWSDL = this.getTypesFromDefinitions(parsedSchema, elementTypesFromWSDL,
      definitionsNames, parserPlaceholder);
    complexTypes = this.getTypesFromDefinitions(parsedSchema, complexTypesFromWSDL,
      definitionsNames, parserPlaceholder);
    simpleTypes = this.getTypesFromDefinitions(parsedSchema, simpleTypesFromWSDL,
      definitionsNames, parserPlaceholder);

    if (complexTypes) {
      this.processComplexOrSimpleTypesToElement(complexTypes, complexTypes, parsedSchema,
        simpleTypes, targetNamespace, complexTypeElements);
    }

    if (simpleTypes) {
      this.processComplexOrSimpleTypesToElement(simpleTypes, complexTypes, parsedSchema,
        simpleTypes, targetNamespace, complexTypeElements);
    }
    if (elementsFromWSDL) {
      this.processElementsToWSDElements(elementsFromWSDL, parsedSchema, complexTypes,
        simpleTypes, targetNamespace, elements);
    }
    return {
      elements,
      simpleTypeElements,
      complexTypeElements
    };
  }

  /**
   * Process the wsdl elements into WSDLObject elements
   * always returns an array
   * @param {Array} elementsFromWSDL the elements from the schema
   * @param {object} parsedSchema the parsed schema element from a WSDL File
   * @param {object} complexTypes the list of processed complex types
   * @param {object} simpleTypes the list of processed simple types
   * @param {object} targetNamespace the found namespace in wsdl
   * @param {string} elements the elements to fill in
   * @returns {undefined} returns nothing
   */
  processElementsToWSDElements(elementsFromWSDL, parsedSchema, complexTypes, simpleTypes, targetNamespace, elements) {
    let ordered = orderElementsAccordingToDependencies(elementsFromWSDL);
    ordered.forEach((element) => {
      let wsdlElement = new Element();
      this.searchAndAssignComplex(element, parsedSchema,
        complexTypes,
        simpleTypes, elements);
      wsdlElement.namespace = targetNamespace;
      wsdlElement.name = element.name;
      wsdlElement.type = this.getTypeOfElement(element);
      wsdlElement.isComplex = wsdlElement.type === 'complex';
      wsdlElement.isElement = true;
      wsdlElement.minOccurs = this.getMinOccursOfElement(element, wsdlElement.name);
      wsdlElement.maxOccurs = this.getMaxOccursOfElement(element, wsdlElement.name);
      wsdlElement.minimum = element.minimum;
      wsdlElement.maximum = element.maximum;
      wsdlElement.maxLength = element.maxLength;
      wsdlElement.minLength = element.minLength;
      wsdlElement.pattern = element.pattern;
      wsdlElement.enumValues = element.enumValues;

      this.getChildren(JSON.parse(JSON.stringify(element)), wsdlElement, elements);
      elements.push(wsdlElement);
    });
  }

  /**
   * Process the wsdl simple or complex types into WSDLObject elements
   * always returns an array
   * @param {Array} origin the elements from the schema to traverse
   * @param {object} complexTypes the list of processed complex types
   * @param {object} parsedSchema the parsed schema element from a WSDL File
   * @param {object} simpleTypes the list of processed simple types
   * @param {object} targetNamespace the found namespace in wsdl
   * @param {string} typeElements the elements to fill in
   * @returns {undefined} returns nothing
   */
  processComplexOrSimpleTypesToElement(origin, complexTypes, parsedSchema, simpleTypes, targetNamespace, typeElements) {
    origin.forEach((element) => {
      let wsdlElement = new Element();
      this.searchAndAssignComplex(JSON.parse(JSON.stringify(element)),
        parsedSchema, complexTypes,
        simpleTypes);
      wsdlElement.namespace = targetNamespace;
      wsdlElement.name = element.name;
      wsdlElement.type = this.getTypeOfElement(element);
      wsdlElement.isElement = false;
      wsdlElement.isComplex = wsdlElement.type === 'complex';
      wsdlElement.minOccurs = this.getMinOccursOfElement(element, wsdlElement.name);
      wsdlElement.maxOccurs = this.getMaxOccursOfElement(element, wsdlElement.name);
      wsdlElement.minimum = element.minimum;
      wsdlElement.maximum = element.maximum;
      wsdlElement.maxLength = element.maxLength;
      wsdlElement.minLength = element.minLength;
      wsdlElement.pattern = element.pattern;
      wsdlElement.enumValues = element.enumValues;

      this.getChildren(element, wsdlElement, typeElements);
      typeElements.push(wsdlElement);
    });
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
    let namesFromWSDL, definitionsElements;
    namesFromWSDL = typesFromWSDL.map((type) => {
      return getXMLAttributeByName(type, parserPlaceholder, ATTRIBUTE_NAME);
    });
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
   * @param {Array} processedElements the already proccesed elements
   * @returns {object} assigns elements to object
   */
  getChildren(rootElement, wsdlElement, processedElements) {
    let children = [];
    wsdlElement.children = children;
    traverseUtility(rootElement).forEach((property) => {
      if (property) {
        let properties = property.properties;
        if (properties) {
          let keys = Object.keys(properties);
          keys.forEach((key) => {
            if (properties[key]) {
              let hasRef = properties[key] ? properties[key].$ref : undefined;
              if (this.isScalarType(properties, key, hasRef)) {
                let element = this.getChildScalarType(key, properties, property);
                children.push(element);
                wsdlElement.children = children;
              }
              else if (this.isComplexType(properties, key, hasRef)) {
                this.assignChildComplex(properties, key, wsdlElement, processedElements, property);
              }
            }
          });
        }
      }
    });
  }


  /**
   * identifies if the element is scalar e.g. integer string and so on
   * according to its type if has a named reference and if it is a known type
   * @param {object} properties object properties of the json schema
   * @param {key} key the property field to check
   * @param {string} hasRef if the element has a named reference
   * @returns {boolean} true if found it as scalar
   */
  isScalarType(properties, key, hasRef) {
    return properties[key].type !== 'object' && !hasRef && isKnownType(properties[key].type);
  }

  /**
   * identifies if the element is complex e.g. simple types complex types and elements
   * of the wsdl.
   * according to its type if has a named reference
   * @param {object} properties object properties of the json schema
   * @param {key} key the property field to check
   * @param {string} hasRef if the element has a named reference
   * @returns {boolean} true if found it as complex
   */
  isComplexType(properties, key, hasRef) {
    return properties[key].type === 'object' || hasRef;
  }

  /**
   * creates a wsdl element with its scalar type
   * @param {key} key the property field to check
   * @param {object} properties object properties of the json schema
   * @param {object} property if the element has a named reference
   * @returns {WsdlElement} the created element
   */
  getChildScalarType(key, properties, property) {
    let element = new Element(),
      propertiesObject = properties[key];
    element.name = key;
    element.type = propertiesObject.type;
    element.minimum = propertiesObject.minimum;
    element.maximum = propertiesObject.maximum;
    element.maxLength = propertiesObject.maxLength;
    element.minLength = propertiesObject.minLength;
    element.pattern = propertiesObject.pattern;
    element.enumValues = propertiesObject.enumValues;
    element.isComplex = false;
    element.children = [];
    element.minOccurs = this.getMinOccursOfElement(property, key);
    element.maxOccurs = this.getMaxOccursOfElement(property, key);
    return element;
  }

  /**
   * creates a wsdl element from a wsdl element type
   * @param {key} key the property field to check
   * @param {object} properties object properties of the json schema
   * @param {object} property if the element has a named reference
   * @param {Array} preprocessed preprocessed elements to look for
   * @returns {WsdlElement} the created element
   */
  getChildElement(key, properties, property, preprocessed) {
    let element = new Element();
    element.name = key;
    element.type = properties[key].complexName;
    element.isComplex = true;
    element.minOccurs = this.getMinOccursOfElement(property, key);
    element.maxOccurs = this.getMaxOccursOfElement(property, key);
    element.children = [];
    if (preprocessed.children) {
      element.children = preprocessed.children.concat([]);
    }
    return element;
  }

  /**
   * creates and asigns a wsdl element from a wsdl simple complex or element
   * @param {object} properties object properties of the json schema
   * @param {string} key the property field to check
   * @param {WsdlElement} wsdlElement the parent element
   * @param {object} processedElements preprocessed elements
   * @param {object} property if the element has a named reference
   * @returns {WsdlElement} the created element
   */
  assignChildComplex(properties, key, wsdlElement, processedElements, property) {
    let element = new Element();
    if (properties[key].type === ERROR_ELEMENT_IDENTIFIER) {
      element = createErrorElement(key);
      wsdlElement.children.push(element);
    }
    else {
      let preprocessed = this.findIfPreviousProcessedElement(processedElements, properties, key);
      if (!preprocessed) {
        element.name = key;
        element.type = properties[key].complexName;
        element.isComplex = true;
        element.minOccurs = this.getMinOccursOfElement(property, key);
        element.maxOccurs = this.getMaxOccursOfElement(property, key);
        wsdlElement.children.push(element);
        if (property.properties[key].properties) {
          this.getChildren(property.properties[key], element, processedElements);
          property.properties[key] = {};
        }
      }
      else if (preprocessed.isElement) {
        element = this.getChildElement(key, properties, property, preprocessed, wsdlElement);
        wsdlElement.children.push(element);
        property.properties[key] = {};
      }
      else {
        wsdlElement.children.push(preprocessed);
      }
    }
  }

  /**
   * Finds an element if this was previously processed
   * @param {Array} preProcessedElements the elements that are
   * already processed
   * @param {string} properties schema properties
   * @param {string} key the elements name
   * @returns {element} assigns elements to object
   */
  findIfPreviousProcessedElement(preProcessedElements, properties, key) {
    let name = properties[key].complexName ? properties[key].complexName :
      properties[key].$ref.replace(DEFINITIONS_FILTER, '');
    if (!preProcessedElements) {
      return;
    }
    const element = preProcessedElements.find((current) => {
      return current.name === name;
    });
    return element;
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
      throw new WsdlError('Cannot get types from undefined or null object');
    }
    try {
      const definitions = parsedXml[principalPrefix + wsdlRoot],
        types = getArrayFrom(definitions[principalPrefix + TYPES_TAG]);
      if (Array.isArray(types)) {
        return types;
      }
      return [];
    }
    catch (error) {
      throw new WsdlError('Cannot get types from object');
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
   * @param {Array} elements preprocessed elements
   * @returns {[Element]} the information of the types
   */
  searchAndAssignComplex(rootElement, parsedSchema, complexTypes, simpleTypes, elements) {
    traverseUtility(rootElement).forEach((property) => {
      if (property) {
        let hasReferenceTypeKey,
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
        hasReferenceTypeKey = Object.keys(property)
          .find(
            (key) => {
              return key === '$ref' && property[key] !== undefined;
            }
          );
        if (hasReferenceTypeKey) {
          this.processReferenceTypeOfSchema(property, hasReferenceTypeKey, complexTypes, parsedSchema,
            simpleTypes, elements);
        }
      }
    });
  }

  /**
   * Process the schema element if has a reference could be to a
   * simple type complex tye or element
   * @param {object} property the schema object that we are traversing
   * @param {string} hasReferenceTypeKey the property key that indicates a reference
   * @param {Array} complexTypes the identified complex types of the wsdl
   * @param {object} parsedSchema the parsed schema
   * @param {Array} simpleTypes the identified simple types of the wsdl
   * @param {Array} elements preprocessed elements
   * @returns {[Element]} the information of the types
   */
  processReferenceTypeOfSchema(property, hasReferenceTypeKey, complexTypes, parsedSchema, simpleTypes, elements) {
    let complexType = '',
      elementType = '',
      type = property[hasReferenceTypeKey];
    complexType = this.getComplexTypeByName(type, complexTypes);
    if (complexType) {
      property.properties = {};
      property.properties = complexType;
      property.type = 'complex';
      property.complexName = complexType.name;
      this.searchAndAssignComplex(property.properties, parsedSchema, complexTypes, simpleTypes,
        elements);
    }
    else {
      elementType = this.getElementTypeByName(type, elements);
      if (elementType) {
        property.properties = {};
        property.properties = elementType;
        property.type = 'complex';
        property.complexName = elementType.name;
        this.searchAndAssignComplex(property.properties, parsedSchema, complexTypes, simpleTypes,
          elements);
      }
      else {
        this.processSimpleTypeSchema(type, simpleTypes, property);
      }
    }
  }

  /**
   * reads the simple type and assign the properties directly
   * always returns an array
   * @param {string} typeName the simple type name too look for
   * @param {array} simpleTypes the simple types from the wsdl
   * @param {object} traverseObject the traversing object
   * @returns {object} the data
   */
  processSimpleTypeSchema(typeName, simpleTypes, traverseObject) {
    let simpleType = this.getSimpleTypeByName(typeName, simpleTypes);
    if (!simpleType) {
      traverseObject.properties = {};
      traverseObject.type = ERROR_ELEMENT_IDENTIFIER;
      traverseObject.complexName = typeName;
      return;
    }
    if (simpleType.allOf) {
      this.processSimpleTypeSchema(simpleType.allOf[0].$ref, simpleTypes, traverseObject);
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
      complexTypeNameFound = complexTypeName.replace(DEFINITIONS_FILTER, '');
    complexType = complexTypes.find((complexType) => {
      return complexType.name === complexTypeNameFound;
    });
    return complexType;
  }

  /**
   * Get the complex type by name
   * always returns an array
   * @param {string} name the complex type name too look for
   * @param {string} elements the preprocessed elements
   * @returns {object} the found complex type
   */
  getElementTypeByName(name, elements) {
    if (!elements) {
      return;
    }
    let elementType,
      typeName = name.replace(DEFINITIONS_FILTER, '');
    elementType = elements.find((type) => {
      return type.name === typeName;
    });
    return elementType;
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

      simpleTypeNameFound = simpleTypeName.replace(DEFINITIONS_FILTER, '');
    simpleType = simpleTypes.find((simpleType) => {
      return simpleType.name === simpleTypeNameFound;
    });

    return simpleType;
  }

}

module.exports = {
  SchemaBuilderXSD
};
