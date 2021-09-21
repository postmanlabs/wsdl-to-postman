const expect = require('chai').expect,
  {
    SchemaBuilderXSD
  } = require('../../lib/utils/SchemaBuilderXSD'),
  fs = require('fs'),
  validSchemaFolder = 'test/data/schemaTest',
  {
    XMLParser
  } = require('../../lib/XMLParser');

describe('SchemaBuilderXSD Constructor', function () {
  it('should get an object of the schema builder', function () {
    const builder = new SchemaBuilderXSD();
    expect(builder).to.be.a('object');
  });

});

describe('SchemaBuilderXSD getElements', function () {
  it('should get schema elements', function () {
    const builder = new SchemaBuilderXSD(),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://tempuri.org/',
        isDefault: false
      },
      fileContent = fs.readFileSync(validSchemaFolder + '/coreFileInput.wsdl', 'utf8'),
      parsedXml = parser.parseToObject(fileContent),
      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', {
        schemaNamespace,
        tnsNamespace
      }, parser.attributePlaceHolder);
    expect(elements).to.be.a('array');
    expect(elements.length).to.eq(6);

    expect(elements[5].name).to.equal('TestCustomModel');
    expect(elements[5].isComplex).to.equal(true);
    expect(elements[5].type).to.equal('complex');
    expect(elements[5].minOccurs).to.equal('1');
    expect(elements[5].maxOccurs).to.equal('1');
    expect(elements[5].namespace).to.equal('http://tempuri.org/');
    expect(elements[5].children).to.be.an('array');

    expect(elements[5].children[0].name).to.equal('inputModel');
    expect(elements[5].children[0].isComplex).to.equal(true);
    expect(elements[5].children[0].type).to.equal('MyCustomModel');
    expect(elements[5].children[0].children).to.be.an('array');
    expect(elements[5].children[0].children.length).to.equal(3);

    expect(elements[5].children[0].children[0].name).to.equal('Id');
    expect(elements[5].children[0].children[0].isComplex).to.equal(false);
    expect(elements[5].children[0].children[0].type).to.equal('integer');
    expect(elements[5].children[0].children[0].maximum).to.equal(2147483647);
    expect(elements[5].children[0].children[0].minimum).to.equal(-2147483648);
    expect(elements[5].children[0].children[0].children).to.be.an('array');
    expect(elements[5].children[0].children[0].children).to.be.empty;

    expect(elements[5].children[0].children[1].name).to.equal('Name');
    expect(elements[5].children[0].children[1].isComplex).to.equal(false);
    expect(elements[5].children[0].children[1].type).to.equal('string');
    expect(elements[5].children[0].children[1].minOccurs).to.equal('0');
    expect(elements[5].children[0].children[1].maxOccurs).to.equal('1');
    expect(elements[5].children[0].children[1].children).to.be.an('array');
    expect(elements[5].children[0].children[1].children).to.be.empty;

    expect(elements[5].children[0].children[2].name).to.equal('Email');
    expect(elements[5].children[0].children[2].isComplex).to.equal(false);
    expect(elements[5].children[0].children[2].type).to.equal('string');
    expect(elements[5].children[0].children[2].minOccurs).to.equal('0');
    expect(elements[5].children[0].children[2].maxOccurs).to.equal('1');
    expect(elements[5].children[0].children[2].children).to.be.an('array');
    expect(elements[5].children[0].children[2].children).to.be.empty;
  });

  it('should get an empty array when the input has no elements', function () {
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
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://tempuri.org/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),
      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      }, parser.attributePlaceHolder);
    expect(elements).to.be.an('array');
    expect(elements).to.be.empty;
  });

  it('should get an array of types with 1 root and 1 child', function () {
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
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.dataaccess.com/webservicesserver/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      }, parser.attributePlaceHolder);

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

  it('should get an array of types with 4 root and 1 child per root', function () {
    const simpleInput = fs.readFileSync(validSchemaFolder + '/4Root1ChildPerRoot.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.dataaccess.com/webservicesserver/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),
      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      }, parser.attributePlaceHolder);

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

  it('should get an array of types with 1 root and 1 complex type', function () {
    const simpleInput = fs.readFileSync(validSchemaFolder + '/1Root1Complextype.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://tempuri.org/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),
      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);
    expect(elements).to.be.an('array');

    expect(elements[1].name).to.equal('TestCustomModel');
    expect(elements[1].isComplex).to.equal(true);
    expect(elements[1].type).to.equal('complex');
    expect(elements[1].minOccurs).to.equal('1');
    expect(elements[1].maxOccurs).to.equal('1');
    expect(elements[1].namespace).to.equal('http://tempuri.org/');
    expect(elements[1].children).to.be.an('array');

    expect(elements[1].children[0].name).to.equal('inputModel');
    expect(elements[1].children[0].isComplex).to.equal(true);
    expect(elements[1].children[0].type).to.equal('MyCustomModel');
    expect(elements[1].children[0].minOccurs).to.equal('1');
    expect(elements[1].children[0].maxOccurs).to.equal('1');
    expect(elements[1].children[0].children).to.be.an('array');
    expect(elements[1].children[0].children.length).to.equal(3);

    expect(elements[1].children[0].children[0].name).to.equal('Id');
    expect(elements[1].children[0].children[0].isComplex).to.equal(false);
    expect(elements[1].children[0].children[0].type).to.equal('integer');
    expect(elements[1].children[0].children[0].minOccurs).to.equal('1');
    expect(elements[1].children[0].children[0].maxOccurs).to.equal('1');
    expect(elements[1].children[0].children[0].children).to.be.an('array');
    expect(elements[1].children[0].children[0].children).to.be.empty;

    expect(elements[1].children[0].children[1].name).to.equal('Name');
    expect(elements[1].children[0].children[1].isComplex).to.equal(false);
    expect(elements[1].children[0].children[1].type).to.equal('string');
    expect(elements[1].children[0].children[1].minOccurs).to.equal('0');
    expect(elements[1].children[0].children[1].maxOccurs).to.equal('1');
    expect(elements[1].children[0].children[1].children).to.be.an('array');
    expect(elements[1].children[0].children[1].children).to.be.empty;

    expect(elements[1].children[0].children[2].name).to.equal('Email');
    expect(elements[1].children[0].children[2].isComplex).to.equal(false);
    expect(elements[1].children[0].children[2].type).to.equal('string');
    expect(elements[1].children[0].children[2].minOccurs).to.equal('0');
    expect(elements[1].children[0].children[2].maxOccurs).to.equal('1');
    expect(elements[1].children[0].children[2].children).to.be.an('array');
    expect(elements[1].children[0].children[2].children).to.be.empty;
  });

  it('should get an array of types with 1 root and 1 complex type Scenario 2', function () {
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
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.oorsprong.org/websamples.countryinfo',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsed = parser.parseToObject(simpleInput),
      elements = builder.getElements(parsed, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);
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

  it('should get an array of types with 1 root and 1 complex type Scenario 3', function () {
    const simpleInput = `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
    xmlns:tns="url/soap/services/getMatchClassesForTournament.php"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap-enc="http://schemas.xmlsoap.org/soap/encoding/"
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" name="getMatchClassesForTournament" 
    targetNamespace="url/soap/services/getMatchClassesForTournament.php">
    <types>
        <xsd:schema targetNamespace="url/soap/services/getMatchClassesForTournament.php">
            <xsd:element name="getMatchClassesForTournament">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="application_key" type="xsd:string"/>
                        <xsd:element name="competitionId" type="xsd:string" nillable="true"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            <xsd:complexType name="MatchGroup">
                <xsd:sequence>
                    <xsd:element name="id" type="xsd:int" nillable="true"/>
                    <xsd:element name="Name" type="xsd:string" nillable="true"/>
                    <xsd:element name="MatchClassId" type="xsd:string" nillable="true"/>
                    <xsd:element name="IsPlayoffLeague" type="xsd:boolean" nillable="true"/>
                    <xsd:element name="IsPlayoff" type="xsd:boolean" nillable="true"/>
                    <xsd:element name="PlayoffId" type="xsd:string" nillable="true"/>
                    <xsd:element name="EndGameLevel" type="xsd:int" nillable="true"/>
                </xsd:sequence>
            </xsd:complexType>
            <xsd:complexType name="ArrayOfMatchGroup">
                <xsd:sequence>
                    <xsd:element name="item" type="tns:MatchGroup" minOccurs="0" maxOccurs="unbounded"/>
                </xsd:sequence>
            </xsd:complexType>
            <xsd:complexType name="MatchClass">
                <xsd:sequence>
                    <xsd:element name="id" type="xsd:int" nillable="true"/>
                    <xsd:element name="Code" type="xsd:string" nillable="true"/>
                    <xsd:element name="Name" type="xsd:string" nillable="true"/>
                    <xsd:element name="Gender" type="xsd:string" nillable="true"/>
                    <xsd:element name="PeriodLengthInMinutes" type="xsd:string" nillable="true"/>
                    <xsd:element name="HideTable" type="xsd:string" nillable="true"/>
                    <xsd:element name="HideResults" type="xsd:string" nillable="true"/>
                    <xsd:element name="NumberOfPeriodsInMatch" type="xsd:string" nillable="true"/>
                    <xsd:element name="MatchGroups" type="tns:ArrayOfMatchGroup" nillable="true"/>
                </xsd:sequence>
            </xsd:complexType>
            <xsd:complexType name="ArrayOfMatchClass">
                <xsd:sequence>
                    <xsd:element name="item" type="tns:MatchClass" minOccurs="0" maxOccurs="unbounded"/>
                </xsd:sequence>
            </xsd:complexType>
            <xsd:element name="getMatchClassesForTournamentResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="getMatchClassesForTournamentResult" type="tns:ArrayOfMatchClass"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </types>
  </definitions>`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'url/soap/services/getMatchClassesForTournament.php',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsed = parser.parseToObject(simpleInput),
      elements = builder.getElements(parsed, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);
    expect(elements).to.be.an('array');

    expect(elements[1].name).to.equal('getMatchClassesForTournamentResponse');
    expect(elements[1].isComplex).to.equal(true);
    expect(elements[1].type).to.equal('complex');
    expect(elements[1].minOccurs).to.equal('0');
    expect(elements[1].maxOccurs).to.equal('1');
    expect(elements[1].namespace).to.equal('url/soap/services/getMatchClassesForTournament.php');
    expect(elements[1].children).to.be.an('array');

    expect(elements[1].children[0].name).to.equal('getMatchClassesForTournamentResult');
    expect(elements[1].children[0].isComplex).to.equal(true);
    expect(elements[1].children[0].children[0].name).to.equal('item');
    expect(elements[1].children[0].children[0].isComplex).to.equal(true);

    expect(elements[1].children[0].children[0].children[0].name).to.equal('id');
    expect(elements[1].children[0].children[0].children[0].isComplex).to.equal(false);
    expect(elements[1].children[0].children[0].children[0].type).to.equal('integer');


    expect(elements[1].children[0].children[0].children[8].name).to.equal('MatchGroups');
    expect(elements[1].children[0].children[0].children[8].isComplex).to.equal(true);
    expect(elements[1].children[0].children[0].children[8].type).to.equal('ArrayOfMatchGroup');

  });

  it('should throw an error when parsed is undefined', function () {
    const schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.oorsprong.org/websamples.countryinfo',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    try {
      builder.getElements(undefined, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get elements from undefined or null wsdl');
    }
  });

  it('should throw an error when parsed is null', function () {
    const schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.oorsprong.org/websamples.countryinfo',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    try {
      builder.getElements(null, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get elements from undefined or null wsdl');
    }
  });

  it('should get an array of types with 1 root and 1 child with simple types one level', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
      <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
      xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
      name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
        <types>
        <xs:schema targetNamespace="http://www.dataaccess.com/webservicesserver/"  
        xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <xs:simpleType name="C">
        <xs:restriction base="xs:string">
          <xs:minLength value="1"/>
        </xs:restriction>
        </xs:simpleType>
        <xs:simpleType name="Char_20">
        <xs:restriction base="C">
          <xs:minLength value="1"/>
          <xs:maxLength value="20"/>
        </xs:restriction>
        </xs:simpleType>
        <xs:element name="Test">
            <xs:complexType>
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="1" name="inputString" type="C" />
                </xs:sequence>
            </xs:complexType>
        </xs:element>
        </xs:schema>
        </types>
      </definitions>`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.dataaccess.com/webservicesserver/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('Test');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].minOccurs).to.equal('1');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(elements[0].children).to.be.an('array');

    expect(elements[0].children[0].name).to.equal('inputString');
    expect(elements[0].children[0].isComplex).to.equal(false);
    expect(elements[0].children[0].type).to.equal('string');
    expect(elements[0].children[0].minLength).to.equal(1);
    expect(elements[0].children[0].maxLength).to.equal(undefined);
    expect(elements[0].children[0].children).to.be.an('array');
    expect(elements[0].children[0].children).to.be.empty;
  });

  it('should get an array of types with 1 root and 1 child with simple types three levels', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
      <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
      xmlns:xs="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
      xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
      name="NumberConversion" targetNamespace="http://www.dataaccess.com/webservicesserver/">
        <types>
        <xs:schema targetNamespace="http://www.dataaccess.com/webservicesserver/"  
        xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <xs:simpleType name="C">
        <xs:restriction base="xs:string">
        </xs:restriction>
        </xs:simpleType>
        <xs:simpleType name="Char_20">
        <xs:restriction base="C">
          <xs:minLength value="1"/>
          <xs:maxLength value="20"/>
        </xs:restriction>
        </xs:simpleType>
        <xs:simpleType name="Char_20_10">
        <xs:restriction base="Char_20">
	      <xs:minLength value="10"/>
        </xs:restriction>
        </xs:simpleType>
        <xs:element name="Test">
            <xs:complexType>
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="1" name="inputString" type="Char_20_10" />
                </xs:sequence>
            </xs:complexType>
        </xs:element>
        </xs:schema>
        </types>
      </definitions>`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://www.dataaccess.com/webservicesserver/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('Test');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].minOccurs).to.equal('1');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('http://www.dataaccess.com/webservicesserver/');
    expect(elements[0].children).to.be.an('array');

    expect(elements[0].children[0].name).to.equal('inputString');
    expect(elements[0].children[0].isComplex).to.equal(false);
    expect(elements[0].children[0].type).to.equal('string');
    expect(elements[0].children[0].minLength).to.equal(10);
    expect(elements[0].children[0].maxLength).to.equal(20);
    expect(elements[0].children[0].children).to.be.an('array');
    expect(elements[0].children[0].children).to.be.empty;
  });

  it('should get an array of types with 1 root and 1 child with simple types with enum', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
      <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
      xmlns:s="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
      xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
      name="NumberConversion" targetNamespace="https://geoservices.tamu.edu/">
        <types>
        <s:schema elementFormDefault="qualified" targetNamespace="https://geoservices.tamu.edu/" 
        xmlns:s="http://www.w3.org/2001/XMLSchema"
        xmlns:tns="https://geoservices.tamu.edu/">
        <s:element name="GeocodeAddressParsed">
        <s:complexType>
            <s:sequence>
                <s:element minOccurs="1" maxOccurs="1" name="censusYear" type="tns:CensusYear" />
            </s:sequence>
        </s:complexType>
       </s:element>
       <s:simpleType name="CensusYear">
        <s:restriction base="s:string">
            <s:enumeration value="Unknown" />
            <s:enumeration value="NineteenNinety" />
            <s:enumeration value="TwoThousand" />
            <s:enumeration value="TwoThousandTen" />
            <s:enumeration value="AllAvailable" />
        </s:restriction>
       </s:simpleType>
       </s:schema>
        </types> 
        </definitions > `,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 's',
        prefixFilter: 's:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'https://geoservices.tamu.edu/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('GeocodeAddressParsed');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('https://geoservices.tamu.edu/');
    expect(elements[0].children).to.be.an('array');

    expect(elements[0].children[0].name).to.equal('censusYear');
    expect(elements[0].children[0].isComplex).to.equal(false);
    expect(elements[0].children[0].type).to.equal('string');
    expect(elements[0].children[0].enum).to.be.an('array');
    expect(elements[0].children[0].enum.length).to.equal(5);
    expect(elements[0].children[0].children).to.be.an('array');
    expect(elements[0].children[0].children).to.be.empty;
    expect(elements[0].children[0].enum).to.have.members(['Unknown',
      'NineteenNinety',
      'TwoThousand',
      'TwoThousandTen',
      'AllAvailable'
    ]);
  });

  it('should get an array of types with 1 root and 1 child with simple types with enum of integers', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
      <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
      xmlns:s="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
      xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
      name="NumberConversion" targetNamespace="https://geoservices.tamu.edu/">
        <types>
        <s:schema elementFormDefault="qualified" targetNamespace="https://geoservices.tamu.edu/" 
        xmlns:s="http://www.w3.org/2001/XMLSchema"
        xmlns:tns="https://geoservices.tamu.edu/">
        <s:element name="foobar" type="enumType"/>
        <s:simpleType name="enumType">
        <s:restriction base="s:integer">
          <s:enumeration value="1"/>
          <s:enumeration value="1011"/>
          <s:enumeration value="1032"/>
        </s:restriction>
        </s:simpleType>
       </s:schema>
        </types> 
        </definitions > `,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 's',
        prefixFilter: 's:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'https://geoservices.tamu.edu/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('foobar');
    expect(elements[0].isComplex).to.equal(false);
    expect(elements[0].type).to.equal('integer');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('https://geoservices.tamu.edu/');
    expect(elements[0].children).to.be.an('array');
    expect(elements[0].children).to.be.empty;
    expect(elements[0].enum).to.have.members(['1',
      '1011',
      '1032'
    ]);
  });

  it('should get an array of elements defined in the message when all are knowntypes', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
      <wsdl:definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
      xmlns:s="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
      xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
      name="NumberConversion" targetNamespace="https://geoservices.tamu.edu/">
        <wsdl:types>
        <s:schema elementFormDefault="qualified" targetNamespace="https://geoservices.tamu.edu/" 
        xmlns:s="http://www.w3.org/2001/XMLSchema"
        xmlns:tns="https://geoservices.tamu.edu/">
        <s:element name="foobar" type="enumType"/>
        <s:simpleType name="enumType">
        <s:restriction base="s:integer">
          <s:enumeration value="1"/>
          <s:enumeration value="1011"/>
          <s:enumeration value="1032"/>
        </s:restriction>
        </s:simpleType>
       </s:schema>
        </wsdl:types> 
        <wsdl:message name="GeocodeAddressParsedHttpGetIn">
        <wsdl:part name="number" type="s:string" />
        <wsdl:part name="numberFractional" type="s:string" />
        <wsdl:part name="preDirectional" type="s:string" />
        <wsdl:part name="preQualifier" type="s:string" />
        <wsdl:part name="preType" type="s:string" />
        <wsdl:part name="preArticle" type="s:string" />
        <wsdl:part name="name" type="s:string" />
        <wsdl:part name="suffix" type="s:string" />
        <wsdl:part name="postArticle" type="s:string" />
        <wsdl:part name="postQualifier" type="s:string" />
        <wsdl:part name="postDirectional" type="s:string" />
        <wsdl:part name="suiteType" type="s:string" />
        <wsdl:part name="suiteNumber" type="s:string" />
        <wsdl:part name="city" type="s:string" />
        <wsdl:part name="state" type="s:string" />
        <wsdl:part name="zip" type="s:string" />
        <wsdl:part name="apiKey" type="s:string" />
        <wsdl:part name="version" type="s:string" />
        <wsdl:part name="shouldCalculateCensus" type="s:string" />
        <wsdl:part name="censusYear" type="s:string" />
        <wsdl:part name="shouldReturnReferenceGeometry" type="s:string" />
        <wsdl:part name="shouldNotStoreTransactionDetails" type="s:string" />
    </wsdl:message>
    <wsdl:message name="GeocodeAddressParsedHttpGetOut">
        <wsdl:part name="Body" element="tns:WebServiceGeocodeQueryResultSet" />
    </wsdl:message>
        </wsdl:definitions > `,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 's',
        prefixFilter: 's:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'https://geoservices.tamu.edu/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('foobar');
    expect(elements[0].isComplex).to.equal(false);
    expect(elements[0].type).to.equal('integer');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('https://geoservices.tamu.edu/');
    expect(elements[0].children).to.be.an('array');
    expect(elements[0].children).to.be.empty;
    expect(elements[0].enum).to.have.members(['1',
      '1011',
      '1032'
    ]);

    expect(elements[1].name).to.equal('GeocodeAddressParsedHttpGetIn');
    expect(elements[1].isComplex).to.equal(true);
    expect(elements[1].type).to.equal('anonimous');
    expect(elements[1].children).to.be.an('array');
    expect(elements[1].children.length).to.equal(22);
  });

  it('should get an array of elements defined in the message when all are knowntypes from xsd', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
      <wsdl:definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
      xmlns:s="http://www.w3.org/2001/XMLSchema" 
      xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
      xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
      xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
      name="NumberConversion" targetNamespace="https://geoservices.tamu.edu/">
        <wsdl:types>
        <s:schema elementFormDefault="qualified" targetNamespace="https://geoservices.tamu.edu/" 
        xmlns:s="http://www.w3.org/2001/XMLSchema"
        xmlns:tns="https://geoservices.tamu.edu/">
        <s:element name="foobar" type="enumType"/>
        <s:simpleType name="enumType">
        <s:restriction base="s:integer">
          <s:enumeration value="1"/>
          <s:enumeration value="1011"/>
          <s:enumeration value="1032"/>
        </s:restriction>
        </s:simpleType>
       </s:schema>
        </wsdl:types> 
        <wsdl:message name="GeocodeAddressParsedHttpGetIn">
        <wsdl:part name="number" type="s:decimal" />
        <wsdl:part name="numberFractional" type="s:float" />
        <wsdl:part name="preDirectional" type="s:double" />
        <wsdl:part name="preQualifier" type="s:int" />
        <wsdl:part name="preType" type="s:long" />
        <wsdl:part name="preArticle" type="s:short" />
        <wsdl:part name="name" type="s:unsignedInt" />
        <wsdl:part name="suffix" type="s:unsignedLong" />
        <wsdl:part name="postArticle" type="s:unsignedShort" />
    </wsdl:message>
    <wsdl:message name="GeocodeAddressParsedHttpGetOut">
        <wsdl:part name="Body" element="tns:WebServiceGeocodeQueryResultSet" />
    </wsdl:message>
        </wsdl:definitions > `,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 's',
        prefixFilter: 's:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'https://geoservices.tamu.edu/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);
    expect(elements).to.be.an('array');

    expect(elements[0].name).to.equal('foobar');
    expect(elements[0].isComplex).to.equal(false);
    expect(elements[0].type).to.equal('integer');
    expect(elements[0].maxOccurs).to.equal('1');
    expect(elements[0].namespace).to.equal('https://geoservices.tamu.edu/');
    expect(elements[0].children).to.be.an('array');
    expect(elements[0].children).to.be.empty;
    expect(elements[0].enum).to.have.members(['1',
      '1011',
      '1032'
    ]);

    expect(elements[1].name).to.equal('GeocodeAddressParsedHttpGetIn');
    expect(elements[1].isComplex).to.equal(true);
    expect(elements[1].type).to.equal('anonimous');
    expect(elements[1].children).to.be.an('array');
    expect(elements[1].children.length).to.equal(9);
  });
  it('should get an array of elements defined in the message when have 2 elements', function () {
    const simpleInput = `<definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
    xmlns:tns="http://tempuri.org/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
    targetNamespace="http://tempuri.org/">
    <types>
        <xsd:schema elementFormDefault="qualified" targetNamespace="http://tempuri.org/">
            <xsd:element name="TestElement">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element minOccurs="0" maxOccurs="1" name="inputString" type="xsd:string" />
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            <xsd:element name="TestElementOther">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element minOccurs="0" maxOccurs="1" name="inputStringOther" type="xsd:string" />
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </types>
    <message name="PO">
        <part name="po" element="tns:TestElement" />
        <part name="invoice" element="tns:TestElementOther" />
    </message>
</definitions>
`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://tempuri.org/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');
    expect(elements[0].name).to.equal('TestElement');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[1].name).to.equal('TestElementOther');
    expect(elements[1].isComplex).to.equal(true);
    expect(elements[2].name).to.equal('PO');
    expect(elements[2].isComplex).to.equal(true);
    expect(elements[2].type).to.equal('anonimous');
    expect(elements[2].children).to.be.an('array');
    expect(elements[2].children.length).to.equal(2);

  });

  it('should get an array of elements defined in the message when have 2 types', function () {
    const simpleInput = `<definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" 
    xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/" 
    xmlns:tns="http://tempuri.org/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/" 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" 
    targetNamespace="http://tempuri.org/">
    <types>
        <xsd:schema elementFormDefault="qualified" targetNamespace="http://tempuri.org/">
        <xsd:simpleType name="enumType">
          <xsd:restriction base="xsd:integer">
            <xsd:enumeration value="1"/>
            <xsd:enumeration value="1011"/>
            <xsd:enumeration value="1032"/>
          </xsd:restriction>
        </xsd:simpleType>
        <xsd:complexType name="MyCustomModel">
          <xsd:sequence>
            <xsd:element minOccurs="1" maxOccurs="1" name="Id" type="xsd:int" />
            <xsd:element minOccurs="0" maxOccurs="1" name="Name" type="xsd:string" />
            <xsd:element minOccurs="0" maxOccurs="1" name="Email" type="xsd:string" />
          </xsd:sequence>
        </xsd:complexType>
        </xsd:schema>
    </types>
    <message name="PO">
        <part name="po" type="tns:enumType" />
        <part name="invoice" type="tns:MyCustomModel" />
    </message>
</definitions>
`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://tempuri.org/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');
    expect(elements[0].name).to.equal('PO');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('anonimous');
    expect(elements[0].children[0].name).to.equal('enumType');
    expect(elements[0].children[1].name).to.equal('MyCustomModel');

  });

  it('should get an array of elements when elements depend on other elements', function () {
    const
      fileContent = fs.readFileSync(validSchemaFolder + '/elementsDependOnElements.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(fileContent),

      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');
    expect(elements[0].name).to.equal('CreateQueueResult');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].children[0].name).to.equal('QueueUrl');
    expect(elements[0].children[0].type).to.equal('string');

    expect(elements[3].name).to.equal('CreateQueueResponse');
    expect(elements[3].type).to.equal('complex');
    expect(elements[3].children[0].name).to.equal('tns:CreateQueueResult');
    expect(elements[3].children[0].isComplex).to.equal(true);
    expect(elements[3].children[0].children[0].name).to.equal('QueueUrl');
    expect(elements[3].children[0].children[0].type).to.equal('string');

  });

  it('should get an array of elements when schemas have import', function () {
    const
      fileContent = fs.readFileSync(validSchemaFolder + '/importSchemaSelfFile.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(fileContent),

      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');
    expect(elements.length).to.equal(1);

  });

  it('should get restriction of min and max length of 8 in a simple string type with length att', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" targetNamespace="https://geoservices.tamu.edu/">
        <types>
            <s:schema elementFormDefault="qualified" targetNamespace="https://geoservices.tamu.edu/"
             xmlns:s="http://www.w3.org/2001/XMLSchema" xmlns:tns="https://geoservices.tamu.edu/">
                <s:element name="password">
                    <s:simpleType>
                        <s:restriction base="s:string">
                            <s:length value="8" />
                        </s:restriction>
                    </s:simpleType>
                </s:element>
            </s:schema>
        </types>
    </definitions>`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 's',
        prefixFilter: 's:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'https://geoservices.tamu.edu/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');
    expect(elements[0].name).to.equal('password');
    expect(elements[0].isComplex).to.equal(false);
    expect(elements[0].type).to.equal('string');
    expect(elements[0].minLength).to.equal(8);
    expect(elements[0].maxLength).to.equal(8);
    expect(elements[0].namespace).to.equal('https://geoservices.tamu.edu/');
    expect(elements[0].children).to.be.an('array');
  });

  it('should get restriction of enum in inline simpleType', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" 
    targetNamespace="https://geoservices.tamu.edu/">
        <types>
            <s:schema elementFormDefault="qualified" 
            targetNamespace="https://geoservices.tamu.edu/" 
            xmlns:s="http://www.w3.org/2001/XMLSchema" 
            xmlns:tns="https://geoservices.tamu.edu/">
                <s:element name="car">
                    <s:simpleType>
                        <s:restriction base="s:string">
                            <s:enumeration value="Audi" />
                            <s:enumeration value="Golf" />
                            <s:enumeration value="BMW" />
                        </s:restriction>
                    </s:simpleType>
                </s:element>
            </s:schema>
        </types>
    </definitions>`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 's',
        prefixFilter: 's:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'https://geoservices.tamu.edu/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');
    expect(elements[0].name).to.equal('car');
    expect(elements[0].isComplex).to.equal(false);
    expect(elements[0].type).to.equal('string');
    expect(elements[0].enum).to.have.members(['Audi',
      'Golf',
      'BMW'
    ]);
  });

  it('should get using choice', function () {
    const simpleInput = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
    xmlns:s="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" 
    xmlns:tns="http://www.dataaccess.com/webservicesserver/" 
    name="NumberConversion" 
    targetNamespace="https://geoservices.tamu.edu/">
        <types>
            <s:schema elementFormDefault="qualified" 
            targetNamespace="https://geoservices.tamu.edu/" 
            xmlns:s="http://www.w3.org/2001/XMLSchema" 
            xmlns:tns="https://geoservices.tamu.edu/">
            <s:element name="Add">
              <s:complexType>
                  <s:choice>
                      <s:element minOccurs="1" maxOccurs="1" name="intA" type="s:int" />
                      <s:element minOccurs="1" maxOccurs="1" name="intB" type="s:int" />
                  </s:choice>
              </s:complexType>
        </s:element>
            </s:schema>
        </types>
    </definitions>`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 's',
        prefixFilter: 's:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'https://geoservices.tamu.edu/',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, '', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');
    expect(elements.length).to.equal(1);
    expect(elements[0].name).to.equal('Add');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].children[0].type).to.equal('integer');
  });

  it('Should not have any element\'s child with undefined or error type', function() {
    const
      fileContent = fs.readFileSync(validSchemaFolder + '/sfMinified.wsdl', 'utf8'),
      parser = new XMLParser(),
      wsdlObject = {
        operationsArray: '',
        targetNamespace: {
          key: 'targetNamespace',
          url: 'urn:enterprise.soap.sforce.com',
          prefixFilter: 'targetNamespace:',
          isDefault: false,
          tnsDefinitionURL: undefined
        },
        wsdlNamespace: {
          key: 'xmlns',
          url: 'http://schemas.xmlsoap.org/wsdl/',
          prefixFilter: 'xmlns:',
          isDefault: true,
          tnsDefinitionURL: undefined
        },
        SOAPNamespace: {
          key: 'soap',
          url: 'http://schemas.xmlsoap.org/wsdl/soap/',
          prefixFilter: 'xmlns:soap:',
          isDefault: false,
          tnsDefinitionURL: undefined
        },
        SOAP12Namespace: null,
        HTTPNamespace: {
          key: 'http',
          url: undefined,
          prefixFilter: 'xmlns:http:',
          isDefault: false,
          tnsDefinitionURL: undefined
        },
        schemaNamespace: {
          key: 'xsd',
          url: 'http://www.w3.org/2001/XMLSchema',
          prefixFilter: 'xsd:',
          isDefault: false,
          tnsDefinitionURL: 'urn:enterprise.soap.sforce.com'
        },
        tnsNamespace: {
          key: 'tns',
          url: 'urn:enterprise.soap.sforce.com',
          prefixFilter: 'xmlns:tns:',
          isDefault: false,
          tnsDefinitionURL: undefined
        },
        allNameSpaces: [
          {
            key: 'targetNamespace',
            url: 'urn:enterprise.soap.sforce.com',
            prefixFilter: 'targetNamespace:',
            isDefault: false,
            tnsDefinitionURL: undefined
          },
          {
            key: 'xmlns',
            url: 'http://schemas.xmlsoap.org/wsdl/',
            prefixFilter: 'xmlns:',
            isDefault: true,
            tnsDefinitionURL: undefined
          },
          {
            key: 'soap',
            url: 'http://schemas.xmlsoap.org/wsdl/soap/',
            prefixFilter: 'xmlns:soap:',
            isDefault: false,
            tnsDefinitionURL: undefined
          },
          {
            key: 'xsd',
            url: 'http://www.w3.org/2001/XMLSchema',
            prefixFilter: 'xmlns:xsd:',
            isDefault: false,
            tnsDefinitionURL: undefined
          },
          {
            key: 'tns',
            url: 'urn:enterprise.soap.sforce.com',
            prefixFilter: 'xmlns:tns:',
            isDefault: false,
            tnsDefinitionURL: undefined
          },
          {
            key: 'fns',
            url: 'urn:fault.enterprise.soap.sforce.com',
            prefixFilter: 'xmlns:fns:',
            isDefault: false,
            tnsDefinitionURL: undefined
          },
          {
            key: 'ens',
            url: 'urn:sobject.enterprise.soap.sforce.com',
            prefixFilter: 'xmlns:ens:',
            isDefault: false,
            tnsDefinitionURL: undefined
          }
        ],
        fileName: '',
        securityPolicyArray: '',
        log: {
          errors: '\nThe specified document has no bindings or operations, the items were not created.'
        },
        xmlParsed: '',
        version: '',
        documentation: '',
        localSchemaNamespaces: [
          {
            key: '',
            url: undefined,
            prefixFilter: '',
            isDefault: false,
            tnsDefinitionURL: undefined
          }
        ],
        securityPolicyNamespace: null
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(fileContent),

      elements = builder.getElements(parsedXml, '', 'definitions', wsdlObject, parser.attributePlaceHolder),
      errorElements = elements.filter((element) => {
        return element.type === 'error';
      }),
      issuedElements = elements.filter((element) => {
        return element.type === undefined;
      }),
      elementsWithIssuedChildren = elements.filter((element) => {
        return element.children.filter((child) => {
          return child.type === undefined;
        }).length > 0;
      });
    expect(elements).to.be.an('array');
    expect(errorElements.length === 0);
    expect(issuedElements.length === 0);
    expect(elementsWithIssuedChildren.length === 0);
  });

  it('should get elements when have same name', function () {
    const simpleInput = `<wsdl:definitions targetNamespace="http://sap.com/xi/AP/LogisticsExecution/Global"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:wsoap12="http://schemas.xmlsoap.org/wsdl/soap12/"
    xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
    xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/"
    xmlns:rfc="urn:sap-com:sap:rfc:functions"
    xmlns:tns="http://sap.com/xi/AP/LogisticsExecution/Global"
    xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"
    xmlns:n1="http://xiTest.com/xi/test"
    xmlns:n2="http://sap.com/xi/SAPGlobal20/Global"
    xmlns:n3="http://sap.com/xi/AP/Common/Global"
    xmlns:n4="http://sap.com/xi/AP/Common/GDT"
    xmlns:n5="http://sap.com/xi/BASIS/Global">
    <wsdl:types>
      <xsd:schema targetNamespace="http://sap.com/xi/SAPGlobal20/Global"
        xmlns:ccts="urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0"
        xmlns:xi0="http://xiTest.com/xi/test"
        xmlns:xi1="http://sap.com/xi/SAPGlobal20/Global"
        xmlns:xi2="http://sap.com/xi/AP/Common/Global"
        xmlns:xi3="http://sap.com/xi/AP/LogisticsExecution/Global"
        xmlns:xi4="http://sap.com/xi/AP/Common/GDT"
        xmlns:xi6="http://sap.com/xi/BASIS/Global"
        xmlns="http://sap.com/xi/SAPGlobal20/Global">
        <xsd:import namespace="http://sap.com/xi/AP/LogisticsExecution/Global"/>
        <xsd:element name="OutboundDeliveryExecutionConfirmation"
         type="xi3:OutboundDeliveryExecutionConfirmationMessage"/>
      </xsd:schema>
      <xsd:schema targetNamespace="http://sap.com/xi/AP/LogisticsExecution/Global"
        xmlns:ccts="urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0"
        xmlns:xi0="http://xiTest.com/xi/test"
        xmlns:xi1="http://sap.com/xi/SAPGlobal20/Global"
        xmlns:xi2="http://sap.com/xi/AP/Common/Global"
        xmlns:xi3="http://sap.com/xi/AP/LogisticsExecution/Global"
        xmlns:xi4="http://sap.com/xi/AP/Common/GDT"
        xmlns:xi6="http://sap.com/xi/BASIS/Global"
        xmlns="http://sap.com/xi/AP/LogisticsExecution/Global">
        <xsd:complexType name="OutboundDeliveryExecutionConfirmation">
          <xsd:sequence>
            <xsd:element name="ID" type="string"/>
          </xsd:sequence>
        </xsd:complexType>
        <xsd:complexType name="OutboundDeliveryExecutionConfirmationMessage">
        <xsd:sequence> 
          <xsd:element name="OutboundDeliveryExecution" type="OutboundDeliveryExecutionConfirmation"/>
        </xsd:sequence>
      </xsd:complexType>
      </xsd:schema>
    </wsdl:types>
    <wsdl:message name="OutboundDeliveryExecutionConfirmation">
      <wsdl:part name="OutboundDeliveryExecutionConfirmation" element="n2:OutboundDeliveryExecutionConfirmation"/>
    </wsdl:message>
  </wsdl:definitions>`,
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://www.w3.org/2001/XMLSchema',
        isDefault: false
      },
      tnsNamespace = {
        key: 'tns',
        prefixFilter: 'tns:',
        url: 'http://sap.com/xi/AP/LogisticsExecution/Global',
        isDefault: false
      },
      builder = new SchemaBuilderXSD();
    let parsedXml = parser.parseToObject(simpleInput),

      elements = builder.getElements(parsedXml, 'wsdl:', 'definitions', {
        schemaNamespace,
        tnsNamespace
      },
      parser.attributePlaceHolder);

    expect(elements).to.be.an('array');
    expect(elements.length).to.equal(1);
    expect(elements[0].name).to.equal('OutboundDeliveryExecutionConfirmation');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].children[0].name).to.equal('OutboundDeliveryExecution');
  });

});

describe('SchemaBuilderXSD parseObjectToXML', function () {
  it('should get an error when the object sent is undefined', function () {
    const builder = new SchemaBuilderXSD();
    try {
      builder.parseObjectToXML(undefined);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot convert undefined or null to xml');
    }
  });
  it('should get an error when the object sent is null', function () {
    const builder = new SchemaBuilderXSD();
    try {
      builder.parseObjectToXML(null);
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot convert undefined or null to xml');
    }
  });
});

describe('SchemaBuilderXSD getWSDLElementsFromJsonSchema', function () {
  it('should get an error when the object sent is undefined', function () {
    const builder = new SchemaBuilderXSD();
    let elements = builder.getWSDLElementsFromJsonSchema({ jsonSchema: null });
    expect(elements.elements.length).to.equal(0);
  });
});

describe('SchemaBuilderXSD getTypes', function () {
  it('should get an error when the object sent is undefined', function () {
    const builder = new SchemaBuilderXSD();
    try {
      builder.getTypes(null, '', '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get types from undefined or null object');
    }
  });

  it('should get an error when the object sent is empty object', function () {
    const builder = new SchemaBuilderXSD();
    try {
      builder.getTypes({}, '', '');
      assert.fail('we expected an error');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot get types from object');
    }
  });
});

describe('replaceTagInSchema', function () {
  const
    fileContent = fs.readFileSync(validSchemaFolder + '/replaceAllToSequence.wsdl', 'utf8'),
    schemaNamespace = {
      key: 'xsd',
      prefixFilter: 'xsd:',
      url: 'http://www.w3.org/2001/XMLSchema',
      isDefault: false
    };

  it('Should switch all tags in document with sequence tags', function () {
    const schemaBuilder = new SchemaBuilderXSD(),
      result = schemaBuilder.replaceTagInSchema(fileContent, schemaNamespace, 'all', 'sequence');
    expect(result.includes('<xsd:all>')).to.equal(false);
  });
});
