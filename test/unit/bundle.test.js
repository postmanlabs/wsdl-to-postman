const expect = require('chai').expect,
  Converter = require('../../index.js'),
  path = require('path-browserify'),
  COUNTING_FOLDER = '../data/separatedFiles/counting',
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
});
