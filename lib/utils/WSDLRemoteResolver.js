const { WSDLParserFactory } = require('../WSDLParserFactory'),
  {
    getPrincipalPrefix,
    getWSDLImports,
    getWSDLIncludes,
    getAttributeByName,
    ATTRIBUTE_NAMESPACE,
    ATTRIBUTE_LOCATION
  } = require('../WsdlParserCommon'),
  {
    stringIsAValidUrl
  } = require('../../lib/utils/textUtils'),
  { fetch } = require('fetch-h2'),
  {
    WSDLMerger
  } = require('./WSDLMerger');
var promises = [];

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
 * @param {string} filesToProcess string representation of the file to process
 * @param {object} xmlParser the utility to parse xml to js object
 * @param {Array} downloadedReferences the already downloaded references to avoid re download
 * @return {promise} promis to resolve file downloadings
 */
function processAFile(filesToProcess, xmlParser, downloadedReferences) {
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
    if (stringIsAValidUrl(schemaLocation)) {
      const alreadyDownloaded = downloadedReferences.find((downloadedReference) => {
        return downloadedReference.schemaLocation === schemaLocation;
      });

      if (!alreadyDownloaded) {
        remoteReferencesToResolve.push({
          namespace: getAttributeByName(importInformation, ATTRIBUTE_NAMESPACE),
          schemaLocation
        });
      }
    }
  });

  includes.forEach((importInformation) => {
    let schemaLocation = getAttributeByName(importInformation, ATTRIBUTE_NAMESPACE);
    if (stringIsAValidUrl(schemaLocation)) {
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
    values.forEach((content) => {
      downloadedReferences.push({
        content: content,
        schemaLocation: remoteReferencesToResolve[0].schemaLocation,
        namespace: remoteReferencesToResolve[0].namespace
      });
      return processAFile(content, xmlParser, downloadedReferences);
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
    resolveRemoteRefs
  } = options;
  let filesToProcess = [],
    promise;

  if (!resolveRemoteRefs) {
    return wsdl;
  }
  filesToProcess.push(wsdl);
  promise = processAFile(wsdl, xmlParser, downloadedReferences);
  return promise;
}

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
 * @param {string} wsdl the wsdl in string xml representation
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {object} options contains options to the process
 * @param {function} cb  callback
 * @return {string} a merged file and its parsed rep
 */
function resolveRemoteRefs(wsdl, xmlParser, options = {}, cb) {
  let downloadedReferences = [],
    downloadedInfo = [];
  if (options.resolveRemoteRefs) {
    return resolveRemoteReferences(wsdl, xmlParser, options, downloadedReferences)
      .then(function () {
        Promise.all(promises).then(() => {
          let merger = new WSDLMerger(),
            mergedFile = wsdl;
          downloadedInfo = downloadedReferences.map((downloaded) => {
            return { content: downloaded.content, fileName: '' };
          });
          downloadedInfo.push({ content: wsdl, fileName: '' });
          mergedFile = merger.processMergeFiles(downloadedInfo, xmlParser);
          newParsed = xmlParser.parseToObject(mergedFile);
          return cb(mergedFile, newParsed);
        });
      })
      .catch(function (err) {
        return cb(err);
      });
  }
  return cb(wsdl);
}

module.exports = {
  resolveRemoteRefs
};
