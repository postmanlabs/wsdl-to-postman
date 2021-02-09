/**
 * constructor wsdlError
 * @constructor
 * @param {*} message errorMessage
 */
class wsdlError {
  constructor(message, data) {
    this.message = message || '';
    this.data = data || {};
  }
}

wsdlError.prototype = Error();

module.exports = wsdlError;
