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
}

module.exports = {
  ElementResolver
};
