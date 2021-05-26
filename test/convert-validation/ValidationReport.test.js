const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  outputDirectory = 'test/convert-validation/output/',
  fs = require('fs'),
  getAllTransactions = require('../../lib/utils/getAllTransactions').getAllTransactions,
  async = require('async');

describe('SchemaPack convert and validate report missmatches WSDL 1.1', function () {
  var validWSDLsFolder = fs.readdirSync(validWSDLs);
  if (fs.existsSync(outputDirectory)) {
    fs.rmdirSync(outputDirectory, { recursive: true });
  }
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }
  async.each(validWSDLsFolder, function (file) {
    it('Should counvert and validate all files ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      schemaPack.convert((error, collectionResult) => {
        expect(error).to.be.null;
        expect(collectionResult).to.be.an('object');
        expect(collectionResult.output).to.be.an('array');
        expect(collectionResult.output[0].data).to.be.an('object');
        expect(collectionResult.output[0].type).to.equal('collection');

        let historyRequests = [];
        getAllTransactions(collectionResult.output[0].data, historyRequests);

        // postman application should substitute variables
        historyRequests.forEach((historyRequest) => {
          historyRequest.request.url.host = collectionResult.output[0].data.variable[0].value;
        });

        schemaPack.validateTransaction(historyRequests, (error, result) => {
          if (error) {
            console.error(`Test Failed ${file}`);
            fs.writeFileSync(outputDirectory + file + '-validationResult.json', JSON.stringify(error));
            fs.writeFileSync(outputDirectory + file + '-collection.json',
              JSON.stringify(collectionResult.output[0].data));
          }
          if (!error && !result.matched) {
            console.error(`Test Failed ${file}`);
            fs.writeFileSync(outputDirectory + file + '-validationResult.json', JSON.stringify({ erors: result }));
            fs.writeFileSync(outputDirectory + file + '-collection.json',
              JSON.stringify(collectionResult.output[0].data));
          }
        });
      });
    });
  });
});
