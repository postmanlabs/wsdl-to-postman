class UsernameTokenOutput {
  Username;
  Password;
  Nonce;
  Created;
}

class Password {
  type;
  text;
}

class Nonce {
  EncodingType;
  text;
}

module.exports = {
  UsernameTokenOutput: UsernameTokenOutput,
  Password: Password,
  Nonce: Nonce
};
