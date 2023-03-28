const { getDeepCopyOfObject } = require('./objectUtils'),
  _ = require('lodash');

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
      const resolved = this.resolveElement(element, {});
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

  generateElementKey (element) {
    let elementKey = element.namespace + ':';

    if (element.type === 'complex') {
      elementKey += element.name;
    }
    else {
      elementKey += element.type;
    }

    return elementKey;
  }

  resolveElement(element, visited) {
    let resolvedElement = element,
      elementKey = this.generateElementKey(element);

    if (visited[elementKey]) {
      return _.assign({}, element, { children: [] });
    }
    visited[elementKey] = true;

    if (element.type === 'error') {
      resolvedElement = this.resolveTypeFromReference(element);
      resolvedElement.superResolve = true;
    }

    if (resolvedElement.children !== '' && resolvedElement.children.length > 0) {
      resolvedElement.children = resolvedElement.children.map((child) => {
        return this.resolveElement(child, visited);
      });
    }

    // Mark element as not visited once resolved
    visited[elementKey] = false;

    return resolvedElement;
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
