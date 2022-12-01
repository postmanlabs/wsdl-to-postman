const { expect } = require('chai');
const { ElementResolver } = require('../../lib/utils/ElementResolver');

describe('SoapBodyCopy create function test', function() {
  it('Should resolve the error type elements when the originalType is defined', function() {
    const child = {
        children: [],
        name: 'ubiNum',
        isComplex: false,
        type: 'error',
        maximum: 0,
        minimum: 0,
        originalType: 'NumType'
      },
      elements = [{
        children: [child],
        name: 'NumberToWords',
        isComplex: true,
        isElement: true,
        type: 'complex',
        namespace: 'http://www.dataaccess.com/webservicesserver/',
        originalType: 'complex'
      }],
      complexTypeElements = [{
        children: [],
        name: 'NumType',
        isComplex: false,
        iseEement: false,
        type: 'integer',
        maximum: 0,
        minimum: 0
      }],
      simpleTypeElements = [],
      allElements = {
        simpleTypeElements,
        complexTypeElements,
        elements
      },
      resolver = new ElementResolver(allElements);
    resolver.resolveAll();
    expect(allElements.elements[0].children[0].type).to.be.equal('NumType');
  });

  it('Should resolve elements with the same name', function() {
    const allElements = {
      elements: [
        {
          children: [
            {
              children: [
                {
                  children: [
                  ],
                  minOccurs: '1',
                  maxOccurs: '1',
                  name: 'ID',
                  type: 'string',
                  isComplex: false,
                  namespace: '',
                  maximum: undefined,
                  minimum: undefined,
                  maxLength: undefined,
                  minLength: undefined,
                  pattern: undefined,
                  enum: undefined,
                  contentEncoding: undefined
                }
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'OutboundDeliveryExecution',
              type: 'OutboundDeliveryExecutionConfirmation',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'OutboundDeliveryExecutionConfirmation',
          type: 'complex',
          isComplex: true,
          namespace: 'http://papas.com/xi/papasGlobal20/Global',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: true,
          contentEncoding: undefined
        }
      ],
      simpleTypeElements: [
      ],
      complexTypeElements: [
        {
          children: [
            {
              children: '',
              minOccurs: '1',
              maxOccurs: '1',
              name: 'ID',
              type: 'string',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'OutboundDeliveryExecutionConfirmation',
          type: 'complex',
          isComplex: true,
          namespace: 'http://papas.com/xi/AP/LogisticsExecution/Global',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
                {
                  children: '',
                  minOccurs: '1',
                  maxOccurs: '1',
                  name: 'ID',
                  type: 'string',
                  isComplex: true,
                  namespace: '',
                  maximum: '',
                  minimum: '',
                  maxLength: '',
                  minLength: '',
                  pattern: '',
                  enum: ''
                }
              ],
              minOccurs: '0',
              maxOccurs: '1',
              name: 'OutboundDeliveryExecutionConfirmation',
              type: 'complex',
              isComplex: true,
              namespace: 'http://papas.com/xi/AP/LogisticsExecution/Global',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              isElement: false,
              contentEncoding: undefined
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'OutboundDeliveryExecutionConfirmationMessage',
          type: 'complex',
          isComplex: true,
          namespace: 'http://papas.com/xi/AP/LogisticsExecution/Global',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        }
      ],
      groupElements: [
      ],
      globalAttributesElements: [
      ]
    };
    resolver = new ElementResolver(allElements);
    resolver.resolveAll();
    let elements = allElements.elements;
    expect(elements).to.be.an('array');
    expect(elements.length).to.equal(1);
    expect(elements[0].name).to.equal('OutboundDeliveryExecutionConfirmation');
    expect(elements[0].isComplex).to.equal(true);
    expect(elements[0].type).to.equal('complex');
    expect(elements[0].children[0].name).to.equal('OutboundDeliveryExecution');
  });

  it('Should resolve 2 elements using same complex type', function() {
    const elements = [
        {
          children: [
            {
              children: [
                {
                  children: [
                    {
                      children: [
                        {
                          children: [
                            {
                              children: [
                                {
                                  children: [
                                    {
                                      children: [
                                        {
                                          children: [
                                          ],
                                          minOccurs: '1',
                                          maxOccurs: '1',
                                          name: '@type',
                                          type: 'string',
                                          isComplex: false,
                                          namespace: '',
                                          maximum: undefined,
                                          minimum: undefined,
                                          maxLength: undefined,
                                          minLength: undefined,
                                          pattern: undefined,
                                          enum: undefined,
                                          contentEncoding: undefined
                                        }
                                      ],
                                      minOccurs: '1',
                                      maxOccurs: '1',
                                      name: 'ID',
                                      type: 'Communication_Usage_TypeObjectIDType',
                                      isComplex: true,
                                      namespace: '',
                                      maximum: '',
                                      minimum: '',
                                      maxLength: '',
                                      minLength: '',
                                      pattern: '',
                                      enum: ''
                                    },
                                    {
                                      children: [
                                      ],
                                      minOccurs: '1',
                                      maxOccurs: '1',
                                      name: '@Descriptor',
                                      type: 'string',
                                      isComplex: false,
                                      namespace: '',
                                      maximum: undefined,
                                      minimum: undefined,
                                      maxLength: undefined,
                                      minLength: undefined,
                                      pattern: undefined,
                                      enum: undefined,
                                      contentEncoding: undefined
                                    }
                                  ],
                                  minOccurs: '1',
                                  maxOccurs: '1',
                                  name: 'Type_Reference',
                                  type: 'Communication_Usage_TypeObjectType',
                                  isComplex: true,
                                  namespace: '',
                                  maximum: '',
                                  minimum: '',
                                  maxLength: '',
                                  minLength: '',
                                  pattern: '',
                                  enum: ''
                                },
                                {
                                  children: [
                                  ],
                                  minOccurs: '0',
                                  maxOccurs: '1',
                                  name: '@Primary',
                                  type: 'boolean',
                                  isComplex: false,
                                  namespace: '',
                                  maximum: undefined,
                                  minimum: undefined,
                                  maxLength: undefined,
                                  minLength: undefined,
                                  pattern: undefined,
                                  enum: undefined,
                                  contentEncoding: undefined
                                }
                              ],
                              minOccurs: '1',
                              maxOccurs: '1',
                              name: 'Type_Data',
                              type: 'Communication_Usage_Type_DataType',
                              isComplex: true,
                              namespace: '',
                              maximum: '',
                              minimum: '',
                              maxLength: '',
                              minLength: '',
                              pattern: '',
                              enum: ''
                            },
                            {
                              children: [
                                {
                                  children: [
                                    {
                                      children: [
                                      ],
                                      minOccurs: '1',
                                      maxOccurs: '1',
                                      name: '@type',
                                      type: 'string',
                                      isComplex: false,
                                      namespace: '',
                                      maximum: undefined,
                                      minimum: undefined,
                                      maxLength: undefined,
                                      minLength: undefined,
                                      pattern: undefined,
                                      enum: undefined,
                                      contentEncoding: undefined
                                    }
                                  ],
                                  minOccurs: '1',
                                  maxOccurs: '1',
                                  name: 'ID',
                                  type: 'Communication_Usage_BehaviorObjectIDType',
                                  isComplex: true,
                                  namespace: '',
                                  maximum: '',
                                  minimum: '',
                                  maxLength: '',
                                  minLength: '',
                                  pattern: '',
                                  enum: ''
                                },
                                {
                                  children: [
                                  ],
                                  minOccurs: '1',
                                  maxOccurs: '1',
                                  name: '@Descriptor',
                                  type: 'string',
                                  isComplex: false,
                                  namespace: '',
                                  maximum: undefined,
                                  minimum: undefined,
                                  maxLength: undefined,
                                  minLength: undefined,
                                  pattern: undefined,
                                  enum: undefined,
                                  contentEncoding: undefined
                                }
                              ],
                              minOccurs: '0',
                              maxOccurs: '1',
                              name: 'Use_For_Reference',
                              type: 'Communication_Usage_BehaviorObjectType',
                              isComplex: true,
                              namespace: '',
                              maximum: '',
                              minimum: '',
                              maxLength: '',
                              minLength: '',
                              pattern: '',
                              enum: ''
                            },
                            {
                              children: [
                              ],
                              minOccurs: '0',
                              maxOccurs: '1',
                              name: 'Comments',
                              type: 'string',
                              isComplex: false,
                              namespace: '',
                              maximum: undefined,
                              minimum: undefined,
                              maxLength: undefined,
                              minLength: undefined,
                              pattern: undefined,
                              enum: undefined,
                              contentEncoding: undefined
                            }
                          ],
                          minOccurs: '1',
                          maxOccurs: '1',
                          name: 'Usage_Data',
                          type: 'Communication_Method_Usage_Information_DataType',
                          isComplex: true,
                          namespace: '',
                          maximum: '',
                          minimum: '',
                          maxLength: '',
                          minLength: '',
                          pattern: '',
                          enum: ''
                        }
                      ],
                      minOccurs: '1',
                      maxOccurs: '1',
                      name: 'Address_Data',
                      type: 'Address_Information_DataType',
                      isComplex: true,
                      namespace: '',
                      maximum: '',
                      minimum: '',
                      maxLength: '',
                      minLength: '',
                      pattern: '',
                      enum: ''
                    },
                    {
                      children: [
                        {
                          children: [
                            {
                              children: [
                                {
                                  children: [
                                    {
                                      children: [
                                        {
                                          children: [
                                          ],
                                          minOccurs: '1',
                                          maxOccurs: '1',
                                          name: '@type',
                                          type: 'string',
                                          isComplex: false,
                                          namespace: '',
                                          maximum: undefined,
                                          minimum: undefined,
                                          maxLength: undefined,
                                          minLength: undefined,
                                          pattern: undefined,
                                          enum: undefined,
                                          contentEncoding: undefined
                                        }
                                      ],
                                      minOccurs: '1',
                                      maxOccurs: '1',
                                      name: 'ID',
                                      type: 'Communication_Usage_TypeObjectIDType',
                                      isComplex: true,
                                      namespace: '',
                                      maximum: '',
                                      minimum: '',
                                      maxLength: '',
                                      minLength: '',
                                      pattern: '',
                                      enum: ''
                                    },
                                    {
                                      children: [
                                      ],
                                      minOccurs: '1',
                                      maxOccurs: '1',
                                      name: '@Descriptor',
                                      type: 'string',
                                      isComplex: false,
                                      namespace: '',
                                      maximum: undefined,
                                      minimum: undefined,
                                      maxLength: undefined,
                                      minLength: undefined,
                                      pattern: undefined,
                                      enum: undefined,
                                      contentEncoding: undefined
                                    }
                                  ],
                                  minOccurs: '1',
                                  maxOccurs: '1',
                                  name: 'Type_Reference',
                                  type: 'Communication_Usage_TypeObjectType',
                                  isComplex: true,
                                  namespace: '',
                                  maximum: '',
                                  minimum: '',
                                  maxLength: '',
                                  minLength: '',
                                  pattern: '',
                                  enum: ''
                                },
                                {
                                  children: [
                                  ],
                                  minOccurs: '0',
                                  maxOccurs: '1',
                                  name: '@Primary',
                                  type: 'boolean',
                                  isComplex: false,
                                  namespace: '',
                                  maximum: undefined,
                                  minimum: undefined,
                                  maxLength: undefined,
                                  minLength: undefined,
                                  pattern: undefined,
                                  enum: undefined,
                                  contentEncoding: undefined
                                }
                              ],
                              minOccurs: '1',
                              maxOccurs: '1',
                              name: 'Type_Data',
                              type: 'Communication_Usage_Type_DataType',
                              isComplex: true,
                              namespace: '',
                              maximum: '',
                              minimum: '',
                              maxLength: '',
                              minLength: '',
                              pattern: '',
                              enum: ''
                            },
                            {
                              children: [
                                {
                                  children: [
                                    {
                                      children: [
                                      ],
                                      minOccurs: '1',
                                      maxOccurs: '1',
                                      name: '@type',
                                      type: 'string',
                                      isComplex: false,
                                      namespace: '',
                                      maximum: undefined,
                                      minimum: undefined,
                                      maxLength: undefined,
                                      minLength: undefined,
                                      pattern: undefined,
                                      enum: undefined,
                                      contentEncoding: undefined
                                    }
                                  ],
                                  minOccurs: '1',
                                  maxOccurs: '1',
                                  name: 'ID',
                                  type: 'Communication_Usage_BehaviorObjectIDType',
                                  isComplex: true,
                                  namespace: '',
                                  maximum: '',
                                  minimum: '',
                                  maxLength: '',
                                  minLength: '',
                                  pattern: '',
                                  enum: ''
                                },
                                {
                                  children: [
                                  ],
                                  minOccurs: '1',
                                  maxOccurs: '1',
                                  name: '@Descriptor',
                                  type: 'string',
                                  isComplex: false,
                                  namespace: '',
                                  maximum: undefined,
                                  minimum: undefined,
                                  maxLength: undefined,
                                  minLength: undefined,
                                  pattern: undefined,
                                  enum: undefined,
                                  contentEncoding: undefined
                                }
                              ],
                              minOccurs: '0',
                              maxOccurs: '1',
                              name: 'Use_For_Reference',
                              type: 'Communication_Usage_BehaviorObjectType',
                              isComplex: true,
                              namespace: '',
                              maximum: '',
                              minimum: '',
                              maxLength: '',
                              minLength: '',
                              pattern: '',
                              enum: ''
                            },
                            {
                              children: [
                              ],
                              minOccurs: '0',
                              maxOccurs: '1',
                              name: 'Comments',
                              type: 'string',
                              isComplex: false,
                              namespace: '',
                              maximum: undefined,
                              minimum: undefined,
                              maxLength: undefined,
                              minLength: undefined,
                              pattern: undefined,
                              enum: undefined,
                              contentEncoding: undefined
                            }
                          ],
                          minOccurs: '1',
                          maxOccurs: '1',
                          name: 'Usage_Data',
                          type: 'Communication_Method_Usage_Information_DataType',
                          isComplex: true,
                          namespace: '',
                          maximum: '',
                          minimum: '',
                          maxLength: '',
                          minLength: '',
                          pattern: '',
                          enum: ''
                        },
                        {
                          children: [
                          ],
                          minOccurs: '1',
                          maxOccurs: '1',
                          name: '@E164_Formatted_Phone',
                          type: 'string',
                          isComplex: false,
                          namespace: '',
                          maximum: undefined,
                          minimum: undefined,
                          maxLength: undefined,
                          minLength: undefined,
                          pattern: undefined,
                          enum: undefined,
                          contentEncoding: undefined
                        },
                        {
                          children: [
                          ],
                          minOccurs: '1',
                          maxOccurs: '1',
                          name: '@Workday_Traditional_Formatted_Phone',
                          type: 'string',
                          isComplex: false,
                          namespace: '',
                          maximum: undefined,
                          minimum: undefined,
                          maxLength: undefined,
                          minLength: undefined,
                          pattern: undefined,
                          enum: undefined,
                          contentEncoding: undefined
                        },
                        {
                          children: [
                          ],
                          minOccurs: '1',
                          maxOccurs: '1',
                          name: '@Delete',
                          type: 'boolean',
                          isComplex: false,
                          namespace: '',
                          maximum: undefined,
                          minimum: undefined,
                          maxLength: undefined,
                          minLength: undefined,
                          pattern: undefined,
                          enum: undefined,
                          contentEncoding: undefined
                        },
                        {
                          children: [
                          ],
                          minOccurs: '1',
                          maxOccurs: '1',
                          name: '@Do_Not_Replace_All',
                          type: 'boolean',
                          isComplex: false,
                          namespace: '',
                          maximum: undefined,
                          minimum: undefined,
                          maxLength: undefined,
                          minLength: undefined,
                          pattern: undefined,
                          enum: undefined,
                          contentEncoding: undefined
                        }
                      ],
                      minOccurs: '1',
                      maxOccurs: '1',
                      name: 'Phone_Data',
                      type: 'Phone_Information_DataType',
                      isComplex: true,
                      namespace: '',
                      maximum: '',
                      minimum: '',
                      maxLength: '',
                      minLength: '',
                      pattern: '',
                      enum: ''
                    }
                  ],
                  minOccurs: '1',
                  maxOccurs: '1',
                  name: 'Contact_Data',
                  type: 'Contact_Information_DataType',
                  isComplex: true,
                  namespace: '',
                  maximum: '',
                  minimum: '',
                  maxLength: '',
                  minLength: '',
                  pattern: '',
                  enum: ''
                }
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'Location_Data',
              type: 'Location_iDataType',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Put_Location_Request',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: true,
          contentEncoding: undefined
        }
      ],
      simpleTypeElements = [
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Communication_Usage_TypeReferenceEnumeration',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Communication_Usage_BehaviorReferenceEnumeration',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Address_ReferenceReferenceEnumeration',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Phone_ReferenceReferenceEnumeration',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Phone_Device_TypeReferenceEnumeration',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Location_HierarchyReferenceEnumeration',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Integration_Document_FieldReferenceEnumeration',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        }
      ],
      complexTypeElements = [
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@System_ID',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'IDType',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: '',
              minOccurs: '1',
              maxOccurs: '1',
              name: '@type',
              type: 'Integration_Document_FieldReferenceEnumeration',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            },
            {
              children: [
              ],
              minOccurs: '0',
              maxOccurs: '1',
              name: '@parent_id',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            },
            {
              children: [
              ],
              minOccurs: '0',
              maxOccurs: '1',
              name: '@parent_type',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Integration_Document_FieldObjectIDType',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Descriptor',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Integration_Document_FieldObjectType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
                {
                  children: [
                  ],
                  minOccurs: '1',
                  maxOccurs: '1',
                  name: '@Descriptor',
                  type: 'string',
                  isComplex: false,
                  namespace: '',
                  maximum: undefined,
                  minimum: undefined,
                  maxLength: undefined,
                  minLength: undefined,
                  pattern: undefined,
                  enum: undefined,
                  contentEncoding: undefined
                }
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'Integration_Document_FieldObjectType',
              type: 'complex',
              isComplex: true,
              namespace: 'urn:com.workday/bsvc',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              isElement: false,
              contentEncoding: undefined
            },
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'Value',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Document_Field_Result_DataType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: '',
              minOccurs: '1',
              maxOccurs: '1',
              name: '@type',
              type: 'Location_HierarchyReferenceEnumeration',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Location_HierarchyObjectIDType',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Descriptor',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Location_HierarchyObjectType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'External_Integration_ID_DataType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: '',
              minOccurs: '1',
              maxOccurs: '1',
              name: '@type',
              type: 'Phone_Device_TypeReferenceEnumeration',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Phone_Device_TypeObjectIDType',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Descriptor',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Phone_Device_TypeObjectType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: '',
              minOccurs: '1',
              maxOccurs: '1',
              name: '@type',
              type: 'Phone_ReferenceReferenceEnumeration',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Phone_ReferenceObjectIDType',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Descriptor',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Phone_ReferenceObjectType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: '',
              minOccurs: '1',
              maxOccurs: '1',
              name: '@type',
              type: 'Address_ReferenceReferenceEnumeration',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Address_ReferenceObjectIDType',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Descriptor',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Address_ReferenceObjectType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: '',
              minOccurs: '1',
              maxOccurs: '1',
              name: '@type',
              type: 'Communication_Usage_BehaviorReferenceEnumeration',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Communication_Usage_BehaviorObjectIDType',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Descriptor',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Communication_Usage_BehaviorObjectType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: '',
              minOccurs: '1',
              maxOccurs: '1',
              name: '@type',
              type: 'Communication_Usage_TypeReferenceEnumeration',
              isComplex: true,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: ''
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Communication_Usage_TypeObjectIDType',
          type: 'string',
          isComplex: false,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Descriptor',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Communication_Usage_TypeObjectType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
                {
                  children: [
                  ],
                  minOccurs: '1',
                  maxOccurs: '1',
                  name: '@Descriptor',
                  type: 'string',
                  isComplex: false,
                  namespace: '',
                  maximum: undefined,
                  minimum: undefined,
                  maxLength: undefined,
                  minLength: undefined,
                  pattern: undefined,
                  enum: undefined,
                  contentEncoding: undefined
                }
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'Communication_Usage_TypeObjectType',
              type: 'complex',
              isComplex: true,
              namespace: 'urn:com.workday/bsvc',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              isElement: false,
              contentEncoding: undefined
            },
            {
              children: [
              ],
              minOccurs: '0',
              maxOccurs: '1',
              name: '@Primary',
              type: 'boolean',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Communication_Usage_Type_DataType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '0',
              maxOccurs: '1',
              name: 'Comments',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Communication_Method_Usage_Information_DataType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@E164_Formatted_Phone',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            },
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Workday_Traditional_Formatted_Phone',
              type: 'string',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            },
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Delete',
              type: 'boolean',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            },
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: '@Do_Not_Replace_All',
              type: 'boolean',
              isComplex: false,
              namespace: '',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Phone_Information_DataType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Address_Information_DataType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Contact_Information_DataType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'Contact_Information_DataType',
              type: 'complex',
              isComplex: true,
              namespace: 'urn:com.workday/bsvc',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              isElement: false,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'Location_iDataType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
                {
                  children: [
                  ],
                  minOccurs: '1',
                  maxOccurs: '1',
                  name: 'Contact_Information_DataType',
                  type: 'complex',
                  isComplex: true,
                  namespace: 'urn:com.workday/bsvc',
                  maximum: undefined,
                  minimum: undefined,
                  maxLength: undefined,
                  minLength: undefined,
                  pattern: undefined,
                  enum: undefined,
                  isElement: false,
                  contentEncoding: undefined
                }
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'Location_iDataType',
              type: 'complex',
              isComplex: true,
              namespace: 'urn:com.workday/bsvc',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              isElement: false,
              contentEncoding: undefined
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'Put_Location_RequestType',
          type: 'complex',
          isComplex: true,
          namespace: 'urn:com.workday/bsvc',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: false,
          contentEncoding: undefined
        }
      ],
      allElements = {
        simpleTypeElements,
        complexTypeElements,
        elements
      },
      resolver = new ElementResolver(allElements);
    resolver.resolveAll();
    let newElements = allElements.elements;
    expect(newElements).to.be.an('array');
    expect(newElements[0].children[0].children[0].children[0].children[0].children[0].name).to.equal('Type_Data');
    expect(newElements[0].children[0].children[0].children[0].children[0].children[1].name)
      .to.equal('Use_For_Reference');
    expect(newElements[0].children[0].children[0].children[0].children[0].children[2].name).to.equal('Comments');
    expect(newElements[0].children[0].children[0].children[1].children[0].children[0].name).to.equal('Type_Data');
    expect(newElements[0].children[0].children[0].children[1].children[0].children[1].name)
      .to.equal('Use_For_Reference');
    expect(newElements[0].children[0].children[0].children[1].children[0].children[2].name).to.equal('Comments');
  });

  it('Should resolve loop in elements A - B - A', function() {
    const elements = [
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'user_id',
              type: 'string',
              isComplex: false,
              namespace: 'http://tempuri.org/',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'returnLiveDeedsSearchHttpGetIn',
          type: 'complex',
          isComplex: true,
          namespace: 'http://tempuri.org/',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: true,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '',
              maxOccurs: '',
              name: 'returnLiveDeedsSearchResult',
              type: 'error',
              isComplex: false,
              namespace: '',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: '',
              originalType: 'DeedsResult'
            }
          ],
          minOccurs: '1',
          maxOccurs: '1',
          name: 'returnLiveDeedsSearchResponse',
          type: 'complex',
          isComplex: true,
          namespace: 'http://tempuri.org/',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: true,
          contentEncoding: undefined
        },
        {
          children: [
            {
              children: [
              ],
              minOccurs: '1',
              maxOccurs: '1',
              name: 'ReportId',
              type: 'string',
              isComplex: false,
              namespace: 'http://tempuri.org/',
              maximum: undefined,
              minimum: undefined,
              maxLength: undefined,
              minLength: undefined,
              pattern: undefined,
              enum: undefined,
              contentEncoding: undefined
            },
            {
              children: [
                {
                  children: [
                  ],
                  minOccurs: '',
                  maxOccurs: '',
                  name: 'returnLiveDeedsSearchResult',
                  type: 'error',
                  isComplex: false,
                  namespace: '',
                  maximum: '',
                  minimum: '',
                  maxLength: '',
                  minLength: '',
                  pattern: '',
                  enum: '',
                  originalType: 'DeedsResult'
                }
              ],
              minOccurs: '0',
              maxOccurs: '1',
              name: 'Persons',
              type: 'returnLiveDeedsSearchResponse',
              isComplex: true,
              namespace: 'http://tempuri.org/',
              maximum: '',
              minimum: '',
              maxLength: '',
              minLength: '',
              pattern: '',
              enum: '',
              isElement: true
            }
          ],
          minOccurs: '0',
          maxOccurs: '1',
          name: 'DeedsResult',
          type: 'complex',
          isComplex: true,
          namespace: 'http://tempuri.org/',
          maximum: undefined,
          minimum: undefined,
          maxLength: undefined,
          minLength: undefined,
          pattern: undefined,
          enum: undefined,
          isElement: true,
          contentEncoding: undefined
        }
      ],
      allElements = {
        simpleTypeElements: [],
        complexTypeElements: [],
        elements
      },
      resolver = new ElementResolver(allElements);
    resolver.resolveAll();
    let newElements = allElements.elements;
    expect(newElements).to.be.an('array');
    expect(newElements[0].name).to.equal('returnLiveDeedsSearchHttpGetIn');
    expect(newElements[1].name).to.equal('returnLiveDeedsSearchResponse');
    expect(newElements[2].name).to.equal('DeedsResult');

  });
});
