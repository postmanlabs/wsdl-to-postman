const expect = require('chai').expect,
  {
    SchemaBuilderXSD
  } = require('../../lib/utils/SchemaBuilderXSD'),
  {
    Wsdl11Parser
  } = require('../../lib/Wsdl11Parser'),
  CORE_SCHEMA = `<xsd:schema elementFormDefault="qualified" xmlns:tns="http://tempuri.org/"
    targetNamespace="http://tempuri.org/">
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
<xsd:element name="XmlMethod">
    <xsd:complexType>
        <xsd:sequence>
            <xsd:element minOccurs="0" maxOccurs="1" name="zapato">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:any processContents="lax" />
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:sequence>
    </xsd:complexType>
</xsd:element>
<xsd:element name="XmlMethodResponse">
    <xsd:complexType />
</xsd:element>
<xsd:element name="TestCustomModel">
    <xsd:complexType>
        <xsd:sequence>
            <xsd:element minOccurs="0" maxOccurs="1" name="inputModel" type="tns:MyCustomModel" />
        </xsd:sequence>
    </xsd:complexType>
</xsd:element>
<xsd:element name="TestCustomModelResponse">
    <xsd:complexType>
        <xsd:sequence>
            <xsd:element minOccurs="0" maxOccurs="1" name="TestCustomModelResult" type="tns:MyCustomModel" />
        </xsd:sequence>
    </xsd:complexType>
</xsd:element>
<xsd:complexType name="MyCustomModel">
    <xsd:sequence>
        <xsd:element minOccurs="1" maxOccurs="1" name="Id" type="xsd:int" />
        <xsd:element minOccurs="0" maxOccurs="1" name="Name" type="xsd:string" />
        <xsd:element minOccurs="0" maxOccurs="1" name="Email" type="xsd:string" />
    </xsd:sequence>
</xsd:complexType>
</xsd:schema>`,
  CORE_FILE_INPUT = `<wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
   xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
   xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
   xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
   xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
   xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
   xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
   targetNamespace="http://tempuri.org/" name="ISampleService">
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
        <xsd:element name="XmlMethod">
            <xsd:complexType>
                <xsd:sequence>
                    <xsd:element minOccurs="0" maxOccurs="1" name="zapato">
                        <xsd:complexType>
                            <xsd:sequence>
                                <xsd:any processContents="lax" />
                            </xsd:sequence>
                        </xsd:complexType>
                    </xsd:element>
                </xsd:sequence>
            </xsd:complexType>
        </xsd:element>
        <xsd:element name="XmlMethodResponse">
            <xsd:complexType />
        </xsd:element>
        <xsd:element name="TestCustomModel">
            <xsd:complexType>
                <xsd:sequence>
                    <xsd:element minOccurs="0" maxOccurs="1" name="inputModel" type="tns:MyCustomModel" />
                </xsd:sequence>
            </xsd:complexType>
        </xsd:element>
        <xsd:element name="TestCustomModelResponse">
            <xsd:complexType>
                <xsd:sequence>
                    <xsd:element minOccurs="0" maxOccurs="1" name="TestCustomModelResult" type="tns:MyCustomModel" />
                </xsd:sequence>
            </xsd:complexType>
        </xsd:element>
        <xsd:complexType name="MyCustomModel">
            <xsd:sequence>
                <xsd:element minOccurs="1" maxOccurs="1" name="Id" type="xsd:int" />
                <xsd:element minOccurs="0" maxOccurs="1" name="Name" type="xsd:string" />
                <xsd:element minOccurs="0" maxOccurs="1" name="Email" type="xsd:string" />
            </xsd:sequence>
        </xsd:complexType>
    </xsd:schema>
</wsdl:types>
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
`;

describe('SchemaBuilderXSD Constructor', function() {
  it('should get an object of the schema builder', function() {
    const builder = new SchemaBuilderXSD();
    expect(builder).to.be.a('object');
  });

});

describe('SchemaBuilderXSD parseSchema', function() {
  it('should get an object of the schema parsed', function() {
    const builder = new SchemaBuilderXSD(),
      parsedSchema = builder.parseSchema(CORE_SCHEMA);
    expect(parsedSchema).to.be.a('object');
  });

});

describe('SchemaBuilderXSD getElements', function() {
  it('should get schema elements', function() {
    const builder = new SchemaBuilderXSD(),
      parser = new Wsdl11Parser(),
      schemaNameSpace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      thisNameSpace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://tempuri.org/',
        isDefault: false
      },
      parsedXml = parser.parseFromXmlToObject(CORE_FILE_INPUT),
      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', schemaNameSpace, thisNameSpace);
    expect(elements).to.be.a('array');
    expect(elements.length).to.eq(6);

    expect(elements[4].name).to.equal('TestCustomModel');
    expect(elements[4].isComplex).to.equal(true);
    expect(elements[4].type).to.equal('complex');
    expect(elements[4].minOccurs).to.equal('1');
    expect(elements[4].maxOccurs).to.equal('1');
    expect(elements[4].namespace).to.equal('http://tempuri.org/');
    expect(elements[4].children).to.be.an('array');

    expect(elements[4].children[0].name).to.equal('inputModel');
    expect(elements[4].children[0].isComplex).to.equal(true);
    expect(elements[4].children[0].type).to.equal('MyCustomModel');
    expect(elements[4].children[0].children).to.be.an('array');
    expect(elements[4].children[0].children.length).to.equal(3);

    expect(elements[4].children[0].children[0].name).to.equal('Id');
    expect(elements[4].children[0].children[0].isComplex).to.equal(false);
    expect(elements[4].children[0].children[0].type).to.equal('integer');
    expect(elements[4].children[0].children[0].maximum).to.equal(2147483647);
    expect(elements[4].children[0].children[0].minimum).to.equal(-2147483648);
    expect(elements[4].children[0].children[0].children).to.be.an('array');
    expect(elements[4].children[0].children[0].children).to.be.empty;

    expect(elements[4].children[0].children[1].name).to.equal('Name');
    expect(elements[4].children[0].children[1].isComplex).to.equal(false);
    expect(elements[4].children[0].children[1].type).to.equal('string');
    expect(elements[4].children[0].children[1].minOccurs).to.equal('0');
    expect(elements[4].children[0].children[1].maxOccurs).to.equal('1');
    expect(elements[4].children[0].children[1].children).to.be.an('array');
    expect(elements[4].children[0].children[1].children).to.be.empty;

    expect(elements[4].children[0].children[2].name).to.equal('Email');
    expect(elements[4].children[0].children[2].isComplex).to.equal(false);
    expect(elements[4].children[0].children[2].type).to.equal('string');
    expect(elements[4].children[0].children[2].minOccurs).to.equal('0');
    expect(elements[4].children[0].children[2].maxOccurs).to.equal('1');
    expect(elements[4].children[0].children[2].children).to.be.an('array');
    expect(elements[4].children[0].children[2].children).to.be.empty;
  });

  it('should get an empty array when the input has no elements', function() {
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
        </xs:schema>
      </types>
    </definitions>`,
      parser = new Wsdl11Parser(),
      schemaNameSpace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      thisNameSpace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://tempuri.org/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseFromXmlToObject(simpleInput),
      elements = builder.getElements(parsedXml, '', 'definitions', schemaNameSpace, thisNameSpace);
    expect(elements).to.be.an('array');
    expect(elements).to.be.empty;
  });

  it('should get an array of types with 1 root and 1 child', function() {
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
          </xs:schema>
        </types>
      </definitions>`,
      parser = new Wsdl11Parser(),
      schemaNameSpace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      thisNameSpace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.dataaccess.com/webservicesserver/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseFromXmlToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', schemaNameSpace, thisNameSpace);

    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('NumberToWords');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].minOccurs).to.equal('0');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(elements[0].children).to.be.an('array');

    expect(elements[0].children[0].name).to.equal('ubiNum');
    expect(elements[0].children[0].isComplex).to.equal(false);
    expect(elements[0].children[0].type).to.equal('integer');
    expect(elements[0].children[0].minOccurs).to.equal('1');
    expect(elements[0].children[0].maxOccurs).to.equal('1');
    expect(elements[0].children[0].children).to.be.an('array');
    expect(elements[0].children[0].children).to.be.empty;


    expect(elements[0].name).to.equal('NumberToWords');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].minOccurs).to.equal('0');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(elements[0].children).to.be.an('array');

    expect(elements[0].children[0].name).to.equal('ubiNum');
    expect(elements[0].children[0].isComplex).to.equal(false);
    expect(elements[0].children[0].type).to.equal('integer');
    expect(elements[0].children[0].minOccurs).to.equal('1');
    expect(elements[0].children[0].maxOccurs).to.equal('1');
    expect(elements[0].children[0].children).to.be.an('array');
    expect(elements[0].children[0].children).to.be.empty;
  });

  it('should get an array of types with 4 root and 1 child per root', function() {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
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
      </definitions>`,
      parser = new Wsdl11Parser(),
      schemaNameSpace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      thisNameSpace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.dataaccess.com/webservicesserver/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseFromXmlToObject(simpleInput),
      elements = builder.getElements(parsedXml, '', 'definitions', schemaNameSpace, thisNameSpace);

    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('NumberToWords');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].minOccurs).to.equal('0');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(elements[0].children).to.be.an('array');

    expect(elements[0].children[0].name).to.equal('ubiNum');
    expect(elements[0].children[0].isComplex).to.equal(false);
    expect(elements[0].children[0].type).to.equal('integer');
    expect(elements[0].children[0].minOccurs).to.equal('1');
    expect(elements[0].children[0].maxOccurs).to.equal('1');
    expect(elements[0].children[0].children).to.be.an('array');
    expect(elements[0].children[0].children).to.be.empty;

    expect(elements[1].name).to.equal('NumberToWordsResponse');
    expect(elements[1].isComplex).to.equal(true);
    expect(elements[1].type).to.equal('complex');
    expect(elements[1].minOccurs).to.equal('0');
    expect(elements[1].maxOccurs).to.equal('1');
    expect(elements[1].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(elements[1].children).to.be.an('array');

    expect(elements[1].children[0].name).to.equal('NumberToWordsResult');
    expect(elements[1].children[0].isComplex).to.equal(false);
    expect(elements[1].children[0].type).to.equal('string');
    expect(elements[1].children[0].minOccurs).to.equal('1');
    expect(elements[1].children[0].maxOccurs).to.equal('1');
    expect(elements[1].children[0].children).to.be.an('array');
    expect(elements[1].children[0].children).to.be.empty;

    expect(elements[2].name).to.equal('NumberToDollars');
    expect(elements[2].isComplex).to.equal(true);
    expect(elements[2].type).to.equal('complex');
    expect(elements[2].minOccurs).to.equal('0');
    expect(elements[2].maxOccurs).to.equal('1');
    expect(elements[2].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(elements[2].children).to.be.an('array');

    expect(elements[2].children[0].name).to.equal('dNum');
    expect(elements[2].children[0].isComplex).to.equal(false);
    expect(elements[2].children[0].type).to.equal('number');
    expect(elements[2].children[0].minOccurs).to.equal('1');
    expect(elements[2].children[0].maxOccurs).to.equal('1');
    expect(elements[2].children[0].children).to.be.an('array');
    expect(elements[2].children[0].children).to.be.empty;

    expect(elements[3].name).to.equal('NumberToDollarsResponse');
    expect(elements[3].isComplex).to.equal(true);
    expect(elements[3].type).to.equal('complex');
    expect(elements[3].minOccurs).to.equal('0');
    expect(elements[3].maxOccurs).to.equal('1');
    expect(elements[3].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(elements[3].children).to.be.an('array');

    expect(elements[3].children[0].name).to.equal('NumberToDollarsResult');
    expect(elements[3].children[0].isComplex).to.equal(false);
    expect(elements[3].children[0].type).to.equal('string');
    expect(elements[3].children[0].minOccurs).to.equal('1');
    expect(elements[3].children[0].maxOccurs).to.equal('1');
    expect(elements[3].children[0].children).to.be.an('array');
    expect(elements[3].children[0].children).to.be.empty;
  });

  it('should get an array of types with 1 root and 1 complex type', function() {
    const simpleInput = `<wsdl:definitions
       xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
       xmlns:tns="http://tempuri.org/" 
       xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
       xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http" 
       xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" 
       xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
       xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
       xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
       xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
       targetNamespace="http://tempuri.org/" 
       name="ISampleService">
       <wsdl:types>
       <xsd:schema elementFormDefault="qualified" targetNamespace="http://tempuri.org/">
           <xsd:import namespace="http://schemas.microsoft.com/2003/10/Serialization/Arrays" />
           <xsd:import namespace="http://schemas.datacontract.org/2004/07/System" />
           <xsd:element name="TestCustomModel">
               <xsd:complexType>
                   <xsd:sequence>
                       <xsd:element minOccurs="0" maxOccurs="1" name="inputModel" type="tns:MyCustomModel" />
                   </xsd:sequence>
               </xsd:complexType>
           </xsd:element>
           <xsd:element name="TestCustomModelResponse">
               <xsd:complexType>
                   <xsd:sequence>
                       <xsd:element minOccurs="0" maxOccurs="1" name="TestCustomModelResult" type="tns:MyCustomModel" />
                   </xsd:sequence>
               </xsd:complexType>
           </xsd:element>
           <xsd:complexType name="MyCustomModel">
               <xsd:sequence>
                   <xsd:element minOccurs="1" maxOccurs="1" name="Id" type="xsd:int" />
                   <xsd:element minOccurs="0" maxOccurs="1" name="Name" type="xsd:string" />
                   <xsd:element minOccurs="0" maxOccurs="1" name="Email" type="xsd:string" />
               </xsd:sequence>
           </xsd:complexType>
       </xsd:schema>
   </wsdl:types>
  </wsdl:definitions>
  `,
      parser = new Wsdl11Parser(),
      schemaNameSpace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      thisNameSpace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://tempuri.org/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseFromXmlToObject(simpleInput),
      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', schemaNameSpace, thisNameSpace);
    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('TestCustomModel');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].minOccurs).to.equal('1');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('http://tempuri.org/');
    expect(elements[0].children).to.be.an('array');

    expect(elements[0].children[0].name).to.equal('inputModel');
    expect(elements[0].children[0].isComplex).to.equal(true);
    expect(elements[0].children[0].type).to.equal('MyCustomModel');
    expect(elements[0].children[0].minOccurs).to.equal('1');
    expect(elements[0].children[0].maxOccurs).to.equal('1');
    expect(elements[0].children[0].children).to.be.an('array');
    expect(elements[0].children[0].children.length).to.equal(3);

    expect(elements[0].children[0].children[0].name).to.equal('Id');
    expect(elements[0].children[0].children[0].isComplex).to.equal(false);
    expect(elements[0].children[0].children[0].type).to.equal('integer');
    expect(elements[0].children[0].children[0].minOccurs).to.equal('1');
    expect(elements[0].children[0].children[0].maxOccurs).to.equal('1');
    expect(elements[0].children[0].children[0].children).to.be.an('array');
    expect(elements[0].children[0].children[0].children).to.be.empty;

    expect(elements[0].children[0].children[1].name).to.equal('Name');
    expect(elements[0].children[0].children[1].isComplex).to.equal(false);
    expect(elements[0].children[0].children[1].type).to.equal('string');
    expect(elements[0].children[0].children[1].minOccurs).to.equal('0');
    expect(elements[0].children[0].children[1].maxOccurs).to.equal('1');
    expect(elements[0].children[0].children[1].children).to.be.an('array');
    expect(elements[0].children[0].children[1].children).to.be.empty;

    expect(elements[0].children[0].children[2].name).to.equal('Email');
    expect(elements[0].children[0].children[2].isComplex).to.equal(false);
    expect(elements[0].children[0].children[2].type).to.equal('string');
    expect(elements[0].children[0].children[2].minOccurs).to.equal('0');
    expect(elements[0].children[0].children[2].maxOccurs).to.equal('1');
    expect(elements[0].children[0].children[2].children).to.be.an('array');
    expect(elements[0].children[0].children[2].children).to.be.empty;
  });

  it('should get an array of types with 1 root and 1 complex type Scenario 2', function() {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
      xmlns:tns="http://www.oorsprong.org/websamples.countryinfo" 
      name="CountryInfoService" targetNamespace="http://www.oorsprong.org/websamples.countryinfo">
      <types>
         <xs:schema elementFormDefault="qualified" targetNamespace="http://www.oorsprong.org/websamples.countryinfo">
             <xs:complexType name="tCurrency">
                 <xs:sequence>
                     <xs:element name="sISOCode" type="xs:string" />
                     <xs:element name="sName" type="xs:string" />
                 </xs:sequence>
             </xs:complexType>
             <xs:complexType name="ArrayOftCurrency">
                 <xs:sequence>
                     <xs:element name="tCurrency" 
                     type="tns:tCurrency" minOccurs="0" maxOccurs="unbounded" nillable="true" />
                 </xs:sequence>
             </xs:complexType>
             <xs:element name="ListOfCurrenciesByCodeResponse">
                 <xs:complexType>
                     <xs:sequence>
                         <xs:element name="ListOfCurrenciesByCodeResult" type="tns:ArrayOftCurrency" />
                     </xs:sequence>
                 </xs:complexType>
             </xs:element>
         </xs:schema>
     </types>
  </definitions>`,
      parser = new Wsdl11Parser(),
      schemaNameSpace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      thisNameSpace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.oorsprong.org/websamples.countryinfo',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      elements = builder.getElements(parsed, '', 'definitions', schemaNameSpace, thisNameSpace);
    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('ListOfCurrenciesByCodeResponse');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].minOccurs).to.equal('0');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('http://www.oorsprong.org/websamples.countryinfo');
    expect(elements[0].children).to.be.an('array');

    expect(elements[0].children[0].name).to.equal('ListOfCurrenciesByCodeResult');
    expect(elements[0].children[0].isComplex).to.equal(true);

    expect(elements[0].children[0].children[0].name).to.equal('tCurrency');
    expect(elements[0].children[0].children[0].isComplex).to.equal(true);

    expect(elements[0].children[0].children[0].children[0].name).to.equal('sISOCode');
    expect(elements[0].children[0].children[0].children[0].isComplex).to.equal(false);
    expect(elements[0].children[0].children[0].children[0].type).to.equal('string');

  });

  it('should throw an error when parsed is undefined', function() {
    const schemaNameSpace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      thisNameSpace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.oorsprong.org/websamples.countryinfo',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    try {
      builder.getElements(undefined, '', 'definitions', schemaNameSpace, thisNameSpace);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get elements from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function() {
    const schemaNameSpace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      thisNameSpace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.oorsprong.org/websamples.countryinfo',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    try {
      builder.getElements(null, '', 'definitions', schemaNameSpace, thisNameSpace);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get elements from undefined or null object');
    }
  });
});