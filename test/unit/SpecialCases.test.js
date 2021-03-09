const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/specialCases',
  fs = require('fs'),
  {
    DOC_HAS_NO_SERVICE_MESSAGE,
    DOC_HAS_NO_BINDIGS_MESSAGE
  } = require('../../lib/constants/messageConstants');

describe('SchemaPack convert special cases WSDL 1.1', function() {

  it('Should get an object representing PM Collection from wsdl without services ', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/NoServicesTag.wsdl', 'utf8');
    const schemaPack = new SchemaPack({
      data: fileContent,
      type: 'string'
    }, {});

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].data.item).to.be.an('array');
      expect(result.output[0].data.item.length).to.equal(8);
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_SERVICE_MESSAGE)).
      to.equal(true);
      fs.writeFileSync('coll.json', JSON.stringify(result.output[0].data))
    });
  });

  it('Should get an object representing PM Collection from wsdl without bindings ', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/NoBindingsTag.wsdl', 'utf8');
    const schemaPack = new SchemaPack({
      data: fileContent,
      type: 'string'
    }, {});

    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].data.item).to.be.an('array');
      expect(result.output[0].data.item.length).to.equal(0);
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_BINDIGS_MESSAGE)).
      to.equal(true);
      fs.writeFileSync('coll.json', JSON.stringify(result.output[0].data))
    });
  });
});
