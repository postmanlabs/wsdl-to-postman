const PASSWORD_TEXT = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText',
  {
    UsernameTokenOutput,
    Password,
    Nonce
  } = require('../security/schemas/outputs/tokens/UsernameTokenOutput');


/**
 * Return the object for username token to parse
 * @param {UsernameTokenInput} usernameTokenInput token information
 * @param {object} jObj object to parse
 * @returns {object} jObj object to parse
 */
function processUsernameToken(usernameTokenInput, jObj) {

  let usernameTokenOutput = new UsernameTokenOutput(),
    password = new Password(),
    nonce = new Nonce();

  if (usernameTokenInput.passwordType === 'Normal') {
    usernameTokenOutput['wsse:Username'] = 'place username here';
    password['@_Type'] = PASSWORD_TEXT;
    password['#text'] = 'place password here';
    nonce['@_EncodingType'] = '...#Base64Binary';
    nonce['#text'] = 'place nonce here';

    usernameTokenOutput['wsse:Password'] = password;
    usernameTokenOutput['wsse:Nonce'] = nonce;
    usernameTokenOutput['wsu:Created'] = '2007-03-28T18:42:03Z';

  }
  else if (usernameTokenInput.passwordType === 'NoPassword') {
    usernameTokenOutput['wsse:Username'] = 'place username here';
  }

  jObj['wsse:Security']['wsse:UsernameToken'] = usernameTokenOutput;
}

let handlers = {
  'UsernameTokenInput': processUsernameToken
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
    jObj['wsse:Security'] = {};
    jObj['wsse:Security']['@_' + protocol + ':mustUnderstand'] = '1';
    jObj['wsse:Security']['@_xmlns:wsse'] = '...';


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
