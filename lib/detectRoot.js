const { getPrincipalPrefix, wsdlHasImports, getNodeByName } = require('./WsdlParserCommon');

/**
 * Maps the output from get root files to detect root files
 * @param {object} output - output schema
 * @param {string} version - specified version of the process
 * @returns {object} - Detect root files result object
 */
function mapGetRootFilesOutputToDetectRootFilesOutput(output, version) {
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

    return mapGetRootFilesOutputToDetectRootFilesOutput(
      rootFiles,
      wsdlParser.informationService.version
    );
  }
};
