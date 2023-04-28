const expect = require('chai').expect,
  {
    validateOperationMessagesWithSchema,
    getCleanSchema,
    validateMessageWithSchema,
    getBodyMessage,
    unwrapAndCleanBody
  } = require('./../../lib/utils/messageWithSchemaValidation'),
  { XMLParser } = require('../../lib/XMLParser'),
  fs = require('fs'),
  validSchemaFolder = 'test/data/multipleSchemaValidation';


describe('Tools from messageWithSchemaValidation', function () {
  describe('Test validateMessageWithSchema function', function () {
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
    it('should return an empty array when message matches with schema', function () {
      const validResult = validateMessageWithSchema(validBody, schemaMock);
      expect(validResult).to.be.an('array').with.length(0);
    });

    it('should return an array when message does not match with schema', function () {
      const invalidResult = validateMessageWithSchema(invalidBody, schemaMock);
      expect(invalidResult).to.be.an('array').with.length.greaterThan(0);
    });

    it('Should return an error with code 1 when message is empty', function() {
      const schema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="shiporder">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="orderperson" type="xs:string"/>
            <xs:element name="shipto">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="name" type="xs:string"/>
                  <xs:element name="address" type="xs:string"/>
                  <xs:element name="city" type="xs:string"/>
                  <xs:element name="country" type="xs:string"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            <xs:element name="item" maxOccurs="unbounded">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="title" type="xs:string"/>
                  <xs:element name="note" type="xs:string" minOccurs="0"/>
                  <xs:element name="quantity" type="xs:positiveInteger"/>
                  <xs:element name="price" type="xs:decimal"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
          <xs:attribute name="orderid" type="xs:string" use="required"/>
        </xs:complexType>
      </xs:element>
      </xs:schema>`,
        message = '',
        validResult = validateMessageWithSchema(message, schema);
      expect(validResult).to.be.an('array').with.length(1);
      expect(validResult[0].message).to.be.equal(
        'Error validating message'
      );
      expect(validResult[0].code).to.be.equal(
        1
      );
    });

    it('Should return an error with code 1 when message is not a valid xml string', function() {
      const schema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
      <xs:element name="shiporder">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="orderperson" type="xs:string"/>
            <xs:element name="shipto">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="name" type="xs:string"/>
                  <xs:element name="address" type="xs:string"/>
                  <xs:element name="city" type="xs:string"/>
                  <xs:element name="country" type="xs:string"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
            <xs:element name="item" maxOccurs="unbounded">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="title" type="xs:string"/>
                  <xs:element name="note" type="xs:string" minOccurs="0"/>
                  <xs:element name="quantity" type="xs:positiveInteger"/>
                  <xs:element name="price" type="xs:decimal"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          </xs:sequence>
          <xs:attribute name="orderid" type="xs:string" use="required"/>
        </xs:complexType>
      </xs:element>
      
      </xs:schema>`,
        message = '<messageTest><messageTest>',
        validResult = validateMessageWithSchema(message, schema);
      expect(validResult).to.be.an('array').with.length(1);
      expect(validResult[0].message).to.be.equal(
        'Error validating message'
      );
      expect(validResult[0].code).to.be.equal(
        1
      );
    });
  });

  describe('Test getBodyMessage function', function () {
    const nodeElementMock = {
        children: [{
          children: [],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'ubiNum',
          type: 'integer',
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
      cleanBodyMessage = '<NumberToWords><ubiNum>',
      cleanBodyMessage2 = '</ubiNum></NumberToWords>';

    it('Should return the clean body message from a provided nodeElement', function () {
      const generatedBodyMessage = getBodyMessage(nodeElementMock, 'soap'),
        cleanGenerated = generatedBodyMessage.replace(/\s/g, ''),
        cleanExpected = cleanBodyMessage.replace(/\s/g, '');
      cleanExpected2 = cleanBodyMessage2.replace(/\s/g, '');
      expect(cleanGenerated.includes(cleanExpected)).to.equal(true);
      expect(cleanGenerated.includes(cleanExpected2)).to.equal(true);
    });
  });

  describe('Test unwrapAndCleanBody function', function () {
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

    it('Should unwrap body and remove namespaces and attributes', function () {
      const unwrappedMessage = unwrapAndCleanBody(dirtyMessage, 'NumberToWords'),
        generatedToCompare = unwrappedMessage.replace(/\s/g, ''),
        expectedToCompare = cleanBodyMessage.replace(/\s/g, '');
      expect(generatedToCompare).to.be.equal(expectedToCompare);
    });
  });

  describe('Test getCleanSchema function', function () {
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
              'xs:element': [{
                '@_name': 'NumberToWords',
                'xs:complexType': {
                  'xs:sequence': {
                    'xs:element': {
                      '@_name': 'ubiNum',
                      '@_type': 'xs:integer'
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
                      '@_type': 'xs:number'
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
                <xs:element name="ubiNum" type="xs:integer"/>
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
                <xs:element name="dNum" type="xs:number"/>
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
      `;

    it(
      'Should return a schema with base namespace, removed tns and no complexType, tags empty',
      function () {
        const generatedCleanSchema = getCleanSchema(xmlParsedMock, { schemaNamespace: schemaNamespaceMock },
            wsdl_version, new XMLParser()).cleanSchema,
          generatedCleanSchemaToCompare = generatedCleanSchema.replace(/\s/g, ''),
          expectedSchemaToCompare = expectedSchema.replace(/\s/g, '');
        expect(generatedCleanSchemaToCompare).to.be.equal(expectedSchemaToCompare);
      });

    it('Should throw an error if parsedXml is not provided', function () {
      try {
        getCleanSchema(null, { schemaNamespace: schemaNamespaceMock }, wsdl_version);
        assert.fail('We expect an error');
      }
      catch (error) {
        expect(error.message).to.be.equal('Provided WSDL definition is invalid XML.');
      }
    });
  });

  describe('Test validateOperationsMessagesWithSchema function', function () {
    const wsdlObjectMock = {
        'operationsArray': [{
          'name': 'NumberToWords',
          'description': `Returns the word corresponding to the positive number passed as parameter. 
                  Limited to quadrillions.`,
          'style': 'document',
          'url': 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          'input': [{
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'ubiNum',
              'type': 'integer',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToWords',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          }],
          'output': [{
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
          }],
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
          'input': [{
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'dNum',
              'type': 'number',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToDollars',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          }],
          'output': [{
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
          }],
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
          'input': [{
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'ubiNum',
              'type': 'integer',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToWords',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          }],
          'output': [{
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
          }],
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
          'input': [{
            'children': [{
              'children': [],
              'minOccurs': '1',
              'maxOccurs': '1',
              'name': 'dNum',
              'type': 'number',
              'isComplex': false
            }],
            'minOccurs': '1',
            'maxOccurs': '1',
            'name': 'NumberToDollars',
            'type': 'complex',
            'isComplex': true,
            'namespace': 'http://www.dataaccess.com/webservicesserver/'
          }],
          'output': [{
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
          }],
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

    it('Should return an empty array if messages match with schema base', function () {
      const validationErrors = validateOperationMessagesWithSchema(wsdlObjectMock, schemaBaseMock);
      expect(validationErrors).to.be.an('array').with.length(0);
    });
  });

  it('Should validate message with schema', function() {
    const schema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="shiporder">
      <xs:complexType>
        <xs:sequence>
          <xs:element name="orderperson" type="xs:string"/>
          <xs:element name="shipto">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="name" type="xs:string"/>
                <xs:element name="address" type="xs:string"/>
                <xs:element name="city" type="xs:string"/>
                <xs:element name="country" type="xs:string"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
          <xs:element name="item" maxOccurs="unbounded">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="title" type="xs:string"/>
                <xs:element name="note" type="xs:string" minOccurs="0"/>
                <xs:element name="quantity" type="xs:positiveInteger"/>
                <xs:element name="price" type="xs:decimal"/>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:sequence>
        <xs:attribute name="orderid" type="xs:string" use="required"/>
      </xs:complexType>
    </xs:element>
    
    </xs:schema>`,
      message = `<shiporder orderid="123">
        <orderperson>John Smith</orderperson>
        <shipto>
          <name>Ola Nordmann</name>
          <address>Langgt 23</address>
          <city>4000 Stavanger</city>
          <country>Norway</country>
        </shipto>
        <item>
          <title>Empire Burlesque</title>
          <note>Special Edition</note>
          <quantity>1</quantity>
          <price>10.90</price>
        </item>
        <item>
          <title>Hide your heart</title>
          <price>9.90</price>
        </item>
      </shiporder>`,
      validResult = validateMessageWithSchema(message, schema);
    expect(validResult).to.be.an('array').with.length(1);
    expect(validResult[0].message).to.be.equal(
      'Element \'price\': This element is not expected. Expected is one of ( note, quantity ).\n'
    );
  });

  it('Should validate calculator Add message with schema', function() {
    const schema = `
    <s:schema elementFormDefault="qualified" xmlns:s="http://www.w3.org/2001/XMLSchema">
    <s:element name="Add">
        <s:complexType>
            <s:choice>
                <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
            </s:choice>
        </s:complexType>
    </s:element>
    <s:element name="AddResponse">
        <s:complexType>
            <s:sequence>
                <s:element minOccurs="1" maxOccurs="1" name="AddResult" type="s:int" />
            </s:sequence>
        </s:complexType>
    </s:element>
    <s:element name="Subtract">
        <s:complexType>
            <s:sequence>
                <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
            </s:sequence>
        </s:complexType>
    </s:element>
    <s:element name="SubtractResponse">
        <s:complexType>
            <s:sequence>
                <s:element minOccurs="1" maxOccurs="1" name="SubtractResult" type="s:int" />
            </s:sequence>
        </s:complexType>
    </s:element>
    <s:element name="Multiply">
        <s:complexType>
            <s:sequence>
                <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
            </s:sequence>
        </s:complexType>
    </s:element>
    <s:element name="MultiplyResponse">
        <s:complexType>
            <s:sequence>
                <s:element minOccurs="1" maxOccurs="1" name="MultiplyResult" type="s:int" />
            </s:sequence>
        </s:complexType>
    </s:element>
    <s:element name="Divide">
        <s:complexType>
            <s:sequence>
                <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
            </s:sequence>
        </s:complexType>
    </s:element>
    <s:element name="DivideResponse">
        <s:complexType>
            <s:sequence>
                <s:element minOccurs="1" maxOccurs="1" name="DivideResult" type="s:int" />
            </s:sequence>
        </s:complexType>
    </s:element>
  </s:schema>`,
      message = `
      <Add>
        <intA>100</intA
        <intB>100</intB>
      </Add>`,
      result = validateMessageWithSchema(message, schema);
    expect(result[0].message).to.be.equal('Error validating message');
    expect(result[0].code).to.be.equal(1);
  });
});

describe('Validation multi schema', function () {
  it('should return an empty array when message matches with schema', function () {
    const docSource = fs.readFileSync(validSchemaFolder + '/chapter04.xml', 'utf8'),
      schemaSource = fs.readFileSync(validSchemaFolder + '/chapter04ord1.xsd', 'utf8'),
      validResult = validateMessageWithSchema(docSource, schemaSource);
    expect(validResult).to.be.an('array').with.length(0);
  });

  it('should return an array with error when message does not match with schema', function () {
    const docSource = fs.readFileSync(validSchemaFolder + '/chapter04InvalidMessage.xml', 'utf8'),
      schemaSource = fs.readFileSync(validSchemaFolder + '/chapter04ord1.xsd', 'utf8'),
      validResult = validateMessageWithSchema(docSource, schemaSource);
    expect(validResult).to.be.an('array').with.length(1);
    expect(validResult[0].code).to.equal(1824);
  });
});
