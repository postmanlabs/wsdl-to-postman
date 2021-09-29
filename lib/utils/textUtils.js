const { URL } = require('url');

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
* Removes double quotes characters of a string
* @param {string} text the text to remove the new line characters
* @returns {string} the modified text
*/
removeDoubleQuotes = (text) => {
  return text.replace(/"/g, '');
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

/**
* Returns the last part of an url e.g. www.any.com/some.txt returns some.txt
* if the received value is empty returns empty string
* @param {string} value the text to get the last part of an url
* @returns {string} the modified text
*/
getLastSegmentURL = (value) => {
  if (!value) {
    return '';
  }
  let segment = value.substring(value.lastIndexOf('/') + 1);
  if (segment.lastIndexOf('#') !== -1) {
    segment = value.substring(value.lastIndexOf('#') + 1);
  }
  return segment;
};


/**
* Returns the file name from a path
* e.g. ./../schemas/Types.xsd returns Types.txt
* if the received value is empty returns empty string
* @param {string} value the text to get the last part of an url
* @returns {string} the modified text
*/
getFileNameFromPath = (value) => {
  if (!value) {
    return '';
  }
  let segment = value.substring(value.lastIndexOf('/') + 1);
  return segment;
};

stringIsAValidUrl = (stringToCheck, protocols) => {
  try {
    let objectURL = new URL(stringToCheck);
    return protocols ? objectURL.protocol ? protocols.map((x) => { return `${x.toLowerCase()}:`; })
      .includes(objectURL.protocol) : false : true;
  }
  catch (err) {
    return false;
  }
};

/**
* Returns the path without the file name name from a full path
* e.g.  schemas/Types.xsd returns schemas
* if the received value is empty returns empty string
* @param {string} value the text to get the last part of an url
* @returns {string} the modified text
*/
getFolderNameFromPath = (value) => {
  if (!value) {
    return '';
  }
  let fileName = getFileNameFromPath(value);
  return fileName ? value.replace(fileName, '') : value;
};

module.exports = {
  removeLineBreak,
  isPmVariable,
  removeLineBreakTabsSpaces,
  removeDoubleQuotes,
  getLastSegmentURL,
  getFileNameFromPath,
  stringIsAValidUrl,
  getFolderNameFromPath
};
