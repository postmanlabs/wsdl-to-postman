const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  validWSDLs20 = 'test/data/validWSDLs20',
  fs = require('fs'),
  async = require('async');
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

describe('SchemaPack convert unit test WSDL 1.1', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs);
  async.each(validWSDLsFolder, function(file) {
    it('Should get an object representing PM Collection from ' + file, function() {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
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
  });
});


describe('SchemaPack convert unit test WSDL 2.0', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs20);
  async.each(validWSDLsFolder, function(file) {
    it('Should get an object representing PM Collection from ' + file, function() {
      let fileContent = fs.readFileSync(validWSDLs20 + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
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
  });
});

//   it('esc 5: should get an object representing inputFileTemperatureHasHttp example PM Collection',
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
