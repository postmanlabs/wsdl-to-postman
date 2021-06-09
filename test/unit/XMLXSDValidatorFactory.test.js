const expect = require('chai').expect,
  {
    XMLXSDValidatorFactory
  } = require('../../lib/xsdValidation/XMLXSDValidatorFactory'),
  {
    LibXMLjs2Facade
  } = require('../../lib/xsdValidation/LibXMLjs2Facade'),
  {
    LibXMLjsFacade
  } = require('../../lib/xsdValidation/LibXMLjsFacade'),
  {
    XMLLintFacade
  } = require('../../lib/xsdValidation/XMLLintFacade');

describe('XMLXSDValidatorFactory constructor', function () {
  it('should get an object of type XMLXSDValidatorFactory', function () {
    const validatorFactory = new XMLXSDValidatorFactory();
    expect(validatorFactory).to.be.an('object');
  });
});

describe('XMLXSDValidatorFactory getValidator', function () {
  it('should get an object of type XMLXSDValidatorFactory with libxmljs2 by default', function () {
    const validatorFactory = new XMLXSDValidatorFactory(),
      validator = validatorFactory.getValidator();
    expect(validator instanceof LibXMLjs2Facade).to.be.true;
  });

  it('should get an object of type XMLXSDValidatorFactory whith libxmljs2', function () {
    const validatorFactory = new XMLXSDValidatorFactory(),
      validator = validatorFactory.getValidator('libxmljs2');
    expect(validator instanceof LibXMLjs2Facade).to.be.true;
  });


  it('should get an object of type XMLXSDValidatorFactory with libxmljs', function () {
    const validatorFactory = new XMLXSDValidatorFactory(),
      validator = validatorFactory.getValidator('libxmljs');
    expect(validator instanceof LibXMLjsFacade).to.be.true;
  });

  it('should get an object of type XMLXSDValidatorFactory with xmllint', function () {
    const validatorFactory = new XMLXSDValidatorFactory(),
      validator = validatorFactory.getValidator('xmllint');
    expect(validator instanceof XMLLintFacade).to.be.true;
  });
});
