const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  fs = require('fs'),
  getAllTransactionsFromCollection = require('../../lib/utils/getAllTransactions').getAllTransactionsFromCollection,
  async = require('async');

/**
 * Process previous happy path scenario
 * @param {*} historyRequests postman requests
 * @param {*} result the validation result
 * @returns {boolean} true or false
 */
function prevCalcHP(historyRequests) {
  return historyRequests;
}

/**
 * Process post happy path scenario
 * @param {*} error a posible error
 * @param {*} result the validation result
 * @returns {boolean} true or false
 */
function postCalcHP(error, result) {
  expect(error).to.be.null;
  expect(result.matched).to.equal(true);
}

/**
 * Process previous happy path scenario
 * @param {*} historyRequests postman requests
 * @param {*} result the validation result
 * @returns {boolean} true or false
 */
function prevCalcWrongDataType(historyRequests) {
  let invalidType = '<?xml version="1.0" encoding="utf-8"?>' +
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
  '<soap:Body> <Add xmlns="http://tempuri.org/"><wrongType>100</wrongType>' +
  '<intB>100</intB></Add></soap:Body></soap:Envelope>';
  historyRequests[0].request.body.raw = invalidType;
  return historyRequests[0].id;
}

/**
 * Process post happy path scenario
 * @param {*} error a posible error
 * @param {*} result the validation result
 * @param {*} dataFromPrev extra data from previous process
 * @returns {boolean} true or false
 */
function postCalclWrongDataType(error, result, dataFromPrev) {
  expect(error).to.be.null;
  expect(result.matched).to.equal(false);
  expect(result.requests[dataFromPrev].endpoints[0].matched).to.equal(false);
  const mismatch = result.requests[dataFromPrev].endpoints[0].mismatches[0];
  expect(mismatch.property)
    .to.equal('BODY');
  expect(mismatch.reasonCode)
    .to.equal('INVALID_BODY');
}

let scenarios = [
  { file: 'calculator-soap11and12.wsdl', name: 'happy path', previousProcess: prevCalcHP, postAsserts: postCalcHP },
  { file: 'calculator-soap11and12.wsdl', name: 'wrong data type', previousProcess: prevCalcWrongDataType,
    postAsserts: postCalclWrongDataType }
];

describe('SchemaPack convert and validate different scenarios with mismatches', function () {
  async.each(scenarios, function (scenario) {
    it(`Should convert and validate ${scenario.file} ${scenario.name}`, function () {
      let fileContent = fs.readFileSync(validWSDLs + '/' + scenario.file, 'utf8'),
        dataFromPrev;
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
        dataFromPrev = scenario.previousProcess(historyRequests);
        schemaPack.validateTransaction(historyRequests, (error, result) => {
          scenario.postAsserts(error, result, dataFromPrev);
        });
      });
    });
  });
});
