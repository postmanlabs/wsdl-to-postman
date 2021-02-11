const expect = require('chai').expect,
  assert = require('chai').assert,
  WsdlObject = require('../lib/WsdlObject').WsdlObject,
  {
    Wsdl11Parser,
    WSDL_NS_URL,
    SOAP_NS_URL,
    SOAP_12_NS_URL,
    SCHEMA_NS_URL,
    TARGETNAMESPACE_KEY,
    TNS_NS_KEY
  } = require('../lib/Wsdl11Parser');

describe('WSDL 1.1 parser constructor', function() {
  it('should get an object wsdl 1.1 parser', function() {
    const parser = new Wsdl11Parser();
    expect(parser).to.be.an('object');
  });

});

describe('WSDL 1.1 parser  parseFromXmlToObject', function() {

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
    expect(parsed.user['@_is']).to.equal('great');

  });

  it('should throw an error when input is empty string', function() {
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

describe('WSDL 1.1 parser  getNamespaceByURL', function() {

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

  it('should throw an error when url input is string empty', function() {
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
      expect(error.message).to.equal('Can not get namespace from undefind or null object');
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
      expect(error.message).to.equal('Can not get namespace from undefind or null object');
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

describe('WSDL 1.1 parser  getPrincipalPrefix', function() {

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
      expect(error.message).to.equal('Can not get prefix from undefind or null object');
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
      expect(error.message).to.equal('Can not get prefix from undefind or null object');
    }
  });

  it('should throw error when called with object no expected properties', function() {
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

describe('WSDL 1.1 parser  getNamespaceBykey', function() {

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
      wsdlnamespace = parser.getNamespaceBykey(
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
      wsdlnamespace = parser.getNamespaceBykey(
        parsed,
        TNS_NS_KEY
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal(TNS_NS_KEY);
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
      wsdlnamespace = parser.getNamespaceBykey(
        parsed,
        TARGETNAMESPACE_KEY
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal(TARGETNAMESPACE_KEY);
    expect(wsdlnamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should throw an error when key input is string empty', function() {
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
      parser.getNamespaceBykey(
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
      parser.getNamespaceBykey(
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
      parser.getNamespaceBykey(
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
      parser.getNamespaceBykey(
        undefined,
        TARGETNAMESPACE_KEY
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from undefind or null object');
    }
  });

  it('should throw an error when parsed is null', function() {
    const parser = new Wsdl11Parser();
    try {
      parser.getNamespaceBykey({},
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
      expect(error.message).to.equal('Can not get namespaces from undefind or null object');
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
      expect(error.message).to.equal('Can not get namespaces from undefind or null object');
    }
  });

  it('should throw an error when parsed is empty object', function() {
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

describe('WSDL 1.1 parser getWsdlObject', function() {

  it('should get an object in memory representing wsdlObject validate namespaces all found',
    function() {
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
      let parsed = parser.getWsdlObject(simpleInput);
      expect(parsed).to.be.an('object');
      expect(parsed).to.have.own.property('targetNamespace');
      expect(parsed).to.have.own.property('wsdlNamespace');
      expect(parsed).to.have.own.property('SOAPNamespace');
      expect(parsed).to.have.own.property('SOAP12Namespace');
      expect(parsed).to.have.own.property('schemaNamespace');
      expect(parsed).to.have.own.property('tnsNamespace');
      expect(parsed).to.have.own.property('allNameSpaces');

      expect(parsed.allNameSpaces).to.be.an('array');
      expect(parsed.allNameSpaces.length).to.equal(6);
      xmlns = parsed.allNameSpaces.find((namespace) => {
        return namespace.url === WSDL_NS_URL;
      });
      expect(xmlns.isDefault).to.equal(true);
      expect(parsed.targetNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
      expect(parsed.tnsNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
      expect(parsed.wsdlNamespace.key).to.equal('xmlns');
      expect(parsed.SOAPNamespace.key).to.equal('soap');
      expect(parsed.SOAP12Namespace.key).to.equal('soap12');
      expect(parsed.schemaNamespace.key).to.equal('xs');
    });

  it('should get an object in memory representing wsdlObject validate namespaces', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"  
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
    let parsed = parser.getWsdlObject(simpleInput);
    expect(parsed).to.be.an('object');
    expect(parsed).to.have.own.property('targetNamespace');
    expect(parsed).to.have.own.property('wsdlNamespace');
    expect(parsed).to.have.own.property('SOAPNamespace');
    expect(parsed).to.have.own.property('SOAP12Namespace');
    expect(parsed).to.have.own.property('schemaNamespace');
    expect(parsed).to.have.own.property('tnsNamespace');
    expect(parsed).to.have.own.property('allNameSpaces');

    expect(parsed.allNameSpaces).to.be.an('array');
    expect(parsed.allNameSpaces.length).to.equal(5);
    xmlns = parsed.allNameSpaces.find((namespace) => {
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
    expect(wsdlObject).to.have.own.property('targetNamespace');
    expect(wsdlObject).to.have.own.property('wsdlNamespace');
    expect(wsdlObject).to.have.own.property('SOAPNamespace');
    expect(wsdlObject).to.have.own.property('SOAP12Namespace');
    expect(wsdlObject).to.have.own.property('schemaNamespace');
    expect(wsdlObject).to.have.own.property('tnsNamespace');
    expect(wsdlObject).to.have.own.property('allNameSpaces');
    expect(wsdlObject.targetNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlObject.tnsNamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlObject.wsdlNamespace.key).to.equal('xmlns');
    expect(wsdlObject.SOAPNamespace.key).to.equal('soap');
    expect(wsdlObject.SOAP12Namespace.key).to.equal('soap12');
    expect(wsdlObject.schemaNamespace.key).to.equal('xs');

  });

});
