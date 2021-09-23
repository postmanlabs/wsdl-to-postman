const { WSDLParserFactory } = require('../WSDLParserFactory'),
  {
    getPrincipalPrefix,
    getWSDLImports,
    getWSDLIncludes,
    getAttributeByName,
    ATTRIBUTE_NAMESPACE,
    ATTRIBUTE_SCHEMALOCATION,
    ATTRIBUTE_LOCATION
  } = require('../WsdlParserCommon'),
  {
    stringIsAValidUrl
  } = require('../../lib/utils/textUtils'),
  { fetch } = require('fetch-h2');

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
 * @param {string} filesToProcess the wsdl in string xml representation
 * @param {string} downloadedReferences the wsdl in string xml representation
 * @return {string} an only xml string with all the imports resolved
 */
 function processAFile(filesToProcess, xmlParser, downloadedReferences) {
  let parserFactory,
    parsedRootFile,
    wsdlRootTagName,
    principalPrefix,
    remoteReferencesToResolve = [],
    promises = [],
    WSDLSpecVersion,
    ignoreIOErrors = true,
    processingFile = filesToProcess.shift();

  parsedRootFile = xmlParser.safeParseToObject(processingFile);
  parserFactory = new WSDLParserFactory();
  WSDLSpecVersion = parserFactory.getWsdlVersion(processingFile);
  wsdlParser = parserFactory.getParserByVersion(WSDLSpecVersion);
  wsdlRootTagName = wsdlParser.informationService.RootTagName;
  const parsedRootFileNS = getAttributeByName(parsedRootFile, ATTRIBUTE_NAMESPACE);

  principalPrefix = getPrincipalPrefix(parsedRootFile, wsdlRootTagName);
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
    promises.push(fetch(remoteReference.schemaLocation).then(function (res) {
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

  return Promise.all(promises).then((values) => {
    values.forEach((content, index) => {
      downloadedReferences.push({
        content: content,
        schemaLocation: remoteReferencesToResolve[index].schemaLocation,
        namespace: remoteReferencesToResolve[index].namespace
      });
      filesToProcess.push(content);
      return processAFile(filesToProcess, xmlParser, downloadedReferences);
    });
  });
}

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
 * @param {string} wsdl the wsdl in string xml representation
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {object} options contains options to the process
 * @return {string} an only xml string with all the imports resolved
 */
function resolveRemoteReferences(wsdl, xmlParser, options = {}, downloadedReferences) {
  const {
    resolveRemoteRefs
  } = options;
  let filesToProcess = [];

  if (!resolveRemoteRefs) {
    return wsdl;
  }
  filesToProcess.push(wsdl);

  return processAFile(filesToProcess, xmlParser, downloadedReferences);

}

/**
 * Receives a WSDL Resolve remote references in imported tags from a WSDL
 * @param {string} wsdl the wsdl in string xml representation
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @param {object} options contains options to the process
 * @param {function} cb  callback
 * @return {string} an only xml string with all the imports resolved
 */
function resolveRemoteRefs(wsdl, xmlParser, options = {}, cb) {
  let downloadedReferences = [];
  if (options.resolveRemoteRefs) {
    return resolveRemoteReferences(wsdl, xmlParser, options, downloadedReferences)
      .then(function () {
        let localD = downloadedReferences;
        return cb(null);
      })
      .catch(function (err) {
        return cb(err);
      });
  }
  return cb(null);
}

module.exports = {
  resolveRemoteReferences,
  resolveRemoteRefs
};
