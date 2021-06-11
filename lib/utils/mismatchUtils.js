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
  const lib = new XMLXSDValidator('xmllint').getValidatorLibrary();
  return lib;
}

/**
 * return the element that corresponds with specific key in a message
 * @param {string} body message in request or response
 * @param {string} xpath the xpath for the element we are finding
 * @param {string} reasonCode the reason code for current mismatch
 * @returns {string} the specific element from the key in the message or empty string
 */
function getElementChildrenFromBodyByXpath(body, xpath, reasonCode) {
  let result;
  if ([INVALID_TYPE_REASON_CODE, INVALID_RESPONSE_BODY_REASON_CODE, INVALID_BODY_REASON_CODE].includes(reasonCode)) {
    result = useValidator().getElementText(body, `${xpath}`);
  }
  else {
    result = useValidator().getChildrenAsString(body, xpath);
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
 * gets the self closing element in expected body that has some not expected value in request body
 * and returns it
 * @param {string} reason The reason message gotten from validation with schema library
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @returns {string} xpath corresponding to the element in reason
 */
function handleInvalidBodyAndGetXpath(reason, cleanBody) {
  const result = reason.match(INVALID_BODY_PATTERN),
    elementName = result[1],
    expectedElementXpath = `//${elementName}[count(*)=0]`,
    expectedElementNode = useValidator().findByXpathInXmlString(cleanBody, expectedElementXpath)[0],
    xpath = expectedElementNode.path();
  return xpath;
}

/**
 * gets the element that is in the reason message and has a wrong typed value in current body
 * and returns it
 * @param {string} reason The reason message gotten from the validation with schema library
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @returns {string} xpath corresponding to the element in reason
 */
function handleInvalidTypeAndGetXpath(reason, currentBody) {
  const result = reason.match(INVALID_TYPE_PATTERN),
    elementName = result[1],
    elementValue = result[2],
    wrongElementXpath = `//${elementName}[text()="${elementValue}"]`,
    wrongElementNode = useValidator().findByXpathInXmlString(currentBody, wrongElementXpath)[0],
    xpath = wrongElementNode.path(elementValue);
  return xpath;
}

/**
 * reads the missing in request reason message and gets necessary data to find the mismatched
 * element and returns the xpath
 * @param {string} reason The reason message gotten from the validation with schema library
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @returns {string} xpath corresponding to the element in reason
 */
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
      // missingElement = result[2],
      siblingXpath = `//${sibling}`,
      elementNode = getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath),
      parentNode = elementNode.parent();
    xpath = parentNode.path();
  }
  else if (reason.match(MISSING_IN_REQUEST_MULTIPLE_SIBLINGS_PATTERN)) {
    result = reason.match(MISSING_IN_REQUEST_MULTIPLE_SIBLINGS_PATTERN);
    let sibling = result[1],
      // missingElement = result[2],
      siblingXpath = `//${sibling}`,
      elementNode = getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath),
      parentNode = elementNode.parent();
    xpath = parentNode.path();
  }
  return xpath;
}

/**
 * reads the missing in schema reason message and gets necessary data to find the mismatched
 * element and returns the xpath
 * @param {string} reason The reason message gotten from the validation with schema library
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @returns {string} xpath corresponding to the element in reason
 */
function handleMissingInSchemaAndGetXpath(reason, currentBody, cleanBody) {
  const result = reason.match(MISSING_IN_SCHEMA_PATTERN),
    elementName = result[1],
    elementXpath = `//${elementName}`,
    elementNode = getElementFromMissingInSchemaByXpath(currentBody, cleanBody, elementXpath),
    parentNode = elementNode.parent(),
    xpath = parentNode.path();
  return xpath;
}

/**
 * get the key xpath depending on the mismatch reason and resonCode
 * @param {object} mismatch mismatch object we will add suggested fix
 * @param {string} currentBody request body clean string
 * @param {string} cleanBody expected body clean generated from the schema
 * @returns {string} the corresponding xpath depending on the reasonCode
 */
function getKeyXpath(mismatch, currentBody, cleanBody) {
  const {
    reasonCode,
    reason
  } = mismatch;

  if ([INVALID_BODY_REASON_CODE, INVALID_RESPONSE_BODY_REASON_CODE].includes(reasonCode)) {
    // if gets in there is an error in the body content
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
    actualValue,
    suggestedValue,
    xpath = '';
  const {
    reasonCode
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

module.exports = {
  getBodyMismatchObject,
  getMismatchWithSuggestedFix,
  getElementChildrenFromBodyByXpath,
  getElementFromMissingInRequestByPath,
  getElementFromMissingInRequestBySiblingsXpath,
  getElementFromMissingInSchemaByXpath,
  handleInvalidTypeAndGetXpath
};
