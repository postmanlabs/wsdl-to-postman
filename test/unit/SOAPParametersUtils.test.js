const expect = require('chai').expect,
  {
    SOAPParametersUtils
  } = require('../../lib/utils/SOAPParametersUtils');

jsonError = {
  'error': 'Could not find element'
};

describe('ParametersUtils  constructor', function() {
  it('should get an object for the factory with empty input', function() {
    const parametersUtils = new SOAPParametersUtils();
    expect(parametersUtils).to.be.an('object');
  });
});

describe('ParametersUtils buildObjectParameters', function() {
  it('should get an object correctly created', function() {
    const parametersUtils = new SOAPParametersUtils(),
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
      jsonObjectMessage = parametersUtils.buildObjectParameters(node);
    expect(jsonObjectMessage).to.be.an('object');
  });

});
