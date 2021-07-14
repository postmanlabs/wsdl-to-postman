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


describe('URLEncodedParamsHelper getKeyValuesFromURLParams', function () {
  const url = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed?number=string&numberFractional=string&preDirectional=string',
    url2 = 'https://geoservices.tamu.edu/Services/GeocoderService_V04_01.asmx/' +
      'GeocodeAddressParsed?number=string&numberFractional=string&preDirectional=string&storeTransactionDetails=string',
    url3 = 'https://geoservices.tamu.edu/Services/GeocoderService_V04_01.asmx/' +
      'GeocodeAddressParsed';

  it('Should get an array of 3 for url', function () {
    const helper = new URLWithParamsHelper(),
      result = helper.getKeyValuesFromURLParams(url);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(3);
    expect(result[0].key).to.equal('number');
    expect(result[0].value).to.equal('string');
    expect(result[1].key).to.equal('numberFractional');
    expect(result[1].value).to.equal('string');
    expect(result[2].key).to.equal('preDirectional');
    expect(result[2].value).to.equal('string');
  });

  it('Should get an array of 4 for url2', function () {
    const helper = new URLWithParamsHelper(),
      result = helper.getKeyValuesFromURLParams(url2);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(4);
    expect(result[0].key).to.equal('number');
    expect(result[0].value).to.equal('string');
    expect(result[1].key).to.equal('numberFractional');
    expect(result[1].value).to.equal('string');
    expect(result[2].key).to.equal('preDirectional');
    expect(result[2].value).to.equal('string');
    expect(result[3].key).to.equal('storeTransactionDetails');
    expect(result[3].value).to.equal('string');
  });

  it('Should get an empty array for url3', function () {
    const helper = new URLWithParamsHelper(),
      result = helper.getKeyValuesFromURLParams(url3);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });
  it('Should get an empty array for empty string', function () {
    const helper = new URLWithParamsHelper(),
      result = helper.getKeyValuesFromURLParams('');
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });
});
