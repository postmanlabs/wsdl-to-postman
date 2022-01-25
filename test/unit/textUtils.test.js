const expect = require('chai').expect,
  {
    getLastSegmentURL,
    stringIsAValidUrl,
    stringIsValidURLFilePath,
    hash,
    fixComments
  } = require('../../lib/utils/textUtils'),
  crypto = require('crypto');

describe('Text Utils getLastSegmentURL', function () {
  it('should get Add when called with "http://tempuri.org/Add"', function () {
    const segment = getLastSegmentURL('http://tempuri.org/Add');
    expect(segment).to.equal('Add');
  });

  it('should get GetLastTradePrice when called with "http://example.com/GetLastTradePrice"', function () {
    const segment = getLastSegmentURL('http://example.com/GetLastTradePrice');
    expect(segment).to.equal('GetLastTradePrice');
  });

  it('should get getUserAuthentication when called with' +
    '"http://{{url}}/soap/services/getUserAuthentication.php#getUserAuthentication"', function () {
    const segment = getLastSegmentURL('http://{{url}}/soap/services/getUserAuthentication.php#getUserAuthentication');
    expect(segment).to.equal('getUserAuthentication');
  });


  it('should empty string when called with empty string', function () {
    const segment = getLastSegmentURL('');
    expect(segment).to.equal('');
  });

  it('should get empty string when called with undefined', function () {
    const segment = getLastSegmentURL(undefined);
    expect(segment).to.equal('');
  });

});

describe('Text Utils stringIsAValidUrl', function () {

  it('should get true when called with "http://tempuri.org/Add"', function () {
    const result = stringIsAValidUrl('http://tempuri.org/Add');
    expect(result).to.equal(true);
  });

  it('should get false when called with abc://www.example.com:777/a/b and support only http and https', function () {
    const result = stringIsAValidUrl('abc://www.example.com:777/a/b', ['http', 'https']);
    expect(result).to.equal(false);
  });

  it('should get true when called with abc://www.example.com:777/a/b', function () {
    const result = stringIsAValidUrl('abc://www.example.com:777/a/b');
    expect(result).to.equal(true);
  });

  it('should get false when called with ../../test/data/multipleSchemaValidationLINT/chapter04ord2.xsd', function () {
    const result = stringIsAValidUrl('../../test/data/multipleSchemaValidationLINT/chapter04ord2.xsd');
    expect(result).to.equal(false);
  });

  it('should get false when called with Types.xsd', function () {
    const result = stringIsAValidUrl('Types.xsd');
    expect(result).to.equal(false);
  });

});


describe('Text Utils stringIsValidURLFilePath', function () {

  it('should get true when called with "http://tempuri.org/Add/some.wsdl"', function () {
    const result = stringIsValidURLFilePath('http://tempuri.org/Add/some.wsdl', ['wsdl']);
    expect(result).to.equal(true);
  });

  it('should get false when called with "http://tempuri.org/Add/some.wsdl" and only xsd files', function () {
    const result = stringIsValidURLFilePath('http://tempuri.org/Add/some.wsdl', ['xsd']);
    expect(result).to.equal(false);
  });

  it('should get true when called with "http://tempuri.org/Add/some.xsd"', function () {
    const result = stringIsValidURLFilePath('http://tempuri.org/Add/some.xsd', ['xsd']);
    expect(result).to.equal(true);
  });

  it('should get false when called with ../../test/data/multipleSchemaValidationLINT/chapter04ord2.xsd', function () {
    const result = stringIsValidURLFilePath('../../test/data/multipleSchemaValidationLINT/chapter04ord2.xsd');
    expect(result).to.equal(false);
  });

  it('should get false when called with Types.xsd', function () {
    const result = stringIsValidURLFilePath('Types.xsd');
    expect(result).to.equal(false);
  });

  it('should get false when called with "http://tempuri.org/Add" ', function () {
    const result = stringIsValidURLFilePath('http://tempuri.org/Add');
    expect(result).to.equal(false);
  });

});

describe('Text Utils getAbsoultePathFromRelativeAndBase', function () {

  it('should https://raw.com/postmanlabs/wsdl-to-postman/Types.xsd when relative has no folder structure', function () {
    const result = getAbsoultePathFromRelativeAndBase('https://raw.com/postmanlabs/wsdl-to-postman/',
      'Types.xsd');
    expect(result).to.equal('https://raw.com/postmanlabs/wsdl-to-postman/Types.xsd');
  });

  it('should https://raw.com/postmanlabs/wsdl-to-postman/schemas/Types.xsd when relative has folder structure',
    function () {
      const result = getAbsoultePathFromRelativeAndBase('https://raw.com/postmanlabs/wsdl-to-postman/wsdl/',
        './../schemas/Types.xsd');
      expect(result).to.equal('https://raw.com/postmanlabs/wsdl-to-postman/schemas/Types.xsd');
    });

  it('should https://raw.com/postmanlabs/wsdl-to-postman/schemas/Types.xsd when relative has folder structure' +
  ' and base does not end with "/"',
  function () {
    const result = getAbsoultePathFromRelativeAndBase('https://raw.com/postmanlabs/wsdl-to-postman/wsdl',
      './../schemas/Types.xsd');
    expect(result).to.equal('https://raw.com/postmanlabs/wsdl-to-postman/schemas/Types.xsd');
  });

  it('should https://raw.com/postmanlabs/wsdl-to-postman/wsdl/Types.xsd when relative has folder structure Types.xsd',
    function () {
      const result = getAbsoultePathFromRelativeAndBase('https://raw.com/postmanlabs/wsdl-to-postman/wsdl/',
        'Types.xsd');
      expect(result).to.equal('https://raw.com/postmanlabs/wsdl-to-postman/wsdl/Types.xsd');
    });

  it('should https://raw.com/postmanlabs/wsdl-to-postman/wsdl/Types.xsd when relative has' +
    ' folder structure ./Types.xsd',
  function () {
    const result = getAbsoultePathFromRelativeAndBase('https://raw.com/postmanlabs/wsdl-to-postman/wsdl/',
      './Types.xsd');
    expect(result).to.equal('https://raw.com/postmanlabs/wsdl-to-postman/wsdl/Types.xsd');
  });

});

describe('Text Utils hash', function () {
  it('should get a correct hash in ', function () {
    expect(hash('textToHash', 'sha1',
      'base64')).to.equal(crypto.createHash('sha1').update('textToHash').digest('base64'));
    const result = stringIsAValidUrl('http://tempuri.org/Add');
    expect(result).to.equal(true);
  });
});

describe('Text Utils fixComments', function () {
  let xmlData = `<xsd:element name="AccountHolderDetails">
  <xsd:complexType>
    <!-->> ROOT DICTIONARY TYPES <<-->
      <xsd:sequence>
          <!-->> ISO DICTIONARY TYPES <<-->
          <xsd:element minOccurs="0" name="address" nillable="true" type="Address" />
      </xsd:sequence>
  </xsd:complexType>
</xsd:element>`;

  it('should get a correct parsed XML data (without comments polluted nodes)', function () {
    expect(fixComments(xmlData)).to.eql(`<xsd:element name="AccountHolderDetails">
  <xsd:complexType>
    <!-- >> ROOT DICTIONARY TYPES << -->
      <xsd:sequence>
          <!-- >> ISO DICTIONARY TYPES << -->
          <xsd:element minOccurs="0" name="address" nillable="true" type="Address" />
      </xsd:sequence>
  </xsd:complexType>
</xsd:element>`);
  });
});
