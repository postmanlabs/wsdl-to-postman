const expect = require('chai').expect,
  Converter = require('../../index.js'),
  fs = require('fs'),
  path = require('path'),
  COUNTING_SEPARATED_FOLDER = '../data/separatedFiles/counting',
  WIKI_20_FOLDER = '../data/separatedFiles/wiki20',
  MULTIPLE_ROOT = '../data/separatedFiles/multipleRoot';

describe('detectRoot method', function() {

  it('should return one root 1.1 correctly no specific version', async function() {
    const service = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data[0].path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return one root 1.1 correctly', async function() {
    const service = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data[0].path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return no root when specified version is 2.0 and no root of ' +
    'that version is present', async function() {
    const service = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '2.0',
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(0);
    expect(result.output.specification.version).to.equal('2.0');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return one root 2.0 correctly', async function() {
    const service = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/wikipedia.wsdl'
      ),
      types = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/Types.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '2.0',
        data: [
          {
            path: '/wikipedia.wsdl',
            content: serviceContent
          },
          {
            path: '/Types.xsd',
            content: typesContent
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(1);
    expect(result.output.data[0].path).to.equal('/wikipedia.wsdl');
    expect(result.output.specification.version).to.equal('2.0');
    expect(result.output.type).to.be.equal('rootFiles');
  });


  it('should return one root using version by default (1.1) when multiple ' +
    'versions are present (Not specified version)', async function() {
    const service = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/wikipedia.wsdl'
      ),
      types = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/Types.xsd'
      ),
      service2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      serviceContent2 = fs.readFileSync(service2, 'utf8'),
      typesContent2 = fs.readFileSync(types2, 'utf8'),
      input = {
        type: 'multiFile',
        data: [
          {
            path: '/wikipedia.wsdl',
            content: serviceContent
          },
          {
            path: '/Types.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent2
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent2
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(1);
    expect(result.output.data[0].path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return one root when multiple versions are present correctly 2.0', async function() {
    const service = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/wikipedia.wsdl'
      ),
      types = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/Types.xsd'
      ),
      service2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      serviceContent2 = fs.readFileSync(service2, 'utf8'),
      typesContent2 = fs.readFileSync(types2, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '2.0',
        data: [
          {
            path: '/wikipedia.wsdl',
            content: serviceContent
          },
          {
            path: '/Types.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent2
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent2
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(1);
    expect(result.output.data[0].path).to.equal('/wikipedia.wsdl');
    expect(result.output.specification.version).to.equal('2.0');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return no root file when there is not a root file present', async function() {
    const types = path.join(
        __dirname,
        WIKI_20_FOLDER,
        '/Types.xsd'
      ),
      types2 = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let typesContent = fs.readFileSync(types, 'utf8'),
      typesContent2 = fs.readFileSync(types2, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        data: [
          {
            path: '/Types.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent2
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(0);
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return 2 root 1.1 correctly', async function() {
    const service = path.join(
        __dirname,
        MULTIPLE_ROOT,
        '/CountingCategoryService.wsdl'
      ),
      service2 = path.join(
        __dirname,
        MULTIPLE_ROOT,
        '/CountingCategoryServiceCopy.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      serviceContent2 = fs.readFileSync(service2, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryServiceCopy.wsdl',
            content: serviceContent2
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(2);
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should propagate one error correctly', async function () {
    const service = path.join(
      __dirname,
      COUNTING_SEPARATED_FOLDER,
      '/CountingCategoryService.wsdl'
    );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        data: [
          {
            path: '',
            content: serviceContent
          }
        ]
      };
    try {
      await Converter.detectRootFiles(input);
    }
    catch (ex) {
      expect(ex.message).to.equal('"Path" of the data element should be provided');
    }
  });

  it('should not read content from FS when is not present', async function () {
    let input = {
        type: 'multiFile',
        data: [
          {
            path: '/CountingCategoryService.wsdl'
          },
          {
            path: '/CountingCategoryData.xsd'
          }
        ]
      },
      result = await Converter.detectRootFiles(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(0);
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('rootFiles');
  });

  it('should return error when "type" parameter is not sent', async function () {
    const service = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_SEPARATED_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        data: [
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          }
        ]
      };
    try {
      await Converter.detectRootFiles(input);
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('"Type" parameter should be provided');
    }
  });

  it('should return error when input is an empty object', async function () {
    try {
      await Converter.detectRootFiles({});
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('Input object must have "type" and "data" information');
    }
  });

  it('should return error when input data is an empty array', async function () {
    try {
      await Converter.detectRootFiles({ type: 'multiFile', data: [] });
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('"Data" parameter should be provided');
    }
  });
});
