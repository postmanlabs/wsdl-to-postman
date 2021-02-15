const expect = require('chai').expect,
  {
    SOAPParametersUtils
  } = require('../../lib/utils/SOAPParametersUtils'),
  {
    BFSSoapParametersHelper
  } = require('../../lib/utils/BFSSoapParametersHelper'),
  Parser = require('fast-xml-parser').j2xParser,
  fs = require('fs'),
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
  it('should get an string representing the xml', function() {
    const parametersUtils = new SOAPParametersUtils(),
      objectParameters = parametersUtils.buildObjectParameters('soap');
    expect(objectParameters).to.be.an('object');
    expect(objectParameters['soap:Envelope']).to.equal('envelopKey');
    expect(objectParameters['soap:Body']).to.equal('bodyKey');

  });
});
describe('ParamtersUtils parseObjectToXML', function() {
  it('should get an string representing the xml', function() {
    const parametersUtils = new SOAPParametersUtils(),
      xmlParameters = parametersUtils.parseObjectToXML(json);
    expect(xmlParameters).to.be.an('string');
    fs.writeFileSync('temp3.xml', xmlParameters);
  });
});
