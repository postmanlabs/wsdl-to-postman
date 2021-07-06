const expect = require('chai').expect,
  {
    URLWithParamsHelper
  } = require('../../lib/utils/URLWithParamsHelper'),
  GeocodeAddressNonParsed = require('../data/elementsToURLEncoded/GeocodeAddressNonParsed'),
  GeocodeAddressNonParsedRes = 'streetAddress=string&city=string&state=string&zip=string&apiKey=' +
  'string&version=string&shouldCalculateCensus=string&censusYear=string&shouldReturnReferenceGeometry=' +
  'string&shouldNotStoreTransactionDetails=string';


describe('URLEncodedParamsHelper  constructor', function () {
  it('should get an object for the factory with empty input', function () {
    const helper = new URLWithParamsHelper();
    expect(helper).to.be.an('object');
  });
});

describe('URLEncodedParamsHelper convertInputToURLParams', function () {
  it('Should get a string for GeocodeAddressNonParsed', function () {
    const helper = new URLWithParamsHelper(),
      result = helper.convertInputToURLParams(GeocodeAddressNonParsed);
    expect(result).to.be.a('string');
    expect(result).to.equal(GeocodeAddressNonParsedRes);
  });

});
