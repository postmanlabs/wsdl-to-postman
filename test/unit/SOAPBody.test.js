const expect = require('chai').expect,
  {
    SOAPBody
  } = require('../../lib/utils/SOAPBody');

jsonError = {
  'error': 'Could not find element'
};

describe('ParametersUtils  constructor', function () {
  it('should get an object for the factory with empty input', function () {
    const parametersUtils = new SOAPBody();
    expect(parametersUtils).to.be.an('object');
  });
});

describe('ParametersUtils buildObjectParameters', function () {
  it('should get an object correctly created', function () {
    const parametersUtils = new SOAPBody(),
      child = {
        children: [],
        name: 'ubiNum',
        isComplex: false,
        type: 'integer',
        maximum: 18446744073709,
        minimum: 0
      },
      node = {
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      jsonObjectMessage = parametersUtils.create(node);
    expect(jsonObjectMessage).to.be.an('object');
  });

});
