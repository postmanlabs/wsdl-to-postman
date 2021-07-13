const QUERYPARAM_PROPERTY = 'QUERYPARAM',
  {
    getAllButProtocolAndHost
  } = require('../utils/urlUtils'),
  {
    URL_ENCODED_GET
  } = require('../constants/processConstants'),
  {
    URLWithParamsHelper
  } = require('../utils/URLWithParamsHelper'),
  {
    getValueExample
  } = require('../utils/knownTypes'),
  MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  MISSING_IN_SCHEMA_REASON_CODE = 'MISSING_IN_SCHEMA';

/**
 * Class to validate XML against an XSD schema.
 * Facade to xmllint package
 */
class QueryParamsValidator {

  /**
   *
   * @description validates query params
   * @param {object} itemRequestProcessedInfo  operationFromWSDL, options
   * @returns {Array} missmatches array
   */
  validate({ itemRequestProcessedInfo, operationFromWSDL, options }) {
    let rawItemRequestUrl,
      operationUrlWithoutProtocol,
      mimeContentInput,
      transactionPathPrefix = '$.request.url.query',
      mismatches = [],
      {
        showMissingInSchemaErrors,
        validationPropertiesToIgnore,
        suggestAvailableFixes
      } = options;

    if (validationPropertiesToIgnore && validationPropertiesToIgnore.includes(QUERYPARAM_PROPERTY)) {
      return mismatches;
    }

    rawItemRequestUrl = itemRequestProcessedInfo.fullURL;
    operationUrlWithoutProtocol = getAllButProtocolAndHost(operationFromWSDL.url);

    if (rawItemRequestUrl === operationUrlWithoutProtocol) {
      return mismatches;
    }
    mimeContentInput = operationFromWSDL.mimeContentInput;
    if (mimeContentInput && mimeContentInput.mimeType === URL_ENCODED_GET) {
      const childrenParams = operationFromWSDL.input[0].children,
        helper = new URLWithParamsHelper(),
        keyValuesArray = helper.getKeyValuesFromURLParams(rawItemRequestUrl);

      if (showMissingInSchemaErrors) {
        keyValuesArray.forEach((keyValue, index) => {
          let foundOperationParam = childrenParams.find((paramInOperation) => {
            return keyValue.key === paramInOperation.name;
          });
          if (!foundOperationParam) {
            mismatches.push({
              property: QUERYPARAM_PROPERTY,
              transactionJsonPath: transactionPathPrefix + `[${index}]`,
              schemaJsonPath: null,
              reasonCode: MISSING_IN_SCHEMA_REASON_CODE,
              reason: `The query parameter ${keyValue.key} was not found in the schema`
            });
          }
        });
      }
      childrenParams.forEach((paramInOperation) => {
        let foundTransactionParam = keyValuesArray.find((keyValue) => {
          return keyValue.key === paramInOperation.name;
        });
        if (!foundTransactionParam) {
          let mismatchObj = {
            property: QUERYPARAM_PROPERTY,
            transactionJsonPath: transactionPathPrefix,
            schemaJsonPath: operationFromWSDL.xpathInfo.xpath,
            reasonCode: MISSING_IN_REQUEST_REASON_CODE,
            reason: `The required query parameter "${paramInOperation.name}" was not found in the transaction`
          };

          if (suggestAvailableFixes) {
            mismatchObj.suggestedFix = {
              key: paramInOperation.name,
              actualValue: null,
              suggestedValue: {
                key: paramInOperation.name,
                value: getValueExample(paramInOperation)
              }
            };
          }
          mismatches.push(mismatchObj);
        }
      });
    }
    return mismatches;
  }

}

module.exports = {
  QueryParamsValidator
};
