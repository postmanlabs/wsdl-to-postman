const CODIFICATION = 'utf8',
  path = require('path-browserify'),
  {
    getNodeByName
  } = require('../WsdlParserCommon'),
  {
    ParserFactory,
    V11,
    V20
  } = require('../ParserFactory'),
  {
    getArrayFrom
  } = require('./objectUtils'),
  IMPORT_TAG = 'import',
  SERVICE_TAG = 'service',
  SCHEMA_TAG = 'schema',
  WsdlError = require('../WsdlError');


class WSDLMerger {

  /**
   * Gets the root of the files list
   * @param {object} xmlParsedArray the array of parsed xmls
   * @returns {object} the root
   */
  getRoot(xmlParsedArray, wsdlRoot) {
    let root = xmlParsedArray.find((xmlParsed) => {
      let hasImports = xmlParsed[wsdlRoot][IMPORT_TAG],
        hasServices = xmlParsed[wsdlRoot][SERVICE_TAG];
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
    targetNamespace,
    wsdlRoot
  ) {
    let filterParentProperty = '',
      targetNamespaceFound,
      allEllements = parsedXMLs.concat(parsedSchemas),
      found = allEllements.find((parsedXML) => {
        if (parsedXML[wsdlRoot]) {
          filterParentProperty = wsdlRoot;
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
  resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas, wsdlRoot) {
    let imports = getArrayFrom(root[wsdlRoot][IMPORT_TAG]);
    imports.forEach((importInformation) => {
      let importedFound = this.getParsedByTargetNamespace(
        parsedWSDL,
        parsedSchemas,
        importInformation['@_namespace'],
        wsdlRoot
      );
      if (importedFound) {
        this.assignImportedProperties(root, importedFound, parsedWSDL, parsedSchemas, wsdlRoot);
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
    parsedSchemas,
    wsdlRoot
  ) {
    let definitionsProperty = importedTag[wsdlRoot],
      hasImports = getArrayFrom(importedTag[wsdlRoot][IMPORT_TAG]);
    if (hasImports && hasImports.length > 0) {
      this.resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas, wsdlRoot);
    }
    Object.keys(definitionsProperty).forEach((importedProperty) => {
      if (!root[wsdlRoot][importedProperty]) {
        root[wsdlRoot][importedProperty] =
          importedTag[wsdlRoot][importedProperty];
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
    parsedSchemas,
    wsdlRoot
  ) {
    let schemaProperty = importedTag[SCHEMA_TAG],
      existingTypes = getArrayFrom(
        getNodeByName(root[wsdlRoot], '', 'types')
      );

    if (!existingTypes || existingTypes.length === 0) {
      root[wsdlRoot]['types'] = [];
      root[wsdlRoot]['types'].push(importedTag);
    }

    else {
      existingTypes[0] = [];
      root[wsdlRoot]['types'].push(importedTag);
    }

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
    parsedSchemas,
    wsdlRoot
  ) {
    let definitionsProperty = importedTag[wsdlRoot];
    if (definitionsProperty) {
      this.assignImportedPropertiesDefinitions(
        root,
        importedTag,
        parsedWSDL,
        parsedSchemas,
        wsdlRoot
      );
    }
    else {
      let schemaProperties = importedTag[SCHEMA_TAG];
      if (schemaProperties) {
        this.assignImportedPropertiesSchema(
          root,
          importedTag,
          parsedWSDL,
          parsedSchemas,
          wsdlRoot
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
      wsdlVersion,
      contentFiles = [],
      wsdlRoot = '',

      parsedXML = filesPathArray.map((filePath) => {
        let file;
        if (files) {
          file = files[path.resolve(filePath.fileName)];
        }
        else {
          file = fs.readFileSync(filePath.fileName, CODIFICATION);
        }
        contentFiles.push(file);
        return xmlParser.parseToObject(file);
      });

    wsdlVersion = this.getFilesVersion(contentFiles);
    wsdlRoot = wsdlVersion === V11 ? 'definitions' : 'description';

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
        return key.includes(wsdlRoot);
      });
      if (schemas && schemas.length > 0) {
        return parsed;
      }
    });

    root = this.getRoot(parsedWSDL, wsdlRoot);
    this.resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas, wsdlRoot);
    return xmlParser.parseObjectToXML(root);
  }

  getFilesVersion(filesContents) {
    let parserFactory = new ParserFactory();

    let versions = filesContents.map((fileContent) => {
      return parserFactory.getSafeWsdlVersion(fileContent);
    });

    if (versions) {
      if (versions.every((val, i, arr) => val === undefined)) {
        throw new WsdlError('There was not WSDL in folder');
      }
      let filtered = versions.filter(function (x) {
        return x !== undefined;
      });
      if (!filtered.every((val, i, arr) => val === arr[0])) {
        throw new WsdlError('There was not WSDL in folder');
      }
      return filtered[0];
    }
    throw new WsdlError('There was not WSDL in folder');
  }
}


module.exports = {
  WSDLMerger
};
