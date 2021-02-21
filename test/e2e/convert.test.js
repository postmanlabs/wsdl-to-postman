const expect = require('chai').expect,
  fs = require('fs'),
  Index = require('../../index.js'),
  async = require('async'),
  validWSDLs = 'test/data/validWSDLs';

describe('Test convert function in SchemaPack', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs);
  async.each(validWSDLsFolder, function (file, cb) {
    it('Should take a wsdl file and convert it into a Postman Collection ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
      Index.convert({ type: 'string', data: fileContent }, {}, (err, conversionResult) => {
        expect(err).to.be.null;
        expect(conversionResult.result).to.equal(true);
        if (conversionResult.result){
          expect(conversionResult.output[0].type).to.equal('collection');
          expect(conversionResult.output[0].data).to.have.property('info');
          expect(conversionResult.output[0].data).to.have.property('item');
        } 
        else {
          return cb(null);
        }
      });
    });
  });
});
