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
  url = {
    path: ['webservicesserver', 'NumberConversion.wso'],
    host: ['{{url_variable_0}}'],
    query: [],
    variable: []
  },
  header = [{
    key: 'Content-Type',
    value: 'text/xml; charset=utf-8'
  }],
  defMethod = 'POST',
  reqBody = [
    {
      mode: 'raw',
      raw: '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Header>' +
        '<wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<wsse:UsernameToken>' +
        '<wsse:Username>place username here</wsse:Username>' +
        '<wsse:Password Type=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
        'place password here</wsse:Password>' +
        '<wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>' +
        '<wsu:Created>2007-03-28T18:42:03Z</wsu:Created>' +
        '</wsse:UsernameToken>' +
        '</wsse:Security>' +
        '</soap:Header>' +
        '<soap:Body>' +
        '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<ubiNum>18446744073709</ubiNum>' +
        '</NumberToWords>' +
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
        '<soap:Header>' +
        '<wsse:Security soap:mustUnderstand="1" ' +
        'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<wsse:UsernameToken>' +
        '<wsse:Username>place username here</wsse:Username>' +
        '<wsse:Password Type=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
        'place password here</wsse:Password>' +
        '<wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>' +
        '<wsu:Created>2007-03-28T18:42:03Z</wsu:Created>' +
        '</wsse:UsernameToken>' +
        '</wsse:Security>' +
        '</soap:Header>' +
        '<soap:Body>' +
        '<NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<dNum>1</dNum>' +
        '</NumberToDollars>' +
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
        '<soap12:Header>' +
        '<wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<wsse:UsernameToken>' +
        '<wsse:Username>place username here</wsse:Username>' +
        '<wsse:Password Type=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
        'place password here</wsse:Password>' +
        '<wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>' +
        '<wsu:Created>2007-03-28T18:42:03Z</wsu:Created>' +
        '</wsse:UsernameToken>' +
        '</wsse:Security>' +
        '</soap12:Header>' +
        '<soap12:Body>' +
        '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<ubiNum>18446744073709</ubiNum>' +
        '</NumberToWords>' +
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
        '<soap12:Header>' +
        '<wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<wsse:UsernameToken>' +
        '<wsse:Username>place username here</wsse:Username>' +
        '<wsse:Password Type=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' +
        'place password here</wsse:Password>' +
        '<wsse:Nonce EncodingType="...#Base64Binary">place nonce here</wsse:Nonce>' +
        '<wsu:Created>2007-03-28T18:42:03Z</wsu:Created>' +
        '</wsse:UsernameToken>' +
        '</wsse:Security>' +
        '</soap12:Header>' +
        '<soap12:Body>' +
        '<NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<dNum>1</dNum>' +
        '</NumberToDollars>' +
        '</soap12:Body>' +
        '</soap12:Envelope>',
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
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Header>' +
        '<wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<wsse:Timestamp xmlns:wsu="http://schemas.xmlsoap.org/ws/2003/06/utility">' +
        '<wsu:Created>2007-03-28T18:42:03Z</wsu:Created>' +
        '</wsse:Timestamp>' +
        '</wsse:Security>' +
        '</soap:Header>' +
        '<soap:Body>' +
        '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<ubiNum>18446744073709</ubiNum>' +
        '</NumberToWords>' +
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
        '<soap:Header>' +
        '<wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<wsse:Timestamp xmlns:wsu="http://schemas.xmlsoap.org/ws/2003/06/utility">' +
        '<wsu:Created>2007-03-28T18:42:03Z</wsu:Created>' +
        '</wsse:Timestamp>' +
        '</wsse:Security>' +
        '</soap:Header>' +
        '<soap:Body>' +
        '<NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<dNum>1</dNum>' +
        '</NumberToDollars>' +
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
        '<soap12:Header>' +
        '<wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<wsse:Timestamp xmlns:wsu="http://schemas.xmlsoap.org/ws/2003/06/utility">' +
        '<wsu:Created>2007-03-28T18:42:03Z</wsu:Created>' +
        '</wsse:Timestamp>' +
        '</wsse:Security>' +
        '</soap12:Header>' +
        '<soap12:Body>' +
        '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<ubiNum>18446744073709</ubiNum>' +
        '</NumberToWords>' +
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
        '<soap12:Header>' +
        '<wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<wsse:Timestamp xmlns:wsu="http://schemas.xmlsoap.org/ws/2003/06/utility">' +
        '<wsu:Created>2007-03-28T18:42:03Z</wsu:Created>' +
        '</wsse:Timestamp>' +
        '</wsse:Security>' +
        '</soap12:Header>' +
        '<soap12:Body>' +
        '<NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<dNum>1</dNum>' +
        '</NumberToDollars>' +
        '</soap12:Body>' +
        '</soap12:Envelope>',
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
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Header>' +
        '<wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<saml2:Assertion ID="place id here" IssueInstant="place issue instant" Version="2.0">' +
        '<saml2:Issuer>www.opensaml.org</saml2:Issuer>' +
        '<saml2:Conditions NotBefore="place not before" NotOnOrAfter="place not on or after">' +
        '</saml2:Conditions>' +
        '<saml2:Subject>' +
        '<saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' +
        'joe,ou=people,ou=saml demo,o=example.com</saml2:NameID>' +
        '<saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">' +
        '</saml2:SubjectConfirmation>' +
        '</saml2:Subject>' +
        '</saml2:Assertion>' +
        '</wsse:Security>' +
        '</soap:Header>' +
        '<soap:Body>' +
        '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<ubiNum>18446744073709</ubiNum>' +
        '</NumberToWords>' +
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
        '<soap:Header>' +
        '<wsse:Security soap:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<saml2:Assertion ID="place id here" IssueInstant="place issue instant" Version="2.0">' +
        '<saml2:Issuer>www.opensaml.org</saml2:Issuer>' +
        '<saml2:Conditions NotBefore="place not before" NotOnOrAfter="place not on or after">' +
        '</saml2:Conditions>' +
        '<saml2:Subject>' +
        '<saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' +
        'joe,ou=people,ou=saml demo,o=example.com</saml2:NameID>' +
        '<saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">' +
        '</saml2:SubjectConfirmation>' +
        '</saml2:Subject>' +
        '</saml2:Assertion>' +
        '</wsse:Security>' +
        '</soap:Header>' +
        '<soap:Body>' +
        '<NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<dNum>1</dNum>' +
        '</NumberToDollars>' +
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
        '<soap12:Header>' +
        '<wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<saml2:Assertion ID="place id here" IssueInstant="place issue instant" Version="2.0">' +
        '<saml2:Issuer>www.opensaml.org</saml2:Issuer>' +
        '<saml2:Conditions NotBefore="place not before" NotOnOrAfter="place not on or after">' +
        '</saml2:Conditions>' +
        '<saml2:Subject>' +
        '<saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' +
        'joe,ou=people,ou=saml demo,o=example.com</saml2:NameID>' +
        '<saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">' +
        '</saml2:SubjectConfirmation>' +
        '</saml2:Subject>' +
        '</saml2:Assertion>' +
        '</wsse:Security>' +
        '</soap12:Header>' +
        '<soap12:Body>' +
        '<NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<ubiNum>18446744073709</ubiNum>' +
        '</NumberToWords>' +
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
        '<soap12:Header>' +
        '<wsse:Security soap12:mustUnderstand="1" xmlns:wsse=' +
        '"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
        '<saml2:Assertion ID="place id here" IssueInstant="place issue instant" Version="2.0">' +
        '<saml2:Issuer>www.opensaml.org</saml2:Issuer>' +
        '<saml2:Conditions NotBefore="place not before" NotOnOrAfter="place not on or after">' +
        '</saml2:Conditions>' +
        '<saml2:Subject>' +
        '<saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' +
        'joe,ou=people,ou=saml demo,o=example.com</saml2:NameID>' +
        '<saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">' +
        '</saml2:SubjectConfirmation>' +
        '</saml2:Subject>' +
        '</saml2:Assertion>' +
        '</wsse:Security>' +
        '</soap12:Header>' +
        '<soap12:Body>' +
        '<NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">' +
        '<dNum>1</dNum>' +
        '</NumberToDollars>' +
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
    '<NumberToWordsResponse xmlns="http://www.dataaccess.com/webservicesserver/">' +
    '<NumberToWordsResult>place your string value here</NumberToWordsResult>' +
    '</NumberToWordsResponse>' +
    '</soap:Body>' +
    '</soap:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
  '<soap:Body>' +
  '<NumberToDollarsResponse xmlns="http://www.dataaccess.com/webservicesserver/">' +
  '<NumberToDollarsResult>place your string value here</NumberToDollarsResult>' +
  '</NumberToDollarsResponse>' +
  '</soap:Body>' +
  '</soap:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
  '<soap12:Body>' +
  '<NumberToWordsResponse xmlns="http://www.dataaccess.com/webservicesserver/">' +
  '<NumberToWordsResult>place your string value here</NumberToWordsResult>' +
  '</NumberToWordsResponse>' +
  '</soap12:Body>' +
  '</soap12:Envelope>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
  '<soap12:Body>' +
  '<NumberToDollarsResponse xmlns="http://www.dataaccess.com/webservicesserver/">' +
  '<NumberToDollarsResult>place your string value here</NumberToDollarsResult>' +
  '</NumberToDollarsResponse>' +
  '</soap12:Body>' +
  '</soap12:Envelope>'
  ],
  urlOR = {
    protocol: 'https',
    path: ['webservicesserver', 'NumberConversion.wso'],
    host: ['www', 'dataaccess', 'com'],
    query: [],
    variable: []
  };

describe('Authentication tests', function () {
  var authFolder = fs.readdirSync(usernameTokenExamples);
  async.each(authFolder, function (file, cb) {
    it('Should deeply validate a WSDL11 file with UsernameToken ' + file, function () {
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
          else {
            return cb(null);
          }
        }
      );
    });
  });

});

describe('Authentication test for SSL', function () {
  it('Should test a convertion of WSDL11 file with SSL Transport Binding mechanism', function () {
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
            expect(conversionResult.output[0].data.item[i].request.body).to.be.eql(reqBodySSL[i]);
            // Expects for Response
            expect(conversionResult.output[0].data.item[i].response[0]).to.include
              .all.keys('name', 'originalRequest', 'status', 'code', 'header', 'body');
            expect(conversionResult.output[0].data.item[i].response[0].name).to.be.eql(namesArray[i] + ' response');
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest).to
              .include.all.keys('url', 'header', 'method', 'body');
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest.url).to.be.eql(urlOR);
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest.header).to.be.eql(header);
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest.method).to.be.eql(defMethod);
            expect(conversionResult.output[0].data.item[i].response[0].originalRequest.body).to.be.eql(reqBodySSL[i]);
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
    it('Should deeply validate a WSDL11 file with SAML11 Token ' + file, function () {
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
              expect(conversionResult.output[0].data.item[i].request.body).to.be.eql(reqBodySAML[i]);
              // Expects for Response
              expect(conversionResult.output[0].data.item[i].response[0]).to.include
                .all.keys('name', 'originalRequest', 'status', 'code', 'header', 'body');
              expect(conversionResult.output[0].data.item[i].response[0].name).to.be.eql(namesArray[i] + ' response');
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest).to
                .include.all.keys('url', 'header', 'method', 'body');
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.url).to.be.eql(urlOR);
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.header).to.be.eql(header);
              expect(conversionResult.output[0].data.item[i].response[0].originalRequest.method).to.be.eql(defMethod);
              expect(conversionResult.output[0].data.item[i].response[0]
                .originalRequest.body).to.be.eql(reqBodySAML[i]);
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
