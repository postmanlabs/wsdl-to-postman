const { removeLineBreakTabsSpaces } = require('../../lib/utils/textUtils.js');

const expect = require('chai').expect,
  Converter = require('../../index.js'),
  path = require('path-browserify'),
  COUNTING_FOLDER = '../data/separatedFiles/counting',
  INCLUDE_TAG = '../data/separatedFiles/includeTag',
  fs = require('fs');

describe('Bundle api, bundle method', function() {
  it('Should return the bundle api output correctly', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, COUNTING_FOLDER, '/CountingCategoryService.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(__dirname, COUNTING_FOLDER, '/CountingCategoryData.xsd'),
        'utf-8'
      ),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/CountingCategoryService.wsdl'
          }
        ],
        options: {},
        data: [
          {
            path: '/CountingCategoryData.wsdl',
            content: typesContent
          },
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          }
        ]
      },
      result = await Converter.bundle(input);
    expect(result.result).to.be.true;
    expect(result.output).to.be.an('object')
      .with.keys(['data', 'type', 'specification']);
    expect(result.output.specification).to.be.an('object')
      .with.keys(['type', 'version']);
    expect(result.output.data)
      .to.have.length(1);
    expect(result.output.data[0].rootFile.path)
      .to.be.equal('/CountingCategoryService.wsdl');
  });

  it('Should return the bundle of includeTag folder correctly', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, INCLUDE_TAG, '/Services.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(__dirname, INCLUDE_TAG, '/Types.xsd'),
        'utf-8'
      ),
      expectedOutput = fs.readFileSync(
        path.join(__dirname, INCLUDE_TAG, '/output.wsdl'),
        'utf-8'
      ),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/Services.wsdl'
          }
        ],
        options: {},
        data: [
          {
            path: '/Types.xsd',
            content: typesContent
          },
          {
            path: '/Services.wsdl',
            content: serviceContent
          }
        ]
      },
      result = await Converter.bundle(input);
    expect(result.result).to.be.true;
    expect(
      removeLineBreakTabsSpaces(result.output.data[0].rootFile.bundledContent)
    ).to.equal(removeLineBreakTabsSpaces(expectedOutput));
  });
});
