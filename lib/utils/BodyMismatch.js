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

  getReason(error) {
    return this.detailedBlobValidation ? error.message : INVALID_BODY_DEFAULT_MESSAGE;
  }

  getReasonCode() {
    return this.detailedBlobValidation ?
      this.elementData.reasonCode :
      this.isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
  }

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

  removeIndexFromXpath(xpath) {
    const reversedXpathAsArray = xpath.split('').reverse();
    let cleanedXpath = xpath;
    if (reversedXpathAsArray[0] === ']') {
      cleanedXpath = reversedXpathAsArray.slice(3).reverse().join('');
    }
    return cleanedXpath;
  }

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

  switchValueInArray(myArray, index, newValue) {
    const newArray = myArray.slice();
    newArray[index] = newValue;
    return newArray;
  }

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
