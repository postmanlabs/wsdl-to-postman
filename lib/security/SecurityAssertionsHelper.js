const {
  TOKEN_KINDS,
  POLICY_TAG,
  TOKEN_TYPES,
  SUPPORTED_SAML_VERSIONES,
  USERNAME_TOKEN_TAG,
  SAML_TOKEN_TAG,
  ATRIBUTE_INCLUDE_TOKEN,
  NO_PASSWORD_TAG,
  NORMAL_PASSWORD_TAG,
  TRANSPORT_BINDING_TAG,
  USERNAME_PASSWORD_TYPES,
  HASH_PASSWORD_TAG
} = require('./constants/SecurityConstants'),
  traverseUtility = require('traverse'), {
    UsernameTokenInput
  } = require('./schemas/inputs/tokens/UsernameTokenInput'), {
    TransportBindingInput
  } = require('./schemas/inputs/transport/TransportBindingInput'), {
    SAMLTokenInput
  } = require('./schemas/inputs/tokens/SAMLTokenInput');

function processUsernameToken(tokenInfo) {
  let includeToken = tokenInfo['@_sp:' + ATRIBUTE_INCLUDE_TOKEN],
    passwordType = NORMAL_PASSWORD_TAG;

  if (tokenInfo['wsp:' + POLICY_TAG]) {

    passwordType = USERNAME_PASSWORD_TYPES.find((passwordType) => {
      return tokenInfo['wsp:' + POLICY_TAG]['sp:' + passwordType] === '';
    });
  }

  let usernameToken = new UsernameTokenInput();
  usernameToken.passwordType = passwordType;
  usernameToken.includeToken = includeToken;
  return usernameToken;
}

function processSAMLToken(tokenInfo) {
  let includeToken = tokenInfo['@_sp:' + ATRIBUTE_INCLUDE_TOKEN],
    version = '';

  if (tokenInfo['wsp:' + POLICY_TAG]) {
    version = SUPPORTED_SAML_VERSIONES.find((supportedVersion) => {
      return tokenInfo['wsp:' + POLICY_TAG]['sp:' + supportedVersion] === '';
    });
  }
  let samlToken = new SAMLTokenInput();
  samlToken.tokenVersion = version;
  samlToken.includeToken = includeToken;

  return samlToken;
}

function processTransportBinding(tokenInfo, transportBindingAssertion) {
  let transportToken = '';
  let algorithmSuite = '';
  let layout = '';
  let includeTimestamp = false;

  traverseUtility(tokenInfo).forEach(function(property) {
    if (property != undefined) {
      if (this.key === 'sp:TransportToken') {
        transportToken = property['wsp:' + POLICY_TAG]['sp:' + 'HttpsToken'] === '' ? 'HttpsToken' : '';
      }
      if (this.key === 'sp:AlgorithmSuite') {
        algorithmSuite = property['wsp:' + POLICY_TAG]['sp:' + 'Basic256'] === '' ? 'Basic256' : '';
      }
      if (this.key === 'sp:Layout') {
        layout = property['wsp:' + POLICY_TAG]['sp:' + 'Strict'] === '' ? 'Strict' : layout;
        layout = property['wsp:' + POLICY_TAG]['sp:' + 'Lax'] === '' ? 'Lax' : layout;
      }
      if (this.key === 'sp:IncludeTimestamp') {
        includeTimestamp = true;
      }
    }
  });
  transportBindingAssertion.transportToken = transportToken;
  transportBindingAssertion.algorithmSuite = algorithmSuite;
  transportBindingAssertion.layout = layout;
  transportBindingAssertion.includeTimestamp = includeTimestamp;

  return transportBindingAssertion;
}



class SecurityAssertionsHelper {

  getSecurityAssertions(securityParsedNodes) {
    let securityAssertions = {};
    let securityIndex = 1;
    securityParsedNodes.forEach((securityParsedNode) => {
      securityAssertions[securityIndex + ''] = this.processSecurityNode(securityParsedNode);
    });
    return securityAssertions;
  }

  processSecurityNode(securityParsedNode) {
    let state = 0;
    let assertions = [];
    let transportBindingAssertion = new TransportBindingInput();
    traverseUtility(securityParsedNode).forEach(function(property) {
      if (property != undefined) {
        if (this.key === 'sp:SupportingTokens') {
          state = 1;
        }
        if (state === 1 && this.key === 'sp:' + USERNAME_TOKEN_TAG) {
          let tokenAssertion = processUsernameToken(property);
          assertions.push(tokenAssertion);
          state == 0;
        }
        if (state === 1 && this.key === 'sp:' + SAML_TOKEN_TAG) {
          let tokenAssertion = processSAMLToken(property);
          assertions.push(tokenAssertion);
          state == 0;
        }
        if (this.key === 'sp:' + TRANSPORT_BINDING_TAG) {
          state = 2;
          transportBindingAssertion = processTransportBinding(property, transportBindingAssertion);
          assertions.push(transportBindingAssertion);
          state == 0;
        }
      }
    });
    return assertions;
  }

}

module.exports = {
  SecurityAssertionsHelper
};
