const expect = require('chai').expect,
    SEPARATED_FILES = 'test/data/separatedFiles',
    {
        merge
    } = require('../../lib/utils/WSDLMerger'),
    fs = require('fs'),
    {
        XMLParser,
    } = require('../../lib/XMLParser'),
    {
        removeLineBreakTabsSpaces
    } = require('../../lib/utils/textUtils');

describe('WSDLMerger merge', function () {

    it('Should create collection from folder having one root file for browser', function () {
        const processedInput = {
            '/Users/luis.tejeda/Documents/Source/GitHub/postmanlabs/wsdl-to-postman/test/data/separatedFiles/W3Example/stockquote.xsd':
                `<?xml version="1.0"?><schema targetNamespace="http://example.com/stockquote/schemas"
                    xmlns="http://www.w3.org/2000/10/XMLSchema"> 
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
            '/Users/luis.tejeda/Documents/Source/GitHub/postmanlabs/wsdl-to-postman/test/data/separatedFiles/W3Example/stockquote.wsdl':
                `<?xml version="1.0"?><definitions name="StockQuote" targetNamespace="http://example.com/stockquote/definitions"
                xmlns:tns="http://example.com/stockquote/definitions"
                xmlns:xsd1="http://example.com/stockquote/schemas"
                xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"  
                  xmlns="http://schemas.xmlsoap.org/wsdl/">
                  <import namespace="http://example.com/stockquote/schemas" location="http://example.com/stockquote/stockquote.xsd"/>
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
            '/Users/luis.tejeda/Documents/Source/GitHub/postmanlabs/wsdl-to-postman/test/data/separatedFiles/W3Example/stockquoteservice.wsdl':
                `<?xml version="1.0"?><definitions name="StockQuote" targetNamespace="http://example.com/stockquote/service"
                xmlns:tns="http://example.com/stockquote/service"    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
                xmlns:defs="http://example.com/stockquote/definitions"    xmlns="http://schemas.xmlsoap.org/wsdl/">
                <import namespace="http://example.com/stockquote/definitions" location="http://example.com/stockquote/stockquote.wsdl"/>
                <binding name="StockQuoteSoapBinding" type="defs:StockQuotePortType">
                <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
                <operation name="GetLastTradePrice">
                <soap:operation soapAction="http://example.com/GetLastTradePrice"/>
                <input>
                <soap:body use="literal"/>
                </input>
                <output>
                <soap:body use="literal"/>
                </output>        </operation>    </binding>    <service name="StockQuoteService">        <documentation>My first service</documentation>
                <port name="StockQuotePort" binding="tns:StockQuoteBinding">            <soap:address location="http://example.com/stockquote"/>
                </port>    </service></definitions>"`
        },
            folderPath = SEPARATED_FILES + '/W3Example',
            expectedOutput = fs.readFileSync(folderPath + '/output.wsdl', 'utf8');
        let files = [],
            array = [
                { fileName: folderPath + '/stockquote.xsd' },
                { fileName: folderPath + '/stockquote.wsdl' },
                { fileName: folderPath + '/stockquoteservice.wsdl' }
            ];
        array.forEach((item) => {
            files.push({
                content: fs.readFileSync(item.fileName, 'utf8'),
                fileName: item.fileName
            });
        });
        let merged = merge(files, processedInput, new XMLParser());
        expect(removeLineBreakTabsSpaces(merged)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
    });

});



// it('Should create collection from folder having one root file for browser', function (done) {
//     let folderPath = path.join(SEPARATED_FILES, '/W3Example'),
//         files = [],
//         array = [
//             { fileName: folderPath + '/stockquote.xsd' },
//             { fileName: folderPath + '/stockquote.wsdl' },
//             { fileName: folderPath + '/stockquoteservice.wsdl' }
//         ];

//     array.forEach((item) => {
//         files.push({
//             content: fs.readFileSync(item.fileName, 'utf8'),
//             fileName: item.fileName
//         });
//     });

//     const schemaPack = new SchemaPack({ type: 'folder', data: files }, {});


//     schemaPack.mergeAndValidate((err, status) => {
//         if (err) {
//             expect.fail(null, null, err);
//         }
//         if (status.result) {
//             schema.convert((error, result) => {
//                 if (error) {
//                     expect.fail(null, null, err);
//                 }
//                 expect(result.result).to.equal(true);
//                 expect(result.output.length).to.equal(1);
//                 expect(result.output[0].type).to.have.equal('collection');
//                 expect(result.output[0].data).to.have.property('info');
//                 expect(result.output[0].data).to.have.property('item');
//                 done();
//             });
//         }
//         else {
//             expect.fail(null, null, status.reason);
//         }
//     });
// });
