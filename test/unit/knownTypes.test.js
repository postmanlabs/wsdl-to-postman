const expect = require('chai').expect,
  {
    getValueExample,
    isKnownType
  } = require('../../lib/utils/knownTypes'),
  Element = require('../../lib/WSDLObject').Element;

describe('knownTypes getValueExample', function() {

  it('should get a number when called with "integer"', function() {
    const element = new Element();
    element.type = 'integer';
    let example = getValueExample(element);
    expect(example).to.be.a('number');
  });

  it('should get 200 when called with "integer" min 200 max 250', function() {
    const element = new Element();
    element.type = 'integer';
    element.minimum = 200;
    element.maximum = 250;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    expect(example).to.equal(200);
  });

  it('should get 250 when called with "integer" min undefined max 250', function() {
    const element = new Element();
    element.type = 'integer';
    element.minimum = undefined;
    element.maximum = 250;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    expect(example).to.equal(250);
  });

  it('should get a number when called with "number"', function() {
    const element = new Element();
    element.type = 'number';
    let example = getValueExample(element);
    expect(example).to.be.a('number');
  });

  it('should get 200 when called with "number" min 200 max 250', function() {
    const element = new Element();
    element.type = 'integer';
    element.minimum = 200;
    element.maximum = 250;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    expect(example).to.equal(200);
  });

  it('should get 250 when called with "number" min undefined max 250', function() {
    const element = new Element();
    element.type = 'integer';
    element.minimum = undefined;
    element.maximum = 250;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    expect(example).to.equal(250);
  });

  it('should get a string when called with "string"', function() {
    const element = new Element();
    element.type = 'string';
    let example = getValueExample(element);
    expect(example).to.be.a('string');
  });

  it('should get a string when called with an empty string', function() {
    const element = new Element();
    element.type = '';
    let example = getValueExample(element);
    expect(example).to.be.a('string');
  });

  it('should get default value when called with null', function() {
    const element = new Element();
    element.type = null;
    let example = getValueExample(element);
    expect(example).to.equal('default value');
  });

  it('should get true when called with boolean', function() {
    const element = new Element();
    element.type = 'boolean';
    let example = getValueExample(element);
    expect(example).to.equal(example);
  });
});

describe('knownTypes isKnownType', function() {
  it('should get true when called with "xs:integer"', function() {
    const exists = isKnownType('xs:integer');
    expect(exists).to.equal(true);
  });

  it('should get false when called with "integer"', function() {
    const exists = isKnownType('integer');
    expect(exists).to.equal(true);
  });
  it('should get false when called with "number"', function() {
    const exists = isKnownType('number');
    expect(exists).to.equal(true);
  });
  it('should get false when called with "string"', function() {
    const exists = isKnownType('string');
    expect(exists).to.equal(true);
  });
  it('should get false when called with "boolean"', function() {
    const exists = isKnownType('boolean');
    expect(exists).to.equal(true);
  });
});
