const expect = require('chai').expect,
  {
    SOAPMessageHelper
  } = require('../../lib/utils/SOAPMessageHelper'),
  { XMLParser } = require('../../lib/XMLParser'),
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

describe('SOAPMessageHelper  constructor', function () {
  it('should get an object for the factory with empty input', function () {
    const parametersUtils = new SOAPMessageHelper();
    expect(parametersUtils).to.be.an('object');
  });
});

describe('SOAPMessageHelper parseObjectToXML', function () {
  it('should get an string representing the xml only body', function () {
    const parametersUtils = new SOAPMessageHelper(),
      xmlParameters = parametersUtils.parseObjectToXML(json, new XMLParser());
    expect(xmlParameters).to.be.an('string');
  });

  it('should get an string representing the xml with header', function () {
    const parametersUtils = new SOAPMessageHelper(),
      xmlParameters = parametersUtils.parseObjectToXML(jsonWithHeader, new XMLParser());
    expect(xmlParameters).to.be.an('string');
  });

  it('should get an emtpy string when object is empty', function () {
    const parametersUtils = new SOAPMessageHelper(),
      xmlParameters = parametersUtils.parseObjectToXML({}, new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters).to.equal('');
  });

  it('should throw an error when object is null', function () {
    try {
      const parametersUtils = new SOAPMessageHelper();
      parametersUtils.parseObjectToXML(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot convert undefined or null to object');
    }
  });

  it('should throw an error when object is undefined', function () {
    try {
      const parametersUtils = new SOAPMessageHelper();
      parametersUtils.parseObjectToXML(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot convert undefined or null to object');
    }
  });

  it('should get an string representing the xml with error', function () {
    const parametersUtils = new SOAPMessageHelper(),
      xmlParameters = parametersUtils.parseObjectToXML(jsonError, new XMLParser());
    expect(xmlParameters).to.be.an('string');
  });
});

describe('SOAPMessageHelper convertInputToMessage ', function () {

  it('should get an string representing the xml of the corresponding nodes ex1', function () {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Body>' +
        '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<ubiNum>10</ubiNum>' +
        '</NumberToWords>' +
        '</soap:Body>' +
        '</soap:Envelope>',
      child = {
        children: [],
        name: 'ubiNum',
        isComplex: false,
        type: 'integer',
        maximum: 10,
        minimum: 10
      },
      node = {
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      cacheKey = parametersUtils.getHashedKey(node, [], 'soap', parametersUtils.getCompundKey,
        parametersUtils.concatString),
      xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap', new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));
    expect(parametersUtils.cache.getFromCache(cacheKey)).to.be.an('string');
  });

  it('should get an string representing the xml of the corresponding nodes ex2', function () {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope' +
        'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Body>' +
        '<TestCustomModel xmlns="http://tempuri.org/">' +
        '<inputModel>' +
        '<Id>200</Id>' +
        '<Name>string</Name>' +
        '<Email>string</Email>' +
        '</inputModel>' +
        '</TestCustomModel>' +
        '</soap:Body>' +
        '</soap:Envelope>',
      grandChild1 = {
        children: [],
        name: 'Id',
        isComplex: false,
        type: 'integer',
        maximum: 200,
        minimum: 200
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
      xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap', new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the xml of the corresponding nodes using enum', function () {
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
        enum: ['Unknown',
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
      xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap', new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the xml of the corresponding nodes using enum integer', function () {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope' +
        'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Body>' +
        '<foobarxmlns="https://geoservices.tamu.edu/">' +
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
        enum: ['1',
          '1011',
          '1032'
        ]
      };
    xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap', new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the security element for simple username password', function () {
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
          </soap:Header><soap:Body/></soap:Envelope>`,
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'Normal';
    xmlParameters = parametersUtils.convertInputToMessage(undefined, {
      1: [usernameTokenInput]
    }, 'soap', new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the security element for username password NoPassword', function () {
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
          </soap:Header><soap:Body/></soap:Envelope>`,
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'NoPassword';
    xmlParameters = parametersUtils.convertInputToMessage(undefined, {
      1: [usernameTokenInput]
    }, 'soap', new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

  it('should get an string representing the security element for simple hash password', function () {
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
          </soap:Header><soap:Body/></soap:Envelope>`,
      usernameTokenInput = new UsernameTokenInput();
    usernameTokenInput.includeToken =
      'http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient';
    usernameTokenInput.passwordType = 'HashPassword';
    xmlParameters = parametersUtils.convertInputToMessage(undefined, {
      1: [usernameTokenInput]
    }, 'soap', new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));

  });

});

describe('SOAPMessageHelper getSOAPNamespaceFromProtocol', function () {
  it('should get http://schemas.xmlsoap.org/soap/envelope/ when soap is the protocol', function () {
    const parametersUtils = new SOAPMessageHelper(),
      url = parametersUtils.getSOAPNamespaceFromProtocol('soap');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://schemas.xmlsoap.org/soap/envelope/');
  });

  it('should get http://schemas.xmlsoap.org/soap/envelope/ when soap12 is the protocol', function () {
    const parametersUtils = new SOAPMessageHelper(),
      url = parametersUtils.getSOAPNamespaceFromProtocol('soap12');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://www.w3.org/2003/05/soap-envelope');
  });

  it('should get http://schemas.xmlsoap.org/soap/envelope/ when dummy is the protocol', function () {
    const parametersUtils = new SOAPMessageHelper(),
      url = parametersUtils.getSOAPNamespaceFromProtocol('dummy');
    expect(url).to.be.an('string');
    expect(url).to.equal('http://schemas.xmlsoap.org/soap/envelope/');

  });
  it('should get http://schemas.xmlsoap.org/soap/envelope/ when null is the protocol', function () {
    const parametersUtils = new SOAPMessageHelper(),
      url = parametersUtils.getSOAPNamespaceFromProtocol(null);
    expect(url).to.be.an('string');
    expect(url).to.equal('http://schemas.xmlsoap.org/soap/envelope/');

  });
});

describe('SOAPMessageHelper  cache', function () {
  it('should get second element from cache', function () {
    const parametersUtils = new SOAPMessageHelper(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Body>' +
        '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<ubiNum>10</ubiNum>' +
        '</NumberToWords>' +
        '</soap:Body>' +
        '</soap:Envelope>',
      child = {
        children: [],
        name: 'ubiNum',
        isComplex: false,
        type: 'integer',
        maximum: 10,
        minimum: 10
      },
      node = {
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      cacheKey = parametersUtils.getHashedKey(node, [], 'soap', parametersUtils.getCompundKey,
        parametersUtils.concatString),
      xmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap', new XMLParser()),
      secondXmlParameters = parametersUtils.convertInputToMessage(node, [], 'soap', new XMLParser());
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters).to.equal(secondXmlParameters);
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));
    expect(parametersUtils.cache.getFromCache(cacheKey)).to.be.an('string');
  });
});
