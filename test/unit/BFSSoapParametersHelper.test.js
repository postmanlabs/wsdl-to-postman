const expect = require('chai').expect,
  {
    BFSSoapParametersHelper
  } = require('../../lib/utils/BFSSoapParametersHelper');

describe('BFSSoapParametersHelper convertFromNodeToJson', function() {
  it('Should get a json object when NumberToWords->ubinum is sent', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper(),
      child = {
        children: [],
        name: 'ubiNum',
        isComplex: false,
        type: 'unsignedLong'
      },
      node = {
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      jsonObjectMessage = bFSSoapParametersHelper.convertFromNodeToJson(node, 'soap');
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.have.own.property('soap:Envelope');
    expect(jsonObjectMessage['soap:Envelope']).to.have.own.property('soap:Body');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body']).to.have.own.property('NumberToWords');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].NumberToWords)
      .to.have.own.property('ubiNum');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].NumberToWords.ubiNum)
      .to.equal(500);
  });

  it('Should get a json object when TestCustomModel->inputmodel->id,name,email is sent', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper(),
      grandChild1 = {
        children: [],
        name: 'id',
        isComplex: false,
        type: 'int'
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
      node = {
        children: [child],
        name: 'TestCustomModel',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      jsonObjectMessage = bFSSoapParametersHelper.convertFromNodeToJson(node, 'soap');
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.have.own.property('soap:Envelope');
    expect(jsonObjectMessage['soap:Envelope']).to.have.own.property('soap:Body');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body']).to.have.own.property('TestCustomModel');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].TestCustomModel)
      .to.have.own.property('inputModel');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].TestCustomModel.inputModel)
      .to.have.own.property('id');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].TestCustomModel.inputModel)
      .to.have.own.property('name');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].TestCustomModel.inputModel)
      .to.have.own.property('email');

    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].TestCustomModel.inputModel.id)
      .to.equal(1);
    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].TestCustomModel.inputModel.name)
      .to.equal('this is a string');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body'].TestCustomModel.inputModel.email)
      .to.equal('this is a string');
  });

  it('Should get an empty json object when null is sent', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper(),
      jsonObjectMessage = bFSSoapParametersHelper.convertFromNodeToJson(null, 'soap');
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.be.empty;
  });

  it('Should get an empty json object when undefined is sent', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper(),
      jsonObjectMessage = bFSSoapParametersHelper.convertFromNodeToJson(undefined, 'soap');
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.be.empty;
  });

});

describe('BFSSoapParametersHelper getValueExample', function() {
  it('should get a number when called with "unsignedLong"', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper(),
      example = bFSSoapParametersHelper.getValueExample('unsignedLong');
    expect(example).to.be.a('number');
  });

  it('should get a number when called with "int"', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper(),
      example = bFSSoapParametersHelper.getValueExample('int');
    expect(example).to.be.a('number');
  });

  it('should get a string when called with "string"', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper(),
      example = bFSSoapParametersHelper.getValueExample('string');
    expect(example).to.be.a('string');
  });

  it('should get a string when called with "dfdfsdfsdf"', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper(),
      example = bFSSoapParametersHelper.getValueExample('dfdfsdfsdf');
    expect(example).to.be.a('string');
  });

});

describe('BFSSoapParametersHelper assignPropertyValue', function() {
  it('should get modify the object assign the new property "property" with "value"', function() {
    const bFSSoapParametersHelper = new BFSSoapParametersHelper();
    let obj = {
      parent: {}
    };
    bFSSoapParametersHelper.assignPropertyValue(obj, 'parent', 'property', 'value');
    expect(obj).to.be.a('object');
    expect(obj.parent.property).to.equal('value');
  });
});

describe('BFSSoapParametersHelper BFSSoapParametersHelper', function() {
  it('should get http://schemas.xmlsoap.org/soap/envelope/ when soap is the protocol', function() {
    const parametersUtils = new BFSSoapParametersHelper(),
      url = parametersUtils.getSOAPNamespaceFromProtocol('soap');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://schemas.xmlsoap.org/soap/envelope/');
  });

  it('should get http://schemas.xmlsoap.org/soap/envelope/ when soap12 is the protocol', function() {
    const parametersUtils = new BFSSoapParametersHelper(),
      url = parametersUtils.getSOAPNamespaceFromProtocol('soap12');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://www.w3.org/2003/05/soap-envelope');
  });

  it('should get http://schemas.xmlsoap.org/soap/envelope/ when asdasd is the protocol', function() {
    const parametersUtils = new BFSSoapParametersHelper(),
      url = parametersUtils.getSOAPNamespaceFromProtocol('soaasdasd');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://schemas.xmlsoap.org/soap/envelope/');

  });

});
