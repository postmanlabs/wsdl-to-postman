class SymmetricBindingInput {
  EncryptionToken; // policy ... >
  SignatureToken; // policy
  ProtectionToken; // policy
  AlgorithmSuite
  Layout;
  IncludeTimestamp;
  EncryptBeforeSigning;
  EncryptSignature;
  ProtectTokens;
  OnlySignEntireHeadersAndBody;
}

module.exports = {
  SymmetricBindingInput: SymmetricBindingInput
};
