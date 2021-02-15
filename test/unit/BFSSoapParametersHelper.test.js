const expect = require('chai').expect,
  {
    BFSSoapParametersHelper
  } = require('../../lib/utils/BFSSoapParametersHelper');

describe('BFSSoapParametersHelper', function() {
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
      jsonObjectMessage = bFSSoapParametersHelper.Traverse(node, 'soap');
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
      jsonObjectMessage = bFSSoapParametersHelper.Traverse(node, 'soap');
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
});
