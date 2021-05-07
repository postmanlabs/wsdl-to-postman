const
  {
    SOAPMessageObject
  } = require('./SOAPMessageObject');

/**
 * Class to map some element nodes into xml messages
 * for soap calls
 */
class SOAPBody {

  /**
   * Takes a node element and convert it to a javascript object representation
   * @param {object} element the object to convert into xml
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @returns {object} the object representation of the nodes
   */
  create(element) {
    const parametersUtils = new SOAPMessageObject();
    return parametersUtils.create(element);
  }

}

module.exports = {
  SOAPBody
};
