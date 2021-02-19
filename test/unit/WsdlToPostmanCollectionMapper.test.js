const {
  assert
} = require('chai');
const {
  Collection
} = require('postman-collection');

const {
    WsdlToPostmanCollectionMapper
  } = require('../../lib/WsdlToPostmanCollectionMapper'),
  expect = require('chai').expect,
  wsdlMockObject = {
    operationsArray: [{
      name: 'NumberToWords',
      description: 'Returns the word corresponding to the positive number passed as parameter.',
      style: 'document',
      url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
      input: {
        children: [{
          children: [],
          name: 'ubiNum',
          isComplex: false,
          type: 'unsignedLong'
        }],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      output: {
        children: [{
          children: [],
          name: 'NumberToWordsResult',
          isComplex: false,
          type: 'string'
        }],
        name: 'NumberToWordsResponse',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      fault: {
        children: [{
          children: [],
          name: 'faultcode',
          isComplex: false,
          type: 'string'
        }],
        name: 'fault',
        isComplex: true,
        type: 'complex',
        namespace: ''
      },
      portName: 'NumberConversionSoap',
      serviceName: 'NumberConversion',
      method: 'POST',
      protocol: 'soap'
    },
    {
      name: 'NumberToDollars',
      description: 'Returns the non-zero dollar amount of the passed number.',
      style: 'document',
      url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
      input: {
        children: [{
          children: [],
          name: 'dNum',
          isComplex: false,
          type: 'decimal'
        }],
        name: 'NumberToDollars',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      output: undefined,
      fault: undefined,
      portName: 'NumberConversionSoap',
      serviceName: 'NumberConversion',
      method: 'POST',
      protocol: 'soap'
    },
    {
      name: 'NumberToWords',
      description: 'Returns the word corresponding to the positive number passed as parameter.',
      style: 'document',
      url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
      input: {
        children: [{
          children: [],
          name: 'ubiNum',
          isComplex: false,
          type: 'unsignedLong'
        }],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      output: undefined,
      fault: undefined,
      portName: 'NumberConversionSoap12',
      serviceName: 'NumberConversion',
      method: 'POST',
      protocol: 'soap12'
    },
    {
      name: 'NumberToDollars',
      description: 'Returns the non-zero dollar amount of the passed number.',
      style: 'document',
      url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
      input: {
        children: [child = {
          children: [],
          name: 'dNum',
          isComplex: false,
          type: 'decimal'
        }],
        name: 'NumberToDollars',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      output: undefined,
      fault: undefined,
      portName: 'NumberConversionSoap12',
      serviceName: 'NumberConversion',
      method: 'POST',
      protocol: 'soap12'
    }
    ],
    targetNamespace: {
      key: 'targetNamespace',
      url: 'http://www.dataaccess.com/webservicesserver/',
      isDefault: false
    },
    wsdlNamespace: {
      key: 'xmlns',
      url: 'http://schemas.xmlsoap.org/wsdl/',
      isDefault: true
    },
    SOAPNamespace: {
      key: 'soap',
      url: 'http://schemas.xmlsoap.org/wsdl/soap/',
      isDefault: false
    },
    SOAP12Namespace: {
      key: 'soap12',
      url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
      isDefault: false
    },
    schemaNamespace: {
      key: 'xs',
      url: 'http://www.w3.org/2001/XMLSchema',
      isDefault: false
    },
    tnsNamespace: {
      key: 'xmlns:tns',
      url: 'http://www.dataaccess.com/webservicesserver/',
      isDefault: false
    },
    allNameSpaces: [{
      key: 'xmlns',
      url: 'http://schemas.xmlsoap.org/wsdl/',
      isDefault: true
    },
    {
      key: 'xmlns:xs',
      url: 'http://www.w3.org/2001/XMLSchema',
      isDefault: false
    },
    {
      key: 'xmlns:soap',
      url: 'http://schemas.xmlsoap.org/wsdl/soap/',
      isDefault: false
    },
    {
      key: 'xmlns:soap12',
      url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
      isDefault: false
    },
    {
      key: 'xmlns:tns',
      url: 'http://www.dataaccess.com/webservicesserver/',
      isDefault: false
    },
    {
      key: 'targetNamespace',
      url: 'http://www.dataaccess.com/webservicesserver/',
      isDefault: false
    }
    ],
    fileName: undefined
  };

describe('WsdlToPostmanCollectionMapper constructor', function() {
  it('Should return a WsdlToPostmanCollectionMapper object', function() {
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject);
    expect(mapper instanceof WsdlToPostmanCollectionMapper).to.be.true;
  });

  it('Should throw an error if wsdlObject is undefined', function() {
    const undefinedWsdl = undefined,
      expectedMessage = 'Wsdl Object must be provided and must not be empty';
    try {
      let mapper = new WsdlToPostmanCollectionMapper(undefinedWsdl);
      assert.fail('We expect an error');
      return mapper;
    }
    catch (error) {
      expect(error.message).to.equal(expectedMessage);
    }
  });

  it('Should throw an error if wsdlObject is null', function() {
    const nullWsdl = null,
      expectedMessage = 'Wsdl Object must be provided and must not be empty';
    try {
      let mapper = new WsdlToPostmanCollectionMapper(nullWsdl);
      assert.fail('We expect an error');
      return mapper;
    }
    catch (error) {
      expect(error.message).to.equal(expectedMessage);
    }
  });
});

describe('WsdlToPostmanCollectionMapper getPostmanCollection', function() {
  it('Should return a PostmanCollection object', function() {
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject);
    let postmanCollection = mapper.getPostmanCollection();
    expect(postmanCollection instanceof Collection).to.be.true;
  });

  describe('WsdlToPostmanCollectionMapper createItemsFromOperations', function() {
    it('Should return postmanCollection items definition from wsdlObject.operationsArray', function() {
      const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject);
      let items = mapper.createItemsFromOperations(wsdlMockObject.operationsArray),
        requests;
      expect(items).to.be.an('array');
      requests = items.map((item) => {
        expect(item).to.include.all.keys('name', 'description', 'request');
        return item.request;
      });
      requests.forEach((request) => {
        expect(request).to.be.an('object')
          .to.include.all.keys('url', 'method', 'header', 'body');
      });
    });
  });
});
