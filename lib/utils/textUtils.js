
/**
* Removes new line characters of a string
* @param {string} text the text to remove the new line characters
* @returns {string} the modified text
*/
removeLineBreak = (text) => {
  return text.replace(/(\r\n|\n|\r)/gm, '');
};

/**
* Removes new line characters and tabs of a string
* @param {string} text the text to remove the new line characters
* @returns {string} the modified text
*/
removeLineBreakTabsSpaces = (text) => {
  return text.replace(/[\r\n\s\t]+/g, '');
};

/**
  *
  * @description Identifies if a value is a Postman Variable
  * collection/environment variables are in format - {{var}}
  * @param {*} value itemRequestProcessedInfo
  * @returns {boolean} if is a postman variable true otherwise false
  */
isPmVariable = (value) => {
  return typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}');
};

module.exports = {
  removeLineBreak,
  isPmVariable,
  removeLineBreakTabsSpaces
};
