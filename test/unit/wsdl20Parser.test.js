const { WsdlInformationService20 } = require('../../lib/WsdlInformationService20');

const expect = require('chai').expect,
  {
    HTTP_PROTOCOL,
    SOAP12_PROTOCOL,
    SOAP_PROTOCOL
  } = require('../../lib/Wsdl11Parser'),
  {
    DOC_HAS_NO_SERVICE_MESSAGE,
    DOC_HAS_NO_BINDIGS_MESSAGE,
    DOC_HAS_NO_BINDIGS_OPERATIONS_MESSAGE,
    DOC_HAS_NO_SERVICE_PORT_MESSAGE
  } = require('../../lib/constants/messageConstants'),
  assert = require('chai').assert,
  fs = require('fs'),
  WsdlObject = require('../../lib/WSDLObject').WsdlObject,
  {
    Wsdl20Parser,
    WSDL_NS_URL
  } = require('../../lib/Wsdl20Parser'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  {
    POST_METHOD
  } = require('../../lib/utils/httpUtils'),
  specialCasesWSDLs = 'test/data/specialCases/wsdl2',
  validWSDLs20 = 'test/data/validWSDLs20',
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

describe('WSDL 2.0 parser constructor', function () {
  it('should get an object wsdl 2.0 parser', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20());
    expect(parser).to.be.an('object');
  });
});

describe('WSDL 2.0 parser assignNamespaces', function () {

  it('should assign namespaces to wsdl object', function () {
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
      parser = new Wsdl20Parser(new WsdlInformationService20()),
      xmlParser = new XMLParser();
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(simpleInput);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);

    expect(wsdlObject).to.have.all.keys('targetNamespace',
      'wsdlNamespace', 'SOAPNamespace', 'HTTPNamespace',
      'SOAP12Namespace', 'schemaNamespace',
      'tnsNamespace', 'allNameSpaces', 'documentation', 'fileName', 'log',
      'operationsArray', 'securityPolicyArray',
      'securityPolicyNamespace', 'xmlParsed', 'version');

    expect(wsdlObject.targetNamespace.url).to.equal('http://axis2.org');
    expect(wsdlObject.tnsNamespace.url).to.equal('http://axis2.org');
    expect(wsdlObject.wsdlNamespace.key).to.equal('wsdl2');
    expect(wsdlObject.SOAPNamespace.key).to.equal('wsoap');
    expect(wsdlObject.schemaNamespace.key).to.equal('xs');
  });
});

describe('WSDL 2.0 parser getWsdlObject', function () {

  it('should get an object in memory representing wsdlObject 2.0',
    function () {
      const parser = new Wsdl20Parser(new WsdlInformationService20());
      let wsdlObject = parser.getWsdlObject(WSDL_SAMPLE, new XMLParser());
      expect(wsdlObject).to.be.an('object');
      expect(wsdlObject).to.have.all.keys('targetNamespace',
        'wsdlNamespace', 'SOAPNamespace', 'HTTPNamespace',
        'SOAP12Namespace', 'schemaNamespace',
        'tnsNamespace', 'allNameSpaces', 'documentation', 'fileName', 'log',
        'operationsArray', 'securityPolicyArray',
        'securityPolicyNamespace', 'xmlParsed', 'version');

      expect(wsdlObject.allNameSpaces).to.be.an('array');
      expect(wsdlObject.allNameSpaces.length).to.equal(7);
      xmlns = wsdlObject.allNameSpaces.find((namespace) => {
        return namespace.url === WSDL_NS_URL;
      });
      expect(xmlns.isDefault).to.equal(true);
      // asserts on namespaces
      expect(wsdlObject.targetNamespace.url).to.equal('http://greath.example.com/2004/wsdl/resSvc');
      expect(wsdlObject.tnsNamespace.url).to.equal('http://greath.example.com/2004/wsdl/resSvc');
      expect(wsdlObject.wsdlNamespace.key).to.equal('xmlns');
      expect(wsdlObject.SOAPNamespace.key).to.equal('wsoap');
      expect(wsdlObject.schemaNamespace.key).to.equal('xs');
    });

  it('should throw an error when parsedxml is null', function () {
    try {
      const parser = new Wsdl20Parser(new WsdlInformationService20());
      parser.getWsdlObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('xmlDocumentContent must have a value');
    }
  });

  it('should throw an error when parsedxml is empty', function () {
    try {
      const parser = new Wsdl20Parser(new WsdlInformationService20());
      parser.getWsdlObject('');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('xmlDocumentContent must have a value');
    }
  });
});

describe('WSDL 2.0 parser assignOperations', function () {

  it('should assign operations to wsdl object', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20());
    let wsdlObject = new WsdlObject(),
      xmlParser = new XMLParser(),
      parsed = xmlParser.parseToObject(WSDL_SAMPLE);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);

    expect(wsdlObject).to.be.an('object');
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(1);

  });

  it('should assign operations to wsdl object when called with WSDL_SAMPLE_AXIS', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20());
    let wsdlObject = new WsdlObject(),
      xmlParser = new XMLParser(),
      parsed = xmlParser.parseToObject(WSDL_SAMPLE_AXIS);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);

    expect(wsdlObject).to.be.an('object');
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(3);

  });

  it('should assign operations to wsdl object assignlocation correctly http', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20());
    let wsdlObject = new WsdlObject(),
      xmlParser = new XMLParser(),
      parsed = xmlParser.parseToObject(WSDL_SAMPLE_AXIS);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);

    expect(wsdlObject).to.be.an('object');
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(3);


    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.deep.include({
        name: 'hi',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        url: 'http://192.168.100.75:8080/Axis2-bottom/services/SayHello.SayHelloHttpSoap11Endpoint/',
        portName: 'SayHelloHttpSoap11Endpoint',
        serviceName: 'SayHello',
        xpathInfo: {
          xpath: '//description//binding[@name="SayHelloSoap11Binding"]//operation[@ref="tns:hi"]',
          wsdlNamespaceUrl: 'http://www.w3.org/ns/wsdl'
        }
      });

    expect(wsdlObject.operationsArray[1]).to.be.an('object')
      .and.to.deep.include({
        name: 'hi',
        method: POST_METHOD,
        protocol: SOAP12_PROTOCOL,
        url: 'http://192.168.100.75:8080/Axis2-bottom/services/SayHello.SayHelloHttpSoap12Endpoint/',
        portName: 'SayHelloHttpSoap12Endpoint',
        serviceName: 'SayHello',
        xpathInfo: {
          xpath: '//description//binding[@name="SayHelloSoap12Binding"]//operation[@ref="tns:hi"]',
          wsdlNamespaceUrl: 'http://www.w3.org/ns/wsdl'
        }
      });

    expect(wsdlObject.operationsArray[2]).to.be.an('object')
      .and.to.deep.include({
        name: 'hi',
        method: POST_METHOD,
        protocol: HTTP_PROTOCOL,
        url: 'http://192.168.100.75:8080/Axis2-bottom/services/SayHello.SayHelloHttpEndpoint/hi',
        portName: 'SayHelloHttpEndpoint',
        serviceName: 'SayHello',
        xpathInfo: {
          xpath: '//description//binding[@name="SayHelloHttpBinding"]//operation[@ref="tns:hi"]',
          wsdlNamespaceUrl: 'http://www.w3.org/ns/wsdl'
        }
      });

  });

  it('should assign operations to wsdl object when services is not in the file', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20()),
      fileContent = fs.readFileSync(specialCasesWSDLs + '/NoServicesTag.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      xmlParser = new XMLParser(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(3);

    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_SERVICE_MESSAGE))
      .to.equal(true);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'hi',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        url: '',
        portName: '',
        serviceName: ''
      });
  });

  it('should assign operations empty object when bindings is not in the file', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20()),
      fileContent = fs.readFileSync(specialCasesWSDLs + '/NoBindingsTags.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      xmlParser = new XMLParser(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(0);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_BINDIGS_MESSAGE))
      .to.equal(true);
  });

  it('should assign operations empty object when bindings operations are not in the file', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20()),
      xmlParser = new XMLParser(),
      fileContent = fs.readFileSync(specialCasesWSDLs + '/NoBindingsOperations.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(0);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_BINDIGS_OPERATIONS_MESSAGE))
      .to.equal(true);
  });

  it('should assign operations to wsdl object when services endpoints are not in the file', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20()),
      fileContent = fs.readFileSync(specialCasesWSDLs + '/NoServiceEndpoint.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      xmlParser = new XMLParser(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    expect(wsdlObject.operationsArray).to.be.an('array');
    expect(wsdlObject.operationsArray.length).to.equal(3);
    expect(wsdlObject.log.errors.includes(DOC_HAS_NO_SERVICE_PORT_MESSAGE))
      .to.equal(true);

    expect(wsdlObject.operationsArray[0]).to.be.an('object')
      .and.to.include({
        name: 'hi',
        method: POST_METHOD,
        protocol: SOAP_PROTOCOL,
        url: '',
        portName: '',
        serviceName: ''
      });
  });
});

describe('WSDL 2.0 parser assignSecurity', function () {
  it('Should return a wsdlObject with securityPolicyArray if file has security', function () {
    const parser = new Wsdl20Parser(new WsdlInformationService20()),
      xmlParser = new XMLParser(),
      fileContent = fs.readFileSync(validWSDLs20 + '/Axis2WSD20WithSecurity.wsdl', 'utf8');
    let wsdlObject = new WsdlObject(),
      parsed = xmlParser.parseToObject(fileContent);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);
    wsdlObject = parser.assignOperations(wsdlObject, parsed);
    wsdlObject = parser.assignSecurity(wsdlObject, parsed);

    expect(wsdlObject).to.be.an('object').to.include.key('securityPolicyArray');
  });
});
