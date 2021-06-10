const expect = require('chai').expect,
  {
    LibXMLjs2Facade
  } = require('../../lib/xsdValidation/LibXMLjs2Facade'),
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
    const validator = new LibXMLjs2Facade();
    expect(validator).to.be.an('object');
  });
});

describe('validate', function () {
  it('should get no errors on correct input', function () {
    const validator = new LibXMLjs2Facade();
    let res = validator.validate(XML_VALID, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(0);
  });

  it('should get one errors on incorrect input', function () {
    const validator = new LibXMLjs2Facade();
    let res = validator.validate(XML_INVALID_1, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
  });
});
