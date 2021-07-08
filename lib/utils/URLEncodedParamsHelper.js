const {
  getValueExample
} = require('./knownTypes');

class URLEncodedParamsHelper {

  /**
   * Generates the body message from a nodeElement
   * @param {Element} rootParametersElement node taken from parsedXml
   * @param {Element} headerInfo node taken from parsedXml
   * @param {string} protocol Protocol being used
   * @param {boolean} xmlParser indicates if xmlns should be removed from the root node
   * @returns {string} the rootParametersElement in xml string
   */
  convertInputToURLEncoded(rootParametersElement) {
    let result = [],
      children = rootParametersElement.children;
    result = children.map((child) => {
      return {
        key: child.name,
        value: getValueExample(child),
        type: 'text'
      };
    });
    return result;
  }
}

module.exports = {
  URLEncodedParamsHelper
};
