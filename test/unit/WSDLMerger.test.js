const expect = require('chai').expect,
  SEPARATED_FILES_W3_Example = '../data/separatedFiles/W3Example',
  SEPARATED_FILES_COUNTING = '../data/separatedFiles/counting',
  SEPARATED_FILES_MULTIPLE_ROOT = '../data/separatedFiles/multipleRoot',
  {
    WSDLMerger
  } = require('../../lib/utils/WSDLMerger'),
  fs = require('fs'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  {
    removeLineBreakTabsSpaces
  } = require('../../lib/utils/textUtils'),
  path = require('path'),
  {
    MULTIPLE_ROOT_FILES,
    NOT_WSDL_IN_FOLDER,
    WSDL_DIFF_VERSION,
    MISSING_XML_PARSER
  } = require('../../lib/constants/messageConstants');

describe('WSDLMerger merge', function() {

  it('Should create collection from folder having one root file for browser 1.1', function() {
    const folderPath = path.join(__dirname, SEPARATED_FILES_W3_Example),
      outputDir = path.join(__dirname, SEPARATED_FILES_W3_Example + '/output.wsdl'),
      folderPathService = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquoteservice.wsdl'),
      folderPathSchema = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquote.xsd'),
      folderPathDefinitions = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquote.wsdl'),
      processedInputFiles = [
        `<?xml version="1.0"?><schema targetNamespace="http://example.com/stockquote/schemas"
                     xmlns="http://www.w3.org/2001/XMLSchema"> 
                 <element name="TradePriceRequest">
                 <complexType>
                 <all>            
                     <element name="tickerSymbol" type="string"/>
                     </all>
                     </complexType>
                     </element>
                     <element name="TradePrice">
                     <complexType>
                     <all>
                     <element name="price" type="float"/>
                     </all>
                     </complexType>
                     </element></schema>`,
        `<?xml version="1.0"?><definitions name="StockQuote" targetNamespace="http://example.com/stockquote/definitions"
                 xmlns:tns="http://example.com/stockquote/definitions"
                 xmlns:xsd1="http://example.com/stockquote/schemas"
                 xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"  
                   xmlns="http://schemas.xmlsoap.org/wsdl/">
                   <import namespace="http://example.com/stockquote/schemas" 
                   location="http://example.com/stockquote/stockquote.xsd"/>
                   <message name="GetLastTradePriceInput">        <part name="body" element="xsd1:TradePriceRequest"/>
                   </message>
                   <message name="GetLastTradePriceOutput">
                   <part name="body" element="xsd1:TradePrice"/>
                   </message>
                   <portType name="StockQuotePortType"><operation name="GetLastTradePrice">
                   <input message="tns:GetLastTradePriceInput"/>           
                    <output message="tns:GetLastTradePriceOutput"/>
                   </operation>
                 </portType></definitions>`,
        `<?xml version="1.0"?><definitions name="StockQuote" targetNamespace="http://example.com/stockquote/service"
                 xmlns:tns="http://example.com/stockquote/service"    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
                 xmlns:defs="http://example.com/stockquote/definitions"    xmlns="http://schemas.xmlsoap.org/wsdl/">
                 <import namespace="http://example.com/stockquote/definitions" 
                 location="http://example.com/stockquote/stockquote.wsdl"/>
                 <binding name="StockQuoteSoapBinding" type="defs:StockQuotePortType">
                 <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
                 <operation name="GetLastTradePrice">
                 <soap:operation soapAction="http://example.com/GetLastTradePrice"/>
                 <input>
                 <soap:body use="literal"/>
                 </input>
                 <output>
                 <soap:body use="literal"/>
                 </output></operation></binding><service name="StockQuoteService"><documentation>
                 My first service</documentation>
                 <port name="StockQuotePort" binding="tns:StockQuoteBinding"><soap:address 
                 location="http://example.com/stockquote"/>
         </port></service></definitions>"`
      ],
      expectedOutput = fs.readFileSync(outputDir, 'utf8');

    let processedInput = {},
      files = [],
      array = [{
        fileName: folderPath + '/stockquote.xsd'
      }, {
        fileName: folderPath + '/stockquote.wsdl'
      },
      {
        fileName: folderPath + '/stockquoteservice.wsdl'
      }
      ],
      merger = new WSDLMerger();
    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });

    processedInput[folderPathSchema] = processedInputFiles[0];
    processedInput[folderPathDefinitions] = processedInputFiles[1];
    processedInput[folderPathService] = processedInputFiles[2];

    merger.merge({ data: files, xmlFiles: processedInput }, new XMLParser())
      .then((merged) => {
        expect(removeLineBreakTabsSpaces(merged)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      });
  });

  it('Should create collection from folder having one root file for browser 1.1 no prefix', function() {

    const folderPath = path.join(__dirname, SEPARATED_FILES_COUNTING),
      outputDir = path.join(__dirname, SEPARATED_FILES_COUNTING + '/output.wsdl'),
      folderPathService = path.join(__dirname, SEPARATED_FILES_COUNTING + '/CountingCategoryService.wsdl'),
      folderPathSchema = path.join(__dirname, SEPARATED_FILES_COUNTING + '/CountingCategoryData.xsd'),
      processedInputFiles = [
        `<?xml version="1.0" encoding="UTF-8"?>
        <schema xmlns="http://www.w3.org/2001/XMLSchema" 
        targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1/data"
          xmlns:tns="http://www.example.com/interfaces/parking/operatorServices/v1/data" elementFormDefault="qualified">
            <element name="SetCountingCategoryMode">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                        <element name="carParkNumber" type="int"/>
                        <element name="countingCategoryType" type="tns:countingCategoryType"/>
                        <element name="trafficSignalMode" type="tns:trafficSignalMode"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetCountingCategoryModeOut">
                <complexType>
                    <sequence>
                        <element name="SetCountingCategoryModeResponse" type="tns:SetCountingCategoryModeResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetCountingCategoryModeResponse">
                <sequence/>
            </complexType>
        
        
            <element name="SetCountingCategoryLevel">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                        <element name="carParkNumber" type="int"/>
                        <element name="countingCategoryType" type="tns:countingCategoryType"/>
                        <element name="currentLevel" type="int"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetCountingCategoryLevelOut">
                <complexType>
                    <sequence>
                        <element name="SetCountingCategoryLevelResponse" type="tns:SetCountingCategoryLevelResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetCountingCategoryLevelResponse">
                <sequence/>
            </complexType>
        
            <element name="SetExternalCountingMode">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetExternalCountingModeOut">
                <complexType>
                    <sequence>
                        <element name="SetExternalCountingModeResponse" type="tns:SetExternalCountingModeResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetExternalCountingModeResponse">
                <sequence/>
            </complexType>
        
        
            <simpleType name="trafficSignalMode">
                <restriction base="string">
                    <enumeration value="AUTOMATIC"/>
                    <enumeration value="MANUAL_GREEN_FREE"/>
                    <enumeration value="MANUAL_RED_FULL"/>
                </restriction>
            </simpleType>
        
            <simpleType name="countingCategoryType">
                <restriction base="string">
                    <enumeration value="DEFAULT_COUNTING_CATEGORY_00"/>
                    <enumeration value="SHORT_TERM_PARKER_01"/>
                    <enumeration value="CONTRACT_PARKER_02"/>
                    <enumeration value="TOTAL_03"/>
                    <enumeration value="USER_DEFINED_04"/>
                    <enumeration value="USER_DEFINED_05"/>
                    <enumeration value="USER_DEFINED_06"/>
                    <enumeration value="USER_DEFINED_07"/>
                    <enumeration value="USER_DEFINED_08"/>
                    <enumeration value="USER_DEFINED_09"/>
                    <enumeration value="USER_DEFINED_10"/>
                    <enumeration value="USER_DEFINED_11"/>
                    <enumeration value="USER_DEFINED_12"/>
                    <enumeration value="USER_DEFINED_13"/>
                    <enumeration value="USER_DEFINED_14"/>
                    <enumeration value="USER_DEFINED_15"/>
                    <enumeration value="USER_DEFINED_16"/>
                    <enumeration value="USER_DEFINED_17"/>
                    <enumeration value="USER_DEFINED_18"/>
                    <enumeration value="USER_DEFINED_19"/>
                    <enumeration value="USER_DEFINED_20"/>
                    <enumeration value="USER_DEFINED_21"/>
                    <enumeration value="USER_DEFINED_22"/>
                    <enumeration value="USER_DEFINED_23"/>
                    <enumeration value="USER_DEFINED_24"/>
                    <enumeration value="USER_DEFINED_25"/>
                    <enumeration value="USER_DEFINED_26"/>
                    <enumeration value="USER_DEFINED_27"/>
                    <enumeration value="USER_DEFINED_28"/>
                    <enumeration value="USER_DEFINED_29"/>
                    <enumeration value="USER_DEFINED_30"/>
                    <enumeration value="USER_DEFINED_31"/>
                    <enumeration value="USER_DEFINED_32"/>
                    <enumeration value="USER_DEFINED_33"/>
                    <enumeration value="USER_DEFINED_34"/>
                    <enumeration value="USER_DEFINED_35"/>
                    <enumeration value="USER_DEFINED_36"/>
                    <enumeration value="USER_DEFINED_37"/>
                    <enumeration value="USER_DEFINED_38"/>
                    <enumeration value="USER_DEFINED_39"/>
                    <enumeration value="USER_DEFINED_40"/>
                    <enumeration value="USER_DEFINED_41"/>
                    <enumeration value="USER_DEFINED_42"/>
                    <enumeration value="USER_DEFINED_43"/>
                    <enumeration value="USER_DEFINED_44"/>
                    <enumeration value="USER_DEFINED_45"/>
                    <enumeration value="USER_DEFINED_46"/>
                    <enumeration value="USER_DEFINED_47"/>
                    <enumeration value="USER_DEFINED_48"/>
                    <enumeration value="USER_DEFINED_49"/>
                    <enumeration value="USER_DEFINED_50"/>
                    <enumeration value="USER_DEFINED_51"/>
                    <enumeration value="USER_DEFINED_52"/>
                    <enumeration value="USER_DEFINED_53"/>
                </restriction>
            </simpleType>
        </schema>`,
        `<?xml version="1.0" encoding="utf-8"?>
        <wsdl:definitions name="CountingCategoryService"
         targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1"
            xmlns:tns="http://www.example.com/interfaces/parking/operatorServices/v1"
            xmlns:countingCategoryData="http://www.example.com/interfaces/parking/operatorServices/v1/data"
            xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
            xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
            <wsdl:types>
                <xsd:schema elementFormDefault="qualified" 
                targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1">
                    <xsd:import namespace="http://www.example.com/interfaces/parking/operatorServices/v1/data" 
                    schemaLocation="CountingCategoryData.xsd"/>
                    <xsd:import schemaLocation="../../../common/v1/CommonData.xsd" 
                    namespace="http://www.example.com/interfaces/common/v1/data"/>
                </xsd:schema>
            </wsdl:types>
        
            <wsdl:message name="SetCountingCategoryMode">
                <wsdl:part name="SetCountingCategoryModeRequest" 
                element="countingCategoryData:SetCountingCategoryMode"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryModeResponse">
                <wsdl:part name="SetCountingCategoryModeResponse" 
                element="countingCategoryData:SetCountingCategoryModeOut"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryLevel">
                <wsdl:part name="SetCountingCategoryLevel" 
                element="countingCategoryData:SetCountingCategoryLevel"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryLevelResponse">
                <wsdl:part name="SetCountingCategoryLevelResponse" 
                element="countingCategoryData:SetCountingCategoryLevelOut"/>
            </wsdl:message>
            <wsdl:message name="SetExternalCountingMode">
                <wsdl:part name="SetExternalCountingMode" element="countingCategoryData:SetExternalCountingMode"/>
            </wsdl:message>
            <wsdl:message name="SetExternalCountingModeResponse">
                <wsdl:part name="SetExternalCountingModeResponse" 
                element="countingCategoryData:SetExternalCountingModeOut"/>
            </wsdl:message>
        
        
            <wsdl:portType name="CountingCategoryServiceInterface">
                <wsdl:operation name="SetCountingCategoryMode">
                    <wsdl:input name="SetCountingCategoryModeRequest" message="tns:SetCountingCategoryMode"/>
                    <wsdl:output name="SetCountingCategoryModeResponse" message="tns:SetCountingCategoryModeResponse"/>
                </wsdl:operation>
                <wsdl:operation name="SetCountingCategoryLevel">
                    <wsdl:input name="SetCountingCategoryLevelRequest" message="tns:SetCountingCategoryLevel"/>
                    <wsdl:output name="SetCountingCategoryLevelResponse" 
                    message="tns:SetCountingCategoryLevelResponse"/>
                </wsdl:operation>
                <wsdl:operation name="SetExternalCountingMode">
                    <wsdl:input name="SetExternalCountingModeRequest" message="tns:SetExternalCountingMode"/>
                    <wsdl:output name="SetExternalCountingModeResponse" message="tns:SetExternalCountingModeResponse"/>
                </wsdl:operation>
            </wsdl:portType>
        
            <wsdl:binding name="example.CountingCategoryServiceBinding" type="tns:CountingCategoryServiceInterface">
                <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
                <wsdl:operation name="SetCountingCategoryMode">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetCountingCategoryMode" 
                    style="document"/>
                    <wsdl:input name="SetCountingCategoryModeRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetCountingCategoryModeResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
                <wsdl:operation name="SetCountingCategoryLevel">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetCountingCategoryLevel" 
                    style="document"/>
                    <wsdl:input name="SetCountingCategoryLevelRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetCountingCategoryLevelResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
                <wsdl:operation name="SetExternalCountingMode">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetExternalCountingMode"
                     style="document"/>
                    <wsdl:input name="SetExternalCountingModeRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetExternalCountingModeResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
            </wsdl:binding>
        
            <wsdl:service name="example.CountingCategoryService">
                <wsdl:port name="example.CountingCategoryServicePort" 
                binding="tns:example.CountingCategoryServiceBinding">
                    <soap:address 
                    location="http://www.example.com/interfaces/parking/operatorServices/v1/CountingCategoryService"/>
                </wsdl:port>
            </wsdl:service>
        </wsdl:definitions>`
      ],
      expectedOutput = fs.readFileSync(outputDir, 'utf8');
    let processedInput = {},
      files = [],
      array = [{
        fileName: folderPath + '/CountingCategoryData.xsd'
      },
      {
        fileName: folderPath + '/CountingCategoryService.wsdl'
      }
      ],
      merger = new WSDLMerger();
    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });
    processedInput[folderPathSchema] = processedInputFiles[0];
    processedInput[folderPathService] = processedInputFiles[1];

    merger.merge({ data: files, xmlFiles: processedInput }, new XMLParser())
      .then((merged) => {
        expect(removeLineBreakTabsSpaces(merged)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      }).catch(() => {
        expect.fail('Should not fail');
      });
  });

  it('Should throw an error when xml parser is undefined', function() {

    const folderPath = path.join(__dirname, SEPARATED_FILES_COUNTING),
      outputDir = path.join(__dirname, SEPARATED_FILES_COUNTING + '/output.wsdl'),
      folderPathService = path.join(__dirname, SEPARATED_FILES_COUNTING + '/CountingCategoryService.wsdl'),
      folderPathSchema = path.join(__dirname, SEPARATED_FILES_COUNTING + '/CountingCategoryData.xsd'),
      processedInputFiles = [
        `<?xml version="1.0" encoding="UTF-8"?>
        <schema xmlns="http://www.w3.org/2001/XMLSchema" 
        targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1/data"
          xmlns:tns="http://www.example.com/interfaces/parking/operatorServices/v1/data" elementFormDefault="qualified">
            <element name="SetCountingCategoryMode">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                        <element name="carParkNumber" type="int"/>
                        <element name="countingCategoryType" type="tns:countingCategoryType"/>
                        <element name="trafficSignalMode" type="tns:trafficSignalMode"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetCountingCategoryModeOut">
                <complexType>
                    <sequence>
                        <element name="SetCountingCategoryModeResponse" type="tns:SetCountingCategoryModeResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetCountingCategoryModeResponse">
                <sequence/>
            </complexType>
        
        
            <element name="SetCountingCategoryLevel">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                        <element name="carParkNumber" type="int"/>
                        <element name="countingCategoryType" type="tns:countingCategoryType"/>
                        <element name="currentLevel" type="int"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetCountingCategoryLevelOut">
                <complexType>
                    <sequence>
                        <element name="SetCountingCategoryLevelResponse" type="tns:SetCountingCategoryLevelResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetCountingCategoryLevelResponse">
                <sequence/>
            </complexType>
        
            <element name="SetExternalCountingMode">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetExternalCountingModeOut">
                <complexType>
                    <sequence>
                        <element name="SetExternalCountingModeResponse" type="tns:SetExternalCountingModeResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetExternalCountingModeResponse">
                <sequence/>
            </complexType>
        
        
            <simpleType name="trafficSignalMode">
                <restriction base="string">
                    <enumeration value="AUTOMATIC"/>
                    <enumeration value="MANUAL_GREEN_FREE"/>
                    <enumeration value="MANUAL_RED_FULL"/>
                </restriction>
            </simpleType>
        
            <simpleType name="countingCategoryType">
                <restriction base="string">
                    <enumeration value="DEFAULT_COUNTING_CATEGORY_00"/>
                    <enumeration value="SHORT_TERM_PARKER_01"/>
                    <enumeration value="CONTRACT_PARKER_02"/>
                    <enumeration value="TOTAL_03"/>
                    <enumeration value="USER_DEFINED_04"/>
                    <enumeration value="USER_DEFINED_05"/>
                    <enumeration value="USER_DEFINED_06"/>
                    <enumeration value="USER_DEFINED_07"/>
                    <enumeration value="USER_DEFINED_08"/>
                    <enumeration value="USER_DEFINED_09"/>
                    <enumeration value="USER_DEFINED_10"/>
                    <enumeration value="USER_DEFINED_11"/>
                    <enumeration value="USER_DEFINED_12"/>
                    <enumeration value="USER_DEFINED_13"/>
                    <enumeration value="USER_DEFINED_14"/>
                    <enumeration value="USER_DEFINED_15"/>
                    <enumeration value="USER_DEFINED_16"/>
                    <enumeration value="USER_DEFINED_17"/>
                    <enumeration value="USER_DEFINED_18"/>
                    <enumeration value="USER_DEFINED_19"/>
                    <enumeration value="USER_DEFINED_20"/>
                    <enumeration value="USER_DEFINED_21"/>
                    <enumeration value="USER_DEFINED_22"/>
                    <enumeration value="USER_DEFINED_23"/>
                    <enumeration value="USER_DEFINED_24"/>
                    <enumeration value="USER_DEFINED_25"/>
                    <enumeration value="USER_DEFINED_26"/>
                    <enumeration value="USER_DEFINED_27"/>
                    <enumeration value="USER_DEFINED_28"/>
                    <enumeration value="USER_DEFINED_29"/>
                    <enumeration value="USER_DEFINED_30"/>
                    <enumeration value="USER_DEFINED_31"/>
                    <enumeration value="USER_DEFINED_32"/>
                    <enumeration value="USER_DEFINED_33"/>
                    <enumeration value="USER_DEFINED_34"/>
                    <enumeration value="USER_DEFINED_35"/>
                    <enumeration value="USER_DEFINED_36"/>
                    <enumeration value="USER_DEFINED_37"/>
                    <enumeration value="USER_DEFINED_38"/>
                    <enumeration value="USER_DEFINED_39"/>
                    <enumeration value="USER_DEFINED_40"/>
                    <enumeration value="USER_DEFINED_41"/>
                    <enumeration value="USER_DEFINED_42"/>
                    <enumeration value="USER_DEFINED_43"/>
                    <enumeration value="USER_DEFINED_44"/>
                    <enumeration value="USER_DEFINED_45"/>
                    <enumeration value="USER_DEFINED_46"/>
                    <enumeration value="USER_DEFINED_47"/>
                    <enumeration value="USER_DEFINED_48"/>
                    <enumeration value="USER_DEFINED_49"/>
                    <enumeration value="USER_DEFINED_50"/>
                    <enumeration value="USER_DEFINED_51"/>
                    <enumeration value="USER_DEFINED_52"/>
                    <enumeration value="USER_DEFINED_53"/>
                </restriction>
            </simpleType>
        </schema>`,
        `<?xml version="1.0" encoding="utf-8"?>
        <wsdl:definitions name="CountingCategoryService"
         targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1"
            xmlns:tns="http://www.example.com/interfaces/parking/operatorServices/v1"
            xmlns:countingCategoryData="http://www.example.com/interfaces/parking/operatorServices/v1/data"
            xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
            xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
            <wsdl:types>
                <xsd:schema elementFormDefault="qualified" 
                targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1">
                    <xsd:import namespace="http://www.example.com/interfaces/parking/operatorServices/v1/data" 
                    schemaLocation="CountingCategoryData.xsd"/>
                    <xsd:import schemaLocation="../../../common/v1/CommonData.xsd" 
                    namespace="http://www.example.com/interfaces/common/v1/data"/>
                </xsd:schema>
            </wsdl:types>
        
            <wsdl:message name="SetCountingCategoryMode">
                <wsdl:part name="SetCountingCategoryModeRequest" 
                element="countingCategoryData:SetCountingCategoryMode"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryModeResponse">
                <wsdl:part name="SetCountingCategoryModeResponse" 
                element="countingCategoryData:SetCountingCategoryModeOut"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryLevel">
                <wsdl:part name="SetCountingCategoryLevel" 
                element="countingCategoryData:SetCountingCategoryLevel"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryLevelResponse">
                <wsdl:part name="SetCountingCategoryLevelResponse" 
                element="countingCategoryData:SetCountingCategoryLevelOut"/>
            </wsdl:message>
            <wsdl:message name="SetExternalCountingMode">
                <wsdl:part name="SetExternalCountingMode" element="countingCategoryData:SetExternalCountingMode"/>
            </wsdl:message>
            <wsdl:message name="SetExternalCountingModeResponse">
                <wsdl:part name="SetExternalCountingModeResponse" 
                element="countingCategoryData:SetExternalCountingModeOut"/>
            </wsdl:message>
        
        
            <wsdl:portType name="CountingCategoryServiceInterface">
                <wsdl:operation name="SetCountingCategoryMode">
                    <wsdl:input name="SetCountingCategoryModeRequest" message="tns:SetCountingCategoryMode"/>
                    <wsdl:output name="SetCountingCategoryModeResponse" message="tns:SetCountingCategoryModeResponse"/>
                </wsdl:operation>
                <wsdl:operation name="SetCountingCategoryLevel">
                    <wsdl:input name="SetCountingCategoryLevelRequest" message="tns:SetCountingCategoryLevel"/>
                    <wsdl:output name="SetCountingCategoryLevelResponse" 
                    message="tns:SetCountingCategoryLevelResponse"/>
                </wsdl:operation>
                <wsdl:operation name="SetExternalCountingMode">
                    <wsdl:input name="SetExternalCountingModeRequest" message="tns:SetExternalCountingMode"/>
                    <wsdl:output name="SetExternalCountingModeResponse" message="tns:SetExternalCountingModeResponse"/>
                </wsdl:operation>
            </wsdl:portType>
        
            <wsdl:binding name="example.CountingCategoryServiceBinding" type="tns:CountingCategoryServiceInterface">
                <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
                <wsdl:operation name="SetCountingCategoryMode">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetCountingCategoryMode" 
                    style="document"/>
                    <wsdl:input name="SetCountingCategoryModeRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetCountingCategoryModeResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
                <wsdl:operation name="SetCountingCategoryLevel">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetCountingCategoryLevel" 
                    style="document"/>
                    <wsdl:input name="SetCountingCategoryLevelRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetCountingCategoryLevelResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
                <wsdl:operation name="SetExternalCountingMode">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetExternalCountingMode"
                     style="document"/>
                    <wsdl:input name="SetExternalCountingModeRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetExternalCountingModeResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
            </wsdl:binding>
        
            <wsdl:service name="example.CountingCategoryService">
                <wsdl:port name="example.CountingCategoryServicePort" 
                binding="tns:example.CountingCategoryServiceBinding">
                    <soap:address 
                    location="http://www.example.com/interfaces/parking/operatorServices/v1/CountingCategoryService"/>
                </wsdl:port>
            </wsdl:service>
        </wsdl:definitions>`
      ],
      expectedOutput = fs.readFileSync(outputDir, 'utf8');
    let processedInput = {},
      files = [],
      array = [{
        fileName: folderPath + '/CountingCategoryData.xsd'
      },
      {
        fileName: folderPath + '/CountingCategoryService.wsdl'
      }
      ],
      merger = new WSDLMerger();
    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });
    processedInput[folderPathSchema] = processedInputFiles[0];
    processedInput[folderPathService] = processedInputFiles[1];

    merger.merge({ data: files, xmlFiles: processedInput }, undefined)
      .then((merged) => {
        expect(removeLineBreakTabsSpaces(merged)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      })
      .catch((err) => {
        expect(err.message).to.equal(MISSING_XML_PARSER);
      });
  });

  it('Should throw an error when input has not wsdl', function() {

    const folderPath = path.join(__dirname, SEPARATED_FILES_COUNTING),
      folderPathSchema = path.join(__dirname, SEPARATED_FILES_COUNTING + '/CountingCategoryData.xsd'),
      processedInputFiles = [
        `<?xml version="1.0" encoding="UTF-8"?>
        <schema xmlns="http://www.w3.org/2001/XMLSchema" 
        targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1/data"
          xmlns:tns="http://www.example.com/interfaces/parking/operatorServices/v1/data" elementFormDefault="qualified">
            <element name="SetCountingCategoryMode">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                        <element name="carParkNumber" type="int"/>
                        <element name="countingCategoryType" type="tns:countingCategoryType"/>
                        <element name="trafficSignalMode" type="tns:trafficSignalMode"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetCountingCategoryModeOut">
                <complexType>
                    <sequence>
                        <element name="SetCountingCategoryModeResponse" type="tns:SetCountingCategoryModeResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetCountingCategoryModeResponse">
                <sequence/>
            </complexType>
        
        
            <element name="SetCountingCategoryLevel">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                        <element name="carParkNumber" type="int"/>
                        <element name="countingCategoryType" type="tns:countingCategoryType"/>
                        <element name="currentLevel" type="int"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetCountingCategoryLevelOut">
                <complexType>
                    <sequence>
                        <element name="SetCountingCategoryLevelResponse" type="tns:SetCountingCategoryLevelResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetCountingCategoryLevelResponse">
                <sequence/>
            </complexType>
        
            <element name="SetExternalCountingMode">
                <complexType >
                    <sequence>
                        <element name="facilityId" type="long"/>
                    </sequence>
                </complexType>
            </element>
        
            <element name="SetExternalCountingModeOut">
                <complexType>
                    <sequence>
                        <element name="SetExternalCountingModeResponse" type="tns:SetExternalCountingModeResponse">
                        </element>
                    </sequence>
                </complexType>
            </element>
            <complexType name="SetExternalCountingModeResponse">
                <sequence/>
            </complexType>
        
        
            <simpleType name="trafficSignalMode">
                <restriction base="string">
                    <enumeration value="AUTOMATIC"/>
                    <enumeration value="MANUAL_GREEN_FREE"/>
                    <enumeration value="MANUAL_RED_FULL"/>
                </restriction>
            </simpleType>
        
            <simpleType name="countingCategoryType">
                <restriction base="string">
                    <enumeration value="DEFAULT_COUNTING_CATEGORY_00"/>
                    <enumeration value="SHORT_TERM_PARKER_01"/>
                    <enumeration value="CONTRACT_PARKER_02"/>
                    <enumeration value="TOTAL_03"/>
                    <enumeration value="USER_DEFINED_04"/>
                    <enumeration value="USER_DEFINED_05"/>
                    <enumeration value="USER_DEFINED_06"/>
                    <enumeration value="USER_DEFINED_07"/>
                    <enumeration value="USER_DEFINED_08"/>
                    <enumeration value="USER_DEFINED_09"/>
                    <enumeration value="USER_DEFINED_10"/>
                    <enumeration value="USER_DEFINED_11"/>
                    <enumeration value="USER_DEFINED_12"/>
                    <enumeration value="USER_DEFINED_13"/>
                    <enumeration value="USER_DEFINED_14"/>
                    <enumeration value="USER_DEFINED_15"/>
                    <enumeration value="USER_DEFINED_16"/>
                    <enumeration value="USER_DEFINED_17"/>
                    <enumeration value="USER_DEFINED_18"/>
                    <enumeration value="USER_DEFINED_19"/>
                    <enumeration value="USER_DEFINED_20"/>
                    <enumeration value="USER_DEFINED_21"/>
                    <enumeration value="USER_DEFINED_22"/>
                    <enumeration value="USER_DEFINED_23"/>
                    <enumeration value="USER_DEFINED_24"/>
                    <enumeration value="USER_DEFINED_25"/>
                    <enumeration value="USER_DEFINED_26"/>
                    <enumeration value="USER_DEFINED_27"/>
                    <enumeration value="USER_DEFINED_28"/>
                    <enumeration value="USER_DEFINED_29"/>
                    <enumeration value="USER_DEFINED_30"/>
                    <enumeration value="USER_DEFINED_31"/>
                    <enumeration value="USER_DEFINED_32"/>
                    <enumeration value="USER_DEFINED_33"/>
                    <enumeration value="USER_DEFINED_34"/>
                    <enumeration value="USER_DEFINED_35"/>
                    <enumeration value="USER_DEFINED_36"/>
                    <enumeration value="USER_DEFINED_37"/>
                    <enumeration value="USER_DEFINED_38"/>
                    <enumeration value="USER_DEFINED_39"/>
                    <enumeration value="USER_DEFINED_40"/>
                    <enumeration value="USER_DEFINED_41"/>
                    <enumeration value="USER_DEFINED_42"/>
                    <enumeration value="USER_DEFINED_43"/>
                    <enumeration value="USER_DEFINED_44"/>
                    <enumeration value="USER_DEFINED_45"/>
                    <enumeration value="USER_DEFINED_46"/>
                    <enumeration value="USER_DEFINED_47"/>
                    <enumeration value="USER_DEFINED_48"/>
                    <enumeration value="USER_DEFINED_49"/>
                    <enumeration value="USER_DEFINED_50"/>
                    <enumeration value="USER_DEFINED_51"/>
                    <enumeration value="USER_DEFINED_52"/>
                    <enumeration value="USER_DEFINED_53"/>
                </restriction>
            </simpleType>
        </schema>`
      ];
    let processedInput = {},
      files = [],
      array = [{
        fileName: folderPath + '/CountingCategoryData.xsd'
      }
      ],
      merger = new WSDLMerger();
    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });
    processedInput[folderPathSchema] = processedInputFiles[0];

    merger.merge({ data: files, xmlFiles: processedInput }, new XMLParser())
      .then(() => {
        expect.fail(null, null, status.reason);
      })
      .catch((err) => {
        expect(err.message).to.equal(NOT_WSDL_IN_FOLDER);
      });
  });

  it('Should throw an error when input has different wsdl version', function() {
    const folderPath = path.join(__dirname, SEPARATED_FILES_W3_Example),
      folderPathService = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquoteservice.wsdl'),
      folderPathSchema = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquote.xsd'),
      folderPathDefinitions = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquote.wsdl'),
      processedInputFiles = [
        `<?xml version="1.0"?><schema targetNamespace="http://example.com/stockquote/schemas"
                     xmlns="http://www.w3.org/2001/XMLSchema"> 
                 <element name="TradePriceRequest">
                 <complexType>
                 <all>            
                     <element name="tickerSymbol" type="string"/>
                     </all>
                     </complexType>
                     </element>
                     <element name="TradePrice">
                     <complexType>
                     <all>
                     <element name="price" type="float"/>
                     </all>
                     </complexType>
                     </element></schema>`,
        `<?xml version="1.0"?><definitions name="StockQuote" targetNamespace="http://example.com/stockquote/definitions"
                 xmlns:tns="http://example.com/stockquote/definitions"
                 xmlns:xsd1="http://example.com/stockquote/schemas"
                 xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"  
                   xmlns="http://schemas.xmlsoap.org/wsdl/">
                   <import namespace="http://example.com/stockquote/schemas" 
                   location="http://example.com/stockquote/stockquote.xsd"/>
                   <message name="GetLastTradePriceInput">        <part name="body" element="xsd1:TradePriceRequest"/>
                   </message>
                   <message name="GetLastTradePriceOutput">
                   <part name="body" element="xsd1:TradePrice"/>
                   </message>
                   <portType name="StockQuotePortType"><operation name="GetLastTradePrice">
                   <input message="tns:GetLastTradePriceInput"/>           
                    <output message="tns:GetLastTradePriceOutput"/>
                   </operation>
                 </portType></definitions>`,
        `<?xml version="1.0"?><description name="StockQuote" targetNamespace="http://example.com/stockquote/service"
                 xmlns:tns="http://example.com/stockquote/service"    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
                 xmlns:defs="http://example.com/stockquote/definitions"    xmlns="http://schemas.xmlsoap.org/wsdl/">
                 <import namespace="http://example.com/stockquote/definitions" 
                 location="http://example.com/stockquote/stockquote.wsdl"/>
                 <binding name="StockQuoteSoapBinding" type="defs:StockQuotePortType">
                 <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
                 <operation name="GetLastTradePrice">
                 <soap:operation soapAction="http://example.com/GetLastTradePrice"/>
                 <input>
                 <soap:body use="literal"/>
                 </input>
                 <output>
                 <soap:body use="literal"/>
                 </output></operation></binding><service name="StockQuoteService"><documentation>
                 My first service</documentation>
                 <port name="StockQuotePort" binding="tns:StockQuoteBinding"><soap:address 
                 location="http://example.com/stockquote"/>
         </port></service></description>"`
      ];

    let processedInput = {},
      files = [],
      array = [{
        fileName: folderPath + '/stockquote.xsd'
      }, {
        fileName: folderPath + '/stockquote.wsdl'
      },
      {
        fileName: folderPath + '/stockquoteservice.wsdl'
      }
      ],
      merger = new WSDLMerger();
    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });

    processedInput[folderPathSchema] = processedInputFiles[0];
    processedInput[folderPathDefinitions] = processedInputFiles[1];
    processedInput[folderPathService] = processedInputFiles[2];

    merger.merge({ data: files, xmlFiles: processedInput }, new XMLParser())
      .then(() => {
        expect.fail(null, null, 'Should throw error');
      })
      .catch((err) => {
        expect(err.message).to.equal(WSDL_DIFF_VERSION);
      });
  });

  it('Should throw an error when input has more than one root file (services)', function() {
    const folderPath = path.join(__dirname, SEPARATED_FILES_MULTIPLE_ROOT),
      folderPathService = path.join(__dirname, SEPARATED_FILES_MULTIPLE_ROOT + '/CountingCategoryService.wsdl'),
      folderPathServiceCopy = path.join(__dirname, SEPARATED_FILES_MULTIPLE_ROOT + '/CountingCategoryServiceCopy.wsdl'),
      folderPathSchema = path.join(__dirname, SEPARATED_FILES_MULTIPLE_ROOT + '/CountingCategoryData.xsd'),
      processedInputFiles = [
        `<?xml version="1.0" encoding="UTF-8"?>
        <schema xmlns="http://www.w3.org/2001/XMLSchema" 
        targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1/data"
          xmlns:tns="http://www.example.com/interfaces/parking/operatorServices/v1/data" elementFormDefault="qualified">
            <simpleType name="trafficSignalMode">
                <restriction base="string">
                    <enumeration value="AUTOMATIC"/>
                    <enumeration value="MANUAL_GREEN_FREE"/>
                    <enumeration value="MANUAL_RED_FULL"/>
                </restriction>
            </simpleType>
        </schema>`,
        `<?xml version="1.0" encoding="utf-8"?>
        <wsdl:definitions name="CountingCategoryService"
         targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1"
            xmlns:tns="http://www.example.com/interfaces/parking/operatorServices/v1"
            xmlns:countingCategoryData="http://www.example.com/interfaces/parking/operatorServices/v1/data"
            xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
            xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
            <wsdl:types>
                <xsd:schema elementFormDefault="qualified" 
                targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1">
                    <xsd:import namespace="http://www.example.com/interfaces/parking/operatorServices/v1/data" 
                    schemaLocation="CountingCategoryData.xsd"/>
                    <xsd:import schemaLocation="../../../common/v1/CommonData.xsd" 
                    namespace="http://www.example.com/interfaces/common/v1/data"/>
                </xsd:schema>
            </wsdl:types>
        
            <wsdl:message name="SetCountingCategoryMode">
                <wsdl:part name="SetCountingCategoryModeRequest" 
                element="countingCategoryData:SetCountingCategoryMode"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryModeResponse">
                <wsdl:part name="SetCountingCategoryModeResponse" 
                element="countingCategoryData:SetCountingCategoryModeOut"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryLevel">
                <wsdl:part name="SetCountingCategoryLevel" 
                element="countingCategoryData:SetCountingCategoryLevel"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryLevelResponse">
                <wsdl:part name="SetCountingCategoryLevelResponse" 
                element="countingCategoryData:SetCountingCategoryLevelOut"/>
            </wsdl:message>
            <wsdl:message name="SetExternalCountingMode">
                <wsdl:part name="SetExternalCountingMode" element="countingCategoryData:SetExternalCountingMode"/>
            </wsdl:message>
            <wsdl:message name="SetExternalCountingModeResponse">
                <wsdl:part name="SetExternalCountingModeResponse" 
                element="countingCategoryData:SetExternalCountingModeOut"/>
            </wsdl:message>
        
        
            <wsdl:portType name="CountingCategoryServiceInterface">
                <wsdl:operation name="SetCountingCategoryMode">
                    <wsdl:input name="SetCountingCategoryModeRequest" message="tns:SetCountingCategoryMode"/>
                    <wsdl:output name="SetCountingCategoryModeResponse" message="tns:SetCountingCategoryModeResponse"/>
                </wsdl:operation>
                <wsdl:operation name="SetCountingCategoryLevel">
                    <wsdl:input name="SetCountingCategoryLevelRequest" message="tns:SetCountingCategoryLevel"/>
                    <wsdl:output name="SetCountingCategoryLevelResponse" 
                    message="tns:SetCountingCategoryLevelResponse"/>
                </wsdl:operation>
                <wsdl:operation name="SetExternalCountingMode">
                    <wsdl:input name="SetExternalCountingModeRequest" message="tns:SetExternalCountingMode"/>
                    <wsdl:output name="SetExternalCountingModeResponse" message="tns:SetExternalCountingModeResponse"/>
                </wsdl:operation>
            </wsdl:portType>
        
            <wsdl:binding name="example.CountingCategoryServiceBinding" type="tns:CountingCategoryServiceInterface">
                <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
                <wsdl:operation name="SetCountingCategoryMode">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetCountingCategoryMode" 
                    style="document"/>
                    <wsdl:input name="SetCountingCategoryModeRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetCountingCategoryModeResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
                <wsdl:operation name="SetCountingCategoryLevel">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetCountingCategoryLevel" 
                    style="document"/>
                    <wsdl:input name="SetCountingCategoryLevelRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetCountingCategoryLevelResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
                <wsdl:operation name="SetExternalCountingMode">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetExternalCountingMode"
                     style="document"/>
                    <wsdl:input name="SetExternalCountingModeRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetExternalCountingModeResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
            </wsdl:binding>
        
            <wsdl:service name="example.CountingCategoryService">
                <wsdl:port name="example.CountingCategoryServicePort" 
                binding="tns:example.CountingCategoryServiceBinding">
                    <soap:address 
                    location="http://www.example.com/interfaces/parking/operatorServices/v1/CountingCategoryService"/>
                </wsdl:port>
            </wsdl:service>
        </wsdl:definitions>`,
        `<?xml version="1.0" encoding="utf-8"?>
        <wsdl:definitions name="CountingCategoryService"
         targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1"
            xmlns:tns="http://www.example.com/interfaces/parking/operatorServices/v1"
            xmlns:countingCategoryData="http://www.example.com/interfaces/parking/operatorServices/v1/data"
            xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
            xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
            <wsdl:types>
                <xsd:schema elementFormDefault="qualified" 
                targetNamespace="http://www.example.com/interfaces/parking/operatorServices/v1">
                    <xsd:import namespace="http://www.example.com/interfaces/parking/operatorServices/v1/data" 
                    schemaLocation="CountingCategoryData.xsd"/>
                    <xsd:import schemaLocation="../../../common/v1/CommonData.xsd" 
                    namespace="http://www.example.com/interfaces/common/v1/data"/>
                </xsd:schema>
            </wsdl:types>
        
            <wsdl:message name="SetCountingCategoryMode">
                <wsdl:part name="SetCountingCategoryModeRequest" 
                element="countingCategoryData:SetCountingCategoryMode"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryModeResponse">
                <wsdl:part name="SetCountingCategoryModeResponse" 
                element="countingCategoryData:SetCountingCategoryModeOut"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryLevel">
                <wsdl:part name="SetCountingCategoryLevel" 
                element="countingCategoryData:SetCountingCategoryLevel"/>
            </wsdl:message>
            <wsdl:message name="SetCountingCategoryLevelResponse">
                <wsdl:part name="SetCountingCategoryLevelResponse" 
                element="countingCategoryData:SetCountingCategoryLevelOut"/>
            </wsdl:message>
            <wsdl:message name="SetExternalCountingMode">
                <wsdl:part name="SetExternalCountingMode" element="countingCategoryData:SetExternalCountingMode"/>
            </wsdl:message>
            <wsdl:message name="SetExternalCountingModeResponse">
                <wsdl:part name="SetExternalCountingModeResponse" 
                element="countingCategoryData:SetExternalCountingModeOut"/>
            </wsdl:message>
        
        
            <wsdl:portType name="CountingCategoryServiceInterface">
                <wsdl:operation name="SetCountingCategoryMode">
                    <wsdl:input name="SetCountingCategoryModeRequest" message="tns:SetCountingCategoryMode"/>
                    <wsdl:output name="SetCountingCategoryModeResponse" message="tns:SetCountingCategoryModeResponse"/>
                </wsdl:operation>
                <wsdl:operation name="SetCountingCategoryLevel">
                    <wsdl:input name="SetCountingCategoryLevelRequest" message="tns:SetCountingCategoryLevel"/>
                    <wsdl:output name="SetCountingCategoryLevelResponse" 
                    message="tns:SetCountingCategoryLevelResponse"/>
                </wsdl:operation>
                <wsdl:operation name="SetExternalCountingMode">
                    <wsdl:input name="SetExternalCountingModeRequest" message="tns:SetExternalCountingMode"/>
                    <wsdl:output name="SetExternalCountingModeResponse" message="tns:SetExternalCountingModeResponse"/>
                </wsdl:operation>
            </wsdl:portType>
        
            <wsdl:binding name="example.CountingCategoryServiceBinding" type="tns:CountingCategoryServiceInterface">
                <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
                <wsdl:operation name="SetCountingCategoryMode">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetCountingCategoryMode" 
                    style="document"/>
                    <wsdl:input name="SetCountingCategoryModeRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetCountingCategoryModeResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
                <wsdl:operation name="SetCountingCategoryLevel">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetCountingCategoryLevel" 
                    style="document"/>
                    <wsdl:input name="SetCountingCategoryLevelRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetCountingCategoryLevelResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
                <wsdl:operation name="SetExternalCountingMode">
                    <soap:operation 
                    soapAction="http://www.example.com/interfaces/parking/operatorServices/v1/SetExternalCountingMode"
                     style="document"/>
                    <wsdl:input name="SetExternalCountingModeRequest">
                        <soap:body use="literal"/>
                    </wsdl:input>
                    <wsdl:output name="SetExternalCountingModeResponse">
                        <soap:body use="literal"/>
                    </wsdl:output>
                </wsdl:operation>
            </wsdl:binding>
        
            <wsdl:service name="example.CountingCategoryService">
                <wsdl:port name="example.CountingCategoryServicePort" 
                binding="tns:example.CountingCategoryServiceBinding">
                    <soap:address 
                    location="http://www.example.com/interfaces/parking/operatorServices/v1/CountingCategoryService"/>
                </wsdl:port>
            </wsdl:service>
        </wsdl:definitions>`
      ];

    let processedInput = {},
      files = [],
      array = [{
        fileName: folderPath + '/CountingCategoryData.xsd'
      }, {
        fileName: folderPath + '/CountingCategoryService.wsdl'
      },
      {
        fileName: folderPath + '/CountingCategoryServiceCopy.wsdl'
      }
      ],
      merger = new WSDLMerger();
    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });

    processedInput[folderPathSchema] = processedInputFiles[0];
    processedInput[folderPathService] = processedInputFiles[1];
    processedInput[folderPathServiceCopy] = processedInputFiles[2];
    merger.merge({ data: files, xmlFiles: processedInput }, new XMLParser())
      .then(() => {
        expect.fail(null, null, status.reason);
      })
      .catch((err) => {
        expect(err.message).to.equal(MULTIPLE_ROOT_FILES);
      });
  });

  it('Should create collection from 1.1 type exists in root', function() {
    const folderPathService = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquoteservice.wsdl'),
      folderPathSchema = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquote.xsd'),
      folderPathDefinitions = path.join(__dirname, SEPARATED_FILES_W3_Example + '/stockquote.wsdl'),
      processedInputFiles = [
        `<?xml version="1.0"?><schema targetNamespace="http://example.com/stockquote/schemas"
                   xmlns="http://www.w3.org/2001/XMLSchema"> 
               <element name="TradePriceRequest">
               <complexType>
               <all>            
                   <element name="tickerSymbol" type="string"/>
                   </all>
                   </complexType>
                   </element>
                   <element name="TradePrice">
                   <complexType>
                   <all>
                   <element name="price" type="float"/>
                   </all>
                   </complexType>
                   </element></schema>`,
        `<?xml version="1.0"?><definitions name="StockQuote" targetNamespace="http://example.com/stockquote/definitions"
               xmlns:tns="http://example.com/stockquote/definitions"
               xmlns:xsd1="http://example.com/stockquote/schemas"
               xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"  
                 xmlns="http://schemas.xmlsoap.org/wsdl/">
                 <import namespace="http://example.com/stockquote/schemas" 
                 location="http://example.com/stockquote/stockquote.xsd"/>
                 <message name="GetLastTradePriceInput">        <part name="body" element="xsd1:TradePriceRequest"/>
                 </message>
                 <message name="GetLastTradePriceOutput">
                 <part name="body" element="xsd1:TradePrice"/>
                 </message>
                 <portType name="StockQuotePortType"><operation name="GetLastTradePrice">
                 <input message="tns:GetLastTradePriceInput"/>           
                  <output message="tns:GetLastTradePriceOutput"/>
                 </operation>
               </portType></definitions>`,
        `<?xml version="1.0"?><definitions name="StockQuote" targetNamespace="http://example.com/stockquote/service"
               xmlns:tns="http://example.com/stockquote/service"    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
               xmlns:defs="http://example.com/stockquote/definitions"    xmlns="http://schemas.xmlsoap.org/wsdl/">
               <import namespace="http://example.com/stockquote/definitions" 
               location="http://example.com/stockquote/stockquote.wsdl"/>
               <types><node/></types>
               <binding name="StockQuoteSoapBinding" type="defs:StockQuotePortType">
               <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
               <operation name="GetLastTradePrice">
               <soap:operation soapAction="http://example.com/GetLastTradePrice"/>
               <input>
               <soap:body use="literal"/>
               </input>
               <output>
               <soap:body use="literal"/>
               </output></operation></binding><service name="StockQuoteService"><documentation>
               My first service</documentation>
               <port name="StockQuotePort" binding="tns:StockQuoteBinding"><soap:address 
               location="http://example.com/stockquote"/>
       </port></service></definitions>"`
      ],
      expectedOutput = `<definitionsname="StockQuote"targetNamespace="http://example.com/stockquote/service"
      xmlns:tns="http://example.com/stockquote/service"xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
      xmlns:defs="http://example.com/stockquote/definitions"xmlns="http://schemas.xmlsoap.org/wsdl/"xmlns:xsd1
      ="http://example.com/stockquote/schemas"><importnamespace="http://example.com/stockquote/definitions"
      location="http://example.com/stockquote/stockquote.wsdl"/><types><node/><schematargetNamespace="http:
      //example.com/stockquote/schemas"xmlns="http://www.w3.org/2001/XMLSchema"><elementname="TradePriceRequest">
      <complexType><all><elementname="tickerSymbol"type="string"/></all>
      </complexType></element><elementname="TradePrice">
      <complexType><all><elementname="price"type="float"/></all></complexType></element></schema></types>
      <bindingname="StockQuoteSoapBinding"type="defs:StockQuotePortType"
      ><soap:bindingstyle="document"transport="http://schemas.xmlsoap.org/soap/http"/>
      <operationname="GetLastTradePrice"><soap:operationsoapAction="http://example.com/GetLastTradePrice"/>
      <input><soap:bodyuse="literal"/></input><output><soap:bodyuse="literal"/></output></operation></binding>
      <servicename="StockQuoteService"><documentation>Myfirstservice</documentation><portname="StockQuotePort"binding="
      tns:StockQuoteBinding"><soap:addresslocation="http://example.com/stockquote"/></port></service>
      <messagename="GetLastTradePriceInput">
      <partname="body"element="xsd1:TradePriceRequest"/></message><messagename="GetLastTradePriceOutput">
      <partname="body"element="xsd1:TradePrice"/></message><portTypename="StockQuotePortType">
      <operationname="GetLastTradePrice"><inputmessage="tns:GetLastTradePriceInput"/>
      <outputmessage="tns:GetLastTradePriceOutput"/></operation></portType></definitions>`;

    let processedInput = {},
      files = [{
        fileName: folderPathSchema
      },
      {
        fileName: folderPathDefinitions
      },
      {
        fileName: folderPathService
      }
      ],
      merger = new WSDLMerger();

    processedInput[folderPathSchema] = processedInputFiles[0];
    processedInput[folderPathDefinitions] = processedInputFiles[1];
    processedInput[folderPathService] = processedInputFiles[2];

    merger.merge({ data: files, xmlFiles: processedInput }, new XMLParser())
      .then((merged) => {
        expect(removeLineBreakTabsSpaces(merged)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      });
  });

});
