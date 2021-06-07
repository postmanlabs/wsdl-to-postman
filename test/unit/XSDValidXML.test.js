const expect = require('chai').expect,
  {
    XSDValidXML
  } = require('../../lib/XSDValidXML'),
  {
    PARSER_ATTRIBUTE_NAME_PLACE_HOLDER
  } = require('../../lib/WsdlParserCommon'),
  UNCLEAN_INPUT_XML = `This XML file does not appear to have any style information associated with it.
  The document tree is shown below. this text should be ignored while parsing
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
xmlns:tns="http://www.oorsprong.org/websamples.countryinfo" 
name="CountryInfoService" targetNamespace="http://www.oorsprong.org/websamples.countryinfo">
   <message name="LanguageISOCodeSoapResponse">
       <part name="parameters" element="tns:LanguageISOCodeResponse" />
   </message>
   <portType name="CountryInfoServiceSoapType">
       <operation name="LanguageISOCode">
           <documentation>Find a language ISO code based on the passed language name</documentation>
           <input message="tns:LanguageISOCodeSoapRequest" />
           <output message="tns:LanguageISOCodeSoapResponse" />
       </operation>
   </portType>
   <binding name="CountryInfoServiceSoapBinding" type="tns:CountryInfoServiceSoapType">
       <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http" />
       <operation name="LanguageISOCode">
           <soap:operation soapAction="" style="document" />
           <input>
           <soap:body use="literal" />
           </input>
           <output>
               <soap:body use="literal" />
           </output>
       </operation>
   </binding>
   <service name="CountryInfoService">
       <documentation>This DataFlex Web Service opens up country information. 2 
       letter ISO codes are used for Country code. There are functions to retrieve the used Currency,
        Language, Capital City, Continent and Telephone code.</documentation>
       <port name="CountryInfoServiceSoap" binding="tns:CountryInfoServiceSoapBinding">
           <soap:address location="http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso" />
       </port>
   </service>
</definitions>`;

describe('XSDValidXML constructor', function() {
  it('should get an object of type XSDValidXML', function() {
    const validator = new XSDValidXML(); 
    expect(validator).to.be.an('object');
  });
});


describe('XSDValidXML constructor', function() {
  it('should get an object of type XSDValidXML', function() {
    const validator = new XSDValidXML(); 
    expect(validator).to.be.an('object');
  });
});
