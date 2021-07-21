const {
    getElementPosition,
    addNodeInString,
    removeNodeFromString
  } = require('./../utils/mismatchUtils'),
  {
    XMLXSDValidator
  } = require('./../xsdValidation/XMLXSDValidator'),
  RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
  BODY_PROPERTY = 'BODY',
  MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  INVALID_BODY_REASON_CODE = 'INVALID_BODY',
  INVALID_RESPONSE_BODY_REASON_CODE = 'INVALID_RESPONSE_BODY',
  INVALID_BODY_DEFAULT_MESSAGE = 'The request body didn\'t match the specified schema',
  MISSING_CHILD_PATTERN = /Element \'(.*)\': Missing child element\(s\). Expected is \( (.*) \)/,
  NOT_EXPECTED_ONE_SIBLING_PATTERN = /Element \'(.*)\': This element is not expected\. Expected is \( (.*) \)/,
  NOT_EXPECTED_MULTIPLE_SIBLINGS_PATTERN =
    /Element \'(.*)\': This element is not expected. Expected is one of ( (.*) )/,
  INVALID_TYPE_PATTERN = /Element \'(.*)\': \'(.*)\' is not a valid value of the atomic type \'(.*)\'/,
  CONTENT_NOT_ALLOWED_PATTERN =
    /Element \'(.*)\': Character content is not allowed, because the content type is empty/,
  INVALID_XML_STRING_PATTERN = /Error validating message/,
  INVALID_ROOT_PATTERN =
    /Element \'(.*)\': No matching global declaration available for the validation root/,
  NOT_EXPECTED_IN_BODY_PATTERN = /Element \'(.*)\': This element is not expected/;

class BodyMismatch {
  constructor(error, currentBody, expectedBody, operation, isResponse, options) {
    this.currentBody = currentBody;
    this.expectedBody = expectedBody;
    this.isResponse = isResponse;
    this.detailedBlobValidation = options.detailedBlobValidation;
    this.suggestAvailableFixes = options.suggestAvailableFixes;
    this.lib = new XMLXSDValidator().getValidatorLibrary();
    this.schemaJsonPath = operation.xpathInfo.xpath;
    this.reason = this.getReason(error);
    this.elementData = this.getElementData(this.reason, currentBody, expectedBody);
  }

  /**
   * Return the mismatch formatted
   * @returns {object} Mismatch data formatted
   */
  getMismatch() {
    let mismatch = {
      property: this.isResponse ? RESPONSE_BODY_PROPERTY : BODY_PROPERTY,
      transactionJsonPath: this.isResponse ? '$.response.body' : '$.request.body',
      schemaJsonPath: this.schemaJsonPath,
      reasonCode: this.getReasonCode(),
      reason: this.reason
    };
    if (this.suggestAvailableFixes) {
      mismatch.suggestedFix = this.getSuggestedFix();
    }
    return mismatch;
  }

  /**
   * Calculates and returns the corresponding message to the mismatch
   * @param {object} error The error generated from the validation library
   * @returns {string} the reason from the error or the default error depending on detailedBlobValidation option
   */
  getReason(error) {
    return this.detailedBlobValidation ? error.message : INVALID_BODY_DEFAULT_MESSAGE;
  }

  /**
   * Calculates and return reason code depending on the detailedBlobValidation option
   * @returns {string} Reason code related to the mismatch
   */
  getReasonCode() {
    return this.detailedBlobValidation ?
      this.elementData.reasonCode :
      this.isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
  }

  /**
   * Formats and returns the suggestedFix value
   * @returns {object} the suggestedFix formatted
   */
  getSuggestedFix() {
    let suggestedFix = {
      key: `/${this.elementData.keyPath}`,
      actualValue: this.elementData.currentValue,
      suggestedValue: this.elementData.suggestedValue
    };
    if (this.detailedBlobValidation) {
      suggestedFix.key = `/${this.elementData.keyPath}`;
      suggestedFix.actualValue = this.elementData.currentValue;
      suggestedFix.suggestedValue = this.elementData.suggestedValue;
    }
    return suggestedFix;
  }

  /**
   * Handle the current and expected body strings depending on the error message and return the data necessary
   * by the mismatch creation
   * @param {string} reason The mismatch reason
   * @param {string} currentBody The body provided by the user
   * @param {string} expectedBody The expected body calculated from the schema
   * @returns {object} An object with the data related with the error message
   */
  getElementData(reason, currentBody, expectedBody) {
    let data;
    if (reason.match(MISSING_CHILD_PATTERN)) {
      data = this.getMissingChildData(reason, currentBody, expectedBody);
    }
    else if (
      reason.match(NOT_EXPECTED_ONE_SIBLING_PATTERN) ||
      reason.match(NOT_EXPECTED_MULTIPLE_SIBLINGS_PATTERN)
    ) {
      data = this.getNotExpectedBySiblingsData(reason, currentBody, expectedBody);
    }
    else if (reason.match(NOT_EXPECTED_IN_BODY_PATTERN)) {
      data = this.getNotExpectedInBodyData(reason, currentBody, expectedBody);
    }
    else if (reason.match(INVALID_TYPE_PATTERN)) {
      data = this.getInvalidTypeData(reason, currentBody, expectedBody);
    }
    else if (reason.match(CONTENT_NOT_ALLOWED_PATTERN)) {
      data = this.getContentNotAllowedData(reason, currentBody, expectedBody);
    }
    else if (
      reason.match(INVALID_XML_STRING_PATTERN) ||
      reason.match(INVALID_ROOT_PATTERN) ||
      reason.match(INVALID_BODY_DEFAULT_MESSAGE)
    ) {
      data = this.getGlobalErrorsData();
    }
    return data;
  }

  /**
   * If the xpath contains an index component at the end it removes it and returns the clean xpath
   * @param {string} xpath A provided xpath
   * @returns {string} If the xpath contains an index component at the end it returns the xpath
   * with this component removed
   */
  removeIndexFromXpath(xpath) {
    const reversedXpathAsArray = xpath.split('').reverse();
    let cleanedXpath = xpath;
    if (reversedXpathAsArray[0] === ']') {
      cleanedXpath = reversedXpathAsArray.slice(3).reverse().join('');
    }
    return cleanedXpath;
  }

  /**
   * Calculate the data when mismatch reason matches with a NOT_EXPECTED_IN_BODY_PATTERN message
   * @param {string} reason The reason related to the mismatch
   * @param {string} currentBody The body provided by the user
   * @param {string} expectedBody the expected body generated from the schema
   * @returns {object} an object with the data related to the mismatch
   */
  getNotExpectedInBodyData(reason, currentBody, expectedBody) {
    const result = reason.match(NOT_EXPECTED_IN_BODY_PATTERN),
      elementName = result[1],
      elementXpath = `//${elementName}`,
      wrongNodesInCurrent = this.lib.findByXpathInXmlString(currentBody, elementXpath),
      wrongParentNode = wrongNodesInCurrent.map((node) => {
        return node.parent();
      }).find((node) => {
        const nodeInExpected = this.lib.findByXpathInXmlString(expectedBody, `/${node.path()}`)[0],
          nodeInExpectedData = this.getNodeData(nodeInExpected);
        if (!nodeInExpectedData.childrenNames.includes(elementName)) {
          return true;
        }
        return false;
      }),
      wrongParentNodeData = this.getNodeData(wrongParentNode),
      wrongNode = wrongParentNodeData.children.find((child) => {
        return child.name() === elementName;
      }),
      currentValue = wrongParentNodeData.childrenAsString,
      suggestedValue = removeNodeFromString(wrongNode, wrongParentNodeData.nodeAsString),
      keyPath = wrongParentNodeData.path,
      reasonCode = this.isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
    return {
      currentValue,
      suggestedValue,
      keyPath,
      reasonCode
    };
  }

  /**
   * Calculate the data when mismatch reason matches with a MISSING_CHILD_PATTERN message
   * @param {string} reason The reason related to the mismatch
   * @param {string} currentBody The body provided by the user
   * @param {string} expectedBody the expected body generated from the schema
   * @returns {object} an object with the data related to the mismatch
   */
  getMissingChildData(reason, currentBody, expectedBody) {
    const result = reason.match(MISSING_CHILD_PATTERN),
      name = result[2],
      parent = result[1],
      parentXpath = `//${parent}`,
      parentNodeDataWithoutChildren = this.lib.findByXpathInXmlString(currentBody, parentXpath).map((node) => {
        return this.getNodeData(node);
      }).filter((nodeData) => {
        return nodeData.children.length === 0;
      })[0],
      reasonCode = MISSING_IN_REQUEST_REASON_CODE,
      keyPath = parentNodeDataWithoutChildren.path,
      elementNodeInExpected = this.lib.findByXpathInXmlString(
        expectedBody,
        `${this.removeIndexFromXpath(keyPath)}/${name}`
      )[0],
      currentValue = '',
      suggestedValue = elementNodeInExpected.toString();
    return {
      reasonCode,
      keyPath,
      currentValue,
      suggestedValue
    };
  }

  /**
   * Gets the preview sibling xpath to find the next one and returns the missed node
   * @param {string} currentBody The provided body
   * @param {string} cleanBody the expected body generated from the schema
   * @param {string} siblingXpath the xpath related to the missed sibling from a NOT_EXPECTED_ONE_SIBLING_PATTERN reason
   * @returns {object} the node that corresponds with the missed element finding by the next sibling
   */
  getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath) {
    const currentElements = this.lib.findByXpathInXmlString(currentBody, siblingXpath),
      expectedElements = this.lib.findByXpathInXmlString(cleanBody, siblingXpath),
      currentPrevElement = currentElements.map((element) => {
        return element.prevElement();
      }),
      expectedPrevElement = expectedElements.map((element) => {
        return element.prevElement();
      }),
      result = expectedPrevElement.filter((element) => {
        return !currentPrevElement.includes(element);
      });
    return result;
  }

  /**
   * Gets a node an calculates specified data relatet to it
   * @param {object} node the node we want to get the data
   * @returns {object} an object with some data related to the provided node
   */
  getNodeData(node) {
    const path = node.path(),
      children = this.lib.getChildrenElements(node),
      childrenNames = children.map((child) => {
        return child.name();
      }),
      childrenAsString = this.lib.getChildrenAsString([node]),
      nodeAsString = node.toString();
    return {
      node,
      path,
      children,
      childrenNames,
      childrenAsString,
      nodeAsString
    };
  }

  /**
   * Handles the missing in request error when both elements in the reason message are expected in the schema
   * and returns the parent's data
   * @param {string} currentBody the body provided by the user
   * @param {string} expectedBody the body generated from the schema
   * @param {string} parentXpath the parent xpath of both elements
   * @param {string} missedElementName the name of the missed element in body
   * @param {string} wrongElementName the name of the element that has generated the mismatch
   * @returns {object} the parent element data(suggested and current values, reason code and keyPath)
   */
  handleBothElementsAreExpected(currentBody, expectedBody, parentXpath, missedElementName, wrongElementName) {
    const expectedNode = this.lib.findByXpathInXmlString(expectedBody, parentXpath)[0],
      expectedNodeData = this.getNodeData(expectedNode),
      expectedMissedelementIndex = expectedNodeData.childrenNames.indexOf(missedElementName),
      providedNodes = this.lib.findByXpathInXmlString(currentBody, parentXpath),
      providedNodesData = providedNodes.map((node, index) => {
        return {
          ...this.getNodeData(node),
          index
        };
      }),
      wrongNodeWithErrorData = providedNodesData.map((nodeData) => {
        const missedElementIndex = nodeData.childrenNames.indexOf(missedElementName),
          isMissedElement = missedElementIndex === -1,
          isWrongOrder = missedElementIndex > -1 && missedElementIndex !== expectedMissedelementIndex;
        return {
          ...nodeData,
          isMissedElement,
          isWrongOrder
        };
      }).find((nodeData) => {
        const {
          isMissedElement,
          isWrongOrder
        } = nodeData;
        return isMissedElement || isWrongOrder;
      });
    let currentValue,
      suggestedValue,
      reasonCode;
    if (wrongNodeWithErrorData.isMissedElement) {
      const missedElementXpath = `//${missedElementName}`,
        expectedElement = this.lib.findByXpathInXmlString(expectedNodeData.nodeAsString, missedElementXpath)[0];
      currentValue = wrongNodeWithErrorData.childrenAsString;
      suggestedValue = addNodeInString(expectedElement, wrongNodeWithErrorData.nodeAsString);
      reasonCode = MISSING_IN_REQUEST_REASON_CODE;
    }
    else if (wrongNodeWithErrorData.isWrongOrder) {
      const missedNodeXpath = `//${missedElementName}`,
        wrongNodeXpath = `//${wrongElementName}`,
        missedNode = this.lib.findByXpathInXmlString(wrongNodeWithErrorData.nodeAsString, missedNodeXpath)[0],
        wrongNode = this.lib.findByXpathInXmlString(wrongNodeWithErrorData.nodeAsString, wrongNodeXpath)[0],
        missedNodePosition = getElementPosition(missedNode).index,
        wrongNodePosition = getElementPosition(wrongNode).index,
        childrenAsStringArray = wrongNodeWithErrorData.children.map((child) => {
          return child.toString();
        }),
        swapElementsInArray = (elementsAsStringArray, index1, index2) => {
          const newOrderedArray = elementsAsStringArray.slice(),
            temporalElement = newOrderedArray[index1];
          newOrderedArray[index1] = newOrderedArray[index2];
          newOrderedArray[index2] = temporalElement;
          return newOrderedArray;
        },
        newOrderedChildrenArray = swapElementsInArray(childrenAsStringArray, missedNodePosition, wrongNodePosition);
      currentValue = wrongNodeWithErrorData.childrenAsString;
      suggestedValue = newOrderedChildrenArray.join('\n');
      reasonCode = this.isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
    }
    return {
      keyPath: wrongNodeWithErrorData.path,
      currentValue,
      suggestedValue,
      reasonCode
    };
  }

  /**
   * Switch the element in the provided position with the value provided and returns a new array
   * @param {array} myArray The array where we want to switch an element
   * @param {number} index The position of the element we want to change
   * @param {any} newValue The new value we want to put in the provided position
   * @returns {array} A new array with the specifyed element switched with the provided value
   */
  switchValueInArray(myArray, index, newValue) {
    const newArray = myArray.slice();
    newArray[index] = newValue;
    return newArray;
  }

  /**
   * Handles the missing in request error when the wrong element specified in the reason
   * is not expected by the schema and return the parent's data
   * @param {string} currentBody the body provided by the user
   * @param {string} expectedBody the body generated from the schema
   * @param {string} wrongElementName the not expected element in the schema from the reason
   * @param {string} missedElementName the eexpected element name in the schema
   * @returns {object} the data from the parent node of the specified elements
   */
  handleNotExpectedElement(currentBody, expectedBody, wrongElementName, missedElementName) {
    const wrongNodeXpath = `//${wrongElementName}`,
      missedElementXpath = `//${missedElementName}`,
      expectedNodes = this.lib.findByXpathInXmlString(expectedBody, missedElementXpath),
      wrongNodesInCurrent = this.lib.findByXpathInXmlString(currentBody, wrongNodeXpath),
      intersection = this.getNodesIntersectionByParentName(expectedNodes, wrongNodesInCurrent),
      wrongParentNode = intersection[0],
      wrongParentNodeData = this.getNodeData(wrongParentNode),
      parentNodeXpathInExpected = this.removeIndexFromXpath(wrongParentNodeData.path),
      missedElementInExpected = this.lib.findByXpathInXmlString(
        expectedBody,
        `/${parentNodeXpathInExpected}/${missedElementName}`
      )[0],
      wrongElementInWrongParent = this.lib.findByXpathInXmlString(
        currentBody,
        `/${wrongParentNodeData.path}/${wrongElementName}`
      )[0],
      missedElementAsString = missedElementInExpected.toString(),
      wrongElementPositionInCurrent = wrongParentNodeData.childrenNames.indexOf(wrongElementName),
      currentValue = wrongParentNodeData.childrenAsString,
      wrongParentNodeChildrenAsArrayOfStrings = wrongParentNodeData.children.map((child) => {
        return child.toString();
      }),
      wrongParentContainsMissedElement = wrongParentNodeData.childrenNames.includes(missedElementName),
      suggestedValue = wrongParentContainsMissedElement ?
        removeNodeFromString(wrongElementInWrongParent, wrongParentNodeData.nodeAsString) :
        this.switchValueInArray(
          wrongParentNodeChildrenAsArrayOfStrings,
          wrongElementPositionInCurrent,
          missedElementAsString
        ).join('\n'),
      reasonCode = MISSING_IN_REQUEST_REASON_CODE;
    return {
      keyPath: wrongParentNodeData.path,
      currentValue,
      suggestedValue,
      reasonCode
    };
  }

  /**
   * Proces the reason and bodies to return the data related with the mismatched elements'parent
   * @param {string} reason the mismatch reason message
   * @param {string} currentBody the provided body by the user
   * @param {string} expectedBody the body generated from the schema
   * @returns {object} the data related with the parent of the wrong element
   */
  getNotExpectedBySiblingsData(reason, currentBody, expectedBody) {
    const result = reason.match(NOT_EXPECTED_ONE_SIBLING_PATTERN) ?
        reason.match(NOT_EXPECTED_ONE_SIBLING_PATTERN) :
        reason.match(NOT_EXPECTED_MULTIPLE_SIBLINGS_PATTERN),
      missedElementName = result[2],
      wrongElementName = result[1],
      missedElementXpath = `//${missedElementName}`,
      wrongElementXpath = `//${wrongElementName}`,
      missedElementNodesInExpected = this.lib.findByXpathInXmlString(expectedBody, missedElementXpath),
      wrongElementNodesInExpected = this.lib.findByXpathInXmlString(expectedBody, wrongElementXpath),
      bothElementsInExpectedIntersection = this.getNodesIntersectionByParentPath(
        missedElementNodesInExpected,
        wrongElementNodesInExpected
      ),
      bothElementsAreExpected = bothElementsInExpectedIntersection.length === 1;
    let nodeData;

    if (bothElementsAreExpected) {
      const parentXpath = bothElementsInExpectedIntersection[0];
      nodeData = this.handleBothElementsAreExpected(
        currentBody,
        expectedBody,
        parentXpath,
        missedElementName,
        wrongElementName
      );
    }
    else {
      nodeData = this.handleNotExpectedElement(currentBody, expectedBody, wrongElementName, missedElementName);
    }
    return nodeData;
  }

  /**
   * Calculates the intersection between two arrays using the array element's parents
   * @param {array} nodesArray1 The array of nodes from the left
   * @param {array} nodesArray2 The array of nodes from the right
   * @returns {array} the intersection between the provided arrays using the parent's path
   */
  getNodesIntersectionByParentPath(nodesArray1, nodesArray2) {
    const array1ParentsPath = nodesArray1.map((node) => {
        return node.parent().path();
      }),
      array2ParentsPath = nodesArray2.map((node) => {
        return node.parent().path();
      }),
      intersection = array1ParentsPath.filter((path) => {
        return array2ParentsPath.includes(path);
      });
    return intersection;
  }

  /**
   * Calculates the intersection between the provided arrays using the array element's parent name
   * @param {aray} missedNodesInExpected The array of nodes from the left
   * @param {array} wrongNodesInCurrent The array of nodes from the right
   * @returns {array} the intersection between the provided arrays using the element's parent names
   */
  getNodesIntersectionByParentName(missedNodesInExpected, wrongNodesInCurrent) {
    const wrongNodesParents = wrongNodesInCurrent.map((node) => {
        return node.parent();
      }),
      missedNodesNames = missedNodesInExpected.map((node) => {
        return node.parent().name();
      }),
      intersection = wrongNodesParents.filter((node) => {
        return missedNodesNames.includes(node.name());
      });
    return intersection;
  }

  /**
   * Calculates the data when the reason message matches with the INVALID_TYPE_PATTERN message
   * @param {string} reason the reason of the mismatch
   * @param {string} currentBody the body provided by the user
   * @param {string} expectedBody the body generated from the schema
   * @returns {object} the data related to the invalid type element
   */
  getInvalidTypeData(reason, currentBody, expectedBody) {
    const result = reason.match(INVALID_TYPE_PATTERN),
      name = result[1],
      value = result[2],
      elementXpath = `//${name}[text()="${value}"]`,
      elementInCurrent = this.lib.findByXpathInXmlString(currentBody, elementXpath)[0],
      reasonCode = INVALID_TYPE_REASON_CODE,
      keyPath = elementInCurrent.path(),
      elementInExpected = this.lib.findByXpathInXmlString(expectedBody, keyPath)[0],
      currentValue = elementInCurrent.text(),
      suggestedValue = elementInExpected.text();
    return {
      currentValue,
      suggestedValue,
      reasonCode,
      keyPath
    };
  }

  /**
   * Calculates the data when the reason message matches with the NOT_ALLOWED_CONTENT_PATTERN message
   * @param {string} reason the reason of the mismatch
   * @param {string} currentBody the body provided by the user
   * @param {string} expectedBody the body generated from the schema
   * @returns {object} the data related to the mismatched element
   */
  getContentNotAllowedData(reason, currentBody, expectedBody) {
    const result = reason.match(CONTENT_NOT_ALLOWED_PATTERN),
      name = result[1],
      elementXpath = `//${name}[count(*)=0]`,
      elementInExpected = this.lib.findByXpathInXmlString(expectedBody, elementXpath)[0],
      keyPath = elementInExpected.path(),
      reasonCode = this.isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE,
      elementInCurrent = this.lib.findByXpathInXmlString(currentBody, keyPath)[0],
      currentValue = elementInCurrent.text(),
      suggestedValue = '';
    return {
      currentValue,
      suggestedValue,
      reasonCode,
      keyPath
    };
  }

  /**
   * Calculates the data when the reason message matches with the INVALID_XML_STRING and INVALID_ELEMENT_ROOT patterns
   * @param {string} reason the reason of the mismatch
   * @param {string} currentBody the body provided by the user
   * @param {string} expectedBody the body generated from the schema
   * @returns {object} the data related to the invalid type element
   */
  getGlobalErrorsData() {
    const currentValue = this.currentBody,
      suggestedValue = this.expectedBody,
      keyPath = '/soap:Body',
      reasonCode = this.isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
    return {
      currentValue,
      suggestedValue,
      keyPath,
      reasonCode
    };
  }
}

module.exports = {
  BodyMismatch
};
