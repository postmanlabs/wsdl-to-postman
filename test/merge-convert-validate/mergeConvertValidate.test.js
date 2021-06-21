const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  outputDirectory = 'test/convert-validation/output/',
  fs = require('fs'),
  getAllTransactionsFromCollection = require('../../lib/utils/getAllTransactions').getAllTransactionsFromCollection,
  SEPARATED_FILES = '../data/separatedFiles',
  path = require('path');

describe('merge and validate', function() {

  it('Merge convert validate counting', function() {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/counting'),
      files = [],
      array = [{
        fileName: folderPath + '/CountingCategoryData.xsd'
      },
      {
        fileName: folderPath + '/CountingCategoryService.wsdl'
      }
      ];

    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });

    const schemaPack = new SchemaPack({
      type: 'folder',
      data: files
    }, {});

    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, collectionResult) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(collectionResult.result).to.equal(true);
          expect(collectionResult.output.length).to.equal(1);
          expect(collectionResult.output[0].type).to.have.equal('collection');
          expect(collectionResult.output[0].data).to.have.property('info');
          expect(collectionResult.output[0].data).to.have.property('item');

          let historyRequests = [];
          getAllTransactionsFromCollection(collectionResult.output[0].data, historyRequests);

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
              fs.writeFileSync(outputDirectory + file + '-validationResult.json', JSON.stringify({
                erors: result
              }));
              fs.writeFileSync(outputDirectory + file + '-collection.json',
                JSON.stringify(collectionResult.output[0].data));
            }
          });
        });
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

});
