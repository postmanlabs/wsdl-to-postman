const CODIFICATION = 'utf8',
  path = require('path-browserify'),
  {
    getNodeByName
  } = require('../WsdlParserCommon'),
  {
    getArrayFrom
  } = require('./objectUtils');

/**
 * Gets the root of the files list
 * @param {object} xmlParsedArray the array of parsed xmls
 * @returns {object} the root
 */
function getRoot(xmlParsedArray) {
  let root = xmlParsedArray.find((xmlParsed) => {
    let hasImports = xmlParsed['definitions']['import'],
      hasServices = xmlParsed['definitions']['service'];
    if (hasImports && hasServices) {
      return true;
    }
  });
  return root;
}

/**
 * Merge different files to a single WSDL
 * @param {object} filesPathArray the files
 * @param {object} files the content files
 * @param {object} xmlParser the parser class to parse xml to object or vice versa
 * @returns {string} the single file
 */
function merge(filesPathArray, files, xmlParser) {
  let parsedSchemas,
    root,
    parsedWSDL,
    parsedXML = filesPathArray.map((filePath) => {
      if (files) {
        file = files[path.resolve(filePath.fileName)];
      }
      else {
        file = fs.readFileSync(filePath.fileName, CODIFICATION);
      }
      return xmlParser.parseToObject(file);
    });

  parsedSchemas = parsedXML.filter((parsed) => {
    let schemas = Object.keys(parsed).filter((key) => {
      return key.includes('schema');
    });
    if (schemas && schemas.length > 0) {
      return parsed;
    }
  });

  parsedWSDL = parsedXML.filter((parsed) => {
    let schemas = Object.keys(parsed).filter((key) => {
      return key.includes('definitions');
    });
    if (schemas && schemas.length > 0) {
      return parsed;
    }
  });

  root = getRoot(parsedWSDL);
  resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas);
  let result = xmlParser.parseObjectToXML(root);
  return result;
}

/**
 * Gets the import information and assign it to the root
 * @param {object} root the array of parsed xmls
 * @param {object} parsedWSDL the array of parsed xmls
 * @param {object} parsedSchemas the array of parsed xmls
 * @returns {object} the root
 */
function resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas) {
  let imports = getArrayFrom(root['definitions']['import']);
  imports.forEach((importInformation) => {
    let importedFound = getParsedByTargetNamespace(
      parsedWSDL,
      parsedSchemas,
      importInformation['@_namespace']
    );
    if (importedFound) {
      assignImportedProperties(root, importedFound, parsedWSDL, parsedSchemas);
    }
  });
  return root;
}

/**
 * Gets the import information and assign it to the root
 * @param {object} root the parsed root file
 * @param {object} importedTag the imported tag object
 * @param {object} parsedWSDL the array of parsed xmls
 * @param {object} parsedSchemas the array of parsed xmls
 * @returns {object} the root
 */
function assignImportedProperties(
  root,
  importedTag,
  parsedWSDL,
  parsedSchemas
) {
  let definitionsProperty = importedTag['definitions'];
  if (definitionsProperty) {
    assignImportedPropertiesDefinitions(
      root,
      importedTag,
      parsedWSDL,
      parsedSchemas
    );
  }
  else {
    let schemaProperties = importedTag['schema'];
    if (schemaProperties) {
      assignImportedPropertiesSchema(
        root,
        importedTag,
        parsedWSDL,
        parsedSchemas
      );
    }
  }
}

/**
 * Gets the import information and assign it to the root
 * @param {object} root the parsed root file
 * @param {object} importedTag the imported tag object
 * @param {object} parsedWSDL the array of parsed xmls
 * @param {object} parsedSchemas the array of parsed xmls
 * @returns {object} the root
 */
function assignImportedPropertiesDefinitions(
  root,
  importedTag,
  parsedWSDL,
  parsedSchemas
) {
  let definitionsProperty = importedTag['definitions'];
  let hasImports = getArrayFrom(importedTag['definitions']['import']);
  if (hasImports && hasImports.length > 0) {
    resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas);
  }
  Object.keys(definitionsProperty).forEach((importedProperty) => {
    if (!root['definitions'][importedProperty]) {
      root['definitions'][importedProperty] =
        importedTag.definitions[importedProperty];
    }
  });
}

/**
 * Gets the import information and assign it to the root
 * @param {object} root the root file parsed
 * @param {object} importedTag the imported tag object
 * @param {object} parsedWSDL the array of parsed xmls
 * @param {object} parsedSchemas the array of parsed xmls
 * @returns {object} undefined
 */
function assignImportedPropertiesSchema(
  root,
  importedTag,
  parsedWSDL,
  parsedSchemas
) {
  let schemaProperty = importedTag['schema'],
    existingSchemas = getArrayFrom(
      getNodeByName(root['definitions'], '', 'schema')
    );
  if (!existingSchemas || existingSchemas.length === 0) {
    root['definitions']['schema'] = [];
  }
  root['definitions']['schema'].push(importedTag);

  Object.keys(schemaProperty).forEach((importedProperty) => {
    if (importedProperty === 'import') {
      resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas);
    }
  });
}

/**
 * Gets the import information and assign it to the root
 * @param {object} parsedXMLs the array of parsed xmls
 * @param {object} parsedSchemas the array of parsed xmls
 * @param {string} targetNamespace the target namespace to find
 * @returns {object} the root
 */
function getParsedByTargetNamespace(
  parsedXMLs,
  parsedSchemas,
  targetNamespace
) {
  let allEllements = parsedXMLs.concat(parsedSchemas);
  let found = allEllements.find((parsedXML) => {
    let filterParentProperty = '';
    if (parsedXML['definitions']) {
      filterParentProperty = 'definitions';
    }
    else if (parsedXML['schema']) {
      filterParentProperty = 'schema';
    }
    let targetNamespaceFound =
      parsedXML[filterParentProperty]['@_targetNamespace'];
    if (targetNamespaceFound === targetNamespace) {
      return true;
    }
  });
  return found;
}



module.exports = {
  merge,
};
