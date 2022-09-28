const { getAdjacentAndMissing, getReferences } = require('./../../lib/relatedFiles'),
  expect = require('chai').expect,
  fs = require('fs'),
  path = require('path'),
  { XMLParser } = require('../../lib/XMLParser'),
  xmlParser = new XMLParser(),
  COUNTING_SEPARATED = '../data/separatedFiles/counting',
  C_C_SERVICE = path.join(__dirname, COUNTING_SEPARATED + '/CountingCategoryService.wsdl'),
  C_C_DATA = path.join(__dirname, COUNTING_SEPARATED + '/CountingCategoryData.xsd');

describe('getReferences function', function () {
  it('should return one reference for CC service file"', function () {
    const cCService = fs.readFileSync(C_C_SERVICE, 'utf8'),
      res = getReferences(xmlParser.parseToObject(cCService), 'wsdl:', 'definitions', xmlParser.attributePlaceHolder);
    expect(res.length).to.equal(1);
    expect(res[0].path).to.equal('CountingCategoryData.xsd');
  });
});


describe('getAdjacentAndMissing function', function () {
  it('should return adjacent and no missing nodes', function () {
    const cCService = fs.readFileSync(C_C_SERVICE, 'utf8'),
      cCData = fs.readFileSync(C_C_DATA, 'utf8'),
      inputNode = {
        fileName: '/CountingCategoryService.wsdl',
        content: cCService
      },
      inputData = [{
        fileName: '/CountingCategoryData.xsd',
        content: cCData
      }],
      { graphAdj, missingNodes } = getAdjacentAndMissing(inputNode, inputData, inputNode, xmlParser);
    expect(graphAdj.length).to.equal(1);
    expect(graphAdj[0].fileName).to.equal('/CountingCategoryData.xsd');
    expect(missingNodes.length).to.equal(0);
  });

  // it('should return adjacent and missing nodes', function () {
  //   const contentFileMissedRef = fs.readFileSync(missedRef, 'utf8'),
  //     contentFilePet = fs.readFileSync(petstoreSeparatedPet, 'utf8'),
  //     inputNode = {
  //       fileName: '/missedRef.yaml',
  //       content: contentFileMissedRef
  //     },
  //     inputData = [{
  //       fileName: '/Pet.yaml',
  //       content: contentFilePet
  //     }],
  //     { graphAdj, missingNodes } = getAdjacentAndMissing(inputNode, inputData, inputNode);
  //   expect(graphAdj.length).to.equal(1);
  //   expect(graphAdj[0].fileName).to.equal('/Pet.yaml');
  //   expect(missingNodes.length).to.equal(1);
  //   expect(missingNodes[0].path).to.equal('/common/Error.yaml');

  // });
});
