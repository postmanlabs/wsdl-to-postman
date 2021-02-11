const expect = require('chai').expect,
  {
    Validator
  } = require('./../lib/Validator');

describe('Validator result', function() {
  it('Should return a validatorResult format', function() {
    const validatorResult = new Validator().result(true, 'Some reason');
    expect(validatorResult).to.be.an('object')
      .that.have.all.keys('result', 'reason');
  });
});

describe('Validator inputNotProvided', function() {
  it('Should return true if input is null, undefined or empty', function() {
    const nullInput = null,
      undefinedInput = undefined,
      emptyInput = '',
      validator = new Validator();

    expect(validator.inputNotProvided(nullInput)).to.be.true;
    expect(validator.inputNotProvided(undefinedInput)).to.be.true;
    expect(validator.inputNotProvided(emptyInput)).to.be.true;
  });

  it('Should return false if input is provided', function() {
    const inputProvided = 'Input provided',
      result = new Validator().inputNotProvided(inputProvided);
    expect(result).to.be.false;
  });
});

describe('Validator notContainsWsdlSpec', function() {
  it('Should return true if input content does not contains "definitions>" or "description>"', function() {
    const inputProvided = 'Input provided without wsdl spec',
      result = new Validator().notContainsWsdlSpec(inputProvided);
    expect(result).to.be.true;
  });

  it('Should return false if input content contains "definitions>" or "description>"', function() {
    const inputWithDefinitions = 'Input provided with wsdl "definitions>" included',
      inputWithDescription = 'Input provided with wsdl "description>" included',
      validator = new Validator();
    expect(validator.notContainsWsdlSpec(inputWithDefinitions)).to.be.false;
    expect(validator.notContainsWsdlSpec(inputWithDescription)).to.be.false;
  });
});

describe('Validator validate', function() {
  const mockInput = function(data = '', type = 'string') {
    return {
      type,
      data
    };
  };

  it('Should return a failed validationResult when input.data is null, undefined or empty', function() {
    const nullInput = mockInput(null),
      undefinedInput = mockInput(undefined),
      emptyInput = mockInput(''),
      validator = new Validator();
    expect(validator.validate(nullInput)).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input not provided'
      });
    expect(validator.validate(undefinedInput)).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input not provided'
      });
    expect(validator.validate(emptyInput)).to.be.an('object')
      .and.to.include({
        result: false,
        reason: 'Input not provided'
      });
  });

  it(
    'Should return a failed validationResult when input.data does not contains "definitions>" or "description>" \
      string"',
    function() {
      const input = mockInput('Does not contains WSDL validation', 'string'),
        validator = new Validator();
      expect(validator.validate(input)).to.be.an('object')
        .and.to.include({
          result: false,
          reason: 'Not WSDL Specification found in your document'
        });
    });

  it('Should return a failed validationResult if input type is not supported', function() {
    const input = mockInput('Any type data', 'NotSupportedType'),
      validator = new Validator();
    expect(validator.validate(input)).to.be.an('object')
      .and.to.include({
        result: false,
        reason: `Invalid input type (${input.type}). Type must be file/json/string.`
      });
  });

  it('Should return a successful validationResult if input.data is a "string" and contains wsdl "definitions>" \
    or "description>" tags', function() {
      const definitionsInput = mockInput('<definitions ...> ... </ definitions>', 'string'),
      descriptionInput = mockInput('<description ...> ... </ description>', 'string'),
        validator = new Validator();
      expect(validator.validate(definitionsInput)).to.be.an('object')
        .and.to.include({
          result: true,
          reason: 'Success'
        });
      expect(validator.validate(descriptionInput)).to.be.an('object')
        .and.to.include({
          result: true,
          reason: 'Success'
        });
    })
});
