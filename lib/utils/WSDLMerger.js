const CODIFICATION = 'utf8',
  path = require('path-browserify'),
  {
    getNodeByName
  } = require('../WsdlParserCommon'),
  {
    getArrayFrom
  } = require('./objectUtils'),
  IMPORT_TAG = 'import',
  SERVICE_TAG = 'service',
  SCHEMA_TAG = 'schema';


class WSDLMerger {

  /**
   * Gets the root of the files list
   * @param {object} xmlParsedArray the array of parsed xmls
   * @returns {object} the root
   */
  getRoot(xmlParsedArray) {
    let root = xmlParsedArray.find((xmlParsed) => {
      let hasImports = xmlParsed['definitions'][IMPORT_TAG],
        hasServices = xmlParsed['definitions'][SERVICE_TAG];
      if (hasImports && hasServices) {
        return true;
      }
    });
    return root;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} parsedXMLs the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} targetNamespace the target namespace to find
   * @returns {object} the root
   */
  getParsedByTargetNamespace(
    parsedXMLs,
    parsedSchemas,
    targetNamespace
  ) {
    let filterParentProperty = '',
      targetNamespaceFound,
      allEllements = parsedXMLs.concat(parsedSchemas),
      found = allEllements.find((parsedXML) => {
        if (parsedXML['definitions']) {
          filterParentProperty = 'definitions';
        }
        else if (parsedXML[SCHEMA_TAG]) {
          filterParentProperty = SCHEMA_TAG;
        }
        targetNamespaceFound =
          parsedXML[filterParentProperty]['@_targetNamespace'];
        if (targetNamespaceFound === targetNamespace) {
          return true;
        }
      });
    return found;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} root the array of parsed xmls
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @returns {object} the root
   */
  resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas) {
    let imports = getArrayFrom(root['definitions'][IMPORT_TAG]);
    imports.forEach((importInformation) => {
      let importedFound = this.getParsedByTargetNamespace(
        parsedWSDL,
        parsedSchemas,
        importInformation['@_namespace']
      );
      if (importedFound) {
        this.assignImportedProperties(root, importedFound, parsedWSDL, parsedSchemas);
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
  assignImportedPropertiesDefinitions(
    root,
    importedTag,
    parsedWSDL,
    parsedSchemas
  ) {
    let definitionsProperty = importedTag['definitions'],
      hasImports = getArrayFrom(importedTag['definitions'][IMPORT_TAG]);
    if (hasImports && hasImports.length > 0) {
      this.resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas);
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
  assignImportedPropertiesSchema(
    root,
    importedTag,
    parsedWSDL,
    parsedSchemas
  ) {
    let schemaProperty = importedTag[SCHEMA_TAG],
      existingSchemas = getArrayFrom(
        getNodeByName(root['definitions'], '', SCHEMA_TAG)
      );
    if (!existingSchemas || existingSchemas.length === 0) {
      root['definitions'][SCHEMA_TAG] = [];
    }
    root['definitions'][SCHEMA_TAG].push(importedTag);

    Object.keys(schemaProperty).forEach((importedProperty) => {
      if (importedProperty === IMPORT_TAG) {
        this.resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas);
      }
    });
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} root the parsed root file
   * @param {object} importedTag the imported tag object
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @returns {object} the root
   */
  assignImportedProperties(
    root,
    importedTag,
    parsedWSDL,
    parsedSchemas
  ) {
    let definitionsProperty = importedTag['definitions'];
    if (definitionsProperty) {
      this.assignImportedPropertiesDefinitions(
        root,
        importedTag,
        parsedWSDL,
        parsedSchemas
      );
    }
    else {
      let schemaProperties = importedTag[SCHEMA_TAG];
      if (schemaProperties) {
        this.assignImportedPropertiesSchema(
          root,
          importedTag,
          parsedWSDL,
          parsedSchemas
        );
      }
    }
  }

  /**
   * Merge different files to a single WSDL
   * @param {object} filesPathArray the files
   * @param {object} files the content files
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {string} the single file
   */
  merge(filesPathArray, files, xmlParser) {
    let parsedSchemas,
      root,
      parsedWSDL,
      parsedXML = filesPathArray.map((filePath) => {
        let file;
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
        return key.includes(SCHEMA_TAG);
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

    root = this.getRoot(parsedWSDL);
    this.resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas);
    return xmlParser.parseObjectToXML(root);
  }
}


module.exports = {
  WSDLMerger
};
