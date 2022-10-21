const expect = require('chai').expect,
  Converter = require('../../index.js'),
  path = require('path-browserify'),
  COUNTING_FOLDER = '../data/separatedFiles/counting',
  INCLUDE_TAG = '../data/separatedFiles/includeTag',
  ALL_IMPORT_PRESENT = '../data/separatedFiles/allImportPresent',
  MULTIPLE_ROOT = '../data/separatedFiles/multipleRoot',
  NESTED_FOLDERS = '../data/separatedFiles/nestedFolders',
  NO_ROOT = '../data/separatedFiles/noRootFile',
  REMOTE_NOT_FOUND = '../data/separatedFiles/remoteNotFound',
  REMOTE_REFS = '../data/separatedFiles/remoteRefs',
  SAME_TARGET_NAMESPACE = '../data/separatedFiles/sameTargetnamespace',
  fs = require('fs');

describe('Bundle api, bundle method', function() {
  it('Should bundle remove the resolved imports and parent if empty after', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, ALL_IMPORT_PRESENT, '/CountingCategoryService.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(__dirname, ALL_IMPORT_PRESENT, '/CountingCategoryData.xsd'),
        'utf-8'
      ),
      expectedOutput = fs.readFileSync(
        path.join(__dirname, ALL_IMPORT_PRESENT, '/output.wsdl'),
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
    expect(
      removeLineBreakTabsSpaces(result.output.data[0].rootFile.bundledContent)
    ).to.equal(removeLineBreakTabsSpaces(expectedOutput));
  });

  it('Should bundle and dont remove the unresolved imports', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, COUNTING_FOLDER, '/CountingCategoryService.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(__dirname, COUNTING_FOLDER, '/CountingCategoryData.xsd'),
        'utf-8'
      ),
      expectedOutput = fs.readFileSync(
        path.join(__dirname, COUNTING_FOLDER, '/output.wsdl'),
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
    expect(
      removeLineBreakTabsSpaces(result.output.data[0].rootFile.bundledContent)
    ).to.equal(removeLineBreakTabsSpaces(expectedOutput));
  });

  it('Should bundle and remove resolved include tags', async function() {
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

  it('Should bundle multiple Roots', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, MULTIPLE_ROOT, '/CountingCategoryService.wsdl'),
        'utf-8'
      ),
      serviceContent2 = fs.readFileSync(
        path.join(__dirname, MULTIPLE_ROOT, '/CountingCategoryServiceCopy.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(__dirname, MULTIPLE_ROOT, '/CountingCategoryData.xsd'),
        'utf-8'
      ),
      expectedOutput = fs.readFileSync(
        path.join(__dirname, MULTIPLE_ROOT, '/bundleOutput.wsdl'),
        'utf-8'
      ),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/CountingCategoryService.wsdl'
          },
          {
            path: '/CountingCategoryServiceCopy.wsdl'
          }
        ],
        options: {},
        data: [
          {
            path: '/CountingCategoryData.xsd',
            content: typesContent
          },
          {
            path: '/CountingCategoryService.wsdl',
            content: serviceContent
          },
          {
            path: '/CountingCategoryServiceCopy.wsdl',
            content: serviceContent2
          }
        ]
      },
      result = await Converter.bundle(input);
    expect(result.result).to.be.true;
    expect(
      removeLineBreakTabsSpaces(result.output.data[0].rootFile.bundledContent)
    ).to.equal(removeLineBreakTabsSpaces(expectedOutput));
    expect(
      removeLineBreakTabsSpaces(result.output.data[1].rootFile.bundledContent)
    ).to.equal(removeLineBreakTabsSpaces(expectedOutput));
  });

  it('Should bundle from nested folders', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, NESTED_FOLDERS, '/wsdl/Services.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(__dirname, NESTED_FOLDERS, '/schemas/Types.xsd'),
        'utf-8'
      ),
      expectedOutput = fs.readFileSync(
        path.join(__dirname, NESTED_FOLDERS, '/bundleOutput.wsdl'),
        'utf-8'
      ),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/wsdl/Services.wsdl'
          }
        ],
        options: {},
        data: [
          {
            path: '/schemas/Types.xsd',
            content: typesContent
          },
          {
            path: '/wsdl/Services.wsdl',
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

  it('Should not return any bundledFile if no root in folder', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, NO_ROOT, '/Services.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(__dirname, NO_ROOT, '/Types.xsd'),
        'utf-8'
      ),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
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
    expect(result.output.data).to.have.length(0);
  });

  it('Should bundle and don\'t remove the include when remote content is not found', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, REMOTE_NOT_FOUND, '/Services.wsdl'),
        'utf-8'
      ),
      expectedOutput = fs.readFileSync(
        path.join(__dirname, REMOTE_NOT_FOUND, '/output.wsdl'),
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

  it.skip('Should bundle from remote references', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, REMOTE_REFS, '/remoteStockquoteservice.wsdl'),
        'utf-8'
      ),
      expectedOutput = fs.readFileSync(
        path.join(__dirname, REMOTE_REFS, '/output.wsdl'),
        'utf-8'
      ),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/remoteStockquoteservice.wsdl'
          }
        ],
        options: {},
        data: [
          {
            path: '/remoteStockquoteservice.wsdl',
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

  it('Should bundle and remove imports when it reference the same target name', async function() {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, SAME_TARGET_NAMESPACE, '/Services.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(__dirname, SAME_TARGET_NAMESPACE, '/Types.xsd'),
        'utf-8'
      ),
      expectedOutput = fs.readFileSync(
        path.join(__dirname, SAME_TARGET_NAMESPACE, '/output.wsdl'),
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

  it('should return error when "type" parameter is not sent', async function () {
    const service = path.join(
        __dirname,
        COUNTING_FOLDER,
        '/CountingCategoryService.wsdl'
      ),
      types = path.join(
        __dirname,
        COUNTING_FOLDER,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        rootFiles: [
          {
            path: '/CountingCategoryService.wsdl'
          }
        ],
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
      await Converter.bundle(input);
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('"Type" parameter should be provided');
    }
  });

  it('should propagate one error correctly', async function () {
    const service = path.join(
      __dirname,
      COUNTING_FOLDER,
      '/CountingCategoryService.wsdl'
    );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/CountingCategoryService.wsdl'
          }
        ],
        data: [
          {
            path: '',
            content: serviceContent
          }
        ]
      };
    try {
      await Converter.bundle(input);
    }
    catch (ex) {
      expect(ex.message).to.equal('"Path" of the data element should be provided');
    }
  });

  it('should return 2 bundled files 1.1 correctly', async function () {
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
        MULTIPLE_ROOT,
        '/CountingCategoryData.xsd'
      );
    let serviceContent = fs.readFileSync(service, 'utf8'),
      serviceContent2 = fs.readFileSync(service2, 'utf8'),
      typesContent = fs.readFileSync(types, 'utf8'),
      input = {
        type: 'multiFile',
        rootFiles: [
          {
            path: '/CountingCategoryService.wsdl'
          },
          {
            path: '/CountingCategoryServiceCopy.wsdl'
          }
        ],
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
      result = await Converter.bundle(input);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(2);
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('bundledContent');
  });

  it('should return error when input is an empty object', async function () {
    try {
      await Converter.bundle({});
    }
    catch (error) {
      expect(error).to.not.be.undefined;
      expect(error.message).to.equal('Input object must have "type" and "data" information');
    }
  });
});
