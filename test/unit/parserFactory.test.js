const expect = require('chai').expect,
  assert = require('chai').assert,
  {
    ParserFactory,
    V11,
    V20
  } = require('../../lib/ParserFactory'),
  {
    Wsdl11Parser
  } = require('../../lib/Wsdl11Parser'),
  {
    Wsdl20Parser
  } = require('../../lib/Wsdl20Parser');

describe('Parser Factory constructor', function() {
  it('should get an object for the factory with empty input', function() {
    const factory = new ParserFactory('');
    expect(factory).to.be.an('object');
  });

  it('should get an object for the factory with xml input', function() {
    const factory = new ParserFactory(`<user is='great'>
      <name>Tobias</name>
      <familyName>Nickel</familyName>
      <profession>Software Developer</profession>
      <location>Shanghai / China</location>
  </user>`);
    expect(factory).to.be.an('object');
  });

  it('should get an object for the factory with no input', function() {
    const factory = new ParserFactory();
    expect(factory).to.be.an('object');
  });
});

describe('Parser Factory getWsdlVersion', function() {

  it('should get version 1.1 when the input contains definitions>', function() {
    const factory = new ParserFactory(''),
      version = factory.getWsdlVersion(`<?xml version="1.0" encoding="utf-8"?>
    <?xml-stylesheet type="text/xsl" href="http://tomi.vanek.sk/xml/wsdl-viewer.xsl"?>
    <wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/">
        <wsdl:types>
            <s:schema elementFormDefault="qualified" targetNamespace="http://tempuri.org/">
                <s:element name="Add">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                            <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
                <s:element name="AddResponse">
                    <s:complexType>
                        <s:sequence>
                            <s:element minOccurs="1" maxOccurs="1" name="AddResult" type="s:int" />
                        </s:sequence>
                    </s:complexType>
                </s:element>
            </s:schema>
        </wsdl:types>
        <wsdl:message name="AddSoapIn">
            <wsdl:part name="parameters" element="tns:Add" />
        </wsdl:message>
        <wsdl:message name="AddSoapOut">
            <wsdl:part name="parameters" element="tns:AddResponse" />
        </wsdl:message>
        <wsdl:portType name="CalculatorSoap">
            <wsdl:operation name="Add">
                <wsdl:input message="tns:AddSoapIn" />
                <wsdl:output message="tns:AddSoapOut" />
            </wsdl:operation>
        </wsdl:portType>
        <wsdl:binding name="CalculatorSoap" type="tns:CalculatorSoap">
            <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
            <wsdl:operation name="Add">
                <soap:operation soapAction="http://tempuri.org/Add" style="document" />
                <wsdl:input>
                    <soap:body use="literal" />
                </wsdl:input>
                <wsdl:output>
                    <soap:body use="literal" />
                </wsdl:output>
            </wsdl:operation>
        </wsdl:binding>
        <wsdl:service name="Calculator">
            <wsdl:port name="CalculatorSoap" binding="tns:CalculatorSoap">
                <soap:address location="http://www.dneonline.com/calculator.asmx" />
            </wsdl:port>
        </wsdl:service>
    </wsdl:definitions>
    `);
    expect(factory).to.be.an('object');
    expect(version).to.equal(V11);
  });

  it('should get version 2.0 when the input contains description>', function() {
    const factory = new ParserFactory(''),
      version = factory.getWsdlVersion(`<?xml version="1.0" encoding="utf-8" ?>
    <description xmlns="http://www.w3.org/ns/wsdl>
        <types>
            <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema>
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
        type="http://www.w3.org/ns/wsdl/soap"
         wsoap:protocol="http://www.w3.org/2003/05/soap/bindings/HTTP/">
            <fault ref="tns:invalidDataFault" wsoap:code="soap:Sender" />
            <operation ref="tns:opCheckAvailability" wsoap:mep="http://www.w3.org/2003/05/soap/mep/soap-response" />
        </binding>
        <service name="reservationService" interface="tns:reservationInterface">
            <endpoint name="reservationEndpoint" binding="tns:reservationSOAPBinding"
             address="http://greath.example.com/2004/reservation" />
        </service>
    </description>
    `);
    expect(factory).to.be.an('object');
    expect(version).to.equal(V20);
  });

  it('should throw an error when input is empty string', function() {
    const factory = new ParserFactory();
    try {
      factory.getWsdlVersion('');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is empty', function() {
    const factory = new ParserFactory();
    try {
      factory.getWsdlVersion();
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is null', function() {
    const factory = new ParserFactory();
    try {
      factory.getWsdlVersion(null);
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is undefined', function() {
    const factory = new ParserFactory();
    try {
      factory.getWsdlVersion(undefined);
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input does not have any of the tags', function() {
    const factory = new ParserFactory();
    try {
      factory.getWsdlVersion(`<user is='great'>
      <name>Tobias</name>
      <familyName>Nickel</familyName>
      <profession>Software Developer</profession>
      <location>Shanghai / China</location>
  </user>`);
    }
    catch (error) {
      expect(error.message).to.equal('Not WSDL Specification found in your document');
    }
  });

});

describe('Parser Factory getParser', function() {

  it('should get version an object of type Wsdl11Parser when the input contains definitions>', function() {
    const factory = new ParserFactory(''),
      concreteParser = factory.getParser(`<?xml version="1.0" encoding="utf-8"?>
        <?xml-stylesheet type="text/xsl" href="http://tomi.vanek.sk/xml/wsdl-viewer.xsl"?>
        <wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/">
            <wsdl:types>
                <s:schema elementFormDefault="qualified" targetNamespace="http://tempuri.org/">
                    <s:element name="Add">
                        <s:complexType>
                            <s:sequence>
                                <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                                <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                            </s:sequence>
                        </s:complexType>
                    </s:element>
                    <s:element name="AddResponse">
                        <s:complexType>
                            <s:sequence>
                                <s:element minOccurs="1" maxOccurs="1" name="AddResult" type="s:int" />
                            </s:sequence>
                        </s:complexType>
                    </s:element>
                </s:schema>
            </wsdl:types>
            <wsdl:message name="AddSoapIn">
                <wsdl:part name="parameters" element="tns:Add" />
            </wsdl:message>
            <wsdl:message name="AddSoapOut">
                <wsdl:part name="parameters" element="tns:AddResponse" />
            </wsdl:message>
            <wsdl:portType name="CalculatorSoap">
                <wsdl:operation name="Add">
                    <wsdl:input message="tns:AddSoapIn" />
                    <wsdl:output message="tns:AddSoapOut" />
                </wsdl:operation>
            </wsdl:portType>
            <wsdl:binding name="CalculatorSoap" type="tns:CalculatorSoap">
                <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
                <wsdl:operation name="Add">
                    <soap:operation soapAction="http://tempuri.org/Add" style="document" />
                    <wsdl:input>
                        <soap:body use="literal" />
                    </wsdl:input>
                    <wsdl:output>
                        <soap:body use="literal" />
                    </wsdl:output>
                </wsdl:operation>
            </wsdl:binding>
            <wsdl:service name="Calculator">
                <wsdl:port name="CalculatorSoap" binding="tns:CalculatorSoap">
                    <soap:address location="http://www.dneonline.com/calculator.asmx" />
                </wsdl:port>
            </wsdl:service>
        </wsdl:definitions>
        `);
    expect(concreteParser).to.be.an('object');
    expect(concreteParser).to.be.an.instanceof(Wsdl11Parser);
  });

  it('should get version an object of type Wsdl20Parser when the input contains description>', function() {
    const factory = new ParserFactory(''),
      concreteParser = factory.getParser(`<?xml version="1.0" encoding="utf-8" ?>
      <description xmlns="http://www.w3.org/ns/wsdl>
          <types>
              <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema>
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
          type="http://www.w3.org/ns/wsdl/soap"
           wsoap:protocol="http://www.w3.org/2003/05/soap/bindings/HTTP/">
              <fault ref="tns:invalidDataFault" wsoap:code="soap:Sender" />
              <operation ref="tns:opCheckAvailability" wsoap:mep="http://www.w3.org/2003/05/soap/mep/soap-response" />
          </binding>
          <service name="reservationService" interface="tns:reservationInterface">
              <endpoint name="reservationEndpoint" binding="tns:reservationSOAPBinding"
               address="http://greath.example.com/2004/reservation" />
          </service>
      </description>
        `);
    expect(concreteParser).to.be.an('object');
    expect(concreteParser).to.be.an.instanceof(Wsdl20Parser);
  });


  it('should throw an error when input is empty string', function() {
    const factory = new ParserFactory();
    try {
      factory.getParser('');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is empty', function() {
    const factory = new ParserFactory();
    try {
      factory.getParser();
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is null', function() {
    const factory = new ParserFactory();
    try {
      factory.getParser(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is undefined', function() {
    const factory = new ParserFactory();
    try {
      factory.getParser(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input does not have any of the tags', function() {
    const factory = new ParserFactory();
    try {
      factory.getParser(`<user is='great'>
      <name>Tobias</name>
      <familyName>Nickel</familyName>
      <profession>Software Developer</profession>
      <location>Shanghai / China</location>
  </user>`);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Not WSDL Specification found in your document');
    }
  });

});
