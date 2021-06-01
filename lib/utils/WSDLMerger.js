
const path = require('path-browserify'),
    {
        getNodeByName,
        getPrincipalPrefix
    } = require('../WsdlParserCommon'),
    {
        getArrayFrom
    } = require('./objectUtils');
const { has } = require('traverse');

/**
 * Merge different files to a single WSDL
 * @param {object} files the content files
 * @returns {string} the single file
 */
function merge(filesPathArray, files, xmlParser) {
    let parsedSchemas,
        parsedWSDL,
        parsedXML = filesPathArray.map((filePath) => {
            if (files) {
                file = files[path.resolve(filePath.fileName)];
            }
            else {
                file = fs.readFileSync(filePath.fileName, 'utf8');
            }
            return xmlParser.parseToObject(file);
        });

    parsedSchemas = parsedXML.filter((parsed) => {
        let schemas = Object.keys(parsed).filter((key) => {
            return key.includes('schema');
        })
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

    let root = getRoot(parsedWSDL);
    resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas);
    let result = xmlParser.parseObjectToXML(root);
    return result;

}

function resolveImportsFromRootFile(root, parsedWSDL, parsedSchemas) {
    let imports = getArrayFrom(root['definitions']['import']);
    imports.forEach((importInformation) => {
        let importedFound = getParsedByTargetNamespace(parsedWSDL, parsedSchemas, importInformation['@_namespace']);
        if (importedFound) {
            assignImportedProperties(root, importedFound, parsedWSDL, parsedSchemas)
        }
    });
    return root;
}

function assignImportedProperties(root, importedTag, parsedWSDL, parsedSchemas) {
    let definitionsProperty = importedTag['definitions'];
    if (definitionsProperty) {
        assignImportedPropertiesDefinitions(root, importedTag, parsedWSDL, parsedSchemas);
    } else {
        let schemaProperties = importedTag['schema'];
        if (schemaProperties) {
            assignImportedPropertiesSchema(root, importedTag, parsedWSDL, parsedSchemas)
        }
    }
}

function assignImportedPropertiesDefinitions(root, importedTag, parsedWSDL, parsedSchemas) {
    let definitionsProperty = importedTag['definitions'];
    let hasImports = getArrayFrom(importedTag['definitions']['import']);
    if (hasImports && hasImports.length > 0) {

        resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas);
    }
    Object.keys(definitionsProperty).forEach((importedProperty) => {

        if (!root['definitions'][importedProperty]) {
            root['definitions'][importedProperty] = importedTag.definitions[importedProperty];
        }
    });
}

function assignImportedPropertiesSchema(root, importedTag, parsedWSDL, parsedSchemas) {
    let schemaProperty = importedTag['schema'];

    let existingSchemas = getArrayFrom(getNodeByName(root['definitions'], '', 'schema'));
    if (!existingSchemas || existingSchemas.length === 0) {
        root['definitions']['schema'] = []
    }
    root['definitions']['schema'].push(importedTag)

    Object.keys(schemaProperty).forEach((importedProperty) => {
        if (importedProperty === 'import') {
            resolveImportsFromRootFile(importedTag, parsedWSDL, parsedSchemas)
        }

    });
}

function getParsedByTargetNamespace(parsedXMLs, parsedSchemas, targetNamespace) {
    let allEllements = parsedXMLs.concat(parsedSchemas);
    let found = allEllements.find((parsedXML) => {
        let filterParentProperty = '';
        if (parsedXML['definitions']) {
            filterParentProperty = 'definitions';
        }
        else if (parsedXML['schema']) {
            filterParentProperty = 'schema';
        }
        let targetNamespaceFound = parsedXML[filterParentProperty]['@_targetNamespace'];
        if (targetNamespaceFound === targetNamespace) {
            return true;
        }
    });
    return found;
}

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



module.exports = {
    merge
};
