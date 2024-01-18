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
   * @returns {Object} the rootParametersElement in xml string
   */
  convertInputToURLEncoded(rootParametersElement) {
    let result = [];
    if (rootParametersElement && rootParametersElement.children) {
      let children = rootParametersElement.children,
        result = children.map((child) => {
          return {
            key: child.name,
            value: getValueExample(child),
            type: 'text'
          };
        });
      return result;
    }
    return result;
  }
}

module.exports = {
  URLEncodedParamsHelper
};
