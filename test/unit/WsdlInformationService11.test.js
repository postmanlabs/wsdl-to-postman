const { POST_METHOD } = require('../../lib/utils/httpUtils'),
  {
    WsdlInformationService11,
    WSDL_ROOT, SOAP_PROTOCOL,
    HTTP_PROTOCOL,
    SOAP12_PROTOCOL
  } = require('../../lib/WsdlInformationService11'),
  {
    WsdlObject
  } = require('../../lib/WSDLObject'),
  {
    getServices,
    PARSER_ATTRIBUTE_NAME_PLACE_HOLDER,
    getBindings
  } = require('../../lib/WsdlParserCommon'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  expect = require('chai').expect;


describe('WSDL 1.1 parser getPortTypeOperations', function () {

  it('should get an array object representing port operations using default namespace', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <types>
        <xs:schema elementFormDefault="qualified" 
        targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
      </types>
      <message name="NumberToWordsSoapRequest">
        <part name="parameters" element="tns:NumberToWords"/>
      </message>
      <message name="NumberToWordsSoapResponse">
        <part name="parameters" element="tns:NumberToWordsResponse"/>
      </message>
      <message name="NumberToDollarsSoapRequest">
        <part name="parameters" element="tns:NumberToDollars"/>
      </message>
      <message name="NumberToDollarsSoapResponse">
        <part name="parameters" element="tns:NumberToDollarsResponse"/>
      </message>
      <portType name="NumberConversionSoapType">
        <operation name="NumberToWords">
          <documentation>Returns the word corresponding to the 
          positive number passed as parameter. Limited to quadrillions.</documentation>
          <input message="tns:NumberToWordsSoapRequest"/>
          <output message="tns:NumberToWordsSoapResponse"/>
        </operation>
        <operation name="NumberToDollars">
          <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
          <input message="tns:NumberToDollarsSoapRequest"/>
          <output message="tns:NumberToDollarsSoapResponse"/>
        </operation>
      </portType>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, 
        implemented with Visual DataFlex, provides 
        functions that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput),
      portTypeOperations = informationService.getPortTypeOperations(
        parsed
      );
    expect(portTypeOperations).to.be.an('array');
    expect(portTypeOperations.length).to.equal(2);
  });

  it('should get array object representing port operations using default namespace and portypes has operations',
    function () {
      const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/"
      name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
    <portType name="DiscoveryServicePort">
      <operation name="query">
        <input message="cmisw:queryRequest" />
        <output message="cmisw:queryResponse" />
        <fault message="cmisw:cmisException" name="cmisException" />
      </operation>
      <operation name="getContentChanges">
        <input message="cmisw:getContentChangesRequest" />
        <output message="cmisw:getContentChangesResponse" />
        <fault message="cmisw:cmisException" name="cmisException" />
      </operation>
    </portType>
    <portType name="MultiFilingServicePort">
      <operation name="addObjectToFolder">
        <input message="cmisw:addObjectToFolderRequest" />
        <output message="cmisw:addObjectToFolderResponse" />
        <fault message="cmisw:cmisException" name="cmisException" />
      </operation>
      <operation name="removeObjectFromFolder">
        <input message="cmisw:removeObjectFromFolderRequest" />
        <output message="cmisw:removeObjectFromFolderResponse" />
        <fault message="cmisw:cmisException" name="cmisException" />
      </operation>
    </portType>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
          provides functions that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
        informationService = new WsdlInformationService11(),
        xmlParser = new XMLParser();
      let parsed = xmlParser.parseToObject(simpleInput),
        portTypeOperations = informationService.getPortTypeOperations(
          parsed
        );
      expect(portTypeOperations).to.be.an('array');
      expect(portTypeOperations.length).to.equal(4);
    });

  it('should get array object representing port operations using default ns when portypes many and one operations',
    function () {
      const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/"
      name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
    <portType name="DiscoveryServicePort">
      <operation name="query">
        <input message="cmisw:queryRequest" />
        <output message="cmisw:queryResponse" />
        <fault message="cmisw:cmisException" name="cmisException" />
      </operation>
      <operation name="getContentChanges">
        <input message="cmisw:getContentChangesRequest" />
        <output message="cmisw:getContentChangesResponse" />
        <fault message="cmisw:cmisException" name="cmisException" />
      </operation>
    </portType>
    <portType name="MultiFilingServicePort">
      <operation name="addObjectToFolder">
        <input message="cmisw:addObjectToFolderRequest" />
        <output message="cmisw:addObjectToFolderResponse" />
        <fault message="cmisw:cmisException" name="cmisException" />
      </operation>
    </portType>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, 
        implemented with Visual DataFlex, provides functions
          that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
        informationService = new WsdlInformationService11(),
        xmlParser = new XMLParser();
      let parsed = xmlParser.parseToObject(simpleInput),
        portTypeOperations = informationService.getPortTypeOperations(
          parsed
        );
      expect(portTypeOperations).to.be.an('array');
      expect(portTypeOperations.length).to.equal(3);
    });

  it('should get an array object representing port operations using named namespace <wsdl:definitions>', function () {
    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"
      xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
      xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:message name="ISampleService_Test_InputMessage">
        <wsdl:part name="parameters" element="tns:Test" />
    </wsdl:message>
    <wsdl:message name="ISampleService_Test_OutputMessage">
        <wsdl:part name="parameters" element="tns:TestResponse" />
    </wsdl:message>
    <wsdl:message name="ISampleService_XmlMethod_InputMessage">
        <wsdl:part name="parameters" element="tns:XmlMethod" />
    </wsdl:message>
    <wsdl:message name="ISampleService_XmlMethod_OutputMessage">
        <wsdl:part name="parameters" element="tns:XmlMethodResponse" />
    </wsdl:message>
    <wsdl:message name="ISampleService_TestCustomModel_InputMessage">
        <wsdl:part name="parameters" element="tns:TestCustomModel" />
    </wsdl:message>
    <wsdl:message name="ISampleService_TestCustomModel_OutputMessage">
        <wsdl:part name="parameters" element="tns:TestCustomModelResponse" />
    </wsdl:message>
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput),
      portTypeOperations = informationService.getPortTypeOperations(
        parsed
      );
    expect(portTypeOperations).to.be.an('array');
    expect(portTypeOperations.length).to.equal(3);
  });

  it('should throw an error when call with null', function () {
    const informationService = new WsdlInformationService11();
    try {
      informationService.getPortTypeOperations(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get portypes from undefined or null object');
    }
  });

  it('should throw an error when call with undefined', function () {
    const informationService = new WsdlInformationService11();
    try {
      informationService.getPortTypeOperations(
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get portypes from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object', function () {
    const informationService = new WsdlInformationService11();
    try {
      informationService.getPortTypeOperations({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get portypes from object');
    }
  });
});

describe('WSDL 1.1 parser getBindingInfoFromBindingTag', function () {
  it('should get info from binding for soap when binding is soap', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace);
    expect(bindingInfo.protocol).to.equal(SOAP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should get info from binding for soap when binding is soap12', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap12:binding transport="http://schemas.xmlsoap.org/soap12/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace);
    expect(bindingInfo.protocol).to.equal(SOAP12_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should get info from binding for soap when binding is http', function () {

    const simpleInput = `<wsdl:definitions 
    xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/"
      xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
      xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
      xmlns:tns="https://www.w3schools.com/xml/" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
      xmlns:s="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
      xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
      xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
      targetNamespace="https://www.w3schools.com/xml/">
    <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
        <http:binding verb="POST" />
        <wsdl:operation name="FahrenheitToCelsius">
            <http:operation location="/FahrenheitToCelsius" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <http:operation location="/CelsiusToFahrenheit" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="TempConvert">
        <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
            <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
            <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
            <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(
        binding,
        soapNamespace,
        soap12Namespace,
        httpNamespace
      );
    expect(bindingInfo.protocol).to.equal(HTTP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should throw an error when call getBindingInfoFromBindingTag with binding null', function () {
    const informationService = new WsdlInformationService11(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    try {
      informationService.getBindingInfoFromBindingTag(
        null,
        soapNamespace, soap12Namespace
      );
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get binding info from undefined or null object');
    }
  });

  it('should throw an error when call getBindingInfoFromBindingTag with binding undefined', function () {
    const informationService = new WsdlInformationService11(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    try {
      informationService.getBindingInfoFromBindingTag(
        undefined,
        soapNamespace, soap12Namespace
      );
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get binding info from undefined or null object');
    }
  });

  it('should throw an error when call getBindingInfoFromBindingTag with binding an empty object', function () {
    const informationService = new WsdlInformationService11(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    try {
      informationService.getBindingInfoFromBindingTag({},
        soapNamespace, soap12Namespace
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get binding from object');
    }
  });

  it('should throw an error when Cannot get protocol', function () {
    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser();
    try {
      let parsed = xmlParser.parseToObject(simpleInput),
        binding = getBindings(
          parsed,
          WSDL_ROOT
        )[0];
      informationService.getBindingInfoFromBindingTag(binding, undefined, undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot find protocol in those namespaces');
    }
  });

  it('should get info from binding for soap when binding is soap and soap12 is not send', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(binding, soapNamespace, null);
    expect(bindingInfo.protocol).to.equal(SOAP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

});

describe('WSDL 1.1 parser getStyleFromBindingOperation', function () {
  it('should get style from binding operation when binding is soap', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace),
      operation = {};
    operation['soap:operation'] = {
      '@_style': 'document'
    };
    expect(informationService.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('document');
  });

  it('should get style from binding operation when binding is soap 12', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap12:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap12:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(binding, soapNamespace, soap12Namespace),
      operation = {};
    operation['soap12:operation'] = {
      '@_style': 'document'
    };
    expect(informationService.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('document');

  });

  it('should get style from binding operation when binding is http', function () {

    const simpleInput = `<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
    xmlns:tns="https://www.w3schools.com/xml/" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
    targetNamespace="https://www.w3schools.com/xml/">
    <wsdl:portType name="TempConvertSoap">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusSoapIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusSoapOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitSoapIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitSoapOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:portType name="TempConvertHttpPost">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusHttpPostIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusHttpPostOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitHttpPostIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitHttpPostOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
        <http:binding verb="POST" />
        <wsdl:operation name="FahrenheitToCelsius">
            <http:operation location="/FahrenheitToCelsius" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <http:operation location="/CelsiusToFahrenheit" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="TempConvert">
        <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
            <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
            <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
            <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(
        binding,
        soapNamespace,
        soap12Namespace,
        httpNamespace
      ),
      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    expect(informationService.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('');

  });

  it('should throw an error when called with operation null', function () {

    const simpleInput = `<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
    xmlns:tns="https://www.w3schools.com/xml/" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
    targetNamespace="https://www.w3schools.com/xml/">
    <wsdl:portType name="TempConvertSoap">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusSoapIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusSoapOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitSoapIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitSoapOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:portType name="TempConvertHttpPost">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusHttpPostIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusHttpPostOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitHttpPostIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitHttpPostOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
        <http:binding verb="POST" />
        <wsdl:operation name="FahrenheitToCelsius">
            <http:operation location="/FahrenheitToCelsius" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <http:operation location="/CelsiusToFahrenheit" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="TempConvert">
        <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
            <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
            <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
            <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(
        binding,
        soapNamespace,
        soap12Namespace,
        httpNamespace
      ),

      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    try {
      informationService.getStyleFromBindingOperation(null, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get style info from binding operation undefined or null object');
    }
  });

  it('should throw an error when called with operation undefined', function () {

    const simpleInput = `<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
    xmlns:tns="https://www.w3schools.com/xml/" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
    targetNamespace="https://www.w3schools.com/xml/">
    <wsdl:portType name="TempConvertSoap">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusSoapIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusSoapOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitSoapIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitSoapOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:portType name="TempConvertHttpPost">
        <wsdl:operation name="FahrenheitToCelsius">
            <wsdl:input message="tns:FahrenheitToCelsiusHttpPostIn" />
            <wsdl:output message="tns:FahrenheitToCelsiusHttpPostOut" />
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <wsdl:input message="tns:CelsiusToFahrenheitHttpPostIn" />
            <wsdl:output message="tns:CelsiusToFahrenheitHttpPostOut" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
        <http:binding verb="POST" />
        <wsdl:operation name="FahrenheitToCelsius">
            <http:operation location="/FahrenheitToCelsius" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="CelsiusToFahrenheit">
            <http:operation location="/CelsiusToFahrenheit" />
            <wsdl:input>
                <mime:content type="application/x-www-form-urlencoded" />
            </wsdl:input>
            <wsdl:output>
                <mime:mimeXml part="Body" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="TempConvert">
        <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
            <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
            <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
        <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
            <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(
        binding,
        soapNamespace,
        soap12Namespace,
        httpNamespace
      ),

      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    try {
      informationService.getStyleFromBindingOperation(undefined, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get style info from binding operation undefined or null object');
    }
  });

  it('should throw an error when called with operation as empty object', function () {

    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <wsdl:input message="tns:ISampleService_XmlMethod_InputMessage" />
            <wsdl:output message="tns:ISampleService_XmlMethod_OutputMessage" />
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <wsdl:input message="tns:ISampleService_TestCustomModel_InputMessage" />
            <wsdl:output message="tns:ISampleService_TestCustomModel_OutputMessage" />
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding" type="tns:ISampleService">
        <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
        <wsdl:operation name="Test">
            <soap12:operation soapAction="http://tempuri.org/ISampleService/Test" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="XmlMethod">
            <soap12:operation soapAction="http://tempuri.org/ISampleService/XmlMethod" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="TestCustomModel">
            <soap:operation soapAction="http://tempuri.org/ISampleService/TestCustomModel" style="document" />
            <wsdl:input>
                <soap12:body use="literal" />
            </wsdl:input>
            <wsdl:output>
                <soap12:body use="literal" />
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser(),
      soap12Namespace = {
        key: 'soap12',
        url: 'http://schemas.xmlsoap.org/wsdl/soap12/',
        isDefault: 'false'
      },
      httpNamespace = {
        key: 'http',
        url: 'http://schemas.xmlsoap.org/wsdl/http/',
        isDefault: 'false'
      },
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = xmlParser.parseToObject(simpleInput),
      binding = getBindings(
        parsed,
        WSDL_ROOT
      )[0],
      bindingInfo = informationService.getBindingInfoFromBindingTag(
        binding,
        soapNamespace,
        soap12Namespace,
        httpNamespace
      );
    try {
      informationService.getStyleFromBindingOperation({}, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get style info from binding operation');
    }
  });
});

describe('WSDL 1.1 parser getServiceAndServicePortByBindingName', function () {
  it('should get service by binding name', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" 
    targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <portType name="NumberConversionSoapType">
        <operation name="NumberToWords">
          <documentation>Returns the word corresponding to the positive number
            passed as parameter. Limited to quadrillions.</documentation>
          <input message="tns:NumberToWordsSoapRequest"/>
          <output message="tns:NumberToWordsSoapResponse"/>
        </operation>
        <operation name="NumberToDollars">
          <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
          <input message="tns:NumberToDollarsSoapRequest"/>
          <output message="tns:NumberToDollarsSoapResponse"/>
        </operation>
      </portType>
      <binding name="NumberConversionSoapBinding" type="tns:NumberConversionSoapType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="NumberToWords">
          <soap:operation soapAction="" style="document"/>
          <input>
            <soap:body use="literal"/>
          </input>
          <output>
            <soap:body use="literal"/>
          </output>
        </operation>
        <operation name="NumberToDollars">
          <soap:operation soapAction="" style="document"/>
          <input>
            <soap:body use="literal"/>
          </input>
          <output>
            <soap:body use="literal"/>
          </output>
        </operation>
      </binding>
      <binding name="NumberConversionSoapBinding12" type="tns:NumberConversionSoapType">
        <soap12:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="NumberToWords">
          <soap12:operation soapAction="" style="document"/>
          <input>
            <soap12:body use="literal"/>
          </input>
          <output>
            <soap12:body use="literal"/>
          </output>
        </operation>
        <operation name="NumberToDollars">
          <soap12:operation soapAction="" style="document"/>
          <input>
            <soap12:body use="literal"/>
          </input>
          <output>
            <soap12:body use="literal"/>
          </output>
        </operation>
      </binding>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
          provides functions that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput);
    services = getServices(parsed, WSDL_ROOT);
    service = informationService.getServiceAndServicePortByBindingName(
      'NumberConversionSoapBinding',
      services,
      '').service;
    expect(service).to.be.an('object');
    expect(service[PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('NumberConversion');
  });


  it('should throw an error when binding name is null', function () {
    informationService = new WsdlInformationService11();
    try {
      informationService.getServiceAndServicePortByBindingName(null, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });
  it('should throw an error when binding name is undefined', function () {
    informationService = new WsdlInformationService11();
    try {
      informationService.getServiceAndServicePortByBindingName(undefined, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });
  it('should throw an error when binding name is an empty string', function () {
    informationService = new WsdlInformationService11();
    try {
      informationService.getServiceAndServicePortByBindingName('', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });

  it('should throw an error when PrincipalPrefix is undefined', function () {
    informationService = new WsdlInformationService11();
    try {
      informationService.getServiceAndServicePortByBindingName('somename', {}, undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('PrincipalPrefix must have a value');
    }
  });
  it('should throw an error when PrincipalPrefix is null', function () {
    informationService = new WsdlInformationService11();
    try {
      informationService.getServiceAndServicePortByBindingName('somename', {}, null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('PrincipalPrefix must have a value');
    }
  });

  it('should get undefined when services is null', function () {
    let wsdlObject = new WsdlObject(),
      informationService = new WsdlInformationService11(),
      service = informationService.getServiceAndServicePortByBindingName(
        'somename',
        null,
        'principal prefix',
        wsdlObject
      );
    expect(service).to.equal(undefined);
  });

  it('should get undefined when services is undefined', function () {
    let wsdlObject = new WsdlObject(),
      informationService = new WsdlInformationService11(),
      service = informationService.getServiceAndServicePortByBindingName(
        'somename',
        undefined,
        'principal prefix',
        wsdlObject
      );
    expect(service).to.equal(undefined);

  });

  it('should throw an error when services is an empty object', function () {
    let wsdlObject = new WsdlObject(),
      informationService = new WsdlInformationService11(),
      service = informationService.getServiceAndServicePortByBindingName(
        'somename',
        {},
        'principal prefix',
        wsdlObject
      );
    expect(service).to.equal(undefined);
  });

});

describe('WSDL 1.1 parser getPortTypeOperationByPortTypeNameAndOperationName', function () {
  it('should get portType by name', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema" 
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" 
    targetNamespace="http://www.dataaccess.com/webservicesserver/">
      <portType name="NumberConversionSoapType">
        <operation name="NumberToWords">
          <documentation>Returns the word corresponding to the positive number
           passed as parameter. Limited to quadrillions.</documentation>
          <input message="tns:NumberToWordsSoapRequest"/>
          <output message="tns:NumberToWordsSoapResponse"/>
        </operation>
        <operation name="NumberToDollars">
          <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
          <input message="tns:NumberToDollarsSoapRequest"/>
          <output message="tns:NumberToDollarsSoapResponse"/>
        </operation>
      </portType>
      <binding name="NumberConversionSoapBinding" type="tns:NumberConversionSoapType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="NumberToWords">
          <soap:operation soapAction="" style="document"/>
          <input>
            <soap:body use="literal"/>
          </input>
          <output>
            <soap:body use="literal"/>
          </output>
        </operation>
        <operation name="NumberToDollars">
          <soap:operation soapAction="" style="document"/>
          <input>
            <soap:body use="literal"/>
          </input>
          <output>
            <soap:body use="literal"/>
          </output>
        </operation>
      </binding>
      <binding name="NumberConversionSoapBinding12" type="tns:NumberConversionSoapType">
        <soap12:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="NumberToWords">
          <soap12:operation soapAction="" style="document"/>
          <input>
            <soap12:body use="literal"/>
          </input>
          <output>
            <soap12:body use="literal"/>
          </output>
        </operation>
        <operation name="NumberToDollars">
          <soap12:operation soapAction="" style="document"/>
          <input>
            <soap12:body use="literal"/>
          </input>
          <output>
            <soap12:body use="literal"/>
          </output>
        </operation>
      </binding>
      <service name="NumberConversion">
        <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
         provides functions that convert numbers into words or dollar amounts.</documentation>
        <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
          <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
        <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
          <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
        </port>
      </service>
    </definitions>`,
      informationService = new WsdlInformationService11(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput);
    services = getServices(parsed, WSDL_ROOT);
    service = informationService.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
      'NumberToWords', parsed, '');
    expect(service).to.be.an('object');
    expect(service[PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('NumberToWords');
  });

  it('should throw an error when parsedxml is null', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', null, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get porttype from undefined or null object');
    }
  });

  it('should throw an error when parsedxml is undefined', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', undefined, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get porttype from undefined or null object');
    }
  });

  it('should throw an error when parsedxml is an empty object', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type from object');
    }
  });


  it('should throw an error when portTypeName is null', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName(null,
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter name');
    }
  });

  it('should throw an error when portTypeName is undefined', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName(undefined,
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter name');
    }
  });

  it('should throw an error when portTypeName is an empty string', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName('',
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter name');
    }
  });

  it('should throw an error when operationName is null', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName('some string',
        null, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter operationName');
    }
  });

  it('should throw an error when operationName is undefined', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName('some string',
        undefined, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter operationName');
    }
  });

  it('should throw an error when operationName is an empty string', function () {
    try {
      const informationService = new WsdlInformationService11();
      informationService.getPortTypeOperationByPortTypeNameAndOperationName('ddd',
        '', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter operationName');
    }
  });

});
