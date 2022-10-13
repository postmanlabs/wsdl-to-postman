/* eslint-disable no-restricted-modules */
const
  fs = require('fs'),
  CODIFICATION = 'utf8',
  {
    getNodeByName,
    getPrincipalPrefix,
    getWSDLImports,
    wsdlHasImports,
    getAttributeByName,
    getSchemaPrefixFromParsedSchema,
    getNodeByQNameLocalArray,
    IMPORT_TAG,
    SCHEMA_TAG,
    ATTRIBUTE_TYPES,
    TARGET_NAMESPACE_SPEC,
    ATTRIBUTE_NAMESPACE,
    ATTRIBUTE_SCHEMALOCATION,
    getWSDLIncludes,
    canGetPrincipalPrefix
  } = require('../WsdlParserCommon'),
  {
    WSDLParserFactory
  } = require('../WSDLParserFactory'),
  {
    getArrayFrom
  } = require('./objectUtils'),
  {
    getFolderNameFromPath
  } = require('./textUtils'),
  WsdlError = require('../WsdlError'),
  {
    MULTIPLE_ROOT_FILES,
    NOT_WSDL_IN_FOLDER,
    WSDL_DIFF_VERSION,
    MISSING_XML_PARSER,
    MISSING_ROOT_FILE
  } = require('../constants/messageConstants'),
  {
    COMPLEX_TYPE_TAG,
    GROUP_TAG,
    SIMPLE_TYPE_TAG,
    ATTRIBUTE_ELEMENT
  } = require('../constants/XSDConstants');

var path = require('path'),
  pathBrowserify = require('path-browserify');

class WSDLMerger {

  /**
 * Merge different files to a single WSDL
 * @param {object} input input.data contains the file paths and input.xmlFiles contains the content files
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
        contentFiles.push({
          content: files[path.resolve(filePath.fileName)],
          fileName: filePath.fileName
        });

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
      promises.push(this.readFileAsync(filePath.fileName, CODIFICATION));
    });
    return Promise.all(promises).then((values) => {
      values.forEach((content, index) => {
        contentFiles.push({ content: content, fileName: filesPathArray[index].fileName });
      });
      return this.processMergeFiles(contentFiles, xmlParser);
    });
  }

  /**
   * Merge different files to a single WSDL
   * @param {Array} filesPathArray the content of the files in string and the name of the files
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @param {string} origin optional parameter to change origin of the call
   * @returns {string} the single file
   */
  processMergeFiles(filesPathArray, xmlParser, origin = undefined) {
    let parsedSchemas,
      root,
      rootFiles,
      parsedWSDL,
      wsdlVersion,
      parsedXMLs,
      parsedXMLsAndFileNames,
      wsdlParser,
      contentFiles,
      principalPrefix,
      wsdlRoot = '';
    if (!xmlParser) {
      throw new WsdlError(MISSING_XML_PARSER);
    }

    if (origin && origin === 'browser') {
      path = pathBrowserify;
    }

    parsedXMLsAndFileNames = filesPathArray.map((file) => {
      return {
        parsed: xmlParser.safeParseToObject(file.content),
        fileName: file.fileName
      };
    }).filter((tuple) => {
      return tuple.parsed !== '';
    });

    parsedXMLs = parsedXMLsAndFileNames.map((tuple) => {
      return tuple.parsed;
    });


    contentFiles = filesPathArray.map((filePathArray) => {
      return filePathArray.content;
    });

    wsdlVersion = this.getFilesVersion(contentFiles);
    wsdlParser = this.getWSDLParser(wsdlVersion);
    wsdlRoot = wsdlParser.informationService.RootTagName;
    parsedSchemas = this.getParsedSchemasFromAllParsed(parsedXMLs);
    parsedWSDL = this.getParsedWSDLFromAllParsed(parsedXMLs, wsdlRoot);
    rootFiles = this.getRoot(parsedWSDL, wsdlRoot, wsdlParser);
    if (rootFiles && rootFiles.length > 1) {
      throw new WsdlError(MULTIPLE_ROOT_FILES);
    }
    root = rootFiles[0];
    if (!root) {
      throw new WsdlError(MISSING_ROOT_FILE);
    }
    principalPrefix = getPrincipalPrefix(root, wsdlRoot);
    this.resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas, wsdlRoot, xmlParser.attributePlaceHolder,
      wsdlParser, parsedXMLsAndFileNames, root, wsdlRoot, principalPrefix);
    return xmlParser.parseObjectToXML(root);
  }

  /**
   * Merge different files to a single WSDL
   * @param {object} parsedData the parsedData used to bundle the files
   ** @param {array} parsedData.parsedXMLsAndFileNames  An object with the parsed input xmls with filenames
   ** @param {array} parsedData.parsedXMLs An array of all the parsed xml files from input
   ** @param {array} parsedData.parsedWSDL An array of all the parsed wsdl files detected in input
   ** @param {array} parsedData.rootFileNames An array of all the file names from the detected root files
   ** @param {array} parsedData.rootFiles An array with all the detected root files content
   * @param {object} wsdlParser the wsdlParser related with the version to use
   * @param {object} xmlParser the parser class to parse xml to object or vice versa
   * @param {string} origin optional parameter to change origin of the call
   * @returns {string} the formatted merged files
   */
  processBundleFiles(
    parsedData,
    wsdlParser,
    xmlParser,
    origin = undefined
  ) {
    let parsedSchemas,
      wsdlRoot = wsdlParser.informationService.RootTagName,
      mergedFiles = [],
      {
        parsedXMLsAndFileNames,
        parsedWSDL,
        parsedXMLs,
        rootFileNames,
        rootFiles
      } = parsedData;

    if (!xmlParser) {
      throw new WsdlError(MISSING_XML_PARSER);
    }

    if (origin && origin === 'browser') {
      path = pathBrowserify;
    }

    wsdlRoot = wsdlParser.informationService.RootTagName;
    parsedSchemas = this.getParsedSchemasFromAllParsed(parsedXMLs);

    rootFiles.forEach((rootFile, index) => {
      if (!canGetPrincipalPrefix(rootFile, wsdlRoot)) {
        return;
      }
      let principalPrefix = getPrincipalPrefix(rootFile, wsdlRoot);
      this.resolveImportsFromRootFile(rootFile, parsedWSDL, parsedSchemas, wsdlRoot, xmlParser.attributePlaceHolder,
        wsdlParser, parsedXMLsAndFileNames, rootFile, wsdlRoot, principalPrefix, true);
      mergedFiles.push({
        rootFile: {
          bundledContent: xmlParser.parseObjectToXML(rootFile),
          path: rootFileNames[index]
        }
      });
    });

    return mergedFiles;
  }

  /**
   * Gets the root of the files list
   * @param {object} xmlParsedArray the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {object} wsdlParser the WSDL parser according to WSDL version
   * @returns {object} the root
   */
  getRoot(xmlParsedArray, wsdlRoot, wsdlParser) {
    let root = xmlParsedArray.filter((xmlParsed) => {
      let principalPrefix = getPrincipalPrefix(xmlParsed, wsdlRoot),
        hasImports = wsdlHasImports(xmlParsed, principalPrefix, wsdlRoot),
        hasServices = getNodeByName(xmlParsed[principalPrefix + wsdlRoot], principalPrefix,
          wsdlParser.informationService.ConcreteServiceTag);
      if (hasImports && hasServices) {
        return true;
      }
    });
    return root;
  }

  /**
   * Gets the root of the files list
   * @param {object} xmlParsedArray the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {object} wsdlParser the WSDL parser according to WSDL version
   * @returns {object} the root files
   */
  getRootSafe(xmlParsedArray, wsdlRoot, wsdlParser) {
    let root = xmlParsedArray.filter((xmlParsed) => {
      if (!canGetPrincipalPrefix(xmlParsed, wsdlRoot)) {
        return false;
      }
      let principalPrefix = getPrincipalPrefix(xmlParsed, wsdlRoot),
        hasImports = wsdlHasImports(xmlParsed, principalPrefix, wsdlRoot),
        hasServices = getNodeByName(xmlParsed[principalPrefix + wsdlRoot], principalPrefix,
          wsdlParser.informationService.ConcreteServiceTag);
      if (hasImports && hasServices) {
        return true;
      }
    });
    return root;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} parentXML the identified parent
   * @param {object} parsedXMLs the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} targetNamespace the target namespace to find
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} principalPrefix the wsdl principal prefix
   * @returns {object} the root
   */
  getParsedWSDLOrSchemaByTargetNamespace(parentXML, parsedXMLs, parsedSchemas, targetNamespace, wsdlRoot,
    principalPrefix) {
    let filterParentProperty = '',
      schemaPrefix = '',
      type = 'wsdl',
      targetNamespaceFound,
      allElements = parsedXMLs.concat(parsedSchemas).filter((xmlParsed) => {
        return xmlParsed !== parentXML;
      }),
      found = allElements.find((parsedXML) => {
        if (parsedXML[principalPrefix + wsdlRoot]) {
          filterParentProperty = principalPrefix + wsdlRoot;
          if (wsdlRoot === SCHEMA_TAG) {
            schemaPrefix = getSchemaPrefixFromParsedSchema(parsedXML);
            type = SCHEMA_TAG;
          }
        }
        else {
          schemaPrefix = getSchemaPrefixFromParsedSchema(parsedXML);
          if (parsedXML[schemaPrefix + SCHEMA_TAG]) {
            filterParentProperty = schemaPrefix + SCHEMA_TAG;
            type = SCHEMA_TAG;
          }
        }
        if (filterParentProperty !== '') {
          targetNamespaceFound = getAttributeByName(parsedXML[filterParentProperty], TARGET_NAMESPACE_SPEC);
          if (targetNamespaceFound === targetNamespace) {
            return true;
          }
        }
      });
    return { found, schemaPrefix, type };
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} parentXML the identified parent
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} schemaLocation the schema location to find
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} principalPrefix the wsdl principal prefix
   * @param {Array} parsedXMLsAndFileNames array of content files and files names
   * @param {string} parentFolder the parents folder path
   * @returns {object} the root
   */
  getParsedWSDLOrSchemaBySchemaLocation(parentXML, parsedWSDL, parsedSchemas, schemaLocation, wsdlRoot,
    principalPrefix, parsedXMLsAndFileNames, parentFolder) {
    let schemaPrefix = '',
      found,
      allElements = parsedWSDL.concat(parsedSchemas).filter((xmlParsed) => {
        return xmlParsed !== parentXML;
      });
    parsedXMLsAndFileNames.forEach((tuple) => {
      let absolutePath = path.resolve(parentFolder, schemaLocation);
      if (absolutePath === tuple.fileName || tuple.fileName === schemaLocation) {
        if (!tuple.parsed[principalPrefix + wsdlRoot]) {
          schemaPrefix = getSchemaPrefixFromParsedSchema(tuple.parsed);
        }
        found = allElements.find((parsedXML) => {
          return parsedXML === tuple.parsed;
        });
      }
    });

    if (!found) {
      parsedXMLsAndFileNames.forEach((tuple) => {
        if (tuple.fileName === schemaLocation) {
          if (!tuple.parsed[principalPrefix + wsdlRoot]) {
            schemaPrefix = getSchemaPrefixFromParsedSchema(tuple.parsed);
          }
          found = allElements.find((parsedXML) => {
            return parsedXML === tuple.parsed;
          });
        }
      });
    }
    return { found, schemaPrefix };
  }


  /**
   * Gets the import information and assign it to the root
   * @param {object} WSDLRootFile the array of parsed xmls
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} attributePlaceHolder the character for attributes according the xml parser
   * @param {object} wsdlParser the WSDL parser according to WSDL version
   * @param {Array} parsedXMLsAndFileNames array of content files and files names
   * @param {object} processingRoot the current root
   * @param {object} processingRootTag the root tag from the current root
   * @param {object} rootPrincipalPrefix the principal prefix of root file
   * @returns {object} the root
   */
  resolveImportsFromRootFile(WSDLRootFile, parsedWSDL, parsedSchemas, wsdlRoot, attributePlaceHolder,
    wsdlParser, parsedXMLsAndFileNames, processingRoot, processingRootTag,
    rootPrincipalPrefix, kill = false) {
    let principalPrefix,
      imports,
      parentFolder = '',
      includes,
      resolvedImports = [];
    if (!canGetPrincipalPrefix(processingRoot, processingRootTag)) {
      return;
    }
    principalPrefix = getPrincipalPrefix(processingRoot, processingRootTag);
    imports = getWSDLImports(processingRoot, principalPrefix, processingRootTag, kill);
    includes = getWSDLIncludes(processingRoot, principalPrefix, processingRootTag, kill);
    imports.forEach((importInformation) => {
      let importedFound = this.getParsedWSDLOrSchemaByTargetNamespace(
        processingRoot,
        parsedWSDL,
        parsedSchemas,
        getAttributeByName(importInformation, ATTRIBUTE_NAMESPACE),
        processingRootTag,
        principalPrefix
      );
      if (importedFound.found) {
        resolvedImports.push(importInformation);
        this.assignImportedProperties(WSDLRootFile, importedFound, parsedWSDL, parsedSchemas, wsdlRoot,
          principalPrefix, attributePlaceHolder, wsdlParser, parsedXMLsAndFileNames, importedFound.type,
          rootPrincipalPrefix);
      }
    });
    // imports.forEach((el) => {
    //   delete el.killNode;
    // });
    resolvedImports.forEach((resolved) => {
      if (resolved.hasOwnProperty('killNode')) {
        resolved.killNode();
      }
    });
    parentFolder =
      getFolderNameFromPath(
        parsedXMLsAndFileNames.find((tuple) => {
          return tuple.parsed === processingRoot;
        }).fileName
      );

    includes.forEach((importInformation) => {
      let importedFound = this.getParsedWSDLOrSchemaBySchemaLocation(
        processingRoot,
        parsedWSDL,
        parsedSchemas,
        getAttributeByName(importInformation, ATTRIBUTE_SCHEMALOCATION),
        wsdlRoot,
        principalPrefix,
        parsedXMLsAndFileNames,
        parentFolder
      );
      if (importedFound.found) {
        this.assignImportedProperties(processingRoot, importedFound, parsedWSDL, parsedSchemas, wsdlRoot,
          principalPrefix, attributePlaceHolder, wsdlParser, parsedXMLsAndFileNames, importedFound.type,
          rootPrincipalPrefix);
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
   * @param {object} wsdlParser the WSDL parser according to WSDL version
   * @param {Array} parsedXMLsAndFileNames the parsed files and names
   * @param {object} rootPrincipalPrefix the principal prefix of root file
   * @returns {void} It modifies the provided root file
   */
  assignImportedPropertiesDefinitions(root, importedTag, parsedWSDL, parsedSchemas, wsdlRoot, principalPrefix,
    attributePlaceHolder, wsdlParser, parsedXMLsAndFileNames, rootPrincipalPrefix) {
    let definitionsProperty = importedTag[principalPrefix + wsdlRoot],
      hasImports = wsdlHasImports(importedTag, principalPrefix, wsdlRoot);
    if (hasImports) {
      this.resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas, wsdlRoot,
        attributePlaceHolder, wsdlParser, parsedXMLsAndFileNames, importedTag, wsdlRoot, rootPrincipalPrefix);
    }
    Object.keys(definitionsProperty).forEach((importedProperty) => {
      let rootProperty = getNodeByName(root[rootPrincipalPrefix + wsdlRoot], '', importedProperty),
        importedPropertyValue = getNodeByName(importedTag[principalPrefix + wsdlRoot], '', importedProperty);
      if (importedProperty === principalPrefix + wsdlParser.informationService.AbstractInterfaceTag ||
        importedProperty === principalPrefix + wsdlParser.informationService.ConcreteInterfaceTag ||
        importedProperty === principalPrefix + wsdlParser.informationService.ConcreteServiceTag ||
        importedProperty === principalPrefix + ATTRIBUTE_TYPES) {
        this.mergeProperty(root, principalPrefix, wsdlRoot, rootProperty,
          importedProperty, importedPropertyValue);
      }
      else if (!rootProperty) {
        root[rootPrincipalPrefix + wsdlRoot][importedProperty] = importedPropertyValue;
      }
    });
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} root the parsed root file
   * @param {string} principalPrefix the wsdl principal prefix
   * @param {string} wsdlRoot the wsdl root according to the version
   * @param {string} rootProperty the imported tag object
   * @param {object} importedProperty the name of the property to merge
   * @param {object} importedPropertyValue the property value to merge
   * @returns {undefined} nothing
   */
  mergeProperty(root, principalPrefix, wsdlRoot, rootProperty,
    importedProperty, importedPropertyValue) {
    if (Array.isArray(rootProperty)) {
      rootProperty.push(importedPropertyValue);
    }
    let arrayProperties = [rootProperty];
    if (Array.isArray(importedPropertyValue)) {
      arrayProperties.push(...importedPropertyValue);
    }
    else {
      arrayProperties.push(importedPropertyValue);
    }
    root[principalPrefix + wsdlRoot][importedProperty] = arrayProperties;
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
   * @param {string} schemaPrefix the namespace prefix from the schema
   * @param {string} wsdlParser the wsdl parser object
   * @param {string} parsedXMLsAndFileNames the parsed files and names
   * @param {string} rootPrincipalPrefix the namespace prefix from the schema
   * @returns {object} undefined
   */
  assignImportedPropertiesSchema(root, importedTag, parsedWSDL, parsedSchemas, wsdlRoot, principalPrefix,
    attributePlaceHolder, schemaPrefix, wsdlParser, parsedXMLsAndFileNames, rootPrincipalPrefix) {
    let schemaProperty = importedTag[schemaPrefix + SCHEMA_TAG],
      existingTypes = getArrayFrom(
        getNodeByName(root[rootPrincipalPrefix + wsdlRoot], rootPrincipalPrefix, ATTRIBUTE_TYPES)
      );

    if (!existingTypes || existingTypes.length === 0) {
      this.assignImportedPropertiesSchemaNotTypesTag(root, rootPrincipalPrefix, wsdlRoot, importedTag);
    }
    else {
      let schemasInType = this.getExistingSchemasInFirstTypeTag(existingTypes, importedTag);
      if (schemasInType.length === 0) {
        existingTypes[0][schemaPrefix + SCHEMA_TAG] = schemaProperty;
      }
      else {
        let typesInRoot = existingTypes,
          targetType,
          schemasFromType;
        targetType = this.getTargetTypeToMergeSchema(typesInRoot);
        schemasFromType = targetType[schemaPrefix + SCHEMA_TAG];
        if (Array.isArray(schemasFromType)) {
          let schemasToPush = [],
            alreadyAdded = schemasFromType.find((schema) => { return schema === schemaProperty; });
          if (alreadyAdded) {
            return;
          }
          schemasFromType.forEach((existingSchema) => {
            if (existingSchema !== schemaProperty) {
              let wasMerged = this.checkAndMergeSchemas(existingSchema, schemaProperty, schemaPrefix, targetType);
              if (!wasMerged) {
                let alreadyAdded = schemasToPush.find((added) => {
                  return added === schemaProperty;
                });
                if (!alreadyAdded) {
                  schemasToPush.push(schemaProperty);
                }
              }
            }
          });
          schemasFromType.push(...schemasToPush);
        }
        else if (schemasFromType) {
          let wasMerged = this.checkAndMergeSchemas(schemasFromType, schemaProperty, schemaPrefix, targetType);
          if (!wasMerged) {
            let arraySchemas = [schemasFromType, schemaProperty];
            targetType[schemaPrefix + SCHEMA_TAG] = arraySchemas;
          }
        }
        else {
          existingTypes[0][schemaPrefix + SCHEMA_TAG] = schemaProperty;
        }
      }
    }

    Object.keys(schemaProperty).forEach((importedProperty) => {
      if (importedProperty === schemaPrefix + IMPORT_TAG) {
        this.resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas,
          wsdlRoot, attributePlaceHolder, wsdlParser, parsedXMLsAndFileNames, importedTag, SCHEMA_TAG,
          rootPrincipalPrefix);
      }
    });
  }

  /**
   * locates the types tag where we are going to merge
   * @param {Array} typesInRoot the array of existing types
   * @returns {object} the target type to merge the schemas
   */
  getTargetTypeToMergeSchema(typesInRoot) {
    return Array.isArray(typesInRoot) ? typesInRoot[0] : typesInRoot;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {Array} existingTypes the array of existing types
   * @param {object} importedTag the imported tag to exclude it from the filter
   * @returns {Array} schema tags in type tag
   */
  getExistingSchemasInFirstTypeTag(existingTypes, importedTag) {
    return getNodeByQNameLocalArray(existingTypes[0], SCHEMA_TAG).filter((schema) => {
      return schema !== importedTag;
    });
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} root the root file parsed
   * @param {object} rootPrincipalPrefix the principal prefix for this root
   * @param {string} wsdlRoot the root Tag from this root object
   * @param {object} importedTag the tag object that is being imported
   * @returns {object} undefined
   */
  assignImportedPropertiesSchemaNotTypesTag(root, rootPrincipalPrefix, wsdlRoot, importedTag) {
    root[rootPrincipalPrefix + wsdlRoot][rootPrincipalPrefix + ATTRIBUTE_TYPES] = [];
    root[rootPrincipalPrefix + wsdlRoot][rootPrincipalPrefix + ATTRIBUTE_TYPES].push(importedTag);
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} rootSchema the root file parsed
   * @param {object} importedSchema the imported tag object
   * @param {string} schemaPrefix the namespace prefix from the schema
   * @returns {object} undefined
   */
  checkAndMergeSchemas(rootSchema, importedSchema, schemaPrefix) {
    let willMerge = this.isSameNamespaceSchema(rootSchema, importedSchema);
    if (willMerge) {
      this.mergeTypesFromImportedToRootSchema(rootSchema, schemaPrefix + COMPLEX_TYPE_TAG,
        rootSchema[schemaPrefix + COMPLEX_TYPE_TAG], importedSchema[schemaPrefix + COMPLEX_TYPE_TAG]);
      this.mergeTypesFromImportedToRootSchema(rootSchema, schemaPrefix + ATTRIBUTE_ELEMENT,
        rootSchema[schemaPrefix + ATTRIBUTE_ELEMENT], importedSchema[schemaPrefix + ATTRIBUTE_ELEMENT]);
      this.mergeTypesFromImportedToRootSchema(rootSchema, schemaPrefix + GROUP_TAG,
        rootSchema[schemaPrefix + GROUP_TAG], importedSchema[schemaPrefix + GROUP_TAG]);
      this.mergeTypesFromImportedToRootSchema(rootSchema, schemaPrefix + SIMPLE_TYPE_TAG,
        rootSchema[schemaPrefix + SIMPLE_TYPE_TAG], importedSchema[schemaPrefix + SIMPLE_TYPE_TAG]);
      this.mergePropertiesFromImportedToRootSchema(rootSchema, importedSchema);
      return true;
    }
    return false;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} rootSchema the root file parsed
   * @param {object} importedSchema the imported tag object
   * @param {string} schemaPrefix the namespace prefix from the schema
   * @returns {object} undefined
   */
  mergePropertiesFromImportedToRootSchema(rootSchema, importedSchema) {
    Object.keys(importedSchema).forEach((importedProperty) => {
      let hasProperty = Object.keys(rootSchema).find((rootProperty) => { return rootProperty === importedProperty; });
      if (!hasProperty) {
        rootSchema[importedProperty] = importedSchema[importedProperty];
      }
    });
  }

  /**
   *  Merge the types from the imported tag to the root
   * @param {object} rootSchema the root file parsed
   * @param {string} rootPropertyFullName the root property name to merge with prefix
   * @param {object} rootPropertyValue the root property value
   * @param {object} importedPropertyValue the imported tag object value
   * @param {string} schemaPrefix the namespace prefix from the schema
   * @returns {object} undefined
   */
  mergeTypesFromImportedToRootSchema(rootSchema, rootPropertyFullName, rootPropertyValue, importedPropertyValue) {
    if (Array.isArray(rootPropertyValue)) {
      rootPropertyValue.push(...importedPropertyValue);
    }
    else {
      rootSchema[rootPropertyFullName] = importedPropertyValue;
    }
  }

  /**
   *  identifies if the root schema and the imported have the same target namespace
   * @param {object} rootSchema the root file parsed
   * @param {string} imported the imported schema
   * @returns {object} undefined
   */
  isSameNamespaceSchema(rootSchema, imported) {
    let rootTargetNamespace = getAttributeByName(rootSchema, TARGET_NAMESPACE_SPEC),
      importedtargetNamespace = getAttributeByName(imported, TARGET_NAMESPACE_SPEC);
    if (rootTargetNamespace !== '' && importedtargetNamespace !== '') {
      return rootTargetNamespace === importedtargetNamespace;
    }
    return false;
  }

  /**
   * Gets the import information and assign it to the root
   * @param {object} WSDLRootFile the parsed root file
   * @param {object} importedTag the imported tag object
   * @param {object} parsedWSDL the array of parsed xmls
   * @param {object} parsedSchemas the array of parsed xmls
   * @param {string} wsdlRoot the WSDL root according to the version
   * @param {object} principalPrefix the WSDL principal prefix
   * @param {string} attributePlaceHolder the character for attributes according the xml parser
   * @param {object} wsdlParser the WSDL parser according to WSDL version
   * @param {Array} parsedXMLsAndFileNames the parsed files and names
   * @param {Array} type the type of the property to merge
   * @param {Array} rootPrincipalPrefix the principal prefix of the root
   * @returns {object} the root
   */
  assignImportedProperties(WSDLRootFile, importedTag, parsedWSDL, parsedSchemas, wsdlRoot, principalPrefix,
    attributePlaceHolder, wsdlParser, parsedXMLsAndFileNames, type, rootPrincipalPrefix) {
    if (type === 'wsdl') {
      this.assignImportedPropertiesDefinitions(
        WSDLRootFile,
        importedTag.found,
        parsedWSDL,
        parsedSchemas,
        wsdlRoot,
        principalPrefix,
        attributePlaceHolder,
        wsdlParser,
        parsedXMLsAndFileNames,
        rootPrincipalPrefix
      );
    }
    else {
      let schemaProperties = importedTag.found[importedTag.schemaPrefix + SCHEMA_TAG];
      if (schemaProperties) {
        this.assignImportedPropertiesSchema(
          WSDLRootFile,
          importedTag.found,
          parsedWSDL,
          parsedSchemas,
          wsdlRoot,
          principalPrefix,
          attributePlaceHolder,
          importedTag.schemaPrefix,
          wsdlParser,
          parsedXMLsAndFileNames,
          rootPrincipalPrefix
        );
      }
    }
  }


  /**
   * Gets the parsed objects that are WSDL definitions
   * from the provided list
   * @param {array} parsedXML the files content parsed
   * @param {string} wsdlRoot the wsdl root according to the WSDL version
   * @returns {array} The array of the detected wsdl files parsed
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
   * Gets the parsed objects that are WSDL definitions and the related filenames
   * from the provided list
   * @param {array} parsedXML the files content parsed
   * @param {array} fileNames the file names from the input files
   * @param {string} wsdlRoot the wsdl root according to the WSDL version
   * @returns {object} The detected WSDL parsed files and their respective file names
   */
  getParsedWSDLAndFileNamesFromAllParsed(parsedXML, fileNames, wsdlRoot) {
    let fileNamesMap = [];
    const parsedWSDLs = parsedXML.filter((parsed, index) => {
      let schemas = Object.keys(parsed).filter((key) => {
        return key.includes(wsdlRoot);
      });
      if (schemas && schemas.length > 0) {
        fileNamesMap.push(fileNames[index]);
        return parsed;
      }
    });
    return {
      parsedWSDLs,
      fileNamesMap
    };
  }

  /**
   * Gets the parsed objects that are schema definitions
   * from the provided list
   * @param {array} parsedXML the files content parsed
   * @returns {array} The array of the detected schema files parsed
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
    let parserFactory = new WSDLParserFactory(),
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

  /**
   * Gets the wsdl parser according to the version
   * @param {string} version the files content in strings array
   * @returns {object} the WSDL Parser
   */
  getWSDLParser(version) {
    let parserFactory = new WSDLParserFactory();
    return parserFactory.getParserByVersion(version);
  }

  /** Read File asynchronously
   *
   * @param {String} filePath Path of the file.
   * @param {String} encoding encoding
   * @return {String} Contents of the file
   */
  readFileAsync(filePath, encoding) {
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
