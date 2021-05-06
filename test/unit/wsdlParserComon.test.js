const expect = require('chai').expect,
  assert = require('chai').assert,
  {
    Wsdl11Parser,
    TARGETNAMESPACE_KEY: TARGETNAMESPACE_KEY_1_1,
    TNS_NS_KEY: TNS_NS_KEY_1_1,
    WSDL_ROOT: WSDL_ROOT_1_1
  } = require('../../lib/Wsdl11Parser'),
  {
    getBindings,
    getServices,
    getNamespaceByKey
  } = require('../../lib/WsdlParserCommon'),
  {
    Wsdl20Parser,
    WSDL_ROOT: WSDL_ROOT_2_0
  } = require('../../lib/Wsdl20Parser'),
  WSDL_SAMPLE = `<?xml version="1.0" encoding="utf-8" ?>
<description xmlns="http://www.w3.org/ns/wsdl" 
targetNamespace="http://greath.example.com/2004/wsdl/resSvc" 
xmlns:tns="http://greath.example.com/2004/wsdl/resSvc" 
xmlns:ghns="http://greath.example.com/2004/schemas/resSvc" 
xmlns:wsoap="http://www.w3.org/ns/wsdl/soap" 
xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions">
    <documentation>
        This document describes the GreatH Web service. Additional
        application-level requirements for use of this service --
        beyond what WSDL 2.0 is able to describe -- are available
        at http://greath.example.com/2004/reservation-documentation.html
    </documentation>
    <types>
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" 
        targetNamespace="http://greath.example.com/2004/schemas/resSvc" 
        xmlns="http://greath.example.com/2004/schemas/resSvc">
            <xs:element name="checkAvailability" type="tCheckAvailability" />
            <xs:complexType name="tCheckAvailability">
                <xs:sequence>
                    <xs:element name="checkInDate" type="xs:date" />
                    <xs:element name="checkOutDate" type="xs:date" />
                    <xs:element name="roomType" type="xs:string" />
                </xs:sequence>
            </xs:complexType>
            <xs:element name="checkAvailabilityResponse" type="xs:double" />
            <xs:element name="invalidDataError" type="xs:string" />
        </xs:schema>
    </types>
    <interface name="reservationInterface">
        <fault name="invalidDataFault" element="ghns:invalidDataError" />
        <operation name="opCheckAvailability" pattern="http://www.w3.org/ns/wsdl/in-out" 
        style="http://www.w3.org/ns/wsdl/style/iri" wsdlx:safe="true">
            <input messageLabel="In" element="ghns:checkAvailability" />
            <output messageLabel="Out" element="ghns:checkAvailabilityResponse" />
            <outfault ref="tns:invalidDataFault" messageLabel="Out" />
        </operation>
    </interface>
    <binding name="reservationSOAPBinding" interface="tns:reservationInterface" 
    type="http://www.w3.org/ns/wsdl/soap" wsoap:protocol="http://www.w3.org/2003/05/soap/bindings/HTTP/">
        <fault ref="tns:invalidDataFault" wsoap:code="soap:Sender" />
        <operation ref="tns:opCheckAvailability" wsoap:mep="http://www.w3.org/2003/05/soap/mep/soap-response" />
    </binding>
    <service name="reservationService" interface="tns:reservationInterface">
        <endpoint name="reservationEndpoint" binding="tns:reservationSOAPBinding" 
        address="http://greath.example.com/2004/reservation" />
    </service>
</description>`,
  WSDL_SAMPLE_AXIS = `<wsdl2:description xmlns:wsdl2="http://www.w3.org/ns/wsdl" 
xmlns:wsoap="http://www.w3.org/ns/wsdl/soap" 
xmlns:whttp="http://www.w3.org/ns/wsdl/http" xmlns:ns="http://axis2.org" 
xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl" 
xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions" xmlns:tns="http://axis2.org" 
xmlns:wrpc="http://www.w3.org/ns/wsdl/rpc" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns:ns1="http://org.apache.axis2/xsd" targetNamespace="http://axis2.org">
<wsdl2:documentation> Please Type your service description here </wsdl2:documentation>
<wsdl2:types>
  <xs:schema attributeFormDefault="qualified" elementFormDefault="qualified" 
  targetNamespace="http://axis2.org">
      <xs:element name="hi">
          <xs:complexType>
              <xs:sequence />
          </xs:complexType>
      </xs:element>
      <xs:element name="hiResponse">
          <xs:complexType>
              <xs:sequence>
                  <xs:element minOccurs="0" name="return" nillable="true" type="xs:string" />
              </xs:sequence>
          </xs:complexType>
      </xs:element>
  </xs:schema>
</wsdl2:types>
<wsdl2:interface name="ServiceInterface">
  <wsdl2:operation name="hi" 
  style="http://www.w3.org/ns/wsdl/style/rpc http://www.w3.org/ns/wsdl/style/iri 
  http://www.w3.org/ns/wsdl/style/multipart"
   wrpc:signature="return #return " pattern="http://www.w3.org/ns/wsdl/in-out">
      <wsdl2:input element="ns:hi" wsaw:Action="urn:hi" />
      <wsdl2:output element="ns:hiResponse" wsaw:Action="urn:hiResponse" />
  </wsdl2:operation>
</wsdl2:interface>
<wsdl2:binding name="SayHelloSoap11Binding" interface="tns:ServiceInterface" 
type="http://www.w3.org/ns/wsdl/soap" wsoap:version="1.1">
  <wsdl2:operation ref="tns:hi" wsoap:action="urn:hi">
      <wsdl2:input />
      <wsdl2:output />
  </wsdl2:operation>
</wsdl2:binding>
<wsdl2:binding name="SayHelloSoap12Binding" interface="tns:ServiceInterface" 
type="http://www.w3.org/ns/wsdl/soap" wsoap:version="1.2">
  <wsdl2:operation ref="tns:hi" wsoap:action="urn:hi">
      <wsdl2:input />
      <wsdl2:output />
  </wsdl2:operation>
</wsdl2:binding>
<wsdl2:binding name="SayHelloHttpBinding" interface="tns:ServiceInterface" 
whttp:methodDefault="POST" type="http://www.w3.org/ns/wsdl/http">
  <wsdl2:operation ref="tns:hi" whttp:location="hi">
      <wsdl2:input />
      <wsdl2:output />
  </wsdl2:operation>
</wsdl2:binding>
<wsdl2:service name="SayHello" interface="tns:ServiceInterface">
  <wsdl2:endpoint name="SayHelloHttpEndpoint" 
  binding="tns:SayHelloHttpBinding" 
  address="http://192.168.100.75:8080/Axis2-bottom/services/SayHello.SayHelloHttpEndpoint/" />
  <wsdl2:endpoint name="SayHelloHttpSoap11Endpoint" 
  binding="tns:SayHelloSoap11Binding" 
  address="http://192.168.100.75:8080/Axis2-bottom/services/SayHello.SayHelloHttpSoap11Endpoint/" />
  <wsdl2:endpoint name="SayHelloHttpSoap12Endpoint" 
  binding="tns:SayHelloSoap12Binding" 
  address="http://192.168.100.75:8080/Axis2-bottom/services/SayHello.SayHelloHttpSoap12Endpoint/" />
</wsdl2:service>
</wsdl2:description>`;

describe('WSDL parser common getNamespaceByKey', function () {

  it('should get an object of targetNamespace namespace when is using wsdl as default <definitions>', function () {
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
      wsdlnamespace = getNamespaceByKey(
        parsed,
        TARGETNAMESPACE_KEY_1_1,
        WSDL_ROOT_1_1
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('targetNamespace');
    expect(wsdlnamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should get an object of tns namespace when is using wsdl as default <definitions>', function () {
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
      wsdlnamespace = getNamespaceByKey(
        parsed,
        TNS_NS_KEY_1_1,
        WSDL_ROOT_1_1
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('tns');
    expect(wsdlnamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should get an object of targetNamespace ns when is using wsdl as ns <wsdl:definitions>', function () {
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
      wsdlnamespace = getNamespaceByKey(
        parsed,
        TARGETNAMESPACE_KEY_1_1,
        WSDL_ROOT_1_1
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal(TARGETNAMESPACE_KEY_1_1);
    expect(wsdlnamespace.url).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should throw an error when key input is an empty string', function () {
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
      getNamespaceByKey(
        parsed,
        '',
        WSDL_ROOT_1_1
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when key input is string null', function () {
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
      getNamespaceByKey(
        parsed,
        null,
        WSDL_ROOT_1_1
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when key input is undefined', function () {
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
      getNamespaceByKey(
        parsed,
        undefined,
        WSDL_ROOT_1_1
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when parsed is undefined', function () {
    try {
      getNamespaceByKey(
        undefined,
        TARGETNAMESPACE_KEY_1_1,
        WSDL_ROOT_1_1
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function () {
    try {
      getNamespaceByKey({},
        TARGETNAMESPACE_KEY_1_1,
        WSDL_ROOT_1_1
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespace from object');
    }
  });
});

describe('WSDL parser common getServices WSDL 1.1', function () {
  it('should get an array object representing services using default namespace WSDL 1.1', function () {
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
      services = getServices(
        parsed,
        WSDL_ROOT_1_1
      );
    expect(services).to.be.an('array');
    expect(services.length).to.equal(1);
  });

  it('should get an array object representing services using named namespace <wsdl:definitions> WSDL 1.1', function () {
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
      services = getServices(
        parsed,
        WSDL_ROOT_1_1
      );
    expect(services).to.be.an('array');
    expect(services.length).to.equal(2);
  });

  it('should throw an error when call with null WSDL 1.1', function () {
    try {
      getServices(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get services from undefined or null object');
    }
  });

  it('should throw an error when call with undefined WSDL 1.1', function () {
    try {
      getServices(
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get services from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object WSDL 1.1', function () {
    try {
      getServices({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get services from object');
    }
  });
});

describe('WSDL parser common getBindings WSDL 1.1', function () {
  it('should get an array object representing bindings using default namespace', function () {
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
      bindings = getBindings(
        parsed,
        WSDL_ROOT_1_1
      );
    expect(bindings).to.be.an('array');
    expect(bindings.length).to.equal(2);
  });

  it('should get an array object representing bindings using named namespace <wsdl:definitions>', function () {
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
      bindings = getBindings(
        parsed,
        WSDL_ROOT_1_1
      );
    expect(bindings).to.be.an('array');
    expect(bindings.length).to.equal(1);
  });

  it('should throw an error when call with null', function () {
    try {
      getBindings(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get bindings from undefined or null object');
    }
  });

  it('should throw an error when call with undefined', function () {
    try {
      getBindings(
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get bindings from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object', function () {
    try {
      getBindings({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get bindings from object');
    }
  });
});

describe('WSDL parser common getBindings WSDL 2.0', function () {
  it('should get an array object representing bindings using default namespace WSDL 2.0', function () {
    const parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(WSDL_SAMPLE),
      bindings = getBindings(
        parsed,
        WSDL_ROOT_2_0
      );
    expect(bindings).to.be.an('array');
    expect(bindings.length).to.equal(1);
  });

  it('should get an array object representing bindings using default WSDL_SAMPLE_AXIS  WSDL 2.0', function () {
    const parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(WSDL_SAMPLE_AXIS),
      bindings = getBindings(
        parsed,
        WSDL_ROOT_2_0
      );
    expect(bindings).to.be.an('array');
    expect(bindings.length).to.equal(3);
  });

  it('should throw an error when call with null  WSDL 2.0', function () {
    try {
      getBindings(
        null,
        WSDL_ROOT_2_0
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get bindings from undefined or null object');
    }
  });

  it('should throw an error when call with empty WSDL 2.0', function () {
    try {
      getBindings({}, WSDL_ROOT_2_0);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get bindings from object');
    }
  });
});

describe('WSDL parser common WSDL getServices 2.0', function () {
  it('should get an array object representing services using default namespace WSDL 2.0', function () {
    const parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(WSDL_SAMPLE),
      services = getServices(
        parsed,
        WSDL_ROOT_2_0
      );
    expect(services).to.be.an('array');
    expect(services.length).to.equal(1);
  });

  it('should get an array object representing services using default WSDL_SAMPLE_AXIS WSDL 2.0', function () {
    const parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(WSDL_SAMPLE_AXIS),
      services = getServices(
        parsed,
        WSDL_ROOT_2_0
      );
    expect(services).to.be.an('array');
    expect(services.length).to.equal(1);
  });

  it('should throw an error when call with null WSDL 2.0', function () {
    try {
      getServices(
        null,
        WSDL_ROOT_2_0
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get services from undefined or null object');
    }
  });

  it('should throw an error when call with empty WSDL 2.0', function () {
    try {
      getServices(
        '',
        WSDL_ROOT_2_0
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get services from undefined or null object');
    }
  });
});

describe('WSDL 2.0 parser getNamespaceBykey WSDL 2.0', function () {

  it('should get wsoap when called with http://www.w3.org/ns/wsdl/soap', function () {
    const simpleInput = `<wsdl2:description xmlns:wsdl2="http://www.w3.org/ns/wsdl"
      xmlns:wsoap="http://www.w3.org/ns/wsdl/soap"
      xmlns:whttp="http://www.w3.org/ns/wsdl/http"
      xmlns:ns="http://axis2.org"
      xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl"
      xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions"
      xmlns:tns="http://axis2.org" xmlns:wrpc="http://www.w3.org/ns/wsdl/rpc"
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:ns1="http://org.apache.axis2/xsd" targetNamespace="http://axis2.org">
    <wsdl2:documentation> Please Type your service description here </wsdl2:documentation>
</wsdl2:description>`,
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = getNamespaceByKey(
        parsed,
        'xmlns:tns',
        WSDL_ROOT_2_0
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('tns');
    expect(wsdlnamespace.url).to.equal('http://axis2.org');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should throw an error when key input is empty', function () {
    const simpleInput = `<wsdl2:description xmlns:wsdl2="http://www.w3.org/ns/wsdl"
      xmlns:wsoap="http://www.w3.org/ns/wsdl/soap"
      xmlns:whttp="http://www.w3.org/ns/wsdl/http"
      xmlns:ns="http://axis2.org"
      xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl"
      xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions"
      xmlns:tns="http://axis2.org" xmlns:wrpc="http://www.w3.org/ns/wsdl/rpc"
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:ns1="http://org.apache.axis2/xsd" targetNamespace="http://axis2.org">
    <wsdl2:documentation> Please Type your service description here </wsdl2:documentation>
</wsdl2:description>`,
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        '',
        WSDL_ROOT_2_0
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when key input is null', function () {
    const simpleInput = `<wsdl2:description xmlns:wsdl2="http://www.w3.org/ns/wsdl"
      xmlns:wsoap="http://www.w3.org/ns/wsdl/soap"
      xmlns:whttp="http://www.w3.org/ns/wsdl/http"
      xmlns:ns="http://axis2.org"
      xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl"
      xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions"
      xmlns:tns="http://axis2.org" xmlns:wrpc="http://www.w3.org/ns/wsdl/rpc"
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:ns1="http://org.apache.axis2/xsd" targetNamespace="http://axis2.org">
    <wsdl2:documentation> Please Type your service description here </wsdl2:documentation>
</wsdl2:description>`,
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        null,
        WSDL_ROOT_2_0
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when key input is undefined', function () {
    const simpleInput = `<wsdl2:description xmlns:wsdl2="http://www.w3.org/ns/wsdl"
      xmlns:wsoap="http://www.w3.org/ns/wsdl/soap"
      xmlns:whttp="http://www.w3.org/ns/wsdl/http"
      xmlns:ns="http://axis2.org"
      xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl"
      xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions"
      xmlns:tns="http://axis2.org" xmlns:wrpc="http://www.w3.org/ns/wsdl/rpc"
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:ns1="http://org.apache.axis2/xsd" targetNamespace="http://axis2.org">
    <wsdl2:documentation> Please Type your service description here </wsdl2:documentation>
</wsdl2:description>`,
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        undefined,
        WSDL_ROOT_2_0
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });
});
