const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>',
  Parser = require('fast-xml-parser').j2xParser,
  parserOptions = {
    ignoreAttributes: false,
    cdataTagName: '__cdata',
    format: true,
    indentBy: '  ',
    supressEmptyNode: false
  };

class SOAPParametersUtils {


  parseObjectToXML(jsonObject) {
    let parser = new Parser(parserOptions),
      xml = parser.parse(jsonObject);
    return xml;
  }

  buildObjectParameters(protocol, element) {
    let envelopKey = protocol + ':Envelope',
      bodyKey = protocol + ':Body',
      result = {
        [envelopKey]: 'envelopKey',
        [bodyKey]: 'bodyKey',
      };



    while (element.isComplex) {
      result[element.name] = {}
    }

    return result;
  }

  convertToJson(node, options, parentTagName) {
    const jObj = {};

    // when no child node or attr is present
    if ((!node.child || this.isEmptyObject(node.child)) && (!node.attrsMap || this.isEmptyObject(node.attrsMap))) {
      return this.isExist(node.val) ? node.val : '';
    }

    // otherwise create a textnode if node has some text
    if (this.isExist(node.val) && !(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
      const asArray = this.isTagNameInArrayMode(node.tagname, options.arrayMode, parentTagName)
      jObj[options.textNodeName] = asArray ? [node.val] : node.val;
    }

    this.merge(jObj, node.attrsMap, options.arrayMode);

    const keys = Object.keys(node.child);
    for (let index = 0; index < keys.length; index++) {
      const tagName = keys[index];
      if (node.child[tagName] && node.child[tagName].length > 1) {
        jObj[tagName] = [];
        for (let tag in node.child[tagName]) {
          if (node.child[tagName].hasOwnProperty(tag)) {
            jObj[tagName].push(this.convertToJson(node.child[tagName][tag], options, tagName));
          }
        }
      }
      else {
        const result = this.convertToJson(node.child[tagName][0], options, tagName);
        const asArray = (options.arrayMode === true && typeof result === 'object') || this.isTagNameInArrayMode(tagName, options.arrayMode, parentTagName);
        jObj[tagName] = asArray ? [result] : result;
      }
    }

    //add value
    return jObj;
  };

  isExist(v) {
    return typeof v !== 'undefined';
  };

  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  };

  merge(target, a, arrayMode) {
    if (a) {
      const keys = Object.keys(a); // will return an array of own properties
      const len = keys.length; //don't make it inline
      for (let i = 0; i < len; i++) {
        if (arrayMode === 'strict') {
          target[keys[i]] = [a[keys[i]]];
        }
        else {
          target[keys[i]] = a[keys[i]];
        }
      }
    }
  };

  isTagNameInArrayMode(tagName, arrayMode, parentTagName) {
    if (arrayMode === false) {
      return false;
    }
    else if (arrayMode instanceof RegExp) {
      return arrayMode.test(tagName);
    }
    else if (typeof arrayMode === 'function') {
      return !!arrayMode(tagName, parentTagName);
    }

    return arrayMode === "strict";
  }
}

module.exports = {
  SOAPParametersUtils,
  xmlHeader
};
