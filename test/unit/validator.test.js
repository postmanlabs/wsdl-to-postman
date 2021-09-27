const expect = require('chai').expect,
  {
    Validator
  } = require('./../../lib/Validator'),
  {
    XMLParser
  } = require('./../../lib/XMLParser'),
  SEPARATED_FILES = 'test/data/separatedFiles',
  fs = require('fs');


describe('Validator result', function () {
  it('Should return a validatorResult format', function () {
    const validatorResult = new Validator().result(true, 'Some reason');
    expect(validatorResult).to.be.an('object')
      .that.have.all.keys('xml', 'valResult', 'parsedXML');
  });
});

describe('Validator inputNotProvided', function () {
  it('Should return true if input is null', function () {
    const nullInput = null,
      validator = new Validator();

    expect(validator.inputNotProvided(nullInput)).to.be.true;
  });

  it('Should return true if input is undefined', function () {
    const undefinedInput = undefined,
      validator = new Validator();
    expect(validator.inputNotProvided(undefinedInput)).to.be.true;
  });

  it('Should return true if input is empty', function () {
    const emptyInput = '',
      validator = new Validator();
    expect(validator.inputNotProvided(emptyInput)).to.be.true;
  });

  it('Should return false if input is provided', function () {
    const inputProvided = 'Input provided',
      result = new Validator().inputNotProvided(inputProvided);
    expect(result).to.be.false;
  });
});

describe('Validator notContainsWsdlSpec', function () {
  it('Should return true if input content does not contains "definitions>" or "description>"', function () {
    const inputProvided = 'Input provided without wsdl spec',
      result = new Validator().notContainsWsdlSpec(inputProvided);
    expect(result).to.be.true;
  });

  it('Should return false if input content contains "definitions>" or "description>"', function () {
    const inputWithDefinitions = 'Input provided with wsdl "definitions>" included',
      inputWithDescription = 'Input provided with wsdl "description>" included',
      validator = new Validator();
    expect(validator.notContainsWsdlSpec(inputWithDefinitions)).to.be.false;
    expect(validator.notContainsWsdlSpec(inputWithDescription)).to.be.false;
  });
});

describe('Validator validate', function () {
  const mockInput = function (data = '', type = 'string') {
    return {
      type,
      data
    };
  };

  it('Should return a failed validationResult when input.data is null', function () {
    const nullInput = mockInput(null),
      validator = new Validator();
    expect(validator.validate(nullInput, new XMLParser()).valResult).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input.data not provided'
      });
  });

  it('Should return a failed validationResult when input.data is undefined', function () {
    const undefinedInput = mockInput(undefined),
      validator = new Validator();
    expect(validator.validate(undefinedInput).valResult).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input.data not provided'
      });
  });

  it('Should return a failed validationResult when input.data is empty', function () {
    const emptyInput = mockInput(''),
      validator = new Validator();
    expect(validator.validate(emptyInput, new XMLParser()).valResult).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input.data not provided'
      });
  });

  it(`Should return a failed validationResult when input.data does not contains "definitions>" or "description>"
string`, function () {
    const input = mockInput('Does not contains WSDL validation', 'string'),
      validator = new Validator();
    expect(validator.validate(input, new XMLParser()).valResult).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Provided document is not a valid WSDL specification'
      });
  });

  it('Should return a failed validationResult if input type is not supported', function () {
    const input = mockInput('Any type data', 'NotSupportedType'),
      validator = new Validator();
    expect(validator.validate(input, new XMLParser()).valResult).to.be.an('object')
      .and.to.include({
        result: false,
        reason: `Invalid input type (${input.type}). Type must be file/string/folder.`
      });
  });

  it('Should return a successful validationResult if input.data is a "string" and contains wsdl "definitions>" tag',
    function () {
      const definitionsInput = mockInput('<definitions ...> ... </ definitions>', 'string'),
        validator = new Validator();
      expect(validator.validate(definitionsInput, new XMLParser()).valResult).to.be.an('object')
        .and.to.include({
          result: true,
          reason: 'Success'
        });
    });

  it('Should return  ',
    function () {
      const definitionsInput = mockInput('</dsefinitions> </ definitions>', 'string'),
        validator = new Validator();
      expect(validator.validate(definitionsInput, new XMLParser()).valResult).to.be.an('object')
        .and.to.include({
          result: false,
          reason: 'Invalid format. Input must be valid XML'
        });
    });

  it('Should return a successful validationResult if input.data is a "string" and contains wsdl "description>" tag',
    function () {
      const descriptionInput = mockInput('<description ...> ... </ description>', 'string'),
        validator = new Validator();
      expect(validator.validate(descriptionInput, new XMLParser()).valResult).to.be.an('object')
        .and.to.include({
          result: true,
          reason: 'Success'
        });
    });

  it('Should return valid if input.data is a "folder" and at least one file contains wsdl "definitions>" tag',
    function () {
      let folderPath = SEPARATED_FILES + '/W3Example',
        files = [],
        array = [
          { fileName: folderPath + '/stockquote.xsd' },
          { fileName: folderPath + '/stockquote.wsdl' },
          { fileName: folderPath + '/stockquoteservice.wsdl' }
        ];

      array.forEach((item) => {
        files.push({
          content: fs.readFileSync(item.fileName, 'utf8'),
          fileName: item.fileName
        });
      });

      const input = mockInput(files, 'folder'),
        validator = new Validator(),
        result = validator.validate(input, new XMLParser());
      expect(result.valResult).to.be.an('object')
        .and.to.include({
          result: true,
          reason: 'Success'
        });
    });
});
