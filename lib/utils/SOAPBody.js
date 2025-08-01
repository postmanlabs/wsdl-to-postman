const
  {
    getValueExample
  } = require('./knownTypes'),
  { generatePrefixedElementName } = require('./WSDLElementUtils'),
  {
    ELEMENT_NOT_FOUND
  } = require('../constants/messageConstants'),
  {
    ERROR_ELEMENT_IDENTIFIER
  } = require('../constants/processConstants');

/**
 * Class to map some element nodes into xml messages
 * for soap calls
 */
class SOAPBody {

  constructor(xmlParser) {
    this.parserAttributePlaceHolder = xmlParser.attributePlaceHolder;
  }

  /**
   * Takes a soap message parent object and
   * returns an object with all the populated information
   * @param {WSDLElement} soapMessageParent the soap Message Parent
   * @param {string} protocol  the protocol to implement the message default 'soap'
   * @returns {object} with the structure and values
   */
  create(soapMessageParent) {
    if (!soapMessageParent) {
      return {};
    }
    if (soapMessageParent.type === ERROR_ELEMENT_IDENTIFIER) {
      return {
        error: ELEMENT_NOT_FOUND + ' ' + soapMessageParent.name
      };
    }
    let traverseOrder = [],
      messageJSObject = {},
      messageParametersQueue = [],
      createdJavascriptObjectQueue = [],
      visitedElements = new Set();
    messageParametersQueue.push(soapMessageParent);
    createdJavascriptObjectQueue.push(messageJSObject);
    while (messageParametersQueue.length > 0) {
      let currentMessageParameter = messageParametersQueue.shift(),
        createdJSOBjectReference = createdJavascriptObjectQueue.shift();
      traverseOrder.push(currentMessageParameter);
      if (!visitedElements.has(currentMessageParameter)) {
        createdJSOBjectReference = this.processMessageParent(currentMessageParameter, messageJSObject,
          createdJSOBjectReference, visitedElements);
      }
      this.processChildren(currentMessageParameter, createdJSOBjectReference, visitedElements, messageParametersQueue,
        createdJavascriptObjectQueue);
    }
    while (traverseOrder.length > 0) {
      traverseOrder.shift();
    }
    return messageJSObject;
  }

  /**
  * Initializes the parent in the soap messages
  * @param {object} currentMessageParameter the current message parameter
  * @param {object} messageJSObject the object assign the value property
  * @param {Set} visitedElements visited elements in message
  * @param {Array} messageParametersQueue the queue with the parameters
  * @param {Array} createdJavascriptObjectQueue the queue of the created object elemets
  * @returns {*} nothing
  */
  processChildren(currentMessageParameter, messageJSObject, visitedElements, messageParametersQueue,
    createdJavascriptObjectQueue) {

    if (typeof currentMessageParameter !== 'object' || typeof currentMessageParameter.children !== 'object') {
      return;
    }

    for (let childrenIndex = 0; childrenIndex < currentMessageParameter.children.length; childrenIndex++) {
      let elementChild = currentMessageParameter.children[childrenIndex],
        elementChildName = generatePrefixedElementName(elementChild);

      if (elementChild.isComplex) {
        this.assignPropertyValue(messageJSObject, elementChildName, {});
      }
      else if (elementChild.type === ERROR_ELEMENT_IDENTIFIER) {
        this.assignPropertyValue(messageJSObject, elementChildName, 'The element or type could not be found');
      }
      else {
        this.assignPropertyValue(messageJSObject, elementChildName, getValueExample(elementChild));
      }
      if (!visitedElements.has(elementChild)) {
        messageParametersQueue.push(elementChild);
        createdJavascriptObjectQueue.push(messageJSObject[elementChildName]);
        visitedElements.add(elementChild);
      }
    }
  }

  /**
   * Initializes the parent in the soap messages
   * @param {object} messageParent the first object in the message
   * @param {object} messageJSObject the object assign parent property
   * @param {string} createdJSOBjectReference  the actual property in the object to assign
   * @param {Set} visitedElements  visited elements in message
   * @returns {object} createdJSOBjectReference updated
   */
  processMessageParent(messageParent, messageJSObject, createdJSOBjectReference, visitedElements) {
    const messageParentName = generatePrefixedElementName(messageParent),
      tnsKey = `${this.parserAttributePlaceHolder}xmlns` +
        (messageParent.nsPrefix ? `:${messageParent.nsPrefix}` : '');

    if (messageParent.isComplex) {
      messageJSObject[messageParentName] = {};
      createdJSOBjectReference = messageJSObject[messageParentName];
      if (messageParent.namespace) {
        messageJSObject[messageParentName][tnsKey] = messageParent.namespace;
      }
    }
    else if (messageParent.type === ERROR_ELEMENT_IDENTIFIER) {
      messageJSObject[messageParent.name] = 'The element or type could not be found';
    }
    else if (messageParent.namespace && messageParent.namespace !== '') {
      messageJSObject[messageParentName] = {};
      messageJSObject[messageParentName]['#text'] = getValueExample(messageParent);
      messageJSObject[messageParentName][tnsKey] = messageParent.namespace;
    }
    else {
      messageJSObject[messageParentName] = getValueExample(messageParent);
    }

    visitedElements.add(messageParent);
    return createdJSOBjectReference;
  }

  /**
   * Assigns a value to a given property
   * @param {object} jObj the object to be modified
   * @param {string} property  the property name to assign
   * @param {*} value  the value to assign
   * @returns {*} nothing
   */
  assignPropertyValue(jObj, property, value) {
    let fixedAttributeName = '';
    if (property.startsWith('@')) {
      fixedAttributeName = property.replace('@', this.parserAttributePlaceHolder);
    }
    else {
      fixedAttributeName = property;
    }

    if (jObj && typeof jObj === 'object') {
      jObj[fixedAttributeName] = value;
    }
  }

}

module.exports = {
  SOAPBody
};
