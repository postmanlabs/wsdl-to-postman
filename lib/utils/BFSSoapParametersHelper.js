const traverseUtility = require('traverse'),
  envelopeName =
  ':Envelope',
  bodyName =
  ':Body';

class BFSSoapParametersHelper {

  traverse(root, protocol = 'soap') {
    if (!root) {
      return {};
    }
    let traverseOrder = [],
      envelopeAndProtocol = protocol + envelopeName,
      bodyAndProtocol = protocol + bodyName,
      jObj = {},
      Q = [],
      S = new Set();
    Q.push(root);
    jObj[envelopeAndProtocol] = {};
    jObj[envelopeAndProtocol]['@_xmlns:' + protocol] = this.getSOAPNamespaceFromProtocol(protocol);
    jObj[envelopeAndProtocol][bodyAndProtocol] = {};

    while (Q.length > 0) {
      let e = Q.shift();
      traverseOrder.push(e);
      if (!S.has(e)) {
        if (e.isComplex) {
          jObj[envelopeAndProtocol][bodyAndProtocol][e.name] = {};
          if (e.namespace) {
            jObj[envelopeAndProtocol][bodyAndProtocol][e.name]['@_xmlns'] = e.namespace;
          }
        }
        else {
          jObj[envelopeAndProtocol][bodyAndProtocol][e.name] = this.getValueExample(e.type);
        }
        S.add(e);
      }
      for (let childrenIndex = 0; childrenIndex < e.children.length; childrenIndex++) {
        let emp = e.children[childrenIndex];
        if (emp.isComplex) {
          this.assignPropertyValue(jObj, e.name, emp.name, {});
        }
        else {
          this.assignPropertyValue(jObj, e.name, emp.name, this.getValueExample(emp.type));
        }
        if (!S.has(emp)) {
          Q.push(emp);
          S.add(emp);
        }
      }
    }
    while (traverseOrder.length > 0) {
      traverseOrder.shift();
    }
    return jObj;
  }

  assignPropertyValue(jObj, parent, property, value) {
    let parentFoound = null,
      assigned = false;
    traverseUtility(jObj).forEach(function(x) {
      if (typeof x === 'object') {
        parentFoound = Object.keys(x)
          .filter(
            (key) => {
              return key === parent;
            }
          );
      }
      if (!assigned && parentFoound.length === 1) {
        x[parent][property] = value;
        assigned = true;
      }
    });
  }

  getSOAPNamespaceFromProtocol(protocol) {
    var urls = {
      'soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'soap12': 'http://www.w3.org/2003/05/soap-envelope',
      'default': 'http://schemas.xmlsoap.org/soap/envelope/'
    };
    return (urls[protocol] || urls.default);
  }

  getValueExample(type) {
    var examples = {
      'unsignedLong': 500,
      'int': 1,
      'string': 'this is a string',
      'default': 'default value'
    };
    return (examples[type] || examples.default);
  }
}


module.exports = {
  BFSSoapParametersHelper
};
