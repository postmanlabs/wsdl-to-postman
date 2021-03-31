const {
    POLICY_TAG,
    SUPPORTED_SAML_VERSIONES,
    USERNAME_TOKEN_TAG,
    SAML_TOKEN_TAG,
    ATRIBUTE_INCLUDE_TOKEN,
    HTTPS_TOKEN_TAG,
    NORMAL_PASSWORD_TAG,
    SAML_TOKEN_MODES,
    TRANSPORT_BINDING_TAG,
    USERNAME_PASSWORD_TYPES,
    LAYOUT_OPTIONS,
    HTTPS_TOKEN_POLICY_OPTIONS,
    INCLUDE_TIMESTAMP_TAG,
    SUPPORTING_TOKENS_TAG,
    SIGNED_SUPPORTING_TOKENS_TAG,
    SIGNED_ENDORSINT_SUPPORTING_TOKEN_TAG,
    SUPPORTING_TOKEN_STATE,
    SIGNED_SUPPORTING_TOKENS_STATE,
    SIGNED_ENDORSINT_SUPPORTING_TOKEN_STATE,
    INITIAL_STATE
  } = require('./constants/SecurityConstants'),
  traverseUtility = require('traverse'),
  {
    UsernameTokenInput
  } = require('./schemas/inputs/tokens/UsernameTokenInput'),
  {
    TransportBindingInput
  } = require('./schemas/inputs/transport/TransportBindingInput'),
  {
    SAMLTokenInput
  } = require('./schemas/inputs/tokens/SAMLTokenInput'),
  {
    SymmetricBindingInput
  } = require('./schemas/inputs/transport/SymmetricBindingInput');

/**
 * Process token info and returns a UsernameTokenInfo object
 * @param {object} tokenInfo Object that contains token info
 * @returns {object} UsernameTokenInfo object
 */
function processUsernameToken(tokenInfo) {
  let includeToken = tokenInfo['@_sp:' + ATRIBUTE_INCLUDE_TOKEN],
    passwordType = NORMAL_PASSWORD_TAG,
    usernameToken;

  if (tokenInfo['wsp:' + POLICY_TAG]) {
    passwordType = USERNAME_PASSWORD_TYPES.find((passwordType) => {
      return tokenInfo['wsp:' + POLICY_TAG]['sp:' + passwordType] === '';
    });
  }

  usernameToken = new UsernameTokenInput();
  usernameToken.passwordType = passwordType;
  usernameToken.includeToken = includeToken;
  return usernameToken;
}

/**
 * Process SamlToken and returns SAMLTokenInput object
 * @param {object} tokenInfo Token data from a Saml token
 * @param {string} state supporting token state
 * @param {string} policy_ns Security namespace
 * @returns {object} a SAMLTokenInput object
 */
function processSAMLToken(tokenInfo, state, policy_ns) {
  let includeToken = tokenInfo['@_sp:' + ATRIBUTE_INCLUDE_TOKEN],
    version = '',
    samlToken;

  if (tokenInfo[policy_ns.prefixFilter + POLICY_TAG]) {
    version = SUPPORTED_SAML_VERSIONES.find((supportedVersion) => {
      return tokenInfo[policy_ns.prefixFilter + POLICY_TAG]['sp:' + supportedVersion] === '';
    });
  }

  samlToken = new SAMLTokenInput();
  samlToken.tokenVersion = version;
  samlToken.includeToken = includeToken;
  samlToken.mode = SAML_TOKEN_MODES[state];

  return samlToken;
}

/**
 * Add token data to transportBindingInput object
 * @param {object} tokenInfo security data
 * @param {object} transportBindingAssertion TransportBindingInput object
 * @returns {object} TransportBindingInput with token data
 */
function processTransportBinding(tokenInfo, transportBindingAssertion) {
  let transportToken = '',
    algorithmSuite = '',
    layout = '',
    includeTimestamp = false,
    transporTokenpolicy = '';

  traverseUtility(tokenInfo).forEach(function(property) {
    if (property !== undefined) {
      if (this.key === 'sp:TransportToken') {
        let transportTokenInObject = property['wsp:' + POLICY_TAG]['sp:' + HTTPS_TOKEN_TAG];
        transportToken = transportTokenInObject !== undefined ? HTTPS_TOKEN_TAG : '';
        if (transportToken === HTTPS_TOKEN_TAG) {
          transporTokenpolicy = HTTPS_TOKEN_POLICY_OPTIONS.find((policyOption) => {
            let policy = property['wsp:' + POLICY_TAG]['sp:' + HTTPS_TOKEN_TAG]['wsp:' + POLICY_TAG];
            if (policy) {
              return policy['sp:' + policyOption] === '';
            }
          });
        }
      }
      if (this.key === 'sp:AlgorithmSuite') {
        algorithmSuite = property['wsp:' + POLICY_TAG]['sp:' + 'Basic256'] === '' ? 'Basic256' : '';
      }
      if (this.key === 'sp:Layout') {
        layout = LAYOUT_OPTIONS.find((layoutOption) => {
          return property['wsp:' + POLICY_TAG]['sp:' + layoutOption] === '';
        });
      }
      if (this.key === 'sp:' + INCLUDE_TIMESTAMP_TAG) {
        includeTimestamp = true;
      }
    }
  });
  transportBindingAssertion.transportToken = transportToken;
  transportBindingAssertion.algorithmSuite = algorithmSuite;
  transportBindingAssertion.layout = layout;
  transportBindingAssertion.includeTimestamp = includeTimestamp;
  transportBindingAssertion.transporTokenpolicy = transporTokenpolicy;

  return transportBindingAssertion;
}

class SecurityAssertionsHelper {

  /**
   * Return securityAssertions array
   * @param {array} securityParsedNodes Array from security content in document
   * @param {string} securityNS Security namespace
   * @returns {object} security assertions from security content in document
   */
  getSecurityAssertions(securityParsedNodes, securityNS) {
    if (!securityParsedNodes) {
      return [];
    }
    let securityAssertions = {},
      securityIndex = 1;
    securityParsedNodes.forEach((securityParsedNode) => {
      securityAssertions[`${securityIndex}` + ''] = this.processSecurityNode(securityParsedNode, securityNS);
    });
    return securityAssertions;
  }

  /**
   * Return assertions array from a provided node
   * @param {array} securityParsedNode A security node in security content
   * @param {string} securityNS Security namespace
   * @returns {array} assertions array
   */
  processSecurityNode(securityParsedNode, securityNS) {
    let state = INITIAL_STATE,
      assertions = [],
      transportBindingAssertion = new TransportBindingInput();
    traverseUtility(securityParsedNode).forEach(function(property) {
      if (property !== undefined) {
        if (this.key === 'sp:' + SUPPORTING_TOKENS_TAG) {
          state = SUPPORTING_TOKEN_STATE;
        }
        if (this.key === 'sp:' + SIGNED_SUPPORTING_TOKENS_TAG) {
          state = SIGNED_SUPPORTING_TOKENS_STATE;
        }
        if (this.key === 'sp:' + SIGNED_ENDORSINT_SUPPORTING_TOKEN_TAG) {
          state = SIGNED_ENDORSINT_SUPPORTING_TOKEN_STATE;
        }
        if (state === SUPPORTING_TOKEN_STATE && this.key === 'sp:' + USERNAME_TOKEN_TAG) {
          let tokenAssertion = processUsernameToken(property);
          assertions.push(tokenAssertion);
          state = INITIAL_STATE;
        }
        if ((state === SUPPORTING_TOKEN_STATE || state === SIGNED_SUPPORTING_TOKENS_STATE ||
            state === SIGNED_ENDORSINT_SUPPORTING_TOKEN_STATE) && this.key === 'sp:' + SAML_TOKEN_TAG) {
          let tokenAssertion = processSAMLToken(property, state, securityNS);
          assertions.push(tokenAssertion);
          state = INITIAL_STATE;
        }
        if (this.key === 'sp:' + TRANSPORT_BINDING_TAG) {
          transportBindingAssertion = processTransportBinding(property, transportBindingAssertion);
          assertions.push(transportBindingAssertion);
        }
      }
    });
    return assertions;
  }

}

module.exports = {
  SecurityAssertionsHelper
};
