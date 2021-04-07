class SymmetricBindingInput {
  constructor() {
    this.EncryptionToken = '';
    this.SignatureToken = '';
    this.ProtectionToken = '';
    this.AlgorithmSuite = '';
    this.Layout = '';
    this.IncludeTimestamp = '';
    this.EncryptBeforeSigning = '';
    this.EncryptSignature = '';
    this.ProtectTokens = '';
    this.OnlySignEntireHeadersAndBody = '';
  }
}

module.exports = {
  SymmetricBindingInput: SymmetricBindingInput
};
