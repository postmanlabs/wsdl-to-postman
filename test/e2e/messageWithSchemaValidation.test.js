const fs = require('fs'),
  expect = require('chai').expect,
  {
    ParserFactory
  } = require('../../lib/ParserFactory'),
  {
    validateOperationMessagesWithSchema,
    getCleanSchema
  } = require('./../../lib/utils/messageWithSchemaValidation'),
  {
    parseFromXmlToObject
  } = require('./../../lib/WsdlParserCommon'),
  validWSDLs = 'test/data/validWSDLs11';

describe('Validating wsdlObject bodyMessages using validateOperationMessagesWithSchema function', function() {
  const WSDLsFiles = fs.readdirSync(validWSDLs);
  WSDLsFiles.forEach((file) => {
    it(`Should return an empty array when body messages matches with schema. ${file}`, function() {
      const xmlDocumentContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8'),
        factory = new ParserFactory(),
        version = factory.getWsdlVersion(xmlDocumentContent),
        parser = factory.getParser(xmlDocumentContent),
        wsdlObject = parser.getWsdlObject(xmlDocumentContent),
        xmlParsed = parseFromXmlToObject(xmlDocumentContent),
        schemaToValidate = getCleanSchema(xmlParsed, wsdlObject.schemaNamespace, version);

      let errors = validateOperationMessagesWithSchema(wsdlObject, schemaToValidate);
      expect(errors).to.be.an('array');
      expect(errors.length).to.be.equal(0);
    });
  });
});
