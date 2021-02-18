const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  inputFileNumberConvertion = `<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
   xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
    xmlns:tns="http://www.dataaccess.com/webservicesserver/"
    name="NumberConversion"
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
  inputFileCalculator = `<?xml version="1.0" encoding="utf-8"?>
  <?xml-stylesheet type="text/xsl" href="http://tomi.vanek.sk/xml/wsdl-viewer.xsl"?>
  <wsdl:definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
  xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
  xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
  xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
  xmlns:tns="http://tempuri.org/" 
  xmlns:s="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
  xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
  xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://tempuri.org/">
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
              <s:element name="Subtract">
                  <s:complexType>
                      <s:sequence>
                          <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                          <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                      </s:sequence>
                  </s:complexType>
              </s:element>
              <s:element name="SubtractResponse">
                  <s:complexType>
                      <s:sequence>
                          <s:element minOccurs="1" maxOccurs="1" name="SubtractResult" type="s:int" />
                      </s:sequence>
                  </s:complexType>
              </s:element>
              <s:element name="Multiply">
                  <s:complexType>
                      <s:sequence>
                          <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                          <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                      </s:sequence>
                  </s:complexType>
              </s:element>
              <s:element name="MultiplyResponse">
                  <s:complexType>
                      <s:sequence>
                          <s:element minOccurs="1" maxOccurs="1" name="MultiplyResult" type="s:int" />
                      </s:sequence>
                  </s:complexType>
              </s:element>
              <s:element name="Divide">
                  <s:complexType>
                      <s:sequence>
                          <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                          <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                      </s:sequence>
                  </s:complexType>
              </s:element>
              <s:element name="DivideResponse">
                  <s:complexType>
                      <s:sequence>
                          <s:element minOccurs="1" maxOccurs="1" name="DivideResult" type="s:int" />
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
      <wsdl:message name="SubtractSoapIn">
          <wsdl:part name="parameters" element="tns:Subtract" />
      </wsdl:message>
      <wsdl:message name="SubtractSoapOut">
          <wsdl:part name="parameters" element="tns:SubtractResponse" />
      </wsdl:message>
      <wsdl:message name="MultiplySoapIn">
          <wsdl:part name="parameters" element="tns:Multiply" />
      </wsdl:message>
      <wsdl:message name="MultiplySoapOut">
          <wsdl:part name="parameters" element="tns:MultiplyResponse" />
      </wsdl:message>
      <wsdl:message name="DivideSoapIn">
          <wsdl:part name="parameters" element="tns:Divide" />
      </wsdl:message>
      <wsdl:message name="DivideSoapOut">
          <wsdl:part name="parameters" element="tns:DivideResponse" />
      </wsdl:message>
      <wsdl:portType name="CalculatorSoap">
          <wsdl:operation name="Add">
              <wsdl:documentation 
              xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
              Adds two integers. This is a test WebService. ©DNE Online
              </wsdl:documentation>
              <wsdl:input message="tns:AddSoapIn" />
              <wsdl:output message="tns:AddSoapOut" />
          </wsdl:operation>
          <wsdl:operation name="Subtract">
              <wsdl:input message="tns:SubtractSoapIn" />
              <wsdl:output message="tns:SubtractSoapOut" />
          </wsdl:operation>
          <wsdl:operation name="Multiply">
              <wsdl:input message="tns:MultiplySoapIn" />
              <wsdl:output message="tns:MultiplySoapOut" />
          </wsdl:operation>
          <wsdl:operation name="Divide">
              <wsdl:input message="tns:DivideSoapIn" />
              <wsdl:output message="tns:DivideSoapOut" />
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
          <wsdl:operation name="Subtract">
              <soap:operation soapAction="http://tempuri.org/Subtract" style="document" />
              <wsdl:input>
                  <soap:body use="literal" />
              </wsdl:input>
              <wsdl:output>
                  <soap:body use="literal" />
              </wsdl:output>
          </wsdl:operation>
          <wsdl:operation name="Multiply">
              <soap:operation soapAction="http://tempuri.org/Multiply" style="document" />
              <wsdl:input>
                  <soap:body use="literal" />
              </wsdl:input>
              <wsdl:output>
                  <soap:body use="literal" />
              </wsdl:output>
          </wsdl:operation>
          <wsdl:operation name="Divide">
              <soap:operation soapAction="http://tempuri.org/Divide" style="document" />
              <wsdl:input>
                  <soap:body use="literal" />
              </wsdl:input>
              <wsdl:output>
                  <soap:body use="literal" />
              </wsdl:output>
          </wsdl:operation>
      </wsdl:binding>
      <wsdl:binding name="CalculatorSoap12" type="tns:CalculatorSoap">
          <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
          <http:binding verb="POST" />
          
          <wsdl:operation name="Add">
              <soap12:operation soapAction="http://tempuri.org/Add" style="document" />
              <wsdl:input>
                  <soap12:body use="literal" />
              </wsdl:input>
              <wsdl:output>
                  <soap12:body use="literal" />
              </wsdl:output>
          </wsdl:operation>
          <wsdl:operation name="Subtract">
              <soap12:operation soapAction="http://tempuri.org/Subtract" style="document" />
              <wsdl:input>
                  <soap12:body use="literal" />
              </wsdl:input>
              <wsdl:output>
                  <soap12:body use="literal" />
              </wsdl:output>
          </wsdl:operation>
          <wsdl:operation name="Multiply">
              <soap12:operation soapAction="http://tempuri.org/Multiply" style="document" />
              <wsdl:input>
                  <soap12:body use="literal" />
              </wsdl:input>
              <wsdl:output>
                  <soap12:body use="literal" />
              </wsdl:output>
          </wsdl:operation>
          <wsdl:operation name="Divide">
              <soap12:operation soapAction="http://tempuri.org/Divide" style="document" />
              <wsdl:input>
                  <soap12:body use="literal" />
              </wsdl:input>
              <wsdl:output>
                  <soap12:body use="literal" />
              </wsdl:output>
          </wsdl:operation>
      </wsdl:binding>
      <wsdl:service name="Calculator">
          <wsdl:port name="CalculatorSoap" binding="tns:CalculatorSoap">
              <soap:address location="http://www.dneonline.com/calculator.asmx" />
          </wsdl:port>
          <wsdl:port name="CalculatorSoap12" binding="tns:CalculatorSoap12">
              <soap12:address location="http://www.dneonline.com/calculator.asmx" />
          </wsdl:port>
      </wsdl:service>
  </wsdl:definitions>
  `,
  inputFileNetcoreTest = `<wsdl:definitions
   xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"
    xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract"
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" 
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" 
    xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
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
                    <xsd:element minOccurs="0" maxOccurs="1" name="XmlMethodRequest" type="xsd:string" />
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
//   inputFileTemperatureHasHttp = `<wsdl:definitions
//   xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/
//   xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
//   xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/"
//   xmlns:tns="https://www.w3schools.com/xml/"
//   xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
//   xmlns:s="http://www.w3.org/2001/XMLSchema"
//   xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
//   xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
//   xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
//   targetNamespace="https://www.w3schools.com/xml/">
// <wsdl:types>
//     <s:schema elementFormDefault="qualified" targetNamespace="https://www.w3schools.com/xml/">
//         <s:element name="FahrenheitToCelsius">
//             <s:complexType>
//                 <s:sequence>
//                     <s:element minOccurs="0" maxOccurs="1" name="Fahrenheit" type="s:string" />
//                 </s:sequence>
//             </s:complexType>
//         </s:element>
//         <s:element name="FahrenheitToCelsiusResponse">
//             <s:complexType>
//                 <s:sequence>
//                     <s:element minOccurs="0" maxOccurs="1" name="FahrenheitToCelsiusResult" type="s:string" />
//                 </s:sequence>
//             </s:complexType>
//         </s:element>
//         <s:element name="CelsiusToFahrenheit">
//             <s:complexType>
//                 <s:sequence>
//                     <s:element minOccurs="0" maxOccurs="1" name="Celsius" type="s:string" />
//                 </s:sequence>
//             </s:complexType>
//         </s:element>
//         <s:element name="CelsiusToFahrenheitResponse">
//             <s:complexType>
//                 <s:sequence>
//                     <s:element minOccurs="0" maxOccurs="1" name="CelsiusToFahrenheitResult" type="s:string" />
//                 </s:sequence>
//             </s:complexType>
//         </s:element>
//         <s:element name="string" nillable="true" type="s:string" />
//     </s:schema>
// </wsdl:types>
// <wsdl:message name="FahrenheitToCelsiusSoapIn">
//     <wsdl:part name="parameters" element="tns:FahrenheitToCelsius" />
// </wsdl:message>
// <wsdl:message name="FahrenheitToCelsiusSoapOut">
//     <wsdl:part name="parameters" element="tns:FahrenheitToCelsiusResponse" />
// </wsdl:message>
// <wsdl:message name="CelsiusToFahrenheitSoapIn">
//     <wsdl:part name="parameters" element="tns:CelsiusToFahrenheit" />
// </wsdl:message>
// <wsdl:message name="CelsiusToFahrenheitSoapOut">
//     <wsdl:part name="parameters" element="tns:CelsiusToFahrenheitResponse" />
// </wsdl:message>
// <wsdl:message name="FahrenheitToCelsiusHttpPostIn">
//     <wsdl:part name="Fahrenheit" type="s:string" />
// </wsdl:message>
// <wsdl:message name="FahrenheitToCelsiusHttpPostOut">
//     <wsdl:part name="Body" element="tns:string" />
// </wsdl:message>
// <wsdl:message name="CelsiusToFahrenheitHttpPostIn">
//     <wsdl:part name="Celsius" type="s:string" />
// </wsdl:message>
// <wsdl:message name="CelsiusToFahrenheitHttpPostOut">
//     <wsdl:part name="Body" element="tns:string" />
// </wsdl:message>
// <wsdl:portType name="TempConvertSoap">
//     <wsdl:operation name="FahrenheitToCelsius">
//         <wsdl:input message="tns:FahrenheitToCelsiusSoapIn" />
//         <wsdl:output message="tns:FahrenheitToCelsiusSoapOut" />
//     </wsdl:operation>
//     <wsdl:operation name="CelsiusToFahrenheit">
//         <wsdl:input message="tns:CelsiusToFahrenheitSoapIn" />
//         <wsdl:output message="tns:CelsiusToFahrenheitSoapOut" />
//     </wsdl:operation>
// </wsdl:portType>
// <wsdl:portType name="TempConvertHttpPost">
//     <wsdl:operation name="FahrenheitToCelsius">
//         <wsdl:input message="tns:FahrenheitToCelsiusHttpPostIn" />
//         <wsdl:output message="tns:FahrenheitToCelsiusHttpPostOut" />
//     </wsdl:operation>
//     <wsdl:operation name="CelsiusToFahrenheit">
//         <wsdl:input message="tns:CelsiusToFahrenheitHttpPostIn" />
//         <wsdl:output message="tns:CelsiusToFahrenheitHttpPostOut" />
//     </wsdl:operation>
// </wsdl:portType>
// <wsdl:binding name="TempConvertSoap" type="tns:TempConvertSoap">
//     <soap:binding transport="http://schemas.xmlsoap.org/soap/http" />
//     <wsdl:operation name="FahrenheitToCelsius">
//         <soap:operation soapAction="https://www.w3schools.com/xml/FahrenheitToCelsius" style="document" />
//         <wsdl:input>
//             <soap:body use="literal" />
//         </wsdl:input>
//         <wsdl:output>
//             <soap:body use="literal" />
//         </wsdl:output>
//     </wsdl:operation>
//     <wsdl:operation name="CelsiusToFahrenheit">
//         <soap:operation soapAction="https://www.w3schools.com/xml/CelsiusToFahrenheit" style="document" />
//         <wsdl:input>
//             <soap:body use="literal" />
//         </wsdl:input>
//         <wsdl:output>
//             <soap:body use="literal" />
//         </wsdl:output>
//     </wsdl:operation>
// </wsdl:binding>
// <wsdl:binding name="TempConvertSoap12" type="tns:TempConvertSoap">
//     <soap12:binding transport="http://schemas.xmlsoap.org/soap/http" />
//     <wsdl:operation name="FahrenheitToCelsius">
//         <soap12:operation soapAction="https://www.w3schools.com/xml/FahrenheitToCelsius" style="document" />
//         <wsdl:input>
//             <soap12:body use="literal" />
//         </wsdl:input>
//         <wsdl:output>
//             <soap12:body use="literal" />
//         </wsdl:output>
//     </wsdl:operation>
//     <wsdl:operation name="CelsiusToFahrenheit">
//         <soap12:operation soapAction="https://www.w3schools.com/xml/CelsiusToFahrenheit" style="document" />
//         <wsdl:input>
//             <soap12:body use="literal" />
//         </wsdl:input>
//         <wsdl:output>
//             <soap12:body use="literal" />
//         </wsdl:output>
//     </wsdl:operation>
// </wsdl:binding>
// <wsdl:binding name="TempConvertHttpPost" type="tns:TempConvertHttpPost">
//     <http:binding verb="POST" />
//     <wsdl:operation name="FahrenheitToCelsius">
//         <http:operation location="/FahrenheitToCelsius" />
//         <wsdl:input>
//             <mime:content type="application/x-www-form-urlencoded" />
//         </wsdl:input>
//         <wsdl:output>
//             <mime:mimeXml part="Body" />
//         </wsdl:output>
//     </wsdl:operation>
//     <wsdl:operation name="CelsiusToFahrenheit">
//         <http:operation location="/CelsiusToFahrenheit" />
//         <wsdl:input>
//             <mime:content type="application/x-www-form-urlencoded" />
//         </wsdl:input>
//         <wsdl:output>
//             <mime:mimeXml part="Body" />
//         </wsdl:output>
//     </wsdl:operation>
// </wsdl:binding>
// <wsdl:service name="TempConvert">
//     <wsdl:port name="TempConvertSoap" binding="tns:TempConvertSoap">
//         <soap:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
//     </wsdl:port>
//     <wsdl:port name="TempConvertSoap12" binding="tns:TempConvertSoap12">
//         <soap12:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
//     </wsdl:port>
//     <wsdl:port name="TempConvertHttpPost" binding="tns:TempConvertHttpPost">
//         <http:address location="http://www.w3schools.com/xml/tempconvert.asmx" />
//     </wsdl:port>
// </wsdl:service>
// </wsdl:definitions>
// `

describe('SchemaPack convert', function() {
  it('esc 1: should get an object representing number conversion PM Collection',
    function() {
      const schemaPack = new SchemaPack({
        data: inputFileNumberConvertion,
        type: 'string'
      }, {});
      schemaPack.convert((error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
        expect(result.output[0].data).to.be.an('object');
      });
    });

  it('esc 2: should get an object representing calculator PM Collection',
    function() {
      const schemaPack = new SchemaPack({
        data: inputFileCalculator,
        type: 'string'
      }, {});
      schemaPack.convert((error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
        expect(result.output[0].data).to.be.an('object');
      });
    });

  it('esc 3: should get an object representing netcore example PM Collection',
    function() {
      const schemaPack = new SchemaPack({
        data: inputFileNetcoreTest,
        type: 'string'
      }, {});
      schemaPack.convert((error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
        expect(result.output[0].data).to.be.an('object');
      });
    });

  //   it('esc 4: should get an object representing inputFileTemperatureHasHttp example PM Collection',
  //     function() {
  //       const schemaPack = new SchemaPack({
  //         data: inputFileTemperatureHasHttp,
  //         type: 'string'
  //       }, {});
  //       schemaPack.convert((error, result) => {
  //         expect(error).to.be.null;
  //         expect(result).to.be.an('object');
  //         expect(result.output).to.be.an('array');
  //         expect(result.output[0].data).to.be.an('object');
  //         expect(result.output[0].type).to.equal('collection');
  //         expect(result.output[0].data).to.be.an('object');
  //       })
  //     });

});
