const {
    expect
  } = require('chai'),
  {
    BodyValidator
  } = require('../../../lib/transactionValidator/BodyValidator'),
  {
    XMLParser
  } = require('../../../lib/XMLParser'),
  numberToWordsWSDLObject = require('../../data/transactionsValidation/wsdlObjects/numberToWords'),
  VALID_BODY = '<?xml version=\"1.0\" encoding=\'utf-8\'?>\n<soap:Envelope' +
    ' xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  <soap:Body>\n' +
    '<NumberToWords xmlns=\"http://www.dataaccess.com/webservicesserver/\">\n' +
    '<ubiNum>18446744073709</ubiNum>\n    </NumberToWords>\n  </soap:Body>\n</soap:Envelope>\n',
  INVALID_BODY_TYPE = '<?xml version=\"1.0\" encoding=\'utf-8\'?>\n<soap:Envelope' +
    ' xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  <soap:Body>\n' +
    '<NumberToWords xmlns=\"http://www.dataaccess.com/webservicesserver/\">\n' +
    '<ubiNum>WRONG TYPE</ubiNum>\n    </NumberToWords>\n  </soap:Body>\n</soap:Envelope>\n',
  OPERATION = {
    name: 'NumberToWords',
    description: 'Returns the word corresponding to the positive number passed as parameter.',
    style: 'document',
    url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
    input: [
      {
        children: [
          {
            children: [
            ],
            name: 'ubiNum',
            isComplex: false,
            type: 'integer',
            maximum: 2147483647,
            minimum: -2147483648
          }
        ],
        name: 'NumberToWords',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/',
      }
    ],
    output: [
      {
        children: [
          {
            children: [
            ],
            name: 'NumberToWordsResult',
            isComplex: false,
            type: 'string'
          }
        ],
        name: 'NumberToWordsResponse',
        isComplex: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/'
      }
    ],
    fault: [
      {
        children: [
          {
            children: [
            ],
            name: 'faultcode',
            isComplex: false,
            type: 'string',
          },
        ],
        name: 'fault',
        isComplex: true,
        type: 'complex',
        namespace: '',
      },
    ],
    portName: 'NumberConversionSoap',
    serviceName: 'NumberConversion',
    method: 'POST',
    protocol: 'soap',
    xpathInfo: {
      xpath: '//definitions//binding[@name=\'NumberConversionSoapBinding\']//operation[@name=\'NumberToWords\']',
      wsdlNamespaceUrl: 'http://schemas.xmlsoap.org/wsdl/'
    },
    soapActionSegment: 'NumberToWords',
    soapAction: 'http://www.dataaccess.com/webservicesserver/NumberToWords'
  },
  OPERATION_ELEMENT = {
    children: [
      {
        children: [
        ],
        name: 'ubiNum',
        isComplex: false,
        type: 'integer',
        maximum: 2147483647,
        minimum: -2147483648
      }
    ],
    name: 'NumberToWords',
    isComplex: true,
    type: 'complex',
    namespace: 'http://www.dataaccess.com/webservicesserver/'
  };

describe('BodyValidator', function () {
  it('Should return an empty array when request and response bodies are valid', function() {
    const validator = new BodyValidator(),
      result = validator.validate(VALID_BODY, numberToWordsWSDLObject, OPERATION, false,
        {}, new XMLParser(), OPERATION_ELEMENT);
    expect(result).to.be.an('Array');
    expect(result.length).to.equal(0);
  });

  it('Should have a mismatch INVALID_BODY when a request endpoint has a type error in body', function() {
    const validator = new BodyValidator(),
      result = validator.validate(INVALID_BODY_TYPE, numberToWordsWSDLObject, OPERATION, false,
        {}, new XMLParser(), OPERATION_ELEMENT);
    expect(result).to.be.an('Array');
    expect(result[0]).to.be.an('object').and.to.deep.include({
      'property': 'BODY',
      'reason': 'The request body didn\'t match the specified schema',
      'reasonCode': 'INVALID_BODY',
      'schemaJsonPath':
       '//definitions//binding[@name=\'NumberConversionSoapBinding\']//operation[@name=\'NumberToWords\']',
      'transactionJsonPath': '$.request.body'
    });
  });

  it('Should have a mismatch INVALID_TYPE when a request endpoint has a type error in body option detailed true',
    function() {
      const validator = new BodyValidator(),
        result = validator.validate(INVALID_BODY_TYPE, numberToWordsWSDLObject, OPERATION, false,
          { detailedBlobValidation: true }, new XMLParser(), OPERATION_ELEMENT);
      expect(result).to.be.an('Array');
      expect(result[0]).to.be.an('object').and.to.deep.include({
        'property': 'BODY',
        'reason': 'Element \'ubiNum\': \'WRONG TYPE\' is not a valid value of the atomic type \'xs:unsignedLong\'.\n',
        'reasonCode': 'INVALID_TYPE',
        'schemaJsonPath':
        '//definitions//binding[@name=\'NumberConversionSoapBinding\']//operation[@name=\'NumberToWords\']',
        'transactionJsonPath': '$.request.body'
      });
    });
});
