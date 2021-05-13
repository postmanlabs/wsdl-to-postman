const
  {
    expect,
    assert
  } = require('chai'),
  {
    WsdlInformationService20,
    WSDL_ROOT
  } = require('../../lib/WsdlInformationService20'),
  {
    WsdlObject
  } = require('../../lib/WSDLObject'),
  {
    PARSER_ATTRIBUTE_NAME_PLACE_HOLDER,
    getServices,
    getBindings
  } = require('../../lib/WsdlParserCommon'),
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
    </wsdl2:description>`;

describe('WSDL 2.0 parser getLocationFromBindingOperation', function () {
  it('should throw error when operation is null', function () {
    const informationService = new WsdlInformationService20();
    try {
      informationService.getLocationFromBindingOperation(null, {});
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get style info from operation undefined or null object');
    }
  });

  it('should get null when binding tag info is null', function () {
    const informationService = new WsdlInformationService20();
    try {
      informationService.getLocationFromBindingOperation({}, null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get location info from operation');
    }
  });
});

describe('WSDL 2.0 getElementFromInterfaceOperationFault', function () {
  it('should get null when found element but not found ref', function () {
    const informationService = new WsdlInformationService20(),
      element = informationService.getElementFromInterfaceOperationFault({}, {
        outfault: {}
      }, null, '', 'outfault');
    expect(element).to.eq(null);
  });
});

describe('WSDL 2.0 getElementFromInterfaceOperationInOut', function () {
  it('should get null when not found element', function () {
    const informationService = new WsdlInformationService20(),
      element = informationService.getElementFromInterfaceOperationInOut({}, null, 'notfound', '');
    expect(element).to.eq(null);
  });
});

describe('WSDL 2.0 parser getInterfaceOperationByInterfaceNameAndOperationName', function () {
  it('should get interface operation by name', function () {
    const informationService = new WsdlInformationService20(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(WSDL_SAMPLE);
    services = getServices(parsed, WSDL_ROOT);
    operation = informationService.getInterfaceOperationByInterfaceNameAndOperationName('reservationInterface',
      'opCheckAvailability', parsed, '');
    expect(operation).to.be.an('object');
    expect(operation[PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('opCheckAvailability');
  });

  it('should get interface operation by name in WSDL_SAMPLE_AXIS', function () {
    const informationService = new WsdlInformationService20(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(WSDL_SAMPLE_AXIS);
    services = getServices(parsed, WSDL_ROOT);
    operation = informationService.getInterfaceOperationByInterfaceNameAndOperationName('ServiceInterface',
      'hi', parsed, 'wsdl2:');
    expect(operation).to.be.an('object');
    expect(operation[PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('hi');
  });

  it('should throw an error when parsedxml is null', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getInterfaceOperationByInterfaceNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', null, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get porttype from undefined or null object');
    }
  });

  it('should throw an error when parsedxml is undefined', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getInterfaceOperationByInterfaceNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', undefined, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get porttype from undefined or null object');
    }
  });

  it('should throw an error when parsedxml is an empty object', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getInterfaceOperationByInterfaceNameAndOperationName('NumberConversionSoapType',
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type from object');
    }
  });


  it('should throw an error when portTypeName is null', function () {
    try {
      const informationService = new WsdlInformationService20();

      informationService.getInterfaceOperationByInterfaceNameAndOperationName(null,
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter name');
    }
  });

  it('should throw an error when portTypeName is undefined', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getInterfaceOperationByInterfaceNameAndOperationName(undefined,
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter name');
    }
  });

  it('should throw an error when portTypeName is an empty string', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getInterfaceOperationByInterfaceNameAndOperationName('',
        'NumberToWords', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter name');
    }
  });

  it('should throw an error when operationName is null', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getInterfaceOperationByInterfaceNameAndOperationName('some string',
        null, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter operationName');
    }
  });

  it('should throw an error when operationName is undefined', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getInterfaceOperationByInterfaceNameAndOperationName('some string',
        undefined, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter operationName');
    }
  });

  it('should throw an error when operationName is an empty string', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getInterfaceOperationByInterfaceNameAndOperationName('ddd',
        '', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get port type with no filter operationName');
    }
  });
});

describe('WSDL 2.0 getInterfaceByInterfaceName', function () {
  it('should get an error when called with null parsed xml', function () {
    const informationService = new WsdlInformationService20();
    try {
      informationService.getInterfaceByInterfaceName('intefacename', null, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot interface from undefined or null object');
    }
  });
  it('should get an error when called with empty name', function () {
    const informationService = new WsdlInformationService20();
    try {
      informationService.getInterfaceByInterfaceName('', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get interface with no filter name');
    }
  });
  it('should get an error when called not found property', function () {
    const informationService = new WsdlInformationService20();
    try {
      informationService.getInterfaceByInterfaceName('s', {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get interface from object');
    }
  });
});

describe('WSDL 2.0 parser  getBindingInfoFromBindingTag', function () {
  it('should throw an error when Cannot get protocol', function () {
    const informationService = new WsdlInformationService20(),
      xmlParser = new XMLParser();
    try {
      let parsed = xmlParser.parseToObject(WSDL_SAMPLE),
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
});

describe('WSDL 2.0 getServiceAndServiceEndpointByBindingName', function () {
  it('should get the service endpoint when exists', function () {
    const informationService = new WsdlInformationService20(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(WSDL_SAMPLE),
      services = getServices(
        parsed,
        WSDL_ROOT
      ),
      serviceEndpoint = informationService.getServiceAndServiceEndpointByBindingName(
        'reservationSOAPBinding',
        services,
        ''
      ).endpoint;
    expect(serviceEndpoint).to.be.an('object');
    expect(serviceEndpoint[PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('reservationEndpoint');
  });

  it('should get the service endpoint when exists and called with WSDL_SAMPLE_AXIS', function () {
    const informationService = new WsdlInformationService20(),
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(WSDL_SAMPLE_AXIS),
      services = getServices(
        parsed,
        WSDL_ROOT
      ),
      serviceEndpoint = informationService.getServiceAndServiceEndpointByBindingName(
        'SayHelloSoap11Binding',
        services,
        'wsdl2:'
      ).endpoint;
    expect(serviceEndpoint).to.be.an('object');
    expect(serviceEndpoint[PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + 'name']).to.equal('SayHelloHttpSoap11Endpoint');
  });

  it('should throw an error when binding name is null', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getServiceAndServiceEndpointByBindingName(null, {}, '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('BindingName must have a value');
    }
  });

  it('should throw an error when principal prefix is null', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getServiceAndServiceEndpointByBindingName('bindingName', {}, null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('PrincipalPrefix must have a value');
    }
  });

  it('should throw an error when services is null', function () {

    const informationService = new WsdlInformationService20();
    let wsdlObject = new WsdlObject(),
      serviceEndpoint = informationService.getServiceAndServiceEndpointByBindingName('bindingName', null,
        'principal prefix', wsdlObject);
    expect(serviceEndpoint).to.equal(undefined);
  });

  it('should throw an error when service enpdoint is not found', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getServiceAndServiceEndpointByBindingName('bindingName', [], 'principal prefix');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get service endpoint from object');
    }
  });
  it('should throw an error when service enpdoint is array of null not found', function () {
    try {
      const informationService = new WsdlInformationService20();
      informationService.getServiceAndServiceEndpointByBindingName('bindingName', [null], 'principal prefix');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get service endpoint from object');
    }
  });
});


