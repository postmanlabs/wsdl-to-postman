const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/specialCases',
  validWSDL2s = 'test/data/specialCases/wsdl2',
  fs = require('fs'),
  {
    DOC_HAS_NO_SERVICE_MESSAGE,
    DOC_HAS_NO_BINDINGS_MESSAGE,
    DOC_HAS_NO_BINDINGS_OPERATIONS_MESSAGE,
    DOC_HAS_NO_SERVICE_PORT_MESSAGE_2,
    ELEMENT_NOT_FOUND

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
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_SERVICE_MESSAGE))
        .to.equal(true);
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
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_BINDINGS_MESSAGE))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without bindings operations ', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/NoBindingsOperations.wsdl', 'utf8');
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
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_BINDINGS_OPERATIONS_MESSAGE))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without service port ', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/NoServicesPortTag.wsdl', 'utf8');
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
      expect(result.output[0].data.item.length).to.equal(4);
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_SERVICE_PORT_MESSAGE_2))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without schema ', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/NoSchema.wsdl', 'utf8');
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
      expect(result.output[0].data.item[0].item.length).to.equal(2);
      expect(result.output[0].data.item[1].item.length).to.equal(2);
      expect(result.output[0].data.item[0].item[0].request.body.raw.includes(ELEMENT_NOT_FOUND))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without a element', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/NoElementInSchema.wsdl', 'utf8');
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
      expect(result.output[0].data.item[0].item.length).to.equal(2);
      expect(result.output[0].data.item[1].item.length).to.equal(2);
      expect(result.output[0].data.item[0].item[0].request.body.raw.includes(ELEMENT_NOT_FOUND))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl complex type not found', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/ComplexTypeNotFound.wsdl', 'utf8');
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
      expect(result.output[0].data.item.length).to.equal(2);
      expect(result.output[0].data.item[1].request.body.raw.includes(ELEMENT_NOT_FOUND))
        .to.equal(true);
    });
  });
});

describe('SchemaPack convert special cases WSDL 2.0', function() {

  it('Should get an object representing PM Collection from wsdl without services ', function() {
    let fileContent = fs.readFileSync(validWSDL2s + '/NoServicesTag.wsdl', 'utf8');
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
      expect(result.output[0].data.item.length).to.equal(3);
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_SERVICE_MESSAGE))
        .to.equal(true);
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
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_BINDINGS_MESSAGE))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without bindings operations ', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/NoBindingsOperations.wsdl', 'utf8');
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
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_BINDINGS_OPERATIONS_MESSAGE))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without services ports', function() {
    let fileContent = fs.readFileSync(validWSDL2s + '/NoServiceEndpoint.wsdl', 'utf8');
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
      expect(result.output[0].data.item.length).to.equal(3);
      expect(result.output[0].data.info.description.content.includes(DOC_HAS_NO_SERVICE_PORT_MESSAGE_2))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without schema ', function() {
    let fileContent = fs.readFileSync(validWSDL2s + '/NoSchema.wsdl', 'utf8');
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
      expect(result.output[0].data.item.length).to.equal(3);
      expect(result.output[0].data.item[0].item[0].request.body.raw.includes(ELEMENT_NOT_FOUND))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without a element', function() {
    let fileContent = fs.readFileSync(validWSDL2s + '/NoElementInSchema.wsdl', 'utf8');
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
      expect(result.output[0].data.item.length).to.equal(3);
      expect(result.output[0].data.item[0].item[0].request.body.raw.includes(ELEMENT_NOT_FOUND))
        .to.equal(true);
    });
  });

  it('Should get an object representing PM Collection from wsdl without services porttypes', function() {
    let fileContent = fs.readFileSync(validWSDLs + '/NoServicesPortType.wsdl', 'utf8');
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
      expect(result.output[0].data.item.length).to.equal(2);
    });
  });

});
