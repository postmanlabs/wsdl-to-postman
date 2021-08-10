const expect = require('chai').expect,
  assert = require('chai').assert,
  {
    getBindings,
    getServices,
    getNamespaceByKey,
    getNamespaceByURL,
    getAllNamespaces,
    getPrincipalPrefix,
    getBindingOperation,
    getElementsFromWSDL,
    getDocumentationStringFromNode,
    getWSDLDocumentation,
    wsdlHasImports,
    getWSDLImports,
    getWSDLIncludes
  } = require('../../lib/WsdlParserCommon'),
  {
    WsdlInformationService11
  } = require('../../lib/WsdlInformationService11'),
  {
    WsdlInformationService20
  } = require('../../lib/WsdlInformationService20'),
  {
    WsdlObject
  } = require('../../lib/WSDLObject'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
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
</wsdl2:description>`,
  WSDL_1_1 = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
  xmlns:tns="http://www.dataaccess.com/webservicesserver/" name="NumberConversion"
  targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
  <documentation>
  This document describes number convertion service</documentation>
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
      <documentation>Returns the word corresponding to the positive number passed as parameter.
       Limited to quadrillions.</documentation>
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
    <documentation>The Number Conversion Web Service, implemented with Visual DataFlex, provides 
    functions that convert numbers into words or dollar amounts.</documentation>
    <port name="NumberConversionSoap" binding="tns:NumberConversionSoapBinding">
      <soap:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
    </port>
    <port name="NumberConversionSoap12" binding="tns:NumberConversionSoapBinding12">
      <soap12:address location="https://www.dataaccess.com/webservicesserver/NumberConversion.wso"/>
    </port>
  </service>
</definitions>`,
  WSDL_INCLUDES = `<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
      xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
      xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/"
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
      xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
      xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/"
      xmlns:ns="http://www.w3.org/2001/XMLSchema"
      xmlns:tns="http://namespace/2008"
      targetNamespace="http://namespace/2008"> 
      <types>
          <xsd:schema elementFormDefault="qualified" attributeFormDefault="qualified"
              targetNamespace="http://namespace/2008"
              xmlns="http://namespace/2008" version="2021.0.05.1"
              xmlns:xsd="http://www.w3.org/2001/XMLSchema">
              <xsd:include schemaLocation="Types.xsd"/>
          </xsd:schema>
      </types>`,
  WSDL_IMPORTS = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
        xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
        xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/"
        xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
        xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
        xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/"
        xmlns:ns="http://www.w3.org/2001/XMLSchema"
        xmlns:tns="http://namespace/2008"
        targetNamespace="http://namespace/2008"> 
        <types>
            <xsd:schema elementFormDefault="qualified" attributeFormDefault="qualified"
                targetNamespace="http://namespace/2008"
                xmlns="http://namespace/2008" version="2021.0.05.1"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                <xsd:import namespace="http://namespace/2008" schemaLocation="Types.xsd"/>
            </xsd:schema>
        </types>`;

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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByKey(
        parsed,
        informationService.TargetNamespaceKey,
        informationService.RootTagName
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
      parser = new XMLParser();
    informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByKey(
        parsed,
        informationService.THISNamespaceKey,
        informationService.RootTagName
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByKey(
        parsed,
        informationService.TargetNamespaceKey,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal(informationService.TargetNamespaceKey);
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        '',
        informationService.RootTagName
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        null,
        informationService.RootTagName
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        undefined,
        informationService.RootTagName
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when parsed is undefined', function () {
    const informationService = new WsdlInformationService11();
    try {
      getNamespaceByKey(
        undefined,
        informationService.TargetNamespaceKey,
        informationService.RootTagName
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function () {
    const informationService = new WsdlInformationService11();
    try {
      getNamespaceByKey({},
        informationService.TargetNamespaceKey,
        informationService.RootTagName
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespace from object');
    }
  });

  it('should get wsoap when called with http://www.w3.org/ns/wsdl/soap WSDL 2.0', function () {
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
      xmlParser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = xmlParser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByKey(
        parsed,
        'xmlns:tns',
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('tns');
    expect(wsdlnamespace.url).to.equal('http://axis2.org');
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should throw an error when key input is empty WSDL 2.0', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        '',
        informationService.RootTagName
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when key input is null WSDL 2.0', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        null,
        informationService.RootTagName
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });

  it('should throw an error when key input is undefined WSDL 2.0', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByKey(
        parsed,
        undefined,
        informationService.RootTagName
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('key must not be empty');
    }
  });
});

describe('WSDL parser common getServices', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      services = getServices(
        parsed,
        informationService.RootTagName
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      services = getServices(
        parsed,
        informationService.RootTagName
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
      expect(error.message).to.equal('Cannot get services from undefined or null object');
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
      expect(error.message).to.equal('Cannot get services from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object WSDL 1.1', function () {
    try {
      getServices({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get services from object');
    }
  });
  it('should get an array object representing services using default namespace WSDL 2.0', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(WSDL_SAMPLE),
      services = getServices(
        parsed,
        informationService.RootTagName
      );
    expect(services).to.be.an('array');
    expect(services.length).to.equal(1);
  });

  it('should get an array object representing services using default WSDL_SAMPLE_AXIS WSDL 2.0', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(WSDL_SAMPLE_AXIS),
      services = getServices(
        parsed,
        informationService.RootTagName
      );
    expect(services).to.be.an('array');
    expect(services.length).to.equal(1);
  });

  it('should throw an error when call with null WSDL 2.0', function () {
    try {
      getServices(
        null,
        'WSDL_ROOT_2_0'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get services from undefined or null object');
    }
  });

  it('should throw an error when call with empty WSDL 2.0', function () {
    try {
      getServices(
        '',
        'WSDL_ROOT_2_0'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get services from undefined or null object');
    }
  });
});

describe('WSDL parser common getBindings', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      bindings = getBindings(
        parsed,
        informationService.RootTagName
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      bindings = getBindings(
        parsed,
        informationService.RootTagName
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
      expect(error.message).to.equal('Cannot get bindings from undefined or null object');
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
      expect(error.message).to.equal('Cannot get bindings from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object', function () {
    try {
      getBindings({});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get bindings from object');
    }
  });

  it('should get an array object representing bindings using default namespace WSDL 2.0', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(WSDL_SAMPLE),
      bindings = getBindings(
        parsed,
        informationService.RootTagName
      );
    expect(bindings).to.be.an('array');
    expect(bindings.length).to.equal(1);
  });

  it('should get an array object representing bindings using default WSDL_SAMPLE_AXIS  WSDL 2.0', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(WSDL_SAMPLE_AXIS),
      bindings = getBindings(
        parsed,
        informationService.RootTagName
      );
    expect(bindings).to.be.an('array');
    expect(bindings.length).to.equal(3);
  });

  it('should throw an error when call with null  WSDL 2.0', function () {
    try {
      getBindings(
        null,
        'WSDL_ROOT_2_0'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get bindings from undefined or null object');
    }
  });

  it('should throw an error when call with empty WSDL 2.0', function () {
    try {
      getBindings({}, 'WSDL_ROOT_2_0');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get bindings from object');
    }
  });
});

describe('WSDL parser common getNamespaceByURL', function () {

  it('should get an object of wsdl namespace when is using wsdl as default <definitions>', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByURL(
        parsed,
        informationService.WSDLNamespaceURL,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('xmlns');
    expect(wsdlnamespace.url).to.equal(informationService.WSDLNamespaceURL);
    expect(wsdlnamespace.isDefault).to.equal(true);

  });

  it('should get an object of wsdl namespace when is using wsdl as namespace <wsdl:definitions>', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByURL(
        parsed,
        informationService.WSDLNamespaceURL,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('wsdl');
    expect(wsdlnamespace.url).to.equal(informationService.WSDLNamespaceURL);
    expect(wsdlnamespace.isDefault).to.equal(false);

  });

  it('should get an object of soap namespace when is using wsdl as default <definitions>', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByURL(
        parsed,
        informationService.SOAPNamesapceURL,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('soap');
    expect(wsdlnamespace.url).to.equal(informationService.SOAPNamesapceURL);
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should get an object of soap12 namespace when is using wsdl as default <definitions>', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();

    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByURL(
        parsed,
        informationService.SOAP12NamesapceURL,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('soap12');
    expect(wsdlnamespace.url).to.equal(informationService.SOAP12NamesapceURL);
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should get an object of schema namespace when is using wsdl as default <definitions>', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();

    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByURL(
        parsed,
        informationService.SchemaNamespaceURL,
        informationService.RootTagName

      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('xs');
    expect(wsdlnamespace.url).to.equal(informationService.SchemaNamespaceURL);
    expect(wsdlnamespace.isDefault).to.equal(false);
  });

  it('should throw an error when url input is an empty string', function () {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new XMLParser();
    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByURL(
        parsed,
        '',
        'definitions'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('URL must not be empty');
    }
  });

  it('should throw an error when url input is undefined', function () {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new XMLParser();
    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByURL(
        parsed,
        undefined,
        'definitions'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('URL must not be empty');
    }
  });

  it('should throw an error when url input is null', function () {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </definitions>
   `,
      parser = new XMLParser();
    let parsed = parser.parseToObject(simpleInput);
    try {
      getNamespaceByURL(
        parsed,
        null,
        'definitions'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('URL must not be empty');
    }
  });

  it('should throw an error when parsed is an empty string', function () {
    try {
      getNamespaceByURL(
        '',
        'definitions',
        'definitions'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is undefined', function () {
    try {
      getNamespaceByURL(
        undefined,
        'WSDL_NS_URL_1_1',
        'WSDL_ROOT_1_1'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function () {
    try {
      getNamespaceByURL(
        null,
        'WSDL_NS_URL_1_1',
        'WSDL_ROOT_1_1'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespace from undefined or null object');
    }
  });

  it('should throw an error when parsed is object no expected properties', function () {
    try {
      getNamespaceByURL({},
        'WSDL_NS_URL_1_1',
        'WSDL_ROOT_1_1'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespace from object');
    }
  });

  it('should return null and not error when namespace not found', function () {
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
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();

    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByURL(
        parsed,
        informationService.WSDLNamespaceURL,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.equal(null);
  });

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
      parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByURL(
        parsed,
        'http://www.w3.org/ns/wsdl/soap',
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('wsoap');
    expect(wsdlnamespace.url).to.equal('http://www.w3.org/ns/wsdl/soap');
    expect(wsdlnamespace.isDefault).to.equal(false);

  });

  it('should get ns when called with http://axis2.org', function () {
    const simpleInput = `<description xmlns="http://www.w3.org/ns/wsdl"
      xmlns:wsoap="http://www.w3.org/ns/wsdl/soap"
      xmlns:whttp="http://www.w3.org/ns/wsdl/http"
      xmlns:ns="http://axis2.org"
      xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl"
      xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions"
      xmlns:tns="http://axis2.org" xmlns:wrpc="http://www.w3.org/ns/wsdl/rpc"
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:ns1="http://org.apache.axis2/xsd" targetNamespace="http://axis2.org">
    <documentation> Please Type your service description here </documentation>
    </description>`,
      parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getNamespaceByURL(
        parsed,
        'http://www.w3.org/ns/wsdl',
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('xmlns');
    expect(wsdlnamespace.url).to.equal('http://www.w3.org/ns/wsdl');
    expect(wsdlnamespace.isDefault).to.equal(true);
  });


});

describe('WSDL parser common getAllNamespaces', function () {

  it('should get an array with all namespaces using wsdl as default <definitions>', function () {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </definitions>
    `,
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();

    let xmlns = {},
      parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getAllNamespaces(
        parsed,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('array');
    expect(wsdlnamespace.length).to.equal(6);
    xmlns = wsdlnamespace.find((namespace) => {
      return namespace.url === informationService.WSDLNamespaceURL;
    });
    expect(xmlns.isDefault).to.equal(true);
  });

  it('should throw an error when parsed is undefined', function () {
    try {
      let wsdlnamespace = getAllNamespaces(
        undefined,
        'WSDL_ROOT_1_1'
      );
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(6);
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespaces from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function () {
    try {
      let wsdlnamespace = getAllNamespaces(
        null,
        'WSDL_ROOT_1_1'
      );
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(6);
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespaces from undefined or null object');
    }
  });

  it('should throw an error when parsed is an empty object', function () {
    try {

      let informationService = new WsdlInformationService11(),
        wsdlnamespace = getAllNamespaces({});
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(6);
      wsdlnamespace.find((namespace) => {
        return namespace.url === informationService.WSDLNamespaceURL;
      });
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get namespaces from object');
    }
  });

  it('should get an array with all namespaces using wsdl as namespace <wsdl:definitions>', function () {
    const simpleInput = `<wsdl:definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </wsdl:definitions>
    `,
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();

    let xmlns = {},
      parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getAllNamespaces(
        parsed,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('array');
    expect(wsdlnamespace.length).to.equal(6);
    xmlns = wsdlnamespace.find((namespace) => {
      return namespace.url === informationService.WSDLNamespaceURL;
    });
    expect(xmlns.isDefault).to.equal(true);
  });

  it('should get 11 elements when called with next entry', function () {
    const simpleInput = `<wsdl2:description 
      xmlns:wsdl2="http://www.w3.org/ns/wsdl"
      xmlns:wsoap="http://www.w3.org/ns/wsdl/soap"
      xmlns:whttp="http://www.w3.org/ns/wsdl/http"
      xmlns:ns="http://axis2.org"
      xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl"
      xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions"
      xmlns:tns="http://axis2.org" 
      xmlns:wrpc="http://www.w3.org/ns/wsdl/rpc"
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:ns1="http://org.apache.axis2/xsd" 
      targetNamespace="http://axis2.org">
    <wsdl2:documentation> Please Type your service description here </wsdl2:documentation>
</wsdl2:description>`,
      parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(simpleInput),
      wsdlnamespace = getAllNamespaces(
        parsed,
        informationService.RootTagName
      );
    expect(wsdlnamespace).to.be.an('array');
    expect(wsdlnamespace.length).to.equal(11);
  });

});

describe('WSDL parser common getPrincipalPrefix', function () {

  it('should get empty string when called with <definitions>', function () {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
     xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
     xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
     name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
  </definitions>
    `,
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();

    let parsed = parser.parseToObject(simpleInput),
      principalPrefix = getPrincipalPrefix(
        parsed,
        informationService.RootTagName
      );
    expect(principalPrefix).to.equal('');

  });

  it('should get "wsdl:" when called with <wsdl:definitions>', function () {
    const simpleInput = `<wsdl:definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
 </wsdl:definitions>
   `,
      parser = new XMLParser(),
      informationService = new WsdlInformationService11();

    let parsed = parser.parseToObject(simpleInput),
      principalPrefix = getPrincipalPrefix(
        parsed,
        informationService.RootTagName
      );
    expect(principalPrefix).to.equal('wsdl:');

  });

  it('should throw error when called with null', function () {
    try {
      getPrincipalPrefix(
        null,
        'WSDL_ROOT_1_1'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get prefix from undefined or null object');
    }
  });

  it('should throw error when called with undefined', function () {
    try {
      getPrincipalPrefix(
        undefined,
        'WSDL_ROOT_1_1'
      );
      assert.fail('we expected an error');

    }
    catch (error) {
      expect(error.message).to.equal('Cannot get prefix from undefined or null object');
    }
  });

  it('should throw an error when called with object no expected properties', function () {
    try {
      getPrincipalPrefix({}, 'WSDL_ROOT_1_1');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get prefix from object');
    }
  });

  it('should get empty string when called with <description>', function () {
    const simpleInput = `<?xml version="1.0" encoding="utf-8" ?>
    <description xmlns="http://www.w3.org/ns/wsdl" 
    targetNamespace="http://greath.example.com/2004/wsdl/resSvc" 
    xmlns:tns="http://greath.example.com/2004/wsdl/resSvc" 
    xmlns:ghns="http://greath.example.com/2004/schemas/resSvc" 
    xmlns:wsoap="http://www.w3.org/ns/wsdl/soap" 
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
    xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions">
    </description>`,
      parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(simpleInput),
      principalPrefix = getPrincipalPrefix(
        parsed,
        informationService.RootTagName
      );
    expect(principalPrefix).to.equal('');
  });

  it('should get wsdl2 called with <wsdl2:description>', function () {
    const simpleInput = `<?xml version="1.0" encoding="utf-8" ?>
    <wsdl2:description xmlns="http://www.w3.org/ns/wsdl" 
    targetNamespace="http://greath.example.com/2004/wsdl/resSvc" 
    xmlns:tns="http://greath.example.com/2004/wsdl/resSvc" 
    xmlns:ghns="http://greath.example.com/2004/schemas/resSvc" 
    xmlns:wsoap="http://www.w3.org/ns/wsdl/soap" 
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
    xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions">
    </wsdl2:description>`,
      parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(simpleInput),
      principalPrefix = getPrincipalPrefix(
        parsed,
        informationService.RootTagName
      );
    expect(principalPrefix).to.equal('wsdl2:');
  });

});

describe('WSDL parser common getBindingOperation', function () {
  it('should throw an error when binding is null', function () {
    try {
      getBindingOperation(null, '', {});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get operations from undefined or null object');
    }
  });

  it('should throw an error when binding is emptyObject', function () {
    try {
      getBindingOperation({}, '', {});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get binding operations from object');
    }
  });
});

describe('WSDL parser common getElementsFromWSDL', function () {
  it('should get an array object representing elements using default namespace', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(WSDL_SAMPLE),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://greath.example.com/2004/wsdl/resSvc',
        isDefault: false
      },
      elements = getElementsFromWSDL(
        parsed,
        '',
        informationService.RootTagName,
        {
          schemaNamespace,
          tnsNamespace
        }
      );
    expect(elements).to.be.an('array');
    expect(elements.length).to.equal(3);
  });

  it('should get an array object representing elements using default WSDL_SAMPLE_AXIS', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService20();

    let parsed = parser.parseToObject(WSDL_SAMPLE_AXIS),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://axis2.org',
        isDefault: false
      },
      elements = getElementsFromWSDL(
        parsed,
        'wsdl2:',
        informationService.RootTagName,
        {
          schemaNamespace,
          tnsNamespace
        }
      );

    expect(elements).to.be.an('array');
    expect(elements.length).to.equal(2);
  });
});

describe('WSDL parser common getDocumentationString', function () {
  it('should get the same when is called with string', function () {
    const documentation = getDocumentationStringFromNode('documentation');
    expect(documentation).to.eq('documentation');
  });

  it('should get the property value when is called with a node', function () {
    const documentationNode = {};
    documentationNode['#text'] = 'documentation';
    documentation = getDocumentationStringFromNode(documentationNode);
    expect(documentation).to.eq('documentation');
  });
});

describe('WSDL parser common getWSDLDocumentation', function () {
  it('should get documentation text WSDL 1.1', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(WSDL_1_1),
      documentation = getWSDLDocumentation(
        parsed,
        informationService.RootTagName,
        {}
      );
    expect(documentation).to.equal('This document describes number convertion service');
  });

  it('should get an array object representing services using default WSDL_SAMPLE_AXIS WSDL 2.0', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService20();
    let parsed = parser.parseToObject(WSDL_SAMPLE_AXIS),
      documentation = getWSDLDocumentation(
        parsed,
        informationService.RootTagName,
        {}
      );
    expect(documentation).to.equal('Please Type your service description here');
  });

  it('should throw an error when call with null WSDL', function () {
    try {
      getWSDLDocumentation(
        null
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get documentation from undefined or null object');
    }
  });

  it('should throw an error when call with undefined', function () {
    try {
      getWSDLDocumentation(
        undefined
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get documentation from undefined or null object');
    }
  });

  it('should throw an error when call with an empty object', function () {
    let wsdlObject = new WsdlObject();
    getWSDLDocumentation({}, '', wsdlObject);
    assert.equal(wsdlObject.log.errors.includes('Cannot get documentation from wsdl'), true);
  });
});

describe('WSDL parser common wsdlHasImports', function () {
  it('should get false when a document does not have the include tag', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(WSDL_1_1),
      result = wsdlHasImports(parsed, '', informationService.RootTagName);
    expect(result).to.equal(false);
  });

  it('should get true when a document has the include tag', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(WSDL_INCLUDES),
      result = wsdlHasImports(parsed, '', informationService.RootTagName);
    expect(result).to.equal(true);
  });

  it('should get true when a document has the import tag', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(WSDL_IMPORTS),
      result = wsdlHasImports(parsed, '', informationService.RootTagName);
    expect(result).to.equal(true);
  });
});

describe('WSDL parser common getWSDLImports', function () {
  it('should get an empty array when a document does not have the import tag', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(WSDL_1_1),
      result = getWSDLImports(parsed, '', informationService.RootTagName);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should get true when a document has the import tag', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(WSDL_IMPORTS),
      result = getWSDLImports(parsed, '', informationService.RootTagName);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });
});

describe('WSDL parser common getWSDLIncludes', function () {
  it('should get an empty array when a document does not have the include tag', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(WSDL_1_1),
      result = getWSDLIncludes(parsed, '', informationService.RootTagName);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should get true when a document has the include tag', function () {
    const parser = new XMLParser(),
      informationService = new WsdlInformationService11();
    let parsed = parser.parseToObject(WSDL_INCLUDES),
      result = getWSDLIncludes(parsed, '', informationService.RootTagName);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });
});
