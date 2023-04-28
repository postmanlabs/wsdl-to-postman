const expect = require('chai').expect,
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  getOptions = require('./../../lib/utils/options').getOptions,
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
  const xmlParser = new XMLParser({});
  it('should get an object in memory representing xml object with valid input', function () {
    const simpleInput = `<user is='great'>
        <name>Tobias</name>
        <familyName>Nickel</familyName>
        <profession>Software Developer</profession>
        <location>Shanghai / China</location>
        </user>`;
    let parsed = xmlParser.parseToObject(simpleInput);
    expect(parsed).to.be.an('object');
    expect(parsed).to.have.own.property('user');
    expect(parsed.user).to.have.own.property('name');
    expect(parsed.user[xmlParser.attributePlaceHolder + 'is']).to.equal('great');

  });

  it('should ignore extra data before xml tag', function () {
    let parsed = xmlParser.parseToObject(UNCLEAN_INPUT_XML);
    expect(parsed).to.be.an('object');
    expect(parsed).to.have.own.property('definitions');
  });

  it('should throw an error when input is an empty string', function () {
    try {
      xmlParser.parseToObject('');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Provided WSDL definition is invalid.');
    }
  });

  it('should throw an error when input is null', function () {
    try {
      xmlParser.parseToObject(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Provided WSDL definition is invalid.');
    }
  });

  it('should throw an error when input is undefined', function () {
    try {
      xmlParser.parseToObject(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Provided WSDL definition is invalid.');
    }
  });

  it('should throw an error when input is empty', function () {
    try {
      xmlParser.parseToObject();
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Provided WSDL definition is invalid.');
    }
  });

  it('should throw an error when input is not xml', function () {
    try {
      xmlParser.parseToObject('this is not an xml');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Provided WSDL definition is invalid XML.');
    }
  });
});

describe('XMLparser parseObjectToXML', function () {
  const xmlParser = new XMLParser({});
  it('should get xml string with valid input default indentation', function () {
    const simpleInput = {
        'soap:Envelope': {
          '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
          'soap:Body': {
            'NumberToWords': {
              '@_xmlns': 'http://www.dataaccess.com/webservicesserver/',
              'ubiNum': 500
            }
          }
        }
      },
      expectedOutput = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
      '  <soap:Body>\n' +
      '    <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
      '      <ubiNum>500</ubiNum>\n' +
      '    </NumberToWords>\n' +
      '  </soap:Body>\n' +
      '</soap:Envelope>\n',
      parsed = xmlParser.parseObjectToXML(simpleInput);
    expect(parsed).to.be.an('string');
    expect(parsed).to.equal(expectedOutput);
  });

  it('should get xml string with valid input specify indentation', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      indentCharacter = options.find((option) => { return option.id === 'indentCharacter'; }),
      simpleInput = {
        'soap:Envelope': {
          '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
          'soap:Body': {
            'NumberToWords': {
              '@_xmlns': 'http://www.dataaccess.com/webservicesserver/',
              'ubiNum': 500
            }
          }
        }
      },
      expectedOutput =
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
        '  <soap:Body>\n' +
        '    <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
        '      <ubiNum>500</ubiNum>\n' +
        '    </NumberToWords>\n' +
        '  </soap:Body>\n' +
        '</soap:Envelope>\n';

    let processOptions = {};
    processOptions[`${indentCharacter.id}`] = '  ';
    localParser = new XMLParser(processOptions);
    parsed = localParser.parseObjectToXML(simpleInput);
    expect(parsed).to.be.an('string');
    expect(parsed).to.equal(expectedOutput);
  });

  it('should get xml string with valid input specify indentation as "\t"', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      indentCharacter = options.find((option) => { return option.id === 'indentCharacter'; }),
      simpleInput = {
        'soap:Envelope': {
          '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
          'soap:Body': {
            'NumberToWords': {
              '@_xmlns': 'http://www.dataaccess.com/webservicesserver/',
              'ubiNum': 500
            }
          }
        }
      },
      expectedOutput = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
        '\t<soap:Body>\n' +
        '\t\t<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
        '\t\t\t<ubiNum>500</ubiNum>\n' +
        '\t\t</NumberToWords>\n' +
        '\t</soap:Body>\n</soap:Envelope>\n';

    let processOptions = {};
    processOptions[`${indentCharacter.id}`] = 'Tab';
    localParser = new XMLParser(processOptions);
    parsed = localParser.parseObjectToXML(simpleInput);
    expect(parsed).to.be.an('string');
    expect(parsed).to.equal(expectedOutput);
  });

});
