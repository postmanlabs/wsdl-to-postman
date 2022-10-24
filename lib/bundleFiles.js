const { WSDLMerger } = require('./utils/WSDLMerger');

/**
 * Get the parsed necessary data to run the bundle process
 * @param {object} merger An instance of the WSDLMerger
 * @param {array} filesMappedFromInputToMerge The formatted input files with fileName and content
 * @param {object} xmlParser An instance of the XMLParser
 * @param {object} wsdlParser The WSDLParser instance related with the version in use
 * @param {array} inputRootFiles The root files from the user input
 * @returns {object} parsed data necessary to resolve the bundled content
 */
function getFilesParsedData(
  merger,
  filesMappedFromInputToMerge,
  xmlParser,
  wsdlParser,
  inputRootFiles
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
    parsedWSDL = filesData.parsedWSDLs;
  let rootFileNames = [],
    rootFiles = [];
  if (!inputRootFiles || inputRootFiles.length === 0) {
    rootFiles = merger.getRootSafe(parsedWSDL, wsdlRoot, wsdlParser);
    rootFiles.forEach((rootFile) => {
      let indexFound = filesData.parsedWSDLs.findIndex((parsedWSDL) => {
        return parsedWSDL === rootFile;
      });
      if (indexFound >= 0) {
        rootFileNames.push(filesData.fileNamesMap[indexFound]);
      }
    });
  }
  else {
    inputRootFiles.map((rootFile) => {
      let foundRoot = parsedXMLsAndFileNames.find((parsed) => {
        return parsed.fileName === rootFile.path;
      });
      if (foundRoot) {
        rootFiles.push(foundRoot.parsed);
        rootFileNames.push(foundRoot.fileName);
      }
    });
  }

  if (!rootFiles || rootFiles.length === 0) {
    throw new Error('Input should have at least one root file');
  }

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
 * @param {array} input The bundle process input
 * @param {object} wsdlParser The wsdlParser related with the version to use
 * @param {object} xmlParser The xml parser to use
 * @param {object} options contains options to modify validation
 * @param {Array} origin - process origin (BROWSER or node)
 *
 * @returns {object} The bundled data output
 */
function getBundledFiles(input, wsdlParser, xmlParser, options,
  origin) {
  const merger = new WSDLMerger(),
    inputData = input.data,
    inputRootFiles = input.rootFiles,
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
      wsdlParser,
      inputRootFiles
    );

  let mergedFiles = merger.processBundleFiles(
      parsedData,
      wsdlParser,
      xmlParser,
      options,
      origin
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
