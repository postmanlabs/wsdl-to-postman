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

  //   getElements(parsedXml, principalPrefix, wsdlRoot) {
  //     let child = new Element(),
  //       root = new Element();
  //     child.children = [];
  //     child.minOccurs = 1;
  //     child.maxOccurs = 1;
  //     child.name = 'ubiNum';
  //     child.type = 'unsignedLong';
  //     child.isComplex = false;

  //     root.children = [child];
  //     root.minOccurs = 1;
  //     root.maxOccurs = 1;
  //     root.name = 'NumberToWords';
  //     root.type = 'complex';
  //     root.isComplex = true;

  //     return [root];
  //   }

  getElements(parsedXml, principalPrefix, wsdlRoot, schemaPrefix) {
    let elements = [];
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);

    types.forEach((type) => {
      const schemaTag =
        type[schemaPrefix + SCHEMA_TAG],
        elementsFromWSDL = this.getElementsFromSchema(schemaTag, schemaPrefix),
        //elementsFromWSDL = this.preProcessNodesAssignComplexTypes(schemaTag, schemaPrefix),

        targetNamespace =
        schemaTag[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TARGET_NAMESPACE];

      elementsFromWSDL.forEach((element) => {
        let wsdlElement = new Element();
        wsdlElement.namespace = targetNamespace;
        wsdlElement.name = element[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_NAME];
        wsdlElement.type = this.getTypeOfElement(element);
        wsdlElement.isComplex = wsdlElement.type === 'complex';
        wsdlElement.minOccurs = this.getMinOccursOfElement(element);
        wsdlElement.maxOccurs = this.getMaxOccursOfElement(element);
        this.getChildren(element, wsdlElement);
        elements.push(wsdlElement);
      });
    });

    return elements;
  }

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

  getComplexTypeByName(parsedXml, principalPrefix, wsdlRoot, schemaPrefix, complexTypeName, schemaBuilder) {
    let complexType;
    const types = schemaBuilder ? schemaBuilder.getTypes(parsedXml, principalPrefix, wsdlRoot) :
      this.getTypes(parsedXml, principalPrefix, wsdlRoot);

    types.forEach((type) => { // refactor to for
      const schemaTag =
        type[schemaPrefix + SCHEMA_TAG],
        complexTypesFromWSDL = schemaBuilder ? schemaBuilder.getComplexTypesFromSchema(schemaTag, schemaPrefix) :
        this.getComplexTypesFromSchema(schemaTag, schemaPrefix),
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

  getChildren(rootElement, wsdlElement) {
    let children = [],
      minOccurs = this.getMinOccursOfElement,
      knonwTypes = this.isKnownType,
      maxOccurs = this.getMaxOccursOfElement;
    traverseUtility(rootElement).forEach(function(x) {
      let scalarType = Object.keys(x)
        .find(
          (key) => {
            return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE && knonwTypes(x[key]);
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
        element.minOccurs = minOccurs(x);
        element.maxOccurs = maxOccurs(x);
        children.push(element);
      }
    });
    wsdlElement.children = children;
  }

  preProcessNodesAssignComplexTypes(parsedXml, principalPrefix, wsdlRoot, schemaPrefix) {
    let processedElements = [];
    const types = this.getTypes(parsedXml, principalPrefix, wsdlRoot);

    types.forEach((type) => {
      const schemaTag =
        type[schemaPrefix + SCHEMA_TAG],
        elementsFromWSDL = this.getElementsFromSchema(schemaTag, schemaPrefix);

      elementsFromWSDL.forEach((element) => {
        this.searchAndAssignComplex(element, parsedXml, principalPrefix, wsdlRoot, schemaPrefix);
        processedElements.push(element);
      });
    });
    return processedElements;
  }

  searchAndAssignComplex(rootElement, parsedXml, principalPrefix, wsdlRoot, schemaPrefix) {
    let complexTypeByName = this.getComplexTypeByName,
      knonwTypes = this.isKnownType;
    traverseUtility(rootElement).forEach(function(x) {
      let hasNonKnownType = Object.keys(x)
        .find(
          (key) => {
            return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE && !knonwTypes(x[key]);
          }
        );
      if (hasNonKnownType) {
        let type = x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_TYPE].split(XML_NAMESPACE_SEPARATOR)[1];
        let complexType = complexTypeByName(parsedXml, principalPrefix, wsdlRoot, schemaPrefix, type, new SchemaBuilder())
        x[schemaPrefix + COMPLEX_TYPE_TAG] = complexType;

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

  getMinOccursOfElement(element) {
    let minOccursExists = Object.keys(element)
      .find(
        (key) => {
          return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MIN_OCCURS;
        }
      );
    return minOccursExists ? x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MIN_OCCURS] : 1;
  }

  getMaxOccursOfElement(element) {
    let maxOccursExists = Object.keys(element)
      .find(
        (key) => {
          return key === PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MAX_OCCURS;
        }
      );
    return maxOccursExists ? x[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATRIBUTE_MAX_OCCURS] : 1;
  }

  isKnownType(key) {
    let knownTypes = ['unsignedLong', 'string', 'decimal'];
    return knownTypes.includes(key.split(XML_NAMESPACE_SEPARATOR)[1])
  }

}

module.exports = {
  SchemaBuilder
};
