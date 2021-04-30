const expect = require('chai').expect,
  fs = require('fs'),
  Index = require('../../index.js'),
  calculatorFile = 'test/data/validWSDLs11/calculator-soap11and12.wsdl',
  collName = 'http://tempuri.org/',
  namesArray = ['Add', 'Subtract', 'Multiply', 'Divide', 'Add', 'Subtract', 'Multiply', 'Divide'],
  descArray = ['Adds two integers. This is a test WebService. ©DNE Online', '', '', '',
    'Adds two integers. This is a test WebService. ©DNE Online', '', '', ''
  ],
  descType = 'text/plain',
  url = {
    path: ['calculator.asmx'],
    host: ['{{url_variable_0}}'],
    'query': [],
    'variable': []
  },
  header = [{
    key: 'Content-Type',
    value: 'text/xml; charset=utf-8'
  }],
  defMethod = 'POST',
  reqBody = [{
    mode: 'raw',
    raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<Add xmlns="http://tempuri.org/">' +
      '<intA>-2147483648</intA>' +
      '<intB>-2147483648</intB>' +
      '</Add>' +
      '</soap:Body>' +
      '</soap:Envelope>',
    options: {
      raw: {
        language: 'xml'
      }
    }
  },
  {
    mode: 'raw',
    raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<Subtract xmlns="http://tempuri.org/">' +
      '<intA>-2147483648</intA>' +
      '<intB>-2147483648</intB>' +
      '</Subtract>' +
      '</soap:Body>' +
      '</soap:Envelope>',
    options: {
      raw: {
        language: 'xml'
      }
    }
  },
  {
    mode: 'raw',
    raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<Multiply xmlns="http://tempuri.org/">' +
      '<intA>-2147483648</intA>' +
      '<intB>-2147483648</intB>' +
      '</Multiply>' +
      '</soap:Body>' +
      '</soap:Envelope>',
    options: {
      raw: {
        language: 'xml'
      }
    }
  },
  {
    mode: 'raw',
    raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<Divide xmlns="http://tempuri.org/">' +
      '<intA>-2147483648</intA>' +
      '<intB>-2147483648</intB>' +
      '</Divide>' +
      '</soap:Body>' +
      '</soap:Envelope>',
    options: {
      raw: {
        language: 'xml'
      }
    }
  },
  {
    mode: 'raw',
    raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
      '<soap12:Body>' +
      '<Add xmlns="http://tempuri.org/">' +
      '<intA>-2147483648</intA>' +
      '<intB>-2147483648</intB>' +
      '</Add>' +
      '</soap12:Body>' +
      '</soap12:Envelope>',
    options: {
      raw: {
        language: 'xml'
      }
    }
  },
  {
    mode: 'raw',
    raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
      '<soap12:Body>' +
      '<Subtract xmlns="http://tempuri.org/">' +
      '<intA>-2147483648</intA>' +
      '<intB>-2147483648</intB>' +
      '</Subtract>' +
      '</soap12:Body>' +
      '</soap12:Envelope>',
    options: {
      raw: {
        language: 'xml'
      }
    }
  },
  {
    mode: 'raw',
    raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
      '<soap12:Body>' +
      '<Multiply xmlns="http://tempuri.org/">' +
      '<intA>-2147483648</intA>' +
      '<intB>-2147483648</intB>' +
      '</Multiply>' +
      '</soap12:Body>' +
      '</soap12:Envelope>',
    options: {
      raw: {
        language: 'xml'
      }
    }
  },
  {
    mode: 'raw',
    raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
      '<soap12:Body>' +
      '<Divide xmlns="http://tempuri.org/">' +
      '<intA>-2147483648</intA>' +
      '<intB>-2147483648</intB>' +
      '</Divide>' +
      '</soap12:Body>' +
      '</soap12:Envelope>',
    options: {
      raw: {
        language: 'xml'
      }
    }
  }
  ],
  status = 'OK',
  code = 200,
  resBody = ['<?xml version="1.0" encoding="utf-8"?>\n' +
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Body>' +
    '<AddResponse xmlns="http://tempuri.org/">' +
    '<AddResult>-2147483648</AddResult>' +
    '</AddResponse>' +
    '</soap:Body>' +
    '</soap:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
  '<soap:Body>' +
  '<SubtractResponse xmlns="http://tempuri.org/">' +
  '<SubtractResult>-2147483648</SubtractResult>' +
  '</SubtractResponse>' +
  '</soap:Body>' +
  '</soap:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
  '<soap:Body>' +
  '<MultiplyResponse xmlns="http://tempuri.org/">' +
  '<MultiplyResult>-2147483648</MultiplyResult>' +
  '</MultiplyResponse>' +
  '</soap:Body>' +
  '</soap:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
  '<soap:Body>' +
  '<DivideResponse xmlns="http://tempuri.org/">' +
  '<DivideResult>-2147483648</DivideResult>' +
  '</DivideResponse>' +
  '</soap:Body>' +
  '</soap:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
  '<soap12:Body>' +
  '<AddResponse xmlns="http://tempuri.org/">' +
  '<AddResult>-2147483648</AddResult>' +
  '</AddResponse>' +
  '</soap12:Body>' +
  '</soap12:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
  '<soap12:Body>' +
  '<SubtractResponse xmlns="http://tempuri.org/">' +
  '<SubtractResult>-2147483648</SubtractResult>' +
  '</SubtractResponse>' +
  '</soap12:Body>' +
  '</soap12:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
  '<soap12:Body>' +
  '<MultiplyResponse xmlns="http://tempuri.org/">' +
  '<MultiplyResult>-2147483648</MultiplyResult>' +
  '</MultiplyResponse>' +
  '</soap12:Body>' +
  '</soap12:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
  '<soap12:Body>' +
  '<DivideResponse xmlns="http://tempuri.org/">' +
  '<DivideResult>-2147483648</DivideResult>' +
  '</DivideResponse>' +
  '</soap12:Body>' +
  '</soap12:Envelope>'
  ],
  urlOR = {
    protocol: 'http',
    path: ['calculator.asmx'],
    host: ['www', 'dneonline', 'com'],
    query: [],
    variable: []
  };

describe('Sanity tests', function () {
  it('Should deeply validate a WSDL 11 file (calculatorFile.wsdl)', function () {
    let fileContent = fs.readFileSync(calculatorFile, 'utf8');
    Index.convert({
      type: 'string',
      data: fileContent
    }, {
      folderStrategy: 'No folders'
    },
    (err, conversionResult) => {
      expect(err).to.be.null;
      expect(conversionResult.result).to.equal(true);
      expect(conversionResult.output[0].type).to.equal('collection');
      expect(conversionResult.output[0].data).to.have.property('info');
      expect(conversionResult.output[0].data).to.have.property('item');
      expect(conversionResult.output[0].data.info.name).to.be.eql(collName);
      for (i = 0; i < conversionResult.output[0].data.item.length; i++) {
        expect(conversionResult.output[0].data.item[i]).to.include
          .all.keys('name', 'description', 'request', 'response');
        expect(conversionResult.output[0].data.item[i].name).to.be.eql(namesArray[i]);
        expect(conversionResult.output[0].data.item[i].description.content).to.be.eql(descArray[i]);
        expect(conversionResult.output[0].data.item[i].description.type).to.be.eql(descType);
        // Expects for Request
        expect(conversionResult.output[0].data.item[i].request)
          .to.include.all.keys('url', 'header', 'method', 'body');
        expect(conversionResult.output[0].data.item[i].request.url).to.be.eql(url);
        expect(conversionResult.output[0].data.item[i].request.header).to.be.eql(header);
        expect(conversionResult.output[0].data.item[i].request.method).to.be.eql(defMethod);
        expect(conversionResult.output[0].data.item[i].request.body).to.be.eql(reqBody[i]);
        // Expects for Response
        expect(conversionResult.output[0].data.item[i].response[0]).to.include
          .all.keys('name', 'originalRequest', 'status', 'code', 'header', 'body');
        expect(conversionResult.output[0].data.item[i].response[0].name).to.be.eql(namesArray[i] + ' response');
        expect(conversionResult.output[0].data.item[i].response[0].originalRequest).to
          .include.all.keys('url', 'header', 'method', 'body');
        expect(conversionResult.output[0].data.item[i].response[0].originalRequest.url).to.be.eql(urlOR);
        expect(conversionResult.output[0].data.item[i].response[0].originalRequest.header).to.be.eql(header);
        expect(conversionResult.output[0].data.item[i].response[0].originalRequest.method).to.be.eql(defMethod);
        expect(conversionResult.output[0].data.item[i].response[0].originalRequest.body).to.be.eql(reqBody[i]);
        expect(conversionResult.output[0].data.item[i].response[0].status).to.be.eql(status);
        expect(conversionResult.output[0].data.item[i].response[0].code).to.be.eql(code);
        expect(conversionResult.output[0].data.item[i].response[0].header).to.be.eql(header);
        expect(conversionResult.output[0].data.item[i].response[0].body).to.be.eql(resBody[i]);
      }
    }
    );
  });
});
