const expect = require('chai').expect,
  {
    convert
  } = require('../../index');

describe('Test convert function in SchemaPack', function() {
  it('Should take a wsdl file and convert it into a Postman Collection', function () {
/*read calculator file
returns a postman collection object
Check collection.info.name matches to 'Definitions.Name/Filename/ definitions.targetnamespace'
Check collection.item.name matches to 'service.name'
Check collection.item.item.name matches to 'PortType.Operation.name'
REQUEST
Check default http method (POST) collection.item.item.request.method eql POST
Check collection.item.item.request.header.key matches to 'Content-Type'
Check collection.item.item.request.header.value matches to 'text/xml; charset=utf-8'
Check URL collection.item.item.request.url.ras matches to 'service.port.address'
Check Body collection.item.item.request.body matches to WSDL Body
RESPONSE
Check collection.item.item.response.name matches to 'PortType.Operation + Response'
Check with Team about collection.item.item.response.originalRequest
Check collection.item.item.response.header is an array
Check with Team, is this specified in the WSDL?
  Check Body collection.item.item.response.body matches to WSDL Body
*/
  });
});
