const
  {
    getValueExample
  } = require('./knownTypes'),
  {
    ELEMENT_NOT_FOUND
  } = require('../constants/messageConstants'),
  {
    ERROR_ELEMENT_IDENTIFIER
  } = require('../constants/processConstants');

/**
 * Helper class to convert a node representing the message for a soap call
 * into a javascript object
 */
class BFSSoapParametersHelper {

  /**
   * Takes a node representing the message for a soap call
   * returns an object with default values depending on the object type
   * @param {*} root the root tnode for the message parameters
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @returns {object} with the structure and values
   */
  convertFromNodeToJson(root) {
    if (!root) {
      return {};
    }
    if (root.type === ERROR_ELEMENT_IDENTIFIER) {
      return {
        error: ELEMENT_NOT_FOUND + ' ' + root.name
      };
    }
    let traverseOrder = [],
      jObj = {},
      queue = [],
      refQueue = [],
      set = new Set();
    queue.push(root);
    refQueue.push(jObj);
    while (queue.length > 0) {
      let element = queue.shift(),
        jobjRef = refQueue.shift();
      traverseOrder.push(element);
      if (!set.has(element)) {
        if (element.isComplex) {
          jObj[element.name] = {};
          jobjRef = jObj[element.name];
          if (element.namespace) {
            jObj[element.name]['@_xmlns'] = element.namespace;
          }
        }
        else if (element.type === ERROR_ELEMENT_IDENTIFIER) {
          jObj[element.name] = 'The element or type could not be found';
        }
        else {
          jObj[element.name] = getValueExample(element);
        }
        set.add(element);
      }
      for (let childrenIndex = 0; childrenIndex < element.children.length; childrenIndex++) {
        let elementChild = element.children[childrenIndex];
        if (elementChild.isComplex) {
          this.assignPropertyValue(jobjRef, elementChild.name, {});
        }
        else if (elementChild.type === ERROR_ELEMENT_IDENTIFIER) {
          this.assignPropertyValue(jobjRef, elementChild.name, 'The element or type could not be found');
        }
        else {
          this.assignPropertyValue(jobjRef, elementChild.name, getValueExample(elementChild));
        }
        if (!set.has(elementChild)) {
          queue.push(elementChild);
          refQueue.push(jobjRef[elementChild.name]);
          set.add(elementChild);
        }
      }
    }
    while (traverseOrder.length > 0) {
      traverseOrder.shift();
    }
    return jObj;
  }


  /**
   * Assigns a value to a given property
   * @param {object} jObj the object to be modified
   * @param {string} property  the property name to assign
   * @param {*} value  the value to assign
   * @returns {*} nothing
   */
  assignPropertyValue(jObj, property, value) {
    jObj[property] = value;
  }

  /**
   * Determines the url of the named protocol depending on the protocol name
   * @param {string} protocol  the name of the protocol to look up for
   * @returns {string} url the url default the one for soap
   */
  getSOAPNamespaceFromProtocol(protocol) {
    var urls = {
      'soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'soap12': 'http://www.w3.org/2003/05/soap-envelope',
      'default': 'http://schemas.xmlsoap.org/soap/envelope/'
    };
    return (urls[protocol] || urls.default);
  }
}

module.exports = {
  BFSSoapParametersHelper
};
