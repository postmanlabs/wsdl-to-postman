const expect = require('chai').expect,
  {
    SOAPParametersUtils
  } = require('../../lib/utils/SOAPParametersUtils'),
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
        maximum: 18446744073709552000,
        minimum: 0
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

describe('ParametersUtils parseObjectToXML', function() {
  it('should get an string representing the xml', function() {
    const parametersUtils = new SOAPParametersUtils(),
      xmlParameters = parametersUtils.parseObjectToXML(json);
    expect(xmlParameters).to.be.an('string');
  });

  it('should get an emtpy string when object is empty', function() {
    const parametersUtils = new SOAPParametersUtils(),
      xmlParameters = parametersUtils.parseObjectToXML({});
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters).to.equal('');
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

describe('ParametersUtils converObjectParametersToXML', function() {
  it('should get an string representing the xml of the corresponding nodes ex1', function() {
    const parametersUtils = new SOAPParametersUtils(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
      '<ubiNum>18446744073709552000</ubiNum>' +
      '</NumberToWords>' +
      '</soap:Body>' +
      '</soap:Envelope>',
      child = {
        children: [],
        name: 'ubiNum',
        isComplex: false,
        type: 'integer',
        maximum: 18446744073709552000,
        minimum: 0
      },
      node = {
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      xmlParameters = parametersUtils.converObjectParametersToXML(node, 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));
    fs.writeFileSync('temp3.xml', xmlParameters);
  });

  it('should get an string representing the xml of the corresponding nodes ex2', function() {
    const parametersUtils = new SOAPParametersUtils(),
      xmlOutput = '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope' +
      'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<TestCustomModel xmlns="http://tempuri.org/">' +
      '<inputModel>' +
      '<Id>-2147483648</Id>' +
      '<Name> this is a string </Name>' +
      '<Email> this is a string</Email>' +
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
      xmlParameters = parametersUtils.converObjectParametersToXML(node, 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));
    fs.writeFileSync('temp3.xml', xmlParameters);
  });

  it('should get an string representing the xml of the corresponding nodes ex2', function() {
    const parametersUtils = new SOAPParametersUtils(),
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
        enumValues: ["Unknown",
          "NineteenNinety",
          "TwoThousand",
          "TwoThousandTen",
          "AllAvailable"
        ]
      },
      node = {
        children: [child],
        name: 'GeocodeAddressParsed',
        isComplex: true,
        type: 'complex',
        namespace: 'https://geoservices.tamu.edu/'
      },
      xmlParameters = parametersUtils.converObjectParametersToXML(node, 'soap');
    expect(xmlParameters).to.be.an('string');
    expect(xmlParameters.replace(/[\r\n\s]+/g, '')).to.equal(xmlOutput.replace(/[\r\n\s]+/g, ''));
    fs.writeFileSync('temp3.xml', xmlParameters);
  });
});
