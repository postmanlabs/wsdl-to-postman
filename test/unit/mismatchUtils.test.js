const { expect } = require('chai');
const { getElementFromMissingInRequestBySiblings, getElementFromMissingInRequestByPath } = require('../../lib/utils/mismatchUtils')

describe('testing mismatchUtils getXpathFromMissingInRequestByPath', function() {
  it('Should return an element that matches with xpath from body', function() {
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
})

describe('testing mismatchUtils getXpathFromMissingInRequestBySiblings', function() {
  it('Should return an element that matches with xpath from body', function() {
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
    missingElementNode = getElementFromMissingInRequestBySiblings(currentBody, cleanBody, xpath),
    expected = '/Substract/intB';
    expect(missingElementNode.path()).to.be.equal(expected);
  });

  it('Should return an element that matches with xpath from body', function() {
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
        <intA>200</intA>
        <objB>
          <target>test</target>
          <intA>test</intA>
        </objB>
        <objC>
          <intA>super test</intA>
        </objC>
      </Substract>`,
    xpath = '//intA',
    missingElementNode = getElementFromMissingInRequestBySiblings(currentBody, cleanBody, xpath),
    expected = '/Substract/objB/target';
    expect(missingElementNode.path()).to.be.equal(expected);
  });
})
