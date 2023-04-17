const expect = require('chai').expect,
  {
    getHttpVerb,
    GET_METHOD,
    POST_METHOD
  } = require('../../lib/utils/httpUtils');

describe('Http Utils getHttpVerb', function() {
  it('should get POST when called with "post"', function() {
    const method = getHttpVerb('post');
    expect(method).to.equal(POST_METHOD);
  });

  it('should get GET when called with ""', function() {
    const method = getHttpVerb('');
    expect(method).to.equal(POST_METHOD);
  });

  it('should get GET when called with "get"', function() {
    const method = getHttpVerb('get');
    expect(method).to.equal(GET_METHOD);
  });

  it('should get POST when called with "pOsT"', function() {
    const method = getHttpVerb('pOsT');
    expect(method).to.equal(POST_METHOD);
  });

  it('should get corect verb when called with non-string value', function() {
    const method = getHttpVerb(null);
    expect(method).to.equal(POST_METHOD);
  });
});
