const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  validWSDLs_20 = 'test/data/validWSDLs20',
  outputDirectory = 'test/convert-validation/output/',
  fs = require('fs'),
  getAllTransactionsFromCollection = require('../../lib/utils/getAllTransactions').getAllTransactionsFromCollection,
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
    it('Should convert and validate all files ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, { });

      schemaPack.convert((error, collectionResult) => {
        expect(error).to.be.null;
        expect(collectionResult).to.be.an('object');
        expect(collectionResult.output).to.be.an('array');
        expect(collectionResult.output[0].data).to.be.an('object');
        expect(collectionResult.output[0].type).to.equal('collection');

        let historyRequests = [];
        getAllTransactionsFromCollection(collectionResult.output[0].data, historyRequests);

        // postman application should substitute variables
        historyRequests.forEach((historyRequest) => {
          let variable = collectionResult.output[0].data.variable[0];
          historyRequest.request.url.host = variable ? variable.value : historyRequest.request.url.host;
        });

        schemaPack.validateTransaction(historyRequests, (error, result) => {
          if (error) {
            console.error(`Test Failed ${file}`);
            fs.writeFileSync(outputDirectory + file + '-validationResult.json', error.message);
            fs.writeFileSync(outputDirectory + file + '-collection.json',
              JSON.stringify(collectionResult.output[0].data));
          }
          if ((!error && !result.matched) || result.missingEndpoints.length > 0) {
            console.error(`Test Failed ${file}`);
            let onlyErrors = [];

            Object.keys(result.requests).forEach((key) => {
              let endpoints = result.requests[key].endpoints,
                badEndpints = endpoints.filter((endpoint) => { return endpoint.matched === false; });
              if (badEndpints.length > 0) {
                onlyErrors.push(result.requests[key]);
              }
            });
            console.error(`Test Failed ${file} errors ${onlyErrors.length}`);
            fs.writeFileSync(outputDirectory + file + '-validationResult.json', JSON.stringify(
              { amount: onlyErrors.length, errors: result }));
            fs.writeFileSync(outputDirectory + file + '-validationResultErrors.json',
              JSON.stringify({ amount: onlyErrors.length, errors: onlyErrors }));
            fs.writeFileSync(outputDirectory + file + '-collection.json',
              JSON.stringify(collectionResult.output[0].data));
          }
        });
      });
    });
  });
});

describe('SchemaPack convert and validate report missmatches WSDL 2.0', function () {
  var validWSDLsFolder = fs.readdirSync(validWSDLs_20);
  if (fs.existsSync(outputDirectory)) {
    fs.rmdirSync(outputDirectory, { recursive: true });
  }
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }
  async.each(validWSDLsFolder, function (file) {
    it('Should convert and validate all files ' + file, function () {
      let fileContent = fs.readFileSync(validWSDLs_20 + '/' + file, 'utf8');
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
        getAllTransactionsFromCollection(collectionResult.output[0].data, historyRequests);

        // postman application should substitute variables
        historyRequests.forEach((historyRequest) => {
          historyRequest.request.url.host = collectionResult.output[0].data.variable[0].value;
        });
        schemaPack.validateTransaction(historyRequests, (error, result) => {
          if (error) {
            console.error(`Test Failed ${file}`);
            fs.writeFileSync(outputDirectory + file + '-validationResult.json', error.message);
            fs.writeFileSync(outputDirectory + file + '-collection.json',
              JSON.stringify(collectionResult.output[0].data));
          }
          if ((!error && !result.matched) || result.missingEndpoints.length > 0) {
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
