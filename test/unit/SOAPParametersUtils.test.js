const expect = require('chai').expect,
  {
    SOAPParametersUtils
  } = require('../../lib/utils/SOAPParametersUtils'),
  // fs = require('fs'),
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

describe('ParamtersUtils  constructor', function() {
  it('should get an object for the factory with empty input', function() {
    const parametersUtils = new SOAPParametersUtils();
    expect(parametersUtils).to.be.an('object');
  });
});

describe('ParamtersUtils buildObjectParameters', function() {
  it('should get an object correctly created', function() {
    const parametersUtils = new SOAPParametersUtils(),
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
      jsonObjectMessage = parametersUtils.buildObjectParameters(node, 'soap');
    expect(jsonObjectMessage).to.be.an('object');
  });

});

describe('ParamtersUtils parseObjectToXML', function() {
  it('should get an string representing the xml', function() {
    const parametersUtils = new SOAPParametersUtils(),
      xmlParameters = parametersUtils.parseObjectToXML(json);
    expect(xmlParameters).to.be.an('string');
    // fs.writeFileSync('temp3.xml', xmlParameters);
  });

  it('should get an emtpy string when object is empty', function() {
    const parametersUtils = new SOAPParametersUtils(),
      xmlParameters = parametersUtils.parseObjectToXML({});
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters).to.equal('');
    // fs.writeFileSync('temp3.xml', xmlParameters);
  });

  it('should throw an error when object is null', function() {
    try {
      const parametersUtils = new SOAPParametersUtils();
      parametersUtils.parseObjectToXML(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot convert undefined or null to object');
    }
  });

  it('should throw an error when object is undefined', function() {
    try {
      const parametersUtils = new SOAPParametersUtils();
      parametersUtils.parseObjectToXML(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot convert undefined or null to object');
    }
  });
});
