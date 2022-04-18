const { expect } = require('chai'),
  {
    getElementFromMissingInRequestBySiblingsXpath
  } = require('../../lib/utils/mismatchUtils');

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
