const _ = require('lodash'),
  MULTI_FILE_API_TYPE_ALLOWED_VALUE = 'multiFile',
  DEFAULT_SPEC_VERSION = '1.1',
  VERSION20 = '2.0';


/**
   * compares a version with an input
   * @param {string} input The input to compare
   * @param {string} version The version that will be used
   * @returns {boolean} wheter the input corresponds to the version
   */
function compareVersion(input, version) {
  let numberInput,
    numberVersion;
  numberInput = parseFloat(input);
  numberVersion = parseFloat(version);
  if (!isNaN(numberInput) && !isNaN(numberVersion)) {
    return numberInput === numberVersion;
  }
  return false;
}


/**
 * Validates if the input version is valid
 * @param {string} version The current spec version
 * @returns {boolean} True if the current version is supported
 */
function validateSupportedVersion(version) {
  if (!version) {
    return false;
  }

  let isValid = [DEFAULT_SPEC_VERSION, VERSION20].find((supportedVersion) => {
    return compareVersion(version, supportedVersion);
  });
  return isValid !== undefined;
}

module.exports = {
  /**
   *
   * @description Validates the input for multi file APIs
   * @param {string} processInput - Process input data
   *
   * @returns {undefined} - nothing
   */
  validateInputMultiFileAPI(processInput) {
    if (_.isEmpty(processInput)) {
      throw new Error('Input object must have "type" and "data" information');
    }
    if (!processInput.type) {
      throw new Error('"Type" parameter should be provided');
    }
    if (processInput.type !== MULTI_FILE_API_TYPE_ALLOWED_VALUE) {
      throw new Error('"Type" parameter value allowed is ' + MULTI_FILE_API_TYPE_ALLOWED_VALUE);
    }
    if (!processInput.data || processInput.data.length === 0) {
      throw new Error('"Data" parameter should be provided');
    }
    if (processInput.data[0].path === '') {
      throw new Error('"Path" of the data element should be provided');
    }
    if (processInput.specificationVersion && !validateSupportedVersion(processInput.specificationVersion)) {
      throw new Error(`The provided version "${processInput.specificationVersion}" is not valid`);
    }
  }
};
