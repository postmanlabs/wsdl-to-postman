const expect = require('chai').expect,
  fs = require('fs'),
  Index = require('../../index.js'),
  v11_Path = 'test/data/simple11.wsdl',
  v20_Path = 'test/data/simple12.wsdl';

describe('Test convert function in SchemaPack', function() {
  it('Should take a wsdl file and convert it into a Postman Collection', function () {
    var fileContent = fs.readFileSync(v11_Path, 'utf8');
    //let result = Index.validate({ type: 'file', data: v11_Path });
    //expect(result.result).to.be.true;
    Index.convert({ type: 'string', data: fileContent }, {}, (err, conversionResult) => {
      if (!conversionResult.result) {
        console.log('Could not convert', conversionResult.reason);
      } else {
        expect(err).to.be.null;
        console.log(
          'The collection object is: ', conversionResult.output[0].data);
        //Send collection object to console just to check
        expect(conversionResult.output.length).to.equal(1);
        expect(conversionResult.output[0].type).to.equal('collection');
        expect(conversionResult.output[0].data).to.have.property('info');
        expect(conversionResult.output[0].data).to.have.property('item');
        expect(conversionResult.output[0].data).to.have.property('request');
      }
    });
/*
read calculator file
returns a postman collection object
Check collection.info.name matches to 'Definitions.Name/Filename/ definitions.targetnamespace'
Check collection.item.name matches to 'PortType.Operation.name'
REQUEST
Check default http method (POST) collection.item.item.request.method eql POST
Check collection.item.request.header.key matches to 'Content-Type'
Check collection.item.request.header.value matches to 'text/xml; charset=utf-8'
Check URL collection.item.request.url.ras matches to 'service.port.address'
Check Body collection.item.request.body matches to WSDL Body
RESPONSE
Check collection.item.response.name matches to 'PortType.Operation + Response'
Check with collection.item.response.originalRequest
    response fault
Check collection.item.response.header is an array
Check with Team, is this specified in the WSDL?
  Check Body collection.item.response.body matches to WSDL Body
*/
  });
});
