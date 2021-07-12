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

  /**
   * Generates and array of a key value object from the url
   * @param {string} url url to get the params in a object array
   * @returns {Array} params object array (key value)
   */
  getKeyValuesFromURLParams(url) {
    let parameters = [];
    const urlSplitted = url.split('?'),
      hasParams = urlSplitted.length > 1;
    if (hasParams) {
      let paramsURL = urlSplitted[1],
        parameterArray = paramsURL.split('&');
      parameters = parameterArray.map((keyValue) => {
        let keyValueArray = keyValue.split('=');
        if (keyValueArray.length > 0) {
          return { key: keyValueArray[0], value: keyValueArray[1] };
        }
      });
    }
    return parameters;
  }
}

module.exports = {
  URLWithParamsHelper
};
