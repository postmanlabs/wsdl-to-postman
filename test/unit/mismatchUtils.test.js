const { expect } = require('chai'),
  {
    getElementFromMissingInRequestBySiblingsXpath,
    getElementFromMissingInRequestByPath,
    getElementFromMissingInSchemaByXpath,
    handleInvalidTypeAndGetXpath
  } = require('../../lib/utils/mismatchUtils');

describe('testing mismatchUtils getXpathFromMissingInRequestByPath', function() {
  it('Should return an element that matches with its xpath and is missing from current body ' +
  'and there are multiple elements with same name in different levels', function() {
    const currentBody = `<Substract>
        <intB>400</intB>
        <intA>200</intA>
        <objB>
        
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
      cleanBody = `<Substract>
        <intB>400</intB>
        <intA>200</intA>
        <objB>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
      xpath = '//intA',
      missingElementNode = getElementFromMissingInRequestByPath(currentBody, cleanBody, xpath),
      expected = '/Substract/objB/intA';
    expect(missingElementNode.path()).to.be.equal(expected);
  });
});

describe('testing mismatchUtils getXpathFromMissingInRequestBySiblings', function() {
  it('Should return the missing in request element when it is ' +
  'in the first level of the body using the next sibling xpath', function() {
    const currentBody = `<Substract>
        
        <intA>200</intA>
        <objB>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
      cleanBody = `<Substract>
        <intB>400</intB>
        <intA>200</intA>
        <objB>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
      xpath = '//intA',
      missingElementNode = getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, xpath),
      expected = '/Substract/intB';
    expect(missingElementNode.path()).to.be.equal(expected);
  });

  it('Should return the missing in request element when it is ' +
  'nested in a second level of the body using the next sibling xpath', function() {
    const currentBody = `<Substract>
        <intA>200</intA>
        <objB>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
        <objD>
          <target>test</target>
          <intA>test</intA>
        </objD>
      </Substract>`,
      cleanBody = `<Substract>
        <intA>200</intA>
        <objB>
          <target>test</target>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
        <objD>
          <target>test</target>
          <intA>test</intA>
        </objD>
      </Substract>`,
      xpath = '//intA',
      missingElementNode = getElementFromMissingInRequestBySiblingsXpath(currentBody, cleanBody, xpath),
      expected = '/Substract/objB/target';
    expect(missingElementNode.path()).to.be.equal(expected);
  });
});

describe('mismatchUtils getElementFromMissingInSchemaByXpath', function() {
  it('Should return the element that is missing in schema when it is' +
  ' in the first level of the body and it is the only element with this name', function() {
    const currentBody = `<Substract>
        <intA>200</intA>
        <objB>
          <missingInSchemaElement>test</missingInSchemaElement>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
      cleanBody = `<Substract>
        <intA>200</intA>
        <objB>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
      xpath = '//missingInSchemaElement',
      missingElementNode = getElementFromMissingInSchemaByXpath(currentBody, cleanBody, xpath),
      expected = '/Substract/objB/missingInSchemaElement';
    expect(missingElementNode.path()).to.be.equal(expected);
  });

  it('Should return the element that is missing in schema when it is' +
  ' in the second level of the body and there are multiple elements with this name', function() {
    const currentBody = `<Substract>
        <intA>200</intA>
        <objB>
          <target>test</target>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
          <target>test</target>
        </objC>
      </Substract>`,
      cleanBody = `<Substract>
        <intA>200</intA>
        <objB>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
          <target>test</target>
        </objC>
      </Substract>`,
      xpath = '//target',
      missingElementNode = getElementFromMissingInSchemaByXpath(currentBody, cleanBody, xpath),
      expected = '/Substract/objB/target';
    expect(missingElementNode.path()).to.be.equal(expected);
  });

  it('Should return the element that is missing in schema when there are multiple elements with the same name' +
  ' in the sale level', function() {
    const currentBody = `<Substract>
        <intA>200</intA>
        <objB>
          <intA>test</intA>
        </objB>
        <objB>
          <missingInSchemaElement>test</missingInSchemaElement>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
      cleanBody = `<Substract>
        <intA>200</intA>
        <objB>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
      xpath = '//missingInSchemaElement',
      missingElementNode = getElementFromMissingInSchemaByXpath(currentBody, cleanBody, xpath),
      expected = '/Substract/objB[2]/missingInSchemaElement';
    expect(missingElementNode.path()).to.be.equal(expected);
  });
});

describe('mismatchUtils getElementFromInvalidTypeByXpath', function() {
  it('Should return the wrongElement root path when there are multiple elements with the same name', function() {
    const currentBody = `<Substract>
        <intA>200</intA>
        <objB>
          <targetElement>WRONGVALUE</targetElement>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
          <targetElement>test</targetElement>
        </objC>
      </Substract>`,
      reason = 'Element \'targetElement\': \'WRONGVALUE\' is not a valid value of the atomic type \'xs:unsignedLong\'',
      wrongElementXpath = handleInvalidTypeAndGetXpath(reason, currentBody),
      expected = '/Substract/objB/targetElement';
    expect(wrongElementXpath).to.be.equal(expected);
  });

  it('Should return the wrongElement root path when there are multiple elements with the same name ' +
  'in different parents with same name', function() {
    const currentBody = `<Substract>
        <intA>200</intA>
        <objB>
          <targetElement>correctValue</targetElement>
          <intA>test</intA>
        </objB>
        <objB>
          <targetElement>WRONGVALUE</targetElement>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
          <missingInSchemaElement>test</missingInSchemaElement>
        </objC>
      </Substract>`,
      reason = 'Element \'targetElement\': \'WRONGVALUE\' is not a valid value of the atomic type \'xs:unsignedLong\'',
      wrongElementXpath = handleInvalidTypeAndGetXpath(reason, currentBody),
      expected = '/Substract/objB[2]/targetElement';
    expect(wrongElementXpath).to.be.equal(expected);
  });

  it('Should return the wrongElement root path when there are multiple elements with the same name ' +
  'in the same level', function() {
    const currentBody = `<Substract>
        <intA>200</intA>
        <objB>
          <targetElement>correctValue</targetElement>
          <targetElement>correctValue</targetElement>
          <targetElement>WRONGVALUE</targetElement>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
          <targetElement>correctValue</targetElement>
        </objC>
      </Substract>`,
      reason = 'Element \'targetElement\': \'WRONGVALUE\' is not a valid value of the atomic type \'xs:unsignedLong\'',
      wrongElementXpath = handleInvalidTypeAndGetXpath(reason, currentBody),
      expected = '/Substract/objB/targetElement[3]';
    expect(wrongElementXpath).to.be.equal(expected);
  });
});