class SAMLTokenInput {
  constructor() {
    this.includeToken = '';
    this.issuerInfo = '';
    this.claims = '';
    this.policyNamespace = '';
    this.passwordType = '';
    this.createdNonce = '';
    this.requireKeyOption = '';
    this.tokenVersion = '';
    this.mode = '';
  }
}

module.exports = {
  SAMLTokenInput: SAMLTokenInput
};
