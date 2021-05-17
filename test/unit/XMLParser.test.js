const expect = require('chai').expect,
  {
    XMLParser
  } = require('../../lib/XMLParser'),
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

describe('XMLparser parseToObject', function () {

  it('should get an object in memory representing xml object with valid input', function () {
    const simpleInput = `<user is='great'>
        <name>Tobias</name>
        <familyName>Nickel</familyName>
        <profession>Software Developer</profession>
        <location>Shanghai / China</location>
        </user>`,
      xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(simpleInput);
    expect(parsed).to.be.an('object');
    expect(parsed).to.have.own.property('user');
    expect(parsed.user).to.have.own.property('name');
    expect(parsed.user[PARSER_ATTRIBUTE_NAME_PLACE_HOLDER + 'is']).to.equal('great');

  });

  it('should ignore extra data before xml tag', function () {
    const xmlParser = new XMLParser();
    let parsed = xmlParser.parseToObject(UNCLEAN_INPUT_XML);
    expect(parsed).to.be.an('object');
    expect(parsed).to.have.own.property('definitions');
  });

  it('should throw an error when input is an empty string', function () {
    const xmlParser = new XMLParser();
    try {
      xmlParser.parseToObject('');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is null', function () {
    const xmlParser = new XMLParser();
    try {
      xmlParser.parseToObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is undefined', function () {
    const xmlParser = new XMLParser();
    try {
      xmlParser.parseToObject(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is empty', function () {
    const xmlParser = new XMLParser();
    try {
      xmlParser.parseToObject();
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Empty input was proportionated');
    }
  });

  it('should throw an error when input is not xml', function () {
    const xmlParser = new XMLParser();
    try {
      xmlParser.parseToObject('this is not an xml');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Not xml file found in your document');
    }
  });
});


