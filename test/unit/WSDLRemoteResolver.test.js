const expect = require('chai').expect,
  {
    resolveRemoteRefs,
    calculateDownloadPathAndParentBaseURL,
    resolveRemoteRefsNoMerge,
    getRemoteReferencesArray,
    resolveRemoteRefsMultiFile
  } = require('../../lib/utils/WSDLRemoteResolver'),
  remoteRefs11 = 'test/data/separatedFiles/remoteRefs',
  remoteRefsIncludeTag = 'test/data/separatedFiles/includeTag',
  remoteSameTargetNamespace = 'test/data/separatedFiles/sameTargetnamespace',
  remoteNotFound = 'test/data/separatedFiles/remoteNotFound',
  remoteRefsServiceFinderQuery = 'test/data/separatedFiles/remoteRefsServiceFinderQuery',
  fs = require('fs'),
  getOptions = require('../../lib/utils/options').getOptions,
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  {
    removeLineBreakTabsSpaces
  } = require('../../lib/utils/textUtils'),
  path = require('path'),
  customFetchOK = (url) => {
    const url1 = 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/development/test/data' +
      '/separatedFiles/remoteRefsServiceFinderQuery/xsd0.xsd',
      url2 = 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/development/test/data/' +
    'separatedFiles/remoteRefsServiceFinderQuery/xsd1.xsd',
      url3 = 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/development/test/data/' +
        'separatedFiles/remoteRefsServiceFinderQuery/xsd2.xsd',
      url4 = 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/development/test/data/' +
      'separatedFiles/remoteRefsServiceFinderQuery/xsd3.xsd',

      path1 = path.join(__dirname, '../../' + remoteRefsServiceFinderQuery + '/xsd0.xsd'),
      path2 = path.join(__dirname, '../../' + remoteRefsServiceFinderQuery + '/xsd1.xsd'),
      path3 = path.join(__dirname, '../../' + remoteRefsServiceFinderQuery + '/xsd2.xsd'),
      path4 = path.join(__dirname, '../../' + remoteRefsServiceFinderQuery + '/xsd3.xsd'),
      urlMap = {};
    urlMap[url1] = fs.readFileSync(path1, 'utf8');
    urlMap[url2] = fs.readFileSync(path2, 'utf8');
    urlMap[url3] = fs.readFileSync(path3, 'utf8');
    urlMap[url4] = fs.readFileSync(path4, 'utf8');
    let status = 200,
      content = urlMap[url];
    if (content === undefined) {
      status = 404;
    }
    return Promise.resolve({
      text: () => { return Promise.resolve(content); },
      status: status
    });
  };

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

  it('Should propagate errors', function (done) {
    resolveRemoteRefs('', new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile.err.message).to.equal('Cannot get prefix from undefined or null object');
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

});


describe('WSDLRemoteResolver calculateDownloadPathAndParentBaseURL', function () {

  it('Should return same path when is a valid xsd absolute path and parent should be the base of the url', function () {
    const { parentBaseURL, downloadPath } = calculateDownloadPathAndParentBaseURL(
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd', '', ''
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

  it('Should return same path when is a valid xsd absolute path parent and process are set', function () {
    const { parentBaseURL, downloadPath } = calculateDownloadPathAndParentBaseURL(
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd',
      'https://raw.com/', 'https://raw.war.com/'
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

  it('Should return same path when is a valid xsd absolute path and parent' +
    ' should be the base of the url even with processURL', function () {
    const { parentBaseURL, downloadPath } = calculateDownloadPathAndParentBaseURL(
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd', '',
      'https://raw.githubusercontent.com/otherBasePath'
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

  it('Should return resolved absolute path when send parent path and relative in the file', function () {
    const { parentBaseURL, downloadPath } = calculateDownloadPathAndParentBaseURL(
      'xsd0.xsd', 'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/',
      'https://raw.githubusercontent.com/otherBasePath'
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

  it('Should return absolute path when there is no parent path and relative in the file take processURL', function () {
    const { parentBaseURL, downloadPath } = calculateDownloadPathAndParentBaseURL(
      'xsd0.xsd', '',
      'https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/'
    );
    expect(parentBaseURL).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/');
    expect(downloadPath).to.equal('https://raw.githubusercontent.com/postmanlabs/wsdl-to-postman/xsd0.xsd');
  });

});

describe('resolveRemoteRefsNoMerge method', async function () {
  it('Should return the resolved references example 2', async function () {
    const data = fs.readFileSync(remoteRefsServiceFinderQuery + '/ServiceFinderQuery.wsdl', 'utf8');
    let res = await resolveRemoteRefsNoMerge({ data }, new XMLParser(), { resolveRemoteRefs: true });
    expect(res).to.not.be.undefined;
    expect(res[0].path).to.equal('xsd0.xsd');
    expect(res[1].path).to.equal('xsd1.xsd');
    expect(res[2].path).to.equal('xsd2.xsd');
    expect(res[3].path).to.equal('xsd3.xsd');
  });

  it('Should return the resolved references example 2 using custom fetch', async function () {
    const data = fs.readFileSync(remoteRefsServiceFinderQuery + '/ServiceFinderQuery.wsdl', 'utf8');
    let res = await resolveRemoteRefsNoMerge({ data }, new XMLParser(),
      { resolveRemoteRefs: true, remoteRefsResolver: customFetchOK });
    expect(res).to.not.be.undefined;
    expect(res[0].path).to.equal('xsd0.xsd');
    expect(res[1].path).to.equal('xsd1.xsd');
    expect(res[2].path).to.equal('xsd2.xsd');
    expect(res[3].path).to.equal('xsd3.xsd');
  });
});

describe('getRemoteReferencesArray function', function () {
  it('should return references from multiple inputs', async function () {
    const data = fs.readFileSync(remoteRefsServiceFinderQuery + '/ServiceFinderQuery.wsdl', 'utf8'),
      res = await getRemoteReferencesArray([{ data }, { data }], new XMLParser(),
        { resolveRemoteRefs: true, remoteRefsResolver: customFetchOK });
    expect(res).to.not.be.undefined;
    expect(res[0][0].path).to.equal('xsd0.xsd');
    expect(res[0][1].path).to.equal('xsd1.xsd');
    expect(res[0][2].path).to.equal('xsd2.xsd');
    expect(res[0][3].path).to.equal('xsd3.xsd');
    expect(res[1][0].path).to.equal('xsd0.xsd');
    expect(res[1][1].path).to.equal('xsd1.xsd');
    expect(res[1][2].path).to.equal('xsd2.xsd');
    expect(res[1][3].path).to.equal('xsd3.xsd');

  });
});

describe('resolveRemoteRefsMultiFile function', function () {
  it('should return references from multiple inputs', async function () {
    const data = fs.readFileSync(remoteRefsServiceFinderQuery + '/ServiceFinderQuery.wsdl', 'utf8'),
      res = await resolveRemoteRefsMultiFile({ rootFiles: [{ data }, { data }] }, new XMLParser(),
        { resolveRemoteRefs: true, remoteRefsResolver: customFetchOK });
    expect(res).to.not.be.undefined;
    expect(res[0].path).to.equal('xsd0.xsd');
    expect(res[1].path).to.equal('xsd1.xsd');
    expect(res[2].path).to.equal('xsd2.xsd');
    expect(res[3].path).to.equal('xsd3.xsd');
    expect(res[4].path).to.equal('xsd0.xsd');
    expect(res[5].path).to.equal('xsd1.xsd');
    expect(res[6].path).to.equal('xsd2.xsd');
    expect(res[7].path).to.equal('xsd3.xsd');

  });
});
