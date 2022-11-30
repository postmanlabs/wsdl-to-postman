const {
  getDeepCopyOfObject
} = require('./objectUtils');

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
      const resolved = this.resolveElement(element, []);
      collection[index] = resolved;
      this.reference = this.updateReference();
    });
  }

  hasBeenResolved(visited, child) {
    return visited.find((visitedEl) => {
      let visitedKeyToSearch = '';

      if (visitedEl.type === 'complex') {
        visitedKeyToSearch = visitedEl.name;
      }
      else {
        visitedKeyToSearch = visitedEl.type;
      }
      return visitedKeyToSearch === child.type && visitedEl.namespace === child.namespace &&
        visitedEl.isElement === true;
    });
  }

  resolveElement(element, visited) {
    let resolved = element;
    if (element.isComplex) {
      visited.push(element);
    }
    if (element.type === 'error') {
      resolved = this.resolveTypeFromReference(element);
      resolved.superResolve = true;
    }
    if (resolved.children !== '' && resolved.children.length > 0) {
      resolved.children = resolved.children.map((child) => {
        let hasVisited = this.hasBeenResolved(visited, child),
          clonedElement;
        if (hasVisited === undefined) {
          let resolved = this.resolveElement(child, visited);
          return resolved;
        }
        clonedElement = getDeepCopyOfObject(hasVisited);
        clonedElement.children = [];
        return clonedElement;
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
      fixedElement = getDeepCopyOfObject(foundElement);
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
