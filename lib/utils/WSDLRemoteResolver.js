/* eslint-disable no-restricted-modules */
/* eslint-disable block-scoped-var */

const { WSDLParserFactory } = require('../WSDLParserFactory'),
  {
    getPrincipalPrefix,
    getWSDLImports,
    getWSDLIncludes,
    getAttributeByName,
    ATTRIBUTE_NAMESPACE,
    ATTRIBUTE_LOCATION,
    ATTRIBUTE_SCHEMALOCATION,
    SCHEMA_TAG,
    TARGET_NAMESPACE_SPEC,
    canGetPrincipalPrefix
  } = require('../WsdlParserCommon'),
  {
    stringIsValidURLFilePath,
    getAbsoultePathFromRelativeAndBase,
    getLastSegmentURL
  } = require('../../lib/utils/textUtils'),
  {
    WSDLMerger
  } = require('./WSDLMerger'),
  validExtensions = ['wsdl', 'xsd'],
  MISSING_REMOTE_FILE_IDENTIFIER = '{"$ref":}';
var promises = [];

/**
 * Takes a list of arguments and resolve them acording its content
 * @param {string} origin The arguments that will be resolved
 * @param {string} remoteRefsResolver The arguments that will be resolved
 * @returns {array} The list of arguments after have been resolved
 */
function resolveFetchFunction(origin, remoteRefsResolver) {
  if (remoteRefsResolver) {
    return remoteRefsResolver;
  }
  if (origin !== 'browser') {
    return require('node-fetch');
  }
}

/**
* Receives a string and determines if is an absolute path of a wsdl or xsd file
* @param {string} filePath string path
* @return {boolean} true if is a correct file path to a wsdl or xsd otherwise false
*/
function validateIsWSDLOrXSDFilePath(filePath) {
  return stringIsValidURLFilePath(filePath, validExtensions);
}

/**
 * Calculates download path and if needed new parentBaseURL
 * @param {string} schemaLocation schema location or location from the import or include tag
 * @param {string} parentBaseURL the base URL of the previous processed file
 * @param {string} optionProcessURL the option set for the user for process url
 * @returns {object} A valid Result object with format {parentBaseURL: <string>, downloadPath: <string>}
 */
function calculateDownloadPathAndParentBaseURL(schemaLocation, parentBaseURL, optionProcessURL) {
  let downloadPath,
    calculatedParentBaseURL;
  if (validateIsWSDLOrXSDFilePath(schemaLocation)) {
    downloadPath = schemaLocation;
    calculatedParentBaseURL = getFolderNameFromPath(schemaLocation);
  }
  else if (parentBaseURL) {
    downloadPath = getAbsoultePathFromRelativeAndBase(parentBaseURL, schemaLocation);
    downloadPath = validateIsWSDLOrXSDFilePath(downloadPath) ? downloadPath : '';
    calculatedParentBaseURL = parentBaseURL;
  }
  else if (optionProcessURL) {
    downloadPath = getAbsoultePathFromRelativeAndBase(optionProcessURL, schemaLocation);
    downloadPath = validateIsWSDLOrXSDFilePath(downloadPath) ? downloadPath : '';
    calculatedParentBaseURL = optionProcessURL;
  }
  return { parentBaseURL: calculatedParentBaseURL, downloadPath };
}

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
 * @param {string} filesToProcess string representation of the file to process
 * @param {object} xmlParser the utility to parse xml to js object
 * @param {Array} downloadedReferences the already downloaded references to avoid re download
 * @param {string} parentBaseURL url for download files if the first file could be either the option
 *  or empty
 * @param {string} optionProcessURL the option set for the user for process url
 * @param {string} origin app's context
 * @param {function} remoteRefsResolver function for fetching files
 * @return {promise} promise to resolve file downloads
 */
function processAFile(filesToProcess, xmlParser, downloadedReferences, parentBaseURL, optionProcessURL,
  origin, remoteRefsResolver) {
  let parserFactory,
    parsedRootFile,
    wsdlRootTagName,
    principalPrefix,
    promise,
    remoteReferencesToResolve = [],
    WSDLSpecVersion,
    ignoreIOErrors = true,
    parsedRootFileNS,
    localPromises = [],
    downloadPath = '',
    processingFile = filesToProcess;
  var fetch = resolveFetchFunction(origin, remoteRefsResolver);


  parsedRootFile = xmlParser.safeParseToObject(processingFile);
  if (parsedRootFile === '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1);
    });
  }
  parserFactory = new WSDLParserFactory();
  WSDLSpecVersion = parserFactory.getSafeWsdlVersion(processingFile);
  if (!WSDLSpecVersion) {
    wsdlRootTagName = SCHEMA_TAG;
    if (!canGetPrincipalPrefix(parsedRootFile, wsdlRootTagName)) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1);
      });
    }
    principalPrefix = getPrincipalPrefix(parsedRootFile, wsdlRootTagName);
    parsedRootFileNS = getAttributeByName(parsedRootFile, TARGET_NAMESPACE_SPEC);
  }
  else {
    wsdlParser = parserFactory.getParserByVersion(WSDLSpecVersion);
    wsdlRootTagName = wsdlParser.informationService.RootTagName;
    parsedRootFileNS = getAttributeByName(parsedRootFile, ATTRIBUTE_NAMESPACE);

    principalPrefix = getPrincipalPrefix(parsedRootFile, wsdlRootTagName);
  }
  imports = getWSDLImports(parsedRootFile, principalPrefix, wsdlRootTagName);
  includes = getWSDLIncludes(parsedRootFile, principalPrefix, wsdlRootTagName);

  imports.forEach((importInformation) => {
    let schemaLocation = getAttributeByName(importInformation, ATTRIBUTE_LOCATION);
    if (!schemaLocation) {
      schemaLocation = getAttributeByName(importInformation, ATTRIBUTE_SCHEMALOCATION);
    }
    ({ parentBaseURL, downloadPath } = calculateDownloadPathAndParentBaseURL(schemaLocation, parentBaseURL,
      optionProcessURL));
    if (downloadPath) {
      const alreadyDownloaded = downloadedReferences.find((downloadedReference) => {
        return downloadedReference.schemaLocation === downloadPath;
      });

      if (!alreadyDownloaded) {
        remoteReferencesToResolve.push({
          namespace: getAttributeByName(importInformation, ATTRIBUTE_NAMESPACE),
          schemaLocation: downloadPath
        });
      }
    }
  });

  includes.forEach((importInformation) => {
    let schemaLocation = getAttributeByName(importInformation, ATTRIBUTE_SCHEMALOCATION);
    ({ parentBaseURL, downloadPath } = calculateDownloadPathAndParentBaseURL(schemaLocation, parentBaseURL,
      optionProcessURL));

    if (downloadPath) {
      const alreadyDownloaded = downloadedReferences.find((downloadedReference) => {
        return downloadedReference.schemaLocation === downloadPath;
      });
      if (!alreadyDownloaded) {
        remoteReferencesToResolve.push({
          namespace: parsedRootFileNS,
          schemaLocation: downloadPath
        });
      }
    }
  });
  remoteReferencesToResolve.forEach((remoteReference) => {
    localPromises.push(fetch(remoteReference.schemaLocation).then(function (res) {
      const { schemaLocation } = remoteReference;
      if (res.status !== 200) {
        if (ignoreIOErrors) {
          return MISSING_REMOTE_FILE_IDENTIFIER + remoteReference.schemaLocation;
        }
        throw new Error(`Received status code ${res.status}: ${schemaLocation}`);
      }
      return res.text();
    }));
  });
  promise = Promise.all(localPromises).then((values) => {
    values.forEach((content, index) => {
      const alreadyDownloaded = downloadedReferences.find((downloadedReference) => {
        return downloadedReference.schemaLocation === remoteReferencesToResolve[index].schemaLocation &&
        downloadedReference.namespace === remoteReferencesToResolve[index].namespace;
      });
      if (!alreadyDownloaded) {
        downloadedReferences.push({
          content: content,
          schemaLocation: remoteReferencesToResolve[index].schemaLocation,
          namespace: remoteReferencesToResolve[index].namespace,
          fileName: getLastSegmentURL(remoteReferencesToResolve[index].schemaLocation)
        });
      }
      if (!content.includes(MISSING_REMOTE_FILE_IDENTIFIER)) {
        return processAFile(content, xmlParser, downloadedReferences, parentBaseURL, optionProcessURL,
          origin, remoteRefsResolver);
      }
    });
  });
  promises.push(promise);
  return promise;
}

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
 * @param {string} wsdl the wsdl in string xml representation
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {object} options contains options to the process
 * @param {Array} downloadedReferences already downloaded files
 * @param {string} origin app's context
 * @return {promise} a promise to execute after all processing
 */
function processRemoteReferences(wsdl, xmlParser, options = {}, downloadedReferences, origin) {
  const {
    resolveRemoteRefs,
    sourceUrl
  } = options;
  let filesToProcess = [],
    promise;

  if (!resolveRemoteRefs) {
    return wsdl;
  }
  filesToProcess.push(wsdl);
  promise = processAFile(wsdl, xmlParser, downloadedReferences, '', sourceUrl, origin, options.remoteRefsResolver);
  return promise;
}

/**
 * Receives a WSDL the resolves remote references in imported tags from a WSDL then merge the result
 * @param {object} input the process input
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {object} options contains options to the process
 * @param {function} cb  callback
 * @return {string} a merged file and its parsed rep
 */
function resolveRemoteRefs(input, xmlParser, options = {}, cb) {
  let downloadedReferences = [],
    { data, origin } = input,
    downloadedInfo = [];
  if (options.resolveRemoteRefs) {
    try {
      return processRemoteReferences(data, xmlParser, options, downloadedReferences, origin)
        .then(function () {
          Promise.all(promises).then(() => {
            let merger = new WSDLMerger(),
              mergedFile = data;
            downloadedInfo = downloadedReferences.map((downloaded) => {
              return { content: downloaded.content, fileName: downloaded.fileName };
            });
            try {
              downloadedInfo.push({ content: data, fileName: '' });
              mergedFile = merger.processMergeFiles(downloadedInfo, xmlParser, origin);
              newParsed = xmlParser.parseToObject(mergedFile);
              return cb({ mergedFile, newParsed });
            }
            catch (err) {
              return cb({ err });
            }
          });
        })
        .catch(function (err) {
          return cb({ err });
        });
    }
    catch (err) {
      return cb({ err });
    }
  }
  return cb({ mergedFile: data });
}

/**
 * Receives a WSDL then resolves remote references in imported tags from a WSDL
 * @param {object} input the process input
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {object} options contains options to the process
 * @return {object} {path, content} a merged file and its parsed rep
 */
async function resolveRemoteRefsNoMerge(input, xmlParser, options = {}) {
  let downloadedReferences = [],
    { data, origin } = input,
    downloadedInfo = [];
  if (options.resolveRemoteRefs) {
    try {
      await processRemoteReferences(data, xmlParser, options, downloadedReferences, origin);
      await Promise.all(promises);

      downloadedInfo = downloadedReferences.map((downloaded) => {
        return { content: downloaded.content, path: downloaded.fileName };
      });
    }
    catch (err) {
      throw err;
    }
  }
  return downloadedInfo;
}

/**
   * Validates the input of the remote ref solver
   * Throws error
   * @param {object} specRoot - root file information
   * @param {boolean} batch - whether is a batch validation
   * @returns {undefined} -
   */
function validateInputGetRemoteReferences(specRoot, batch = false) {
  if (!specRoot || specRoot.length === 0) {
    if (batch) {
      return false;
    }
    throw new Error('Root file must be defined');
  }
  return true;
}

/**
 * Find and downloads the remote references from the specRoots array
 * @param {array} specRoots - root file information
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {object} options contains options to the process
 * @returns {object} - Remote references result object
 */
async function getRemoteReferencesArray(specRoots, xmlParser, options = {}) {
  if (!specRoots || specRoots.length === 0) {
    return [];
  }
  let cleanRoots = specRoots.filter((root) => {
      let isValid = validateInputGetRemoteReferences(root, true);
      return isValid;
    }),
    result = [];

  for (let index = 0; index < cleanRoots.length; index++) {
    let res = await resolveRemoteRefsNoMerge(cleanRoots[index], xmlParser, options);
    result.push(res);
  }
  return result;
}

/**
   * @description resolve the remote references and assign the information to the input
   * @param {object} input - Process input data
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @param {object} options - Process options
   *
   * @returns {undefined} - nothing
   */
async function resolveRemoteRefsMultiFile(input, xmlParser, options) {
  let remoteRefRes =
  await getRemoteReferencesArray(input.rootFiles, xmlParser, options),
    foundRemoteRefs = remoteRefRes.flat();
  return foundRemoteRefs;
}


module.exports = {
  resolveRemoteRefs,
  calculateDownloadPathAndParentBaseURL,
  resolveRemoteRefsNoMerge,
  getRemoteReferencesArray,
  resolveRemoteRefsMultiFile,
  MISSING_REMOTE_FILE_IDENTIFIER
};
