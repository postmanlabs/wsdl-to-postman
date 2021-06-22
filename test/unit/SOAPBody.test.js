const expect = require('chai').expect,
  assert = require('chai').assert,
  {
    SOAPBody
  } = require('../../lib/utils/SOAPBody'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  {
    ERROR_ELEMENT_IDENTIFIER
  } = require('../../lib/constants/processConstants');

describe('SOAPBody  constructor', function () {
  it('should get an object for the factory with empty input', function () {
    const parametersUtils = new SOAPBody(new XMLParser());
    expect(parametersUtils).to.be.an('object');
  });
});

describe('SOAPBody create', function () {
  it('Should get a json object when NumberToWords->ubinum is sent', function () {
    const bodyCreator = new SOAPBody(new XMLParser()),
      child = {
        children: [],
        name: 'ubiNum',
        isComplex: false,
        type: 'integer',
        maximum: 18446744073709,
        minimum: 0
      },
      soapMessageParent = {
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      jsonObjectMessage = bodyCreator.create(soapMessageParent);
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.have.own.property('NumberToWords');
    expect(jsonObjectMessage.NumberToWords)
      .to.have.own.property('ubiNum');
    assert.isAtLeast(jsonObjectMessage.NumberToWords.ubiNum, 2);
    assert.isAtMost(jsonObjectMessage.NumberToWords.ubiNum, 18446744073709);
  });

  it('Should get a json object when TestCustomModel->inputmodel->id,name,email is sent', function () {
    const bodyCreator = new SOAPBody(new XMLParser()),
      grandChild1 = {
        children: [],
        name: 'id',
        isComplex: false,
        type: 'integer',
        maximum: 2147483647,
        minimum: -2147483648
      },
      grandChild2 = {
        children: [],
        name: 'name',
        isComplex: false,
        type: 'string'
      },
      grandChild3 = {
        children: [],
        name: 'email',
        isComplex: false,
        type: 'string'
      },
      child = {
        children: [grandChild1, grandChild2, grandChild3],
        name: 'inputModel',
        isComplex: true,
        type: 'MyCustomModel'
      },
      soapMessageParent = {
        children: [child],
        name: 'TestCustomModel',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      jsonObjectMessage = bodyCreator.create(soapMessageParent);
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.have.own.property('TestCustomModel');
    expect(jsonObjectMessage.TestCustomModel)
      .to.have.own.property('inputModel');
    expect(jsonObjectMessage.TestCustomModel.inputModel)
      .to.have.own.property('id');
    expect(jsonObjectMessage.TestCustomModel.inputModel)
      .to.have.own.property('name');
    expect(jsonObjectMessage.TestCustomModel.inputModel)
      .to.have.own.property('email');
    assert.isAtLeast(jsonObjectMessage.TestCustomModel.inputModel.id, -2147483648);
    assert.isAtMost(jsonObjectMessage.TestCustomModel.inputModel.id, 2147483647);
    expect(jsonObjectMessage.TestCustomModel.inputModel.name)
      .to.equal('string');
    expect(jsonObjectMessage.TestCustomModel.inputModel.email)
      .to.equal('string');
  });

  it('Should get an empty json object when null is sent', function () {
    const bodyCreator = new SOAPBody(new XMLParser()),
      jsonObjectMessage = bodyCreator.create(null);
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.be.empty;
  });

  it('Should get an empty json object when undefined is sent', function () {
    const bodyCreator = new SOAPBody(new XMLParser()),
      jsonObjectMessage = bodyCreator.create(undefined);
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.be.empty;
  });

  it('Should get a json object indicating the error', function () {
    const bodyCreator = new SOAPBody(new XMLParser()),
      soapMessageParent = {
        children: [],
        name: ERROR_ELEMENT_IDENTIFIER,
        isComplex: false,
        type: ERROR_ELEMENT_IDENTIFIER,
        namespace: ''
      },
      jsonObjectMessage = bodyCreator.create(soapMessageParent, 'soap');
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.have.own.property(ERROR_ELEMENT_IDENTIFIER);
  });

  it('Should get a json object indicating the error from child', function () {
    const bodyCreator = new SOAPBody(new XMLParser()),

      child = {
        children: [],
        name: ERROR_ELEMENT_IDENTIFIER,
        isComplex: false,
        type: ERROR_ELEMENT_IDENTIFIER,
        namespace: ''
      },
      soapMessageParent = {
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      jsonObjectMessage = bodyCreator.create(soapMessageParent);
    expect(jsonObjectMessage).to.have.own.property('NumberToWords');
    expect(jsonObjectMessage.NumberToWords)
      .to.have.own.property(ERROR_ELEMENT_IDENTIFIER);
  });

  it('Should get a json object when has complex brothers with properties with the same name', function () {
    const bodyCreator = new SOAPBody(new XMLParser()),
      Item1Concrete2 = {
        children: [],
        name: 'Item1Concrete2',
        isComplex: false,
        type: 'integer',
        maximum: 2147483647,
        minimum: -2147483648
      },
      Item2 = {
        children: [Item1Concrete2],
        name: 'item',
        isComplex: true,
        type: 'complex'
      },
      C2 = {
        children: [Item2],
        name: 'C2',
        isComplex: true,
        type: 'complex'
      },
      C1 = {
        children: [],
        name: 'C1',
        isComplex: false,
        type: 'integer',
        maximum: 2147483647,
        miminimum: -2147483648
      },
      Item1Concrete1 = {
        children: [],
        name: 'Item1Concrete1',
        isComplex: false,
        type: 'integer',
        maximum: 2147483647,
        minimum: -2147483648
      },
      Item1 = {
        children: [Item1Concrete1],
        name: 'item',
        isComplex: true,
        type: 'complex'
      },
      B2 = {
        children: [Item1],
        name: 'B2',
        isComplex: true,
        type: 'complex'
      },
      B1 = {
        children: [],
        name: 'B1',
        isComplex: false,
        type: 'integer',
        maximum: 2147483647,
        minimum: -2147483648
      },
      C = {
        children: [C1, C2],
        name: 'C',
        isComplex: true,
        type: 'complex'
      },
      B = {
        children: [B1, B2],
        name: 'B',
        isComplex: true,
        type: 'complex'
      },
      root = {
        children: [B, C],
        name: 'A',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      jsonObjectMessage = bodyCreator.create(root);
    let valueB1 = jsonObjectMessage.A.B.B1,
      valueitemConcrete1 = jsonObjectMessage.A.B.B2.item.Item1Concrete1,
      valueC1 = jsonObjectMessage.A.C.C1,
      valueitemConcrete2 = jsonObjectMessage.A.C.C2.item.Item1Concrete2;
    expect(jsonObjectMessage).to.be.an('object').and.to.deep.include(
      {
        A: {
          '@_xmlns': 'http://www.dataaccess.com/webservicesserver/',
          B: {
            B1: valueB1,
            B2: {
              item: {
                Item1Concrete1: valueitemConcrete1
              }
            }
          },
          C: {
            C1: valueC1,
            C2: {
              item: {
                Item1Concrete2: valueitemConcrete2
              }
            }
          }
        }
      });
  });
});

describe('SOAPBody assignPropertyValue', function () {
  it('should assign the property "property" with "value" to object', function () {
    const bodyCreator = new SOAPBody(new XMLParser());
    let obj = {
      parent: {}
    };
    bodyCreator.assignPropertyValue(obj.parent, 'property', 'value');
    expect(obj).to.be.a('object');
    expect(obj.parent.property).to.equal('value');
  });
});

describe('SOAPBody SOAPBody', function () {
  it('should get http://schemas.xmlsoap.org/soap/envelope/ when soap is the protocol', function () {
    const parametersUtils = new SOAPBody(new XMLParser()),
      url = parametersUtils.getSOAPNamespaceFromProtocol('soap');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://schemas.xmlsoap.org/soap/envelope/');
  });

  it('should get http://schemas.xmlsoap.org/soap/envelope/ when soap12 is the protocol', function () {
    const parametersUtils = new SOAPBody(new XMLParser()),
      url = parametersUtils.getSOAPNamespaceFromProtocol('soap12');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://www.w3.org/2003/05/soap-envelope');
  });

  it('should get http://schemas.xmlsoap.org/soap/envelope/ when dummy is the protocol', function () {
    const parametersUtils = new SOAPBody(new XMLParser()),
      url = parametersUtils.getSOAPNamespaceFromProtocol('dummy');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://schemas.xmlsoap.org/soap/envelope/');

  });
  it('should get http://schemas.xmlsoap.org/soap/envelope/ when null is the protocol', function () {
    const parametersUtils = new SOAPBody(new XMLParser()),
      url = parametersUtils.getSOAPNamespaceFromProtocol(null);
    expect(url).to.be.an('string');
    expect(url).to.equal('http://schemas.xmlsoap.org/soap/envelope/');

  });
});
