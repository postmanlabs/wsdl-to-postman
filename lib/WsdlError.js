/**
 * constructor wsdlError
 * @constructor
 * @param {*} message errorMessage
 */
 class WsdlError {
  constructor(message, data) {
    this.message = message || '';
    this.data = data || {};
  }
}

WsdlError.prototype = Error();

module.exports = WsdlError;
