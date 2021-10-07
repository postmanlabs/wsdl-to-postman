const expect = require('chai').expect,
  {
    Cache
  } = require('../../lib/utils/Cache');

describe('SOAPMessageHelper  cache', function () {
  it('should add to cache', function () {
    const parametersUtils = new Cache();
    parametersUtils.addToCache('key', { prop: 'value' });
    expect(parametersUtils.cache.key).to.not.be.undefined;
  });

  it('should get from cache', function () {
    const parametersUtils = new Cache();
    parametersUtils.addToCache('key', { prop: 'value' });
    expect(parametersUtils.cache.key).to.not.be.undefined;
    let found = parametersUtils.getFromCache('key');
    expect(found).to.not.be.undefined;
  });

  it('should return undefined from cache when is empty', function () {
    const parametersUtils = new Cache();
    let found = parametersUtils.getFromCache('key');
    expect(found).to.be.undefined;
  });

  it('should overwrite cache entry', function () {
    const parametersUtils = new Cache();
    parametersUtils.addToCache('key', { prop: 'value' });
    expect(parametersUtils.cache.key).to.not.be.undefined;

    parametersUtils.addOverWriteCache('key', { prop: 'newValue' });
    let found = parametersUtils.getFromCache('key');
    expect(found.prop).to.equal('newValue');
  });

  it('should not overwrite cache entry when call add', function () {
    const parametersUtils = new Cache();
    parametersUtils.addToCache('key', { prop: 'value' });
    expect(parametersUtils.cache.key).to.not.be.undefined;

    parametersUtils.addToCache('key', { prop: 'newValue' });
    let found = parametersUtils.getFromCache('key');
    expect(found.prop).to.equal('value');
  });
});

