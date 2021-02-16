const expect = require('chai').expect,
  {
    SchemaBuilder
  } = require('../../lib/utils/SchemaBuilder'),
  {
    Wsdl11Parser
  } = require('../../lib/Wsdl11Parser');

describe('SchemaBuilder Constructor', function() {
  it('should get an object of the schema builder', function() {
    const builder = new SchemaBuilder();
    expect(builder).to.be.a('object');
  });

});

describe('SchemaBuilder getTypes', function() {

  it('should get an array of types', function() {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
       xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
        xmlns:tns="http://www.dataaccess.com/webservicesserver/"
         name="NumberConversion" 
         targetNamespace="http://www.dataaccess.com/webservicesserver/">
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
      builder = new SchemaBuilder();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      types = builder.getTypes(
        parsed,
        '',
        'definitions'
      );
    expect(types).to.be.an('array');
  });

  it('should throw an error when parsed is udnefined', function() {
    const builder = new SchemaBuilder();
    try {
      builder.getTypes(
        undefined,
        '',
        'definitions'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get types from undefined or null object');
    }
  });

  it('should throw an error when parsed is null', function() {
    const builder = new SchemaBuilder();
    try {
      builder.getTypes(
        null,
        '',
        'definitions'
      );
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Can not get types from undefined or null object');
    }
  });

});


describe('SchemaBuilder getComplexTypeByName', function() {

  it('should get a complex Type from the root of schema' +
    'containing the definition for MyCustomModel',
    function() {
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
        builder = new SchemaBuilder();
      let parsed = parser.parseFromXmlToObject(simpleInput),
        complexType = builder.getComplexTypeByName(
          parsed,
          'wsdl:',
          'definitions',
          'xsd:',
          'MyCustomModel'
        );
      expect(complexType).to.be.an('object');
    });

  it('should get a complex Types from the root of schema' +
    'containing the definition for ArrayOftContinent',
    function() {
      const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
       xmlns:xs="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
         xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
          xmlns:tns="http://www.oorsprong.org/websamples.countryinfo"
           name="CountryInfoService"
            targetNamespace="http://www.oorsprong.org/websamples.countryinfo">
          <types>
              <xs:schema elementFormDefault="qualified" 
              targetNamespace="http://www.oorsprong.org/websamples.countryinfo">
                  <xs:complexType name="tContinent">
                      <xs:sequence>
                          <xs:element name="sCode" type="xs:string" />
                          <xs:element name="sName" type="xs:string" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="tCurrency">
                      <xs:sequence>
                          <xs:element name="sISOCode" type="xs:string" />
                          <xs:element name="sName" type="xs:string" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="tCountryCodeAndName">
                      <xs:sequence>
                          <xs:element name="sISOCode" type="xs:string" />
                          <xs:element name="sName" type="xs:string" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="tCountryCodeAndNameGroupedByContinent">
                      <xs:sequence>
                          <xs:element name="Continent" type="tns:tContinent" />
                          <xs:element name="CountryCodeAndNames" type="tns:ArrayOftCountryCodeAndName" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="tCountryInfo">
                      <xs:sequence>
                          <xs:element name="sISOCode" type="xs:string" />
                          <xs:element name="sName" type="xs:string" />
                          <xs:element name="sCapitalCity" type="xs:string" />
                          <xs:element name="sPhoneCode" type="xs:string" />
                          <xs:element name="sContinentCode" type="xs:string" />
                          <xs:element name="sCurrencyISOCode" type="xs:string" />
                          <xs:element name="sCountryFlag" type="xs:string" />
                          <xs:element name="Languages" type="tns:ArrayOftLanguage" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="tLanguage">
                      <xs:sequence>
                          <xs:element name="sISOCode" type="xs:string" />
                          <xs:element name="sName" type="xs:string" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="ArrayOftCountryCodeAndName">
                      <xs:sequence>
                          <xs:element name="tCountryCodeAndName" type="tns:tCountryCodeAndName" minOccurs="0"
                           maxOccurs="unbounded"
                           nillable="true" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="ArrayOftLanguage">
                      <xs:sequence>
                          <xs:element name="tLanguage" type="tns:tLanguage" minOccurs="0"
                           maxOccurs="unbounded" nillable="true" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="ArrayOftContinent">
                      <xs:sequence>
                          <xs:element name="tContinent" type="tns:tContinent" minOccurs="0"
                           maxOccurs="unbounded" nillable="true" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="ArrayOftCurrency">
                      <xs:sequence>
                          <xs:element name="tCurrency" type="tns:tCurrency" minOccurs="0" 
                          maxOccurs="unbounded" nillable="true" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="ArrayOftCountryCodeAndNameGroupedByContinent">
                      <xs:sequence>
                          <xs:element name="tCountryCodeAndNameGroupedByContinent" 
                          type="tns:tCountryCodeAndNameGroupedByContinent" minOccurs="0" 
                          maxOccurs="unbounded" nillable="true" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:complexType name="ArrayOftCountryInfo">
                      <xs:sequence>
                          <xs:element name="tCountryInfo" type="tns:tCountryInfo" 
                          minOccurs="0" maxOccurs="unbounded"
                           nillable="true" />
                      </xs:sequence>
                  </xs:complexType>
                  <xs:element name="ListOfContinentsByName">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfContinentsByNameResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfContinentsByNameResult" type="tns:ArrayOftContinent" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfContinentsByCode">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfContinentsByCodeResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfContinentsByCodeResult" type="tns:ArrayOftContinent" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCurrenciesByName">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCurrenciesByNameResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfCurrenciesByNameResult" type="tns:ArrayOftCurrency" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCurrenciesByCode">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCurrenciesByCodeResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfCurrenciesByCodeResult" type="tns:ArrayOftCurrency" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CurrencyName">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sCurrencyISOCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CurrencyNameResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="CurrencyNameResult" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCountryNamesByCode">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCountryNamesByCodeResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfCountryNamesByCodeResult"
                               type="tns:ArrayOftCountryCodeAndName" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCountryNamesByName">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCountryNamesByNameResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfCountryNamesByNameResult" type="tns:ArrayOftCountryCodeAndName" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCountryNamesGroupedByContinent">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfCountryNamesGroupedByContinentResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfCountryNamesGroupedByContinentResult"
                               type="tns:ArrayOftCountryCodeAndNameGroupedByContinent" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryName">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sCountryISOCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryNameResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="CountryNameResult" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryISOCode">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sCountryName" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryISOCodeResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="CountryISOCodeResult" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CapitalCity">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sCountryISOCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CapitalCityResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="CapitalCityResult" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryCurrency">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sCountryISOCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryCurrencyResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="CountryCurrencyResult" type="tns:tCurrency" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryFlag">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sCountryISOCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryFlagResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="CountryFlagResult" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryIntPhoneCode">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sCountryISOCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountryIntPhoneCodeResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="CountryIntPhoneCodeResult" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="FullCountryInfo">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sCountryISOCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="FullCountryInfoResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="FullCountryInfoResult" type="tns:tCountryInfo" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="FullCountryInfoAllCountries">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="FullCountryInfoAllCountriesResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="FullCountryInfoAllCountriesResult" type="tns:ArrayOftCountryInfo" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountriesUsingCurrency">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sISOCurrencyCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="CountriesUsingCurrencyResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="CountriesUsingCurrencyResult" type="tns:ArrayOftCountryCodeAndName" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfLanguagesByName">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfLanguagesByNameResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfLanguagesByNameResult" type="tns:ArrayOftLanguage" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfLanguagesByCode">
                      <xs:complexType>
                          <xs:sequence />
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="ListOfLanguagesByCodeResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="ListOfLanguagesByCodeResult" type="tns:ArrayOftLanguage" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="LanguageName">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sISOCode" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="LanguageNameResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="LanguageNameResult" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="LanguageISOCode">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="sLanguageName" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
                  <xs:element name="LanguageISOCodeResponse">
                      <xs:complexType>
                          <xs:sequence>
                              <xs:element name="LanguageISOCodeResult" type="xs:string" />
                          </xs:sequence>
                      </xs:complexType>
                  </xs:element>
              </xs:schema>
          </types>`,
        parser = new Wsdl11Parser(),
        builder = new SchemaBuilder();
      let parsed = parser.parseFromXmlToObject(simpleInput),
        complexType = builder.getComplexTypeByName(
          parsed,
          '',
          'definitions',
          'xs:',
          'ArrayOftContinent'
        );
      expect(complexType).to.be.an('object');
    });
});

describe('SchemaBuilder preProcessNodesAssignComplexTypes', function() {
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
      builder = new SchemaBuilder();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      preprocessed = builder.preProcessNodesAssignComplexTypes(
        parsed,
        'wsdl:',
        'definitions',
        'xsd:'
      );
    expect(preprocessed).to.be.an('array');
  });
})

describe('SchemaBuilder getElements', function() {

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
      builder = new SchemaBuilder();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      types = builder.getElements(
        parsed,
        '',
        'definitions',
        'xs:'
      );
    expect(types).to.be.an('array');

    expect(types[0].name).to.equal('NumberToWords');
    expect(types[0].isComplex).to.equal(true);
    expect(types[0].type).to.equal('complex');
    expect(types[0].minOccurs).to.equal(1);
    expect(types[0].maxOccurs).to.equal(1);
    expect(types[0].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[0].children).to.be.an('array');

    expect(types[0].children[0].name).to.equal('ubiNum');
    expect(types[0].children[0].isComplex).to.equal(false);
    expect(types[0].children[0].type).to.equal('unsignedLong');
    expect(types[0].children[0].minOccurs).to.equal(1);
    expect(types[0].children[0].maxOccurs).to.equal(1);
    expect(types[0].children[0].children).to.be.an('array');
    expect(types[0].children[0].children).to.be.empty;
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
      builder = new SchemaBuilder();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      types = builder.getElements(
        parsed,
        '',
        'definitions',
        'xs:'
      );
    expect(types).to.be.an('array');

    expect(types[0].name).to.equal('NumberToWords');
    expect(types[0].isComplex).to.equal(true);
    expect(types[0].type).to.equal('complex');
    expect(types[0].minOccurs).to.equal(1);
    expect(types[0].maxOccurs).to.equal(1);
    expect(types[0].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[0].children).to.be.an('array');

    expect(types[0].children[0].name).to.equal('ubiNum');
    expect(types[0].children[0].isComplex).to.equal(false);
    expect(types[0].children[0].type).to.equal('unsignedLong');
    expect(types[0].children[0].minOccurs).to.equal(1);
    expect(types[0].children[0].maxOccurs).to.equal(1);
    expect(types[0].children[0].children).to.be.an('array');
    expect(types[0].children[0].children).to.be.empty;

    expect(types[1].name).to.equal('NumberToWordsResponse');
    expect(types[1].isComplex).to.equal(true);
    expect(types[1].type).to.equal('complex');
    expect(types[1].minOccurs).to.equal(1);
    expect(types[1].maxOccurs).to.equal(1);
    expect(types[1].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[1].children).to.be.an('array');

    expect(types[1].children[0].name).to.equal('NumberToWordsResult');
    expect(types[1].children[0].isComplex).to.equal(false);
    expect(types[1].children[0].type).to.equal('string');
    expect(types[1].children[0].minOccurs).to.equal(1);
    expect(types[1].children[0].maxOccurs).to.equal(1);
    expect(types[1].children[0].children).to.be.an('array');
    expect(types[1].children[0].children).to.be.empty;

    expect(types[2].name).to.equal('NumberToDollars');
    expect(types[2].isComplex).to.equal(true);
    expect(types[2].type).to.equal('complex');
    expect(types[2].minOccurs).to.equal(1);
    expect(types[2].maxOccurs).to.equal(1);
    expect(types[2].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[2].children).to.be.an('array');

    expect(types[2].children[0].name).to.equal('dNum');
    expect(types[2].children[0].isComplex).to.equal(false);
    expect(types[2].children[0].type).to.equal('decimal');
    expect(types[2].children[0].minOccurs).to.equal(1);
    expect(types[2].children[0].maxOccurs).to.equal(1);
    expect(types[2].children[0].children).to.be.an('array');
    expect(types[2].children[0].children).to.be.empty;

    expect(types[3].name).to.equal('NumberToDollarsResponse');
    expect(types[3].isComplex).to.equal(true);
    expect(types[3].type).to.equal('complex');
    expect(types[3].minOccurs).to.equal(1);
    expect(types[3].maxOccurs).to.equal(1);
    expect(types[3].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(types[3].children).to.be.an('array');

    expect(types[3].children[0].name).to.equal('NumberToDollarsResult');
    expect(types[3].children[0].isComplex).to.equal(false);
    expect(types[3].children[0].type).to.equal('string');
    expect(types[3].children[0].minOccurs).to.equal(1);
    expect(types[3].children[0].maxOccurs).to.equal(1);
    expect(types[3].children[0].children).to.be.an('array');
    expect(types[3].children[0].children).to.be.empty;
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
      builder = new SchemaBuilder();
    let parsed = parser.parseFromXmlToObject(simpleInput),
      types = builder.getElements(
        parsed,
        'wsdl:',
        'definitions',
        'xsd:'
      );
    expect(types).to.be.an('array');

    expect(types[0].name).to.equal('TestCustomModel');
    expect(types[0].isComplex).to.equal(true);
    expect(types[0].type).to.equal('complex');
    expect(types[0].minOccurs).to.equal(1);
    expect(types[0].maxOccurs).to.equal(1);
    expect(types[0].namespace).to.equal('http://tempuri.org/');
    expect(types[0].children).to.be.an('array');

    expect(types[0].children[0].name).to.equal('inputModel');
    expect(types[0].children[0].isComplex).to.equal(true);
    expect(types[0].children[0].type).to.equal('MyCustomModel');
    expect(types[0].children[0].minOccurs).to.equal(1);
    expect(types[0].children[0].maxOccurs).to.equal(1);
    expect(types[0].children[0].children).to.be.an('array');
    expect(types[0].children[0].children).to.be.empty;

    expect(types[0].children[0].name).to.equal('Id');
    expect(types[0].children[0].isComplex).to.equal(false);
    expect(types[0].children[0].type).to.equal('int');
    expect(types[0].children[0].minOccurs).to.equal(1);
    expect(types[0].children[0].maxOccurs).to.equal(1);
    expect(types[0].children[0].children).to.be.an('array');
    expect(types[0].children[0].children).to.be.empty;

    expect(types[0].children[0].name).to.equal('Name');
    expect(types[0].children[0].isComplex).to.equal(false);
    expect(types[0].children[0].type).to.equal('string');
    expect(types[0].children[0].minOccurs).to.equal(0);
    expect(types[0].children[0].maxOccurs).to.equal(1);
    expect(types[0].children[0].children).to.be.an('array');
    expect(types[0].children[0].children).to.be.empty;

    expect(types[0].children[0].name).to.equal('Email');
    expect(types[0].children[0].isComplex).to.equal(false);
    expect(types[0].children[0].type).to.equal('string');
    expect(types[0].children[0].minOccurs).to.equal(0);
    expect(types[0].children[0].maxOccurs).to.equal(1);
    expect(types[0].children[0].children).to.be.an('array');
    expect(types[0].children[0].children).to.be.empty;
  });


});
