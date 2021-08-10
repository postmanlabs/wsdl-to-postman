const Parser = require('fast-xml-parser').j2xParser,
  parserOptions = {
    ignoreAttributes: false,
    cdataTagName: '__cdata',
    format: true,
    indentBy: '  ',
    supressEmptyNode: false
  },
  {
    getLastSegmentURL
  } = require('./textUtils'),
  {
    ERROR_ELEMENT_IDENTIFIER
  } = require('../constants/processConstants'),
  {
    getArrayFrom,
    getDeepCopyOfObject,
    getShallowCopyOfObject
  } = require('./objectUtils'),
  {
    getXMLAttributeByName,
    getXMLNodeByName
  } = require('./XMLParsedUtils'),
  Element = require('../WSDLObject').Element,
  {
    orderSchemasAccordingToDependencies
  } = require('../../lib/utils/orderSchemasByDependency'),
  WsdlError = require('../WsdlError'),
  {
    isKnownType
  } = require('./knownTypes'),
  {
    COMPLEX_TYPE_TAG,
    GROUP_TAG,
    SIMPLE_TYPE_TAG,
    ATTRIBUTE_ELEMENT
  } = require('../constants/XSDConstants'),

  TYPES_TAG = 'types',
  ATTRIBUTE_TARGET_NAMESPACE = 'targetNamespace',
  SCHEMA_TAG = 'schema',
  MESSAGE_TAG = 'message',
  ATTRIBUTE_NAME = 'name',
  ATTRIBUTE_PART = 'part',
  ATTRIBUTE_TYPE = 'type',
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
  } = require('./orderSchemaItemsUtils'),
  {
    XSDToJsonSchemaParser
  } = require('../XSDToJsonSchemaParser');

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
   * @param {WSDLObject} wsdlObject the wsdlObject parsed object
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTEs
   * @returns {[Element]} the information of the types
   */
  getElements(parsedXml, principalPrefix, wsdlRoot, wsdlObject, parserPlaceholder) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Cannot get elements from undefined or null wsdl');
    }
    let elementsFromMessages = [],
      xsdParser = new XSDToJsonSchemaParser(),
      allElements = {};
    allElements.elements = [];
    allElements.simpleTypeElements = [];
    allElements.complexTypeElements = [];
    allElements.groupElements = [];

    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);
    types.forEach((type) => {
      let schemaTags = [],
        jsonSchemas,
        mergedDefinitionsSchema,
        schemaStrings = [];
      schemaTags = this.getSchemasInformation(type, wsdlObject, parserPlaceholder);

      const orderedSchemas = orderSchemasAccordingToDependencies(schemaTags, parserPlaceholder,
        wsdlObject.allNameSpaces);

      orderedSchemas.forEach((schemaTag) => {

        schemaStrings.push(this.getXMLSchemaProcessed(schemaTag.foundSchemaTag, schemaTag.foundLocalSchemaNamespace,
          schemaTag.targetNamespace, parserPlaceholder));
      });
      jsonSchemas = xsdParser.parseAllSchemas(schemaStrings);
      mergedDefinitionsSchema = this.mergeAllSchemaDefinitionsInOne(jsonSchemas);

      orderedSchemas.forEach((schema) => {
        this.getWSDLElementsFromJsonSchema({ jsonSchema: mergedDefinitionsSchema, schemaTagInformation: schema,
          parserPlaceholder,
          elements: allElements.elements, simpleTypeElements: allElements.simpleTypeElements,
          complexTypeElements: allElements.complexTypeElements, groupElements: allElements.groupElements });
      });
    });
    elementsFromMessages = this.getElementsFromMessages(parsedXml, principalPrefix,
      allElements.elements, allElements.simpleTypeElements, allElements.complexTypeElements,
      parserPlaceholder, wsdlRoot);
    return allElements.elements.concat(elementsFromMessages);
  }


  /**
   * Takes in an array of JsonSchemas and merge them into one
   * takes the global information from the first one
   * @param {Array} jsonSchemas Json Schemas array
   * @returns {object} the merged jsonSchema
   */
  mergeAllSchemaDefinitionsInOne(jsonSchemas) {
    let mergedDefinitionsSchema;
    if (jsonSchemas && jsonSchemas.length > 0) {
      mergedDefinitionsSchema = getDeepCopyOfObject(jsonSchemas[0]);
      var definitions = {};
      jsonSchemas.forEach((jsonSchema) => {
        Object.keys(jsonSchema.definitions).forEach((defName) => {
          definitions[defName] = jsonSchema.definitions[defName];
        });
      });
      mergedDefinitionsSchema.definitions = definitions;
    }
    return mergedDefinitionsSchema;
  }

  /**
   * Returns all the schema tags information
   * tag information namespace definition and target Namespace
   * @param {object} typeElement the element "type" from wsdl
   * @param {WSDLObject} wsdlObject the whole wsdl object
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTE
   * @returns {[Element]} the information of the types
   */
  getSchemasInformation(typeElement, wsdlObject, parserPlaceholder) {
    let schemaTags = [],
      globalSchemaTag,
      schemasToReturn = [],
      schemasWithLocalDefinition,
      uniqueTargetNamespaces,
      targetNamespaces;

    if (wsdlObject.schemaNamespace) {
      globalSchemaTag =
        getArrayFrom(typeElement[wsdlObject.schemaNamespace.prefixFilter + SCHEMA_TAG]);
    }
    if (globalSchemaTag) {
      globalSchemaTag.forEach((schemaTag) => {
        schemaTags.push({
          foundSchemaTag: schemaTag,
          foundLocalSchemaNamespace: wsdlObject.schemaNamespace,
          targetNamespace: getXMLAttributeByName(schemaTag, parserPlaceholder, ATTRIBUTE_TARGET_NAMESPACE)
        });
      });
    }
    schemasWithLocalDefinition = this.getSchemaInfoFromLocalDeclaredNamespacesDefinition(wsdlObject, typeElement,
      parserPlaceholder);
    if (schemasWithLocalDefinition) {
      schemasWithLocalDefinition.forEach((schema) => {
        schemaTags.push(schema);
      });
      targetNamespaces = schemaTags.map((tag) => {
        return tag.targetNamespace;
      });
      uniqueTargetNamespaces = this.getUniqueElementsFromArray(targetNamespaces);
      uniqueTargetNamespaces.forEach((uniqueTN) => {
        schemasToReturn.push(schemaTags.find((schema) => {
          return uniqueTN === schema.targetNamespace;
        }));
      });
    }
    else {
      return schemaTags;
    }
    return schemasToReturn;
  }

  /**
   * Returns a filtered array with no duplicates
   * @param {Array} array to get unique elements
   * @returns {Array} the filtered array
   */
  getUniqueElementsFromArray(array) {
    return array.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  /**
   * Returns the schema tag and namespace definition locally defined (inside the schema tag)
   * @param {WSDLObject} wsdlObject the wsdlObject parsed object
   * @param {object} type the type element from the wsdl (element tag)
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTE
   * @returns {[Element]} the information of the types
   */
  getSchemaInfoFromLocalDeclaredNamespacesDefinition(wsdlObject, type, parserPlaceholder) {
    if (wsdlObject.localSchemaNamespaces) {
      let result = [];
      for (let index = 0; index < wsdlObject.localSchemaNamespaces.length; index++) {
        let schemasInlocal =
          getArrayFrom(type[wsdlObject.localSchemaNamespaces[index].prefixFilter + SCHEMA_TAG]);

        schemasInlocal.forEach((foundSchema) => {
          result.push({
            foundSchemaTag: foundSchema,
            foundLocalSchemaNamespace: wsdlObject.localSchemaNamespaces[index],
            targetNamespace: getXMLAttributeByName(foundSchema,
              parserPlaceholder, ATTRIBUTE_TARGET_NAMESPACE)
          });
        });
      }
      return result;
    }
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
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTE
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
          if (key === `${parserPlaceholder}type`) {
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
              let element = getShallowCopyOfObject(type);
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
   * Takes the schema object add the needed namespaces
   * and return the xml of the schema
   * @param {object} schemaTag the wsdl schema information object
   * @param {NameSpace} schemaNamespace  the schema namespace information from the wsdl
   * @param {NameSpace} tnsNamespaceURL  the this namespace url
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTEs
   * @returns {string} the xml representation of the object
   */
  getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespaceURL, parserPlaceholder) {
    let localSchemaTag = {
        ...schemaTag
      },
      objectSchema = {},
      schema;
    if (schemaNamespace.key === '') {
      localSchemaTag[parserPlaceholder + 'xmlns'] = undefined;
    }
    else {
      localSchemaTag[parserPlaceholder + 'xmlns:' + schemaNamespace.key] = schemaNamespace.url;
    }
    localSchemaTag[parserPlaceholder + 'xmlns:tns'] = tnsNamespaceURL;
    objectSchema = {};
    objectSchema[schemaNamespace.prefixFilter + SCHEMA_TAG] = localSchemaTag;
    schema = this.parseObjectToXML(objectSchema);
    REPLACE_CASES.forEach((replaceCase) => {
      schema = this.replaceTagInSchema(schema, schemaNamespace, replaceCase.tagName, replaceCase.newTagName);
    });
    return schema;
  }

  /**
   * Takes an schema in instring xml and replace the tagName with newTagName
   * @param {string} schema schema in xml representation
   * @param {object} schemaNamespace the schema information (prefix)
   * @param {string} tagName the tag to substitute
   * @param {string} newTagName the new tag
   * @returns {string} the modified string xml
   */
  replaceTagInSchema(schema, schemaNamespace, tagName, newTagName) {
    if (!schema.includes(`<${schemaNamespace.prefixFilter}${tagName}>`)) {
      return schema;
    }
    let newSchema;
    if (schemaNamespace.prefixFilter !== '') {
      let openTagRegexp = new RegExp(`<${schemaNamespace.prefixFilter}?${tagName}>`, 'g'),
        closeTagRegexp = new RegExp(`</${schemaNamespace.prefixFilter}?${tagName}>`, 'g');
      newSchema = schema.replace(openTagRegexp, `<${schemaNamespace.prefixFilter}${newTagName}>`);
      newSchema = newSchema.replace(closeTagRegexp, `</${schemaNamespace.prefixFilter}${newTagName}>`);
    }
    else {
      let openTagRegexp = new RegExp(`<${tagName}>`, 'g'),
        closeTagRegexp = new RegExp(`</${tagName}>`, 'g');
      newSchema = schema.replace(openTagRegexp, `<${newTagName}>`);
      newSchema = newSchema.replace(closeTagRegexp, `</${newTagName}>`);
    }

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
   * @param {string} jsonSchema the parsed jsonSchema
   * @param {string} schemaTagInformation the schema tag information
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTEs
   * @param {Array} elements the WSDL Schema Elements objects
   * @param {Array} simpleTypeElements the WSDL Schema simple types objects
   * @param {Array} complexTypeElements the WSDL Schema complex types objects
   * @param {Array} groupElements the WSDL Schema group objects
   * @returns {[Element]} the information of the types
   */
  getWSDLElementsFromJsonSchema({ jsonSchema, schemaTagInformation, parserPlaceholder, elements,
    simpleTypeElements, complexTypeElements, groupElements }) {
    if (!jsonSchema || typeof jsonSchema !== 'object') {
      console.error('Cannot get elements from undefined or null object');
      return {
        elements: [],
        simpleTypeElements: [],
        complexTypeElements: []
      };
    }
    let complexTypesFromCurrentTag = [],
      simpleTypesFromCurrentTag = [],
      elementTypesFromCurrentTag = [],
      groupsFromCurrentTag = [],
      jsonSchemaComplexTypesFromCurrentTag,
      jsonSchemaSimpleTypesFromCurrentTag,
      jsonSchemaGroupsFromCurrentTag,
      previousPlusCurrentSimple,
      previousPlusCurrentComplex,
      jsonSchemaElementsFromCurrentTag,
      targetNamespace = schemaTagInformation.targetNamespace,
      schemaPrefixFilter = schemaTagInformation.foundLocalSchemaNamespace.prefixFilter,
      jsonSchemaClxTypesProcessed,
      jsonSchemaGroupsProcessed,
      jsonSchemaSimpleTypesProcessed;
    const definitionsNames = Object.keys(jsonSchema.definitions),
      scTag = schemaTagInformation.foundSchemaTag;
    complexTypesFromCurrentTag = getArrayFrom(this.getComplexTypesFromSchema(scTag, schemaPrefixFilter));
    simpleTypesFromCurrentTag = getArrayFrom(this.getSimpleTypesFromSchema(scTag, schemaPrefixFilter));
    elementTypesFromCurrentTag = getArrayFrom(this.getElementsFromSchema(scTag, schemaPrefixFilter));
    groupsFromCurrentTag = getArrayFrom(this.getGroupsFromSchema(scTag, schemaPrefixFilter));

    complexTypesFromCurrentTag = complexTypesFromCurrentTag ? complexTypesFromCurrentTag : [];
    simpleTypesFromCurrentTag = simpleTypesFromCurrentTag ? simpleTypesFromCurrentTag : [];
    elementTypesFromCurrentTag = elementTypesFromCurrentTag ? elementTypesFromCurrentTag : [];
    groupsFromCurrentTag = groupsFromCurrentTag ? groupsFromCurrentTag : [];

    jsonSchemaElementsFromCurrentTag = this.getTypesFromDefinitions(jsonSchema, elementTypesFromCurrentTag,
      definitionsNames, parserPlaceholder);
    jsonSchemaComplexTypesFromCurrentTag = this.getTypesFromDefinitions(jsonSchema, complexTypesFromCurrentTag,
      definitionsNames, parserPlaceholder);
    jsonSchemaSimpleTypesFromCurrentTag = this.getTypesFromDefinitions(jsonSchema, simpleTypesFromCurrentTag,
      definitionsNames, parserPlaceholder);
    jsonSchemaGroupsFromCurrentTag = this.getTypesFromDefinitions(jsonSchema, groupsFromCurrentTag,
      definitionsNames, parserPlaceholder);

    jsonSchemaClxTypesProcessed = this.getPreviousProcessedDefinitionsFromJsonSchema(jsonSchema,
      complexTypeElements,
      definitionsNames);
    jsonSchemaSimpleTypesProcessed = this.getPreviousProcessedDefinitionsFromJsonSchema(jsonSchema,
      simpleTypeElements,
      definitionsNames);
    jsonSchemaGroupsProcessed = this.getPreviousProcessedDefinitionsFromJsonSchema(jsonSchema,
      groupElements,
      definitionsNames);

    if (jsonSchemaSimpleTypesFromCurrentTag && jsonSchemaSimpleTypesFromCurrentTag.length > 0) {
      this.processComplexOrSimpleTypesToElement(jsonSchemaSimpleTypesFromCurrentTag,
        jsonSchemaClxTypesProcessed,
        jsonSchemaSimpleTypesProcessed, targetNamespace, simpleTypeElements);
    }

    if (jsonSchemaGroupsFromCurrentTag && jsonSchemaGroupsFromCurrentTag.length > 0) {
      this.processComplexOrSimpleTypesToElement(jsonSchemaGroupsFromCurrentTag,
        jsonSchemaClxTypesProcessed,
        jsonSchemaSimpleTypesProcessed, targetNamespace, groupElements);
    }

    previousPlusCurrentSimple = jsonSchemaSimpleTypesFromCurrentTag.concat(jsonSchemaSimpleTypesProcessed);
    previousPlusCurrentSimple = previousPlusCurrentSimple.concat(jsonSchemaGroupsFromCurrentTag);
    previousPlusCurrentSimple = previousPlusCurrentSimple.concat(jsonSchemaGroupsProcessed);


    if (jsonSchemaComplexTypesFromCurrentTag && jsonSchemaComplexTypesFromCurrentTag.length > 0) {
      this.processComplexOrSimpleTypesToElement(jsonSchemaComplexTypesFromCurrentTag,
        jsonSchemaClxTypesProcessed,
        previousPlusCurrentSimple, targetNamespace, complexTypeElements);
    }

    previousPlusCurrentComplex = jsonSchemaComplexTypesFromCurrentTag.concat(jsonSchemaClxTypesProcessed);

    if (jsonSchemaElementsFromCurrentTag && jsonSchemaElementsFromCurrentTag.length > 0) {
      this.processElementsToWSDElements(jsonSchemaElementsFromCurrentTag, previousPlusCurrentComplex,
        previousPlusCurrentSimple, targetNamespace, elements);
    }
    return {
      elements,
      simpleTypeElements,
      complexTypeElements,
      groupElements
    };
  }

  /**
   * Process the wsdl elements into WSDLObject elements
   * always returns an array
   * @param {Array} elementsFromWSDL the elements from the schema
   * @param {object} complexTypes the list of processed complex types
   * @param {object} simpleTypes the list of processed simple types
   * @param {object} targetNamespace the found namespace in wsdl
   * @param {string} elements the elements to fill in
   * @returns {undefined} returns nothing
   */
  processElementsToWSDElements(elementsFromWSDL, complexTypes, simpleTypes, targetNamespace, elements) {
    let ordered = orderElementsAccordingToDependencies(elementsFromWSDL);
    ordered.forEach((element) => {
      let wsdlElement = new Element();
      this.searchAndAssignComplex(element,
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
      wsdlElement.enum = element.enum;

      this.getChildren(JSON.parse(JSON.stringify(element)), wsdlElement, elements);
      elements.push(wsdlElement);
    });
  }

  /**
   * Process the wsdl simple or complex types into WSDLObject elements
   * always returns an array
   * @param {Array} origin the elements from the schema to traverse
   * @param {object} complexTypes the list of processed complex types
   * @param {object} simpleTypes the list of processed simple types
   * @param {object} targetNamespace the found namespace in wsdl
   * @param {string} typeElements the elements to fill in
   * @returns {undefined} returns nothing
   */
  processComplexOrSimpleTypesToElement(origin, complexTypes, simpleTypes, targetNamespace, typeElements) {
    let ordered = orderElementsAccordingToDependencies(origin);
    ordered.forEach((element) => {
      let wsdlElement = new Element();
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
      wsdlElement.enum = element.enum;

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
    let namesFromWSDL,
      definitionsElements,
      allNames = [];
    namesFromWSDL = typesFromWSDL.map((type) => {
      return getXMLAttributeByName(type, parserPlaceholder, ATTRIBUTE_NAME);
    });
    allNames = namesFromWSDL;
    definitionsElements = definitionsNames.filter((definitionName) => {
      return allNames.includes(definitionName);
    }).map((definitionName) => {
      return {
        ...parsedSchema.definitions[definitionName],
        name: definitionName,
        fullName: `${parsedSchema.$id}#/definitions/${definitionName}`
      };
    });
    return definitionsElements;
  }

  /**
   * Find the previous processed elements (simple or complex)
   * receives the names and find them in definitions
   * always returns an array
   * @param {object} parsedSchema the parsed schema element from a WSDL File
   * @param {Array} previousProcessedItems simple or complex types already processed
   * @param {Array} definitionsNames the found names in definitions
   * @returns {Array} definitionsElements the objects from definitions
   */
  getPreviousProcessedDefinitionsFromJsonSchema(parsedSchema, previousProcessedItems, definitionsNames) {
    let definitionsElements,
      namesPreviousProcessed;

    namesPreviousProcessed = previousProcessedItems.map((previous) => {
      return previous.name;
    });
    definitionsElements = definitionsNames.filter((definitionName) => {
      return namesPreviousProcessed.includes(definitionName);
    }).map((definitionName) => {
      return {
        ...parsedSchema.definitions[definitionName],
        name: definitionName,
        fullName: `${parsedSchema.$id}#/definitions/${definitionName}`
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
   * Get the max occurs of an element
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
    element.enum = propertiesObject.enum;
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
   * Get the complex types from the schema
   * always returns an array
   * @param {object} schemaTag the binding operation object
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[object]} complex types from the wsdl
   */
  getGroupsFromSchema(schemaTag, schemaPrefix) {
    return getArrayFrom(schemaTag[schemaPrefix + GROUP_TAG]);
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
   * @param {Array} complexTypes the identified complex types of the wsdl
   * @param {Array} simpleTypes the identified simple types of the wsdl
   * @param {Array} elements preprocessed elements
   * @returns {[Element]} the information of the types
   */
  searchAndAssignComplex(rootElement, complexTypes, simpleTypes, elements) {
    traverseUtility(rootElement).forEach((property) => {
      if (property) {
        let hasReferenceTypeKey,
          oneOfOrAnyOf;
        oneOfOrAnyOf = Object.keys(property)
          .find(
            (key) => {
              return key === 'oneOf' || key === 'anyOf';
            }
          );
        if (oneOfOrAnyOf && property[oneOfOrAnyOf]) {
          this.handleOneOfAnyOf(oneOfOrAnyOf, property);
        }
        hasReferenceTypeKey = Object.keys(property)
          .find(
            (key) => {
              return key === '$ref' && property[key] !== undefined;
            }
          );
        if (hasReferenceTypeKey && property.$ref !== null) {
          this.processReferenceTypeOfSchema(property, hasReferenceTypeKey, complexTypes,
            simpleTypes, elements);
        }
      }
    });
  }

  /**
   * If oneOf or anyOf is present take the first element
   * simple type complex tye or element
   * @param {string} oneOfOrAnyOf the property name
   * @param {object} currentSchemaProperty the jsonSchema property
   * @returns {undefined} nothing
   */
  handleOneOfAnyOf(oneOfOrAnyOf, currentSchemaProperty) {
    let complexProperty = currentSchemaProperty[oneOfOrAnyOf][0].properties;
    if (currentSchemaProperty[oneOfOrAnyOf][0].$ref) {
      currentSchemaProperty.$ref = currentSchemaProperty[oneOfOrAnyOf][0].$ref;
      currentSchemaProperty[oneOfOrAnyOf] = undefined;
    }
    else if (complexProperty) {
      let firstChoice = currentSchemaProperty[oneOfOrAnyOf][0];
      currentSchemaProperty[oneOfOrAnyOf] = [firstChoice];
    }
    else {
      currentSchemaProperty.type = currentSchemaProperty[oneOfOrAnyOf][0].type;
      currentSchemaProperty.minLength = currentSchemaProperty[oneOfOrAnyOf][0].minLength;
      currentSchemaProperty.maxLength = currentSchemaProperty[oneOfOrAnyOf][0].maxLength;
      currentSchemaProperty.maximum = currentSchemaProperty[oneOfOrAnyOf][0].maximum;
      currentSchemaProperty.minimum = currentSchemaProperty[oneOfOrAnyOf][0].minimum;
      currentSchemaProperty.pattern = currentSchemaProperty[oneOfOrAnyOf][0].pattern;
      currentSchemaProperty.$ref = undefined;
    }
  }

  /**
   * Process the schema element if has a reference could be to a
   * simple type complex tye or element
   * @param {object} property the schema object that we are traversing
   * @param {string} hasReferenceTypeKey the property key that indicates a reference
   * @param {Array} complexTypes the identified complex types of the wsdl
   * @param {Array} simpleTypes the identified simple types of the wsdl
   * @param {Array} elements preprocessed elements
   * @returns {[Element]} the information of the types
   */
  processReferenceTypeOfSchema(property, hasReferenceTypeKey, complexTypes, simpleTypes, elements) {
    let complexType = '',
      elementType = '',
      type = property[hasReferenceTypeKey];
    complexType = this.getComplexTypeByName(type, complexTypes);
    if (complexType) {
      property.properties = {};
      property.properties = complexType;
      property.type = 'complex';
      property.complexName = complexType.name;
      if (property.name !== property.properties.name &&
              !this.isSelfReferenceElement(property.properties, type)) {
        this.searchAndAssignComplex(property.properties, complexTypes, simpleTypes,
          elements);
      }
    }
    else {
      elementType = this.getElementTypeByName(type, elements);
      if (elementType) {
        property.properties = {};
        property.properties = elementType;
        property.type = 'complex';
        property.complexName = elementType.name;
        this.searchAndAssignComplex(property.properties, complexTypes, simpleTypes,
          elements);
      }
      else {
        this.processSimpleTypeSchema(type, simpleTypes, property, complexTypes, elements);
      }
    }
  }

  /**
   * Identifies if an element has a reference to itself to avoid infinit loop
   * @param {object} elementProperties the properties of the root parent
   * @param {string} complexTypeName the name of the type
   * @returns {Boolean} true if the element has a reference to itself otherwise false
   */
  isSelfReferenceElement(elementProperties, complexTypeName) {
    let isSelfReference = false;
    traverseUtility(elementProperties).forEach((property) => {
      if (property) {
        let hasReferenceTypeKey;
        hasReferenceTypeKey = Object.keys(property)
          .find(
            (key) => {
              return key === '$ref' && property[key] !== undefined;
            }
          );
        if (hasReferenceTypeKey && property.$ref !== null && property.$ref === complexTypeName) {
          isSelfReference = true;
        }
      }
    });
    return isSelfReference;
  }

  /**
   * reads the simple type and assign the properties directly
   * always returns an array
   * @param {string} typeName the simple type name too look for
   * @param {array} simpleTypes the simple types from the wsdl
   * @param {object} traverseObject the traversing object
   * @param {Array} complexTypes the identified simple types of the wsdl
   * @param {Array} elements preprocessed elements
   * @returns {object} the data
   */
  processSimpleTypeSchema(typeName, simpleTypes, traverseObject, complexTypes, elements) {
    let simpleType = this.getSimpleTypeByName(typeName, simpleTypes);
    if (!simpleType) {
      this.processTypeNotFound(typeName, traverseObject);
      return;
    }
    if (simpleType.allOf) {
      this.processSimpleTypeSchema(simpleType.allOf[0].$ref, simpleTypes, traverseObject);
      if (simpleType.allOf[1]) {
        let definition,
          hasEnumIndex;
        definition = simpleType.allOf[1];
        traverseObject.minLength = definition.minLength !== undefined ? definition.minLength : traverseObject.minLength;
        traverseObject.maxLength = definition.maxLength !== undefined ? definition.maxLength : traverseObject.maxLength;
        traverseObject.maximum = definition.maximum !== undefined ? definition.maximum : traverseObject.maximum;
        traverseObject.minimum = definition.minimum !== undefined ? definition.minimum : traverseObject.minimum;
        traverseObject.pattern = definition.pattern !== undefined ? definition.pattern : traverseObject.pattern;

        hasEnumIndex = simpleType.allOf.findIndex((property) => {
          return property.enum;
        });
        if (hasEnumIndex !== -1) {
          traverseObject.enum = simpleType.allOf[hasEnumIndex].enum;
          traverseObject.$ref = undefined;
        }
      }
    }
    else if (simpleType.enum) {
      traverseObject.type = simpleType.type;
      traverseObject.enum = simpleType.enum;
      traverseObject.$ref = undefined;
    }
    // handling group as simple type
    else if (simpleType.type === 'object') {
      traverseObject.properties = {};
      traverseObject.properties = simpleType;
      traverseObject.type = 'complex';
      traverseObject.complexName = simpleType.name;
      if (traverseObject.name !== traverseObject.properties.name) {
        this.searchAndAssignComplex(traverseObject.properties, complexTypes, simpleTypes,
          elements);
      }
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
   * If an element was not found search it as a forwared reference
   * if not found then creates an error element
   * @param {string} typeName the type name too look for
   * @param {object} traverseObject the jsonSchema object
   * @returns {undefined} undefined
   */
  processTypeNotFound(typeName, traverseObject) {
    if (typeName.startsWith('FORWARD_REFERENCE#')) {
      let type = typeName.split('/').reverse()[0];
      if (isKnownType(type)) {
        traverseObject.type = type;
        traverseObject.$ref = null;
        return;
      }
    }
    traverseObject.properties = {};
    traverseObject.type = ERROR_ELEMENT_IDENTIFIER;
    traverseObject.complexName = typeName;
    return;
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
      complexTypeNameFound;

    if (complexTypeName.startsWith('FORWARD_REFERENCE#')) {
      complexTypeNameFound = complexTypeName.split('/').reverse()[0];
      complexTypeNameFound = complexTypeNameFound.includes('tns:') ? complexTypeNameFound.replace('tns:', '') :
        complexTypeNameFound;
    }
    else {
      complexTypeNameFound = getLastSegmentURL(complexTypeName);
    }

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
      simpleTypeNameToSearch = '';

    if (simpleTypeName.startsWith('FORWARD_REFERENCE#')) {
      simpleTypeNameToSearch = simpleTypeName.split('/').reverse()[0];
      simpleTypeNameToSearch = simpleTypeNameToSearch.includes('tns:') ? simpleTypeNameToSearch.replace('tns:', '') :
        simpleTypeNameToSearch;
    }
    else {
      simpleTypeNameToSearch = getLastSegmentURL(simpleTypeName);
    }

    simpleType = simpleTypes.find((simpleType) => {
      return simpleType.name === simpleTypeNameToSearch;
    });
    return simpleType;
  }
}

module.exports = {
  SchemaBuilderXSD
};
