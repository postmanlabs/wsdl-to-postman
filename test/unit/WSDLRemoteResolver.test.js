const expect = require('chai').expect,
  {
    resolveRemoteReferences,
    resolveRemoteRefs
  } = require('../../lib/utils/WSDLRemoteResolver'),
  validWSDLs20 = 'test/data/separatedFiles/remoteRefs',
  fs = require('fs'),
  getOptions = require('../../lib/utils/options').getOptions,
  {
    XMLParser
  } = require('../../lib/XMLParser');


describe('WSDLRemoteResolver resolveRemoteRefs', function () {
  const options = getOptions({ usage: ['CONVERSION'] }),
    resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
  let optionFromOptions = {};
  optionFromOptions[`${resolveRemoteRefsOption.id}`] = true;

  it('Should return the resolved references', function () {
    let rootContent = fs.readFileSync(validWSDLs20 + '/stockquoteservice.wsdl', 'utf8');
    resolveRemoteRefs(rootContent, new XMLParser(), optionFromOptions, (resolvedFile) => {
      expect(resolvedFile).to.equal(rootContent);
    });


  });
});


// describe('WSDLRemoteResolver resolveRemoteReferences', function () {
//   const options = getOptions({ usage: ['CONVERSION'] }),
//     resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
//   let optionFromOptions = {};
//   optionFromOptions[`${resolveRemoteRefsOption.id}`] = true;

//   it('Should return the resolved references', function () {
//     let resolvedFile;
//     rootContent = fs.readFileSync(validWSDLs20 + '/stockquoteservice.wsdl', 'utf8');

//     resolvedFile = resolveRemoteReferences(rootContent, new XMLParser(), optionFromOptions);

//     expect(resolvedFile).to.equal(rootContent);
//     expect(resolvedFile).to.not.equal('');
//   });
// });

// describe('WSDLRemoteResolver resolveRemoteReferences with options', function () {
//   it('Should return the same string when "resolveRemoteRefs" option is set to false', function () {
//     const options = getOptions({ usage: ['CONVERSION'] }),
//       resolveRemoteRefsOption = options.find((option) => { return option.id === 'resolveRemoteRefs'; });
//     let optionFromOptions = {},
//       resolvedFile;
//     optionFromOptions[`${resolveRemoteRefsOption.id}`] = false;
//     rootContent = fs.readFileSync(validWSDLs20 + '/stockquoteservice.wsdl', 'utf8');

//     resolvedFile = resolveRemoteReferences(rootContent, new XMLParser(), optionFromOptions);

//     expect(resolvedFile).to.equal(rootContent);
//     expect(resolvedFile).to.not.equal('');
//   });

//   it('Should return the same string when "resolveRemoteRefs" option is not sent', function () {
//     let resolvedFile;
//     rootContent = fs.readFileSync(validWSDLs20 + '/stockquoteservice.wsdl', 'utf8');

//     resolvedFile = resolveRemoteReferences(rootContent, new XMLParser());

//     expect(resolvedFile).to.equal(rootContent);
//     expect(resolvedFile).to.not.equal('');
//   });

//   it('Should return the same string when "resolveRemoteRefs" option is empty object', function () {
//     let resolvedFile;
//     rootContent = fs.readFileSync(validWSDLs20 + '/stockquoteservice.wsdl', 'utf8');
//     resolvedFile = resolveRemoteReferences(rootContent, new XMLParser(), {});

//     expect(resolvedFile).to.equal(rootContent);
//     expect(resolvedFile).to.not.equal('');
//   });
// });
