const {
  getPrincipalPrefix,
  wsdlHasImports,
  getNodeByName,
  canGetPrincipalPrefix
} = require('./WsdlParserCommon');

/**
 * Generate the root files output in the expected format
 * @param {object} output - output schema
 * @param {string} version - current version we are working with
 * @returns {object} - the root files output
 */
function getRootFilesOutput(output, version) {
  if (!version) {
    version = '1.1';
  }
  let adaptedData = output.map((file) => {
    return { path: file.path };
  });
  return {
    result: true,
    output: {
      type: 'rootFiles',
      specification: {
        type: 'WSDL',
        version: version
      },
      data: adaptedData
    }
  };
}

/**
   * Get the root files using the provided WSDLParser
   * @param {array} inputData The input data array
   * @param {object} wsdlParser The wsdlParser object related to the spec version
   * @param {object} xmlParser The xmlParser
   * @returns {object} The rootFiles in the input data array
   */
function getRootFilesService(inputData, wsdlParser, xmlParser) {
  const rootFiles = inputData.filter((fileData) => {
    let parsedXml = xmlParser.safeParseToObject(fileData.content),
      wsdlRoot = wsdlParser.informationService.RootTagName,
      principalPrefix,
      hasImports,
      hasServices;
    if (!canGetPrincipalPrefix(parsedXml, wsdlRoot)) {
      return false;
    }
    principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot);
    hasImports = wsdlHasImports(parsedXml, principalPrefix, wsdlRoot);
    hasServices = getNodeByName(parsedXml[principalPrefix + wsdlRoot], principalPrefix,
      wsdlParser.informationService.ConcreteServiceTag);

    if (hasImports && hasServices) {
      return true;
    }
  });

  return rootFiles;
}

/**
 * Returns the rootFiles formatted to be used in the API
 * @param {array} inputData The input data with parsed contents.
 * @param {object} wsdlParser The wsdlParser related with the version to use.
 * @param {object} xmlParser The xmlParser tp use
 * @returns {object} The formatted output for detectRootFiles
 */
function getRootFilesApiOutput(inputData, wsdlParser, xmlParser) {
  const rootFiles = getRootFilesService(inputData, wsdlParser, xmlParser);

  return getRootFilesOutput(
    rootFiles,
    wsdlParser.informationService.version
  );
}
module.exports = {
  getRootFilesService,
  getRootFilesApiOutput
};
