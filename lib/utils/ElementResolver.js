/**
 * Class to map some element nodes into xml messages
 * for soap calls
 */
class ElementResolver {
  constructor(allElements) {
    this.simpleTypeElements = allElements.simpleTypeElements;
    this.complexTypeElements = allElements.complexTypeElements;
    this.elements = allElements.elements;
    this.reference = this.updateReference();
  }

  updateReference() {
    const reference = [
      ...this.simpleTypeElements,
      ...this.complexTypeElements,
      ...this.elements
    ];
    return reference;
  }

  resolveAll() {
    this.resolveElementsCollection(this.simpleTypeElements);
    this.resolveElementsCollection(this.complexTypeElements);
    this.resolveElementsCollection(this.elements);
    return {
      elements: this.elements,
      complexTypeElements: this.complexTypeElements,
      simpleTypeElements: this.simpleTypeElements
    };
  }

  resolveElementsCollection(collection) {
    collection.forEach((element, index) => {
      const resolved = this.resolveElement(element);
      collection[index] = resolved;
      this.reference = this.updateReference();
    });
  }

  resolveElement(element) {
    let resolved = element;
    if (element.type === 'error') {
      resolved = this.resolveTypeFromReference(element);
      resolved.superResolve = true;
    }
    if (resolved.children !== '' && resolved.children.length > 0) {
      resolved.children = resolved.children.map((child) => {
        return this.resolveElement(child);
      });
    }
    return resolved;
  }

  resolveTypeFromReference(element) {
    const foundElement = this.reference.find((item) => {
      return item.name === element.originalType;
    });
    let fixedElement;
    if (foundElement) {
      fixedElement = JSON.parse(JSON.stringify(foundElement));
      fixedElement.type = element.originalType;
      fixedElement.name = element.name;
    }
    else {
      return element;
    }
    return fixedElement;
  }

  // getElementByName(missedElement, reference) {
  //   const foundElement = reference.find((element) => {
  //     return element.name === missedElement.name;
  //   });
  //   return foundElement ? foundElement : '';
  // }

  // resolveElement(soapElement, referenceElements) {
  //   let traverseOrder = [],
  //     messageParametersQueue = [],
  //     visitedElements = new Set();
  //   messageParametersQueue.push(soapElement);
  //   while (messageParametersQueue.length > 0) {
  //     let currentMessageParameter = messageParametersQueue.shift();
  //     traverseOrder.push(currentMessageParameter);
  //     if (!visitedElements.has(currentMessageParameter)) {
  //       visitedElements.add(currentMessageParameter);
  //     }
  //     if (currentMessageParameter.type === ERROR_ELEMENT_IDENTIFIER) {
  //       // const resolvedElement = this.getElementByName(currentMessageParameter, referenceElements);
  //       // currentMessageParameter = resolvedElement;
  //       let a = 0;
  //     }
  //     this.resolveChildren(currentMessageParameter, referenceElements);
  //   }
  //   while (traverseOrder.length > 0) {
  //     traverseOrder.shift();
  //   }
  //   if (soapElement.type === ERROR_ELEMENT_IDENTIFIER) {
  //     // soapElement = this.getElementByName(soapElement);
  //     // this.replaceResolvedInCollection(soapElement);
  //     let here;
  //   }

  //   if (soapElement.children.length > 0) {
  //     soapElement.children.forEach((child) => {
  //       const resolvedChild = this.resolveElement(child, referenceElements);
  //       // this.replaceResolvedInCollection(resolvedChild);

  //     });
  //   }
  //   return soapElement;
  // }

  // /**
  // * Initializes the parent in the soap messages
  // * @param {object} currentMessageParameter the current message parameter
  // * @param {object} messageJSObject the object assign the value property
  // * @param {Set} visitedElements visited elements in message
  // * @param {Array} messageParametersQueue the queue with the parameters
  // * @param {Array} createdJavascriptObjectQueue the queue of the created object elemets
  // * @returns {*} nothing
  // */
  // resolveChildren(currentMessageParameter, referenceElements) {
  //   for (let childrenIndex = 0; childrenIndex < currentMessageParameter.children.length; childrenIndex++) {
  //     let elementChild = currentMessageParameter.children[childrenIndex];
  //     if (elementChild.type === ERROR_ELEMENT_IDENTIFIER) {
  //       // const resolvedElement = this.getElementByName(elementChild, referenceElements);
  //       let here;
  //     }
  //     // if (!visitedElements.has(elementChild)) {
  //     //   messageParametersQueue.push(elementChild);
  //     //   visitedElements.add(elementChild);
  //     // }
  //   }
  // }
}

module.exports = {
  ElementResolver
};
