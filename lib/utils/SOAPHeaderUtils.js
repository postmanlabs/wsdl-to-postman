const PASSWORD_TEXT = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText',
  PASSWORD_DIGEST = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest',
  OASIS_WS_SE = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
  WSSE_FILTER = 'wsse:',
  WSSE = 'wsse',
  WSU_URL = 'http://schemas.xmlsoap.org/ws/2003/06/utility',
  WSU_FILTER = 'wsu:',
  WSU = 'wsu',
  PARSER_ATRIBUTE_NAME_PLACE_HOLDER = '@_',
  {
    UsernameTokenOutput,
    Password,
    Nonce
  } = require('../security/schemas/outputs/tokens/UsernameTokenOutput'),
  {
    Timestamp
  } = require('../security/schemas/outputs/Timestamp'),
  {
    NORMAL_PASSWORD_TAG,
    USERNAME_TOKEN_TAG,
    PASSWORD_TAG,
    SECURITY_TAG,
    USERNAME_TAG
  } = require('../security/constants/SecurityConstants');


/**
 * Return the object for username token to parse
 * @param {UsernameTokenInput} usernameTokenInput token information
 * @param {object} jObj object to parse
 * @returns {object} jObj object to parse
 */
function processUsernameToken(usernameTokenInput, jObj) {

  let usernameTokenOutput = {},
    password = {},
    nonce = {};

  if (usernameTokenInput.passwordType === NORMAL_PASSWORD_TAG) {
    usernameTokenOutput[WSSE_FILTER + USERNAME_TAG] = 'place username here';
    password[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'Type'] = PASSWORD_TEXT;
    password['#text'] = 'place password here';
    nonce[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'EncodingType'] = '...#Base64Binary';
    nonce['#text'] = 'place nonce here';

    usernameTokenOutput[WSSE_FILTER + PASSWORD_TAG] = password;
    usernameTokenOutput[WSSE_FILTER + 'Nonce'] = nonce;
    usernameTokenOutput[WSU_FILTER + 'Created'] = '2007-03-28T18:42:03Z';

  }
  else if (usernameTokenInput.passwordType === 'NoPassword') {
    usernameTokenOutput[WSSE_FILTER + USERNAME_TAG] = 'place username here';
  }
  else if (usernameTokenInput.passwordType === 'HashPassword') {
    usernameTokenOutput[WSSE_FILTER + USERNAME_TAG] = 'place username here';
    password[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'Type'] = PASSWORD_DIGEST;
    password['#text'] = 'place hashed password here';
    nonce[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'EncodingType'] = '...#Base64Binary';
    nonce['#text'] = 'place nonce here';

    usernameTokenOutput[WSSE_FILTER + PASSWORD_TAG] = password;
    usernameTokenOutput[WSSE_FILTER + 'Nonce'] = nonce;
    usernameTokenOutput[WSU_FILTER + 'Created'] = '2007-03-28T18:42:03Z';
  }

  jObj[WSSE_FILTER + SECURITY_TAG][WSSE_FILTER + USERNAME_TOKEN_TAG] = usernameTokenOutput;
}

function processSSLTransport(transportBindingAssertion, jObj) {

  if (transportBindingAssertion.includeTimestamp) {
    let timestamp = {};
    timestamp[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'xmlns:' + WSU] = WSU_URL;
    timestamp[WSU_FILTER + 'Created'] = '2007-03-28T18:42:03Z';
    jObj[WSSE_FILTER + SECURITY_TAG][WSSE_FILTER + 'Timestamp'] = timestamp;

  }

}

let handlers = {
  'UsernameTokenInput': processUsernameToken,
  'TransportBindingInput': processSSLTransport
};

/**
 * Return the element handler
 * @param {object} element object to parse
 * @returns {Function} function to call
 */
function getHandler(element) {
  return handlers[element.constructor.name];
}

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
    jObj[WSSE_FILTER + SECURITY_TAG][PARSER_ATRIBUTE_NAME_PLACE_HOLDER + protocol + ':mustUnderstand'] = '1';
    jObj[WSSE_FILTER + SECURITY_TAG][PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'xmlns:' + WSSE] = OASIS_WS_SE;
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
