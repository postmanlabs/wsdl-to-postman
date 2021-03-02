const expect = require('chai').expect,
  {
    validateOperationMessagesWithSchema,
    getCleanSchema,
    validateMessageWithSchema,
    getBodyMessage,
    unwrapAndCleanBody
  } = require('./../../lib/utils/messageWithSchemaValidation');

describe('Tools from messageWithSchemaValidation', function() {
  describe('Test validateMessageWithSchema function', function() {
    const schemaMock = `
      <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <xs:element name="NumberToWords">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="ubiNum" type="xs:unsignedLong"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="NumberToWordsResponse">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="NumberToWordsResult" type="xs:string"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="NumberToDollars">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="dNum" type="xs:decimal"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="NumberToDollarsResponse">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="NumberToDollarsResult" type="xs:string"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:schema>
    `,
      validBody = `
      <NumberToWords >
        <ubiNum>500</ubiNum>
      </NumberToWords>
    `,
      invalidBody = `
      <NumberToWords >
        <ubiNum></ubiNum>
      </NumberToWords>
    `;
    it('should return an empty array when message matches with schema', function() {
      const validResult = validateMessageWithSchema(validBody, schemaMock);
      expect(validResult).to.be.an('array').with.length(0);
    });

    it('should return an array when message does not match with schema', function() {
      const invalidResult = validateMessageWithSchema(invalidBody, schemaMock);
      expect(invalidResult).to.be.an('array').with.length.greaterThan(0);
    });
  });

  describe('Test getBodyMessage function', function() {
    const nodeElementMock = {
        children: [{
          children: [],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'ubiNum',
          type: 'unsignedLong',
          isComplex: false,
          namespace: undefined
        }],
        minOccurs: '1',
        maxOccurs: '1',
        name: 'NumberToWords',
        type: 'complex',
        isComplex: true,
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      },
      cleanBodyMessage = `
        <NumberToWords >
          <ubiNum>500</ubiNum>
        </NumberToWords>
      `;

    it('Should return the clean body message from a provided nodeElement', function() {
      const generatedBodyMessage = getBodyMessage(nodeElementMock, 'soap'),
        cleanGenerated = generatedBodyMessage.replace(/\s/g, ''),
        cleanExpected = cleanBodyMessage.replace(/\s/g, '');
      expect(cleanGenerated).to.be.equal(cleanExpected);
    });
  });

  describe('Test unwrapAndCleanBody function', function() {
    const dirtyMessage = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">
            <ubiNum>500</ubiNum>
          </NumberToWords>
        </soap:Body>
      </soap:Envelope>
    `,
      cleanBodyMessage = `<NumberToWords >
          <ubiNum>500</ubiNum>
        </NumberToWords>
      `;

    it('Should unwrap body and remove namespaces and attributes', function() {
      const unwrappedMessage = unwrapAndCleanBody(dirtyMessage, 'soap'),
        generatedToCompare = unwrappedMessage.replace(/\s/g, ''),
        expectedToCompare = cleanBodyMessage.replace(/\s/g, '');
      expect(generatedToCompare).to.be.equal(expectedToCompare);
    });
  });

  describe('Test getCleanSchema function', function() {
    const xmlParsedMock = {
        definitions: {
          '@_xmlns': 'http://schemas.xmlsoap.org/wsdl/',
          '@_xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
          '@_xmlns:soap': 'http://schemas.xmlsoap.org/wsdl/soap/',
          '@_xmlns:soap12': 'http://schemas.xmlsoap.org/wsdl/soap12/',
          '@_xmlns:tns': 'http://www.dataaccess.com/webservicesserver/',
          '@_name': 'NumberConversion',
          '@_targetNamespace': 'http://www.dataaccess.com/webservicesserver/',
          types: {
            'xs:schema': {
              '@_elementFormDefault': 'qualified',
              '@_targetNamespace': 'http://www.dataaccess.com/webservicesserver/',
              'xs:element': [
                {
                  '@_name': 'NumberToWords',
                  'xs:complexType': {
                    'xs:sequence': {
                      'xs:element': {
                        '@_name': 'ubiNum',
                        '@_type': 'xs:unsignedLong'
                      }
                    }
                  }
                },
                {
                  '@_name': 'NumberToWordsResponse',
                  'xs:complexType': {
                    'xs:sequence': {
                      'xs:element': {
                        '@_name': 'NumberToWordsResult',
                        '@_type': 'xs:string'
                      }
                    }
                  }
                },
                {
                  '@_name': 'NumberToDollars',
                  'xs:complexType': {
                    'xs:sequence': {
                      'xs:element': {
                        '@_name': 'dNum',
                        '@_type': 'xs:decimal'
                      }
                    }
                  }
                },
                {
                  '@_name': 'NumberToDollarsResponse',
                  'xs:complexType': {
                    'xs:sequence': {
                      'xs:element': {
                        '@_name': 'NumberToDollarsResult',
                        '@_type': 'xs:string'
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      },
      schemaNamespaceMock = {
        key: 'xs',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      wsdl_version = '1.1',
      expectedSchema = `
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
          <xs:element name="NumberToWords">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="ubiNum" type="xs:unsignedLong"></xs:element>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToWordsResponse">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="NumberToWordsResult" type="xs:string"></xs:element>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToDollars">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="dNum" type="xs:decimal"></xs:element>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="NumberToDollarsResponse">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="NumberToDollarsResult" type="xs:string"></xs:element>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:schema>
      `;

    it(
      'Should return a schema with base namespace, removed tns and no complexType, tags empty',
      function() {
        const generatedCleanSchema = getCleanSchema(xmlParsedMock, schemaNamespaceMock, wsdl_version),
          generatedCleanSchemaToCompare = generatedCleanSchema.replace(/\s/g, ''),
          expectedSchemaToCompare = expectedSchema.replace(/\s/g, '');
        expect(generatedCleanSchemaToCompare).to.be.equal(expectedSchemaToCompare);
      });

    it('Should throw an error if parsedXml is not provided', function() {
      try {
        getCleanSchema(null, schemaNamespaceMock, wsdl_version);
        assert.fail('We expect an error');
      }
      catch (error) {
        expect(error.message).to.be.equal('Can not get schema from undefined or null object');
      }
    });
  });

  describe('Test validateOperationsMessagesWithSchema function', function() {
    const wsdlObjectMock = {
        'operationsArray': [{
          'name': 'NumberToWords',
          'description': `Returns the word corresponding to the positive number passed as parameter. 
            Limited to quadrillions.`,
          'style': 'document',
          'url': 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          'input': {
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'ubiNum',
              'type': 'unsignedLong',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToWords',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          },
          'output': {
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'NumberToWordsResult',
              'type': 'string',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToWordsResponse',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          },
          'fault': null,
          'portName': 'NumberConversionSoap',
          'serviceName': 'NumberConversion',
          'method': 'POST',
          'protocol': 'soap'
        }, {
          'name': 'NumberToDollars',
          'description': 'Returns the non-zero dollar amount of the passed number.',
          'style': 'document',
          'url': 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          'input': {
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'dNum',
              'type': 'decimal',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToDollars',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          },
          'output': {
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'NumberToDollarsResult',
              'type': 'string',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToDollarsResponse',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          },
          'fault': null,
          'portName': 'NumberConversionSoap',
          'serviceName': 'NumberConversion',
          'method': 'POST',
          'protocol': 'soap'
        }, {
          'name': 'NumberToWords',
          'description': `Returns the word corresponding to the positive number passed as parameter. 
            Limited to quadrillions.`,
          'style': 'document',
          'url': 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          'input': {
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'ubiNum',
              'type': 'unsignedLong',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToWords',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          },
          'output': {
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'NumberToWordsResult',
              'type': 'string',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToWordsResponse',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          },
          'fault': null,
          'portName': 'NumberConversionSoap12',
          'serviceName': 'NumberConversion',
          'method': 'POST',
          'protocol': 'soap12'
        }, {
          'name': 'NumberToDollars',
          'description': 'Returns the non-zero dollar amount of the passed number.',
          'style': 'document',
          'url': 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          'input': {
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'dNum',
              'type': 'decimal',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToDollars',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          },
          'output': {
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'NumberToDollarsResult',
              'type': 'string',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToDollarsResponse',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          },
          'fault': null,
          'portName': 'NumberConversionSoap12',
          'serviceName': 'NumberConversion',
          'method': 'POST',
          'protocol': 'soap12'
        }],
        'targetNamespace': {
          'key': 'targetNamespace',
          'url': 'http://www.dataaccess.com/webservicesserver/',
          'isDefault': false
        },
        'wsdlNamespace': {
          'key': 'xmlns',
          'url': 'http://schemas.xmlsoap.org/wsdl/',
          'isDefault': true
        },
        'SOAPNamespace': {
          'key': 'soap',
          'url': 'http://schemas.xmlsoap.org/wsdl/soap/',
          'isDefault': false
        },
        'SOAP12Namespace': {
          'key': 'soap12',
          'url': 'http://schemas.xmlsoap.org/wsdl/soap12/',
          'isDefault': false
        },
        'HTTPNamespace': null,
        'schemaNamespace': {
          'key': 'xs',
          'url': 'http://www.w3.org/2001/XMLSchema',
          'isDefault': false
        },
        'tnsNamespace': {
          'key': 'xmlns:tns',
          'url': 'http://www.dataaccess.com/webservicesserver/',
          'isDefault': false
        },
        'allNameSpaces': [{
          'key': 'xmlns',
          'url': 'http://schemas.xmlsoap.org/wsdl/',
          'isDefault': true
        }, {
          'key': 'xmlns:xs',
          'url': 'http://www.w3.org/2001/XMLSchema',
          'isDefault': false
        }, {
          'key': 'xmlns:soap',
          'url': 'http://schemas.xmlsoap.org/wsdl/soap/',
          'isDefault': false
        }, {
          'key': 'xmlns:soap12',
          'url': 'http://schemas.xmlsoap.org/wsdl/soap12/',
          'isDefault': false
        }, {
          'key': 'xmlns:tns',
          'url': 'http://www.dataaccess.com/webservicesserver/',
          'isDefault': false
        }, {
          'key': 'targetNamespace',
          'url': 'http://www.dataaccess.com/webservicesserver/',
          'isDefault': false
        }]
      },
      schemaBaseMock = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="NumberToWords">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="ubiNum" type="xs:unsignedLong"></xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="NumberToWordsResponse">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="NumberToWordsResult" type="xs:string"></xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="NumberToDollars">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="dNum" type="xs:decimal"></xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="NumberToDollarsResponse">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="NumberToDollarsResult" type="xs:string"></xs:element>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:schema>`;

    it('Should return an empty array if messages match with schema base', function() {
      const validationErrors = validateOperationMessagesWithSchema(wsdlObjectMock, schemaBaseMock);
      expect(validationErrors).to.be.an('array').with.length(0);
    });
  });
});
