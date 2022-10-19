const { removeLineBreakTabsSpaces } = require('../../lib/utils/textUtils.js');

const expect = require('chai').expect,
  Converter = require('../../index.js'),
  path = require('path-browserify'),
  COUNTING_FOLDER = '../data/separatedFiles/counting',
  W3_FOLDER = '../data/separatedFiles/W3Example',
  INCLUDE_TAG = '../data/separatedFiles/includeTag',
  SAME_TARGET_NAMESPACE_FOLDER = '../data/separatedFiles/sameTargetnamespace',
  fs = require('fs'),
  _ = require('lodash'),
  xpathTool = require('xpath'),
  xmldom = require('xmldom').DOMParser;


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
      result = await Converter.bundle(input);
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

      result = await Converter.bundle(input);
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
});
