const { expect } = require('chai');
const { getProtocolAndHost } = require('../../lib/utils/urlUtils');

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
