const expect = require('chai').expect,
  {
    mergeSchemas
  } = require('../../lib/utils/schemaMerger'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  fs = require('fs'),
 { SOAPMessageHelper } = require('../../lib/utils/SOAPMessageHelper'),


describe('schemaMerger', function() {
  it('should get true', function() {
    let fileContent = fs.readFileSync('test/data/schemasToMerge/2schemas.wsdl', 'utf8');
    const xmlParser = new XMLParser(),
      parsed = xmlParser.parseToObject(fileContent),
      merged = mergeSchemas(parsed['wsdl:definitions']['wsdl:types']['xsd:schema']);
    expect(merged).to.be(Object);
  });
 
});
