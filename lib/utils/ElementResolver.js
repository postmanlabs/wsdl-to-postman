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
      const resolved = this.resolveElement(element, [], '');
      collection[index] = resolved;
      this.reference = this.updateReference();
    });
  }

  hasBeenResolved(visited, child, parentPath) {
    let childPath = parentPath + child.name;
    return visited.find((visitedElAndPath) => {
      let visitedEl = visitedElAndPath.element,
        visitedPath = visitedElAndPath.path,
        visitedKeyToSearch = '';

      if (visitedEl.type === 'complex') {
        visitedKeyToSearch = visitedEl.name;
      }
      else {
        visitedKeyToSearch = visitedEl.type;
      }
      return visitedKeyToSearch === child.type && visitedEl.namespace === child.namespace &&
        (typeof childPath === 'string' && childPath.includes(visitedPath));
    });
  }

  resolveElement(element, visited, parentPath) {
    let resolved = element,
      path = parentPath + element.name;
    if (element.isComplex) {
      visited.push({ element, path });
    }
    if (element.type === 'error') {
      resolved = this.resolveTypeFromReference(element);
      resolved.superResolve = true;
    }
    if (resolved.children !== '' && resolved.children.length > 0) {
      resolved.children = resolved.children.map((child) => {
        let hasVisited = this.hasBeenResolved(visited, child, path),
          clonedElement;
        if (hasVisited === undefined) {
          let resolved = this.resolveElement(child, visited, path);
          return resolved;
        }
        clonedElement = getDeepCopyOfObject(hasVisited.element);
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
