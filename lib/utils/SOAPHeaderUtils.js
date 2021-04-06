const PASSWORD_TEXT = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText',
  PASSWORD_DIGEST = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest',
  OASIS_WS_SE = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
  WSSE_FILTER = 'wsse:',
  SAML2_FILTER = 'saml2:',
  WSSE = 'wsse',
  WSU_URL = 'http://schemas.xmlsoap.org/ws/2003/06/utility',
  WSU_FILTER = 'wsu:',
  WSU = 'wsu',
  CREATED_TAG = 'Created',
  NONCE_TAG = 'Nonce',
  ISSUER_TAG = 'Issuer',
  NAMID_TAG = 'NameID',
  SUBJECT_CONFIRMATION_TAG = 'SubjectConfirmation',
  CONDITIONS_TAG = 'Conditions',
  SUBJECT_TAG = 'Subject',
  ASSERTION_TAG = 'Assertion',
  ATTRIBUTE_TYPE = 'Type',
  TIMESTAMP_TAG = 'Timestamp',
  ATTRIBUTE_ENCODING_TYPE = 'EncodingType',
  ATTRIBUTE_TEXT_VALUE = '#text',
  ATTRIBUTE_METHOD = 'Method',
  SAML2_FORMAT = 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
  SAML2_ISSUER = 'www.opensaml.org',
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER = '@_',
  ATTRIBUTE_ID = 'ID',
  ATTRIBUTE_ISSUE_INSTANT = 'IssueInstant',
  ATTRIBUTE_VERSION = 'Version',
  ATTRIBUTE_NOT_BEFORE = 'NotBefore',
  ATTRIBUTE_NOT_ON_OR_AFTER = 'NotOnOrAfter',
  ATTRIBUTE_FORMAT = 'Format',
  ATTRIBUTE_XMLNS = 'xmlns:',
  SAML_MODES = {
    'sender-vouches': 'urn:oasis:names:tc:SAML:2.0:cm:sender-vouches',
    'holder-of-key': 'urn:oasis:names:tc:SAML:2.0:cm:holder-of-key',
    'bearer': 'urn:oasis:names:tc:SAML:2.0:cm:bearer'
  },
  {
    NORMAL_PASSWORD_TAG,
    USERNAME_TOKEN_TAG,
    PASSWORD_TAG,
    SECURITY_TAG,
    USERNAME_TAG,
    HASH_PASSWORD_TAG,
    NO_PASSWORD_TAG
  } = require('../security/constants/SecurityConstants');


/**
 * Return the object for username token to parse
 * @param {UsernameTokenInput} usernameTokenInput token information
 * @param {object} jObj object to parse
 * @returns {object} jObj object to parse
 */
processUsernameToken = (usernameTokenInput, jObj) => {

  let usernameTokenOutput = {},
    password = {},
    nonce = {};

  if (usernameTokenInput.passwordType === NORMAL_PASSWORD_TAG) {
    usernameTokenOutput[WSSE_FILTER + USERNAME_TAG] = 'place username here';
    password[`${PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_TYPE}`] = PASSWORD_TEXT;
    password[ATTRIBUTE_TEXT_VALUE] = 'place password here';
    nonce[`${PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_ENCODING_TYPE}`] = '...#Base64Binary';
    nonce[ATTRIBUTE_TEXT_VALUE] = 'place nonce here';

    usernameTokenOutput[`${WSSE_FILTER + PASSWORD_TAG}`] = password;
    usernameTokenOutput[`${WSSE_FILTER + NONCE_TAG}`] = nonce;
    usernameTokenOutput[`${WSU_FILTER + CREATED_TAG}`] = '2007-03-28T18:42:03Z';

  }
  else if (usernameTokenInput.passwordType === NO_PASSWORD_TAG) {
    usernameTokenOutput[`${WSSE_FILTER + USERNAME_TAG}`] = 'place username here';
  }
  else if (usernameTokenInput.passwordType === HASH_PASSWORD_TAG) {
    usernameTokenOutput[`${WSSE_FILTER + USERNAME_TAG}`] = 'place username here';
    password[`${PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_TYPE}`] = PASSWORD_DIGEST;
    password[ATTRIBUTE_TEXT_VALUE] = 'place hashed password here';
    nonce[`${PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_ENCODING_TYPE}`] = '...#Base64Binary';
    nonce[ATTRIBUTE_TEXT_VALUE] = 'place nonce here';

    usernameTokenOutput[`${WSSE_FILTER + PASSWORD_TAG}`] = password;
    usernameTokenOutput[`${WSSE_FILTER + NONCE_TAG}`] = nonce;
    usernameTokenOutput[`${WSU_FILTER + CREATED_TAG}`] = '2007-03-28T18:42:03Z';
  }

  jObj[`${WSSE_FILTER + SECURITY_TAG}`][`${WSSE_FILTER + USERNAME_TOKEN_TAG}`] = usernameTokenOutput;
};

/**
 * Return the object for username token to parse
 * @param {SamlTokenInput} samlTokenInput token information
 * @param {object} jObj object to parse
 * @returns {object} jObj object to parse
 */
processSAMLToken = (samlTokenInput, jObj) => {

  let samlTokenOutput = {},
    conditions = {},
    subject = {},
    nameID = {},
    subjectConfirmation = {},
    mode;

  mode = SAML_MODES[samlTokenInput.mode];
  samlTokenOutput[`${PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_ID}`] = 'place id here';
  samlTokenOutput[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_ISSUE_INSTANT] = 'place issue instant';
  samlTokenOutput[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_VERSION] = '2.0';
  samlTokenOutput[SAML2_FILTER + ISSUER_TAG] = SAML2_ISSUER;

  conditions[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_NOT_BEFORE] = 'place not before';
  conditions[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_NOT_ON_OR_AFTER] = 'place not on or after';

  nameID[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_FORMAT] = SAML2_FORMAT;
  nameID[ATTRIBUTE_TEXT_VALUE] = 'joe,ou=people,ou=saml demo,o=example.com';

  subjectConfirmation[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_METHOD] = mode;
  subject[SAML2_FILTER + NAMID_TAG] = nameID;
  subject[SAML2_FILTER + SUBJECT_CONFIRMATION_TAG] = subjectConfirmation;
  samlTokenOutput[SAML2_FILTER + CONDITIONS_TAG] = conditions;
  samlTokenOutput[SAML2_FILTER + SUBJECT_TAG] = subject;

  jObj[WSSE_FILTER + SECURITY_TAG][SAML2_FILTER + ASSERTION_TAG] = samlTokenOutput;
};


/**
 * Return the object for ssl assertion to parse
 * @param {TransportBindingAssertion} transportBindingAssertion ssl information
 * @param {object} jObj object to parse
 * @returns {object} jObj object to parse
 */
processSSLTransport = (transportBindingAssertion, jObj) => {
  if (transportBindingAssertion.includeTimestamp) {
    let timestamp = {};
    timestamp[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_XMLNS + WSU] = WSU_URL;
    timestamp[`${WSU_FILTER + CREATED_TAG}`] = '2007-03-28T18:42:03Z';
    jObj[`${WSSE_FILTER + SECURITY_TAG}`][WSSE_FILTER + TIMESTAMP_TAG] = timestamp;
  }
};

let handlers = {
  'UsernameTokenInput': processUsernameToken,
  'TransportBindingInput': processSSLTransport,
  'SAMLTokenInput': processSAMLToken
};

/**
 * Return the element handler
 * @param {object} element object to parse
 * @returns {Function} function to call
 */
getHandler = (element) => {
  return handlers[element.constructor.name];
};

class SOAPHeaderUtils {

  /**
   * Return the element handler
   * @param {Array} headerInfo header security assertions
   * @param {protocol} protocol the protocol we are handling
   * @returns {Function} function to call
   */
  convertObjectHeaderToJObj(headerInfo, protocol) {
    if (!headerInfo || headerInfo.length === 0) {
      return;
    }
    let jObj = {};
    jObj[WSSE_FILTER + SECURITY_TAG] = {};
    jObj[WSSE_FILTER + SECURITY_TAG][`${PARSER_ATRIBUTE_NAME_PLACE_HOLDER + protocol + ':mustUnderstand'}`] = '1';
    jObj[WSSE_FILTER + SECURITY_TAG][`${PARSER_ATRIBUTE_NAME_PLACE_HOLDER + ATTRIBUTE_XMLNS + WSSE}`] = OASIS_WS_SE;
    headerInfo.forEach((element) => {
      let handler = getHandler(element);
      handler(element, jObj);
    });

    return jObj;
  }

}

module.exports = {
  SOAPHeaderUtils
};
