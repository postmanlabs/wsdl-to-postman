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
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
       xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
        xmlns:tns="http://www.dataaccess.com/webservicesserver/"
         name="NumberConversion" 
         targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <types>
        <xs:schema elementFormDefault="qualified"
         targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
    </definitions>`,
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

  it('should get an array of types with 1 root and 1 child', function() {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <types>
        <xs:schema elementFormDefault="qualified"
         targetNamespace="http://www.dataaccess.com/webservicesserver/">
          <xs:element name="NumberToWords">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="ubiNum" type="xs:unsignedLong"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:schema>
      </types>
    </definitions>`,
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

  it('should get an array of types with 4 root and 1 child per root', function() {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
    </definitions>`,
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

    expect(types[1].name).to.equal('NumberToWordsResponse');
    expect(types[1].isComplex).to.equal(true);
    expect(types[1].type).to.equal('complex');
    expect(types[1].minOccurs).to.equal(1);
    expect(types[1].maxOccurs).to.equal(1);
    expect(types[1].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[1].children).to.be.an('array');

    expect(types[1].children[0].name).to.equal('NumberToWordsResult');
    expect(types[1].children[0].isComplex).to.equal(false);
    expect(types[1].children[0].type).to.equal('string');
    expect(types[1].children[0].minOccurs).to.equal(1);
    expect(types[1].children[0].maxOccurs).to.equal(1);
    expect(types[1].children[0].children).to.be.an('array');
    expect(types[1].children[0].children).to.be.empty;

    expect(types[2].name).to.equal('NumberToDollars');
    expect(types[2].isComplex).to.equal(true);
    expect(types[2].type).to.equal('complex');
    expect(types[2].minOccurs).to.equal(1);
    expect(types[2].maxOccurs).to.equal(1);
    expect(types[2].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[2].children).to.be.an('array');

    expect(types[2].children[0].name).to.equal('dNum');
    expect(types[2].children[0].isComplex).to.equal(false);
    expect(types[2].children[0].type).to.equal('decimal');
    expect(types[2].children[0].minOccurs).to.equal(1);
    expect(types[2].children[0].maxOccurs).to.equal(1);
    expect(types[2].children[0].children).to.be.an('array');
    expect(types[2].children[0].children).to.be.empty;

    expect(types[3].name).to.equal('NumberToDollarsResponse');
    expect(types[3].isComplex).to.equal(true);
    expect(types[3].type).to.equal('complex');
    expect(types[3].minOccurs).to.equal(1);
    expect(types[3].maxOccurs).to.equal(1);
    expect(types[3].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[3].children).to.be.an('array');

    expect(types[3].children[0].name).to.equal('NumberToDollarsResult');
    expect(types[3].children[0].isComplex).to.equal(false);
    expect(types[3].children[0].type).to.equal('string');
    expect(types[3].children[0].minOccurs).to.equal(1);
    expect(types[3].children[0].maxOccurs).to.equal(1);
    expect(types[3].children[0].children).to.be.an('array');
    expect(types[3].children[0].children).to.be.empty;
  });


});
