const expect = require('chai').expect,
  {
    getLastSegmentURL,
    stringIsAValidUrl,
    stringIsValidURLFilePath
  } = require('../../lib/utils/textUtils');

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


