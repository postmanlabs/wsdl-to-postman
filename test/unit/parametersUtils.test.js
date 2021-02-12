const expect = require('chai').expect,
  {
    ParametersUtils
  } = require('../../lib/utils/ParametersUtils'),
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

describe('Http Utils ParametersUtils', function() {
  it('should get POST when called with "post"', function() {
    var defaultOptions = {
      ignoreAttributes: false,
      cdataTagName: '__cdata',
      format: true,
      indentBy: '  ',
      supressEmptyNode: false
    };
    let parser = new Parser(defaultOptions),
      xml = parser.parse(json);
    fs.writeFileSync('temp3.xml', xml);

  });


  describe('ParamtersUtils  constructor', function() {
    it('should get an object for the factory with empty input', function() {
      const parametersUtils = new ParametersUtils('');
      expect(parametersUtils).to.be.an('object');
    });
  });


  describe('buildParametersForSoap  constructor', function() {
    it('should get an string representing the xml', function() {
      const parametersUtils = new ParametersUtils(''),
        xmlParameters = parametersUtils.buildParametersForSoap();
      expect(xmlParameters).to.be.an('string');
    });
  });

});
