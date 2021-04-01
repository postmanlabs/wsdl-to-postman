const expect = require('chai').expect,
  {
    SOAPHeaderUtils
  } = require('../../lib/utils/SOAPHeaderUtils'),
  {
    UsernameTokenInput
  } = require('../../lib/security/schemas/inputs/tokens/UsernameTokenInput');

describe('SOAPHeaderUtils  constructor', function() {
  it('should get an object for the factory with empty input', function() {
    const parametersUtils = new SOAPHeaderUtils();
    expect(parametersUtils).to.be.an('object');
  });
});

describe('SOAPHeaderUtils convertObjectHeaderToJObj', function() {
  it('should get an object correctly created', function() {
    const parametersUtils = new SOAPHeaderUtils(),
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'normal';

    jsonObjectMessage = parametersUtils.convertObjectHeaderToJObj([usernameTokenInput], 'soap');
    expect(jsonObjectMessage).to.be.an('object');

    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('wsse:UsernameToken');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Username');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Password');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Nonce');

    // expect(jsonObjectMessage.TestCustomModel.inputModel.id)
    //   .to.equal(-2147483648);
    // expect(jsonObjectMessage.TestCustomModel.inputModel.name)
    //   .to.equal('this is a string');
    // expect(jsonObjectMessage.TestCustomModel.inputModel.email)
    //   .to.equal('this is a string');


  });

});
