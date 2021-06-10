const { expect } = require('chai'),
  { orderSchemasAccordingToDependencies } = require('../../lib/utils/orderSchemasByDependency'),
  fs = require('fs'),
  {
    XMLParser
  } = require('../../lib/XMLParser'),
  validSchemaFolder = 'test/data/schemaTest',
  {
    getArrayFrom
  } = require('../../lib/utils/objectUtils');


describe('orderSchemasAccordingToDependencies method', function () {
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
});
