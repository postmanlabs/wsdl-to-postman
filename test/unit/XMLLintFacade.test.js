const expect = require('chai').expect,
  {
    XMLLintFacade
  } = require('../../lib/xsdValidation/XMLLintFacade'),
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
    const validator = new XMLLintFacade();
    expect(validator).to.be.an('object');
  });
});

describe('validate', function () {
  it('should get no errors on correct input', function () {
    const validator = new XMLLintFacade();
    let res = validator.validate(XML_VALID, XSD);
    expect(res).to.be.an('object');
    expect(res.errors).to.equal(null);
  });

  it('should get one errors on incorrect input', function () {
    const validator = new XMLLintFacade();
    let res = validator.validate(XML_INVALID_1, XSD);
    expect(res).to.be.an('object');
    expect(res.errors.length).to.equal(1);
  });

  it('should validate time correctly', function () {
    const validator = new XMLLintFacade(),
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
    expect(res.errors).to.equal(null);
  });
});
