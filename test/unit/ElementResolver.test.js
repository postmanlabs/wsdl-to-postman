const { expect } = require('chai');
const { ElementResolver } = require('../../lib/utils/ElementResolver');

describe('SoapBodyCopy create function test', function() {
  it('Should resolve the error type elements when the originalType is defined', function() {
    const child = {
        children: [],
        name: 'ubiNum',
        isComplex: false,
        type: 'error',
        maximum: 0,
        minimum: 0,
        originalType: 'NumType'
      },
      elements = [{
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        isElement: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/',
        originalType: 'complex'
      }],
      complexTypeElements = [{
        children: [],
        name: 'NumType',
        isComplex: false,
        iseEement: false,
        type: 'integer',
        maximum: 0,
        minimum: 0
      }],
      simpleTypeElements = [],
      allElements = {
        simpleTypeElements,
        complexTypeElements,
        elements
      },
      resolver = new ElementResolver(allElements);
    resolver.resolveAll();
    expect(allElements.elements[0].children[0].type).to.be.equal('NumType');
  });
});
