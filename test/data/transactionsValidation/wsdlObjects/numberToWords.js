module.exports = {
  version: '1.1',
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
      namespace: 'http://www.dataaccess.com/webservicesserver/',
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
    protocol: 'soap',
    xpathInfo: {
      xpath: '//definitions//binding[@name="NumberConversionSoapBinding"]' +
        '//operation[@name="NumberToWords"]',
      wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
    }
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
    protocol: 'soap',
    xpathInfo: {
      xpath: '//definitions//binding[@name="NumberConversionSoapBinding"]' +
        '//operation[@name="NumberToDollars"]',
      wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
    }
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
    protocol: 'soap12',
    xpathInfo: {
      xpath: '//pm:definitions//pm:binding[@name="NumberConversionSoapBinding12"]' +
        '//pm:operation[@name="NumberToWords"]',
      wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
    }
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
    protocol: 'soap12',
    xpathInfo: {
      xpath: '//pm:definitions//pm:binding[@name="NumberConversionSoapBinding12"]' +
        '//pm:operation[@name="NumberToDollars"]',
      wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
    }
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
  },
  xmlParsed: {
    definitions: {
      "@_xmlns": "http://schemas.xmlsoap.org/wsdl/",
      "@_xmlns:xs": "http://www.w3.org/2001/XMLSchema",
      "@_xmlns:soap": "http://schemas.xmlsoap.org/wsdl/soap/",
      "@_xmlns:soap12": "http://schemas.xmlsoap.org/wsdl/soap12/",
      "@_xmlns:tns": "http://www.dataaccess.com/webservicesserver/",
      "@_name": "NumberConversion",
      "@_targetNamespace": "http://www.dataaccess.com/webservicesserver/",
      types: {
        "xs:schema": {
          "@_elementFormDefault": "qualified",
          "@_targetNamespace": "http://www.dataaccess.com/webservicesserver/",
          "xs:element": [
            {
              "@_name": "NumberToWords",
              "xs:complexType": {
                "xs:sequence": {
                  "xs:element": {
                    "@_name": "ubiNum",
                    "@_type": "xs:unsignedLong",
                  },
                },
              },
            },
            {
              "@_name": "NumberToWordsResponse",
              "xs:complexType": {
                "xs:sequence": {
                  "xs:element": {
                    "@_name": "NumberToWordsResult",
                    "@_type": "xs:string",
                  },
                },
              },
            },
            {
              "@_name": "NumberToDollars",
              "xs:complexType": {
                "xs:sequence": {
                  "xs:element": {
                    "@_name": "dNum",
                    "@_type": "xs:decimal",
                  },
                },
              },
            },
            {
              "@_name": "NumberToDollarsResponse",
              "xs:complexType": {
                "xs:sequence": {
                  "xs:element": {
                    "@_name": "NumberToDollarsResult",
                    "@_type": "xs:string",
                  },
                },
              },
            },
          ],
        },
      },
      message: [
        {
          "@_name": "NumberToWordsSoapRequest",
          part: {
            "@_name": "parameters",
            "@_element": "tns:NumberToWords",
          },
        },
        {
          "@_name": "NumberToWordsSoapResponse",
          part: {
            "@_name": "parameters",
            "@_element": "tns:NumberToWordsResponse",
          },
        },
        {
          "@_name": "NumberToDollarsSoapRequest",
          part: {
            "@_name": "parameters",
            "@_element": "tns:NumberToDollars",
          },
        },
        {
          "@_name": "NumberToDollarsSoapResponse",
          part: {
            "@_name": "parameters",
            "@_element": "tns:NumberToDollarsResponse",
          },
        },
      ],
      portType: {
        "@_name": "NumberConversionSoapType",
        operation: [
          {
            "@_name": "NumberToWords",
            documentation: "Returns the word corresponding to the positive number passed as parameter. Limited to quadrillions.",
            input: {
              "@_message": "tns:NumberToWordsSoapRequest",
            },
            output: {
              "@_message": "tns:NumberToWordsSoapResponse",
            },
          },
          {
            "@_name": "NumberToDollars",
            documentation: "Returns the non-zero dollar amount of the passed number.",
            input: {
              "@_message": "tns:NumberToDollarsSoapRequest",
            },
            output: {
              "@_message": "tns:NumberToDollarsSoapResponse",
            },
          },
        ],
      },
      binding: [
        {
          "@_name": "NumberConversionSoapBinding",
          "@_type": "tns:NumberConversionSoapType",
          "soap:binding": {
            "@_style": "document",
            "@_transport": "http://schemas.xmlsoap.org/soap/http",
          },
          operation: [
            {
              "@_name": "NumberToWords",
              "soap:operation": {
                "@_soapAction": "",
                "@_style": "document",
              },
              input: {
                "soap:body": {
                  "@_use": "literal",
                },
              },
              output: {
                "soap:body": {
                  "@_use": "literal",
                },
              },
            },
            {
              "@_name": "NumberToDollars",
              "soap:operation": {
                "@_soapAction": "",
                "@_style": "document",
              },
              input: {
                "soap:body": {
                  "@_use": "literal",
                },
              },
              output: {
                "soap:body": {
                  "@_use": "literal",
                },
              },
            },
          ],
        },
        {
          "@_name": "NumberConversionSoapBinding12",
          "@_type": "tns:NumberConversionSoapType",
          "soap12:binding": {
            "@_style": "document",
            "@_transport": "http://schemas.xmlsoap.org/soap/http",
          },
          operation: [
            {
              "@_name": "NumberToWords",
              "soap12:operation": {
                "@_soapAction": "",
                "@_style": "document",
              },
              input: {
                "soap12:body": {
                  "@_use": "literal",
                },
              },
              output: {
                "soap12:body": {
                  "@_use": "literal",
                },
              },
            },
            {
              "@_name": "NumberToDollars",
              "soap12:operation": {
                "@_soapAction": "",
                "@_style": "document",
              },
              input: {
                "soap12:body": {
                  "@_use": "literal",
                },
              },
              output: {
                "soap12:body": {
                  "@_use": "literal",
                },
              },
            },
          ],
        },
      ],
      service: {
        "@_name": "NumberConversion",
        documentation: "The Number Conversion Web Service, implemented with Visual DataFlex, provides functions that convert numbers into words or dollar amounts.",
        port: [
          {
            "@_name": "NumberConversionSoap",
            "@_binding": "tns:NumberConversionSoapBinding",
            "soap:address": {
              "@_location": "https://www.dataaccess.com/webservicesserver/NumberConversion.wso",
            },
          },
          {
            "@_name": "NumberConversionSoap12",
            "@_binding": "tns:NumberConversionSoapBinding12",
            "soap12:address": {
              "@_location": "https://www.dataaccess.com/webservicesserver/NumberConversion.wso",
            },
          },
        ],
      },
    },
  }
};
