const {
    expect
  } = require('chai'),
  {
    BodyMismatch
  } = require('./../../lib/utils/BodyMismatch'),
  operation = {
    xpathInfo: {
      xpath: '//Test//xpath'
    }
  };

describe('Missing in request cases', function() {
  const commonOneExpectedBody = '<Subtract >' +
        '<ob>' +
          '<intA>100</intA>' +
        '</ob>' +
      '</Subtract>',
    commonBothExpectedBody = '<Subtract >' +
        '<ob>' +
          '<intA>100</intA>' +
          '<intB>200</intB>' +
        '</ob>' +
      '</Subtract>';
  describe('Cases when error message matches with NOT_EXPECTED_ONE_SIBLING_PATTERN', function() {
    const error = {
        message: 'Element \'intB\': This element is not expected\. Expected is \( intA \)',
        code: 1
      },
      cases = {
        NOT_EXPECTED_BEFORE__MULTIPLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
                '<intA>100</intA>' +
              '</ob>' +
              '<ob>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonOneExpectedBody
        },
        NOT_EXPECTED_BEFORE__SINGLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonOneExpectedBody
        },
        SWAPPED_ELEMENT__MULTIPLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
              '</ob>' +
              '<ob>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonOneExpectedBody
        },
        SWAPPED_ELEMENT__SINGLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonOneExpectedBody
        },
        WRONG_ORDERED_ELEMENT__MULTIPLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
                '<intA>100</intA>' +
              '</ob>' +
              '<ob>' +
                '<intA>100</intA>' +
                '<intB>200</intB>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonBothExpectedBody
        },
        WRONG_ORDERED_ELEMENT__SINGLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonBothExpectedBody
        },
        NOT_PROVIDE_PREVIOUS_ELEMENT__MULTIPLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
              '</ob>' +
              '<ob>' +
                '<intA>100</intA>' +
                '<intB>200</intB>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonBothExpectedBody
        },
        NOT_PROVIDE_PREVIOUS_ELEMENT__SINGLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonBothExpectedBody
        }
      };

    it('Return INVALID_BODY mismatch in NOT_EXPECTED_BEFORE__MULTIPLE case ' +
      'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.NOT_EXPECTED_BEFORE__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
                '<intA>100</intA>' +
              '</ob>' +
              '<ob>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>',
          suggestedValue: '<Subtract >' +
              '<ob>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>'
        }
      });
    });

    it('Should return an MISSING_IN_REQUEST in NOT_EXPECTED_BEFORE__MULTIPLE case ' +
    'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.NOT_EXPECTED_BEFORE__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'intB\': This element is not expected. Expected is ( intA )',
        reasonCode: 'MISSING_IN_REQUEST',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob[1]',
          actualValue: '<intB>200</intB>\n<intA>100</intA>',
          suggestedValue: '<intA>100</intA>'
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in NOT_EXPECTED_BEFORE__SINGLE case ' +
    'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.NOT_EXPECTED_BEFORE__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: '<Subtract >' +
              '<ob>' +
                '<intB>200</intB>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>',
          suggestedValue: '<Subtract >' +
              '<ob>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>'
        }
      });
    });

    it('Should return an MISSING_IN_REQUEST mismatch in NOT_EXPECTED_BEFORE__SINGLE case ' +
    'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const error = {
          message: 'Element \'intB\': This element is not expected\. Expected is \( intA \)',
          code: 1
        },
        options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        currentBody = `
        <Subtract >
          <ob>
            <intB>200</intB>
            <intA>100</intA>
          </ob>
        </Subtract>
        `,
        expectedBody = `
        <Subtract >
          <ob>
            <intA>100</intA>
          </ob>
        </Subtract>
        `,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'intB\': This element is not expected. Expected is ( intA )',
        reasonCode: 'MISSING_IN_REQUEST',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob',
          actualValue: '<intB>200</intB>\n<intA>100</intA>',
          suggestedValue: '<intA>100</intA>'
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in SWAPPED_ELEMENT__MULTIPLE case ' +
    'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.SWAPPED_ELEMENT__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: currentBody,
          suggestedValue: expectedBody
        }
      });
    });

    it('Should return an MISSING_IN_REQUEST mismatch in SWAPPED_ELEMENT__MULTIPLE case ' +
    'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const error = {
          message: 'Element \'intB\': This element is not expected\. Expected is \( intA \)',
          code: 1
        },
        options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.SWAPPED_ELEMENT__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'intB\': This element is not expected. Expected is ( intA )',
        reasonCode: 'MISSING_IN_REQUEST',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob[1]',
          actualValue: '<intB>200</intB>',
          suggestedValue: '<intA>100</intA>'
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in SWAPPED_ELEMENT__SINGLE case ' +
    'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.SWAPPED_ELEMENT__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: currentBody,
          suggestedValue: expectedBody
        }
      });
    });

    it('Should return an MISSING_IN_REQUEST mismatch in SWAPPED_ELEMENT__SINGLE case ' +
    'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const error = {
          message: 'Element \'intB\': This element is not expected\. Expected is \( intA \)',
          code: 1
        },
        options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.SWAPPED_ELEMENT__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'intB\': This element is not expected. Expected is ( intA )',
        reasonCode: 'MISSING_IN_REQUEST',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob',
          actualValue: '<intB>200</intB>',
          suggestedValue: '<intA>100</intA>'
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in WRONG_ORDERED_ELEMENT__MULTIPLE case ' +
    'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.WRONG_ORDERED_ELEMENT__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: currentBody,
          suggestedValue: expectedBody
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in WRONG_ORDERED_ELEMENT__MULTIPLE case ' +
    'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const error = {
          message: 'Element \'intB\': This element is not expected\. Expected is \( intA \)',
          code: 1
        },
        options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.WRONG_ORDERED_ELEMENT__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'intB\': This element is not expected. Expected is ( intA )',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob[1]',
          actualValue: '<intB>200</intB>\n<intA>100</intA>',
          suggestedValue: '<intA>100</intA>\n<intB>200</intB>'
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in WRONG_ORDERED_ELEMENT__SINGLE case ' +
    'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.WRONG_ORDERED_ELEMENT__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: currentBody,
          suggestedValue: expectedBody
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in WRONG_ORDERED_ELEMENT__SINGLE case ' +
    'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const error = {
          message: 'Element \'intB\': This element is not expected\. Expected is \( intA \)',
          code: 1
        },
        options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.WRONG_ORDERED_ELEMENT__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'intB\': This element is not expected. Expected is ( intA )',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob',
          actualValue: '<intB>200</intB>\n<intA>100</intA>',
          suggestedValue: '<intA>100</intA>\n<intB>200</intB>'
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in NOT_PROVIDE_PREVIOUS_ELEMENT__MULTIPLE case ' +
    'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.NOT_PROVIDE_PREVIOUS_ELEMENT__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: currentBody,
          suggestedValue: expectedBody
        }
      });
    });

    it('Should return an MISSING_IN_REQUEST mismatch in NOT_PROVIDE_PREVIOUS_ELEMENT__MULTIPLE case ' +
    'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const error = {
          message: 'Element \'intB\': This element is not expected\. Expected is \( intA \)',
          code: 1
        },
        options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.NOT_PROVIDE_PREVIOUS_ELEMENT__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'intB\': This element is not expected. Expected is ( intA )',
        reasonCode: 'MISSING_IN_REQUEST',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob[1]',
          actualValue: '<intB>200</intB>',
          suggestedValue: '<intA>100</intA>\n<intB>200</intB>'
        }
      });
    });

    it('Should return an INVALID_BODY mismatch in NOT_PROVIDE_PREVIOUS_ELEMENT__SINGLE case ' +
    'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.NOT_PROVIDE_PREVIOUS_ELEMENT__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: currentBody,
          suggestedValue: expectedBody
        }
      });
    });

    it('Should return an MISSING_IN_REQUEST mismatch in NOT_PROVIDE_PREVIOUS_ELEMENT__SINGLE case ' +
    'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const error = {
          message: 'Element \'intB\': This element is not expected\. Expected is \( intA \)',
          code: 1
        },
        options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.NOT_PROVIDE_PREVIOUS_ELEMENT__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'intB\': This element is not expected. Expected is ( intA )',
        reasonCode: 'MISSING_IN_REQUEST',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob',
          actualValue: '<intB>200</intB>',
          suggestedValue: '<intA>100</intA>\n<intB>200</intB>'
        }
      });
    });
  });

  describe('Cases when error message matches with MISSING_CHILD_PATTERN', function() {
    const error = {
        message: 'Element \'ob\': Missing child element(s). Expected is \( intA \)',
        code: 1
      },
      cases = {
        MISSING_ELEMENT__MULTIPLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
              '</ob>' +
              '<ob>' +
                '<intA>100</intA>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonOneExpectedBody
        },
        MISSING_ELEMENT__SINGLE: {
          currentBody: '<Subtract >' +
              '<ob>' +
              '</ob>' +
            '</Subtract>',
          expectedBody: commonOneExpectedBody
        }
      };

    it('Should return a INVALID_BODY mismatch in MISSING_ELEMENT__MULTIPLE case ' +
      'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.MISSING_ELEMENT__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: currentBody,
          suggestedValue: expectedBody
        }
      });
    });

    it('Should return a MISSING_IN_REQUEST mismatch in MISSING_ELEMENT__MULTIPLE case ' +
      'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.MISSING_ELEMENT__MULTIPLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'ob\': Missing child element(s). Expected is ( intA )',
        reasonCode: 'MISSING_IN_REQUEST',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob[1]',
          actualValue: '',
          suggestedValue: '<intA>100</intA>'
        }
      });
    });

    it('Should return a INVALID_BODY mismatch in MISSING_ELEMENT__SINGLE case ' +
      'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: false,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.MISSING_ELEMENT__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'The request body didn\'t match the specified schema',
        reasonCode: 'INVALID_BODY',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//soap:Body',
          actualValue: currentBody,
          suggestedValue: expectedBody
        }
      });
    });

    it('Should return a MISSING_IN_REQUEST mismatch in MISSING_ELEMENT__SINGLE case ' +
      'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
      const options = {
          detailedBlobValidation: true,
          suggestAvailableFixes: true
        },
        {
          currentBody,
          expectedBody
        } = cases.MISSING_ELEMENT__SINGLE,
        mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
        result = mismatch.getMismatch();
      expect(result).to.be.deep.equal({
        property: 'BODY',
        reason: 'Element \'ob\': Missing child element(s). Expected is ( intA )',
        reasonCode: 'MISSING_IN_REQUEST',
        schemaJsonPath: '//Test//xpath',
        transactionJsonPath: '$.request.body',
        suggestedFix: {
          key: '//Subtract/ob',
          actualValue: '',
          suggestedValue: '<intA>100</intA>'
        }
      });
    });
  });
});

describe('Invalid type cases', function() {
  const error = {
      message: 'Element \'intA\': \'This is not an integer\' is not a valid value of the atomic type \'int\'',
      code: 1
    },
    commonExpectedBody = '<Subtract >' +
        '<ob>' +
          '<intA>100</intA>' +
        '</ob>' +
      '</Subtract>',
    cases = {
      WRONG_TYPE__SINGLE: {
        currentBody: '<Subtract >' +
            '<ob>' +
              '<intA>This is not an integer</intA>' +
            '</ob>' +
          '</Subtract>',
        expectedBody: commonExpectedBody
      },
      WRONG_TYPE__MULTIPLE: {
        currentBody: '<Subtract >' +
            '<ob>' +
              '<intA>This is not an integer</intA>' +
            '</ob>' +
            '<ob>' +
              '<intA>100</intA>' +
            '</ob>' +
          '</Subtract>',
        expectedBody: commonExpectedBody
      }
    };
  it('Return an INVALID_BODY in WRONG_TYPE__SINGLE case ' +
  'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
    const options = {
        detailedBlobValidation: false,
        suggestAvailableFixes: true
      },
      {
        currentBody,
        expectedBody
      } = cases.WRONG_TYPE__SINGLE,
      mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
      result = mismatch.getMismatch();
    expect(result).to.be.deep.equal({
      property: 'BODY',
      reason: 'The request body didn\'t match the specified schema',
      reasonCode: 'INVALID_BODY',
      schemaJsonPath: '//Test//xpath',
      transactionJsonPath: '$.request.body',
      suggestedFix: {
        key: '//soap:Body',
        actualValue: currentBody,
        suggestedValue: expectedBody
      }
    });
  });

  it('Return an INVALID_TYPE in WRONG_TYPE__SINGLE case ' +
  'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
    const options = {
        detailedBlobValidation: true,
        suggestAvailableFixes: true
      },
      {
        currentBody,
        expectedBody
      } = cases.WRONG_TYPE__SINGLE,
      mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
      result = mismatch.getMismatch();
    expect(result).to.be.deep.equal({
      property: 'BODY',
      reason: 'Element \'intA\': \'This is not an integer\' is not a valid value of the atomic type \'int\'',
      reasonCode: 'INVALID_TYPE',
      schemaJsonPath: '//Test//xpath',
      transactionJsonPath: '$.request.body',
      suggestedFix: {
        key: '//Subtract/ob/intA',
        actualValue: 'This is not an integer',
        suggestedValue: '100'
      }
    });
  });

  it('Return an INVALID_BODY in WRONG_TYPE__MULTIPLE case ' +
  'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
    const options = {
        detailedBlobValidation: false,
        suggestAvailableFixes: true
      },
      {
        currentBody,
        expectedBody
      } = cases.WRONG_TYPE__MULTIPLE,
      mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
      result = mismatch.getMismatch();
    expect(result).to.be.deep.equal({
      property: 'BODY',
      reason: 'The request body didn\'t match the specified schema',
      reasonCode: 'INVALID_BODY',
      schemaJsonPath: '//Test//xpath',
      transactionJsonPath: '$.request.body',
      suggestedFix: {
        key: '//soap:Body',
        actualValue: currentBody,
        suggestedValue: expectedBody
      }
    });
  });

  it('Return an INVALID_TYPE in WRONG_TYPE__MULTIPLE case ' +
  'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
    const options = {
        detailedBlobValidation: true,
        suggestAvailableFixes: true
      },
      {
        currentBody,
        expectedBody
      } = cases.WRONG_TYPE__MULTIPLE,
      mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
      result = mismatch.getMismatch();
    expect(result).to.be.deep.equal({
      property: 'BODY',
      reason: 'Element \'intA\': \'This is not an integer\' is not a valid value of the atomic type \'int\'',
      reasonCode: 'INVALID_TYPE',
      schemaJsonPath: '//Test//xpath',
      transactionJsonPath: '$.request.body',
      suggestedFix: {
        key: '//Subtract/ob[1]/intA',
        actualValue: 'This is not an integer',
        suggestedValue: '100'
      }
    });
  });
});

describe('Content not allowed cases', function() {
  const error = {
      message: 'Element \'intA\': Character content is not allowed, because the content type is empty',
      code: 1
    },
    commonExpectedBody = '<Subtract >' +
        '<ob>' +
          '<intA/>' +
        '</ob>' +
      '</Subtract>',
    cases = {
      CONTENT_NOT_ALLOWED__SINGLE: {
        currentBody: '<Subtract >' +
            '<ob>' +
              '<intA>This is not an allowed content</intA>' +
            '</ob>' +
          '</Subtract>',
        expectedBody: commonExpectedBody
      }
    };
  it('Return an INVALID_BODY in CONTENT_NOT_ALLOWED__SINGLE case ' +
  'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
    const options = {
        detailedBlobValidation: false,
        suggestAvailableFixes: true
      },
      {
        currentBody,
        expectedBody
      } = cases.CONTENT_NOT_ALLOWED__SINGLE,
      mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
      result = mismatch.getMismatch();
    expect(result).to.be.deep.equal({
      property: 'BODY',
      reason: 'The request body didn\'t match the specified schema',
      reasonCode: 'INVALID_BODY',
      schemaJsonPath: '//Test//xpath',
      transactionJsonPath: '$.request.body',
      suggestedFix: {
        key: '//soap:Body',
        actualValue: currentBody,
        suggestedValue: expectedBody
      }
    });
  });

  it('Return an INVALID_TYPE in CONTENT_NOT_ALLOWED__SINGLE case ' +
  'detailedBlobValidation = true, suggestAvailableFixes = true', function() {
    const options = {
        detailedBlobValidation: true,
        suggestAvailableFixes: true
      },
      {
        currentBody,
        expectedBody
      } = cases.CONTENT_NOT_ALLOWED__SINGLE,
      mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
      result = mismatch.getMismatch();
    expect(result).to.be.deep.equal({
      property: 'BODY',
      reason: 'Element \'intA\': Character content is not allowed, because the content type is empty',
      reasonCode: 'INVALID_BODY',
      schemaJsonPath: '//Test//xpath',
      transactionJsonPath: '$.request.body',
      suggestedFix: {
        key: '//Subtract/ob/intA',
        actualValue: 'This is not an allowed content',
        suggestedValue: ''
      }
    });
  });
});

describe('Invalid xml string cases', function() {
  const error = {
      message: 'Error validating message',
      code: 1
    },
    commonExpectedBody = '<Subtract >' +
        '<ob>' +
          '<intA>100</intA>' +
        '</ob>' +
      '</Subtract>',
    cases = {
      INVALID_XML_STRING__SINGLE: {
        currentBody: 'Subtract >' +
            '<ob>' +
              '<intA>100</intA>' +
            '</ob>' +
          '</Subtract>',
        expectedBody: commonExpectedBody
      }
    };
  it('Should return an INVALID_BODY mismatch in INVALID_XML_STRING__SINGLE case ' +
  'detailedBlobValidation = false, suggestAvailableFixes = true', function() {
    const options = {
        detailedBlobValidation: true,
        suggestAvailableFixes: true
      },
      {
        currentBody,
        expectedBody
      } = cases.INVALID_XML_STRING__SINGLE,
      mismatch = new BodyMismatch(error, currentBody, expectedBody, operation, false, options),
      result = mismatch.getMismatch();
    expect(result).to.be.deep.equal({
      property: 'BODY',
      reason: 'Error validating message',
      reasonCode: 'INVALID_BODY',
      schemaJsonPath: '//Test//xpath',
      transactionJsonPath: '$.request.body',
      suggestedFix: {
        key: '//soap:Body',
        actualValue: currentBody,
        suggestedValue: expectedBody
      }
    });
  });
});
