/* eslint-disable no-restricted-modules */
const {
    getQNameLocal,
    XML_NAMESPACE_SEPARATOR
  } = require('./XMLParsedUtils'),
  CODIFICATION = 'utf8',
  {
    getNodeByName,
    getPrincipalPrefix,
    getWSDLImports,
    wsdlHasImports,
    getAttributeByName,
    getNodeByQNameLocal,
    XML_NAMESPACE_DECLARATION,
    SERVICE_TAG,
    IMPORT_TAG,
    SCHEMA_TAG,
    ATTRIBUTE_TYPES,
    TARGET_NAMESPACE_SPEC,
    ATTRIBUTE_NAMESPACE,
    SCHEMA_NS_URL
  } = require('../WsdlParserCommon'),
  {
    ParserFactory,
    V11
  } = require('../ParserFactory'),
  {
    getArrayFrom
  } = require('./objectUtils'),
  WsdlError = require('../WsdlError'),
  {
    MULTIPLE_ROOT_FILES,
    NOT_WSDL_IN_FOLDER,
    WSDL_DIFF_VERSION,
    MISSING_XML_PARSER
  } = require('../constants/messageConstants');

var path = require('path'),
  fs = require('fs'),
  fsBrowserify = require('browserify-fs'),
  pathBrowserify = require('path-browserify');

class WSDLMerger {

  /**
   * Gets the root of the files list
   * @param {object} xmlParsedArray the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @returns {object} the root
   */
  getRoot(xmlParsedArray, wsdlRoot) {
    let root = xmlParsedArray.filter((xmlParsed) => {
      let principalPrefix = getPrincipalPrefix(xmlParsed, wsdlRoot),
        hasImports = wsdlHasImports(xmlParsed, principalPrefix, wsdlRoot),
        hasServices = getNodeByName(xmlParsed[principalPrefix + wsdlRoot], principalPrefix, SERVICE_TAG);
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
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} principalPrefix the wsdl principal prefix
   * @returns {object} the root
   */
  getParsedWSDLOrSchemaByTargetNamespace(parsedXMLs, parsedSchemas, targetNamespace, wsdlRoot, principalPrefix) {
    let filterParentProperty = '',
      targetNamespaceFound,
      allEllements = parsedXMLs.concat(parsedSchemas),
      found = allEllements.find((parsedXML) => {
        if (parsedXML[principalPrefix + wsdlRoot]) {
          filterParentProperty = principalPrefix + wsdlRoot;
        }
        else if (parsedXML[SCHEMA_TAG]) {
          filterParentProperty = SCHEMA_TAG;
        }
        targetNamespaceFound = getAttributeByName(parsedXML[filterParentProperty], TARGET_NAMESPACE_SPEC);
        if (targetNamespaceFound === targetNamespace) {
          return true;
        }
      });
    return found;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} WSDLRootFile the array of parsed xmls
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} attributePlaceHolder the character for attributes according the xml parser
   * @returns {object} the root
   */
  resolveImportsFromRootFile(WSDLRootFile, parsedWSDL, parsedSchemas, wsdlRoot, attributePlaceHolder) {
    let principalPrefix = getPrincipalPrefix(WSDLRootFile, wsdlRoot),
      imports = getWSDLImports(WSDLRootFile, principalPrefix, wsdlRoot);
    imports.forEach((importInformation) => {
      let importedFound = this.getParsedWSDLOrSchemaByTargetNamespace(
        parsedWSDL,
        parsedSchemas,
        getAttributeByName(importInformation, ATTRIBUTE_NAMESPACE),
        wsdlRoot,
        principalPrefix
      );
      if (importedFound) {
        this.assignImportedProperties(WSDLRootFile, importedFound, parsedWSDL, parsedSchemas, wsdlRoot,
          principalPrefix, attributePlaceHolder);
      }
    });
    return WSDLRootFile;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} root the parsed root file
   * @param {object} importedTag the imported tag object
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} principalPrefix the wsdl principal prefix
   * @param {string} attributePlaceHolder the character for attributes according the xml parser
   * @returns {object} the root
   */
  assignImportedPropertiesDefinitions(
    root,
    importedTag,
    parsedWSDL,
    parsedSchemas,
    wsdlRoot,
    principalPrefix,
    attributePlaceHolder
  ) {
    let definitionsProperty = importedTag[wsdlRoot],
      hasImports = getArrayFrom(importedTag[wsdlRoot][IMPORT_TAG]);
    if (hasImports && hasImports.length > 0) {
      this.resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas, wsdlRoot, principalPrefix,
        attributePlaceHolder);
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
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} principalPrefix the wsdl principal prefix
   * @param {string} attributePlaceHolder the character for attributes according the xml parser
   * @returns {object} undefined
   */
  assignImportedPropertiesSchema(root, importedTag, parsedWSDL, parsedSchemas, wsdlRoot, principalPrefix,
    attributePlaceHolder) {
    let schemaProperty = importedTag[SCHEMA_TAG],
      existingTypes = getArrayFrom(
        getNodeByName(root[principalPrefix + wsdlRoot], principalPrefix, ATTRIBUTE_TYPES)
      );

    if (!existingTypes || existingTypes.length === 0) {
      root[principalPrefix + wsdlRoot][principalPrefix + ATTRIBUTE_TYPES] = [];
      root[principalPrefix + wsdlRoot][principalPrefix + ATTRIBUTE_TYPES].push(importedTag);
    }

    else {
      let schemasInType = getArrayFrom(getNodeByQNameLocal(existingTypes[0], SCHEMA_TAG));
      schemasInType.push(schemaProperty);

      schemasInType.forEach((schemaInType) => {
        let schemaPrefix = this.getSchemaPrefix(schemaInType, root, principalPrefix, wsdlRoot, attributePlaceHolder);

        if (Array.isArray(root[principalPrefix + wsdlRoot][principalPrefix + ATTRIBUTE_TYPES])) {
          root[principalPrefix + wsdlRoot][principalPrefix + ATTRIBUTE_TYPES][0][schemaPrefix + SCHEMA_TAG] =
            schemaInType;
        }
        else {
          root[principalPrefix + wsdlRoot][principalPrefix + ATTRIBUTE_TYPES][schemaPrefix + SCHEMA_TAG] =
            schemaInType;
        }
      });
    }

    Object.keys(schemaProperty).forEach((importedProperty) => {
      if (importedProperty === IMPORT_TAG) {
        this.resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas, principalPrefix, attributePlaceHolder);
      }
    });
  }

  /**
   * Gets the prefix of the schema
   * @param {object} schema the schema
   * @param {object} root the root file parsed
   * @param {string} principalPrefix the wsdl principal prefix
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} attributePlaceHolder the character for attributes according the xml parser
   * @returns {string} schema prefix filter
   */
  getSchemaPrefix(schema, root, principalPrefix, wsdlRoot, attributePlaceHolder) {
    let res,
      defs,
      namespaceKey = Object.keys(schema)
        .find((key) => {
          return schema[key] === SCHEMA_NS_URL;
        });
    if (namespaceKey) {
      let namespace = namespaceKey.replace(attributePlaceHolder, '');
      res = getQNameLocal(namespace);
      if (res === XML_NAMESPACE_DECLARATION) {
        res = '';
      }
    }
    defs = getNodeByName(root, principalPrefix, wsdlRoot);
    if (res === undefined) {
      let namespaceKey = Object.keys(defs)
        .find((key) => {
          return defs[key] === SCHEMA_NS_URL;
        });
      if (namespaceKey) {
        let namespace = namespaceKey.replace(attributePlaceHolder, '');
        res = getQNameLocal(namespace);
      }
    }
    return res !== '' ? res + XML_NAMESPACE_SEPARATOR : res;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} WSDLRootFile the parsed root file
   * @param {object} importedTag the imported tag object
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {object} principalPrefix the wsdl principal prefix
   * @param {string} attributePlaceHolder the character for attributes according the xml parser
   * @returns {object} the root
   */
  assignImportedProperties(WSDLRootFile, importedTag, parsedWSDL, parsedSchemas, wsdlRoot, principalPrefix,
    attributePlaceHolder) {
    let isWSDLDefinition = importedTag[wsdlRoot];
    if (isWSDLDefinition) {
      this.assignImportedPropertiesDefinitions(
        WSDLRootFile,
        importedTag,
        parsedWSDL,
        parsedSchemas,
        wsdlRoot,
        principalPrefix,
        attributePlaceHolder
      );
    }
    else {
      let schemaProperties = importedTag[SCHEMA_TAG];
      if (schemaProperties) {
        this.assignImportedPropertiesSchema(
          WSDLRootFile,
          importedTag,
          parsedWSDL,
          parsedSchemas,
          wsdlRoot,
          principalPrefix,
          attributePlaceHolder
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
  merge(input, xmlParser) {
    let contentFiles = [],
      filesPathArray = input.data,
      files = input.xmlFiles,
      origin = input.origin || '',
      promises = [];

    // use browserified version if the input origin is a browser
    if (origin === 'browser') {
      path = pathBrowserify;
    }

    if (files) {
      filesPathArray.forEach((filePath) => {
        contentFiles.push(files[path.resolve(filePath.fileName)]);
      });
      return new Promise((resolve, reject) => {
        try {
          let res = this.processMergeFiles(contentFiles, xmlParser);
          resolve(res);
        }
        catch (err) {
          reject(err);
        }
      });
    }

    filesPathArray.forEach((filePath) => {
      promises.push(this.readFileAsync(filePath.fileName, CODIFICATION, origin));
    });
    return Promise.all(promises).then((values) => {
      contentFiles = values;
      return this.processMergeFiles(contentFiles, xmlParser);
    });

  }

  /**
   * Merge different files to a single WSDL
   * @param {Array} contentFiles the content of the files in string
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @returns {string} the single file
   */
  processMergeFiles(contentFiles, xmlParser) {
    let parsedSchemas,
      root,
      rootFiles,
      parsedWSDL,
      wsdlVersion,
      parsedXML,
      wsdlRoot = '';
    if (!xmlParser) {
      throw new WsdlError(MISSING_XML_PARSER);
    }
    parsedXML = contentFiles.map((file) => {
      return xmlParser.parseToObject(file);
    });

    wsdlVersion = this.getFilesVersion(contentFiles);
    wsdlRoot = wsdlVersion === V11 ? 'definitions' : 'description';
    parsedSchemas = this.getParsedSchemasFromAllParsed(parsedXML);
    parsedWSDL = this.getParsedWSDLFromAllParsed(parsedXML, wsdlRoot);
    rootFiles = this.getRoot(parsedWSDL, wsdlRoot);
    if (rootFiles && rootFiles.length > 1) {
      throw new WsdlError(MULTIPLE_ROOT_FILES);
    }
    root = rootFiles[0];
    this.resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas, wsdlRoot, xmlParser.attributePlaceHolder);
    return xmlParser.parseObjectToXML(root);
  }

  /**
   * Gets the parsed objects that are WSDL definitions
   * from the provided list
   * @param {Array} parsedXML the files content parsed
   * @param {string} wsdlRoot the wsdl root according to the WSDL version
   * @returns {string} the version of wsdl
   */
  getParsedWSDLFromAllParsed(parsedXML, wsdlRoot) {
    return parsedXML.filter((parsed) => {
      let schemas = Object.keys(parsed).filter((key) => {
        return key.includes(wsdlRoot);
      });
      if (schemas && schemas.length > 0) {
        return parsed;
      }
    });
  }

  /**
   * Gets the parsed objects that are schema definitions
   * from the provided list
   * @param {Array} parsedXML the files content parsed
   * @returns {string} the version of wsdl
   */
  getParsedSchemasFromAllParsed(parsedXML) {
    return parsedXML.filter((parsed) => {
      let schemas = Object.keys(parsed).filter((key) => {
        return key.includes(SCHEMA_TAG);
      });
      if (schemas && schemas.length > 0) {
        return parsed;
      }
    });
  }

  /**
   * Gets the wsdl version of the files,
   * if the versions are different then throws an error
   * @param {Array} filesContents the files content in strings array
   * @returns {string} the version of wsdl
   */
  getFilesVersion(filesContents) {
    let parserFactory = new ParserFactory(),
      versions = filesContents.map((fileContent) => {
        return parserFactory.getSafeWsdlVersion(fileContent);
      });

    if (versions) {
      if (versions.every((val) => {
        return val === undefined;
      })) {
        throw new WsdlError(NOT_WSDL_IN_FOLDER);
      }
      let filtered = versions.filter(function (currentVersion) {
        return currentVersion !== undefined;
      });
      if (!filtered.every((currentVersion, i, arr) => {
        return currentVersion === arr[0];
      })) {
        throw new WsdlError(WSDL_DIFF_VERSION);
      }
      return filtered[0];
    }
  }

  /** Read File asynchronously
   *
   * @param {String} filePath Path of the file.
   * @param {String} encoding encoding
   * @param {String} origin origin of the input, e.g. browser
   * @return {String} Contents of the file
   */
  readFileAsync(filePath, encoding, origin) {
    if (origin === 'browser') {
      fs = fsBrowserify;
    }
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, encoding, (err, data) => {
        if (err) { reject(err); }
        else { resolve(data); }
      });
    });
  }
}


module.exports = {
  WSDLMerger
};
