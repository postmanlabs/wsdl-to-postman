const expect = require('chai').expect,
  {
    SOAPHeaderUtils
  } = require('../../lib/utils/SOAPHeaderUtils'),
  {
    UsernameTokenInput
  } = require('../../lib/security/schemas/inputs/tokens/UsernameTokenInput'),
  {
    TransportBindingInput
  } = require('../../lib/security/schemas/inputs/transport/TransportBindingInput'),
  {
    SAMLTokenInput
  } = require('../../lib/security/schemas/inputs/tokens/SAMLTokenInput');

describe('SOAPHeaderUtils  constructor', function() {
  it('should get an object for the factory with empty input', function() {
    const parametersUtils = new SOAPHeaderUtils();
    expect(parametersUtils).to.be.an('object');
  });
});

describe('SOAPHeaderUtils convertObjectHeaderToJObj', function() {
  it('should get an object correctly created username normal token', function() {
    const parametersUtils = new SOAPHeaderUtils(),
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'Normal';

    jsonObjectMessage = parametersUtils.convertObjectHeaderToJObj({
      1: [usernameTokenInput]
    }, 'soap');
    expect(jsonObjectMessage).to.be.an('object');

    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('wsse:UsernameToken');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Username');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Password');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Nonce');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken']['wsse:Password']['@_Type'])
      .to.equal('http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText');

  });

  it('should get an object correctly created username no password token', function() {
    const parametersUtils = new SOAPHeaderUtils(),
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'NoPassword';

    jsonObjectMessage = parametersUtils.convertObjectHeaderToJObj({
      1: [usernameTokenInput]
    }, 'soap');
    expect(jsonObjectMessage).to.be.an('object');

    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('wsse:UsernameToken');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Username');

  });

  it('should get an object correctly created hashed password', function() {
    const parametersUtils = new SOAPHeaderUtils(),
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'HashPassword';

    jsonObjectMessage = parametersUtils.convertObjectHeaderToJObj({
      1: [usernameTokenInput]
    }, 'soap');
    expect(jsonObjectMessage).to.be.an('object');

    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('wsse:UsernameToken');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Username');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken']['wsse:Password']['@_Type'])
      .to.equal('http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest');
  });

  it('should get an object correctly created normal password and ssl', function() {
    const parametersUtils = new SOAPHeaderUtils(),
      usernameTokenInput = new UsernameTokenInput(),
      transportBindingAssertion = new TransportBindingInput();

    transportBindingAssertion.transportToken = 'HttpsToken';
    transportBindingAssertion.algorithmSuite = 'Basic256';
    transportBindingAssertion.layout = 'Strict';
    transportBindingAssertion.includeTimestamp = true;


    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'Normal';

    jsonObjectMessage = parametersUtils.convertObjectHeaderToJObj({
        1: [usernameTokenInput, transportBindingAssertion]
      },
      'soap');
    expect(jsonObjectMessage).to.be.an('object');

    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('wsse:UsernameToken');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken'])
      .to.have.own.property('wsse:Username');
    expect(jsonObjectMessage['wsse:Security']['wsse:UsernameToken']['wsse:Password']['@_Type'])
      .to.equal('http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText');
    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('wsse:Timestamp');
  });

  it('should get an object correctly created sender vouches saml', function() {
    const parametersUtils = new SOAPHeaderUtils(),
      sAMLTokenInput = new SAMLTokenInput();
    sAMLTokenInput.mode = 'sender-vouches';
    jsonObjectMessage = parametersUtils.convertObjectHeaderToJObj({
        1: [sAMLTokenInput]
      },
      'soap');
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('saml2:Assertion');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_ID');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_IssueInstant');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_Version');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Issuer');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Conditions');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Subject');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion']['saml2:Subject']['saml2:SubjectConfirmation'])
      .to.have.own.property('@_Method').to.equal('urn:oasis:names:tc:SAML:2.0:cm:sender-vouches');
  });

  it('should get an object correctly created holder of key saml', function() {
    const parametersUtils = new SOAPHeaderUtils(),
      sAMLTokenInput = new SAMLTokenInput();
    sAMLTokenInput.mode = 'holder-of-key';
    jsonObjectMessage = parametersUtils.convertObjectHeaderToJObj({
        1: [sAMLTokenInput]
      },
      'soap');
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('saml2:Assertion');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_ID');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_IssueInstant');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_Version');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Issuer');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Conditions');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Subject');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion']['saml2:Subject']['saml2:SubjectConfirmation'])
      .to.have.own.property('@_Method').to.equal('urn:oasis:names:tc:SAML:2.0:cm:holder-of-key');
  });


  it('should get an object correctly created bearer saml', function() {
    const parametersUtils = new SOAPHeaderUtils(),
      sAMLTokenInput = new SAMLTokenInput();
    sAMLTokenInput.mode = 'bearer';
    jsonObjectMessage = parametersUtils.convertObjectHeaderToJObj({
        1: [sAMLTokenInput]
      },
      'soap');
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage['wsse:Security'])
      .to.have.own.property('saml2:Assertion');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_ID');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_IssueInstant');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('@_Version');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Issuer');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Conditions');
    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion'])
      .to.have.own.property('saml2:Subject');

    expect(jsonObjectMessage['wsse:Security']['saml2:Assertion']['saml2:Subject']['saml2:SubjectConfirmation'])
      .to.have.own.property('@_Method').to.equal('urn:oasis:names:tc:SAML:2.0:cm:bearer');
  });

});
