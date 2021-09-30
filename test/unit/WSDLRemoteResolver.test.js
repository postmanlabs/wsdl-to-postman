const expect = require('chai').expect,
  {
    resolveRemoteRefs
  } = require('../../lib/utils/WSDLRemoteResolver'),
  remoteRefs11 = 'test/data/separatedFiles/remoteRefs',
  remoteRefsServiceFinderQuery = 'test/data/separatedFiles/remoteRefsServiceFinderQuery',
  fs = require('fs'),
  getOptions = require('../../lib/utils/options').getOptions,
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  {
    removeLineBreakTabsSpaces
  } = require('../../lib/utils/textUtils');


describe('WSDLRemoteResolver resolveRemoteRefs', function () {
  const options = getOptions({ usage: ['CONVERSION'] }),
    resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
  let optionFromOptions = {};
  optionFromOptions[`${resolveRemoteRefsOption.id}`] = true;

  it('Should return the resolved references example 2', function (done) {
    let data = fs.readFileSync(remoteRefsServiceFinderQuery + '/ServiceFinderQuery.wsdl', 'utf8'),
      expectedOutput = fs.readFileSync(remoteRefsServiceFinderQuery + '/output.wsdl', 'utf8');
    resolveRemoteRefs({ data }, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      done();
    });
  });

  it('Should return the resolved references', function (done) {
    let data = fs.readFileSync(remoteRefs11 + '/remoteStockquoteservice.wsdl', 'utf8'),
      expectedOutput = fs.readFileSync(remoteRefs11 + '/output.wsdl', 'utf8');
    resolveRemoteRefs({ data }, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      done();
    });
  });

  it('Should return the same string when "resolveRemoteRefs" option is set to false', function (done) {
    const options = getOptions({ usage: ['CONVERSION'] }),
      resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
    let optionFromOptions = {},
      data;
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;

    data = fs.readFileSync(remoteRefs11 + '/remoteStockquoteservice.wsdl', 'utf8');
    localOption = optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;
    resolveRemoteRefs({ data }, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(data));
      done();
    });
  });

  it('Should return the same string when "resolveRemoteRefs"option is not sent', function (done) {
    const options = getOptions({ usage: ['CONVERSION'] }),
      resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
    let optionFromOptions = {},
      data;
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;

    data = fs.readFileSync(remoteRefs11 + '/remoteStockquoteservice.wsdl', 'utf8');
    localOption = optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;
    resolveRemoteRefs({data}, new XMLParser(), undefined, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(data));
      done();
    });
  });

  it('Should return the same string when "resolveRemoteRefs"option is empty object', function (done) {
    const options = getOptions({ usage: ['CONVERSION'] }),
      resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
    let optionFromOptions = {},
      data;
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;

    data = fs.readFileSync(remoteRefs11 + '/remoteStockquoteservice.wsdl', 'utf8');
    localOption = optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;
    resolveRemoteRefs({ data }, new XMLParser(), {}, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(data));
      done();
    });
  });

  it('Should propagates errors', function (done) {
    resolveRemoteRefs('', new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err.message).to.equal('Empty input was proportionated');
      done();
    });
  });

});
