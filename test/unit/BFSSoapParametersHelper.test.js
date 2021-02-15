const expect = require('chai').expect,
  {
    BFSSoapParametersHelper
  } = require('../../lib/utils/BFSSoapParametersHelper'),
  json = {
    'soap:Envelope': {
      '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'soap:Body': {
        'NumberToWords': {
          '@_xmlns': 'http://www.dataaccess.com/webservicesserver/',
          'ubiNum': 500
        }
      }
    }
  };

describe('BFSSoapParametersHelper', function() {
  it('Should get a json object when NumberToWords->ubinum is sent', function() {
    const parametersUtils = new BFSSoapParametersHelper(),
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
      jsonObjectMessage = parametersUtils.Traverse(node);
    expect(jsonObjectMessage).to.be.an('object');
    expect(jsonObjectMessage).to.have.own.property('soap:Envelope');
    expect(jsonObjectMessage['soap:Envelope']).to.have.own.property('soap:Body');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body']).to.have.own.property('NumberToWords');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body']['NumberToWords'])
      .to.have.own.property('ubiNum');
    expect(jsonObjectMessage['soap:Envelope']['soap:Body']['NumberToWords']['ubiNum'])
      .to.equal(500);
  });

});
