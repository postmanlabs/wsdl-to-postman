const expect = require('chai').expect,
  assert = require('chai').assert,
  WsdlObject = require('../../lib/WSDLObject').WsdlObject,
  {
    DOC_HAS_NO_BINDIGS_MESSAGE,
    DOC_HAS_NO_BINDIGS_OPERATIONS_MESSAGE,
    DOC_HAS_NO_SERVICE_PORT_MESSAGE
  } = require('../../lib/constants/messageConstants'),
  {
    POST_METHOD
  } = require('../../lib/utils/httpUtils'),
  {
    Wsdl11Parser,
    WSDL_NS_URL,
    SOAP_NS_URL,
    SOAP_12_NS_URL,
    SCHEMA_NS_URL,
    TARGETNAMESPACE_KEY,
    TNS_NS_KEY,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL,
    HTTP_PROTOCOL
  } = require('../../lib/Wsdl11Parser'),
  {
    PARSER_ATRIBUTE_NAME_PLACE_HOLDER
  } = require('../../lib/WsdlParserCommon'),
  fs = require('fs'),
  specialCasesWSDLs = 'test/data/specialCases',
  numberConvertionSecurity = 'test/data/auth/usernameToken/NoSecurityBinding.wsdl',
  NUMBERCONVERSION_INPUT = `
  <?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
<types>
<xs:schema elementFormDefault="qualified" targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
  <documentation>Returns the word corresponding 
  to the positive number passed as parameter. Limited to quadrillions.</documentation>
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
</definitions>
`,
  TEMPERATURE_CONVERTER = `<wsdl:definitions xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
  xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
  xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
  xmlns:tns="https://www.w3schools.com/xml/" 
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
  xmlns:s="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
  xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
  xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="https://www.w3schools.com/xml/">
<wsdl:types>
    <s:schema elementFormDefault="qualified" targetNamespace="https://www.w3schools.com/xml/">
        <s:element name="FahrenheitToCelsius">
            <s:complexType>
                <s:sequence>
                    <s:element minOccurs="0" maxOccurs="1" name="Fahrenheit" type="s:string" />
                </s:sequence>
            </s:complexType>
        </s:element>
        <s:element name="FahrenheitToCelsiusResponse">
            <s:complexType>
                <s:sequence>
                    <s:element minOccurs="0" maxOccurs="1" name="FahrenheitToCelsiusResult" type="s:string" />
                </s:sequence>
            </s:complexType>
        </s:element>
        <s:element name="CelsiusToFahrenheit">
            <s:complexType>
                <s:sequence>
                    <s:element minOccurs="0" maxOccurs="1" name="Celsius" type="s:string" />
                </s:sequence>
            </s:complexType>
        </s:element>
        <s:element name="CelsiusToFahrenheitResponse">
            <s:complexType>
                <s:sequence>
                    <s:element minOccurs="0" maxOccurs="1" name="CelsiusToFahrenheitResult" type="s:string" />
                </s:sequence>
            </s:complexType>
        </s:element>
        <s:element name="string" nillable="true" type="s:string" />
    </s:schema>
</wsdl:types>
<wsdl:message name="FahrenheitToCelsiusSoapIn">
    <wsdl:part name="parameters" element="tns:FahrenheitToCelsius" />
</wsdl:message>
<wsdl:message name="FahrenheitToCelsiusSoapOut">
    <wsdl:part name="parameters" element="tns:FahrenheitToCelsiusResponse" />
</wsdl:message>
<wsdl:message name="CelsiusToFahrenheitSoapIn">
    <wsdl:part name="parameters" element="tns:CelsiusToFahrenheit" />
</wsdl:message>
<wsdl:message name="CelsiusToFahrenheitSoapOut">
    <wsdl:part name="parameters" element="tns:CelsiusToFahrenheitResponse" />
</wsdl:message>
<wsdl:message name="FahrenheitToCelsiusHttpPostIn">
    <wsdl:part name="Fahrenheit" type="s:string" />
</wsdl:message>
<wsdl:message name="FahrenheitToCelsiusHttpPostOut">
    <wsdl:part name="Body" element="tns:string" />
</wsdl:message>
<wsdl:message name="CelsiusToFahrenheitHttpPostIn">
    <wsdl:part name="Celsius" type="s:string" />
</wsdl:message>
<wsdl:message name="CelsiusToFahrenheitHttpPostOut">
    <wsdl:part name="Body" element="tns:string" />
</wsdl:message>
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
<wsdl:binding name="TempConvertSoap" type="tns:TempConvertSoap">
    <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
    <wsdl:operation name="FahrenheitToCelsius">
        <soap:operation soapAction="https://www.w3schools.com/xml/FahrenheitToCelsius" style="document" />
        <wsdl:input>
            <soap:body use="literal" />
        </wsdl:input>
        <wsdl:output>
            <soap:body use="literal" />
        </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="CelsiusToFahrenheit">
        <soap:operation soapAction="https://www.w3schools.com/xml/CelsiusToFahrenheit" style="document" />
        <wsdl:input>
            <soap:body use="literal" />
        </wsdl:input>
        <wsdl:output>
            <soap:body use="literal" />
        </wsdl:output>
    </wsdl:operation>
</wsdl:binding>
<wsdl:binding name="TempConvertSoap12" type="tns:TempConvertSoap">
    <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
    <wsdl:operation name="FahrenheitToCelsius">
        <soap12:operation soapAction="https://www.w3schools.com/xml/FahrenheitToCelsius" style="document" />
        <wsdl:input>
            <soap12:body use="literal" />
        </wsdl:input>
        <wsdl:output>
            <soap12:body use="literal" />
        </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="CelsiusToFahrenheit">
        <soap12:operation soapAction="https://www.w3schools.com/xml/CelsiusToFahrenheit" style="document" />
        <wsdl:input>
            <soap12:body use="literal" />
        </wsdl:input>
        <wsdl:output>
            <soap12:body use="literal" />
        </wsdl:output>
    </wsdl:operation>
</wsdl:binding>
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
`;

describe('WSDL 1.1 parser constructor', function() {
  it('should get an object wsdl 1.1 parser', function() {
    const parser = new Wsdl11Parser();
    expect(parser).to.be.an('object');
  });

});

describe('WSDL 1.1 parser parseFromXmlToObject', function() {

  it('should get an object in memory representing xml object with valid input', function() {
    const simpleInput = `<user is='great'>
    <name>Tobias</name>
    <familyName>Nickel</familyName>
    <profession>Software Developer</profession>
    <location>Shanghai / China</location>
    </user>`,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    expect(parsed).to.be.an('object');
    expect(parsed).to.have.own.property('user');
    expect(parsed.user).to.have.own.property('name');
    expect(parsed.user[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'is']).to.equal('great');

  });
  it('should throw an error when input is an empty string', function() {
    parser = new Wsdl11Parser();
    try {
      parser.parseFromXmlToObject('');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });
  it('should throw an error when input is null', function() {
    parser = new Wsdl11Parser();
    try {
      parser.parseFromXmlToObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });
  it('should throw an error when input is undefined', function() {
    parser = new Wsdl11Parser();
    try {
      parser.parseFromXmlToObject(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });
  it('should throw an error when input is empty', function() {
    parser = new Wsdl11Parser();
    try {
      parser.parseFromXmlToObject();
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });
  it('should throw an error when input is not xml', function() {
    parser = new Wsdl11Parser();
    try {
      parser.parseFromXmlToObject('this is not an xml');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Not xml file found in your document');
    }
  });
});

describe('WSDL 1.1 parser getNamespaceByURL', function() {

  it('should get an object of wsdl namespace when is using wsdl as default <definitions>', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
    <types>
      <xs:schema elementFormDefault="qualified" 
      targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
    <message name="NumberToDollarsSoapRequest">
      <part name="parameters" element="tns:NumberToDollars"/>
    </message>
    <message name="NumberToDollarsSoapResponse">
      <part name="parameters" element="tns:NumberToDollarsResponse"/>
    </message>
    <portType name="NumberConversionSoapType">
      <operation name="NumberToDollars">
        <documentation>Returns the non-zero dollar amount of the passed number.</documentation>
        <input message="tns:NumberToDollarsSoapRequest"/>
        <output message="tns:NumberToDollarsSoapResponse"/>
      </operation>
    </portType>
    <binding name="NumberConversionSoapBinding" type="tns:NumberConversionSoapType">
      <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
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
    </service>
  </definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByURL(
        parsed,
        WSDL_NS_URL
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('xmlns');
    expect(wsdlnamespace.url).to.equal(WSDL_NS_URL);
    expect(wsdlnamespace.isDefault).to.equal(true);

  });

  it('should get an object of wsdl namespace when is using wsdl as namespace <wsdl:definitions>', function() {
    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="http://tempuri.org/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract"
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:types>
        <xsd:schema elementFormDefault="qualified" targetNamespace="http://tempuri.org/">
            <xsd:import namespace="http://schemas.microsoft.com/2003/10/Serialization/Arrays" />
            <xsd:import namespace="http://schemas.datacontract.org/2004/07/System" />
            <xsd:element name="Test">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element minOccurs="0" maxOccurs="1" name="inputString" type="xsd:string" />
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            <xsd:element name="TestResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element minOccurs="0" maxOccurs="1" name="TestResult" type="xsd:string" />
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </wsdl:types>
    <wsdl:message name="ISampleService_Test_InputMessage">
        <wsdl:part name="parameters" element="tns:Test" />
    </wsdl:message>
    <wsdl:message name="ISampleService_Test_OutputMessage">
        <wsdl:part name="parameters" element="tns:TestResponse" />
    </wsdl:message>
    <wsdl:portType name="ISampleService">
        <wsdl:operation name="Test">
            <wsdl:input message="tns:ISampleService_Test_InputMessage" />
            <wsdl:output message="tns:ISampleService_Test_OutputMessage" />
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
    </wsdl:binding>
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>

    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByURL(
        parsed,
        WSDL_NS_URL
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('wsdl');
    expect(wsdlnamespace.url).to.equal(WSDL_NS_URL);
    expect(wsdlnamespace.isDefault).to.equal(false);

  });

  it('should get an object of soap namespace when is using wsdl as default <definitions>', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
    <service name="NumberConversion">
      <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
       provides functions that convert numbers into words or dollar amounts.</documentation>
      <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
        <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
      </port>
    </service>
  </definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByURL(
        parsed,
        SOAP_NS_URL
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('soap');
    expect(wsdlnamespace.url).to.equal(SOAP_NS_URL);
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should get an object of soap12 namespace when is using wsdl as default <definitions>', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
    <service name="NumberConversion">
      <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
       provides functions that convert numbers into words or dollar amounts.</documentation>
      <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
        <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
      </port>
    </service>
  </definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByURL(
        parsed,
        SOAP_12_NS_URL
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('soap12');
    expect(wsdlnamespace.url).to.equal(SOAP_12_NS_URL);
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should get an object of schema namespace when is using wsdl as default <definitions>', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
    <service name="NumberConversion">
      <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
       provides functions that convert numbers into words or dollar amounts.</documentation>
      <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
        <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
      </port>
    </service>
  </definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByURL(
        parsed,
        SCHEMA_NS_URL
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('xs');
    expect(wsdlnamespace.url).to.equal(SCHEMA_NS_URL);
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should throw an error when url input is an empty string', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      parser.getNamespaceByURL(
        parsed,
        ''
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('URL must not be empty');
    }
  });

  it('should throw an error when url input is undefined', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      parser.getNamespaceByURL(
        parsed,
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('URL must not be empty');
    }
  });

  it('should throw an error when url input is null', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      parser.getNamespaceByURL(
        parsed,
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('URL must not be empty');
    }
  });

  it('should throw an error when parsed is an empty string', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getNamespaceByURL(
        '',
        WSDL_NS_URL
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is undefined', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getNamespaceByURL(
        undefined,
        WSDL_NS_URL
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getNamespaceByURL(
        null,
        WSDL_NS_URL
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is object no expected properties', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getNamespaceByURL({},
        WSDL_NS_URL
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from object');
    }
  });

  it('should return null and not error when namespace not found', function() {
    const simpleInput = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="http://tempuri.org/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract"
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata"
    targetNamespace="http://tempuri.org/" name="ISampleService">
    <wsdl:service name="ISampleService">
        <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
            <soap:address location="https://localhost:5001/Service.asmx" />
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByURL(
        parsed,
        WSDL_NS_URL
      );
    expect(wsdlnamespace).to.equal(null);
  });


});

describe('WSDL 1.1 parser getPrincipalPrefix', function() {

  it('should get empty string when called with <definitions>', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      principalPrefix = parser.getPrincipalPrefix(
        parsed
      );
    expect(principalPrefix).to.equal('');

  });

  it('should get "wsdl:" when called with <wsdl:definitions>', function() {
    const simpleInput = `<wsdl:definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </wsdl:definitions>
   `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      principalPrefix = parser.getPrincipalPrefix(
        parsed
      );
    expect(principalPrefix).to.equal('wsdl:');

  });

  it('should throw error when called with null', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getPrincipalPrefix(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get prefix from undefined or null object');
    }
  });

  it('should throw error when called with undefined', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getPrincipalPrefix(
        undefined
      );
      assert.fail('we expected an error');

    }
    catch (error) {
      expect(error.message).to.equal('Can not get prefix from undefined or null object');
    }
  });

  it('should throw an error when called with object no expected properties', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getPrincipalPrefix({});
      assert.fail('we expected an error');

    }
    catch (error) {
      expect(error.message).to.equal('Can not get prefix from object');
    }
  });

});

describe('WSDL 1.1 parser getNamespaceByKey', function() {

  it('should get an object of targetNamespace namespace when is using wsdl as default <definitions>', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByKey(
        parsed,
        TARGETNAMESPACE_KEY
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('targetNamespace');
    expect(wsdlnamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should get an object of tns namespace when is using wsdl as default <definitions>', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByKey(
        parsed,
        TNS_NS_KEY
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('tns');
    expect(wsdlnamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should get an object of targetNamespace ns when is using wsdl as ns <wsdl:definitions>', function() {
    const simpleInput = `<wsdl:definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </wsdl:definitions>
    `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByKey(
        parsed,
        TARGETNAMESPACE_KEY
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal(TARGETNAMESPACE_KEY);
    expect(wsdlnamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should throw an error when key input is an empty string', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      parser.getNamespaceByKey(
        parsed,
        ''
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when key input is string null', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      parser.getNamespaceByKey(
        parsed,
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when key input is undefined', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      parser.getNamespaceByKey(
        parsed,
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when parsed is undefined', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getNamespaceByKey(
        undefined,
        TARGETNAMESPACE_KEY
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getNamespaceByKey({},
        TARGETNAMESPACE_KEY
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from object');
    }
  });
});

describe('WSDL 1.1 parser getAllNamespaces', function() {

  it('should get an array with all namespaces using wsdl as default <definitions>', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </definitions>
    `,
      parser = new Wsdl11Parser();
    let xmlns = {},
      parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getAllNamespaces(
        parsed
      );
    expect(wsdlnamespace).to.be.an('array');
    expect(wsdlnamespace.length).to.equal(6);
    xmlns = wsdlnamespace.find((namespace) => {
      return namespace.url === WSDL_NS_URL;
    });
    expect(xmlns.isDefault).to.equal(true);
  });

  it('should throw an error when parsed is undefined', function() {
    const parser = new Wsdl11Parser();
    try {
      let wsdlnamespace = parser.getAllNamespaces(
        undefined
      );
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(6);
      wsdlnamespace.find((namespace) => {
        return namespace.url === WSDL_NS_URL;
      });
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespaces from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function() {
    const parser = new Wsdl11Parser();
    try {
      let wsdlnamespace = parser.getAllNamespaces(
        null
      );
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(6);
      wsdlnamespace.find((namespace) => {
        return namespace.url === WSDL_NS_URL;
      });
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespaces from undefined or null object');
    }
  });

  it('should throw an error when parsed is an empty object', function() {
    const parser = new Wsdl11Parser();
    try {
      let wsdlnamespace = parser.getAllNamespaces({});
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(6);
      wsdlnamespace.find((namespace) => {
        return namespace.url === WSDL_NS_URL;
      });
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespaces from object');
    }
  });

  it('should get an array with all namespaces using wsdl as namespace <wsdl:definitions>', function() {
    const simpleInput = `<wsdl:definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </wsdl:definitions>
    `,
      parser = new Wsdl11Parser();
    let xmlns = {},
      parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getAllNamespaces(
        parsed
      );
    expect(wsdlnamespace).to.be.an('array');
    expect(wsdlnamespace.length).to.equal(6);
    xmlns = wsdlnamespace.find((namespace) => {
      return namespace.url === WSDL_NS_URL;
    });
    expect(xmlns.isDefault).to.equal(true);
  });

});

describe('WSDL 1.1 parser assignNamespaces', function() {

  it('should assign namespaces to wsdl object', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
   <service name="NumberConversion">
     <documentation>The Number Conversion Web Service, implemented with Visual DataFlex,
      provides functions that convert numbers into words or dollar amounts.</documentation>
     <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
       <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
     </port>
   </service>
 </definitions>`,
      parser = new Wsdl11Parser();
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(simpleInput);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);

    expect(wsdlObject).to.have.all.keys('targetNamespace',
      'wsdlNamespace', 'SOAPNamespace', 'HTTPNamespace',
      'SOAP12Namespace', 'schemaNamespace',
      'tnsNamespace', 'allNameSpaces', 'fileName', 'log',
      'operationsArray', 'securityPolicyArray',
      'securityPolicyNamespace');

    expect(wsdlObject.targetNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlObject.tnsNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlObject.wsdlNamespace.key).to.equal('xmlns');
    expect(wsdlObject.SOAPNamespace.key).to.equal('soap');
    expect(wsdlObject.SOAP12Namespace.key).to.equal('soap12');
    expect(wsdlObject.schemaNamespace.key).to.equal('xs');
    expect(wsdlObject.schemaNamespace.prefixFilter).to.equal('xs:');

  });

});

describe('WSDL 1.1 parser assignSecurity', function() {
  it('Should return a wsdlObject with securityPolicyArray if file has security', function() {
    const parser = new Wsdl11Parser();
    fileContent = fs.readFileSync(numberConvertionSecurity, 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    wsdlObject = parser.assignSecurity(wsdlObject, parsed);

    expect(wsdlObject).to.be.an('object').to.include.key('securityPolicyArray');
  });
});

describe('WSDL 1.1 parser getPortTypeOperations', function() {

  it('should get an array object representing port operations using default namespace', function() {
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
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      portTypeOperations = parser.getPortTypeOperations(
        parsed
      );
    expect(portTypeOperations).to.be.an('array');
    expect(portTypeOperations.length).to.equal(2);
  });

  it('should get array object representing port operations using default namespace and portypes has operations',
    function() {
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
        parser = new Wsdl11Parser();
      let parsed = parser.parseFromXmlToObject(simpleInput),
        portTypeOperations = parser.getPortTypeOperations(
          parsed
        );
      expect(portTypeOperations).to.be.an('array');
      expect(portTypeOperations.length).to.equal(4);
    });

  it('should get array object representing port operations using default ns when portypes many and one operations',
    function() {
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
        parser = new Wsdl11Parser();
      let parsed = parser.parseFromXmlToObject(simpleInput),
        portTypeOperations = parser.getPortTypeOperations(
          parsed
        );
      expect(portTypeOperations).to.be.an('array');
      expect(portTypeOperations.length).to.equal(3);
    });

  it('should get an array object representing port operations using named namespace <wsdl:definitions>', function() {
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
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      portTypeOperations = parser.getPortTypeOperations(
        parsed
      );
    expect(portTypeOperations).to.be.an('array');
    expect(portTypeOperations.length).to.equal(3);
  });

  it('should throw an error when call with null', function() {
    try {
      parser.getPortTypeOperations(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get portypes from undefined or null object');
    }
  });

  it('should throw an error when call with undefined', function() {
    try {
      parser.getPortTypeOperations(
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get portypes from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object', function() {
    try {
      parser.getPortTypeOperations({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get portypes from object');
    }
  });
});

describe('WSDL 1.1 parser getBindings', function() {
  it('should get an array object representing bindings using default namespace', function() {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      bindings = parser.getBindings(
        parsed
      );
    expect(bindings).to.be.an('array');
    expect(bindings.length).to.equal(2);
  });

  it('should get an array object representing bindings using named namespace <wsdl:definitions>', function() {
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
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      bindings = parser.getBindings(
        parsed
      );
    expect(bindings).to.be.an('array');
    expect(bindings.length).to.equal(1);
  });

  it('should throw an error when call with null', function() {
    try {
      parser.getBindings(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get bindings from undefined or null object');
    }
  });

  it('should throw an error when call with undefined', function() {
    try {
      parser.getBindings(
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get bindings from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object', function() {
    try {
      parser.getBindings({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get bindings from object');
    }
  });
});

describe('WSDL 1.1 parser getServices', function() {
  it('should get an array object representing services using default namespace', function() {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      services = parser.getServices(
        parsed
      );
    expect(services).to.be.an('array');
    expect(services.length).to.equal(1);
  });

  it('should get an array object representing services using named namespace <wsdl:definitions>', function() {
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
    <wsdl:service name="ISampleService2">
    <wsdl:port name="BasicHttpBinding" binding="tns:BasicHttpBinding">
        <soap:address location="https://localhost:5001/Service.asmx" />
    </wsdl:port>
  </wsdl:service>
</wsdl:definitions>
`,
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      services = parser.getServices(
        parsed
      );
    expect(services).to.be.an('array');
    expect(services.length).to.equal(2);
  });

  it('should throw an error when call with null', function() {
    try {
      parser.getServices(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get services from undefined or null object');
    }
  });

  it('should throw an error when call with undefined', function() {
    try {
      parser.getServices(
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get services from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object', function() {
    try {
      parser.getServices({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get services from object');
    }
  });
});

describe('WSDL 1.1 parser getBindingInfoFromBindinTag', function() {
  it('should get info from binding for soap when binding is soap', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace);
    expect(bindingInfo.protocol).to.equal(SOAP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should get info from binding for soap when binding is soap12', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace);
    expect(bindingInfo.protocol).to.equal(SOAP12_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should get info from binding for soap when binding is http', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace, httpNamespace);
    expect(bindingInfo.protocol).to.equal(HTTP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

  it('should throw an error when call getBindingInfoFromBindinTag with binding null', function() {
    const parser = new Wsdl11Parser(),
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
      parser.getBindingInfoFromBindinTag(
        null,
        soapNamespace, soap12Namespace
      );
    }
    catch (error) {
      expect(error.message).to.equal('Can not get binding info from undefined or null object');
    }
  });

  it('should throw an error when call getBindingInfoFromBindinTag with binding undefined', function() {
    const parser = new Wsdl11Parser(),
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
      parser.getBindingInfoFromBindinTag(
        undefined,
        soapNamespace, soap12Namespace
      );
    }
    catch (error) {
      expect(error.message).to.equal('Can not get binding info from undefined or null object');
    }
  });

  it('should throw an error when call getBindingInfoFromBindinTag with binding an empty object', function() {
    const parser = new Wsdl11Parser(),
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
      parser.getBindingInfoFromBindinTag({},
        soapNamespace, soap12Namespace
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get binding from object');
    }
  });

  it('should throw an error when can not get protocol', function() {
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
      parser = new Wsdl11Parser();
    try {
      let parsed = parser.parseFromXmlToObject(simpleInput),
        binding = parser.getBindings(
          parsed
        )[0];
      parser.getBindingInfoFromBindinTag(binding, undefined, undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not find protocol in those namespaces');
    }
  });

  it('should get info from binding for soap when binding is soap and soap12 is not send', function() {

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
      parser = new Wsdl11Parser(),
      soapNamespace = {
        key: 'soap',
        url: 'http://schemas.xmlsoap.org/wsdl/soap/',
        isDefault: 'false'
      };
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, null);
    expect(bindingInfo.protocol).to.equal(SOAP_PROTOCOL);
    expect(bindingInfo.verb).to.equal(POST_METHOD);

  });

});

describe('WSDL 1.1 parser getStyleFromBindingOperation', function() {
  it('should get style from binding operation when binding is soap', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace),
      operation = {};
    operation['soap:operation'] = {
      '@_style': 'document'
    };
    expect(parser.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('document');
  });

  it('should get style from binding operation when binding is soap 12', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace),
      operation = {};
    operation['soap12:operation'] = {
      '@_style': 'document'
    };
    expect(parser.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('document');

  });

  it('should get style from binding operation when binding is http', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace, httpNamespace),
      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    expect(parser.getStyleFromBindingOperation(operation, bindingInfo)).to.equal('');

  });

  it('should throw an error when called with operation null', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace, httpNamespace),

      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    try {
      parser.getStyleFromBindingOperation(null, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get style info from operation undefined or null object');
    }
  });

  it('should throw an error when called with operation undefined', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace, httpNamespace),

      operation = {};
    operation['http:operation'] = {
      '@_location': '/FahrenheitToCelsius'
    };
    try {
      parser.getStyleFromBindingOperation(undefined, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get style info from operation undefined or null object');
    }
  });

  it('should throw an error when called with operation as empty object', function() {

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
      parser = new Wsdl11Parser(),
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
    let parsed = parser.parseFromXmlToObject(simpleInput),
      binding = parser.getBindings(
        parsed
      )[0],
      bindingInfo = parser.getBindingInfoFromBindinTag(binding, soapNamespace, soap12Namespace, httpNamespace);
    try {
      parser.getStyleFromBindingOperation({}, bindingInfo);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get style info from operation');
    }
  });
});

describe('WSDL 1.1 parser assignOperations', function() {
  it('should assign operations to wsdl object', function() {
    const parser = new Wsdl11Parser();
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(NUMBERCONVERSION_INPUT);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });
  });

  it('should assign operations to wsdl object with fault messages', function() {
    const inputFile = `
  <?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
<types>
<xs:schema elementFormDefault="qualified" targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
  <documentation>Returns the word corresponding 
  to the positive number passed as parameter. Limited to quadrillions.</documentation>
  <input message="tns:NumberToWordsSoapRequest"/>
  <output message="tns:NumberToWordsSoapResponse"/>
  <fault message="tns:NumberToWordsSoapResponse"/>
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
</definitions>
`,
      parser = new Wsdl11Parser();
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(inputFile);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });
    expect(wsdlObject.operationsArray[0].input).to.be.an('object');
    expect(wsdlObject.operationsArray[0].output).to.be.an('object');
    expect(wsdlObject.operationsArray[0].fault).to.be.an('object');

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });
    expect(wsdlObject.operationsArray[1].input).to.be.an('object');
    expect(wsdlObject.operationsArray[1].output).to.be.an('object');
    expect(wsdlObject.operationsArray[1].fault).to.be.null;

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });
  });

  it('should assign operations to wsdl object assignlocation correctly http', function() {
    const parser = new Wsdl11Parser();
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(TEMPERATURE_CONVERTER);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(6);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'FahrenheitToCelsius',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx',
        portName: 'TempConvertSoap',
        serviceName: 'TempConvert'
      });

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'CelsiusToFahrenheit',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx',
        portName: 'TempConvertSoap',
        serviceName: 'TempConvert'
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'FahrenheitToCelsius',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx',
        portName: 'TempConvertSoap12',
        serviceName: 'TempConvert'
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'CelsiusToFahrenheit',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx',
        portName: 'TempConvertSoap12',
        serviceName: 'TempConvert'
      });
    expect(wsdlObject.operationsArray[4]).to.be.an('object')
      .and.to.include({
        name: 'FahrenheitToCelsius',
        method: POST_METHOD,
        protocol: HTTP_PROTOCOL,
        style: '',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx/FahrenheitToCelsius',
        portName: 'TempConvertHttpPost',
        serviceName: 'TempConvert'
      });

    expect(wsdlObject.operationsArray[5]).to.be.an('object')
      .and.to.include({
        name: 'CelsiusToFahrenheit',
        method: POST_METHOD,
        protocol: HTTP_PROTOCOL,
        style: '',
        url: 'http://www.w3schools.com/xml/tempconvert.asmx/CelsiusToFahrenheit',
        portName: 'TempConvertHttpPost',
        serviceName: 'TempConvert'
      });
  });

  it('should assign operations to wsdl object when services is not in the file', function() {
    const parser = new Wsdl11Parser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoServicesTagNumberConvertion.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });
  });

  it('should assign operations empty object when bindings is not in the file', function() {
    const parser = new Wsdl11Parser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoBindingsTag.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(0);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_BINDIGS_MESSAGE))
      .to.equal(true);
  });

  it('should assign operations empty object when bindings operations are not in the file', function() {
    const parser = new Wsdl11Parser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoBindingsOperations.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(0);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_BINDIGS_OPERATIONS_MESSAGE))
      .to.equal(true);
  });

  it('should assign operations to wsdl object when services ports are not in the file', function() {
    const parser = new Wsdl11Parser();
    fileContent = fs.readFileSync(specialCasesWSDLs + '/NoServicesPortTag.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_SERVICE_PORT_MESSAGE))
      .to.equal(true);
    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: '',
        portName: '',
        serviceName: ''
      });
  });

  it('should assign operations to wsdl object when schema is not in the file', function() {
    const parser = new Wsdl11Parser(),
      fileContent = fs.readFileSync(specialCasesWSDLs + '/NoSchema.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(4);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[0].description.replace(/[\r\n\s]+/g, '')).to.equal(
      ('Returns the word corresponding to the positive number ' +
        'passed as parameter. Limited to quadrillions.').replace(/[\r\n\s]+/g, ''));

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.include({
        name: 'NumberToWords',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });

    expect(wsdlObject.operationsArray[3]).to.be.an('object')
      .and.to.include({
        name: 'NumberToDollars',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        style: 'document',
        url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
        portName: 'NumberConversionSoap12',
        serviceName: 'NumberConversion'
      });
  });
});

describe('WSDL 1.1 parser getServiceAndServicePortByBindingName', function() {
  it('should get service by binding name', function() {
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
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    services = parser.getServices(parsed);
    service = parser.getServiceAndServicePortByBindingName('NumberConversionSoapBinding', services, '').service;
    expect(service).to.be.an('object');
    expect(service[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('NumberConversion');
  });


  it('should throw an error when binding name is null', function() {
    try {
      parser.getServiceAndServicePortByBindingName(null, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });
  it('should throw an error when binding name is undefined', function() {
    try {
      parser.getServiceAndServicePortByBindingName(undefined, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });
  it('should throw an error when binding name is an empty string', function() {
    try {
      parser.getServiceAndServicePortByBindingName('', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });

  it('should throw an error when PrincipalPrefix is undefined', function() {
    try {
      parser.getServiceAndServicePortByBindingName('somename', {}, undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('PrincipalPrefix must have a value');
    }
  });
  it('should throw an error when PrincipalPrefix is null', function() {
    try {
      parser.getServiceAndServicePortByBindingName('somename', {}, null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('PrincipalPrefix must have a value');
    }
  });

  it('should get undefined when services is null', function() {
    let wsdlObject = new WsdlObject(),
      service = parser.getServiceAndServicePortByBindingName('somename', null, 'principal prefix', wsdlObject);
    expect(service).to.equal(undefined);
  });

  it('should get undefined when services is undefined', function() {
    let wsdlObject = new WsdlObject(),
      service = parser.getServiceAndServicePortByBindingName('somename', undefined, 'principal prefix', wsdlObject);
    expect(service).to.equal(undefined);

  });

  it('should throw an error when services is an empty object', function() {
    let wsdlObject = new WsdlObject(),
      service = parser.getServiceAndServicePortByBindingName('somename', {}, 'principal prefix', wsdlObject);
    expect(service).to.equal(undefined);
  });

});

describe('WSDL 1.1 parser getPortTypeOperationByPortTypeNameAndOperationName', function() {
  it('should get portType by name', function() {
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
      parser = new Wsdl11Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    services = parser.getServices(parsed);
    service = parser.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
      'NumberToWords', parsed, '');
    expect(service).to.be.an('object');
    expect(service[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('NumberToWords');
  });

  it('should throw an error when parsedxml is null', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', null, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get porttype from undefined or null object');
    }
  });

  it('should throw an error when parsedxml is undefined', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', undefined, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get porttype from undefined or null object');
    }
  });

  it('should throw an error when parsedxml is an empty object', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type from object');
    }
  });


  it('should throw an error when portTypeName is null', function() {
    try {

      parser.getPortTypeOperationByPortTypeNameAndOperationName(null,
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter name');
    }
  });

  it('should throw an error when portTypeName is undefined', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName(undefined,
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter name');
    }
  });

  it('should throw an error when portTypeName is an empty string', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('',
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter name');
    }
  });

  it('should throw an error when operationName is null', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('some string',
        null, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter operationName');
    }
  });

  it('should throw an error when operationName is undefined', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('some string',
        undefined, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter operationName');
    }
  });

  it('should throw an error when operationName is an empty string', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getPortTypeOperationByPortTypeNameAndOperationName('ddd',
        '', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get port type with no filter operationName');
    }
  });

});

describe('WSDL 1.1 parser getWsdlObject', function() {

  it('should get an object in memory representing wsdlObject validate all namespaces found',
    function() {
      const parser = new Wsdl11Parser();
      let wsdlObject = parser.getWsdlObject(NUMBERCONVERSION_INPUT);
      expect(wsdlObject).to.be.an('object');
      expect(wsdlObject).to.have.all.keys('targetNamespace',
        'wsdlNamespace', 'SOAPNamespace', 'HTTPNamespace',
        'SOAP12Namespace', 'schemaNamespace',
        'tnsNamespace', 'allNameSpaces', 'fileName', 'log',
        'operationsArray', 'securityPolicyArray',
        'securityPolicyNamespace');

      expect(wsdlObject.allNameSpaces).to.be.an('array');
      expect(wsdlObject.allNameSpaces.length).to.equal(6);
      xmlns = wsdlObject.allNameSpaces.find((namespace) => {
        return namespace.url === WSDL_NS_URL;
      });
      expect(xmlns.isDefault).to.equal(true);
      // asserts on namespaces
      expect(wsdlObject.targetNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
      expect(wsdlObject.tnsNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
      expect(wsdlObject.wsdlNamespace.key).to.equal('xmlns');
      expect(wsdlObject.SOAPNamespace.key).to.equal('soap');
      expect(wsdlObject.SOAP12Namespace.key).to.equal('soap12');
      expect(wsdlObject.schemaNamespace.key).to.equal('xs');

      // asserts on operations
      expect(wsdlObject.operationsArray).to.be.an('array');
      expect(wsdlObject.operationsArray.length).to.equal(4);
      expect(wsdlObject.operationsArray[0]).to.be.an('object')
        .and.to.include({
          name: 'NumberToWords',
          method: POST_METHOD,
          protocol: SOAP_PROTOCOL,
          style: 'document',
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap',
          serviceName: 'NumberConversion'
        });
      expect(wsdlObject.operationsArray[0].description).to.not.be.empty;

      expect(wsdlObject.operationsArray[1]).to.be.an('object')
        .and.to.include({
          name: 'NumberToDollars',
          method: POST_METHOD,
          protocol: SOAP_PROTOCOL,
          style: 'document',
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap',
          serviceName: 'NumberConversion'
        });

      expect(wsdlObject.operationsArray[2]).to.be.an('object')
        .and.to.include({
          name: 'NumberToWords',
          method: POST_METHOD,
          protocol: SOAP12_PROTOCOL,
          style: 'document',
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap12',
          serviceName: 'NumberConversion'
        });

      expect(wsdlObject.operationsArray[3]).to.be.an('object')
        .and.to.include({
          name: 'NumberToDollars',
          method: POST_METHOD,
          protocol: SOAP12_PROTOCOL,
          style: 'document',
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          portName: 'NumberConversionSoap12',
          serviceName: 'NumberConversion'
        });

    });

  it('should throw an error when parsedxml is null', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getWsdlObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('xmlDocumentContent must have a value');
    }
  });
});

describe('WSDL 1.1 parser getBindingOperation', function() {
  it('should throw an error when binding is null', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getBindingOperation(null, '', {});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get operations from undefined or null object');
    }
  });

  it('should throw an error when binding is emptyObject', function() {
    try {
      const parser = new Wsdl11Parser();
      parser.getBindingOperation({}, '', {});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get binding operations from object');
    }
  });
});
