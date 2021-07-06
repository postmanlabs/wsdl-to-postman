const {
  getValueExample
} = require('./knownTypes');

class URLWithParamsHelper {

  /**
   * Generates the body message from a nodeElement
   * @param {Element} rootParametersElement node taken from parsedXml
   * @param {Element} headerInfo node taken from parsedXml
   * @param {string} protocol Protocol being used
   * @param {boolean} xmlParser indicates if xmlns should be removed from the root node
   * @returns {string} the rootParametersElement in xml string
   */
  convertInputToURLParams(rootParametersElement) {
    let result = '',
      children = rootParametersElement.children;
    result = children.map((child) => {
      return `${child.name}=${getValueExample(child)}`;
    });
    return result.join('&');
  }
}

module.exports = {
  URLWithParamsHelper
};
