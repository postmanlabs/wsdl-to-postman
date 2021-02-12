/**
 * constructor inputError
 * @constructor
 * @param {*} message errorMessage
 */
class InputError {
  constructor(message, data) {
    this.message = message || '';
    this.data = data || {};
  }
}

InputError.prototype = Error();

module.exports = InputError;
