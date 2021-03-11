const expect = require('chai').expect,
  fs = require('fs'),
  Index = require('../../index.js'),
  async = require('async'),
  validWSDLs = 'test/data/profixio';
  //validWSDLs = 'test/data/profixio/getActivityByType.wsdl';

describe('Test WSDL convertion into Postman Collection', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs);
  async.each(validWSDLsFolder, function (file, cb) {
    it('Should validate mandatory fields ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
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
            conversionResult.output[0].data.item.forEach((item) => {
              expect(item).to.include.all.keys('name', 'description', 'request', 'response');
              expect(item.request).to.include.all.keys('url', 'header', 'method', 'body');
              expect(item.response[0]).to.include.all.keys(
                'name', 'originalRequest', 'status', 'code', 'header', 'body'
              );
            });
            // fs.writeFileSync('collection.json', JSON.stringify(conversionResult.output[0].data));
          }
          else {
            return cb(null);
          }
        }
      );
    });
  });
});
