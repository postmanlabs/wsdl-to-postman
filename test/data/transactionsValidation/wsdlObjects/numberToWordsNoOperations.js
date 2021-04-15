module.exports = {
  operationsArray: [],
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
