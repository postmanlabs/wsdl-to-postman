class UsernameTokenInput {
  constructor() {
    this.constructor_name = 'UsernameTokenInput';
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
