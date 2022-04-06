const { ElementResolver } = require('./ElementResolver');

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
    ATTRIBUTE_ELEMENT,
    ATTRIBUTE_TYPE_TAG
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
    sortElementsAccordingToDependencies
  } = require('./sortSchemaItemsUtils'),
  {
    XSDToJsonSchemaParser
  } = require('../XSDToJsonSchemaParser'),
  oneOfIdentifier = 'oneOf',
  {
    XML_NAMESPACE_SEPARATOR
  } = require('./XMLParsedUtils'),
  anyOfIdentifier = 'anyOf';

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
      allElements = {},
      resolver;
    allElements.elements = [];
    allElements.simpleTypeElements = [];
    allElements.complexTypeElements = [];
    allElements.groupElements = [];
    allElements.globalAttributesElements = [];

    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);
    types.forEach((type) => {
      let schemaTags = [],
        jsonSchemas,
        mergedDefinitionsSchema,
        schemaStrings = [];
      schemaTags = this.getSchemasInformation(type, wsdlObject, parserPlaceholder);

      const sortedSchemas = orderSchemasAccordingToDependencies(schemaTags, parserPlaceholder,
        wsdlObject.allNameSpaces);

      sortedSchemas.forEach((schemaTag) => {

        schemaStrings.push(this.getXMLSchemaProcessed(schemaTag.foundSchemaTag, schemaTag.foundLocalSchemaNamespace,
          schemaTag.targetNamespace, schemaTag.tnsNamespace, parserPlaceholder));
      });
      jsonSchemas = xsdParser.parseAllSchemas(schemaStrings);
      mergedDefinitionsSchema = this.mergeAllSchemaDefinitionsInOne(jsonSchemas);

      sortedSchemas.forEach((schema, index) => {
        this.getWSDLElementsFromJsonSchema({
          jsonSchema: mergedDefinitionsSchema, schemaTagInformation: schema,
          parserPlaceholder,
          elements: allElements.elements,
          simpleTypeElements: allElements.simpleTypeElements,
          complexTypeElements: allElements.complexTypeElements,
          groupElements: allElements.groupElements,
          globalAttributesElements: allElements.globalAttributesElements,
          currentSchemaIndex: index
        });
      });
    });
    resolver = new ElementResolver(allElements);
    resolver.resolveAll();
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
          if (!definitions[defName]) {
            definitions[defName] = jsonSchema.definitions[defName];
          }
          else {
            definitions[jsonSchema.$id + '/' + defName] = jsonSchema.definitions[defName];
          }
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
        let targetNamespace = getXMLAttributeByName(schemaTag, parserPlaceholder, ATTRIBUTE_TARGET_NAMESPACE),
          tnsNamespace = Array.isArray(wsdlObject.allNameSpaces) && wsdlObject.allNameSpaces.find((ns) => {
            return targetNamespace === ns.url && ns.key !== ATTRIBUTE_TARGET_NAMESPACE;
          });

        schemaTags.push({
          foundSchemaTag: schemaTag,
          foundLocalSchemaNamespace: wsdlObject.schemaNamespace,
          targetNamespace,
          tnsNamespace
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
      let part = getXMLNodeByName(message, principalPrefix, ATTRIBUTE_PART) || {},
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
        realPartTypeorelement = realPartTypeorelement.split(XML_NAMESPACE_SEPARATOR)[1];

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
   * @param {array} tnsNamespace the this namespace object
   * @param {string} parserPlaceholder the corresponding parser prefix for ATTRIBUTEs
   * @returns {string} the xml representation of the object
   */
  getXMLSchemaProcessed(schemaTag, schemaNamespace, tnsNamespaceURL, tnsNamespace, parserPlaceholder) {
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
    if (tnsNamespace) {
      // assign tns namespace for current schema if present at wsdl root level
      localSchemaTag[parserPlaceholder + 'xmlns:' + tnsNamespace.key] = tnsNamespace.url;
    }
    else {
      localSchemaTag[parserPlaceholder + 'xmlns:tns'] = tnsNamespaceURL;
    }
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
    simpleTypeElements, complexTypeElements, groupElements, globalAttributesElements, currentSchemaIndex }) {
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
      globalAttributesFromCurrentTag = [],
      jsonSchemaComplexTypesFromCurrentTag,
      jsonSchemaSimpleTypesFromCurrentTag,
      jsonSchemaGroupsFromCurrentTag,
      jsonSchemaGlobalAttributesFromCurrentTag,
      previousPlusCurrentSimple,
      previousPlusCurrentComplex,
      jsonSchemaElementsFromCurrentTag,
      targetNamespace = schemaTagInformation.targetNamespace,
      schemaPrefixFilter = schemaTagInformation.foundLocalSchemaNamespace.prefixFilter,
      jsonSchemaClxTypesProcessed,
      jsonSchemaGroupsProcessed,
      jsonSchemaGlobalAttributesProcessed,
      jsonSchemaSimpleTypesProcessed;
    const definitionsNames = Object.keys(jsonSchema.definitions),
      globalAttributes = jsonSchema.globalAttributes ?
        Object.keys(jsonSchema.globalAttributes) :
        [],
      scTag = schemaTagInformation.foundSchemaTag;

    // set current tnsNamespace under this
    this.tnsNamespace = schemaTagInformation.tnsNamespace;

    complexTypesFromCurrentTag = getArrayFrom(this.getComplexTypesFromSchema(scTag, schemaPrefixFilter));
    simpleTypesFromCurrentTag = getArrayFrom(this.getSimpleTypesFromSchema(scTag, schemaPrefixFilter));
    elementTypesFromCurrentTag = getArrayFrom(this.getElementsFromSchema(scTag, schemaPrefixFilter));
    groupsFromCurrentTag = getArrayFrom(this.getGroupsFromSchema(scTag, schemaPrefixFilter));
    globalAttributesFromCurrentTag = getArrayFrom(this.getGlobalAttributesFromSchema(scTag, schemaPrefixFilter));

    complexTypesFromCurrentTag = complexTypesFromCurrentTag ? complexTypesFromCurrentTag : [];
    simpleTypesFromCurrentTag = simpleTypesFromCurrentTag ? simpleTypesFromCurrentTag : [];
    elementTypesFromCurrentTag = elementTypesFromCurrentTag ? elementTypesFromCurrentTag : [];
    groupsFromCurrentTag = groupsFromCurrentTag ? groupsFromCurrentTag : [];
    globalAttributesFromCurrentTag = globalAttributesFromCurrentTag ? globalAttributesFromCurrentTag : [];

    jsonSchemaElementsFromCurrentTag = this.getTypesFromDefinitions(jsonSchema, elementTypesFromCurrentTag,
      definitionsNames, parserPlaceholder, currentSchemaIndex);
    jsonSchemaComplexTypesFromCurrentTag = this.getTypesFromDefinitions(jsonSchema, complexTypesFromCurrentTag,
      definitionsNames, parserPlaceholder, currentSchemaIndex);
    jsonSchemaSimpleTypesFromCurrentTag = this.getTypesFromDefinitions(jsonSchema, simpleTypesFromCurrentTag,
      definitionsNames, parserPlaceholder, currentSchemaIndex);
    jsonSchemaGroupsFromCurrentTag = this.getTypesFromDefinitions(jsonSchema, groupsFromCurrentTag,
      definitionsNames, parserPlaceholder, currentSchemaIndex);
    jsonSchemaGlobalAttributesFromCurrentTag = this.getTypesFromGlobaAttributes(
      jsonSchema,
      globalAttributesFromCurrentTag,
      globalAttributes,
      parserPlaceholder
    );

    jsonSchemaClxTypesProcessed = this.getPreviousProcessedDefinitionsFromJsonSchema(jsonSchema,
      complexTypeElements,
      definitionsNames);
    jsonSchemaSimpleTypesProcessed = this.getPreviousProcessedDefinitionsFromJsonSchema(jsonSchema,
      simpleTypeElements,
      definitionsNames);
    jsonSchemaGroupsProcessed = this.getPreviousProcessedDefinitionsFromJsonSchema(jsonSchema,
      groupElements,
      definitionsNames);
    jsonSchemaGlobalAttributesProcessed = this.getPreviousProcessedDefinitionsFromJsonSchema(jsonSchema,
      globalAttributesElements,
      definitionsNames);

    if (jsonSchemaSimpleTypesFromCurrentTag && jsonSchemaSimpleTypesFromCurrentTag.length > 0) {
      this.processComplexOrSimpleTypesToElement(jsonSchemaSimpleTypesFromCurrentTag, targetNamespace,
        simpleTypeElements);
    }

    if (jsonSchemaGroupsFromCurrentTag && jsonSchemaGroupsFromCurrentTag.length > 0) {
      this.processComplexOrSimpleTypesToElement(jsonSchemaGroupsFromCurrentTag, targetNamespace, groupElements);
    }

    previousPlusCurrentSimple = jsonSchemaSimpleTypesFromCurrentTag.concat(jsonSchemaSimpleTypesProcessed);
    previousPlusCurrentSimple = previousPlusCurrentSimple.concat(jsonSchemaGroupsFromCurrentTag);
    previousPlusCurrentSimple = previousPlusCurrentSimple.concat(jsonSchemaGroupsProcessed);

    if (jsonSchemaGlobalAttributesFromCurrentTag && jsonSchemaGlobalAttributesFromCurrentTag.length > 0) {
      this.processComplexOrSimpleTypesToElement(jsonSchemaGlobalAttributesFromCurrentTag,
        jsonSchemaClxTypesProcessed,
        jsonSchemaSimpleTypesProcessed, targetNamespace, globalAttributesElements);
    }

    previousPlusCurrentSimple = previousPlusCurrentSimple.concat(jsonSchemaGlobalAttributesFromCurrentTag);
    previousPlusCurrentSimple = previousPlusCurrentSimple.concat(jsonSchemaGlobalAttributesProcessed);

    if (jsonSchemaComplexTypesFromCurrentTag && jsonSchemaComplexTypesFromCurrentTag.length > 0) {
      this.processComplexOrSimpleTypesToElement(jsonSchemaComplexTypesFromCurrentTag,
        targetNamespace, complexTypeElements);
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
      groupElements,
      globalAttributes
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
    let sorted = sortElementsAccordingToDependencies(elementsFromWSDL);
    sorted.forEach((element) => {
      let wsdlElement = new Element(),
        lookedReferences = [];
      this.searchAndAssignComplex(element,
        complexTypes,
        simpleTypes, elements, lookedReferences);
      // lookedReferences = [];
      wsdlElement.namespace = targetNamespace;
      wsdlElement.name = this.removeSchemaIDFromName(element.name);
      wsdlElement.type = this.getTypeOfElement(element);
      wsdlElement.isComplex = wsdlElement.type === 'complex';
      wsdlElement.isElement = true;
      wsdlElement.minOccurs = this.getMinOccursOfElement(element, wsdlElement.name);
      wsdlElement.maxOccurs = this.getMaxOccursOfElement(element, wsdlElement.name);
      wsdlElement.minimum = element.minimum;
      wsdlElement.maximum = element.maximum;
      wsdlElement.maxLength = element.maxLength;
      wsdlElement.minLength = element.minLength;
      wsdlElement.contentEncoding = element.contentEncoding;
      wsdlElement.pattern = element.pattern;
      wsdlElement.enum = element.enum;

      this.getChildren(getDeepCopyOfObject(element), wsdlElement, elements);
      elements.push(wsdlElement);
    });
  }

  /**
   * Removes the schema id found in duplicated elements
   * @param {string} elementName the name of the WSDLElement
   * @returns {string} returns the name without the schema id
   */
  removeSchemaIDFromName(elementName) {
    return getLastSegmentURL(elementName);
  }

  /**
   * Process the wsdl simple or complex types into WSDLObject elements
   * always returns an array
   * @param {Array} origin the elements from the schema to traverse
   * @param {object} targetNamespace the found namespace in wsdl
   * @param {string} typeElements the elements to fill in
   * @returns {undefined} returns nothing
   */
  processComplexOrSimpleTypesToElement(origin, targetNamespace, typeElements) {
    let sorted = sortElementsAccordingToDependencies(origin);
    sorted.forEach((element) => {
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
      wsdlElement.contentEncoding = element.contentEncoding;
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
   * @param {number} currentSchemaIndex the current schema index we are processing
   * @returns {Array} definitionsElements the objects from definitions
   */
  getTypesFromDefinitions(parsedSchema, typesFromWSDL, definitionsNames, parserPlaceholder,
    currentSchemaIndex) {
    let namesFromWSDL = [],
      definitionsElements,
      allNames = [],
      found = this.getTypesFromDefinitionsBySchemaAndName(parsedSchema, typesFromWSDL, definitionsNames,
        parserPlaceholder, currentSchemaIndex);
    if (found.length === 0) {
      namesFromWSDL = typesFromWSDL.map((type) => {
        return getXMLAttributeByName(type, parserPlaceholder, ATTRIBUTE_NAME);
      });
      allNames = namesFromWSDL;
    }
    else {
      typesFromWSDL.forEach((type) => {
        let localName = getXMLAttributeByName(type, parserPlaceholder, ATTRIBUTE_NAME),
          prevFound = found.find((foundElements) => {
            return foundElements.name === 'schema_' + currentSchemaIndex + '.json/' + localName;
          });
        if (!prevFound) {
          namesFromWSDL.push(localName);
        }

      });
      allNames = namesFromWSDL;
    }
    definitionsElements = definitionsNames.filter((definitionName) => {
      return allNames.includes(definitionName);
    }).map((definitionName) => {
      return {
        ...parsedSchema.definitions[definitionName],
        name: definitionName,
        fullName: `${parsedSchema.$id}#/definitions/${definitionName}`
      };
    });
    return definitionsElements.concat(found);
  }

  /**
   * Find the objects from definitions using the schema id and name
   * receives the names and find them in definitions
   * always returns an array
   * @param {object} parsedSchema the parsed schema element from a WSDL File
   * @param {object} typesFromWSDL the list to filter could be simple types complex or elements
   * @param {object} definitionsNames the found names in definitions
   * @param {string} parserPlaceholder the parser placeholder
   * @param {number} currentSchemaIndex the current schema index we are processing
   * @returns {Array} definitionsElements the objects from definitions
   */
  getTypesFromDefinitionsBySchemaAndName(parsedSchema, typesFromWSDL, definitionsNames, parserPlaceholder,
    currentSchemaIndex) {
    let namesFromWSDL,
      definitionsElements,
      allNames = [];
    namesFromWSDL = typesFromWSDL.map((type) => {
      let localName = getXMLAttributeByName(type, parserPlaceholder, ATTRIBUTE_NAME);
      return 'schema_' + currentSchemaIndex + '.json/' + localName;
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
   * Find the objects from globalAttributes
   * receives the names and find them in globalAttributes
   * always returns an array
   * @param {object} parsedSchema the parsed schema element from a WSDL File
   * @param {object} typesFromWSDL the list to filter could be simple types complex or elements
   * @param {object} globalAttributesNames the found names in globalAttributes
   * @param {string} parserPlaceholder the parser placeholder
   * @param {number} currentSchemaIndex the current schema index we are processing
   * @returns {Array} globalAttributesElements the objects from definitions
   */
  getTypesFromGlobaAttributes(parsedSchema, typesFromWSDL, globalAttributesNames, parserPlaceholder) {
    let namesFromWSDL,
      globalAttributesElements,
      allNames = [];
    namesFromWSDL = typesFromWSDL.map((type) => {
      return getXMLAttributeByName(type, parserPlaceholder, ATTRIBUTE_NAME);
    });
    allNames = namesFromWSDL;
    globalAttributesElements = globalAttributesNames.filter((globalAttributeName) => {
      return allNames.includes(globalAttributeName);
    }).map((globalAttributeName) => {
      return {
        ...parsedSchema.globalAttributes[globalAttributeName],
        name: globalAttributeName,
        fullName: `${parsedSchema.$id}#/globalAttributes/${globalAttributeName}`
      };
    });
    return globalAttributesElements;
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
              let hasRef,
                type,
                oneOfOrAnyOf = Object.keys(properties[key])
                  .find(
                    (key) => {
                      return key === oneOfIdentifier || key === anyOfIdentifier;
                    }
                  );
              if (!properties[key][oneOfOrAnyOf]) {
                oneOfOrAnyOf = undefined;
              }
              if (key === oneOfIdentifier || key === anyOfIdentifier) {
                type += ' ';
              }
              hasRef = properties[key] ? properties[key].$ref : undefined;
              type = oneOfOrAnyOf ? properties[key][oneOfOrAnyOf][0].type : properties[key].type;
              if (this.isScalarType(type, hasRef)) {
                let element = this.getChildScalarType(key, properties, property);
                children.push(element);
                wsdlElement.children = children;
              }
              else if (this.isComplexType(properties, key, hasRef)) {
                if (!this.isLoopReferenceElement(property.properties[key], rootElement.name ?
                  rootElement.name : rootElement.complexName, [], this.isSelfReferenceElementLocalNameComparer)) {
                  this.assignChildComplex(properties, key, wsdlElement, processedElements, property);
                }
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
   * @param {string} type type to find
   * @param {string} hasRef if the element has a named reference
   * @returns {boolean} true if found it as scalar
   */
  isScalarType(type, hasRef) {
    return type !== 'object' && !hasRef && isKnownType(type);
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
    return properties[key].type === 'object' || hasRef || properties[key].properties;
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
      propertiesObject = this.getTypeFromScalarType(properties[key]);
    element.name = key;
    element.type = propertiesObject.type;
    element.minimum = propertiesObject.minimum;
    element.maximum = propertiesObject.maximum;
    element.maxLength = propertiesObject.maxLength;
    element.minLength = propertiesObject.minLength;
    element.pattern = propertiesObject.pattern;
    element.contentEncoding = propertiesObject.contentEncoding;
    element.enum = propertiesObject.enum;
    element.isComplex = false;
    element.children = [];
    element.minOccurs = this.getMinOccursOfElement(property, key);
    element.maxOccurs = this.getMaxOccursOfElement(property, key);
    return element;
  }

  getTypeFromScalarType(propertyObject) {
    if (propertyObject[oneOfIdentifier]) {
      return propertyObject[oneOfIdentifier][0];
    }
    else if (propertyObject[anyOfIdentifier]) {
      return propertyObject[anyOfIdentifier][0];
    }
    return propertyObject;
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
      element = createErrorElement(properties[key], key);
      wsdlElement.children.push(element);
    }
    else {
      let preprocessed = this.findIfPreviousProcessedElement(processedElements, properties, key);
      if (!preprocessed) {
        element.name = key;
        element.type = this.getComplexElementType(properties[key]);
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

  getComplexElementType(element) {
    if (element.complexName) {
      return element.complexName;
    }
    else if (element.$ref) {
      let typeFromReference = element.$ref.split('/').reverse()[0];
      return typeFromReference.includes(XML_NAMESPACE_SEPARATOR) ?
        typeFromReference.split(XML_NAMESPACE_SEPARATOR).reverse()[0] :
        typeFromReference;
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
    let name;
    if (properties[key].complexName) {
      name = properties[key].complexName;
    }
    else if (properties[key].$ref) {
      name = properties[key].$ref.replace(DEFINITIONS_FILTER, '');
    }
    else {
      name = properties[key].name;
    }
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
   * Get the group types from the schema
   * always returns an array
   * @param {object} schemaTag the binding operation object
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[object]} group types from the wsdl
   */
  getGroupsFromSchema(schemaTag, schemaPrefix) {
    return getArrayFrom(schemaTag[schemaPrefix + GROUP_TAG]);
  }

  /**
   * Get the attribute types from the schema
   * always returns an array
   * @param {object} schemaTag the binding operation object
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[object]} attribute types from the wsdl
   */
  getGlobalAttributesFromSchema(schemaTag, schemaPrefix) {
    return getArrayFrom(schemaTag[schemaPrefix + ATTRIBUTE_TYPE_TAG]);
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

  /* eslint-disable no-invalid-this */
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
  searchAndAssignComplex(rootElement, complexTypes, simpleTypes, elements,
    lookedReferences) {
    let that = this;
    traverseUtility(rootElement).forEach(function (property) {
      if (property) {
        let hasReferenceTypeKey,
          oneOfOrAnyOf;
        oneOfOrAnyOf = Object.keys(property)
          .find(
            (key) => {
              return key === oneOfIdentifier || key === anyOfIdentifier;
            }
          );
        if (oneOfOrAnyOf && property[oneOfOrAnyOf]) {
          that.handleOneOfAnyOf(oneOfOrAnyOf, property);
        }
        hasReferenceTypeKey = Object.keys(property)
          .find(
            (key) => {
              return key === '$ref' && property[key] !== undefined;
            }
          );
        if (hasReferenceTypeKey && property.$ref !== null) {
          that.processReferenceTypeOfSchema(property, hasReferenceTypeKey, complexTypes,
            simpleTypes, elements, this, lookedReferences);
          lookedReferences = [];// para aa.wsdl
        }
      }
    });
  }

  searchAndAssignComplex2(rootElement, complexTypes, simpleTypes, elements, lookedReferences) {
    let that = this;
    traverseUtility(rootElement).forEach(function (property) {
      if (property) {
        let hasReferenceTypeKey,
          oneOfOrAnyOf;
        oneOfOrAnyOf = Object.keys(property)
          .find(
            (key) => {
              return key === oneOfIdentifier || key === anyOfIdentifier;
            }
          );
        if (oneOfOrAnyOf && property[oneOfOrAnyOf]) {
          that.handleOneOfAnyOf(oneOfOrAnyOf, property);
        }
        hasReferenceTypeKey = Object.keys(property)
          .find(
            (key) => {
              return key === '$ref' && property[key] !== undefined;
            }
          );
        if (hasReferenceTypeKey && property.$ref !== null) {
          that.processReferenceTypeOfSchema(property, hasReferenceTypeKey, complexTypes,
            simpleTypes, elements, this, lookedReferences);
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
    if (this.handleChoiceAnyOf(complexProperty, currentSchemaProperty, oneOfOrAnyOf)) {
      return;
    }
    else if (currentSchemaProperty[oneOfOrAnyOf][0].$ref) {
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

  handleChoiceAnyOf(complexProperty, currentSchemaProperty, oneOfOrAnyOf) {
    if (complexProperty || currentSchemaProperty[oneOfOrAnyOf][0].$ref) {
      return false;
    }
    if (!currentSchemaProperty[oneOfOrAnyOf] || !currentSchemaProperty[oneOfOrAnyOf][0] ||
      !currentSchemaProperty[oneOfOrAnyOf][0].anyOf) {
      return false;
    }
    currentSchemaProperty[oneOfOrAnyOf] = undefined;
    return true;
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
  processReferenceTypeOfSchema(property, hasReferenceTypeKey, complexTypes, simpleTypes, elements,
    contextTraverse, lookedReferences) {
    let complexType = '',
      elementType = '',
      type = property[hasReferenceTypeKey],
      parentName = '',
      path;
    if (contextTraverse && !contextTraverse.isRoot && contextTraverse.parent.parent.node) {
      parentName = contextTraverse.parent.parent.node.name;
    }

    if (lookedReferences.length === 0) {
      path = parentName;
    }
    else {
      let parentInList = lookedReferences.reverse().find(((reference) => {
        return parentName === reference.element;
      }));
      if (parentInList) {
        path = parentInList.path + parentInList.element;
      }
      else {
        path = '';
      }

    }

    complexType = this.getComplexTypeByName(type, complexTypes);
    if (complexType) {
      property.properties = {};
      property.properties = getDeepCopyOfObject(complexType);
      property.type = 'complex';
      property.complexName = complexType.name;
      if (property.name !== property.properties.name &&
        !this.isLoopReferenceElement(property.properties, type, lookedReferences,
          this.isSelfReferenceElementExactNameComparer, property.complexName, path)) {
        lookedReferences.push({ element: property.complexName, path: path });
        this.searchAndAssignComplex2(property.properties, complexTypes, simpleTypes,
          elements, lookedReferences);
      }
    }
    else {
      elementType = this.getElementTypeByName(type, elements);
      if (elementType) {
        property.properties = {};
        property.properties = getDeepCopyOfObject(elementType);
        property.type = 'complex';
        property.complexName = elementType.name;
        lookedReferences.push(type);
        this.searchAndAssignComplex2(property.properties, complexTypes, simpleTypes,
          elements, lookedReferences);
      }
      else {
        this.processSimpleTypeSchema(type, simpleTypes, property, complexTypes, elements,
          lookedReferences);
      }
    }
  }

  /**
   * Identifies if an element has a reference to itself to avoid infinit loop
   * @param {object} elementProperties the properties of the root parent
   * @param {string} complexTypeName the name of the type
   * @param {array} lookedReferences references already processed
   * @param {Function} comparer the function to compare if its a self reference
   * @returns {Boolean} true if the element has a reference to itself otherwise false
   */
  isLoopReferenceElement(elementProperties, complexTypeName, lookedReferences, comparer,
    name, path) {
    let isSelfReference = false,
      isBeenlookedUp,
      containsPath = false;

    if (lookedReferences) {
      isBeenlookedUp = lookedReferences.find((lookedReference) => {
        return lookedReference.element === name;
      });
      if (isBeenlookedUp) {
        containsPath = path.includes(isBeenlookedUp.path);
      }
    }
    if (containsPath) {
      return true;
    }
    traverseUtility(elementProperties).forEach((property) => {
      if (property) {
        let hasReferenceTypeKey;
        hasReferenceTypeKey = Object.keys(property)
          .find(
            (key) => {
              return key === '$ref' && property[key] !== undefined;
            }
          );
        if (comparer(hasReferenceTypeKey, property, complexTypeName)) {
          isSelfReference = true;
        }
      }
    });
    return isSelfReference;
  }

  /**
   * Identifies if an element has a reference to itself to avoid infinit loop
   * @param {object} hasReferenceTypeKey identifies if an element references other element (clx)
   * @param {object} property the current object property
   * @param {string} complexTypeName the complex type name we are looking for
   * @returns {Boolean} true if the element has a reference to itself otherwise false
   */
  isSelfReferenceElementExactNameComparer(hasReferenceTypeKey, property, complexTypeName) {
    return hasReferenceTypeKey && property.$ref !== null && property.$ref === complexTypeName;
  }

  /**
   * Identifies if an element has a reference to itself to avoid infinit loop
   * @param {object} hasReferenceTypeKey identifies if an element references other element (clx)
   * @param {object} property the current object property
   * @param {string} complexTypeName the complex type name we are looking for
   * @returns {Boolean} true if the element has a reference to itself otherwise false
   */
  isSelfReferenceElementLocalNameComparer(hasReferenceTypeKey, property, complexTypeName) {
    if (hasReferenceTypeKey && property.$ref !== null) {
      return getLastSegmentURL(property.$ref) === complexTypeName;
    }
    return false;
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
  processSimpleTypeSchema(typeName, simpleTypes, traverseObject, complexTypes, elements,
    lookedReferences) {
    let simpleType = this.getSimpleTypeByName(typeName, simpleTypes);
    if (!simpleType) {
      this.processTypeNotFound(typeName, traverseObject);
      return;
    }
    if (simpleType.allOf) {
      this.processSimpleTypeSchema(simpleType.allOf[0].$ref, simpleTypes, traverseObject, lookedReferences);
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
      traverseObject.properties = getDeepCopyOfObject(simpleType);
      traverseObject.type = 'complex';
      traverseObject.complexName = simpleType.name;
      if (traverseObject.name !== traverseObject.properties.name) {
        this.searchAndAssignComplex2(traverseObject.properties, complexTypes, simpleTypes,
          elements, lookedReferences);
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
      complexTypeNameFound,
      tnsNamespacePrefix = 'tns:';

    if (this.tnsNamespace && typeof this.tnsNamespace.key === 'string') {
      tnsNamespacePrefix = this.tnsNamespace.key + XML_NAMESPACE_SEPARATOR;
    }

    if (complexTypeName.startsWith('FORWARD_REFERENCE#')) {
      complexTypeNameFound = complexTypeName.split('/').reverse()[0];
      complexTypeNameFound = complexTypeNameFound.includes(tnsNamespacePrefix) ?
        complexTypeNameFound.replace(tnsNamespacePrefix, '') : complexTypeNameFound;
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
      simpleTypeNameToSearch = '',
      tnsNamespacePrefix = 'tns:';

    if (this.tnsNamespace && typeof this.tnsNamespace.key === 'string') {
      tnsNamespacePrefix = this.tnsNamespace.key + XML_NAMESPACE_SEPARATOR;
    }

    if (simpleTypeName.startsWith('FORWARD_REFERENCE#')) {
      simpleTypeNameToSearch = simpleTypeName.split('/').reverse()[0];
      simpleTypeNameToSearch = simpleTypeNameToSearch.includes(tnsNamespacePrefix) ?
        simpleTypeNameToSearch.replace(tnsNamespacePrefix, '') : simpleTypeNameToSearch;
    }
    else {
      simpleTypeNameToSearch = getLastSegmentURL(simpleTypeName);
    }

    simpleType = simpleTypes.find((simpleType) => {
      return simpleType.name === simpleTypeNameToSearch;
    });

    if (!simpleType & simpleTypeNameToSearch.includes(XML_NAMESPACE_SEPARATOR)) {
      simpleTypeNameToSearch = simpleTypeNameToSearch.split(XML_NAMESPACE_SEPARATOR).pop();
      simpleType = simpleTypes.find((simpleType) => {
        return simpleType.name === simpleTypeNameToSearch;
      });
    }
    return simpleType;
  }
}

module.exports = {
  SchemaBuilderXSD
};
