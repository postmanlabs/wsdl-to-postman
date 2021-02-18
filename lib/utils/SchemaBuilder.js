const
  Element = require('../WsdlObject').Element,
  WsdlError = require('../WsdlError'),
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
  traverseUtility = require('traverse');

/**
 * Class to map types schemas from xml parsed document
 * into an array of elements nodes
 */
class SchemaBuilder {

  getElementsFromSchema(schemaTag, schemaPrefix) {
    return this.getArrayFrom(schemaTag[schemaPrefix + ELEMENT_TAG]);
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
   * Get the types of the document
   * always returns an array
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @param {string} schemaPrefix the schema namespace prefix
   * @param {string} complexTypeName the name of the complex type
   * @returns {[object]} the information of the types
   */
  getComplexTypeByName(parsedXml, principalPrefix, wsdlRoot, schemaPrefix, complexTypeName) {
    let complexType;
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);

    types.forEach((type) => { // refactor to for
      const scTag = type[schemaPrefix + SCHEMA_TAG];
      let complexTypesFromWSDL,
        foundComplexType;
      complexTypesFromWSDL = this.getComplexTypesFromSchema(scTag, schemaPrefix);
      foundComplexType = complexTypesFromWSDL.find((complexType) => {
        return complexType[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME] === complexTypeName;
      });
      complexType = foundComplexType;
    });
    return complexType;
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
   * Build the WSDLObject elements
   * @param {object} parsedXml the binding operation object
   * @param {string} principalPrefix the principal prefix of document
   * @param {string} wsdlRoot the root depending on version
   * @param {string} schemaPrefix the schema namespace prefix
   * @returns {[Element]} the information of the types
   */
  getElements(parsedXml, principalPrefix, wsdlRoot, schemaPrefix) {
    if (!parsedXml || typeof parsedXml !== 'object') {
      throw new WsdlError('Can not get elements from undefined or null object');
    }
    let elements = [];
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);

    types.forEach((type) => {
      const schemaTag =
        type[schemaPrefix + SCHEMA_TAG],
        elementsFromWSDL = this.getElementsFromSchema(schemaTag, schemaPrefix),
        targetNamespace =
        schemaTag[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TARGET_NAMESPACE];

      if (elementsFromWSDL) {
        elementsFromWSDL.forEach((element) => {
          let wsdlElement = new Element();
          this.searchAndAssignComplex(element, parsedXml, principalPrefix, wsdlRoot, schemaPrefix);
          wsdlElement.namespace = targetNamespace;
          wsdlElement.name = element[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME];
          wsdlElement.type = this.getTypeOfElement(element);
          wsdlElement.isComplex = wsdlElement.type === 'complex';
          wsdlElement.minOccurs = this.getMinOccursOfElement(element);
          wsdlElement.maxOccurs = this.getMaxOccursOfElement(element);
          this.getChildren(element, wsdlElement, schemaPrefix);
          elements.push(wsdlElement);
        });
      }

    });
    return elements;
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
        let type = x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE].split(XML_NAMESPACE_SEPARATOR)[1],
          complexType = this.getComplexTypeByName(parsedXml,
            principalPrefix, wsdlRoot, schemaPrefix, type);
        x[schemaPrefix + COMPLEX_TYPE_TAG] = complexType;
        this.searchAndAssignComplex(x[schemaPrefix + COMPLEX_TYPE_TAG], parsedXml,
          principalPrefix, wsdlRoot, schemaPrefix);
      }
    });
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
  getChildren(rootElement, wsdlElement, schemaPrefix) {

    let children = [];
    traverseUtility(rootElement).forEach((x) => {
      let scalarType = Object.keys(x)
        .find(
          (key) => {
            return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE && isKnownType(x[key]);
          }
        );
      if (scalarType) {
        let element = new Element();
        element.name = x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME];
        element.type = x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE]
          .substring(x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE]
            .indexOf(XML_NAMESPACE_SEPARATOR) + 1, x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE].length);

        element.isComplex = false;
        element.children = [];
        element.minOccurs = this.getMinOccursOfElement(x);
        element.maxOccurs = this.getMaxOccursOfElement(x);
        children.push(element);
        wsdlElement.children = children;
      }
      else {
        let hasNonKnownType = Object.keys(x)
          .find(
            (key) => {
              return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE && !isKnownType(x[key]);
            }
          );
        if (hasNonKnownType && x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE] !== '') {
          let element = new Element();
          wsdlElement.children = [];
          element.name = x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME];
          element.type = x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE]
            .substring(x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE]
              .indexOf(XML_NAMESPACE_SEPARATOR) + 1, x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE].length);
          element.isComplex = true;
          element.minOccurs = this.getMinOccursOfElement(x);
          element.maxOccurs = this.getMaxOccursOfElement(x);
          wsdlElement.children.push(element);
          this.getChildren(x[schemaPrefix + COMPLEX_TYPE_TAG], element, schemaPrefix);
          x[schemaPrefix + COMPLEX_TYPE_TAG] = {};
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
    let typeExists = Object.keys(element)
      .find(
        (key) => {
          return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE;
        }
      );
    return typeExists ? element[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE] : 'complex';
  }


  /**
   * Get the min occurs of an element
   * always returns an array
   * @param {object} element the parsed element from a WSDL File
   * @returns {string} the value of the min occurs if there is no value then returns 1
   */
  getMinOccursOfElement(element) {
    let minOccursExists = Object.keys(element)
      .find(
        (key) => {
          return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MIN_OCCURS;
        }
      );
    return minOccursExists ? element[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MIN_OCCURS] : '1';
  }

  /**
   * Get the max occurs of an element
   * always returns an array
   * @param {object} element the parsed element from a WSDL File
   * @returns {string} the value of the max occurs if there is no value then returns 1
   */
  getMaxOccursOfElement(element) {
    let maxOccursExists = Object.keys(element)
      .find(
        (key) => {
          return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MAX_OCCURS;
        }
      );
    return maxOccursExists ? element[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MAX_OCCURS] : '1';
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
  SchemaBuilder
};
