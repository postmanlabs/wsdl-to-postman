const expect = require('chai').expect,
  {
    XMLXSDValidator
  } = require('../../lib/xsdValidation/XMLXSDValidator'),
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
</beginnersbook>`,
  XML_INVALID_PM_VAR = `<?xml version="1.0"?>  
<beginnersbook>
 <to>My Readers</to>
 <from>Chaitanya</from>
 <subject>A Message to my readers</subject>
 <message>{{var}}</message>
</beginnersbook>`,
  XML_INVALID_MISS_SCHEMA = `<?xml version="1.0"?>  
<beginnersbook> 
 <to>My Readers</to>
 <from>Chaitanya</from>
 <WRONGFIELD>WRONG</WRONGFIELD>
 <subject>A Message to my readers</subject>
 <message>{{var}}</message>
</beginnersbook>`,
  XML_INVALID_MISS_IN_MESSAGE = `<?xml version="1.0"?>  
<beginnersbook> 
 <from>Chaitanya</from>
 <subject>A Message to my readers</subject>
 <message>{{var}}</message>
</beginnersbook>`,
  XSD_2 = `<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<xsd:element name="getMatchDetails">    <xsd:complexType>
<xsd:sequence>        <xsd:element name="application_key" type="xsd:string"/>
<xsd:element name="matchId" type="xsd:string" nillable="true"/>      </xsd:sequence>
</xsd:complexType>  </xsd:element>  <xsd:element name="getMatchDetailsResponse">
<xsd:complexType>      <xsd:sequence>
<xsd:element name="getMatchDetailsResult" type="ArrayOfMatchDetail"/>
</xsd:sequence>    </xsd:complexType>  </xsd:element>  <xsd:complexType name="DateTime">
<xsd:sequence/>  </xsd:complexType>  <xsd:complexType name="MatchDetail">    <xsd:sequence>
<xsd:element name="id" type="xsd:int" nillable="true"/>    
  <xsd:element name="hometeamid" type="xsd:int" nillable="true"/>
  <xsd:element name="hometeamidname" type="xsd:string" nillable="true"/>
  <xsd:element name="guestteamid" type="xsd:int" nillable="true"/>
  <xsd:element name="guestteamname" type="xsd:string" nillable="true"/>
  <xsd:element name="matchdate" type="xsd:date" nillable="true"/>
  <xsd:element name="homegoal" type="xsd:int" nillable="true"/>
  <xsd:element name="guestgoal" type="xsd:int" nillable="true"/>
  <xsd:element name="status" type="xsd:int" nillable="true"/>
  <xsd:element name="UpdateTimeStamp" type="DateTime" nillable="true"/>
  </xsd:sequence>  </xsd:complexType>  <xsd:complexType name="ArrayOfMatchDetail">
  <xsd:sequence>      <xsd:element name="item" type="MatchDetail" minOccurs="0" maxOccurs="unbounded"/>
  </xsd:sequence>  </xsd:complexType></xsd:schema>`,
  XML_XSD2_INVALID_CONTENT = `<getMatchDetailsResponse >
<getMatchDetailsResult>
<item>
<id>-2147483648</id>
<hometeamid>-2147483648</hometeamid>
<hometeamidname>place your string value here</hometeamidname>
<guestteamid>-2147483648</guestteamid>
<guestteamname>place your string value here</guestteamname>
<matchdate>2021-05-05Z</matchdate>
<homegoal>-2147483648</homegoal>
<guestgoal>-2147483648</guestgoal>
<status>-2147483648</status>
<UpdateTimeStamp>
</UpdateTimeStamp>
</item>
</getMatchDetailsResult>
</getMatchDetailsResponse>`;

describe('XMLLintFacade constructor', function () {
  it('should get an object of type XSDValidXML', function () {
    const validator = new XMLXSDValidator();
    expect(validator).to.be.an('object');
  });
});

describe('validate', function () {
  it('should get no errors on correct input default option', function () {
    const validator = new XMLXSDValidator();
    let res = validator.validate(XML_VALID, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(0);
  });

  it('should get no errors on correct input option set to libxmljs', function () {
    const validator = new XMLXSDValidator('libxmljs');
    let res = validator.validate(XML_VALID, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(0);
  });

  it('should get no errors on correct input option set to xmllint', function () {
    const validator = new XMLXSDValidator('xmllint');
    let res = validator.validate(XML_VALID, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(0);
  });

  it('should get one error incorrect type option set to libxmljs', function () {
    const validator = new XMLXSDValidator('libxmljs');
    let res = validator.validate(XML_INVALID_1, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1824);
    expect(res[0].str1).to.equal('sme message');
    expect(res[0].message).to.equal('Element \'message\': \'sme message\' is not a valid' +
    ' value of the atomic type \'xs:int\'.\n');
  });

  it('should get one error incorrect type option set to libxmljs pm variable', function () {
    const validator = new XMLXSDValidator('libxmljs');
    let res = validator.validate(XML_INVALID_PM_VAR, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1824);
    expect(res[0].str1).to.equal('{{var}}');
    expect(res[0].message).to.equal('Element \'message\': \'{{var}}\' ' +
    'is not a valid value of the atomic type \'xs:int\'.\n');
  });

  it('should get one error extra field option set to libxmljs', function () {
    const validator = new XMLXSDValidator('libxmljs');
    let res = validator.validate(XML_INVALID_MISS_SCHEMA, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1871);
    expect(res[0].str1).to.equal(undefined);
    expect(res[0].message).to.equal('Element \'WRONGFIELD\': This element is not expected.' +
    ' Expected is ( subject ).\n');
  });

  it('should get one error missing field option set to libxmljs', function () {
    const validator = new XMLXSDValidator('libxmljs');
    let res = validator.validate(XML_INVALID_MISS_IN_MESSAGE, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1871);
    expect(res[0].str1).to.equal(undefined);
    expect(res[0].message).to.equal('Element \'from\': This element is not expected. Expected is ( to ).\n');
  });

  it('should get one error content not allowed option set to libxmljs', function () {
    const validator = new XMLXSDValidator('libxmljs');
    let res = validator.validate(XML_XSD2_INVALID_CONTENT, XSD_2);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1841);
    expect(res[0].str1).to.equal(undefined);
    expect(res[0].message).to.equal('Element \'UpdateTimeStamp\': Character content is not allowed,' +
    ' because the content type is empty.\n');
  });

  it('should get one error incorrect type option set to xmllint', function () {
    const validator = new XMLXSDValidator('xmllint'),
      expected = 'Element \'message\': \'sme message\' is not a valid value of the atomic type \'xs:int\'.\n';
    let res = validator.validate(XML_INVALID_1, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1824);
    expect(res[0].str1).to.equal('sme message');
    expect(res[0].message).to.equal(expected);

  });

  it('should get one error incorrect type option set to xmllint pm variable', function () {
    const validator = new XMLXSDValidator('xmllint');
    let res = validator.validate(XML_INVALID_PM_VAR, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1824);
    expect(res[0].str1).to.equal('{{var}}');
    expect(res[0].message).to.equal('Element \'message\': \'{{var}}\' is not a valid' +
    ' value of the atomic type \'xs:int\'.\n');
  });

  it('should get one error extra field option set to xmllint', function () {
    const validator = new XMLXSDValidator('xmllint');
    let res = validator.validate(XML_INVALID_MISS_SCHEMA, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1871);
    expect(res[0].str1).to.equal(undefined);
    expect(res[0].message).to.equal('Element \'WRONGFIELD\': This element is not expected. Expected is ( subject ).\n');
  });

  it('should get one error missing field option set to xmllint', function () {
    const validator = new XMLXSDValidator('xmllint');
    let res = validator.validate(XML_INVALID_MISS_IN_MESSAGE, XSD);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1871);
    expect(res[0].str1).to.equal(undefined);
    expect(res[0].message).to.equal('Element \'from\': This element is not expected. Expected is ( to ).\n');
  });

  it('should get one error content not allowed option set to xmllint', function () {
    const validator = new XMLXSDValidator('xmllint');
    let res = validator.validate(XML_XSD2_INVALID_CONTENT, XSD_2);
    expect(res).to.be.an('Array');
    expect(res.length).to.equal(1);
    expect(res[0].code).to.equal(1841);
    expect(res[0].str1).to.equal(undefined);
    expect(res[0].message).to.equal('Element \'UpdateTimeStamp\':' +
    ' Character content is not allowed, because the content type is empty.\n');
  });

});
