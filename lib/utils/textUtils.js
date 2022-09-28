const { URL } = require('url'),
  crypto = require('crypto');

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
* Fixes certain occurrences from text that aren't parsed correctly by fast-xml-parser.
* (Issue has been raised at https://github.com/NaturalIntelligence/fast-xml-parser/issues/423)
*
* @param {string} text the text in which to fix comments
* @returns {string} the modified text
*/
fixComments = (text) => {
  return text.replace(/(<!-->)|(<-->)/g, (_, p1, p2) => {
    if (p1) {
      return '<!-- >';
    }
    else if (p2) {
      return '< -->';
    }
  });
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
    try {
      var url = require('url');
      let urlObj = url.parse(stringToCheck);
      if (urlObj.hostname !== null) {
        return false;
      }
      return protocols ? urlObj.protocol ? protocols.map((x) => { return `${x.toLowerCase()}:`; })
        .includes(urlObj.protocol) : false : true;
    }
    catch (parseErr) {
      return false;
    }
  }
};

/**
* Returns absolute path from a base path and a relative one
* @param {string} stringToCheck the url base
* @param {Array} acceptedExtensions the accepted extensions e.g. [ "wsdl", "xsd"]
* @param {Array} protocols the accepted protocols e.g. [ "https", "http"]
* @returns {string} the full path from URL
*/
stringIsValidURLFilePath = (stringToCheck, acceptedExtensions, protocols) => {
  if (!stringToCheck) {
    return false;
  }
  if (!stringIsAValidUrl(stringToCheck, protocols)) {
    return false;
  }
  let lastSegment = getLastSegmentURL(stringToCheck),
    dotedParts = lastSegment.split('.');
  if (dotedParts.length === 1) {
    return false;
  }
  extension = dotedParts.pop();
  return acceptedExtensions ? extension ? acceptedExtensions.map((x) => { return `${x.toLowerCase()}`; })
    .includes(extension.toLowerCase()) : false : true;
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

/**
* Returns absolute path from a base path and a relative one
* @param {string} basePath the url base
* @param {string} relativePath the relative path
* @returns {string} the full path from URL
*/
getAbsoultePathFromRelativeAndBase = (basePath, relativePath) => {
  if (basePath.charAt(basePath.length - 1) !== '/') {
    basePath += '/';
  }
  let objectURL = new URL(relativePath, basePath);
  return objectURL.href;
};

/**
* Returns absolute path from a base path and a relative one
* @param {string} input the url base
* @param {string} algorithm  The `algorithm` is dependent on the available algorithms supported by the
* version of OpenSSL on the platform. Examples are `'sha256'`, `'sha512'`, etc.
* @param {string} encoding The `encoding` of the return value.
* @returns {string} the full path from URL
*/
hash = (input, algorithm, encoding) => {
  return crypto.createHash(algorithm).update(input).digest(encoding);

};

module.exports = {
  removeLineBreak,
  isPmVariable,
  removeLineBreakTabsSpaces,
  removeDoubleQuotes,
  fixComments,
  getLastSegmentURL,
  getFileNameFromPath,
  stringIsAValidUrl,
  getFolderNameFromPath,
  stringIsValidURLFilePath,
  getAbsoultePathFromRelativeAndBase,
  hash
};
