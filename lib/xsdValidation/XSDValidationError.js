 
class XSDValidationError {
  constructor(code, message, str1 = undefined) {
    this.code = code; 
    this.message = message; 
    this.str1 = str1; 
  }
}

module.exports = {
  XSDValidationError
};
