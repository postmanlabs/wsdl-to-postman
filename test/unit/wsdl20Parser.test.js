const expect = require('chai').expect,
  assert = require('chai').assert,
  WsdlObject = require('../../lib/WsdlObject').WsdlObject,
  {
    Wsdl20Parser,
    WSDL_NS_URL
  } = require('../../lib/Wsdl20Parser'),
  {
    PARSER_ATRIBUTE_NAME_PLACE_HOLDER
  } = require('../../lib/WsdlParserCommon'),
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
  </description>`;

describe('WSDL 2.0 parser constructor', function() {
  it('should get an object wsdl 2.0 parser', function() {
    const parser = new Wsdl20Parser();
    expect(parser).to.be.an('object');
  });
});


describe('WSDL 2.0 parser parseFromXmlToObject', function() {

  it('should get an object in memory representing xml object with valid input', function() {
    const simpleInput = `<user is='great'>
      <name>Tobias</name>
      <familyName>Nickel</familyName>
      <profession>Software Developer</profession>
      <location>Shanghai / China</location>
      </user>`,
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput);
    expect(parsed).to.be.an('object');
    expect(parsed).to.have.own.property('user');
    expect(parsed.user).to.have.own.property('name');
    expect(parsed.user[PARSER_ATRIBUTE_NAME_PLACE_HOLDER + 'is']).to.equal('great');

  });

  it('should throw an error when input is an empty string', function() {
    parser = new Wsdl20Parser();
    try {
      parser.parseFromXmlToObject('');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is null', function() {
    parser = new Wsdl20Parser();
    try {
      parser.parseFromXmlToObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is undefined', function() {
    parser = new Wsdl20Parser();
    try {
      parser.parseFromXmlToObject(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });
});

describe('WSDL 2.0 get principalPrefix', function() {
  it('should get empty string when called with <description>', function() {
    const simpleInput = `<?xml version="1.0" encoding="utf-8" ?>
    <description xmlns="http://www.w3.org/ns/wsdl" 
    targetNamespace="http://greath.example.com/2004/wsdl/resSvc" 
    xmlns:tns="http://greath.example.com/2004/wsdl/resSvc" 
    xmlns:ghns="http://greath.example.com/2004/schemas/resSvc" 
    xmlns:wsoap="http://www.w3.org/ns/wsdl/soap" 
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
    xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions">
    </description>`,
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      principalPrefix = parser.getPrincipalPrefix(
        parsed
      );
    expect(principalPrefix).to.equal('');
  });

  it('should get wsdl2 called with <wsdl2:description>', function() {
    const simpleInput = `<?xml version="1.0" encoding="utf-8" ?>
    <wsdl2:description xmlns="http://www.w3.org/ns/wsdl" 
    targetNamespace="http://greath.example.com/2004/wsdl/resSvc" 
    xmlns:tns="http://greath.example.com/2004/wsdl/resSvc" 
    xmlns:ghns="http://greath.example.com/2004/schemas/resSvc" 
    xmlns:wsoap="http://www.w3.org/ns/wsdl/soap" 
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
    xmlns:wsdlx="http://www.w3.org/ns/wsdl-extensions">
    </wsdl2:description>`,
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      principalPrefix = parser.getPrincipalPrefix(
        parsed
      );
    expect(principalPrefix).to.equal('wsdl2:');
  });
});

describe('WSDL 2.0 parser getNamespaceByURL', function() {

  it('should get wsoap when called with http://www.w3.org/ns/wsdl/soap', function() {
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
      wsdlnamespace = parser.getNamespaceByURL(
        parsed,
        'http://www.w3.org/ns/wsdl/soap'
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('wsoap');
    expect(wsdlnamespace.url).to.equal('http://www.w3.org/ns/wsdl/soap');
    expect(wsdlnamespace.isDefault).to.equal(false);

  });

  it('should get ns when called with http://axis2.org', function() {
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
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getNamespaceByURL(
        parsed,
        'http://www.w3.org/ns/wsdl'
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('xmlns');
    expect(wsdlnamespace.url).to.equal('http://www.w3.org/ns/wsdl');
    expect(wsdlnamespace.isDefault).to.equal(true);

  });

});

describe('WSDL 2.0 parser getNamespaceBykey', function() {

  it('should get wsoap when called with http://www.w3.org/ns/wsdl/soap', function() {
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
      wsdlnamespace = parser.getNamespaceByKey(
        parsed,
        'xmlns:tns'
      );
    expect(wsdlnamespace).to.be.an('object');
    expect(wsdlnamespace.key).to.equal('xmlns:tns');
    expect(wsdlnamespace.url).to.equal('http://axis2.org');
    expect(wsdlnamespace.isDefault).to.equal(false);

  });
});

describe('WSDL 2.0 parser getAllNamespaces', function() {

  it('should get 11 elements when called with nex entry', function() {
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
      parser = new Wsdl20Parser();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      wsdlnamespace = parser.getAllNamespaces(
        parsed
      );
    expect(wsdlnamespace).to.be.an('array');
    expect(wsdlnamespace.length).to.equal(11);
  });

  it('should throw an error when parsed is null', function() {
    const parser = new Wsdl20Parser();
    try {
      let wsdlnamespace = parser.getAllNamespaces(
        null
      );
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(11);
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespaces from undefined or null object');
    }
  });

  it('should throw an error when parsed is undefined', function() {
    const parser = new Wsdl20Parser();
    try {
      let wsdlnamespace = parser.getAllNamespaces(
        undefined
      );
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(11);
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespaces from undefined or null object');
    }
  });

  it('should throw an error when parsed is empty', function() {
    const parser = new Wsdl20Parser();
    try {
      let wsdlnamespace = parser.getAllNamespaces({});
      expect(wsdlnamespace).to.be.an('array');
      expect(wsdlnamespace.length).to.equal(11);
    }
    catch (error) {
      expect(error.message).to.equal('Can not get namespaces from object');
    }
  });
});

describe('WSDL 2.0 parser assignNamespaces', function() {

  it('should assign namespaces to wsdl object', function() {
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
      parser = new Wsdl20Parser();
    let wsdlObject = new WsdlObject(),
      parsed = parser.parseFromXmlToObject(simpleInput);
    wsdlObject = parser.assignNamespaces(wsdlObject, parsed);

    expect(wsdlObject).to.have.all.keys('targetNamespace',
      'wsdlNamespace', 'SOAPNamespace', 'HTTPNamespace',
      'SOAP12Namespace', 'schemaNamespace',
      'tnsNamespace', 'allNameSpaces', 'fileName',
      'operationsArray');

    expect(wsdlObject.targetNamespace.url).to.equal('http://axis2.org');
    expect(wsdlObject.tnsNamespace.url).to.equal('http://axis2.org');
    expect(wsdlObject.wsdlNamespace.key).to.equal('wsdl2');
    expect(wsdlObject.SOAPNamespace.key).to.equal('wsoap');
    expect(wsdlObject.schemaNamespace.key).to.equal('xs');

  });

});


describe('WSDL 2.0 parser getWsdlObject', function() {

  it('should get an object in memory representing wsdlObject 2.0',
    function() {
      const parser = new Wsdl20Parser();
      let wsdlObject = parser.getWsdlObject(WSDL_SAMPLE);
      expect(wsdlObject).to.be.an('object');
      expect(wsdlObject).to.have.all.keys('targetNamespace',
        'wsdlNamespace', 'SOAPNamespace', 'HTTPNamespace',
        'SOAP12Namespace', 'schemaNamespace',
        'tnsNamespace', 'allNameSpaces', 'fileName',
        'operationsArray');

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

  it('should throw an error when parsedxml is null', function() {
    try {
      const parser = new Wsdl20Parser();
      parser.getWsdlObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('xmlDocumentContent must have a value');
    }
  });

});
