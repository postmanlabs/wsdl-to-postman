const { expect } = require('chai');
const { getProtocolAndHost, getAllButProtocolAndHost, decodeFromXML } = require('../../lib/utils/urlUtils');

describe('getProtocolAndHost method', function() {
  it('should return the correct host and protocol from a url', function() {
    const url = 'http://supertest.test',
      {
        host,
        protocol
      } = getProtocolAndHost(url);
    expect(host).to.be.equal('supertest.test');
    expect(protocol).to.be.equal('http://');
  });

  it('should return the correct host and protocol from a url with subroutes', function() {
    const url = 'http://supertest.test/subroute/test',
      {
        host,
        protocol
      } = getProtocolAndHost(url);
    expect(host).to.be.equal('supertest.test');
    expect(protocol).to.be.equal('http://');
  });

  it('should return the correct host and empty protocol from a url without protocol', function() {
    const url = 'supertest.test/subroute',
      {
        host,
        protocol
      } = getProtocolAndHost(url);
    expect(host).to.be.equal('supertest.test');
    expect(protocol).to.be.equal('');
  });
});


describe('getAllButProtocolAndHost method', function() {
  it('should return all the url without protocol and host with query param', function() {
    const url = 'https://geoservices/Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed?number=string',
      urlToCheck = getAllButProtocolAndHost(url);
    expect(urlToCheck).to.be.equal('Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed?number=string');
  });

  it('should return all the url without protocol and host with query param no host', function() {
    const url = 'geoservices/Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed?number=string',
      urlToCheck = getAllButProtocolAndHost(url);
    expect(urlToCheck).to.be.equal('Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed?number=string');
  });

  it('should return all the url without protocol and host without query params', function() {
    const url = 'https://geoservices/Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed',
      urlToCheck = getAllButProtocolAndHost(url);
    expect(urlToCheck).to.be.equal('Services/Geocode/WebService/GeocoderService_V04_01.asmx/' +
    'GeocodeAddressParsed');
  });
});


describe('decodeFromXML method', function () {
  it('should return http://localhost:3000/projects?param=value&param1=&param2=TIBCO\'">< for entry ' +
    'http://localhost:3000/projects?param=value&amp;param1=&amp;param2=TIBCO&apos;&quot;&gt;&lt;', function () {
    const result = decodeFromXML('http://localhost:3000/projects?' +
    'param=value&amp;param1=&amp;param2=TIBCO&apos;&quot;&gt;&lt;');
    expect(result).to.equal('http://localhost:3000/projects?param=value&param1=&param2=TIBCO\'"><');
  });

  it('should return empty string when input is undefined', function () {
    const result = decodeFromXML();
    expect(result).to.equal('');
  });

  it('should return empty string when input is null', function () {
    const result = decodeFromXML(null);
    expect(result).to.equal('');
  });

  it('should return empty string when input is empty string', function () {
    const result = decodeFromXML('');
    expect(result).to.equal('');
  });
});
