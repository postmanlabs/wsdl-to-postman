const { XMLXSDValidator } = require('../xsdValidation/XMLXSDValidator');

const INVALID_BODY_DEFAULT_MESSAGE = 'The request body didn\'t match the specified schema',
  RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
  BODY_PROPERTY = 'BODY',
  MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  MISSING_IN_SCHEMA_REASON_CODE = 'MISSING_IN_SCHEMA',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  INVALID_BODY_REASON_CODE = 'INVALID_BODY',
  INVALID_RESPONSE_BODY_REASON_CODE = 'INVALID_RESPONSE_BODY',
  MISSING_IN_REQUEST_PARENT_PATTERN = /Element \'(.*)\': Missing child element\(s\). Expected is \( (.*) \)/,
  MISSING_IN_REQUEST_ONE_SIBLING_PATTERN = /Element \'(.*)\': This element is not expected\. Expected is \( (.*) \)/,
  MISSING_IN_REQUEST_MULTIPLE_SIBLINGS_PATTERN = /Element \'(.*)\': This element is not expected. Expected is one of ( (.*) )/,
  MISSING_IN_SCHEMA_PATTERN = /Element \'(.*)\': This element is not expected/,
  INVALID_TYPE_PATTERN = /Element \'(.*)\': \'(.*)\' is not a valid value of the atomic type \'(.*)\'/,
  INVALID_BODY_PATTERN = /Element \'(.*)\': Character content is not allowed, because the content type is empty/;

function useValidator() {
  return new XMLXSDValidator('libxmljs').getValidatorLibrary();
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
   * Takes a mismatch base and add the suggested fix parameter
   * @param {object} mismatch mismatch to be reported
   * @param {string} currentBody body that has generated the mismatch
   * @param {string} bodyFromSchema correct body generated from schema
   * @param {boolean} detailedBlobValidation options that indicates if we will report details or not
   * @returns {object} mismatch with suggested fix param
   */
function getMismatchWithSuggestedFix(mismatch, currentBody, bodyFromSchema, detailedBlobValidation, cleanSchema) {
  let newMismatch = JSON.parse(JSON.stringify(mismatch)),
    key = '',
    actualValue,
    suggestedValue,
    xpath = '';
  const {
    reasonCode,
    reason
  } = newMismatch;

  if (!detailedBlobValidation) {
    key = 'body';
    actualValue = currentBody;
    suggestedValue = bodyFromSchema;
  }
  else {
    xpath = getKeyXpath(newMismatch, currentBody, bodyFromSchema);
    actualValue = getElementChildrenFromBodyByXpath(currentBody, xpath, reasonCode);
    suggestedValue = getElementChildrenFromBodyByXpath(
      bodyFromSchema,
      xpath,
      reasonCode
    );
  }
  newMismatch.suggestedFix = {
    key: key ? key : xpath,
    actualValue,
    suggestedValue
  };
  return newMismatch;
}

function getKeyXpath(mismatch, currentBody, cleanBody) {
  const {
    reasonCode,
    reason
  } = mismatch;

  let key, wrongValue;

  if ([INVALID_BODY_REASON_CODE, INVALID_RESPONSE_BODY_REASON_CODE].includes(reasonCode)) {
    // if gets in is an error in the body content
    result = handleInvalidBodyAndGetXpath(reason, cleanBody);
  }
  else if (reasonCode === INVALID_TYPE_REASON_CODE) {
    // reason contains key, wrong value and expected type
    result = handleInvalidTypeAndGetXpath(reason, currentBody);
  }
  else if (reasonCode === MISSING_IN_REQUEST_REASON_CODE) {
    // reason contains missing element's parent key, expected element key
    result = handleMissingInRequestAndGetXpath(reason, currentBody, cleanBody);
  }
  else if (reasonCode === MISSING_IN_SCHEMA_REASON_CODE) {
    // reason contains not expected key
    result = handleMissingInSchemaAndGetXpath(reason, currentBody, cleanBody);
  }

  return result;
}

function handleMissingInSchemaAndGetXpath(reason, currentBody, cleanBody) {
  const result = reason.match(MISSING_IN_SCHEMA_PATTERN),
    elementName = result[1],
    elementXpath = `//${elementName}`,
    elementNode = getElementFromMissingInSchemaByXpath(currentBody, cleanBody, elementXpath),
    parentNode = elementNode.parent(),
    xpath = parentNode.path();
    return xpath;
}

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
  * calculates the mismatch reason code depending on the error,
  * the detailedBlobValidation option and if is it a response or a request
  * @param {object} error the error that will be reported
  * @param {boolean} detailedBlobValidation
  * @param {*} isResponse
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
  * Get the wrong field key from error message
  * @param {string} mismatchReason message from error object
  * @returns {string} wrong field key
  */
function getKeyFromReason(mismatchReason) {
  const element = new RegExp(/Element '([^']+)':/),
    quotedTextInElement = mismatchReason.match(element)[1];
  return quotedTextInElement;
}

/**
 * return the element that corresponds with specific key in a message
 * @param {string} body message in request or response
 * @param {string} elementKey the key from the wrong element in the body
 * @returns {string} the specific element from the key in the message or empty string
 */
function getElementChildrenFromBodyByXpath(body, xpath, reasonCode) {
  let document, result;
  if([INVALID_TYPE_REASON_CODE, INVALID_RESPONSE_BODY_REASON_CODE, INVALID_BODY_REASON_CODE].includes(reasonCode)) {
    const element = useValidator().findByXpathInXmlString(body, `${xpath}/text()`);
    result = element.length > 0 ? element[0].toString() : '';
  }
  else {
    result = useValidator().findByXpathInXmlString(body, `${xpath}/*`).map((element) => {
      return element.toString();
    }).join('\n');
  }
  
  return result
}

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

function getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath) {
  const currentElements = useValidator().findByXpathInXmlString(currentBody, siblingXpath),
    expectedElements = useValidator().findByXpathInXmlString(cleanBody, siblingXpath),
    currentPrevElement = currentElements.map((element) => {
      return element.prevElement();
    }),
    expectedPrevElement = expectedElements.map((element) => {
      return element.prevElement();
    }),
    result = expectedPrevElement.filter((element) => !currentPrevElement.includes(element));
  return result[0];
}

function handleMissingInRequestAndGetXpath(reason, currentBody, cleanBody) {
  let result, xpath;
  if (reason.match(MISSING_IN_REQUEST_PARENT_PATTERN)) {
    result = reason.match(MISSING_IN_REQUEST_PARENT_PATTERN);
    let parent = result[1],
      element = result[2],
      elementXpath = `//${parent}/${element}`,
      elementNode = getElementFromMissingInRequestByPath(currentBody, cleanBody, elementXpath),
      parentNode = elementNode.parent();
    xpath = parentNode.path();
  }
  else if (reason.match(MISSING_IN_REQUEST_ONE_SIBLING_PATTERN)) {
    result = reason.match(MISSING_IN_REQUEST_ONE_SIBLING_PATTERN);
    let sibling = result[1],
      missingElement = result[2],
      siblingXpath = `//${sibling}`,
      elementNode = getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath),
      parentNode = elementNode.parent();
    xpath = parentNode.path();
  }
  else if (reason.match(MISSING_IN_REQUEST_MULTIPLE_SIBLINGS_PATTERN)) {
    result = reason.match(MISSING_IN_REQUEST_MULTIPLE_SIBLINGS_PATTERN);
    let sibling = result[1],
      missingElement = result[2],
      siblingXpath = `//${sibling}`,
      elementNode = getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath),
      parentNode = elementNode.parent();
    xpath = parentNode.path();
  }
  return xpath;
}

function handleInvalidTypeAndGetXpath(reason, currentBody) {
  const result = reason.match(INVALID_TYPE_PATTERN),
    elementName = result[1],
    elementValue = result[2],
    wrongElementXpath = `//${elementName}[text()="${elementValue}"]`,
    wrongElementNode = useValidator().findByXpathInXmlString(currentBody, wrongElementXpath)[0],
    xpath = wrongElementNode.path();
    return xpath;
}

function handleInvalidBodyAndGetXpath(reason, cleanBody) {
  const result = reason.match(INVALID_BODY_PATTERN),
    elementName = result[1],
    expectedElementXpath = `//${elementName}[count(*)=0]`,
    expectedElementNode = useValidator().findByXpathInXmlString(cleanBody, expectedElementXpath)[0],
    xpath = expectedElementNode.path();
  return xpath;
}


module.exports = {
  getBodyMismatchObject,
  getMismatchWithSuggestedFix,
  getElementChildrenFromBodyByXpath,
  getElementFromMissingInRequestByPath,
  getElementFromMissingInRequestBySiblingsXpath,
  getElementFromMissingInSchemaByXpath,
  handleInvalidTypeAndGetXpath
}
