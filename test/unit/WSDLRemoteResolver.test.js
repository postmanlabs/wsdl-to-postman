const expect = require('chai').expect,
  {
    resolveRemoteRefs
  } = require('../../lib/utils/WSDLRemoteResolver'),
  remoteRefs11 = 'test/data/separatedFiles/remoteRefs',
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

  it('Should return the resolved references', function () {
    let rootContent = fs.readFileSync(remoteRefs11 + '/remoteStockquoteservice.wsdl', 'utf8'),
      expectedOutput = fs.readFileSync(remoteRefs11 + '/output.wsdl', 'utf8');
    resolveRemoteRefs(rootContent, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
    });
  });

  it('Should return the same string when "resolveRemoteRefs" option is set to false', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
    let optionFromOptions = {},
      rootContent;
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;

    rootContent = fs.readFileSync(remoteRefs11 + '/remoteStockquoteservice.wsdl', 'utf8');
    localOption = optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;
    resolveRemoteRefs(rootContent, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(rootContent));
    });
  });

  it('Should return the same string when "resolveRemoteRefs"option is not sent', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
    let optionFromOptions = {},
      rootContent;
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;

    rootContent = fs.readFileSync(remoteRefs11 + '/remoteStockquoteservice.wsdl', 'utf8');
    localOption = optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;
    resolveRemoteRefs(rootContent, new XMLParser(), undefined, (resolvedFile) => {
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(rootContent));
    });
  });

  it('Should return the same string when "resolveRemoteRefs"option is empty object', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
    let optionFromOptions = {},
      rootContent;
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;

    rootContent = fs.readFileSync(remoteRefs11 + '/remoteStockquoteservice.wsdl', 'utf8');
    localOption = optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;
    resolveRemoteRefs(rootContent, new XMLParser(), {}, (resolvedFile) => {
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(rootContent));
    });
  });

});
