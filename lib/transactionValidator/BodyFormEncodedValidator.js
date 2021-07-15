const RESPONSE_BODY_PROPERTY = 'RESPONSE_BODY',
  BODY_PROPERTY = 'BODY',
  {
    getValueExample,
    isValidType
  } = require('../utils/knownTypes'),
  MISSING_IN_REQUEST_REASON_CODE = 'MISSING_IN_REQUEST',
  INVALID_TYPE_REASON_CODE = 'INVALID_TYPE',
  MISSING_IN_SCHEMA_REASON_CODE = 'MISSING_IN_SCHEMA';

/**
 * Class to validate a postman query params
 */
class BodyFormEncodedValidator {

  /**
   *
   * @description validates query params
   * @param {object} itemRequestProcessedInfo  operationFromWSDL, options
   * @returns {Array} missmatches array
   */
  validate({ body, operationFromWSDL, options, isResponse }) {
    let transactionPathPrefix = '$.request.body.urlencoded',
      mismatches = [],
      {
        showMissingInSchemaErrors,
        validationPropertiesToIgnore,
        suggestAvailableFixes
      } = options,
      mismatchProperty = isResponse ? RESPONSE_BODY_PROPERTY : BODY_PROPERTY;

    if (validationPropertiesToIgnore && validationPropertiesToIgnore.includes(mismatchProperty)) {
      return mismatches;
    }

    const childrenParams = operationFromWSDL.input[0].children,
      keyValuesArray = body.urlencoded;

    if (showMissingInSchemaErrors) {
      keyValuesArray.forEach((keyValue, index) => {
        let foundOperationParam = childrenParams.find((paramInOperation) => {
          return keyValue.key === paramInOperation.name;
        });
        if (!foundOperationParam) {
          mismatches.push({
            property: mismatchProperty,
            transactionJsonPath: transactionPathPrefix + `[${index}]`,
            schemaJsonPath: null,
            reasonCode: MISSING_IN_SCHEMA_REASON_CODE,
            reason: `The Url Encoded body param "${keyValue.key}" was not found in the schema`
          });
        }
      });
    }
    childrenParams.forEach((paramInOperation, index) => {
      let foundTransactionParam = keyValuesArray.find((keyValue) => {
        return keyValue.key === paramInOperation.name;
      });
      if (!foundTransactionParam) {
        let mismatchObj = {
          property: mismatchProperty,
          transactionJsonPath: transactionPathPrefix,
          schemaJsonPath: operationFromWSDL.xpathInfo.xpath,
          reasonCode: MISSING_IN_REQUEST_REASON_CODE,
          reason: `The Url Encoded body param "${paramInOperation.name}" was not found in the transaction`
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
      else if (!isValidType(foundTransactionParam.value, paramInOperation)) {
        let mismatchObj = {
          property: mismatchProperty,
          transactionJsonPath: transactionPathPrefix + `[${index}]`,
          schemaJsonPath: operationFromWSDL.xpathInfo.xpath,
          reasonCode: INVALID_TYPE_REASON_CODE,
          reason: `The request body needs to be of type ${paramInOperation.type},` +
          ` but we found "${foundTransactionParam.value}"`
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

    return mismatches;
  }

}

module.exports = {
  BodyFormEncodedValidator
};
