const expect = require('chai').expect,
  {
    SecurityAssertionsHelper
  } = require('../../lib/security/SecurityAssertionsHelper'),
  {
    parseFromXmlToObject
  } = require('../../lib/WsdlParserCommon'),
  USERNAME_TOKEN = `<wsp:Policy><sp:SupportingTokens><wsp:Policy>
    <sp:UsernameToken 
      sp:IncludeToken="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient"
    </wsp:Policy>
    </sp:SupportingTokens>
    </wsp:Policy>`,
  USERNAME_TOKEN_NO_PASSWORD = `<wsp:Policy xmlns:wsp="..." xmlns:sp="...">  <sp:SupportingTokens>  <wsp:Policy>
    <sp:UsernameToken 
      sp:IncludeToken="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient">
    <wsp:Policy><sp:NoPassword/> </wsp:Policy></sp:UsernameToken> </wsp:Policy> </sp:SupportingTokens> </wsp:Policy>`,
  USERNAME_TOKEN_HASH_PASSWORD = `<wsp:Policy xmlns:wsp="..." xmlns:sp="...">  <sp:SupportingTokens>  <wsp:Policy>
    <sp:UsernameToken 
      sp:IncludeToken="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient">
    <wsp:Policy><sp:HashPassword/> </wsp:Policy></sp:UsernameToken> </wsp:Policy> </sp:SupportingTokens> </wsp:Policy>`,
  USERNAME_TOKEN_SSL = `<wsp:Policy xmlns:wsp="..." xmlns:sp="...">
    <sp:TransportBinding>
    <wsp:Policy>
    <sp:TransportToken>
    <wsp:Policy>
    <sp:HttpsToken/>
    </wsp:Policy>
    </sp:TransportToken>
    <sp:AlgorithmSuite>
    <wsp:Policy>
    <sp:Basic256/>
    </wsp:Policy>
    </sp:AlgorithmSuite>
    <sp:Layout>
    <wsp:Policy>
    <sp:Strict/>
    </wsp:Policy>
    </sp:Layout>
    <sp:IncludeTimestamp/>
    </wsp:Policy>
    </sp:TransportBinding>
    <sp:SupportingTokens>
    <wsp:Policy>
    <sp:UsernameToken/>
    </wsp:Policy>
    </sp:SupportingTokens>
    </wsp:Policy>`,
  SAML_TOKEN_SUPPORTING = `<wsp:Policy>
    <sp:SupportingTokens>
      <wsp:Policy> 
        <sp:SamlToken sp:IncludeToken=
        "http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient">
    <wsp:Policy>  
    <sp:WssSamlV11Token10/>  
    </wsp:Policy>
    </sp:SamlToken>
    </wsp:Policy> 
    </sp:SupportingTokens>
    </wsp:Policy>`,
  SAML_SSL_HTTPS_TOKEN_POLICY_REQUIRE_CLIENT_CERTIFICATE = `<wsp:Policy xmlns:wsp="..." xmlns:wsu="..." xmlns:sp="..." 
    wsu:Id="Wss10SamlSvV11Tran_policy">
     <sp:TransportBinding>
      <wsp:Policy>
       <sp:TransportToken>
       <wsp:Policy>
        <sp:HttpsToken>
         <wsp:Policy>
          <sp:RequireClientCertificate>
          </wsp:Policy>
           </sp:HttpsToken>
            </wsp:Policy>
            </sp:TransportToken>
             <sp:AlgorithmSuite>
             <wsp:Policy>
              <sp:Basic256 />
              </wsp:Policy>
              </sp:AlgorithmSuite>
              <sp:Layout>
              <wsp:Policy>
               <sp:Strict />
               </wsp:Policy>
               </sp:Layout>
               <sp:IncludeTimestamp />
               </wsp:Policy>
               </sp:TransportBinding>
               <sp:SignedSupportingTokens>
                <wsp:Policy>
          <sp:SamlToken 
            sp:IncludeToken=”http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient”>
            <wsp:Policy>
              <sp:WssSamlV11Token10/>
              </wsp:Policy>
              </sp:SamlToken>
              </wsp:Policy>
           </sp:SignedSupportingTokens>
        </wsp:Policy>`;

describe('SecurityAssertionsHelper getSecurityAssertions', function() {
  const securityNamespace = {
    prefixFilter: 'wsp:'
  };
  it('should get an object indicating username password normal mode is used', function() {
    const securityAssertionsHelper = new SecurityAssertionsHelper(),
      parsedXml = parseFromXmlToObject(USERNAME_TOKEN);
    securityAssertions = securityAssertionsHelper.getSecurityAssertions([parsedXml], securityNamespace);
    expect(securityAssertions).to.be.an('object');
    expect(securityAssertions[1]).to.be.an('array');
    expect(securityAssertions[1][0]).to.be.an('object');
    expect(securityAssertions[1][0].passwordType).to.equal('Normal');
  });

  it('should get an object indicating username no password mode is used', function() {
    const securityAssertionsHelper = new SecurityAssertionsHelper(),
      parsedXml = parseFromXmlToObject(USERNAME_TOKEN_NO_PASSWORD);
    securityAssertions = securityAssertionsHelper.getSecurityAssertions([parsedXml], securityNamespace);
    expect(securityAssertions).to.be.an('object');
    expect(securityAssertions[1]).to.be.an('array');
    expect(securityAssertions[1][0]).to.be.an('object');
    expect(securityAssertions[1][0].passwordType).to.equal('NoPassword');
    expect(securityAssertions[1][0].includeToken)
      .to.equal('http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient');
  });

  it('should get an object indicating username hash password mode is used', function() {
    const securityAssertionsHelper = new SecurityAssertionsHelper(),
      parsedXml = parseFromXmlToObject(USERNAME_TOKEN_HASH_PASSWORD);
    securityAssertions = securityAssertionsHelper.getSecurityAssertions([parsedXml], securityNamespace);
    expect(securityAssertions).to.be.an('object');
    expect(securityAssertions[1]).to.be.an('array');
    expect(securityAssertions[1][0]).to.be.an('object');
    expect(securityAssertions[1][0].passwordType).to.equal('HashPassword');
    expect(securityAssertions[1][0].includeToken)
      .to.equal('http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient');

  });

  it('should get an object indicating username and ssl password mode is used', function() {
    const securityAssertionsHelper = new SecurityAssertionsHelper(),
      parsedXml = parseFromXmlToObject(USERNAME_TOKEN_SSL);
    securityAssertions = securityAssertionsHelper.getSecurityAssertions([parsedXml], securityNamespace);
    expect(securityAssertions).to.be.an('object');
    expect(securityAssertions[1]).to.be.an('array');
    expect(securityAssertions[1][0]).to.be.an('object');
    expect(securityAssertions[1][0].transportToken).to.equal('HttpsToken');
    expect(securityAssertions[1][0].algorithmSuite).to.equal('Basic256');
    expect(securityAssertions[1][0].layout).to.equal('Strict');
    expect(securityAssertions[1][0].includeTimestamp).to.equal(true);
    expect(securityAssertions[1][1]).to.be.an('object');
    expect(securityAssertions[1][1].passwordType).to.equal('Normal');

  });

  it('should get an object indicating suporting saml token', function() {
    const securityAssertionsHelper = new SecurityAssertionsHelper(),
      parsedXml = parseFromXmlToObject(SAML_TOKEN_SUPPORTING);
    securityAssertions = securityAssertionsHelper.getSecurityAssertions([parsedXml], securityNamespace);
    expect(securityAssertions).to.be.an('object');
    expect(securityAssertions[1]).to.be.an('array');
    expect(securityAssertions[1][0]).to.be.an('object');
    expect(securityAssertions[1][0].tokenVersion).to.equal('WssSamlV11Token10');
    expect(securityAssertions[1][0].includeToken)
      .to.equal('http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient');
    expect(securityAssertions[1][0].mode).to.equal('bearer');

  });

  it('should get an object indicating username and ssl saml token', function() {
    const securityAssertionsHelper = new SecurityAssertionsHelper(),
      parsedXml = parseFromXmlToObject(SAML_SSL_HTTPS_TOKEN_POLICY_REQUIRE_CLIENT_CERTIFICATE);
    securityAssertions = securityAssertionsHelper.getSecurityAssertions([parsedXml], securityNamespace);
    expect(securityAssertions).to.be.an('object');
    expect(securityAssertions[1]).to.be.an('array');
    expect(securityAssertions[1][0]).to.be.an('object');
    expect(securityAssertions[1][0].transportToken).to.equal('HttpsToken');
    expect(securityAssertions[1][0].transporTokenpolicy).to.equal('RequireClientCertificate');
    expect(securityAssertions[1][0].algorithmSuite).to.equal('Basic256');
    expect(securityAssertions[1][0].layout).to.equal('Strict');
    expect(securityAssertions[1][0].includeTimestamp).to.equal(true);
    expect(securityAssertions[1][1].mode).to.equal('sender-vouches');
  });

  it('Should return an empty array when there are not any security content', function() {
    const securityAssertionsHelper = new SecurityAssertionsHelper(),
      parsedXml = undefined;
    securityAssertions = securityAssertionsHelper.getSecurityAssertions(parsedXml, securityNamespace);
    expect(securityAssertions).to.be.an('array').and.length(0);
  });
});
