const
  Element = require('../WsdlObject').Element,
  WsdlError = require('../WsdlError'),
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
 * Class to map types schemas from xml parsed documento
 * into an array of elements nodes
 */
class SchemaBuilder {

  getElementsFromSchema(schemaTag, schemaPrefix) {
    let elementsFromWSDL = schemaTag[schemaPrefix + ELEMENT_TAG];
    if (elementsFromWSDL && !Array.isArray(elementsFromWSDL)) {
      return [elementsFromWSDL];
    }
    return elementsFromWSDL;
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
      const definitions = parsedXml[principalPrefix + wsdlRoot],
        types = definitions[principalPrefix + TYPES_TAG];

      if (types && !Array.isArray(types)) {
        return [types];
      }
      return types;
    }
    catch (error) {
      throw new WsdlError('Can not get types from object');
    }
  }

  getComplexTypeByName(parsedXml, principalPrefix, wsdlRoot, schemaPrefix, complexTypeName, blder) {
    let complexType;
    const types = blder ? blder.getTypes(parsedXml, principalPrefix, wsdlRoot) :
      this.getTypes(parsedXml, principalPrefix, wsdlRoot);

    types.forEach((type) => { // refactor to for
      const scTag = type[schemaPrefix + SCHEMA_TAG];
      let complexTypesFromWSDL,
        foundComplexType;
      if (blder) {
        complexTypesFromWSDL = blder.getComplexTypesFromSchema(scTag, schemaPrefix);
      }
      else {
        complexTypesFromWSDL = this.getComplexTypesFromSchema(scTag, schemaPrefix);
      }
      foundComplexType = complexTypesFromWSDL.find((complexType) => {
        return complexType[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME] === complexTypeName;
      });
      complexType = foundComplexType;
    });
    return complexType;
  }

  getComplexTypesFromSchema(schemaTag, schemaPrefix) {
    let complexTypesFromWSDL = schemaTag[schemaPrefix + COMPLEX_TYPE_TAG];
    if (complexTypesFromWSDL && !Array.isArray(complexTypesFromWSDL)) {
      return [complexTypesFromWSDL];
    }
    return complexTypesFromWSDL;
  }

  getElements(parsedXml, principalPrefix, wsdlRoot, schemaPrefix) {
    let elements = [];
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);

    types.forEach((type) => {
      const schemaTag =
        type[schemaPrefix + SCHEMA_TAG],
        elementsFromWSDL = this.getElementsFromSchema(schemaTag, schemaPrefix),
        targetNamespace =
        schemaTag[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TARGET_NAMESPACE];

      elementsFromWSDL.forEach((element) => {
        let wsdlElement = new Element();
        this.searchAndAssignComplex(element, parsedXml, principalPrefix, wsdlRoot, schemaPrefix);
        wsdlElement.namespace = targetNamespace;
        wsdlElement.name = element[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME];
        wsdlElement.type = this.getTypeOfElement(element);
        wsdlElement.isComplex = wsdlElement.type === 'complex';
        wsdlElement.minOccurs = this.scopedGetMinOccursOfElement(element);
        wsdlElement.maxOccurs = this.scopedGetMaxOccursOfElement(element);
        this.getChildren(element, wsdlElement, schemaPrefix);
        elements.push(wsdlElement);
      });
    });
    return elements;
  }

  searchAndAssignComplex(rootElement, parsedXml, principalPrefix, wsdlRoot, schemaPrefix) {
    let complexTypeByName = this.getComplexTypeByName;
    traverseUtility(rootElement).forEach((x) => {
      let hasNonKnownType = Object.keys(x)
        .find(
          (key) => {
            return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE && !this.scopedIsKnownType(x[key]);
          }
        );
      if (hasNonKnownType) {
        let type = x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE].split(XML_NAMESPACE_SEPARATOR)[1],
          complexType = complexTypeByName(parsedXml,
            principalPrefix, wsdlRoot, schemaPrefix, type, new SchemaBuilder());
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
   * @param {object} rootElement the string name of the type
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
            return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE && this.scopedIsKnownType(x[key]);
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
        element.minOccurs = this.scopedGetMinOccursOfElement(x);
        element.maxOccurs = this.scopedGetMaxOccursOfElement(x);
        children.push(element);
        wsdlElement.children = children;
      }
      else {
        let hasNonKnownType = Object.keys(x)
          .find(
            (key) => {
              return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE && !this.scopedIsKnownType(x[key]);
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
          element.minOccurs = this.scopedGetMinOccursOfElement(x);
          element.maxOccurs = this.scopedGetMaxOccursOfElement(x);
          wsdlElement.children.push(element);
          this.getChildren(x[schemaPrefix + COMPLEX_TYPE_TAG], element, schemaPrefix);
          x[schemaPrefix + COMPLEX_TYPE_TAG] = {};
        }
      }
    });
  }

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
  scopedGetMinOccursOfElement(element) {
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
  scopedGetMaxOccursOfElement(element) {
    let maxOccursExists = Object.keys(element)
      .find(
        (key) => {
          return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MAX_OCCURS;
        }
      );
    return maxOccursExists ? element[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MAX_OCCURS] : '1';
  }

  /**
   * Determines if the type is a known type
   * always returns an array
   * @param {object} type the string name of the type
   * @returns {boolean} wether is a known type or not
   */
  scopedIsKnownType(type) {
    let knownTypes = ['unsignedLong', 'string', 'decimal', 'int'];
    return knownTypes.includes(type.split(XML_NAMESPACE_SEPARATOR)[1]);
  }

}

module.exports = {
  SchemaBuilder
};
