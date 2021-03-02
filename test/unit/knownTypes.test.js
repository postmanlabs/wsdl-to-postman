const expect = require('chai').expect,
  {
    getValueExample,
    isKnownType
  } = require('../../lib/utils/knownTypes');

describe('knownTypes getValueExample', function() {
  it('should get a number when called with "unsignedLong"', function() {
    const example = getValueExample('unsignedLong');
    expect(example).to.be.a('number');
  });

  it('should get a number when called with "int"', function() {
    const example = getValueExample('int');
    expect(example).to.be.a('number');
  });

  it('should get a string when called with "string"', function() {
    const example = getValueExample('string');
    expect(example).to.be.a('string');
  });

  it('should get a string when called with an empty string', function() {
    const example = getValueExample('');
    expect(example).to.be.a('string');
  });

  it('should get default value when called with null', function() {
    const example = getValueExample(null);
    expect(example).to.equal('default value');
  });
});

describe('knownTypes isKnownType', function() {
  it('should get true when called with "xs:unsignedLong"', function() {
    const exists = isKnownType('xs:unsignedLong');
    expect(exists).to.equal(true);
  });

  it('should get false when called with "unsignedLong"', function() {
    const exists = isKnownType('unsignedLong');
    expect(exists).to.equal(true);
  });
});
