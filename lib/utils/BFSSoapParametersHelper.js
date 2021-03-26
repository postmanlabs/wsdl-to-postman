const traverseUtility = require('traverse'),
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
  convertFromNodeToJson(root, protocol = 'soap') {
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
      set = new Set();
    queue.push(root);
    while (queue.length > 0) {
      let element = queue.shift();
      traverseOrder.push(element);
      if (!set.has(element)) {
        if (element.isComplex) {
          jObj[element.name] = {};
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
          this.assignPropertyValue(jObj, element.name, elementChild.name, {});
        }
        else if (elementChild.type === ERROR_ELEMENT_IDENTIFIER) {
          this.assignPropertyValue(jObj, element.name, elementChild.name, 'The element or type could not be found');
        }
        else {
          this.assignPropertyValue(jObj, element.name, elementChild.name, getValueExample(elementChild));
        }
        if (!set.has(elementChild)) {
          queue.push(elementChild);
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
   * Assigns a value to a given property searching the parent
   * traverses an object search the father and assign the given value
   * to the property
   * returns an object with default values depending on the object type
   * @param {object} jObj the object to be modified
   * @param {string} parent  the node in the object where the property is going to be assigned
   * @param {string} property  the property name to assign
   * @param {*} value  the value to assign
   * @returns {*} nothing
   */
  assignPropertyValue(jObj, parent, property, value) {
    let parentFoound = null,
      assigned = false;
    traverseUtility(jObj).forEach(function(x) {
      if (typeof x === 'object') {
        parentFoound = Object.keys(x)
          .filter(
            (key) => {
              return key === parent;
            }
          );
      }
      if (!assigned && parentFoound.length === 1) {
        x[parent][property] = value;
        assigned = true;
      }
    });
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
