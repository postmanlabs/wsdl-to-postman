const expect = require('chai').expect,
  fs = require('fs'),
  Index = require('../../index.js'),
  async = require('async'),
  usernameTokenExamples = 'test/data/auth/usernameToken',
  SAMLTokenExamples = 'test/data/auth/SAMLToken',
  sslExmaple = 'test/data/validWSDLs11/usernameTokenSSL.wsdl',
  collName = 'http://www.dataaccess.com/webservicesserver/',
  namesArray = ['NumberToWords', 'NumberToDollars', 'NumberToWords', 'NumberToDollars'],
  descArray = ['Returns the word corresponding to the positive number passed as parameter. Limited to quadrillions.',
    'Returns the non-zero dollar amount of the passed number.',
    'Returns the word corresponding to the positive number passed as parameter. Limited to quadrillions.',
    'Returns the non-zero dollar amount of the passed number.'
  ],
  descType = 'text/plain',
  urls = [
    {
      path: ['webservicesserver', 'NumberConversion.wso'],
      host: ['{{NumberToWordsSoapBaseUrl}}'],
      query: [],
      variable: []
    },
    {
      path: ['webservicesserver', 'NumberConversion.wso'],
      host: ['{{NumberToDollarsSoapBaseUrl}}'],
      query: [],
      variable: []
    },
    {
      path: ['webservicesserver', 'NumberConversion.wso'],
      host: ['{{NumberToWordsSoap12BaseUrl}}'],
      query: [],
      variable: []
    },
    {
      path: ['webservicesserver', 'NumberConversion.wso'],
      host: ['{{NumberToDollarsSoap12BaseUrl}}'],
      query: [],
      variable: []
    }
  ],
  header = [{
    key: 'Content-Type',
    value: 'text/xml; charset=utf-8'
  }],
  defMethod = 'POST',
  reqBody = [
    {
      mode: 'raw',
      raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
        '  <soap:Header>\n' +
        '    <wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <wsse:UsernameToken>\n' +
        '        <wsse:Username>place username here</wsse:Username>\n' +
        '        <wsse:Password Type=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
        'place password here</wsse:Password>\n' +
        '        <wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>\n' +
        '        <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>\n' +
        '      </wsse:UsernameToken>\n' +
        '    </wsse:Security>\n' +
        '  </soap:Header>\n' +
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
        '  <soap:Header>\n' +
        '    <wsse:Security soap:mustUnderstand="1" ' +
        'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <wsse:UsernameToken>\n' +
        '        <wsse:Username>place username here</wsse:Username>\n' +
        '        <wsse:Password Type=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
        'place password here</wsse:Password>\n' +
        '        <wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>\n' +
        '        <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>\n' +
        '      </wsse:UsernameToken>\n' +
        '    </wsse:Security>\n' +
        '  </soap:Header>\n' +
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
        '  <soap12:Header>\n' +
        '    <wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <wsse:UsernameToken>\n' +
        '        <wsse:Username>place username here</wsse:Username>\n' +
        '        <wsse:Password Type=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
        'place password here</wsse:Password>\n' +
        '        <wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>\n' +
        '        <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>\n' +
        '      </wsse:UsernameToken>\n' +
        '    </wsse:Security>\n' +
        '  </soap12:Header>\n' +
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
        '  <soap12:Header>\n' +
        '    <wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <wsse:UsernameToken>\n' +
        '        <wsse:Username>place username here</wsse:Username>\n' +
        '        <wsse:Password Type=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
        'place password here</wsse:Password>\n' +
        '        <wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>\n' +
        '        <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>\n' +
        '      </wsse:UsernameToken>\n' +
        '    </wsse:Security>\n' +
        '  </soap12:Header>\n' +
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
  reqBodySSL = [
    {
      mode: 'raw',
      raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
        '  <soap:Header>\n' +
        '    <wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <wsse:Timestamp xmlns:wsu="http://schemas.xmlsoap.org/ws/2003/06/utility">\n' +
        '        <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>\n' +
        '      </wsse:Timestamp>\n' +
        '    </wsse:Security>\n' +
        '  </soap:Header>\n' +
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
        '  <soap:Header>\n' +
        '    <wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <wsse:Timestamp xmlns:wsu="http://schemas.xmlsoap.org/ws/2003/06/utility">\n' +
        '        <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>\n' +
        '      </wsse:Timestamp>\n' +
        '    </wsse:Security>\n' +
        '  </soap:Header>\n' +
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
        '  <soap12:Header>\n' +
        '    <wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <wsse:Timestamp xmlns:wsu="http://schemas.xmlsoap.org/ws/2003/06/utility">\n' +
        '        <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>\n' +
        '      </wsse:Timestamp>\n' +
        '    </wsse:Security>\n' +
        '  </soap12:Header>\n' +
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
        '  <soap12:Header>\n' +
        '    <wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <wsse:Timestamp xmlns:wsu="http://schemas.xmlsoap.org/ws/2003/06/utility">\n' +
        '        <wsu:Created>2007-03-28T18:42:03Z</wsu:Created>\n' +
        '      </wsse:Timestamp>\n' +
        '    </wsse:Security>\n' +
        '  </soap12:Header>\n' +
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
  reqBodySAML = [
    {
      mode: 'raw',
      raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
        '  <soap:Header>\n' +
        '    <wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <saml2:Assertion ID="place id here" IssueInstant="place issue instant" Version="2.0">\n' +
        '        <saml2:Issuer>www.opensaml.org</saml2:Issuer>\n' +
        '        <saml2:Conditions NotBefore="place not before" NotOnOrAfter="place not on or after"/>\n' +
        '        <saml2:Subject>\n' +
        '          <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' +
        'joe,ou=people,ou=saml demo,o=example.com</saml2:NameID>\n' +
        '          <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"/>\n' +
        '        </saml2:Subject>\n' +
        '      </saml2:Assertion>\n' +
        '    </wsse:Security>\n' +
        '  </soap:Header>\n' +
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
        '  <soap:Header>\n' +
        '    <wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <saml2:Assertion ID="place id here" IssueInstant="place issue instant" Version="2.0">\n' +
        '        <saml2:Issuer>www.opensaml.org</saml2:Issuer>\n' +
        '        <saml2:Conditions NotBefore="place not before" NotOnOrAfter="place not on or after"/>\n' +
        '        <saml2:Subject>\n' +
        '          <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' +
        'joe,ou=people,ou=saml demo,o=example.com</saml2:NameID>\n' +
        '          <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"/>\n' +
        '        </saml2:Subject>\n' +
        '      </saml2:Assertion>\n' +
        '    </wsse:Security>\n' +
        '  </soap:Header>\n' +
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
        '  <soap12:Header>\n' +
        '    <wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <saml2:Assertion ID="place id here" IssueInstant="place issue instant" Version="2.0">\n' +
        '        <saml2:Issuer>www.opensaml.org</saml2:Issuer>\n' +
        '        <saml2:Conditions NotBefore="place not before" NotOnOrAfter="place not on or after"/>\n' +
        '        <saml2:Subject>\n' +
        '          <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' +
        'joe,ou=people,ou=saml demo,o=example.com</saml2:NameID>\n' +
        '          <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"/>\n' +
        '        </saml2:Subject>\n' +
        '      </saml2:Assertion>\n' +
        '    </wsse:Security>\n' +
        '  </soap12:Header>\n' +
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
        '  <soap12:Header>\n' +
        '    <wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\n' +
        '      <saml2:Assertion ID="place id here" IssueInstant="place issue instant" Version="2.0">\n' +
        '        <saml2:Issuer>www.opensaml.org</saml2:Issuer>\n' +
        '        <saml2:Conditions NotBefore="place not before" NotOnOrAfter="place not on or after"/>\n' +
        '        <saml2:Subject>\n' +
        '          <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' +
        'joe,ou=people,ou=saml demo,o=example.com</saml2:NameID>\n' +
        '          <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"/>\n' +
        '        </saml2:Subject>\n' +
        '      </saml2:Assertion>\n' +
        '    </wsse:Security>\n' +
        '  </soap12:Header>\n' +
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
    '      <NumberToWordsResult>string</NumberToWordsResult>\n' +
    '    </NumberToWordsResponse>\n' +
    '  </soap:Body>\n' +
    '</soap:Envelope>\n',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n' +
  '  <soap:Body>\n' +
  '    <NumberToDollarsResponse xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
  '      <NumberToDollarsResult>string</NumberToDollarsResult>\n' +
  '    </NumberToDollarsResponse>\n' +
  '  </soap:Body>\n' +
  '</soap:Envelope>\n',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n' +
  '  <soap12:Body>\n' +
  '    <NumberToWordsResponse xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
  '      <NumberToWordsResult>string</NumberToWordsResult>\n' +
  '    </NumberToWordsResponse>\n' +
  '  </soap12:Body>\n' +
  '</soap12:Envelope>\n',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n' +
  '  <soap12:Body>\n' +
  '    <NumberToDollarsResponse xmlns="http://www.dataaccess.com/webservicesserver/">\n' +
  '      <NumberToDollarsResult>string</NumberToDollarsResult>\n' +
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

/**
 * Replace the tag with random number to the expected one
 * @param {string} bodyMessage the element for getting and example
 * @returns {string} sanitized random value
 */
function fixBodyMessage(bodyMessage) {
  return bodyMessage.replace(/<ubiNum>(.*?)<\/ubiNum>/g, '<ubiNum>18446744073709</ubiNum>')
    .replace(/<dNum>(.*?)<\/dNum>/g, '<dNum>1</dNum>');
}

describe('Test the convertion of valid WSDL files with authetication mechanisms', function () {
  var authFolder = fs.readdirSync(usernameTokenExamples);
  async.each(authFolder, function (file, cb) {
    it('Should validate the convertion of a file with ' + file, function () {
      let fileContent = fs.readFileSync(usernameTokenExamples + '/' + file, 'utf8');
      Index.convert(
        { type: 'string', data: fileContent },
        { folderStrategy: 'No folders' },
        (err, conversionResult) => {
          expect(err).to.be.null;
          expect(conversionResult.result).to.equal(true);
          if (conversionResult.result) {
            expect(conversionResult.output[0].type).to.equal('collection');
            expect(conversionResult.output[0].data).to.have.property('info');
            expect(conversionResult.output[0].data).to.have.property('item');
            expect(conversionResult.output[0].data.info.name).to.be.eql(collName);
            for (i = 0; i < conversionResult.output[0].data.item.length; i++) {
              expect(conversionResult.output[0].data.item[i]).to.include
                .all.keys('name', 'request', 'response');
              expect(conversionResult.output[0].data.item[i].name).to.be.eql(namesArray[i]);
              // Expects for Request
              expect(conversionResult.output[0].data.item[i].request)
                .to.include.all.keys('url', 'header', 'method', 'body', 'description');
              expect(conversionResult.output[0].data.item[i].request.url).to.be.eql(urls[i]);
              expect(conversionResult.output[0].data.item[i].request.header).to.be.eql(header);
              expect(conversionResult.output[0].data.item[i].request.method).to.be.eql(defMethod);
              let fixedBody = fixBodyMessage(conversionResult.output[0].data.item[i].request.body.raw);
              expect(fixedBody).to.be.eql(reqBody[i].raw);
              expect(conversionResult.output[0].data.item[i].request.description.content).to.be.eql(descArray[i]);
              expect(conversionResult.output[0].data.item[i].request.description.type).to.be.eql(descType);
              // Expects for Response
              expect(conversionResult.output[0].data.item[i].response[0]).to.include
                .all.keys('name', 'originalRequest', 'status', 'code', 'header', 'body');
              expect(conversionResult.output[0].data.item[i].response[0].name).to.be.eql(namesArray[i] + ' response');
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest).to
                .include.all.keys('url', 'header', 'method', 'body');
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.url).to.be.eql(urlOR);
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.header).to.be.eql(header);
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.method).to.be.eql(defMethod);
              fixedBody = fixBodyMessage(conversionResult.output[0].data.item[i].response[0].originalRequest.body.raw);
              expect(fixedBody).to.be.eql(reqBody[i].raw);
              expect(conversionResult.output[0].data.item[i].response[0].status).to.be.eql(status);
              expect(conversionResult.output[0].data.item[i].response[0].code).to.be.eql(code);
              expect(conversionResult.output[0].data.item[i].response[0].header).to.be.eql(header);
              expect(conversionResult.output[0].data.item[i].response[0].body).to.be.eql(resBody[i]);
            }
          }
          else {
            return cb(null);
          }
        }
      );
    });
  });

  it('Should validate the convertion of a file with SSL Transport Binding mechanism', function () {
    let fileContent = fs.readFileSync(sslExmaple, 'utf8');
    Index.convert(
      { type: 'string', data: fileContent },
      { folderStrategy: 'No folders' },
      (err, conversionResult) => {
        expect(err).to.be.null;
        expect(conversionResult.result).to.equal(true);
        if (conversionResult.result) {
          expect(conversionResult.output[0].type).to.equal('collection');
          expect(conversionResult.output[0].data).to.have.property('info');
          expect(conversionResult.output[0].data).to.have.property('item');
          expect(conversionResult.output[0].data.info.name).to.be.eql(collName);
          for (i = 0; i < conversionResult.output[0].data.item.length; i++) {
            expect(conversionResult.output[0].data.item[i]).to.include
              .all.keys('name', 'request', 'response');
            expect(conversionResult.output[0].data.item[i].name).to.be.eql(namesArray[i]);
            // Expects for Request
            expect(conversionResult.output[0].data.item[i].request)
              .to.include.all.keys('url', 'header', 'method', 'body', 'description');
            expect(conversionResult.output[0].data.item[i].request.url).to.be.eql(urls[i]);
            expect(conversionResult.output[0].data.item[i].request.header).to.be.eql(header);
            expect(conversionResult.output[0].data.item[i].request.method).to.be.eql(defMethod);

            let fixedBody = fixBodyMessage(conversionResult.output[0].data.item[i].request.body.raw);

            expect(fixedBody).to.be.eql(reqBodySSL[i].raw);
            expect(conversionResult.output[0].data.item[i].request.description.content).to.be.eql(descArray[i]);
            expect(conversionResult.output[0].data.item[i].request.description.type).to.be.eql(descType);
            // Expects for Response
            expect(conversionResult.output[0].data.item[i].response[0]).to.include
              .all.keys('name', 'originalRequest', 'status', 'code', 'header', 'body');
            expect(conversionResult.output[0].data.item[i].response[0].name).to.be.eql(namesArray[i] + ' response');
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest).to
              .include.all.keys('url', 'header', 'method', 'body');
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest.url).to.be.eql(urlOR);
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest.header).to.be.eql(header);
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest.method).to.be.eql(defMethod);

            fixedBody = fixBodyMessage(conversionResult.output[0].data.item[i].response[0].originalRequest.body.raw);
            expect(fixedBody).to.be.eql(reqBodySSL[i].raw);
            expect(conversionResult.output[0].data.item[i].response[0].status).to.be.eql(status);
            expect(conversionResult.output[0].data.item[i].response[0].code).to.be.eql(code);
            expect(conversionResult.output[0].data.item[i].response[0].header).to.be.eql(header);
            expect(conversionResult.output[0].data.item[i].response[0].body).to.be.eql(resBody[i]);
          }
        }
        else {
          return cb(null);
        }
      }
    );
  });
});

describe('Authenticacion with SAML11 Token', function () {
  var authFolder = fs.readdirSync(SAMLTokenExamples);
  async.each(authFolder, function (file, cb) {
    it('Should validate the convertion of a file with SAML11 Token ' + file, function () {
      let fileContent = fs.readFileSync(SAMLTokenExamples + '/' + file, 'utf8');
      Index.convert(
        { type: 'string', data: fileContent },
        { folderStrategy: 'No folders' },
        (err, conversionResult) => {
          expect(err).to.be.null;
          expect(conversionResult.result).to.equal(true);
          if (conversionResult.result) {
            expect(conversionResult.output[0].type).to.equal('collection');
            expect(conversionResult.output[0].data).to.have.property('info');
            expect(conversionResult.output[0].data).to.have.property('item');
            expect(conversionResult.output[0].data.info.name).to.be.eql(collName);
            for (i = 0; i < conversionResult.output[0].data.item.length; i++) {
              expect(conversionResult.output[0].data.item[i]).to.include
                .all.keys('name', 'request', 'response');
              expect(conversionResult.output[0].data.item[i].name).to.be.eql(namesArray[i]);
              // Expects for Request
              expect(conversionResult.output[0].data.item[i].request)
                .to.include.all.keys('url', 'header', 'method', 'body', 'description');
              expect(conversionResult.output[0].data.item[i].request.url).to.be.eql(urls[i]);
              expect(conversionResult.output[0].data.item[i].request.header).to.be.eql(header);
              expect(conversionResult.output[0].data.item[i].request.method).to.be.eql(defMethod);
              let fixedBody = fixBodyMessage(conversionResult.output[0].data.item[i].request.body.raw);
              expect(fixedBody).to.be.eql(reqBodySAML[i].raw);
              expect(conversionResult.output[0].data.item[i].request.description.content).to.be.eql(descArray[i]);
              expect(conversionResult.output[0].data.item[i].request.description.type).to.be.eql(descType);
              // Expects for Response
              expect(conversionResult.output[0].data.item[i].response[0]).to.include
                .all.keys('name', 'originalRequest', 'status', 'code', 'header', 'body');
              expect(conversionResult.output[0].data.item[i].response[0].name).to.be.eql(namesArray[i] + ' response');
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest).to
                .include.all.keys('url', 'header', 'method', 'body');
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.url).to.be.eql(urlOR);
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.header).to.be.eql(header);
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.method).to.be.eql(defMethod);

              fixedBody = fixBodyMessage(conversionResult.output[0].data.item[i].response[0]
                .originalRequest.body.raw);
              expect(fixedBody).to.be.eql(reqBodySAML[i].raw);
              expect(conversionResult.output[0].data.item[i].response[0].status).to.be.eql(status);
              expect(conversionResult.output[0].data.item[i].response[0].code).to.be.eql(code);
              expect(conversionResult.output[0].data.item[i].response[0].header).to.be.eql(header);
              expect(conversionResult.output[0].data.item[i].response[0].body).to.be.eql(resBody[i]);
            }
          }
          else {
            return cb(null);
          }
        }
      );
    });
  });
});
