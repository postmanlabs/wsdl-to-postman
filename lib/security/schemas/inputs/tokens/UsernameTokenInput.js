class UsernameTokenInput {
  constructor() {
    this.includeToken = '';
    this.issuerInfo = '';
    this.claims = '';
    this.policyNamespace = '';
    this.passwordType = '';
    this.createdNonce = '';
    this.requireKeyOption = '';
    this.tokenVersion = '';
  }
}

module.exports = {
  UsernameTokenInput: UsernameTokenInput
};
