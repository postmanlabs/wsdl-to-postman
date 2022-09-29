const { getAdjacentAndMissing,
    getReferences,
    calculatePath,
    calculatePathMissing,
    getRelatedFiles } = require('./../../lib/relatedFiles'),
  expect = require('chai').expect,
  fs = require('fs'),
  path = require('path'),
  { XMLParser } = require('../../lib/XMLParser'),
  xmlParser = new XMLParser(),
  COUNTING_SEPARATED = '../data/separatedFiles/counting',
  ALL_IMPORT_PRESENT = '../data/separatedFiles/allImportPresent',
  INCLUDE_TAG = '../data/separatedFiles/includeTag',
  MISSING_IMPORT = '../data/separatedFiles/missingImport',
  NESTED_FOLDERS = '../data/separatedFiles/nestedFolders',
  EXTRA_FILE = '../data/separatedFiles/wsdlfolderextrafilelocal',
  ALL_P_SERVICE = path.join(__dirname, ALL_IMPORT_PRESENT + '/CountingCategoryService.wsdl'),
  ALL_P_DATA = path.join(__dirname, ALL_IMPORT_PRESENT + '/CountingCategoryData.xsd'),
  C_C_SERVICE = path.join(__dirname, COUNTING_SEPARATED + '/CountingCategoryService.wsdl'),
  C_C_DATA = path.join(__dirname, COUNTING_SEPARATED + '/CountingCategoryData.xsd'),
  I_T_SERVICE = path.join(__dirname, INCLUDE_TAG + '/Services.wsdl'),
  I_T_TYPES = path.join(__dirname, INCLUDE_TAG + '/Types.xsd'),
  M_I_SERVICE = path.join(__dirname, MISSING_IMPORT + '/CountingCategoryService.wsdl'),
  M_I_DATA = path.join(__dirname, MISSING_IMPORT + '/CountingCategoryData.xsd'),
  NESTED_F_TYPES = path.join(__dirname, NESTED_FOLDERS + '/schemas/Types.xsd'),
  NESTED_F_SERVICES = path.join(__dirname, NESTED_FOLDERS + '/wsdl/Services.wsdl'),
  E_F_STOCK_WSDL = path.join(__dirname, EXTRA_FILE + '/stockquote.wsdl'),
  E_F_STOCK_XSD = path.join(__dirname, EXTRA_FILE + '/stockquote.xsd'),
  E_F_STOCK_SERVICE = path.join(__dirname, EXTRA_FILE + '/stockquoteservice.wsdl'),
  E_F_STOCK_README = path.join(__dirname, EXTRA_FILE + '/README.xml');


describe('getReferences function', function () {
  it('should return one reference for CC service file"', function () {
    const cCService = fs.readFileSync(C_C_SERVICE, 'utf8'),
      res = getReferences(xmlParser.parseToObject(cCService), 'wsdl:', 'definitions', xmlParser.attributePlaceHolder);
    expect(res.length).to.equal(2);
    expect(res[0].path).to.equal('CountingCategoryData.xsd');
    expect(res[1].path).to.equal('../../../common/v1/CommonData.xsd');
  });

  it('should return one reference for include tag service file"', function () {
    const iTService = fs.readFileSync(I_T_SERVICE, 'utf8'),
      res = getReferences(xmlParser.parseToObject(iTService), '', 'definitions', xmlParser.attributePlaceHolder);
    expect(res.length).to.equal(1);
    expect(res[0].path).to.equal('Types.xsd');
  });
});

describe('calculatePath function', function () {
  it('should return the path relative to the parent', function () {
    const result = calculatePath('sf/newpet.yaml', '../error.yaml');
    expect(result).to.equal('error.yaml');
  });
  it('should return the path relative to the parent inside a folder', function () {
    const result = calculatePath('sf/spec/newpet.yaml', '../common/error.yaml');
    expect(result).to.equal('sf/common/error.yaml');
  });
});

describe('calculatePathMissing function', function () {

  it('should calculate path and schemaLocation for absolut and relative paths', function () {
    const result = calculatePathMissing('newpet.yaml', '../../../common/error.yaml'),
      result1 = calculatePathMissing('sf/newpet.yaml', '../../../common/error.yaml'),
      result2 = calculatePathMissing('/sf/newpet.yaml', '../../../common/error.yaml'),
      result3 = calculatePathMissing('/newpet.yaml', '../../../../common/error.yaml'),
      result4 = calculatePathMissing('newpet.yaml', '/common/error.yaml'),
      result5 = calculatePathMissing('/missedRef.yaml', 'Pet.yaml'),
      result6 = calculatePathMissing('/newpet.yaml', '/common/error.yaml'),
      result7 = calculatePathMissing('/a/sf/newpet.yaml', '../common/error.yaml');

    expect(result.path).to.be.undefined;
    expect(result.schemaLocation).to.equal('../../../common/error.yaml');

    expect(result1.path).to.be.undefined;
    expect(result1.schemaLocation).to.equal('../../../common/error.yaml');

    expect(result2.path).to.be.undefined;
    expect(result2.schemaLocation).to.equal('../../../common/error.yaml');

    expect(result3.path).to.be.undefined;
    expect(result3.schemaLocation).to.equal('../../../../common/error.yaml');

    expect(result4.schemaLocation).to.be.undefined;
    expect(result4.path).to.equal('common/error.yaml');

    expect(result5.schemaLocation).to.be.undefined;
    expect(result5.path).to.equal('/Pet.yaml');

    expect(result6.schemaLocation).to.be.undefined;
    expect(result6.path).to.equal('/common/error.yaml');

    expect(result7.schemaLocation).to.be.undefined;
    expect(result7.path).to.equal('/a/common/error.yaml');

  });

});

describe('getAdjacentAndMissing function', function () {
  it('should return adjacent and no missing nodes', function () {
    const cCService = fs.readFileSync(ALL_P_SERVICE, 'utf8'),
      cCData = fs.readFileSync(ALL_P_DATA, 'utf8'),
      inputNode = {
        path: '/CountingCategoryService.wsdl',
        content: cCService
      },
      inputData = [{
        path: '/CountingCategoryData.xsd',
        content: cCData
      }],
      { graphAdj, missingNodes } = getAdjacentAndMissing(inputNode, inputData, inputNode, xmlParser);
    expect(graphAdj.length).to.equal(1);
    expect(graphAdj[0].path).to.equal('/CountingCategoryData.xsd');
    expect(missingNodes.length).to.equal(0);
  });

  it('should return adjacent and missing nodes', function () {
    const cCService = fs.readFileSync(C_C_SERVICE, 'utf8'),
      cCData = fs.readFileSync(C_C_DATA, 'utf8'),
      inputNode = {
        path: '/CountingCategoryService.wsdl',
        content: cCService
      },
      inputData = [{
        path: '/CountingCategoryData.xsd',
        content: cCData
      }],
      { graphAdj, missingNodes } = getAdjacentAndMissing(inputNode, inputData, inputNode, xmlParser);
    expect(graphAdj.length).to.equal(1);
    expect(graphAdj[0].path).to.equal('/CountingCategoryData.xsd');
    expect(missingNodes.length).to.equal(1);
    expect(missingNodes[0].schemaLocation).to.equal('../../../common/v1/CommonData.xsd');
  });

  it('should return adjacent and no missing nodes with include tag', function () {
    const iTService = fs.readFileSync(I_T_SERVICE, 'utf8'),
      iTTypes = fs.readFileSync(I_T_TYPES, 'utf8'),
      inputNode = {
        path: '/Services.wsdl',
        content: iTService
      },
      inputData = [{
        path: '/Types.xsd',
        content: iTTypes
      }],
      { graphAdj, missingNodes } = getAdjacentAndMissing(inputNode, inputData, inputNode, xmlParser);
    expect(graphAdj.length).to.equal(1);
    expect(graphAdj[0].path).to.equal('/Types.xsd');
    expect(missingNodes.length).to.equal(0);
  });

});

describe('getRelatedFiles function ', function () {

  it('should return related in a folder nested structure', function () {
    const services = fs.readFileSync(NESTED_F_SERVICES, 'utf8'),
      types = fs.readFileSync(NESTED_F_TYPES, 'utf8'),
      rootNode = {
        path: 'wsdl/Services.wsdl',
        content: services
      },
      inputData = [
        {
          path: 'schemas/Types.xsd',
          content: types
        }
      ],
      { relatedFiles, missingRelatedFiles } = getRelatedFiles(rootNode, inputData, xmlParser);
    expect(relatedFiles.length).to.equal(1);
    expect(relatedFiles[0].path).to.equal('schemas/Types.xsd');
    expect(missingRelatedFiles.length).to.equal(0);
  });

  it('should return adjacent and missing nodes', function () {
    const cCService = fs.readFileSync(M_I_SERVICE, 'utf8'),
      cCData = fs.readFileSync(M_I_DATA, 'utf8'),
      rootNode = {
        path: '/CountingCategoryService.wsdl',
        content: cCService
      },
      inputData = [{
        path: '/CountingCategoryData.xsd',
        content: cCData
      }],
      { relatedFiles, missingRelatedFiles } = getRelatedFiles(rootNode, inputData, xmlParser);
    expect(relatedFiles.length).to.equal(1);
    expect(relatedFiles[0].path).to.equal('/CountingCategoryData.xsd');
    expect(missingRelatedFiles.length).to.equal(1);
    expect(missingRelatedFiles[0].path).to.equal('/CommonData.xsd');
  });

  it('should return adjacent and missing nodes with schema location property', function () {
    const cCService = fs.readFileSync(C_C_SERVICE, 'utf8'),
      cCData = fs.readFileSync(C_C_DATA, 'utf8'),
      rootNode = {
        path: '/CountingCategoryService.wsdl',
        content: cCService
      },
      inputData = [{
        path: '/CountingCategoryData.xsd',
        content: cCData
      }],
      { relatedFiles, missingRelatedFiles } = getRelatedFiles(rootNode, inputData, xmlParser);
    expect(relatedFiles.length).to.equal(1);
    expect(relatedFiles[0].path).to.equal('/CountingCategoryData.xsd');
    expect(missingRelatedFiles.length).to.equal(1);
    expect(missingRelatedFiles[0].schemaLocation).to.equal('../../../common/v1/CommonData.xsd');
  });

  it('should return related in a folder with files that are not wsdl', function () {
    const otherWsdl = fs.readFileSync(E_F_STOCK_WSDL, 'utf8'),
      types = fs.readFileSync(E_F_STOCK_XSD, 'utf8'),
      services = fs.readFileSync(E_F_STOCK_SERVICE, 'utf8'),
      readme = fs.readFileSync(E_F_STOCK_README, 'utf8'),
      rootNode = {
        path: 'stockquoteservice.wsdl',
        content: services
      },
      inputData = [
        {
          path: 'stockquote.xsd',
          content: types
        },
        {
          path: 'stockquote.wsdl',
          content: otherWsdl
        },
        {
          path: 'README.xml',
          content: readme
        }
      ],
      { relatedFiles, missingRelatedFiles } = getRelatedFiles(rootNode, inputData, xmlParser);
    expect(relatedFiles.length).to.equal(2);
    expect(relatedFiles[0].path).to.equal('stockquote.wsdl');
    expect(relatedFiles[1].path).to.equal('stockquote.xsd');
    expect(missingRelatedFiles.length).to.equal(0);
  });

});
