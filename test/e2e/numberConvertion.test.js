const expect = require('chai').expect,
  fs = require('fs'),
  Index = require('../../index.js'),
  numberConvertion = 'test/data/validWSDLs11/numberConvertion.wsdl',
  collName = 'Find the way to get the name of the collection.',
  namesArray = ['NumberToWords', 'NumberToDollars', 'NumberToWords', 'NumberToDollars'],
  descArray = ['Returns the word corresponding to the positive number passed as parameter. Limited to quadrillions.',
    'Returns the non-zero dollar amount of the passed number.',
    'Returns the word corresponding to the positive number passed as parameter. Limited to quadrillions.',
    'Returns the non-zero dollar amount of the passed number.'
  ],
  descType = 'text/plain',
  url = {
    path: ['NumberConversion.wso'],
    host: ['{{url_variable_0}}webservicesserver'],
    query: [],
    variable: []
  },
  header = [{
    key: 'Content-Type',
    value: 'text/xml; charset=utf-8'
  }],
  defMethod = 'POST',
  reqBody = [{
      mode: 'raw',
      raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
        '  <soap:Body>\n' +
        '    <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
        '      <ubiNum>18446744073709</ubiNum>\n' +
        '    </NumberToWords>\n' +
        '  </soap:Body>\n' +
        '</soap:Envelope>\n',
      options: {
        raw: {
          language: 'xml'
        }
      }
    },
    {
      mode: 'raw',
      raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
        '  <soap:Body>\n' +
        '    <NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
        '      <dNum>1</dNum>\n' +
        '    </NumberToDollars>\n' +
        '  </soap:Body>\n' +
        '</soap:Envelope>\n',
      options: {
        raw: {
          language: 'xml'
        }
      }
    },
    {
      mode: 'raw',
      raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n' +
        '  <soap12:Body>\n' +
        '    <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
        '      <ubiNum>18446744073709</ubiNum>\n' +
        '    </NumberToWords>\n' +
        '  </soap12:Body>\n' +
        '</soap12:Envelope>\n',
      options: {
        raw: {
          language: 'xml'
        }
      }
    },
    {
      mode: 'raw',
      raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n' +
        '  <soap12:Body>\n' +
        '    <NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
        '      <dNum>1</dNum>\n' +
        '    </NumberToDollars>\n' +
        '  </soap12:Body>\n' +
        '</soap12:Envelope>\n',
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
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
    '  <soap:Body>\n' +
    '    <NumberToWordsResponse xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
    '      <NumberToWordsResult>this is a string</NumberToWordsResult>\n' +
    '    </NumberToWordsResponse>\n' +
    '  </soap:Body>\n' +
    '</soap:Envelope>\n',
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
    '  <soap:Body>\n' +
    '    <NumberToDollarsResponse xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
    '      <NumberToDollarsResult>this is a string</NumberToDollarsResult>\n' +
    '    </NumberToDollarsResponse>\n' +
    '  </soap:Body>\n' +
    '</soap:Envelope>\n',
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n' +
    '  <soap12:Body>\n' +
    '    <NumberToWordsResponse xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
    '      <NumberToWordsResult>this is a string</NumberToWordsResult>\n' +
    '    </NumberToWordsResponse>\n' +
    '  </soap12:Body>\n' +
    '</soap12:Envelope>\n',
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n' +
    '  <soap12:Body>\n' +
    '    <NumberToDollarsResponse xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
    '      <NumberToDollarsResult>this is a string</NumberToDollarsResult>\n' +
    '    </NumberToDollarsResponse>\n' +
    '  </soap12:Body>\n' +
    '</soap12:Envelope>\n'
  ],
  urlOR = {
    protocol: 'https',
    path: ['webservicesserver', 'NumberConversion.wso'],
    host: ['www', 'dataaccess', 'com'],
    query: [],
    variable: []
  };

describe('Sanity tests', function() {
  it('Should deeply validate a WSDL 11 file (numberConvertion.wsdl)', function() {
    let fileContent = fs.readFileSync(numberConvertion, 'utf8');
    Index.convert({
      type: 'string',
      data: fileContent
    }, {}, (err, conversionResult) => {
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
        expect(conversionResult.output[0].data.item[i].request).to.include.all.keys('url', 'header', 'method', 'body');
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
    });
  });
});
