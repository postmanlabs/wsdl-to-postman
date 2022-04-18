const {
    assert
  } = require('chai'),
  {
    Collection
  } = require('postman-collection'),
  { XMLParser } = require('../../lib/XMLParser'),
  {
    WsdlToPostmanCollectionMapper,
    DEFAULT_COLLECTION_NAME
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
          type: 'integer',
          maximum: 2147483647,
          minimum: -2147483648
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
          type: 'number'
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
          type: 'integer',
          maximum: 2147483647,
          minimum: -2147483648
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
          type: 'number'
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
    fileName: undefined,
    log: {
      errors: ''
    }
  };

describe('WsdlToPostmanCollectionMapper constructor', function () {
  it('Should return a WsdlToPostmanCollectionMapper object', function () {
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject);
    expect(mapper instanceof WsdlToPostmanCollectionMapper).to.be.true;
  });

  it('Should throw an error if wsdlObject is undefined', function () {
    const undefinedWsdl = undefined,
      expectedMessage = 'Wsdl Object must be provided and must not be empty';
    try {
      let mapper = new WsdlToPostmanCollectionMapper(undefinedWsdl);
      assert.fail(expectedMessage);
      return mapper;
    }
    catch (error) {
      expect(error.message).to.equal(expectedMessage);
    }
  });

  it('Should throw an error if wsdlObject is null', function () {
    const nullWsdl = null,
      expectedMessage = 'Wsdl Object must be provided and must not be empty';
    try {
      let mapper = new WsdlToPostmanCollectionMapper(nullWsdl);
      assert.fail(expectedMessage);
      return mapper;

    }
    catch (error) {
      expect(error.message).to.equal(expectedMessage);
    }
  });
});

describe('WsdlToPostmanCollectionMapper getPostmanCollection', function () {
  it('Should return a PostmanCollection object', function () {
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject);
    let postmanCollection = mapper.getPostmanCollection('collection name', new XMLParser());
    expect(postmanCollection instanceof Collection).to.be.true;
  });

  it(
    'Should return a postman collection with name equals to providedName when it is different than empty string',
    function () {
      const providedName = 'provided name',
        mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject),
        postmanCollection = mapper.getPostmanCollection({}, new XMLParser(), providedName);
      expect(postmanCollection.name).to.be.equal(providedName);
    }
  );

  it(
    `Should return a postman collection with name equals to provided wsdlObject targetNamespace url
    when provided name is equal to empty string`,
    function () {
      const providedEmptyStringName = '',
        expectedName = wsdlMockObject.targetNamespace.url,
        mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject),
        postmanCollection = mapper.getPostmanCollection({}, new XMLParser(), providedEmptyStringName);
      expect(postmanCollection.name).to.be.equal(expectedName);
    }
  );

  it('Should throw an error if provided folderStrategy option is not supported', function () {
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject),
      options = {
        folderStrategy: 'Not supported value'
      },
      FOLDER_OPTIONS = {
        noFolders: 'No folders',
        portEndpoint: 'Port/Endpoint',
        service: 'Service'
      },
      expectedMessage = `Provided folderStrategy option is not supported. 
        Options are ${Object.values(FOLDER_OPTIONS).join(', ')}`;

    try {
      mapper.getPostmanCollection(options);
      assert.fail('Error expected');
    }
    catch (error) {
      expect(error.message.replace(/\s/g, '')).to.be.equal(expectedMessage.replace(/\s/g, ''));
    }
  });
});

describe('WsdlToPostmanCollectionMapper createItemsFromOperations', function () {
  it('Should return postmanCollection items definition from wsdlObject.operationsArray', function () {
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject);
    let urls = mapper.getUrlDataFromOperations(wsdlMockObject.operationsArray),
      urlVariables = mapper.getVariablesFromUrlDataList(urls),
      items = mapper.createItemsFromOperations(wsdlMockObject.operationsArray, urlVariables, undefined,
        new XMLParser()),
      requests;
    expect(items).to.be.an('array');
    requests = items.map((item) => {
      expect(item).to.include.all.keys('name', 'request');
      return item.request;
    });
    requests.forEach((request) => {
      expect(request).to.be.an('object')
        .to.include.all.keys('url', 'method', 'header', 'body', 'description');
    });
  });
});

describe('WsdlToPostmanCollectionMapper getUrlDataFromOperations', function () {
  it('Should an array of urls', function () {
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject);
    let urlsData = mapper.getUrlDataFromOperations(wsdlMockObject.operationsArray);
    expect(urlsData).to.be.an('array');
    urlsData.forEach((urlData) => {
      expect(urlData).to.be.an('object').to.include.all.keys('portName', 'url');
    });
  });
});

describe('WsdlToPostmanCollectionMapper getVariablesFromUrlDataList', function () {
  it('Should return an array of objects with format {key, value}', function () {
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject),
      urlsData = [
        {
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap'
        },
        {
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap12'
        }
      ];
    let variables = mapper.getVariablesFromUrlDataList(urlsData);
    expect(variables).to.be.an('array');
    variables.forEach((variable) => {
      expect(variable).to.be.an('object')
        .to.include.all.keys('key', 'value');
    });
    expect(variables[0].key).to.equal('NumberConversionSoapBaseUrl');
    expect(variables[1].key).to.equal('NumberConversionSoap12BaseUrl');
    expect(variables[0].value).to.equal('https://www.dataaccess.com');
    expect(variables[1].value).to.equal('https://www.dataaccess.com');

  });
});

describe('generateMappingObject method', function () {
  it('Should return a mappingObject with provided name', function () {
    const expectedName = 'providedName',
      mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject),
      mappingObject = mapper.generateMappingObject(wsdlMockObject, {}, expectedName, new XMLParser());
    expect(mappingObject.info.name).to.be.equal(expectedName);
  });
});

describe('getCollectionName method', function () {
  it('Should return the target namespace url', function () {
    const expectedName = 'http://www.dataaccess.com/webservicesserver/',
      mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject),
      collectionName = mapper.getCollectionName('');
    expect(collectionName).to.be.equal(expectedName);
  });

  it('Should return the target namespace url when called without params', function () {
    const expectedName = 'http://www.dataaccess.com/webservicesserver/',
      mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject),
      collectionName = mapper.getCollectionName();
    expect(collectionName).to.be.equal(expectedName);
  });

  it('Should return the default name when target namespace is undefined', function () {
    let wsdlMockObjectToTest = Object.assign({}, wsdlMockObject);
    wsdlMockObjectToTest.targetNamespace = undefined;
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObjectToTest),
      collectionName = mapper.getCollectionName('');
    expect(collectionName).to.be.equal(DEFAULT_COLLECTION_NAME);
  });

  it('Should return the default name when target namespace url is empty', function () {
    let wsdlMockObjectToTest = Object.assign({}, wsdlMockObject);
    wsdlMockObjectToTest.targetNamespace.url = '';
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObjectToTest),
      collectionName = mapper.getCollectionName('');
    expect(collectionName).to.be.equal(DEFAULT_COLLECTION_NAME);
  });

  it('Should return the default name when target namespace url is empty and not provided name', function () {
    let wsdlMockObjectToTest = Object.assign({}, wsdlMockObject);
    wsdlMockObjectToTest.targetNamespace.url = '';
    const mapper = new WsdlToPostmanCollectionMapper(wsdlMockObjectToTest),
      collectionName = mapper.getCollectionName();
    expect(collectionName).to.be.equal(DEFAULT_COLLECTION_NAME);
  });

  it('Should return the provided name when target namespace url is empty', function () {
    const expectedName = 'providedName',
      mapper = new WsdlToPostmanCollectionMapper(wsdlMockObject),
      collectionName = mapper.getCollectionName(expectedName);
    expect(collectionName).to.be.equal(expectedName);
  });


});
