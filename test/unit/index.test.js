const expect = require('chai').expect,
  {
    getOptions,
    getMetaData
  } = require('../../index'),
  validWSDLs = 'test/data/validWSDLs11';

describe('Index getOptions', function() {

  it('Should return external options when called without parameters', function() {
    const options = getOptions();
    expect(options).to.be.an('array');
    expect(options.length).to.eq(1);
  });
});

describe('getMetaData', function() {

  it('Should return external options when called without parameters', function() {

    const
      VALID_WSDL_PATH = validWSDLs + '/calculator-soap11and12.wsdl';

    getMetaData({
      type: 'file',
      data: VALID_WSDL_PATH
    }, function(x, y) {
      expect(x).to.eq(null);
      expect(y.name).to.eq('Converted from WSDL');
    });

  });
});
