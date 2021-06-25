const expect = require('chai').expect,
  {
    getLastSegmentURL
  } = require('../../lib/utils/textUtils');

describe('Text Utils getLastSegmentURL', function() {
  it('should get Add when called with "http://tempuri.org/Add"', function() {
    const segment = getLastSegmentURL('http://tempuri.org/Add');
    expect(segment).to.equal('Add');
  });

  it('should get GetLastTradePrice when called with "http://example.com/GetLastTradePrice"', function() {
    const segment = getLastSegmentURL('http://example.com/GetLastTradePrice');
    expect(segment).to.equal('GetLastTradePrice');
  });

  it('should get getUserAuthentication when called with' +
   '"http://{{url}}/soap/services/getUserAuthentication.php#getUserAuthentication"', function() {
    const segment = getLastSegmentURL('http://{{url}}/soap/services/getUserAuthentication.php#getUserAuthentication');
    expect(segment).to.equal('getUserAuthentication');
  });


  it('should empty string when called with empty string', function() {
    const segment = getLastSegmentURL('');
    expect(segment).to.equal('');
  });

  it('should get empty string when called with undefined', function() {
    const segment = getLastSegmentURL(undefined);
    expect(segment).to.equal('');
  });

});
