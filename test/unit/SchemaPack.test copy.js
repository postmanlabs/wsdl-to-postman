const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  validWSDLs = 'test/data/validWSDLs11',
  validWSDLs20 = 'test/data/validWSDLs20',
  SEPARATED_FILES = '../data/separatedFiles',
  REMOTE_REFS = 'test/data/separatedFiles/remoteRefs',
  fs = require('fs'),
  getAllTransactionsFromCollection = require('../../lib/utils/getAllTransactions').getAllTransactionsFromCollection,
  async = require('async'),
  path = require('path'),
  {
    MULTIPLE_ROOT_FILES,
    MISSING_ROOT_FILE
  } = require('../../lib/constants/messageConstants'),
  optionIds = [
    'folderStrategy',
    'validateHeader',
    'validationPropertiesToIgnore',
    'ignoreUnresolvedVariables',
    'detailedBlobValidation',
    'showMissingInSchemaErrors',
    'suggestAvailableFixes',
    'resolveRemoteRefs',
    'sourceUrl',
    'indentCharacter'
  ],
  getOptions = require('../../lib/utils/options').getOptions;

describe('merge and validate', function () {

  it('Should create collection from nested schema imports', function (done) {
    let folderPath = path.join(__dirname, SEPARATED_FILES, '/xsdimportsxsd'),
      files = [],
      array = [
        { fileName: folderPath + '/spec.wsdl' },
        { fileName: folderPath + '/schemas/xsd0.xsd' },
        { fileName: folderPath + '/schemas/subschemas/xsd2.xsd' },
        { fileName: folderPath + '/schemas/subschemas/xsd3.xsd' }
      ];

    array.forEach((item) => {
      files.push({
        content: fs.readFileSync(item.fileName, 'utf8'),
        fileName: item.fileName
      });
    });

    const schemaPack = new SchemaPack({ type: 'folder', data: files }, {});

    schemaPack.mergeAndValidate((err, status) => {
      if (err) {
        expect.fail(null, null, err);
      }
      if (status.result) {
        schemaPack.convert((error, result) => {
          if (error) {
            expect.fail(null, null, err);
          }
          expect(result.result).to.equal(true);
          expect(result.output.length).to.equal(1);
          expect(result.output[0].type).to.have.equal('collection');
          expect(result.output[0].data).to.have.property('info');
          expect(result.output[0].data).to.have.property('item');
          fs.writeFileSync('coll.json', JSON.stringify(result.output[0].data));
        });
        done();
      }
      else {
        expect.fail(null, null, status.reason);
      }
    });
  });

});
