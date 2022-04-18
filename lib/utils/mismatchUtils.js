const { XMLXSDValidator } = require('../xsdValidation/XMLXSDValidator');

/**
 * Gets a validator library instance
 * @returns {object} an instance of validator Library
 */
function useValidator() {
  const lib = new XMLXSDValidator('libxmljs2').getValidatorLibrary();
  return lib;
}

/**
 * get the element that matches with the provided next sibling's xpath and that is in
 * expected body but not in request body and returns it
 * @param {string} currentBody Body generated from request message without namespaces neither envelopes
 * @param {string} cleanBody Body generated from schema without namespaces neither envelopes
 * @param {string} siblingXpath xpath corresponding to the element's next sibling
 * @returns {object} xml Element that corresponds with the provided xpath
 */
function getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, siblingXpath) {
  const currentElements = useValidator().findByXpathInXmlString(currentBody, siblingXpath),
    expectedElements = useValidator().findByXpathInXmlString(cleanBody, siblingXpath),
    currentPrevElement = currentElements.map((element) => {
      return element.prevElement();
    }),
    expectedPrevElement = expectedElements.map((element) => {
      return element.prevElement();
    }),
    result = expectedPrevElement.filter((element) => {
      return !currentPrevElement.includes(element);
    });
  return result[0];
}

/**
 * Get the element's position between its siblings
 * @param {object} node The element we want to know the position between its siblings
 * @returns {number} The position between its siblings
 */
function getElementPosition(node) {
  const parentChildren = useValidator().getChildrenElements(node.parent()),
    positionData = parentChildren.map((child, index) => {
      if (child.name() === node.name()) {
        return {
          index,
          elementString: child.toString()
        };
      }
    }).find((data) => {
      return data;
    });
  return positionData;
}

/**
 * Add a provided element in a stringifyed node and returns the string representation
 * @param {object} node The element we want to add in xml node string
 * @param {string} nodeString the xml node string where we want to add the element
 * @returns {string} The provided xml node string with the specifyed element added
 */
function addNodeInString(node, nodeString) {
  const documentToModify = useValidator().parseXmlString(nodeString),
    documentChildren = useValidator().getChildrenElements(documentToModify),
    nodePosition = getElementPosition(node),
    stringElements = documentChildren.map((child) => {
      return child.toString();
    });
  stringElements.splice(0, nodePosition.index, nodePosition.elementString);
  return stringElements.join('\n');
}

/**
 * Removes an element from a provided node string
 * @param {object} node The element we want to remove from a string
 * @param {string} nodeString the xmlString where we want to remove an element
 * @returns {string} The provoided xml node string with the specifyed element removed
 */
function removeNodeFromString(node, nodeString) {
  const documentToModify = useValidator().parseXmlString(nodeString),
    documentChildren = useValidator().getChildrenElements(documentToModify),
    childrenWithNodeRemoved = documentChildren.filter((child) => {
      return child.name() !== node.name();
    }),
    stringElements = childrenWithNodeRemoved.map((child) => {
      return child.toString();
    }).join('\n');
  return stringElements;
}

module.exports = {
  getElementFromMissingInRequestBySiblingsXpath,
  addNodeInString,
  getElementPosition,
  removeNodeFromString
};
