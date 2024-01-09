const expect = require('chai').expect,
  fs = require('fs'),
  exec = require('child_process').exec,
  moduleVersion = require('../../package.json').version;

describe('wsdl2postman ', function () {
  const tempOutputFile = 'tempOutput.json';

  after(function () {
    if (fs.existsSync(tempOutputFile)) {
      fs.unlinkSync(tempOutputFile);
    }
  });

  it('should print help to console', function (done) {
    exec('./bin/wsdl2postman.js --help', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include('Converts a given WSDL specification to POSTMAN Collections v2.1.0 ');
      done();
    });
  });

  it('should print version to console', function (done) {
    exec('./bin/wsdl2postman.js -v', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include(moduleVersion);
      done();
    });
  });

  it('should print to the console testing conversion when test option is sent', function (done) {
    exec('./bin/wsdl2postman.js -t', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include('testing conversion...');
      expect(stdout).to.include('CalculatorSoap');
      done();
    });
  });

  it('should print to console test file', function (done) {
    exec('./bin/wsdl2postman.js -t', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include('CalculatorSoap');
      done();
    });
  });

  it('should print to file', function (done) {
    exec('./bin/wsdl2postman.js -s test/data/validWSDLs11/calculator-soap11and12.wsdl -o tempOutput.json',
      function (err) {
        expect(err).to.be.null;
        fs.readFile(tempOutputFile, 'utf8', (err, data) => {
          let collection = JSON.parse(data);
          expect(collection.info.name).to.equal('Calculator');
          expect(collection.item.length).to.equal(2);
          done();
        });
      });
  });

  it('should print to  with options', function (done) {
    exec('./bin/wsdl2postman.js -s test/data/validWSDLs11/calculator-soap11and12.wsdl -o tempOutput.json' +
      ' -O folderStrategy=Service',
    function (err) {
      expect(err).to.be.null;
      fs.readFile(tempOutputFile, 'utf8', (err, data) => {
        let collection = JSON.parse(data);
        expect(collection.info.name).to.equal('Calculator');
        expect(collection.item.length).to.equal(8);
        done();
      });
    });
  });

  it('should show appropriate messages for invalid input', function (done) {
    exec('./bin/wsdl2postman.js -s test/data/invalidWSDLs11/calculator-invalid.wsdl', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include('Provided WSDL definition is invalid.');
      done();
    });
  });
});
