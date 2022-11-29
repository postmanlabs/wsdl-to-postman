const expect = require('chai').expect,
  {
    resolveRemoteRefs,
    calculateDowloadPathAndParentBaseURL
  } = require('../../lib/utils/WSDLRemoteResolver'),
  remoteRefs11 = 'test/data/separatedFiles/remoteRefs',
  remoteRefsIncludeTag = 'test/data/separatedFiles/includeTag',
  remoteSameTargetNamespace = 'test/data/separatedFiles/sameTargetnamespace',
  remoteNotFound = 'test/data/separatedFiles/remoteNotFound',
  remoteRefsServiceFinderQuery = 'test/data/separatedFiles/remoteRefsServiceFinderQuery',
  remoteDeepCircularRef = 'test/data/separatedFiles/remoteDeepCircularRef',
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
    resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; }),
    sourceUrl = options.find((option) => { return option.id === 'sourceUrl'; });
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
    resolveRemoteRefs({ data }, new XMLParser(), undefined, (resolvedFile) => {
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

  it('Should return the resolved references with relative path and sourceURL (include tag)', function (done) {
    let data = fs.readFileSync(remoteRefsIncludeTag + '/Services.wsdl', 'utf8'),
      expectedOutput = fs.readFileSync(remoteRefsIncludeTag + '/output.wsdl', 'utf8');
    optionFromOptions[`${sourceUrl.id}`] =
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/development/test/data/separatedFiles/includeTag/';

    resolveRemoteRefs({ data }, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      done();
    });
  });

  it('Should return the resolved references with relative path and sourceURL (import tag)', function (done) {
    let data = fs.readFileSync(remoteSameTargetNamespace + '/Services.wsdl', 'utf8'),
      expectedOutput = fs.readFileSync(remoteSameTargetNamespace + '/output.wsdl', 'utf8');
    optionFromOptions[`${sourceUrl.id}`] = 'https://raw.githubusercontent.com/postmanlabs/' +
    'wsdl-to-postman/development/test/data/separatedFiles/sameTargetnamespace/';

    resolveRemoteRefs({ data }, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      done();
    });
  });

  it('Should not fail when does not found a document', function (done) {
    let data = fs.readFileSync(remoteNotFound + '/Services.wsdl', 'utf8'),
      expectedOutput = fs.readFileSync(remoteNotFound + '/output.wsdl', 'utf8');
    optionFromOptions[`${sourceUrl.id}`] = 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman';

    resolveRemoteRefs({ data }, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      done();
    });
  });

  it('Should test remote deep circular refs A - B - C - D - B', function (done) {
    let data = fs.readFileSync(remoteDeepCircularRef + '/ServiceFinderQuery.wsdl', 'utf8');
    expectedOutput = fs.readFileSync(remoteDeepCircularRef + '/output.wsdl', 'utf8');
    optionFromOptions[`${resolveRemoteRefsOption.id}`] = true;

    resolveRemoteRefs({ data }, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err).to.be.undefined;
      expect(removeLineBreakTabsSpaces(resolvedFile.mergedFile)).to.equal(removeLineBreakTabsSpaces(expectedOutput));
      done();
    });
  });

});


describe('WSDLRemoteResolver calculateDowloadPathAndParentBaseURL', function () {

  it('Should return same path when is a valid xsd absolute path and parent should be the base of the url', function () {
    const { parentBaseURL, downloadPath } = calculateDowloadPathAndParentBaseURL(
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd', '', ''
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

  it('Should return same path when is a valid xsd absolute path parent and process are set', function () {
    const { parentBaseURL, downloadPath } = calculateDowloadPathAndParentBaseURL(
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd',
      'https://raw.com/', 'https://raw.war.com/'
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

  it('Should return same path when is a valid xsd absolute path and parent' +
  ' should be the base of the url even with processURL', function () {
    const { parentBaseURL, downloadPath } = calculateDowloadPathAndParentBaseURL(
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd', '',
      'https://raw.githubusercontent.com/otherBasePath'
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

  it('Should return resolved absolute path when send parent path and relative in the file', function () {
    const { parentBaseURL, downloadPath } = calculateDowloadPathAndParentBaseURL(
      'xsd0.xsd', 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/',
      'https://raw.githubusercontent.com/otherBasePath'
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

  it('Should return absolute path when there is no parent path and relative in the file take processURL', function () {
    const { parentBaseURL, downloadPath } = calculateDowloadPathAndParentBaseURL(
      'xsd0.xsd', '',
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/'
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

});
