const { WSDLMerger } = require('./utils/WSDLMerger');

/**
 * Get the parsed necessary data to run the bundle process
 * @param {object} merger An instance of the WSDLMerger
 * @param {array} filesMappedFromInputToMerge The formatted input files with fileName and content
 * @param {object} xmlParser An instance of the XMLParser
 * @param {object} wsdlParser The WSDLParser instance related with the version in use
 * @returns {object} parsed data necessary to resolve the bundled content
 */
function getFilesParsedData(
  merger,
  filesMappedFromInputToMerge,
  xmlParser,
  wsdlParser
) {
  const wsdlRoot = wsdlParser.informationService.RootTagName,
    parsedXMLsAndFileNames = filesMappedFromInputToMerge.map((file) => {
      return {
        parsed: xmlParser.safeParseToObject(file.content),
        fileName: file.fileName
      };
    }).filter((tuple) => {
      return tuple.parsed !== '';
    }),
    parsedXMLs = parsedXMLsAndFileNames.map((tuple) => {
      return tuple.parsed;
    }),
    fileNames = parsedXMLsAndFileNames.map((tuple) => {
      return tuple.fileName;
    }),
    filesData = merger.getParsedWSDLAndFileNamesFromAllParsed(
      parsedXMLs,
      fileNames,
      wsdlRoot
    ),
    parsedWSDL = filesData.parsedWSDLs,
    rootFileNames = filesData.fileNamesMap,
    rootFiles = merger.getRootSafe(parsedWSDL, wsdlRoot, wsdlParser);

  return {
    parsedXMLsAndFileNames,
    parsedXMLs,
    parsedWSDL,
    rootFileNames,
    rootFiles
  };
}

/**
 * Bundle the provided files and return the formatted bundled data output
 * @param {array} inputData The array of objects to be merged
 * @param {object} wsdlParser The wsdlParser related with the version to use
 * @param {object} xmlParser The xml parser to use
 * @returns {object} The bundled data output
 */
function getBundledFiles(inputData, wsdlParser, xmlParser) {
  const merger = new WSDLMerger(),
    filesMappedFromInputToMerge = inputData.map((fileData) => {
      return {
        content: fileData.content,
        fileName: fileData.path
      };
    }),
    wsdlVersion = wsdlParser.informationService.version,
    parsedData = getFilesParsedData(
      merger,
      filesMappedFromInputToMerge,
      xmlParser,
      wsdlParser
    );

  let mergedFiles = merger.processBundleFiles(
      parsedData,
      wsdlParser,
      xmlParser
    ),
    result = {
      result: true,
      output: {
        type: 'bundledContent',
        specification: {
          type: 'WSDL',
          version: wsdlVersion
        },
        data: mergedFiles
      }
    };
  return result;
}

module.exports = {
  getBundledFiles
};
