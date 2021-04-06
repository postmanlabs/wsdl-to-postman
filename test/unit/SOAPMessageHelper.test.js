const expect = require('chai').expect,
  {
    SOAPMessageHelper
  } = require('../../lib/utils/SOAPMessageHelper'),
  {
    UsernameTokenInput
  } = require('../../lib/security/schemas/inputs/tokens/UsernameTokenInput'),
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
  },
  jsonWithHeader = {
    'soap:Envelope': {
      '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'soap:Header': {
        'wsse:Security': {
          'wsse:UsernameToken': {
            'wsse:Username': 'chirs',
            'wsse:Password': 'chirs',
            'wsse:Nonce': 'sirhC',
            'wsu:Created': 'asdfdf'
          }
        }
      },
      'soap:Body': {
        'NumberToWords': {
          '@_xmlns': 'http://www.dataaccess.com/webservicesserver/',
          'ubiNum': 500
        }
      }
    }
  },

  jsonError = {
    'error': 'Could not find element'
  };

describe('SOAPMessageHelper  constructor', function() {
  it('should get an object for the factory with empty input', function() {
    const parametersUtils = new SOAPMessageHelper();
    expect(parametersUtils).to.be.an('object');
  });
});

describe('SOAPMessageHelper parseObjectToXML', function() {
  it('should get an string representing the xml only body', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlParameters = parametersUtils.parseObjectToXML(json);
    expect(xmlParameters).to.be.an('string');
  });

  it('should get an string representing the xml with header', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlParameters = parametersUtils.parseObjectToXML(jsonWithHeader);
    expect(xmlParameters).to.be.an('string');
  });

  it('should get an emtpy string when object is empty', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlParameters = parametersUtils.parseObjectToXML({});
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters).to.equal('');
  });

  it('should throw an error when object is null', function() {
    try {
      const parametersUtils = new SOAPMessageHelper();
      parametersUtils.parseObjectToXML(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot convert undefined or null to object');
    }
  });

  it('should throw an error when object is undefined', function() {
    try {
      const parametersUtils = new SOAPMessageHelper();
      parametersUtils.parseObjectToXML(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot convert undefined or null to object');
    }
  });

  it('should get an string representing the xml with error', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlParameters = parametersUtils.parseObjectToXML(jsonError);
    expect(xmlParameters).to.be.an('string');
  });
});

describe('SOAPMessageHelper convertInputToMessage ', function() {

  it('should get an string representing the xml of the corresponding nodes ex1', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
      '<ubiNum>18446744073709</ubiNum>' +
      '</NumberToWords>' +
      '</soap:Body>' +
      '</soap:Envelope>',
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
      xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the xml of the corresponding nodes ex2', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope' +
      'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<TestCustomModel xmlns="http://tempuri.org/">' +
      '<inputModel>' +
      '<Id>-2147483648</Id>' +
      '<Name>place your string value here</Name>' +
      '<Email>place your string value here</Email>' +
      '</inputModel>' +
      '</TestCustomModel>' +
      '</soap:Body>' +
      '</soap:Envelope>',
      grandChild1 = {
        children: [],
        name: 'Id',
        isComplex: false,
        type: 'integer',
        maximum: 2147483647,
        minimum: -2147483648
      },
      grandChild2 = {
        children: [],
        name: 'Name',
        isComplex: false,
        type: 'string'
      },
      grandChild3 = {
        children: [],
        name: 'Email',
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
        namespace: 'http://tempuri.org/'
      },
      xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the xml of the corresponding nodes using enum', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope' +
      'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<GeocodeAddressParsed xmlns="https://geoservices.tamu.edu/">' +
      '<censusYear>Unknown</censusYear>' +
      '</GeocodeAddressParsed>' +
      '</soap:Body>' +
      '</soap:Envelope>',
      child = {
        children: [],
        name: 'censusYear',
        isComplex: false,
        type: 'string',
        enumValues: ['Unknown',
          'NineteenNinety',
          'TwoThousand',
          'TwoThousandTen',
          'AllAvailable'
        ]
      },
      node = {
        children: [child],
        name: 'GeocodeAddressParsed',
        isComplex: true,
        type: 'complex',
        namespace: 'https://geoservices.tamu.edu/'
      },
      xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the xml of the corresponding nodes using enum integer', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope' +
      'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<foobar>' +
      '1' +
      '</foobar>' +
      '</soap:Body>' +
      '</soap:Envelope>',
      node = {
        children: [],
        name: 'foobar',
        isComplex: false,
        type: 'integer',
        namespace: 'https://geoservices.tamu.edu/',
        enumValues: ['1',
          '1011',
          '1032'
        ]
      };
    xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the security element for simple username password', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = `<?xml version="1.0" encoding="utf-8" ?> 
          <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
           <soap:Header>
            <wsse:Security soap:mustUnderstand="1" 
            xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
             <wsse:UsernameToken>
                <wsse:Username>place username here</wsse:Username>
                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/
oasis-200401-wss-username-token-profile-1.0#PasswordText">place password here</wsse:Password>
                <wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>
                <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>
              </wsse:UsernameToken>
            </wsse:Security>
          </soap:Header><soap:Body></soap:Body></soap:Envelope>`,
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'Normal';
    xmlParameters = parametersUtils.convertInputToMessage(undefined, [usernameTokenInput], 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the security element for username password NoPassword', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = `<?xml version="1.0" encoding="utf-8" ?> 
          <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
           <soap:Header>
            <wsse:Security soap:mustUnderstand="1" 
            xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
             <wsse:UsernameToken>
                <wsse:Username>place username here</wsse:Username>
              </wsse:UsernameToken>
            </wsse:Security>
          </soap:Header><soap:Body></soap:Body></soap:Envelope>`,
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'NoPassword';
    xmlParameters = parametersUtils.convertInputToMessage(undefined, [usernameTokenInput], 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the security element for simple hash password', function() {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = `<?xml version="1.0" encoding="utf-8" ?> 
          <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
           <soap:Header>
            <wsse:Security soap:mustUnderstand="1"
             xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
             <wsse:UsernameToken>
                <wsse:Username>place username here</wsse:Username>
                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/
oasis-200401-wss-username-token-profile-1.0#PasswordDigest">place hashed password here</wsse:Password>
                <wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>
                <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>
              </wsse:UsernameToken>
            </wsse:Security>
          </soap:Header><soap:Body></soap:Body></soap:Envelope>`,
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'HashPassword';
    xmlParameters = parametersUtils.convertInputToMessage(undefined, [usernameTokenInput], 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

});
