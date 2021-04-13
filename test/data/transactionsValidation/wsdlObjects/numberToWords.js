module.exports = {
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
