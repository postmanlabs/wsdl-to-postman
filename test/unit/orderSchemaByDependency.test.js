const { expect } = require('chai'),
  { orderSchemasAccordingToDependencies } = require('../../lib/utils/orderSchemasByDependency'),
  fs = require('fs'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  validSchemaFolder = 'test/data/schemaTest',
  {
    getArrayFrom
  } = require('../../lib/utils/objectUtils'),
  sapPurchaseSchemas = require('../data/schemasToOrder/asapPurchase'),
  sapSales = require('../data/schemasToOrder/asapSales');


describe('orderSchemasAccordingToDependencies method', function () {

  it('should return the sapPurchaseSchemas ordered', function () {
    let ordered = orderSchemasAccordingToDependencies(sapPurchaseSchemas, new XMLParser().attributePlaceHolder);

    expect(ordered).to.be.a('Array');
    expect(ordered.length).to.equal(17);


    expect(ordered[0].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/A1S');
    expect(ordered[1].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/FO/PlannedLandedCost');
    expect(ordered[2].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/BASIS/Global');
    expect(ordered[3].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/FO/GrantManagement/Global');
    expect(ordered[4].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/FO/FundManagement/Global');
    expect(ordered[5].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/Common/DataTypes');
    expect(ordered[6].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/PDI/bo');
    expect(ordered[7].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/Common/GDT');
    expect(ordered[8].foundSchemaTag['@_targetNamespace'])
      .to.equal('http://{{url}}/xi/AP/FO/CashDiscountTerms/Global');
    expect(ordered[9].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/CRM/Global');
    expect(ordered[10].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/DocumentServices/Global');
    expect(ordered[11].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/Common/Global');
    expect(ordered[12].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/IS/CodingBlock/Global');
    expect(ordered[13].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/XU/SRM/Global');
    expect(ordered[14].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/Globalization');
    expect(ordered[15].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/A1S/Global');
    expect(ordered[16].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/SAPGlobal20/Global');
  });

  it('should return the schemas order by dependency when they already are', function () {
    const
      fileContent = fs.readFileSync(validSchemaFolder + '/importSchemaSelfFile.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      };
    let parsedXml,
      schemasFromType,
      mapped,
      ordered;
    parsedXml = parser.parseToObject(fileContent);
    typeElement = parsedXml['wsdl:definitions']['wsdl:types'];
    schemasFromType = getArrayFrom(typeElement[schemaNamespace.prefixFilter + 'schema']);
    mapped = schemasFromType.map((schema) => {
      return {
        foundSchemaTag: schema,
        foundLocalSchemaNamespace: schemaNamespace
      };
    });

    ordered = orderSchemasAccordingToDependencies(mapped, parser.attributePlaceHolder);

    expect(ordered).to.be.a('Array');
    expect(ordered.length).to.equal(2);

    expect(ordered[0].foundSchemaTag['@_targetNamespace']).to.equal('https://someurl.data');
    expect(ordered[1].foundSchemaTag['@_targetNamespace']).to.equal('http://www.xsd2jsonschema.org/example');
    expect(ordered[1].foundSchemaTag['xs:import']['@_namespace']).to.equal('https://someurl.data');
  });

  it('should return the schemas order by dependency when they are reversed', function () {
    const
      fileContent = fs.readFileSync(validSchemaFolder + '/importSchemaSelfFile.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xs',
        prefixFilter: 'xs:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      };
    let schemasFromType,
      mapped,
      ordered,
      parsedXml = parser.parseToObject(fileContent),
      typeElement = parsedXml['wsdl:definitions']['wsdl:types'];
    schemasFromType = getArrayFrom(typeElement[schemaNamespace.prefixFilter + 'schema']);

    mapped = schemasFromType.reverse().map((schema) => {
      return {
        foundSchemaTag: schema,
        foundLocalSchemaNamespace: schemaNamespace
      };
    });

    ordered = orderSchemasAccordingToDependencies(mapped, parser.attributePlaceHolder);

    expect(ordered).to.be.a('Array');
    expect(ordered.length).to.equal(2);

    expect(ordered[0].foundSchemaTag['@_targetNamespace']).to.equal('https://someurl.data');
    expect(ordered[1].foundSchemaTag['@_targetNamespace']).to.equal('http://www.xsd2jsonschema.org/example');
    expect(ordered[1].foundSchemaTag['xs:import']['@_namespace']).to.equal('https://someurl.data');
  });

  it('should return the sapSalesSchemas ordered', function () {
    let ordered = orderSchemasAccordingToDependencies(sapSales, new XMLParser().attributePlaceHolder);

    expect(ordered).to.be.a('Array');
    expect(ordered.length).to.equal(12);

    expect(ordered[0].foundSchemaTag['@_targetNamespace'])
      .to.equal('http://{{url}}/xi/AP/Extensibility/GeneratedObjects');
    expect(ordered[1].foundSchemaTag['@_targetNamespace'])
      .to.equal('http://{{url}}/xi/BASIS/Global');
    expect(ordered[2].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/PDI/ABSL');
    expect(ordered[3].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/PDI/bo');
    expect(ordered[4].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/Common/GDT');
    expect(ordered[5].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/DocumentServices/Global');
    expect(ordered[6].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/FO/PaymentCard/Global');
    expect(ordered[7].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/Common/Global');
    expect(ordered[8].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/Globalization');
    expect(ordered[9].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK');
    expect(ordered[10].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/A1S/Global');
    expect(ordered[11].foundSchemaTag['@_targetNamespace']).to.equal('http://{{url}}/xi/SAPGlobal20/Global');
  });

  it('should return 2 schemas when infinite loop found', function () {
    const
      fileContent = fs.readFileSync(validSchemaFolder + '/importLoop.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      };
    let parsedXml,
      schemasFromType,
      mapped,
      ordered;
    parsedXml = parser.parseToObject(fileContent);
    typeElement = parsedXml['wsdl:definitions']['wsdl:types'];
    schemasFromType = getArrayFrom(typeElement[schemaNamespace.prefixFilter + 'schema']);
    mapped = schemasFromType.map((schema) => {
      return {
        foundSchemaTag: schema,
        foundLocalSchemaNamespace: schemaNamespace,
        targetNamespace: schema['@_targetNamespace']
      };
    });

    ordered = orderSchemasAccordingToDependencies(mapped, parser.attributePlaceHolder);

    expect(ordered).to.be.a('Array');
    expect(ordered.length).to.equal(2);

    expect(ordered[0].foundSchemaTag['@_targetNamespace']).to.equal('http://www.xsd2jsonschema.org/example');
    expect(ordered[1].foundSchemaTag['@_targetNamespace']).to.equal('http://www.xsd2jsonschema.org/example2');
  });

  it('should return 2 schemas when infinite deep loop found', function () {
    const
      fileContent = fs.readFileSync(validSchemaFolder + '/importDeepLoop.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      };
    let parsedXml,
      schemasFromType,
      mapped,
      ordered;
    parsedXml = parser.parseToObject(fileContent);
    typeElement = parsedXml['wsdl:definitions']['wsdl:types'];
    schemasFromType = getArrayFrom(typeElement[schemaNamespace.prefixFilter + 'schema']);
    mapped = schemasFromType.map((schema) => {
      return {
        foundSchemaTag: schema,
        foundLocalSchemaNamespace: schemaNamespace,
        targetNamespace: schema['@_targetNamespace']
      };
    });

    ordered = orderSchemasAccordingToDependencies(mapped, parser.attributePlaceHolder);

    expect(ordered).to.be.a('Array');
    expect(ordered.length).to.equal(3);

    expect(ordered[0].foundSchemaTag['@_targetNamespace']).to.equal('http://www.xsd2jsonschema.org/example3');
    expect(ordered[1].foundSchemaTag['@_targetNamespace']).to.equal('http://www.xsd2jsonschema.org/example');
    expect(ordered[2].foundSchemaTag['@_targetNamespace']).to.equal('http://www.xsd2jsonschema.org/example2');
  });

  it('should correctly order schema dependencies where schema imports are without namespace', function () {
    const
      fileContent = fs.readFileSync(validSchemaFolder + '/noNamespaceImports.wsdl', 'utf8'),
      parser = new XMLParser(),
      schemaNamespace = {
        key: 'xsd',
        prefixFilter: 'xsd:',
        url: 'http://queue.amazonaws.com/doc/2009-02-01/',
        isDefault: false
      };
    let parsedXml,
      schemasFromType,
      mapped,
      ordered;
    parsedXml = parser.parseToObject(fileContent);
    typeElement = parsedXml['wsdl:definitions']['wsdl:types'];
    schemasFromType = getArrayFrom(typeElement[schemaNamespace.prefixFilter + 'schema']);
    mapped = schemasFromType.map((schema) => {
      return {
        foundSchemaTag: schema,
        foundLocalSchemaNamespace: schemaNamespace,
        targetNamespace: schema['@_targetNamespace']
      };
    });

    ordered = orderSchemasAccordingToDependencies(mapped, parser.attributePlaceHolder);

    expect(ordered).to.be.a('Array');
    expect(ordered.length).to.equal(1);

    expect(ordered[0].foundSchemaTag['@_xmlns:xsd']).to.equal('http://www.w3.org/2001/XMLSchema');
    expect(ordered[0].foundSchemaTag['xsd:import']).to.be.a('Array');
    expect(ordered[0].foundSchemaTag['xsd:import'].length).to.equal(2);
    expect(ordered[0].foundSchemaTag['xsd:import'][0]['@_schemaLocation']).to.equal('Hello-request.xsd');
    expect(ordered[0].foundSchemaTag['xsd:import'][1]['@_schemaLocation']).to.equal('Hello-response.xsd');
  });
});
