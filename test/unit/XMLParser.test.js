const expect = require('chai').expect,
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  {
    PARSER_ATRIBUTE_NAME_PLACE_HOLDER
  } = require('../../lib/WsdlParserCommon');

describe('XMLparser parseToObject', function () {

  it('should get an object in memory representing xml object with valid input', function () {
    const simpleInput = `<user is='great'>
        <name>Tobias</name>
        <familyName>Nickel</familyName>
        <profession>Software Developer</profession>
        <location>Shanghai / China</location>
        </user>`,
      parser = new XMLParser();
    let parsed = parser.parseToObject(simpleInput);
    expect(parsed).to.be.an('object');
    expect(parsed).to.have.own.property('user');
    expect(parsed.user).to.have.own.property('name');
    expect(parsed.user[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'is']).to.equal('great');

  });

  it('should throw an error when input is an empty string', function () {
    parser = new XMLParser();
    try {
      parser.parseToObject('');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is null', function () {
    parser = new XMLParser();
    try {
      parser.parseToObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is undefined', function () {
    parser = new XMLParser();
    try {
      parser.parseToObject(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is empty', function () {
    parser = new XMLParser();
    try {
      parser.parseToObject();
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is not xml', function () {
    parser = new XMLParser();
    try {
      parser.parseToObject('this is not an xml');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Not xml file found in your document');
    }
  });
});


