const traverseUtility = require('traverse'),
  {
    POLICY_TAG,
    SUPPORTED_SAML_VERSIONES,
    USERNAME_TOKEN_TAG,
    SAML_TOKEN_TAG,
    ATTRIBUTE_INCLUDE_TOKEN,
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
    LAYOUT_TAG,
    ALGORITHM_SUITE_TAG,
    INITIAL_STATE,
    BASIC_256_TAG,
    TRANSPORT_TOKEN_TAG
  } = require('./constants/SecurityConstants'),
  {
    UsernameTokenInput
  } = require('./schemas/inputs/tokens/UsernameTokenInput'),
  {
    TransportBindingInput
  } = require('./schemas/inputs/transport/TransportBindingInput'),
  {
    SAMLTokenInput
  } = require('./schemas/inputs/tokens/SAMLTokenInput'),

  /**
   * Process token info and returns a UsernameTokenInfo object
   * @param {object} tokenInfo Object that contains token info
   * @param {string} policyNs Security namespace
   * @returns {object} UsernameTokenInfo object
   */
  processUsernameTokenAssertion = (tokenInfo, policyNs) => {
    let includeToken = tokenInfo['@_sp:' + ATTRIBUTE_INCLUDE_TOKEN],
      passwordType = NORMAL_PASSWORD_TAG,
      usernameToken;

    if (tokenInfo[policyNs.prefixFilter + POLICY_TAG]) {
      passwordType = USERNAME_PASSWORD_TYPES.find((passwordType) => {
        return tokenInfo[policyNs.prefixFilter + POLICY_TAG]['sp:' + passwordType] === '';
      });
    }

    usernameToken = new UsernameTokenInput();
    usernameToken.passwordType = passwordType;
    usernameToken.includeToken = includeToken;
    return usernameToken;
  },

  /**
   * Process SamlToken and returns SAMLTokenInput object
   * @param {object} tokenInfo Token data from a Saml token
   * @param {string} state supporting token state
   * @param {string} policyNs Security namespace
   * @returns {object} a SAMLTokenInput object
   */
  processSAMLTokenAssertion = (tokenInfo, state, policyNs) => {
    let includeToken = tokenInfo['@_sp:' + ATTRIBUTE_INCLUDE_TOKEN],
      version = '',
      samlToken;

    if (tokenInfo[policyNs.prefixFilter + POLICY_TAG]) {
      version = SUPPORTED_SAML_VERSIONES.find((supportedVersion) => {
        return tokenInfo[policyNs.prefixFilter + POLICY_TAG]['sp:' + supportedVersion] === '';
      });
    }

    samlToken = new SAMLTokenInput();
    samlToken.tokenVersion = version;
    samlToken.includeToken = includeToken;
    samlToken.mode = SAML_TOKEN_MODES[state];

    return samlToken;
  },

  /**
   * Add token data to transportBindingInput object
   * @param {object} tokenInfo security data
   * @param {object} transportBindingAssertion TransportBindingInput object
   * @param {string} policyNs Security namespace
   * @returns {object} TransportBindingInput with token data
   */
  processTransportBindingAssertion = (tokenInfo, transportBindingAssertion, policyNs) => {
    let transportToken = '',
      algorithmSuite = '',
      layout = '',
      includeTimestamp = false,
      transporTokenpolicy = '';

    traverseUtility(tokenInfo).forEach(function TraverseFunction(property) {
      if (property !== undefined) {
        if (this.key === 'sp:' + TRANSPORT_TOKEN_TAG) {
          let transportTokenInObject = property?.[policyNs.prefixFilter + POLICY_TAG]?.['sp:' + HTTPS_TOKEN_TAG];
          transportToken = transportTokenInObject !== undefined ? HTTPS_TOKEN_TAG : '';
          if (transportToken === HTTPS_TOKEN_TAG) {
            transporTokenpolicy = HTTPS_TOKEN_POLICY_OPTIONS.find((policyOption) => {
              let policy =
                property[policyNs.prefixFilter +
                POLICY_TAG]?.['sp:' + HTTPS_TOKEN_TAG]?.[policyNs.prefixFilter + POLICY_TAG];
              if (policy) {
                return policy?.['sp:' + policyOption] === '';
              }
            });
          }
        }
        if (this.key === 'sp:' + ALGORITHM_SUITE_TAG) {
          algorithmSuite =
            property?.[policyNs.prefixFilter + POLICY_TAG]?.['sp:' + BASIC_256_TAG] === '' ? BASIC_256_TAG : '';
        }
        if (this.key === 'sp:' + LAYOUT_TAG) {
          layout = LAYOUT_OPTIONS.find((layoutOption) => {
            return property?.[policyNs.prefixFilter + POLICY_TAG]?.['sp:' + layoutOption] === '';
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
  };
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
      securityAssertions[`${securityIndex}`] = this.processSecurityNode(securityParsedNode, securityNS);
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
    traverseUtility(securityParsedNode).forEach(function TraverseFunction(property) {
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
          let tokenAssertion = processUsernameTokenAssertion(property, securityNS);
          assertions.push(tokenAssertion);
          state = INITIAL_STATE;
        }
        if ((state === SUPPORTING_TOKEN_STATE || state === SIGNED_SUPPORTING_TOKENS_STATE ||
          state === SIGNED_ENDORSINT_SUPPORTING_TOKEN_STATE) && this.key === 'sp:' + SAML_TOKEN_TAG) {
          let tokenAssertion = processSAMLTokenAssertion(property, state, securityNS);
          assertions.push(tokenAssertion);
          state = INITIAL_STATE;
        }
        if (this.key === 'sp:' + TRANSPORT_BINDING_TAG) {
          transportBindingAssertion = processTransportBindingAssertion(property, transportBindingAssertion, securityNS);
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
