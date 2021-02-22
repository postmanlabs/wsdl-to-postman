const expect = require('chai').expect,
  assert = require('chai').assert,
  WsdlObject = require('../../lib/WsdlObject').WsdlObject,
  {
    Wsdl20Parser
  } = require('../../lib/Wsdl20Parser'),
  {
    PARSER_ATRIBUTE_NAME_PLACE_HOLDER
  } = require('../../lib/WsdlParserCommon');

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
