const expect = require('chai').expect,
  {
    SchemaBuilder
  } = require('../../lib/utils/SchemaBuilder'),
  {
    Wsdl11Parser
  } = require('../../lib/Wsdl11Parser');

describe('SchemaBuilder Constructor', function() {
  it('should get an object of the schema builder', function() {
    const builder = new SchemaBuilder();
    expect(builder).to.be.a('object');
  });

});

describe('SchemaBuilder getTypes', function() {

  it('should get an array of types', function() {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:tns="http://www.dataaccess.com/webservicesserver/" name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <types>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.dataaccess.com/webservicesserver/">
          <xs:element name="NumberToWords">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="ubiNum" type="xs:unsignedLong"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToWordsResponse">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="NumberToWordsResult" type="xs:string"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToDollars">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="dNum" type="xs:decimal"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToDollarsResponse">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="NumberToDollarsResult" type="xs:string"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:schema>
      </types>
    </definitions>`

    parser = new Wsdl11Parser(),
      builder = new SchemaBuilder();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      types = builder.getTypes(
        parsed,
        '',
        'definitions'
      );
    expect(types).to.be.an('array');
  });

  it('should throw an error when parsed is udnefined', function() {
    const builder = new SchemaBuilder();
    try {
      builder.getTypes(
        undefined,
        '',
        'definitions'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get types from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function() {
    const builder = new SchemaBuilder();
    try {
      builder.getTypes(
        null,
        '',
        'definitions'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get types from undefined or null object');
    }
  });

});


describe('SchemaBuilder getElements', function() {

  it('should get an array of types', function() {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:tns="http://www.dataaccess.com/webservicesserver/" name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <types>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.dataaccess.com/webservicesserver/">
          <xs:element name="NumberToWords">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="ubiNum" type="xs:unsignedLong"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:schema>
      </types>
    </definitions>`

    parser = new Wsdl11Parser(),
      builder = new SchemaBuilder();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      types = builder.getElements(
        parsed,
        '',
        'definitions',
        'xs:'
      );
    expect(types).to.be.an('array');

    expect(types[0].name).to.equal('NumberToWords');
    expect(types[0].isComplex).to.equal(true);
    expect(types[0].type).to.equal('complex');
    expect(types[0].minOccurs).to.equal(1);
    expect(types[0].maxOccurs).to.equal(1);
    expect(types[0].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[0].children).to.be.an('array');

    expect(types[0].children[0].name).to.equal('ubiNum');
    expect(types[0].children[0].isComplex).to.equal(false);
    expect(types[0].children[0].type).to.equal('unsignedLong');
    expect(types[0].children[0].minOccurs).to.equal(1);
    expect(types[0].children[0].maxOccurs).to.equal(1);
    expect(types[0].children[0].children).to.be.an('array');
    expect(types[0].children[0].children).to.be.empty;
  });


});
