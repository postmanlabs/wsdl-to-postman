const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  validWSDLs20 = 'test/data/validWSDLs20',
  fs = require('fs'),
  async = require('async');

describe('SchemaPack convert unit test WSDL 1.1', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs);
  async.each(validWSDLsFolder, function(file) {
    it('Should get an object representing PM Collection from ' + file, function() {
      let fileContent = fs.readFileSync(validWSDLs + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      schemaPack.convert((error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
        expect(result.output[0].data).to.be.an('object');
      });
    });
  });
});


describe('SchemaPack convert unit test WSDL 2.0', function() {
  var validWSDLsFolder = fs.readdirSync(validWSDLs20);
  async.each(validWSDLsFolder, function(file) {
    it('Should get an object representing PM Collection from ' + file, function() {
      let fileContent = fs.readFileSync(validWSDLs20 + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      schemaPack.convert((error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
        expect(result.output[0].data).to.be.an('object');
      });
    });
  });
});

//   it('esc 5: should get an object representing inputFileTemperatureHasHttp example PM Collection',
//     function() {
//       const schemaPack = new SchemaPack({
//         data: inputFileTemperatureHasHttp,
//         type: 'string'
//       }, {});
//       schemaPack.convert((error, result) => {
//         expect(error).to.be.null;
//         expect(result).to.be.an('object');
//         expect(result.output).to.be.an('array');
//         expect(result.output[0].data).to.be.an('object');
//         expect(result.output[0].type).to.equal('collection');
//         expect(result.output[0].data).to.be.an('object');
//       })
//     });
