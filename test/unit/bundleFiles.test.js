const expect = require('chai').expect,
  path = require('path-browserify'),
  COUNTING_FOLDER = '../data/separatedFiles/counting',
  W3_FOLDER = '../data/separatedFiles/W3Example',
  INCLUDE_TAG = '../data/separatedFiles/includeTag',
  ALL_IMPORT_PRESENT = '../data/separatedFiles/allImportPresent',
  MULTIPLE_ROOT = '../data/separatedFiles/multipleRoot',
  NESTED_FOLDERS = '../data/separatedFiles/nestedFolders',
  NO_ROOT = '../data/separatedFiles/noRootFile',
  REMOTE_NOT_FOUND = '../data/separatedFiles/remoteNotFound',
  REMOTE_REFS = '../data/separatedFiles/remoteRefs',
  SAME_TARGET_NAMESPACE = '../data/separatedFiles/sameTargetnamespace',
  SAME_TARGET_NAMESPACE_FOLDER = '../data/separatedFiles/sameTargetnamespace',
  fs = require('fs'),
  _ = require('lodash'),
  xpathTool = require('xpath'),
  xmldom = require('xmldom').DOMParser,
  { getBundledFiles } = require('../../lib/bundleFiles'),
  {
    WSDLParserFactory
  } = require('../../lib/WSDLParserFactory'),
  {
    XMLParser
  } = require('../../lib/XMLParser');


describe('Bundle api, bundle method', function() {
  const wsdlParser = new WSDLParserFactory().getParserByVersion('1.1'),
    xmlParser = new XMLParser();

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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(
      removeLineBreakTabsSpaces(result.output.data[0].rootFile.bundledContent)
    ).to.equal(removeLineBreakTabsSpaces(expectedOutput));
  });

  it('should locate the root from data array and bundle, rootFiles is empty array', async function () {
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
        type: 'multiFile',
        rootFiles: [
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
      },
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(result.output.data[0].rootFile.path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('bundledContent');
  });

  it('should locate the root from data array and bundle, rootFiles is not present in input', async function () {
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(result.output.data[0].rootFile.path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('bundledContent');
  });

  it('should locate the root from data array and bundle, rootFiles is undefined', async function () {
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
        type: 'multiFile',
        rootFiles: undefined,
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(result.output.data[0].rootFile.path).to.equal('/CountingCategoryService.wsdl');
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('bundledContent');
  });

  it('should throw error when rootFile is not present in data array', async function() {
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
      };
    try {
      await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    }
    catch (error) {
      expect(error.message).to.equal('Input should have at least one root file');
    }
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
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
      await getBundledFiles(input, wsdlParser, xmlParser, input.options);
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
      await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    }
    catch (ex) {
      expect(ex.message).to.equal('Input should have at least one root file');
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);

    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(2);
    expect(result.output.specification.version).to.equal('1.1');
    expect(result.output.type).to.be.equal('bundledContent');
  });

  it('Should bundle only the selected root even with multiple Roots in data array', async function() {
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
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(result.output.data.length).to.equal(1);
    expect(result.output.data[0].rootFile.path).to.equal('/CountingCategoryServiceCopy.wsdl');
  });

  it('Should return the bundle api output correctly with reference map', async function() {
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
        options: { includeReferenceMap: true },
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
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(result.output).to.be.an('object')
      .with.keys(['data', 'type', 'specification']);
    expect(result.output.specification).to.be.an('object')
      .with.keys(['type', 'version']);
    expect(result.output.data)
      .to.have.length(1);
    expect(result.output.data[0].rootFile.path)
      .to.be.equal('/CountingCategoryService.wsdl');
    expect(result.output.data[0].rootFile.referenceMap['//wsdl:definitions//wsdl:types/schema[1]'])
      .to.deep.equal({
        path: '/CountingCategoryData.wsdl',
        type: 'inline'
      });
    _.keys(result.output.data[0].rootFile.referenceMap).forEach((xpath) => {
      let doc = new xmldom().parseFromString(result.output.data[0].rootFile.bundledContent
          .replace('<?xml version="1.0"?>', '')
          .replace('xmlns="http://www.w3.org/2001/XMLSchema"', '')),
        select = xpathTool.useNamespaces({
          'wsdl': 'http://schemas.xmlsoap.org/wsdl/',
          'xsd': 'http://www.w3.org/2001/XMLSchema'
        }),
        nodes = select(xpath, doc);
      expect(nodes).to.not.be.undefined;
      expect(nodes.length).to.equal(1);
    });
  });

  it('Should bundle with reference map pointing to schema and a WSDL portType', async function () {
    const folderPath = path.join(__dirname, W3_FOLDER),
      serviceContent = fs.readFileSync(
        path.join(folderPath, '/stockquoteservice.wsdl'),
        'utf-8'
      ),
      wsldParts = fs.readFileSync(
        path.join(folderPath, '/stockquote.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(folderPath, '/stockquote.xsd'),
        'utf-8'
      ),
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/stockquoteservice.wsdl'
          }
        ],
        options: { includeReferenceMap: true },
        data: [
          {
            path: '/stockquote.xsd',
            content: typesContent
          },
          {
            path: '/stockquoteservice.wsdl',
            content: serviceContent
          },
          {
            path: '/stockquote.wsdl',
            content: wsldParts
          }
        ]
      },
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(result.output).to.be.an('object')
      .with.keys(['data', 'type', 'specification']);
    expect(result.output.specification).to.be.an('object')
      .with.keys(['type', 'version']);
    expect(result.output.data)
      .to.have.length(1);
    expect(result.output.data[0].rootFile.path)
      .to.be.equal('/stockquoteservice.wsdl');
    expect(result.output.data[0].rootFile.referenceMap['//definitions//portType[@name="StockQuotePortType"]'])
      .to.deep.equal({
        path: '/stockquote.wsdl',
        type: 'inline'
      });
    expect(result.output.data[0].rootFile.referenceMap['//definitions//message[@name="GetLastTradePriceInput"]'])
      .to.deep.equal({
        path: '/stockquote.wsdl',
        type: 'inline'
      });
    expect(result.output.data[0].rootFile.referenceMap['//definitions//message[@name="GetLastTradePriceOutput"]'])
      .to.deep.equal({
        path: '/stockquote.wsdl',
        type: 'inline'
      });
    expect(result.output.data[0].rootFile.referenceMap['//definitions//types/schema[1]'])
      .to.deep.equal({
        path: '/stockquote.xsd',
        type: 'inline'
      });
    _.keys(result.output.data[0].rootFile.referenceMap).forEach((xpath) => {
      let doc = new xmldom().parseFromString(result.output.data[0].rootFile.bundledContent
          .replace('<?xml version="1.0"?>', '')
          .replace('xmlns="http://www.w3.org/2001/XMLSchema"', '')
          .replace('xmlns="http://schemas.xmlsoap.org/wsdl/"', '')),
        nodes = xpathTool.select(xpath, doc);
      expect(nodes).to.not.be.undefined;
      expect(nodes.length).to.equal(1);
    });
  });

  it('Should bundle with reference map with merged schemas', async function () {
    const folderPath = path.join(__dirname, SAME_TARGET_NAMESPACE_FOLDER),
      serviceContent = fs.readFileSync(
        path.join(folderPath, '/Services.wsdl'),
        'utf-8'
      ),
      typesContent = fs.readFileSync(
        path.join(folderPath, '/Types.xsd'),
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
        options: { includeReferenceMap: true },
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

      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(result.output).to.be.an('object')
      .with.keys(['data', 'type', 'specification']);
    expect(result.output.specification).to.be.an('object')
      .with.keys(['type', 'version']);
    expect(result.output.data)
      .to.have.length(1);
    expect(result.output.data[0].rootFile.path)
      .to.be.equal('/Services.wsdl');
    expect(result.output.data[0].rootFile
      .referenceMap['//definitions//types//xsd:schema[1]//xsd:element[@name="ElementType"]'])
      .to.deep.equal({
        path: '/Types.xsd',
        type: 'inline'
      });
    _.keys(result.output.data[0].rootFile.referenceMap).forEach((xpath) => {
      let doc = new xmldom().parseFromString(result.output.data[0].rootFile.bundledContent
          .replace('<?xml version="1.0"?>', '')
          .replace('xmlns="http://schemas.xmlsoap.org/wsdl/"', '')),
        select = xpathTool.useNamespaces({
          'xsd': 'http://www.w3.org/2001/XMLSchema'
        }),
        nodes = select(xpath, doc);
      expect(nodes).to.not.be.undefined;
      expect(nodes.length).to.equal(1);
    });
  });

  it('Should not fail when file is missing in the url and return same content', async function () {
    const serviceContent = fs.readFileSync(
        path.join(__dirname, REMOTE_REFS, '/remoteStockquoteservice.wsdl'),
        'utf-8'
      ),
      customFetch = () => {
        return Promise.resolve({
          text: () => { return Promise.resolve(''); },
          status: 404
        });
      },
      input = {
        type: 'multiFile',
        specificationVersion: '1.1',
        rootFiles: [
          {
            path: '/remoteStockquoteservice.wsdl'
          }
        ],
        options: { resolveRemoteRefs: true, remoteRefsResolver: customFetch },
        data: [
          {
            path: '/remoteStockquoteservice.wsdl',
            content: serviceContent
          }
        ]
      },
      result = await getBundledFiles(input, wsdlParser, xmlParser, input.options);
    expect(result.result).to.be.true;
    expect(
      removeLineBreakTabsSpaces(result.output.data[0].rootFile.bundledContent)
    ).to.equal(removeLineBreakTabsSpaces(serviceContent));
  });
});