const { XMLXSDValidator } = require('../xsdValidation/XMLXSDValidator'),
  INVALID_BODY_DEFAULT_MESSAGE = 'The request body didn\'t match the specified schema',
  RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
  BODY_PROPERTY = 'BODY',
  MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  MISSING_IN_SCHEMA_REASON_CODE = 'MISSING_IN_SCHEMA',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  INVALID_BODY_REASON_CODE = 'INVALID_BODY',
  INVALID_RESPONSE_BODY_REASON_CODE = 'INVALID_RESPONSE_BODY',
  MISSING_IN_REQUEST_PARENT_PATTERN = /Element \'(.*)\': Missing child element\(s\). Expected is \( (.*) \)/,
  MISSING_IN_REQUEST_ONE_SIBLING_PATTERN = /Element \'(.*)\': This element is not expected\. Expected is \( (.*) \)/,
  MISSING_IN_REQUEST_MULTIPLE_SIBLINGS_PATTERN =
    /Element \'(.*)\': This element is not expected. Expected is one of ( (.*) )/,
  MISSING_IN_SCHEMA_PATTERN = /Element \'(.*)\': This element is not expected/,
  INVALID_TYPE_PATTERN = /Element \'(.*)\': \'(.*)\' is not a valid value of the atomic type \'(.*)\'/,
  INVALID_BODY_PATTERN = /Element \'(.*)\': Character content is not allowed, because the content type is empty/;

/**
 * Gets a validator library instance
 * @returns {object} an instance of validator Library
 */
function useValidator() {
  const lib = new XMLXSDValidator('libxmljs').getValidatorLibrary();
  return lib;
}

/**
 * Gets the node from an element from a xmlString
 * @param {string} xmlString The xmlString where we will find the element
 * @param {string} xpath The xpath from the element we want to get
 * @returns {object} The node of the element
 */
function getElementFromStringByXpath(xmlString, xpath) {
  const element = useValidator().findByXpathInXmlString(xmlString, xpath);
  return element;
}

/**
 * return the element that corresponds with specific key in a message
 * @param {object} element The node we want to get the children (text or strigifyed elements)
 * @param {string} reasonCode the reason code for current mismatch
 * @returns {string} the specific element from the key in the message or empty string
 */
function getElementChildrenAsString(element, reasonCode) {
  let result;
  if ([INVALID_TYPE_REASON_CODE, INVALID_RESPONSE_BODY_REASON_CODE, INVALID_BODY_REASON_CODE].includes(reasonCode)) {
    result = useValidator().getElementText(element);
  }
  else {
    result = useValidator().getChildrenAsString(element);
  }
  return result;
}

/**
  * calculates the mismatch reason code depending on the error,
  * the detailedBlobValidation option and if it is a response or a request
  * @param {object} error the error that will be reported
  * @param {boolean} detailedBlobValidation if detailBlobValidation option is true or false
  * @param {boolean} isResponse if mismatch is in a requests or a response
  * @returns {string} A Reason code setted as constant
  */
function getMismatchReasonCode(error, detailedBlobValidation, isResponse) {
  const MISSING_SCHEMA_MESSAGE_PART = 'This element is not expected',
    MISSING_REQUEST_MESSAGE_PART = 'Missing child element(s)',
    isTypeInvalidError = error.code === 1824,
    isMissingSchemaError = error.code === 1871 && error.message.includes(MISSING_SCHEMA_MESSAGE_PART),
    isMissingRequestError = error.code === 1871 && error.message.includes(MISSING_REQUEST_MESSAGE_PART),
    isInvalidBodyError = error.code === 1841;
  let reasonCode = INVALID_BODY_REASON_CODE;
  if (!detailedBlobValidation) {
    reasonCode = isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
  }
  else if (isTypeInvalidError) {
    reasonCode = INVALID_TYPE_REASON_CODE;
  }
  else if (isMissingSchemaError) {
    reasonCode = MISSING_IN_SCHEMA_REASON_CODE;
  }
  else if (isMissingRequestError) {
    reasonCode = MISSING_IN_REQUEST_REASON_CODE;
  }
  else if (isInvalidBodyError) {
    reasonCode = isResponse ? INVALID_RESPONSE_BODY_REASON_CODE : INVALID_BODY_REASON_CODE;
  }
  return reasonCode;
}

/**
   * Create a mismatch base with the error to report
   * @param {object} operationFromWSDL current operation object
   * @param {object} error reported error
   * @param {boolean} isResponse indicates if operation is from a request or a response
   * @param {object} options options object
   * @param {string} reason message that will be reported in the mismatch
   * @returns {object} resultant mismatch object
   */
function getBodyMismatchObject(operationFromWSDL, error, isResponse, options, reason = '') {
  const {
      detailedBlobValidation
    } = options,
    mismatchReason = reason !== '' ? reason : (
      detailedBlobValidation === true ?
        error.message :
        INVALID_BODY_DEFAULT_MESSAGE
    );
  let mismatch = {
    property: isResponse ? RESPONSE_BODY_PROPERTY : BODY_PROPERTY,
    transactionJsonPath: isResponse ? '$.response.body' : '$.request.body',
    schemaJsonPath: operationFromWSDL.xpathInfo.xpath,
    reasonCode: getMismatchReasonCode(error, detailedBlobValidation, isResponse),
    reason: mismatchReason
  };
  return mismatch;
}

/**
 * get the element that matches with the provided xpath and that is in
 * request body but not in expected body and returns it
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @param {string} xpath xpath corresponding to the element in reason
 * @returns {object} xml Element that corresponds with the provided xpath
 */
function getElementFromMissingInSchemaByXpath(currentBody, cleanBody, xpath) {
  const currentElements = useValidator().findByXpathInXmlString(currentBody, xpath),
    expectedElements = useValidator().findByXpathInXmlString(cleanBody, xpath),
    expectedPaths = expectedElements.map((element) => {
      return element.path();
    }),
    result = currentElements.filter((element) => {
      return !expectedPaths.includes(element.path());
    });
  return result[0];
}

/**
 * get the element that matches with the provided xpath and that is in
 * expected body but not in request body and returns it
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @param {string} xpath xpath corresponding to the element in reason
 * @returns {object} xml Element that corresponds with the provided xpath
 */
function getElementFromMissingInRequestByPath(currentBody, cleanBody, xpath) {
  const currentElements = useValidator().findByXpathInXmlString(currentBody, xpath),
    expectedElements = useValidator().findByXpathInXmlString(cleanBody, xpath),
    currentPaths = currentElements.map((element) => {
      return element.path();
    }),
    result = expectedElements.filter((element) => {
      return !currentPaths.includes(element.path());
    });
  return result[0];
}

/**
 * get the element that matches with the provided next sibling's xpath and that is in
 * expected body but not in request body and returns it
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @param {string} siblingXpath xpath corresponding to the element's next sibling
 * @returns {object} xml Element that corresponds with the provided xpath
 */
function getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath) {
  const currentElements = useValidator().findByXpathInXmlString(currentBody, siblingXpath),
    expectedElements = useValidator().findByXpathInXmlString(cleanBody, siblingXpath),
    currentPrevElement = currentElements.map((element) => {
      return element.prevElement();
    }),
    expectedPrevElement = expectedElements.map((element) => {
      return element.prevElement();
    }),
    result = expectedPrevElement.filter((element) => {
      return !currentPrevElement.includes(element);
    });
  return result[0];
}

/**
 * Creates an object with all necessary data from the element in next steps
 * @param {string} name the name of the element
 * @param {object} node The node of the element
 * @param {string} keyXpath The xpath to the element that has wrong values
 * (if is missing in request or missing in schema error it drives to the paren element)
 * @param {boolean} keyIsItsParent If the keyXpath point to the element or to the parent
 * @returns {object} An object with the neccesary data to generate the suggestedValue
 */
function fillElementData(name, node, keyXpath, keyIsItsParent) {
  return {
    name,
    node,
    keyXpath,
    keyIsItsParent
  };
}

/**
 * Get the element's position between its siblings
 * @param {object} node The element we want to know the position between its siblings
 * @returns {number} The position between its siblings
 */
function getElementPosition(node) {
  const parentChildren = useValidator().getChildrenElements(node.parent()),
    positionData = parentChildren.map((child, index) => {
      if (child.name() === node.name()) {
        return {
          index,
          elementString: child.toString()
        };
      }
    }).find((data) => {
      return data;
    });
  return positionData;
}

/**
 * Add a provided element in a stringifyed node and returns the string representation
 * @param {object} node The element we want to add in xml node string
 * @param {string} nodeString the xml node string where we want to add the element
 * @returns {string} The provided xml node string with the specifyed element added
 */
function addNodeInString(node, nodeString) {
  const documentToModify = useValidator().parseXmlString(nodeString),
    documentChildren = useValidator().getChildrenElements(documentToModify),
    nodePosition = getElementPosition(node),
    stringElements = documentChildren.map((child) => {
      return child.toString();
    });
  stringElements.splice(0, nodePosition.index, nodePosition.elementString);
  return stringElements.join('\n');
}

/**
 * Removes an element from a provided node string
 * @param {object} node The element we want to remove from a string
 * @param {string} nodeString the xmlString where we want to remove an element
 * @returns {string} The provoided xml node string with the specifyed element removed
 */
function removeNodeFromString(node, nodeString) {
  const documentToModify = useValidator().parseXmlString(nodeString),
    documentChildren = useValidator().getChildrenElements(documentToModify),
    childrenWithNodeRemoved = documentChildren.filter((child) => {
      return child.name() !== node.name();
    }),
    stringElements = childrenWithNodeRemoved.map((child) => {
      return child.toString();
    }).join('\n');
  return stringElements;
}

/**
 * Generates the suggested fix from a specific reaconCode
 * @param {object} node The node where an error was issued
 * @param {string} currentValue The request value that the user sent and has some error
 * @param {string} reasonCode The mismatch reasonCode for this kind of error
 * @returns {string} the siggested value for the specific reasonCode
 */
function getSuggestedFixFromCurrentValue(node, currentValue, reasonCode) {
  if (reasonCode === MISSING_IN_REQUEST_REASON_CODE) {
    return addNodeInString(node, currentValue);
  }
  else if (reasonCode === MISSING_IN_SCHEMA_REASON_CODE) {
    return removeNodeFromString(node, currentValue);
  }
}

/**
 * gets the self closing element in expected body that has some not expected value in request body
 * and returns it
 * @param {string} reason The reason message gotten from validation with schema library
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @returns {string} xpath corresponding to the element in reason
 */
function handleInvalidBodyAndGetElementData(reason, cleanBody) {
  const result = reason.match(INVALID_BODY_PATTERN),
    name = result[1],
    elementXpath = `//${name}[count(*)=0]`,
    node = useValidator().findByXpathInXmlString(cleanBody, elementXpath)[0],
    keyXpath = node.path(),
    elementData = fillElementData(name, node, keyXpath, false);
  return elementData;
}

/**
 * gets the element that is in the reason message and has a wrong typed value in current body
 * and returns it
 * @param {string} reason The reason message gotten from the validation with schema library
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @returns {string} xpath corresponding to the element in reason
 */
function handleInvalidTypeAndGetElementData(reason, currentBody) {
  const result = reason.match(INVALID_TYPE_PATTERN),
    name = result[1],
    value = result[2],
    elementXpath = `//${name}[text()="${value}"]`,
    node = useValidator().findByXpathInXmlString(currentBody, elementXpath)[0],
    keyXpath = node.path(),
    elementData = fillElementData(name, node, keyXpath, false);
  return elementData;
}

/**
 * Returns the xpath's index component for the parent of the missing element
 * @param {object} missedElement the element that is missing in request
 * @param {string} body The body where the missed element is not present
 * @returns {string} If the missing element's parent has multiple siblings with the same name
 * it will return the index component to add to the xpath '[parentIndex]', else it will
 * return an empty string
 */
function getIndexFromMultipleSiblingsWithSameName(missedElement, body) {
  const missedParentElementPath = `/${missedElement.parent().path()}`,
    requestElementSiblingsSameName = useValidator().findByXpathInXmlString(body, missedParentElementPath),
    missedElementParentIndex = requestElementSiblingsSameName.map((element, index) => {
      return {
        index,
        childrenNames: element.childNodes().map((node) => {
          return node.name();
        })
      };
    }).filter((element) => {
      return !element.childrenNames.includes(missedElement.name());
    }),
    index = missedElementParentIndex[0].index;
  return index > 0 ? `[${index + 1}]` : '';
}

/**
 * reads the missing in request reason message and gets necessary data to find the mismatched
 * element and returns the xpath
 * @param {string} reason The reason message gotten from the validation with schema library
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @returns {string} xpath corresponding to the element in reason
 */
function handleMissingInRequestAndGetElementData(reason, currentBody, cleanBody) {
  let result,
    xpath,
    node,
    name,
    indexComponent = '',
    elementData;
  if (reason.match(MISSING_IN_REQUEST_PARENT_PATTERN)) {
    result = reason.match(MISSING_IN_REQUEST_PARENT_PATTERN);
    name = result[2];
    let parent = result[1],
      elementXpath = `//${parent}/${name}`;
    node = getElementFromMissingInRequestByPath(currentBody, cleanBody, elementXpath);
  }
  else if (reason.match(MISSING_IN_REQUEST_ONE_SIBLING_PATTERN)) {
    result = reason.match(MISSING_IN_REQUEST_ONE_SIBLING_PATTERN);
    name = result[2];
    let sibling = result[1],
      siblingXpath = `//${sibling}`;
    node = getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath);
  }
  else if (reason.match(MISSING_IN_REQUEST_MULTIPLE_SIBLINGS_PATTERN)) {
    result = reason.match(MISSING_IN_REQUEST_MULTIPLE_SIBLINGS_PATTERN);
    name = result[2];
    let sibling = result[1],
      siblingXpath = `//${sibling}`;
    node = getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath);
  }
  xpath = node.parent().path();
  indexComponent = getIndexFromMultipleSiblingsWithSameName(node, currentBody);
  elementData = fillElementData(name, node, `${xpath}${indexComponent}`, true);
  return elementData;
}

/**
 * reads the missing in schema reason message and gets necessary data to find the mismatched
 * element and returns the xpath
 * @param {string} reason The reason message gotten from the validation with schema library
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @returns {string} xpath corresponding to the element in reason
 */
function handleMissingInSchemaAndGetElementData(reason, currentBody, cleanBody) {
  const result = reason.match(MISSING_IN_SCHEMA_PATTERN),
    name = result[1],
    elementXpath = `//${name}`,
    node = getElementFromMissingInSchemaByXpath(currentBody, cleanBody, elementXpath),
    parentNode = node.parent(),
    keyXpath = parentNode.path(),
    elementData = fillElementData(name, node, keyXpath, true);
  return elementData;
}

/**
 * get the key xpath depending on the mismatch reason and resonCode
 * @param {object} mismatch mismatch object we will add suggested fix
 * @param {string} currentBody request body clean string
 * @param {string} cleanBody expected body clean generated from the schema
 * @returns {string} the corresponding xpath depending on the reasonCode
 */
function getElementData(mismatch, currentBody, cleanBody) {
  const {
    reasonCode,
    reason
  } = mismatch;
  let data;

  if ([INVALID_BODY_REASON_CODE, INVALID_RESPONSE_BODY_REASON_CODE].includes(reasonCode)) {
    // if gets in there is an error in the body content
    data = handleInvalidBodyAndGetElementData(reason, cleanBody);
  }
  else if (reasonCode === INVALID_TYPE_REASON_CODE) {
    // reason contains key, wrong value and expected type
    data = handleInvalidTypeAndGetElementData(reason, currentBody);
  }
  else if (reasonCode === MISSING_IN_REQUEST_REASON_CODE) {
    // reason contains missing element's parent key, expected element key
    data = handleMissingInRequestAndGetElementData(reason, currentBody, cleanBody);
  }
  else if (reasonCode === MISSING_IN_SCHEMA_REASON_CODE) {
    // reason contains not expected key
    data = handleMissingInSchemaAndGetElementData(reason, currentBody, cleanBody);
  }
  return data;
}

/**
   * Takes a mismatch base and add the suggested fix parameter
   * @param {object} mismatch mismatch to be reported
   * @param {string} currentBody body that has generated the mismatch
   * @param {string} bodyFromSchema correct body generated from schema
   * @param {boolean} detailedBlobValidation options that indicates if we will report details or not
   * @returns {object} mismatch with suggested fix param
   */
function getMismatchWithSuggestedFix(mismatch, currentBody, bodyFromSchema, detailedBlobValidation) {
  let newMismatch = JSON.parse(JSON.stringify(mismatch)),
    key = '',
    actualElement,
    actualValue,
    suggestedElement,
    suggestedValue,
    elementData;
  const {
    reasonCode
  } = newMismatch;

  if (!detailedBlobValidation) {
    key = 'body';
    actualValue = currentBody;
    suggestedValue = bodyFromSchema;
  }
  else {
    elementData = getElementData(newMismatch, currentBody, bodyFromSchema);
    actualElement = getElementFromStringByXpath(currentBody, elementData.keyXpath);
    actualValue = getElementChildrenAsString(actualElement, reasonCode);
    suggestedElement = getElementFromStringByXpath(bodyFromSchema, elementData.keyXpath);
    suggestedValue = elementData.keyIsItsParent ?
      getSuggestedFixFromCurrentValue(elementData.node, actualElement.toString(), reasonCode) :
      getElementChildrenAsString(suggestedElement, reasonCode);
  }
  newMismatch.suggestedFix = {
    key: key ? key : `/${elementData.keyXpath}`,
    actualValue,
    suggestedValue
  };
  return newMismatch;
}

module.exports = {
  getBodyMismatchObject,
  getMismatchWithSuggestedFix,
  getElementFromMissingInRequestByPath,
  getElementFromMissingInRequestBySiblingsXpath,
  getElementFromMissingInSchemaByXpath,
  handleInvalidTypeAndGetElementData,
  handleMissingInRequestAndGetElementData,
  getElementData,
  addNodeInString
};
