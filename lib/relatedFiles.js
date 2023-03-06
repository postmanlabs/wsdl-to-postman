/* eslint-disable no-restricted-modules */
const BROWSER = 'browser',
  { DFS } = require('./utils/dfs'),
  {
    getWSDLImportsAndIncludes,
    getPrincipalPrefix,
    getSchemaLocationOrLocation,
    SCHEMA_TAG,
    canGetPrincipalPrefix
  } = require('./WsdlParserCommon'),
  {
    WSDLParserFactory
  } = require('./WSDLParserFactory');
let path = require('path'),
  pathBrowserify = require('path-browserify');

/**
   * Locates a referenced node from the data input by path
   * @param {string} path1 - path1 to compare
   * @param {string} path2 - path2 to compare
   * @returns {boolean} - Whether is the same path
   */
function comparePaths(path1, path2) {
  return path1 === path2;
}

/**
   * Calculates the path relative to parent
   * @param {string} parentFileName - parent file name of the current node
   * @param {string} referencePath - value of the reference property
   * @returns {object} - Detect root files result object
   */
function calculatePath(parentFileName, referencePath) {
  if (path.isAbsolute(referencePath)) {
    return referencePath;
  }
  let currentDirName = path.dirname(parentFileName),
    refDirName = path.join(currentDirName, referencePath);
  return refDirName;
}

/**
   * Calculates the path relative to parent
   * @param {string} parentFileName - parent file name of the current node
   * @param {string} referencePath - value of the reference property
   * @returns {object} - Detect root files result object
   */
function calculatePathMissing(parentFileName, referencePath) {
  let currentDirName = path.dirname(parentFileName),
    refDirName = path.join(currentDirName, referencePath);
  if (refDirName.startsWith('..' + path.sep)) {
    return { path: undefined, schemaLocation: referencePath };
  }
  else if (path.isAbsolute(parentFileName) && !path.isAbsolute(referencePath)) {
    let relativeToRoot = path.join(currentDirName.replace(path.sep, ''), referencePath);
    if (relativeToRoot.startsWith('..' + path.sep)) {
      return { path: undefined, schemaLocation: referencePath };
    }
  }
  return { path: refDirName, schemaLocation: undefined };
}

/**
   * Locates a referenced node from the data input by path
   * @param {string} referencePath - value from the reference property
   * @param {Array} allData -  array of { path, content} objects
   * @returns {object} - Detect root files result object
   */
function findNodeFromPath(referencePath, allData) {
  return allData.find((node) => {
    return comparePaths(node.path, referencePath);
  });
}

/**
   * verifies if the path has been added to the result
   * @param {string} path - path to find
   * @param {Array} referencesInNode - Array with the already added paths
   * @returns {boolean} - whether a node with the same path has been added
   */
function added(path, referencesInNode) {
  return referencesInNode.find((reference) => { return reference.path === path; }) !== undefined;
}

/**
 * Gets the wsdl parser according to the version found in the content
 * @param {string} content xml content
 * @returns {object} the WSDL Parser
 */
function getWSDLParser(content) {
  let parserFactory = new WSDLParserFactory();
  return parserFactory.getParserSafe(content);
}

/**
   * Gets all the references from an object
   * @param {object} currentNode - current node in process
   * @param {object} principalPrefix the principal prefix of root file
   * @param {string} wsdlRootTagName the root tag for the document definitions for 1.1
   * description for 2.0
   * @param {string} attributePlaceHolder the character used for the parser to locate attributes
   * @returns {Array} - [{path : reference value}]
   */
function getReferences(currentNode, principalPrefix, wsdlRootTagName, attributePlaceHolder) {
  let referencesInNode = [],
    imports = getWSDLImportsAndIncludes(currentNode, principalPrefix, wsdlRootTagName);
  imports.forEach((importInformation) => {
    let schemaLocation = getSchemaLocationOrLocation(importInformation, attributePlaceHolder);
    if (schemaLocation) {
      if (!added(schemaLocation, referencesInNode)) {
        referencesInNode.push({ path: schemaLocation });
      }
    }
  });
  return referencesInNode;
}

/**
   * Takes in all the references from a node and calculates the missing and adjacent
   * @param {Array} currentNodeReferences - current { path, content} object
   * @param {object} currentNode - current { path, content} object
   * @param {Array} allData -  array of { path, content} objects
   * @param {object} specRoot - root file information
   * @param {object} xmlParser xml parser
   * @returns {object} - Detect root files result object
   */
function calculateAdjAndMissing(currentNodeReferences, currentNode, allData, specRoot) {
  let graphAdj = [],
    missingNodes = [];
  currentNodeReferences.forEach((reference) => {
    let referencePath = reference.path,
      adjacentNode = findNodeFromPath(calculatePath(currentNode.path, referencePath), allData);
    if (adjacentNode) {
      graphAdj.push(adjacentNode);
    }
    else if (!comparePaths(referencePath, specRoot.path)) {
      let calculatedPathForMissing = calculatePathMissing(currentNode.path, referencePath);
      if (!calculatedPathForMissing.schemaLocation) {
        missingNodes.push({ path: calculatedPathForMissing.path });
      }
      else {
        missingNodes.push({ schemaLocation: calculatedPathForMissing.schemaLocation, path: null });
      }
    }
  });
  return { graphAdj, missingNodes };
}

/**
   * Gets the adjacent nodes and missing nodes from the received node
   * @param {object} currentNode - current { path, content} object
   * @param {Array} allData -  array of { path, content} objects
   * @param {object} specRoot - root file information
   * @param {object} xmlParser xml parser
   * @returns {object} - Detect root files result object
   */
function getAdjacentAndMissing (currentNode, allData, specRoot, xmlParser) {
  let currentNodeReferences,
    currentContent = currentNode.content,
    graphAdj = [],
    missingNodes = [],
    WSDLObject,
    wsdlParser,
    wsdlRootTagName;
  if (currentNode.parsed) {
    WSDLObject = currentNode.parsed;
  }
  else {
    WSDLObject = xmlParser.safeParseToObject(currentContent);
  }
  if (!WSDLObject) {
    return { graphAdj, missingNodes };
  }

  wsdlParser = getWSDLParser(currentContent);
  if (wsdlParser) {
    wsdlRootTagName = wsdlParser.informationService.RootTagName;
  }
  else {
    wsdlRootTagName = SCHEMA_TAG;
  }
  if (!canGetPrincipalPrefix(WSDLObject, wsdlRootTagName)) {
    return { graphAdj, missingNodes };
  }
  const principalPrefix = getPrincipalPrefix(WSDLObject, wsdlRootTagName);
  currentNodeReferences = getReferences(WSDLObject, principalPrefix, wsdlRootTagName, xmlParser.attributePlaceHolder);

  return calculateAdjAndMissing(currentNodeReferences, currentNode, allData, graphAdj, specRoot, missingNodes);
}

/**
   * Gets the related files to the wsdlRoot
   * @param {object} wsdlRoot - root file information
   * @param {Array} allData -  array of { path, content } objects
   * @param {object} xmlParser xml parser
   * @param {Array} origin - process origin (BROWSER or node)
   * @returns {object} - Get related files result object
   */
function getRelatedFiles(wsdlRoot, allData, xmlParser, origin) {
  if (origin === BROWSER) {
    path = pathBrowserify;
  }
  let algorithm = new DFS(),
    { traverseOrder, missing } =
      algorithm.traverse(wsdlRoot, (currentNode) => {
        return getAdjacentAndMissing(currentNode, allData, wsdlRoot, xmlParser);
      }),
    outputRelatedFiles = traverseOrder.slice(1).map((relatedFile) => {
      return {
        path: relatedFile.path
      };
    });
  return { relatedFiles: outputRelatedFiles, missingRelatedFiles: missing };
}

/**
   * @description Takes in root files, input data and origin process every root
   * to find related files
   * @param {object} rootFiles - rootFile:{path:string}
   * @param {array} inputData - [{path:string}]}
   * @param {string} origin -  process origin
   * @param {object} xmlParser xml parser
   *
   * @returns {object} root files information and data input
   */
function mapProcessRelatedFiles(rootFiles, inputData, origin, xmlParser) {
  const data = rootFiles.map((root) => {
    let relatedData = getRelatedFiles(root, inputData, xmlParser, origin),
      result = {
        rootFile: { path: root.path },
        relatedFiles: relatedData.relatedFiles,
        missingRelatedFiles: relatedData.missingRelatedFiles
      };
    return result;
  });
  return data;
}

/**
   * Takes in the rootFiles array and filter them according to the
   * version
   * @param {string} version the wsdl version to filter
   * @param {array} rootFiles - root files from the process input
   * @returns {object} - Get related files result object
   */
function filterRootFilesByVersion(version, rootFiles) {
  return rootFiles.filter((root) => {
    let wsdlParser = getWSDLParser(root.content);
    if (wsdlParser && wsdlParser.informationService.version === version) {
      return true;
    }
    return false;
  });
}

/**
   * Validates process parameters
   * @param {object} inputRelatedFiles - root file information
   * @param {object} xmlParser xml parser
   * @returns {object} - Get related files result object
   */
function validRelatedFilesFromInputParams(inputRelatedFiles, xmlParser) {
  if (!inputRelatedFiles) {
    throw new Error('Input should not be undefined nor null');
  }
  if (!xmlParser) {
    throw new Error('XML parser should not be undefined nor null');
  }
}

/**
   * Gets the related files to the wsdlRoots in the input
   * @param {object} inputRelatedFiles - root file information
   * @param {object} xmlParser xml parser
   * @param {string} origin - process origin (BROWSER or node)
   * @returns {object} - Get related files result object
   */
function getRelatedFilesFromInput(inputRelatedFiles, xmlParser, origin) {
  validRelatedFilesFromInputParams(inputRelatedFiles, xmlParser);
  let version = inputRelatedFiles.specificationVersion ? inputRelatedFiles.specificationVersion : '1.1',
    res = {
      result: true,
      output: {
        type: 'relatedFiles',
        specification: {
          type: 'WSDL',
          version: version
        },
        data: [
        ]
      }
    };
  if (inputRelatedFiles.rootFiles && inputRelatedFiles.rootFiles.length > 0) {
    let filteredRootFiles = filterRootFilesByVersion(version, inputRelatedFiles.rootFiles);
    try {
      res.output.data = mapProcessRelatedFiles(filteredRootFiles, inputRelatedFiles.data,
        origin, xmlParser, version);
      if (res.output.data === undefined || res.output.data.result === false ||
        res.output.data.length === 0) {
        res.result = false;
      }
    }
    catch (error) {
      let newError = new Error('There was an error during the process');
      newError.stack = error.stack;
      throw (newError);
    }
    return res;
  }
  throw new Error('Input should have at least one root file');
}

module.exports = {
  getRelatedFiles,
  getReferences,
  getAdjacentAndMissing,
  calculatePath,
  calculatePathMissing,
  getRelatedFilesFromInput,
  filterRootFilesByVersion
};


