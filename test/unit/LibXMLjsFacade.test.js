const expect = require('chai').expect,
  {
    LibXMLjsFacade
  } = require('../../lib/xsdValidation/LibXMLjsFacade'),
  fs = require('fs'),
  validSchemaFolder = 'test/data/multipleSchemaValidation',
  XSD = `<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
elementFormDefault="qualified">
<xs:element name="beginnersbook">
  <xs:complexType>
    <xs:sequence>
      <xs:element name="to" type="xs:string"/>
      <xs:element name="from" type="xs:string"/>
      <xs:element name="subject" type="xs:string"/>
      <xs:element name="message" type="xs:int"/>
    </xs:sequence>
  </xs:complexType>
</xs:element>
</xs:schema>`,
  XML_VALID = `<?xml version="1.0"?>  
<beginnersbook>
 <to>My Readers</to>
 <from>Chaitanya</from>
 <subject>A Message to my readers</subject>
 <message>1</message>
</beginnersbook>`,
  XML_INVALID_1 = `<?xml version="1.0"?>  
<beginnersbook>
 <to>My Readers</to>
 <from>Chaitanya</from>
 <subject>A Message to my readers</subject>
 <message>sme message</message>
</beginnersbook>`;

describe('XMLLintFacade constructor', function () {
  it('should get an object of type XSDValidXML', function () {
    const validator = new LibXMLjsFacade();
    expect(validator).to.be.an('object');
  });
});

describe('validate', function () {
  it('should get no errors on correct input', function () {
    const validator = new LibXMLjsFacade();
    let res = validator.validate(XML_VALID, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(0);
  });

  it('should get one errors on incorrect input', function () {
    const validator = new LibXMLjsFacade();
    let res = validator.validate(XML_INVALID_1, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
  });

  it('should return an empty array when message matches with schema', function () {
    const docSource = fs.readFileSync(validSchemaFolder + '/chapter04.xml', 'utf8'),
      schemaSource = fs.readFileSync(validSchemaFolder + '/chapter04ord1.xsd', 'utf8'),
      validator = new LibXMLjsFacade(),
      res = validator.validate(docSource, schemaSource);
    expect(res).to.be.an('array').with.length(0);
  });

  it('should return array when message does not match with schema', function () {
    const docSource = fs.readFileSync(validSchemaFolder + '/chapter04InvalidMessage.xml', 'utf8'),
      schemaSource = fs.readFileSync(validSchemaFolder + '/chapter04ord1.xsd', 'utf8'),
      validator = new LibXMLjsFacade(),
      res = validator.validate(docSource, schemaSource);
    expect(res).to.be.an('array').with.length(1);
    expect(res[0].code).to.equal(1824);
  });

  it('should validate time correctly', function () {
    const validator = new LibXMLjsFacade(),
      res = validator.validate(`<Summary_Compensation_Data> 
      <Meal_Out>07:34:57</Meal_Out>
  </Summary_Compensation_Data>`, `<xsd:schema  xmlns:xsd="http://www.w3.org/2001/XMLSchema" > 
      <xsd:element name="Summary_Compensation_Data" type="Compensation_Summary_DataType"/>
        <xsd:complexType name="Compensation_Summary_DataType">
        <xsd:annotation>
          <xsd:documentation>Encapsulating element containg a brief summary of Compensation data.</xsd:documentation>
        </xsd:annotation>
        <xsd:sequence>
        <xsd:element name="Meal_Out" type="xsd:time" maxOccurs="1">
              </xsd:element>
        </xsd:sequence>
      </xsd:complexType>
    </xsd:schema>`);
    expect(res).to.be.an('array').with.length(0);
  });

});
