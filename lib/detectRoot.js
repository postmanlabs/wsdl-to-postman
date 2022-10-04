const { getPrincipalPrefix, wsdlHasImports, getNodeByName } = require('./WsdlParserCommon');

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

module.exports = {
  /**
   * Get the root files using the provided WSDLParser
   * @param {array} inputData The input data array
   * @param {object} wsdlParser The wsdlPaser object related to the spec version
   * @param {object} xmlParser The xmlParser
   * @returns {object} The generated output with version and rootFiles
   */
  getRootFiles: (inputData, wsdlParser, xmlParser) => {
    const rootFiles = inputData.filter((fileData) => {
      try {
        let parsedXml = xmlParser.parseToObject(fileData.content),
          wsdlRoot = wsdlParser.informationService.RootTagName,
          principalPrefix = getPrincipalPrefix(parsedXml, wsdlRoot),
          hasImports = wsdlHasImports(parsedXml, principalPrefix, wsdlRoot),
          hasServices = getNodeByName(parsedXml[principalPrefix + wsdlRoot], principalPrefix,
            wsdlParser.informationService.ConcreteServiceTag);

        if (hasImports && hasServices) {
          return true;
        }
        return false;
      }
      catch {
        return false;
      }
    });

    return getRootFilesOutput(
      rootFiles,
      wsdlParser.informationService.version
    );
  }
};
