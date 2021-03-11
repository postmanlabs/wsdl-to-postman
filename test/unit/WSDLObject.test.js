const expect = require('chai').expect,
  {
    WsdlObject,
    Log
  } = require('../../lib/WsdlObject');


describe('WSDLObject constructor', function() {
  it('should get a WSDLObject', function() {
    const parser = new WsdlObject();
    expect(parser).to.be.an('object');
    expect(parser.log).to.be.an('object');
  });

  it('should get a Log object', function() {
    const log = new Log();
    expect(log).to.be.an('object');
    expect(log.errors).to.equal('');
  });

  it('should get the "error" string after loging ', function() {
    const log = new Log();
    log.logError('error');

    expect(log.errors).to.equal('\nerror');
  });

});
