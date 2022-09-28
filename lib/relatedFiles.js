/* eslint-disable no-restricted-modules */
const BROWSER = 'browser',
  { DFS } = require('./utils/dfs'),
  {
    getWSDLImportsAndIncludes,
    getPrincipalPrefix,
    getAttributeByNamePlaceHolder,
    ATTRIBUTE_SCHEMALOCATION
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
   * @returns {boolean} - wheter is the same path
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
    return comparePaths(node.fileName, referencePath);
  });
}

/**
   * verifies if the path has been added to the result
   * @param {string} path - path to find
   * @param {Array} referencesInNode - Array with the already added paths
   * @returns {boolean} - wheter a node with the same path has been added
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
  return parserFactory.getParser(content);
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
    let schemaLocation = getAttributeByNamePlaceHolder(importInformation,
      ATTRIBUTE_SCHEMALOCATION, attributePlaceHolder);
    if (!added(schemaLocation, referencesInNode)) {
      referencesInNode.push({ path: schemaLocation });
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
      adjacentNode = findNodeFromPath(calculatePath(currentNode.fileName, referencePath), allData);
    if (adjacentNode) {
      graphAdj.push(adjacentNode);
    }
    else if (!comparePaths(referencePath, specRoot.fileName)) {
      let calculatedPathForMissing = calculatePathMissing(currentNode.fileName, referencePath);
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
   * Maps the output from get root files to detect root files
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
    WSDLObject = xmlParser.parseToObject(currentContent);
  }

  wsdlParser = getWSDLParser(currentContent);
  wsdlRootTagName = wsdlParser.informationService.RootTagName;
  const principalPrefix = getPrincipalPrefix(WSDLObject, wsdlRootTagName);
  currentNodeReferences = getReferences(WSDLObject, principalPrefix, wsdlRootTagName, xmlParser.attributePlaceHolder);

  return calculateAdjAndMissing(currentNodeReferences, currentNode, allData, graphAdj, specRoot, missingNodes);
}

module.exports = {

  /**
   * Gets the related files to the wsdlRoot
   * @param {object} wsdlRoot - root file information
   * @param {Array} allData -  array of { path, content } objects
   * @param {Array} origin - process origin (BROWSER or node)
   * @param {object} xmlParser xml parser
   * @returns {object} - Get related files result object
   */
  getRelatedFiles: function (wsdlRoot, allData, origin, xmlParser) {
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
          path: relatedFile.fileName
        };
      });
    return { relatedFiles: outputRelatedFiles, missingRelatedFiles: missing };
  },
  getReferences,
  getAdjacentAndMissing,
  calculatePath,
  calculatePathMissing
};


