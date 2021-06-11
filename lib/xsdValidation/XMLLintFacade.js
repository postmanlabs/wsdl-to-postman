const { XSDValidationError } = require('./XSDValidationError'),
  xmllint = require('xmllint'),
  xpathTool = require('xpath'),
  xmldom = require('xmldom').DOMParser,
  INVALID_TYPE = 'is not a valid value of the atomic type',
  NOT_EXPECTED = 'This element is not expected',
  NOT_ALLOWED = 'Character content is not allowed',
  ERROR_STRING_PLACE = 'Schemas validity error : ';

/**
 * Class to generate and expose the same xmlNode format than libxmljs packages
 */
class XMLElement {
  constructor(xmlNode, textValueComponent = '') {
    this.textValueComponent = textValueComponent;
    this.node = xmlNode;
  }

  path() {
    const result = this.node ? this.getPath(this.node) : null;
    return result;
  }

  prevElement() {
    const prevElement = this.getPrevious(this.node);
    return prevElement ? new XMLElement(prevElement) : null;
  }

  parent() {
    const parentNode = this.node.parentNode;
    return new XMLElement(parentNode);
  }

  text() {
    return this.node.textContent;
  }

  childNodes() {
    return this.node.childNodes;
  }

  getPrevious(node) {
    const prevElement = node.previousSibling,
      prevElementName = prevElement ? prevElement.nodeName : null;
    if (prevElementName === '#text') {
      return this.getPrevious(prevElement);
    }
    return prevElement;
  }

  getPath(node, accumulator = []) {
    accumulator = accumulator.length === 0 ?
      [node.nodeName] :
      accumulator;
    const parentNode = node.parentNode,
      parentName = parentNode.nodeName,
      indexComponent = this.getIndexComponent(accumulator, parentNode);
    accumulator[0] = `${accumulator[0]}${indexComponent}`;

    if (parentName !== '#document') {
      return this.getPath(parentNode, [parentName, ...accumulator]);
    }
    return `/${accumulator.join('/')}`;
  }

  getIndexComponent(accumulator, parentNode) {
    const currentElementXpath = `./${accumulator[0]}`,
      completeLocalXpath = `./${accumulator.slice(1).join('/')}${this.textValueComponent}`,
      sameNameSiblings = xpathTool.select(currentElementXpath, parentNode);
    let indexComponent = '';

    if (sameNameSiblings.length > 1) {
      indexComponent = sameNameSiblings.map((element, index) => {
        let result;
        if (this.textValueComponent && accumulator.length === 1) {
          result = this.textValueComponent.includes(element.textContent) ?
            [element.textContent] :
            [];
        }
        else {
          result = xpathTool.select(completeLocalXpath, element);
        }
        // let result = accumulator.length === 1 ?
        //    :
        //   xpathTool.select(completeLocalXpath, element);
        return result.length > 0 ? `[${index + 1}]` : null;
      }).find((indexComponent) => {
        return indexComponent;
      });
    }
    return indexComponent;
  }
}

/**
 * Class to validate XML against an XSD schema.
 * Facade to xmllint package
 */
class XMLLintFacade {

  /**
   *  Validates the xml against schema
   * @param {string} xml the xml to validate
   * @param {string} schema the xsd schema to use in validation
   * @returns {object} the parsed object
   */
  validate(xml, schema) {
    var res = xmllint.validateXML({
      xml: xml,
      schema: schema
    });
    return res;
  }

  /**
   *  Takes in the xmllint errors and convert them
   * into a known XSDValidationError object
   * @param {object} errors the result for xmllint validation
   * @param {string} schema the xsd schema to use in validation
   * @returns {Array} array of XSDValidationError
   */
  mapErrors(errors) {
    let adaptedErrors = [];
    if (!errors || !errors.errors) {
      return [];
    }
    errors.errors.forEach((error) => {
      let code,
        message,
        str1,
        valError;
      if (error.includes(INVALID_TYPE)) {
        code = 1824;
        message = error.split(ERROR_STRING_PLACE)[1];
        str1 = message.split('Element \'message\': ')[1].split('\'')[1];
        valError = new XSDValidationError(code, message + '\n', str1);
        adaptedErrors.push(valError);
      }
      else if (error.includes(NOT_EXPECTED)) {
        code = 1871;
        message = error.split(ERROR_STRING_PLACE)[1];
        valError = new XSDValidationError(code, message + '\n', undefined);
        adaptedErrors.push(valError);
      }
      else if (error.includes(NOT_ALLOWED)) {
        code = 1841;
        message = error.split(ERROR_STRING_PLACE)[1];
        valError = new XSDValidationError(code, message + '\n', undefined);
        adaptedErrors.push(valError);
      }
    });
    return adaptedErrors;
  }

  findByXpathInXmlString(xmlString, xpath) {
    const document = new xmldom().parseFromString(xmlString),
      textValuePattern = /\[text\(\)=".*"\]/,
      textValueInXpath = xpath.match(textValuePattern),
      textValueComponent = textValueInXpath ? textValueInXpath[0] : '',
      elements = xpathTool.select(xpath, document).map((xmlNode) => {
        return new XMLElement(xmlNode, textValueComponent);
      });
    return elements;
  }

  getElementText(xmlString, xpath) {
    const element = this.findByXpathInXmlString(xmlString, xpath),
      text = element.length > 0 ? element[0].text() : '';
    return text;
  }

  getChildrenAsString(xmlString, xpath) {
    const element = this.findByXpathInXmlString(xmlString, xpath)[0],
      children = Object.values(element.childNodes()).filter((node) => {
        let nodeName = node.nodeName;
        return nodeName && nodeName !== '#text';
      }),
      childrenAsString = children.map((node) => {
        return node.toString();
      }).join('\n');
    return childrenAsString;
  }
}

module.exports = {
  XMLLintFacade
};
