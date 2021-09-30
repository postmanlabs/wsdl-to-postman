/* eslint-disable no-restricted-modules */
const { WSDLParserFactory } = require('../WSDLParserFactory'),
  {
    getPrincipalPrefix,
    getWSDLImports,
    getWSDLIncludes,
    getAttributeByName,
    ATTRIBUTE_NAMESPACE,
    ATTRIBUTE_LOCATION,
    ATTRIBUTE_SCHEMALOCATION
  } = require('../WsdlParserCommon'),
  {
    stringIsValidURLFilePath
  } = require('../../lib/utils/textUtils'),
  { fetch } = require('fetch-h2'),
  {
    WSDLMerger
  } = require('./WSDLMerger');
var promises = [],
  path = require('path'),
  pathBrowserify = require('path-browserify');


/**
* Receives a string and determines if is an absolute path of a wsdl or xsd file
* @param {string} filePath string path
* @return {boolean} true if is a correct file path to a wsdl or xsd otherwise false
*/
function validateIsWSDLOrXSDFilePath(filePath) {
  return stringIsValidURLFilePath(filePath, ['wsdl', 'xsd']);
}

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
 * @param {string} filesToProcess string representation of the file to process
 * @param {object} xmlParser the utility to parse xml to js object
 * @param {Array} downloadedReferences the already downloaded references to avoid re download
 * @param {string} processURL url for download files if the first file could be either the option
 *  or empty
 * @param {string} optionProcessURL the option set for the user for process url
 * @return {promise} promise to resolve file downloadings
 */
function processAFile(filesToProcess, xmlParser, downloadedReferences, processURL, optionProcessURL) {
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

  parsedRootFile = xmlParser.safeParseToObject(processingFile);
  parserFactory = new WSDLParserFactory();
  WSDLSpecVersion = parserFactory.getSafeWsdlVersion(processingFile);
  if (!WSDLSpecVersion) {
    wsdlRootTagName = 'schema';
    principalPrefix = getPrincipalPrefix(parsedRootFile, wsdlRootTagName);
    parsedRootFileNS = getAttributeByName(parsedRootFile, 'targetNamespace');
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
    if (validateIsWSDLOrXSDFilePath(schemaLocation)) {
      downloadPath = schemaLocation;
      if (!processURL) {
        processURL = getFolderNameFromPath(schemaLocation);
      }
    }
    else if (processURL) {
      downloadPath = path.resolve(processURL, schemaLocation);
      downloadPath = validateIsWSDLOrXSDFilePath(downloadPath) ? downloadPath : '';
    }
    else if (optionProcessURL) {
      downloadPath = path.resolve(optionProcessURL, schemaLocation);
      downloadPath = validateIsWSDLOrXSDFilePath(downloadPath) ? downloadPath : '';
      processURL = optionProcessURL;
    }
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
    if (validateIsWSDLOrXSDFilePath(schemaLocation)) {
      const alreadyDownloaded = downloadedReferences.find((downloadedReference) => {
        return downloadedReference.schemaLocation === schemaLocation;
      });
      if (!alreadyDownloaded) {
        remoteReferencesToResolve.push({
          namespace: parsedRootFileNS,
          schemaLocation
        });
      }
    }
  });

  remoteReferencesToResolve.forEach((remoteReference) => {
    localPromises.push(fetch(remoteReference.schemaLocation).then(function (res) {
      const { schemaLocation } = remoteReference;
      if (res.status !== 200) {
        if (ignoreIOErrors) {
          return '{"$ref":}';
        }
        throw new Error(`Received status code ${res.status}: ${schemaLocation}`);
      }
      return res.text();
    }));
  });
  promise = Promise.all(localPromises).then((values) => {
    values.forEach((content, index) => {
      downloadedReferences.push({
        content: content,
        schemaLocation: remoteReferencesToResolve[index].schemaLocation,
        namespace: remoteReferencesToResolve[index].namespace
      });
      return processAFile(content, xmlParser, downloadedReferences, processURL, optionProcessURL);
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
 * @return {promise} a promise to execute after all processing
 */
function resolveRemoteReferences(wsdl, xmlParser, options = {}, downloadedReferences) {
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
  promise = processAFile(wsdl, xmlParser, downloadedReferences, sourceUrl);
  return promise;
}

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
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
  if (origin === 'browser') {
    path = pathBrowserify;
  }
  if (options.resolveRemoteRefs) {
    try {
      return resolveRemoteReferences(data, xmlParser, options, downloadedReferences)
        .then(function () {
          Promise.all(promises).then(() => {
            let merger = new WSDLMerger(),
              mergedFile = data;
            downloadedInfo = downloadedReferences.map((downloaded) => {
              return { content: downloaded.content, fileName: '' };
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

module.exports = {
  resolveRemoteRefs
};
