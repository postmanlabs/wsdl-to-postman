const expect = require('chai').expect,
  assert = require('chai').assert,
  {
    getValueExample,
    isKnownType
  } = require('../../lib/utils/knownTypes'),
  Element = require('../../lib/WSDLObject').Element;

describe('knownTypes getValueExample', function () {

  it('should get a number when called with "integer"', function () {
    const element = new Element();
    element.type = 'integer';
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get a number between 200 and 250 when called with "integer" min 200 max 250', function () {
    const element = new Element();
    element.type = 'integer';
    element.minimum = 200;
    element.maximum = 250;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    assert.isAtLeast(example, element.minimum);
    assert.isAtMost(example, element.maximum);
  });

  it('should get 200 when called with "integer" min 200 max 200', function () {
    const element = new Element();
    element.type = 'integer';
    element.minimum = 200;
    element.maximum = 200;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    assert.isAtLeast(example, element.minimum);
    assert.isAtMost(example, element.maximum);
  });

  it('should get a number between 2 and 250 when called with "integer" min undefined max 250', function () {
    const element = new Element();
    element.type = 'integer';
    element.minimum = undefined;
    element.maximum = 250;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, element.maximum);
  });


  it('should get a number between 200 and max when called with "integer" min undefined max 250', function () {
    const element = new Element();
    element.type = 'integer';
    element.minimum = 200;
    element.maximum = undefined;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    assert.isAtLeast(example, 200);
    assert.isAtMost(example, 18446744073709);
  });

  it('should get a number when called with "number"', function () {
    const element = new Element();
    element.type = 'number';
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get 200 when called with "number" min 200 max 250', function () {
    const element = new Element();
    element.type = 'number';
    element.minimum = 200;
    element.maximum = 250;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    assert.isAtLeast(example, 200);
    assert.isAtMost(example, 250);
  });

  it('should get 250 when called with "number" min undefined max 250', function () {
    const element = new Element();
    element.type = 'number';
    element.minimum = undefined;
    element.maximum = 250;
    let example = getValueExample(element);
    expect(example).to.be.a('number');
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 250);
  });

  it('should get a string when called with "string"', function () {
    const element = new Element();
    element.type = 'string';
    let example = getValueExample(element);
    expect(example).to.be.a('string');
  });

  it('should get a string of length of 5 when called with "string" with minimum 5 and maximum 10', function () {
    const element = new Element();
    element.type = 'string';
    element.minLength = 5;
    element.maxLength = 10;
    let example = getValueExample(element);
    expect(example).to.be.a('string');
    expect(example.length).to.equal(5);
  });

  it('should get a string of length of 10 when called with "string" with no minimum and maximum 10', function () {
    const element = new Element();
    element.type = 'string';
    element.maxLength = 10;
    let example = getValueExample(element);
    expect(example).to.be.a('string');
    expect(example.length).to.equal(10);
  });

  it('should get a string matching the regexp', function () {
    const element = new Element();
    element.type = 'string';
    element.pattern = '"-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]' +
      '|3[01])(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?"';
    let validationRegex,
      example = getValueExample(element);
    expect(example).to.be.a('string');

    validationRegex = new RegExp(
      '"-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]' +
      '|3[01])(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?"'
    );
    expect(validationRegex.test(example)).to.be.equal(true);
  });

  it('should get a string when called with an empty string', function () {
    const element = new Element();
    element.type = '';
    let example = getValueExample(element);
    expect(example).to.be.a('string');
  });

  it('should get string.. when called with minLength and maxLength of 8', function () {

    const element = {
      name: 'password',
      type: 'string',
      namespace: 'https://geoservices.tamu.edu/',
      maxLength: 8,
      minLength: 8
    };

    let example = getValueExample(element);
    expect(example).to.equal('string..');
    expect(example.length).to.equal(8);
  });

  it('should get s. when called with minLength and maxLength of 8', function () {
    const element = {
      name: 'password',
      type: 'string',
      namespace: 'https://geoservices.tamu.edu/',
      maxLength: 2,
      minLength: 2
    };

    let example = getValueExample(element);
    expect(example).to.equal('s.');
    expect(example.length).to.equal(2);
  });

  it('should get string.. when called with minLength of 8 no maxLength', function () {
    const element = {
      name: 'password',
      type: 'string',
      namespace: 'https://geoservices.tamu.edu/',
      minLength: 8
    };

    let example = getValueExample(element);
    expect(example).to.equal('string..');
    expect(example.length).to.equal(8);
  });


  it('should get default value when called with null', function () {
    const element = new Element();
    element.type = null;
    let example = getValueExample(element);
    expect(example).to.equal('default value');
  });

  it('should get true when called with boolean', function () {
    const element = new Element();
    element.type = 'boolean';
    let example = getValueExample(element);
    expect(example).to.equal(true);
  });

  it('should get a number between 2 and 100 when called with decimal', function () {
    const element = new Element();
    element.type = 'decimal';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get a number between 2 and 100 when called with float', function () {
    const element = new Element();
    element.type = 'float';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get a number between 2 and 100 when called with double', function () {
    const element = new Element();
    element.type = 'double';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get a number between 2 and 100 when called with int', function () {
    const element = new Element();
    element.type = 'int';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get a number between 2 and 100 when called with long', function () {
    const element = new Element();
    element.type = 'long';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get a number between 2 and 100 when called with short', function () {
    const element = new Element();
    element.type = 'short';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get a number between 2 and 100 when called with unsignedInt', function () {
    const element = new Element();
    element.type = 'unsignedInt';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get a number between 2 and 100 when called with unsignedLong', function () {
    const element = new Element();
    element.type = 'unsignedLong';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });


  it('should get a number between 2 and 100 when called with unsignedShort', function () {
    const element = new Element();
    element.type = 'unsignedShort';
    let example = getValueExample(element);
    assert.isAtLeast(example, 2);
    assert.isAtMost(example, 100);
  });

  it('should get true when called with date', function () {
    const element = new Element();
    element.type = 'string';
    element.pattern = '-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]' +
      '|[12][0-9]|3[01])(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?';
    let example = getValueExample(element);
    expect(example).to.be.string;
  });

  it('should get default value when called with unknown type', function () {
    const element = new Element();
    element.type = 'unknown';
    let example = getValueExample(element);
    expect(example).to.equal('default value');
  });
});

describe('knownTypes isKnownType', function () {
  it('should get true when called with "xs:integer"', function () {
    const exists = isKnownType('xs:integer');
    expect(exists).to.equal(true);
  });

  it('should get false when called with "integer"', function () {
    const exists = isKnownType('integer');
    expect(exists).to.equal(true);
  });
  it('should get false when called with "number"', function () {
    const exists = isKnownType('number');
    expect(exists).to.equal(true);
  });
  it('should get false when called with "string"', function () {
    const exists = isKnownType('string');
    expect(exists).to.equal(true);
  });
  it('should get false when called with "boolean"', function () {
    const exists = isKnownType('boolean');
    expect(exists).to.equal(true);
  });
});
