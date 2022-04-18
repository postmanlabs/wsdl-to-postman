const expect = require('chai').expect,
  fs = require('fs'),
  validSchemaFolder = 'test/data/schemaTest',
  {
    XSDToJsonSchemaParser
  } = require('../../lib/XSDToJsonSchemaParser'),

  BASE_SCHEMA = `
            <?xml version="1.0" encoding="UTF-8"?>
            <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="https://someurl.data" 
            targetNamespace="https://someurl.data"
             elementFormDefault="qualified" attributeFormDefault="unqualified" version="1.0.0">
              <!--Character-->
              <xs:simpleType name="C">
                <xs:restriction base="xs:string">
                  <xs:minLength value="1"/>
                </xs:restriction>
              </xs:simpleType>
              <!--Boolean-->
              <xs:simpleType name="Boolean">
                <xs:restriction base="xs:boolean"/>
              </xs:simpleType>
              <!--Year, YrMon, Date, Time, DateTime, Timestamp-->
              <xs:simpleType name="Year">
                <xs:restriction base="xs:gYear"/>
              </xs:simpleType>
              <xs:simpleType name="YrMon">
                <xs:restriction base="xs:gYearMonth"/>
              </xs:simpleType>
              <xs:simpleType name="Date">
                <xs:restriction base="xs:date"/>
              </xs:simpleType>
              <xs:simpleType name="Time">
                <xs:restriction base="xs:time"/>
              </xs:simpleType>
              <xs:simpleType name="DateTime">
                <xs:restriction base="xs:dateTime"/>
              </xs:simpleType>
              <xs:simpleType name="Timestamp">
                <xs:restriction base="xs:dateTime"/>
              </xs:simpleType>
              <!--Integer-->
              <xs:simpleType name="Integer">
                <xs:restriction base="xs:integer"/>
              </xs:simpleType>
              <!--Universal Resource Identifier (URI)-->
              <xs:simpleType name="URI">
                <xs:restriction base="xs:anyURI">
                  <xs:minLength value="1"/>
                </xs:restriction>
              </xs:simpleType>
              <!--Binary-->
              <xs:simpleType name="Binary">
                <xs:restriction base="xs:base64Binary"/>
              </xs:simpleType>
              <xs:simpleType name="Duration">
                <xs:restriction base="xs:duration"/>
              </xs:simpleType>
              <xs:simpleType name="Char_20">
                <xs:restriction base="C">
                  <xs:minLength value="1"/>
                  <xs:maxLength value="20"/>
                </xs:restriction>
              </xs:simpleType>
            </xs:schema>`,
  SCHEMA_TEST =
    `<?xml version="1.0" encoding="UTF-8"?>
              <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" 
              xmlns="http://www.xsd2jsonschema.org/example"
              
               targetNamespace="http://www.xsd2jsonschema.org/example" 
               elementFormDefault="qualified" attributeFormDefault="unqualified" version="1.0.0">
                <xs:import namespace="https://someurl.data"/>
                <xs:complexType name="PersonInfoType">
                  <xs:sequence>
                    <xs:element name="PersonName" type="q1:PersonNameType" xmlns:q1="https://someurl.data" />
                    <xs:element name="Age" type="Integer" minOccurs="0"/>
                    <xs:element name="BirthDate" type="Date"/>
                  </xs:sequence>
                </xs:complexType>
                <xs:complexType name="PersonNameType">
                  <xs:sequence>
                    <xs:element name="FirstName" type="Char_20"/>
                    <xs:element name="MiddleName" type="Char_20" minOccurs="0"/>
                    <xs:element name="LastName" type="Char_20"/>
                    <xs:element name="AliasName" type="Char_20" minOccurs="0" maxOccurs="unbounded"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:schema>`;

describe('XSDToJsonSchemaParser Constructor', function () {
  it('should get an object of the XSDToJsonSchemaParser', function () {
    const parser = new XSDToJsonSchemaParser();
    expect(parser).to.be.a('object');
  });

});

describe('SchemaBuilderXSD parseSchema', function () {
  it('should get an object of the schema parsed', function () {
    const parser = new XSDToJsonSchemaParser(),
      fileContent = fs.readFileSync(validSchemaFolder + '/coreSchema.wsdl', 'utf8'),
      parsedSchema = parser.parseSchema(fileContent);
    expect(parsedSchema).to.be.a('object');
  });

});

describe('SchemaBuilderXSD parseSchemas', function () {
  it('should get an object of the schema parsed', function () {
    const parser = new XSDToJsonSchemaParser(),
      parsedSchema = parser.parseAllSchemas([BASE_SCHEMA, SCHEMA_TEST]);
    expect(parsedSchema).to.be.a('Array');
    expect(parsedSchema.length).to.equal(2);
  });

  it('Should parse appinfo as and not fail', function() {
    const schemaStrings = [
        `<xsd:schema 
      elementFormDefault=\"qualified\" 
      attributeFormDefault=\"qualified\" 
      targetNamespace=\"urn:com.workday/bsvc\" 
      xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" 
      xmlns:wd=\"urn:com.workday/bsvc\">
      <xsd:complexType name=\"Organization_ReferenceType\">
        <xsd:annotation>
          <xsd:documentation>Reference element representing a unique instance of Organization.</xsd:documentation>
          <xsd:appinfo>
            <wd:Validation>
              <xsd:documentation>
                This is documentation
              <wd:Validation_Message>Organization Reference Integration ID does not exist!</wd:Validation_Message>
            </wd:Validation>
            <wd:Validation>
              <xsd:documentation>This is documentation</xsd:documentation>
              <wd:Validation_Message>Thi is custom content</wd:Validation_Message>
            </wd:Validation>
          </xsd:appinfo>
        </xsd:annotation>
        <xsd:sequence>
          <xsd:element name=\"Integration_ID_Reference\" type=\"xsd:string\"></xsd:element>
        </xsd:sequence>
      </xsd:complexType>
    </xsd:schema>
    `
      ],
      parser = new XSDToJsonSchemaParser(),
      parsedSchema = parser.parseAllSchemas(schemaStrings);
    expect(parsedSchema).to.be.an('array');
  });

});
