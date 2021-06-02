const {
  getQNameLocal,
  XML_NAMESPACE_SEPARATOR
} = require('./XMLParsedUtils');

const CODIFICATION = 'utf8',
  path = require('path-browserify'),
  {
    getNodeByName,
    getPrincipalPrefix,
    getWSDLImports,
    wsdlHasImports,
    getNodeByQNameLocal,
    XML_NAMESPACE_DECLARATION
  } = require('../WsdlParserCommon'),
  {
    ParserFactory,
    V11
  } = require('../ParserFactory'),
  PARSER_ATTRIBUTE_NAME_PLACE_HOLDER = '@_',
  {
    getArrayFrom
  } = require('./objectUtils'),
  IMPORT_TAG = 'import',
  SERVICE_TAG = 'service',
  SCHEMA_TAG = 'schema',
  ATTRIBUTE_TYPES = 'types',
  ATTRIBUTE_TARGET_NAMESPACE = 'targetNamespace',
  ATTRIBUTE_NAMESPACE = 'namespace',

  WsdlError = require('../WsdlError'),
  SCHEMA_NS_URL = 'http://www.w3.org/2001/XMLSchema';


class WSDLMerger {

  /**
   * Gets the root of the files list
   * @param {object} xmlParsedArray the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @returns {object} the root
   */
  getRoot(xmlParsedArray, wsdlRoot) {
    let root = xmlParsedArray.find((xmlParsed) => {
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
  getParsedByTargetNamespace(
    parsedXMLs,
    parsedSchemas,
    targetNamespace,
    wsdlRoot,
    principalPrefix
  ) {
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
        targetNamespaceFound =
          parsedXML[filterParentProperty][PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_TARGET_NAMESPACE];
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
   * @param {string} wsdlRoot the wsdl root according to the version
   * @returns {object} the root
   */
  resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas, wsdlRoot) {
    let principalPrefix = getPrincipalPrefix(root, wsdlRoot),
      imports = getWSDLImports(root, principalPrefix, wsdlRoot);
    imports.forEach((importInformation) => {
      let importedFound = this.getParsedByTargetNamespace(
        parsedWSDL,
        parsedSchemas,
        importInformation[PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_NAMESPACE],
        wsdlRoot,
        principalPrefix
      );
      if (importedFound) {
        this.assignImportedProperties(root, importedFound, parsedWSDL, parsedSchemas, wsdlRoot,
          principalPrefix);
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
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} principalPrefix the wsdl principal prefix
   * @returns {object} the root
   */
  assignImportedPropertiesDefinitions(
    root,
    importedTag,
    parsedWSDL,
    parsedSchemas,
    wsdlRoot,
    principalPrefix
  ) {
    let definitionsProperty = importedTag[wsdlRoot],
      hasImports = getArrayFrom(importedTag[wsdlRoot][IMPORT_TAG]);
    if (hasImports && hasImports.length > 0) {
      this.resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas, wsdlRoot, principalPrefix);
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
   * @returns {object} undefined
   */
  assignImportedPropertiesSchema(
    root,
    importedTag,
    parsedWSDL,
    parsedSchemas,
    wsdlRoot,
    principalPrefix
  ) {
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
        let schemaPrefix = this.getSchemaPrefix(schemaInType, root, principalPrefix, wsdlRoot);

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
        this.resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas, principalPrefix);
      }
    });
  }

  getSchemaPrefix(schema, root, principalPrefix, wsdlRoot) {
    let res,
      defs,
      namespaceKey = Object.keys(schema)
        .find((key) => {
          return schema[key] === SCHEMA_NS_URL;
        });
    if (namespaceKey) {
      let namespace = namespaceKey.replace(PARSER_ATTRIBUTE_NAME_PLACE_HOLDER, '');
      res = getQNameLocal(namespace);
      if (res === XML_NAMESPACE_DECLARATION) {
        res = '';
      }
    }
    defs = root[principalPrefix + wsdlRoot];
    if (res === undefined) {
      let namespaceKey = Object.keys(defs)
        .find((key) => {
          return defs[key] === SCHEMA_NS_URL;
        });
      if (namespaceKey) {
        let namespace = namespaceKey.replace(PARSER_ATTRIBUTE_NAME_PLACE_HOLDER, '');
        res = getQNameLocal(namespace);
      }
    }
    return res !== '' ? res + XML_NAMESPACE_SEPARATOR : res;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} root the parsed root file
   * @param {object} importedTag the imported tag object
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {object} principalPrefix the wsdl principal prefix
   * @returns {object} the root
   */
  assignImportedProperties(
    root,
    importedTag,
    parsedWSDL,
    parsedSchemas,
    wsdlRoot,
    principalPrefix
  ) {
    let definitionsProperty = importedTag[wsdlRoot];
    if (definitionsProperty) {
      this.assignImportedPropertiesDefinitions(
        root,
        importedTag,
        parsedWSDL,
        parsedSchemas,
        wsdlRoot,
        principalPrefix
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
          wsdlRoot,
          principalPrefix
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
    let parserFactory = new ParserFactory(),
      versions = filesContents.map((fileContent) => {
        return parserFactory.getSafeWsdlVersion(fileContent);
      });

    if (versions) {
      if (versions.every((val) => {
        return val === undefined;
      })) {
        throw new WsdlError('There was not WSDL in folder');
      }
      let filtered = versions.filter(function (x) {
        return x !== undefined;
      });
      if (!filtered.every((val, i, arr) => {
        return val === arr[0];
      })) {
        throw new WsdlError('All WSDL must be the same version');
      }
      return filtered[0];
    }
    throw new WsdlError('There was not WSDL in folder');
  }
}


module.exports = {
  WSDLMerger
};
