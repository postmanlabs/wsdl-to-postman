module.exports =
[
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "xsd:import": {
        "@_namespace": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      },
      "xsd:group": [
        {
          "@_name": "Ext00163E04D8151EE49FE3AD591AB9EE65",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "IDcommandeMagento",
              "@_minOccurs": "0",
              "@_form": "qualified",
              "@_type": "xi25:Ext00163E04D8151EE49FE3A85B2D112E5A",
            },
          },
        },
        {
          "@_name": "Ext00163E20A6261EE6ADF4C83E018DDFF1",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "NumroScuritSociale",
              "@_minOccurs": "0",
              "@_form": "qualified",
              "@_type": "xi25:Ext00163E20A6261EE6ADF4C386A5C71FF0",
            },
          },
        },
        {
          "@_name": "Ext00163E34EC461ED7AECD7D407D8CDBE4",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "OriginProductCode",
              "@_minOccurs": "0",
              "@_form": "qualified",
              "@_type": "xi25:Ext00163E34EC461ED7AECD6855BAEB1B7B",
            },
          },
        },
      ],
      "xsd:attributeGroup": [
        {
          "@_name": "Ext00163E04D8151EE49FE3AD591AB9EE65",
        },
        {
          "@_name": "Ext00163E20A6261EE6ADF4C83E018DDFF1",
        },
        {
          "@_name": "Ext00163E34EC461ED7AECD7D407D8CDBE4",
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/AP/Globalization",
      "xsd:import": [
        {
          "@_namespace": "http://{{url}}/xi/AP/Common/Global",
        },
        {
          "@_namespace": "http://{{url}}/xi/AP/Common/GDT",
        },
      ],
      "xsd:complexType": {
        "@_name": "CroatiaPaymentMethodCode",
        "xsd:annotation": {
          "xsd:documentation": {
            "@_xml:lang": "EN",
            "ccts:RepresentationTerm": "Code",
          },
        },
        "xsd:simpleContent": {
          "xsd:extension": {
            "@_base": "CroatiaPaymentMethodCode.Content",
            "xsd:attribute": [
              {
                "@_name": "listID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
              {
                "@_name": "listVersionID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "15",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
              {
                "@_name": "listAgencyID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            ],
          },
        },
      },
      "xsd:simpleType": [
        {
          "@_name": "CroatiaPaymentMethodCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "1",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "GLOBusinessSpaceID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "20",
            },
          },
        },
        {
          "@_name": "HR_BillingMachineID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "20",
            },
            "xsd:pattern": {
              "@_value": "\\d+",
            },
          },
        },
      ],
      "xsd:group": {
        "@_name": "SalesOrderMaintainRequestPaymentControlCH_Extension",
        "xsd:sequence": {
          "xsd:element": [
            {
              "@_name": "PaymentServiceCustomerID",
              "@_minOccurs": "0",
              "@_form": "qualified",
              "@_type": "xi20:PaymentServiceCustomerID",
            },
            {
              "@_name": "PaymentServiceSubscriberID",
              "@_minOccurs": "0",
              "@_form": "qualified",
              "@_type": "xi20:PaymentServiceSubscriberID",
            },
            {
              "@_name": "HouseBankAccountKey",
              "@_minOccurs": "0",
              "@_form": "qualified",
              "@_type": "xi18:HouseBankAccountKey",
            },
          ],
        },
      },
      "xsd:attributeGroup": {
        "@_name": "SalesOrderMaintainRequestPaymentControlCH_Extension",
      },
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/AP/Globalization",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/SAPGlobal20/Global",
      "xsd:import": {
        "@_namespace": "http://{{url}}/xi/A1S/Global",
      },
      "xsd:element": [
        {
          "@_name": "SalesOrderBundleMaintainConfirmation_sync",
          "@_type": "xi19:SalesOrderMaintainConfirmationBundleMessage_sync",
        },
        {
          "@_name": "SalesOrderBundleMaintainRequest_sync",
          "@_type": "xi19:SalesOrderMaintainRequestBundleMessage_sync",
        },
        {
          "@_name": "SalesOrderRequestBundleCheckMaintainQuery_sync",
          "@_type": "xi19:SalesOrderMaintainRequestBundleMessage_sync",
        },
        {
          "@_name": "SalesOrderRequestBundleCheckMaintainResponse_sync",
          "@_type": "xi19:SalesOrderMaintainConfirmationBundleMessage_sync",
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/SAPGlobal20/Global",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/AP/Common/Global",
      "xsd:import": {
        "@_namespace": "http://{{url}}/xi/AP/Common/GDT",
      },
      "xsd:complexType": [
        {
          "@_name": "ExchangeFaultData",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "faultText",
                "@_type": "xsd:string",
              },
              {
                "@_name": "faultUrl",
                "@_type": "xsd:string",
                "@_minOccurs": "0",
              },
              {
                "@_name": "faultDetail",
                "@_type": "ExchangeLogData",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
        },
        {
          "@_name": "ExchangeLogData",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "severity",
                "@_type": "xsd:string",
                "@_minOccurs": "0",
              },
              {
                "@_name": "text",
                "@_type": "xsd:string",
              },
              {
                "@_name": "url",
                "@_type": "xsd:string",
                "@_minOccurs": "0",
              },
              {
                "@_name": "id",
                "@_type": "xsd:string",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "HouseBankAccountKey",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "CompanyUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "InternalID",
                "@_type": "xi20:BankAccountInternalID",
              },
            ],
          },
        },
        {
          "@_name": "ProjectTaskKey",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "TaskID",
              "@_type": "xi20:ProjectElementID",
            },
          },
        },
        {
          "@_name": "RequirementSpecificationKey",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "RequirementSpecificationID",
                "@_type": "xi20:RequirementSpecificationID",
              },
              {
                "@_name": "RequirementSpecificationVersionID",
                "@_type": "xi20:VersionID",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "StandardFaultMessageExtension",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "Log",
              "@_type": "xi20:Log",
              "@_minOccurs": "0",
            },
          },
        },
      ],
      "xsd:simpleType": {
        "@_name": "LEN120_LANGUAGEINDEPENDENT_Text",
        "xsd:annotation": {
          "xsd:documentation": {
            "@_xml:lang": "EN",
            "ccts:RepresentationTerm": "Text",
          },
        },
        "xsd:restriction": {
          "@_base": "xsd:string",
          "xsd:maxLength": {
            "@_value": "120",
          },
          "xsd:minLength": {
            "@_value": "1",
          },
        },
      },
      "xsd:element": {
        "@_name": "StandardFaultMessage",
        "xsd:complexType": {
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "standard",
                "@_type": "ExchangeFaultData",
              },
              {
                "@_name": "addition",
                "@_type": "StandardFaultMessageExtension",
              },
            ],
          },
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/AP/Common/Global",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/A1S/Global",
      "xsd:import": [
        {
          "@_namespace": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
        },
        {
          "@_namespace": "http://{{url}}/xi/AP/Common/Global",
        },
        {
          "@_namespace": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
        },
        {
          "@_namespace": "http://{{url}}/xi/AP/Globalization",
        },
        {
          "@_namespace": "http://{{url}}/xi/DocumentServices/Global",
        },
        {
          "@_namespace": "http://{{url}}/xi/BASIS/Global",
        },
        {
          "@_namespace": "http://{{url}}/xi/AP/Common/GDT",
        },
      ],
      "xsd:complexType": [
        {
          "@_name": "SalesOrderMaintainConfirmationBundle",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ChangeStateID",
                "@_type": "xi20:ChangeStateID",
              },
              {
                "@_name": "ReferenceObjectNodeSenderTechnicalID",
                "@_type": "xi20:ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
              },
              {
                "@_name": "ID",
                "@_type": "xi20:BusinessTransactionDocumentID",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainConfirmationBundleMessage_sync",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "SalesOrder",
                "@_type": "SalesOrderMaintainConfirmationBundle",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "Log",
                "@_type": "xi20:Log",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequest",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ObjectNodeSenderTechnicalID",
                "@_type": "xi20:ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ID",
                "@_type": "xi20:BusinessTransactionDocumentID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuyerID",
                "@_type": "xi20:BusinessTransactionDocumentID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PostingDate",
                "@_type": "xi21:GLOBAL_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Name",
                "@_type": "xi20:EXTENDED_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DataOriginTypeCode",
                "@_type": "xi20:CustomerTransactionDocumentDataOriginTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FulfillmentBlockingReasonCode",
                "@_type": "xi20:CustomerTransactionDocumentFulfilmentBlockingReasonCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ReleaseCustomerRequest",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ReleaseAllItemsToExecution",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FinishFulfilmentProcessingOfAllItems",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BusinessTransactionDocumentReference",
                "@_type": "SalesOrderMaintainRequestBusinessTransactionDocumentReference",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "SalesAndServiceBusinessArea",
                "@_type": "SalesOrderMaintainRequestSalesAndServiceBusinessArea",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BillToParty",
                "@_type": "SalesOrderMaintainRequestPartyParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AccountParty",
                "@_type": "SalesOrderMaintainRequestPartyParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PayerParty",
                "@_type": "SalesOrderMaintainRequestPartyParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductRecipientParty",
                "@_type": "SalesOrderMaintainRequestPartyParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SalesPartnerParty",
                "@_type": "SalesOrderMaintainRequestPartyParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FreightForwarderParty",
                "@_type": "SalesOrderMaintainRequestPartyParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EmployeeResponsibleParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SellerParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SalesUnitParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ServiceExecutionTeamParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ServicePerformerParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SalesEmployeeParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BillFromParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RequestedFulfillmentPeriodPeriodTerms",
                "@_type": "SalesOrderMaintainRequestRequestedFulfillmentPeriodPeriodTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DeliveryTerms",
                "@_type": "SalesOrderMaintainRequestDeliveryTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PricingTerms",
                "@_type": "SalesOrderMaintainRequestPricingTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SalesTerms",
                "@_type": "SalesOrderMaintainRequestSalesTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "InvoiceTerms",
                "@_type": "SalesOrderMaintainRequestInvoiceTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Item",
                "@_type": "SalesOrderMaintainRequestItem",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "CashDiscountTerms",
                "@_type": "SalesOrderMaintainRequestCashDiscountTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentControl",
                "@_type": "SalesOrderMaintainRequestPaymentControl",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PriceAndTaxCalculation",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculation",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TextCollection",
                "@_type": "SalesOrderMaintainRequestTextCollection",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AttachmentFolder",
                "@_type": "xi22:MaintenanceAttachmentFolder",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ChangeStateID",
                "@_type": "xi20:ChangeStateID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CroatiaBusinessSpaceID",
                "@_type": "xi16:GLOBusinessSpaceID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CroatiaBillingMachineID",
                "@_type": "xi16:HR_BillingMachineID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CroatiaPaymentMethodCode",
                "@_type": "xi16:CroatiaPaymentMethodCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CroatiaPartyTaxID",
                "@_type": "xi20:PartyTaxID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CroatiaParagonBillMark",
                "@_type": "xi20:LANGUAGEINDEPENDENT_Text",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CroatiaSpecialNote",
                "@_type": "xi20:LANGUAGEINDEPENDENT_Text",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SendConfirmationIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
            "xsd:group": [
              {
                "@_ref": "xi0:Ext00163E04D8151EE49FE3AD591AB9EE65",
              },
              {
                "@_ref": "xi0:Ext00163E20A6261EE6ADF4C83E018DDFF1",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "itemListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "businessTransactionDocumentReferenceListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestBundleMessage_sync",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "BasicMessageHeader",
                "@_type": "xi20:BusinessDocumentBasicMessageHeader",
              },
              {
                "@_name": "SalesOrder",
                "@_type": "SalesOrderMaintainRequest",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestBusinessTransactionDocumentReference",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "BusinessTransactionDocumentReference",
                "@_type": "xi20:BusinessTransactionDocumentReference",
              },
              {
                "@_name": "BusinessTransactionDocumentRelationshipRoleCode",
                "@_type": "xi20:BusinessTransactionDocumentRelationshipRoleCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DataProviderIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestCashDiscountTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "Code",
                "@_type": "xi20:CashDiscountTermsCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentBaselineDate",
                "@_type": "xi21:Date",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestDeliveryTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "DeliveryPriorityCode",
                "@_type": "xi20:PriorityCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Incoterms",
                "@_type": "xi20:Incoterms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PartialDeliveryControlCode",
                "@_type": "xi20:PartialDeliveryControlCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CompleteDeliveryRequestedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestInvoiceTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ProposedInvoiceDate",
                "@_type": "xi20:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "InvoicingBlockingReasonCode",
                "@_type": "xi20:InvoicingBlockingReasonCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestItem",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ObjectNodeSenderTechnicalID",
                "@_type": "xi20:ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ID",
                "@_type": "xi20:BusinessTransactionDocumentItemID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuyerID",
                "@_type": "xi20:BusinessTransactionDocumentItemID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProcessingTypeCode",
                "@_type": "xi20:BusinessTransactionDocumentItemProcessingTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PostingDate",
                "@_type": "xi21:GLOBAL_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Description",
                "@_type": "xi20:SHORT_Description",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FulfilmentPartyCategoryCode",
                "@_type": "xi20:FulfilmentPartyCategoryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ReleaseToExecute",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FinishFulfilmentProcessing",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemBusinessTransactionDocumentReference",
                "@_type": "SalesOrderMaintainRequestBusinessTransactionDocumentReference",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "ItemProduct",
                "@_type": "SalesOrderMaintainRequestItemProduct",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemDeliveryTerms",
                "@_type": "SalesOrderMaintainRequestItemDeliveryTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemSalesTerms",
                "@_type": "SalesOrderMaintainRequestItemSalesTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemServiceTerms",
                "@_type": "SalesOrderMaintainRequestItemServiceTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemScheduleLine",
                "@_type": "SalesOrderMaintainRequestItemScheduleLine",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "ProductRecipientItemParty",
                "@_type": "SalesOrderMaintainRequestPartyParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "VendorItemParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ServicePerformerItemParty",
                "@_type": "SalesOrderMaintainRequestPartyIDParty",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ShipFromItemLocation",
                "@_type": "SalesOrderMaintainRequestItemLocation",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemAccountingCodingBlockDistribution",
                "@_type": "SalesOrderMaintainRequestItemAccountingCodingBlockDistribution",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PriceAndTaxCalculationItem",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationItem",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemTextCollection",
                "@_type": "SalesOrderMaintainRequestTextCollection",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemAttachmentFolder",
                "@_type": "xi22:MaintenanceAttachmentFolder",
                "@_minOccurs": "0",
              },
            ],
            "xsd:group": {
              "@_ref": "xi0:Ext00163E34EC461ED7AECD7D407D8CDBE4",
            },
          },
          "xsd:attribute": [
            {
              "@_name": "itemScheduleLineListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "itemBusinessTransactionDocumentReferenceListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestItemAccountingCodingBlockDistribution",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "AccountingCodingBlockAssignment",
              "@_type": "SalesOrderMaintainRequestItemAccountingCodingBlockDistributionAccountingCodingBlockAssignment",
              "@_minOccurs": "0",
            },
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestItemAccountingCodingBlockDistributionAccountingCodingBlockAssignment",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "ProjectTaskKey",
              "@_type": "xi18:ProjectTaskKey",
              "@_minOccurs": "0",
            },
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestItemDeliveryTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "DeliveryPriorityCode",
                "@_type": "xi20:PriorityCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Incoterms",
                "@_type": "xi20:Incoterms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PartialDeliveryControlCode",
                "@_type": "xi20:PartialDeliveryControlCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestItemLocation",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "LocationID",
              "@_type": "xi20:LocationID",
              "@_minOccurs": "0",
            },
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestItemProduct",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ProductID",
                "@_type": "xi20:NOCONVERSION_ProductID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductInternalID",
                "@_type": "xi20:ProductInternalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductStandardID",
                "@_type": "xi20:ProductStandardID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductBuyerID",
                "@_type": "xi20:ProductPartyID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UnitOfMeasure",
                "@_type": "xi20:MeasureUnitCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductRequirementSpecificationKey",
                "@_type": "xi18:RequirementSpecificationKey",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductTypeCode",
                "@_type": "xi20:ProductTypeCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestItemSalesTerms",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "CancellationReasonCode",
              "@_type": "xi20:CancellationReasonCode",
              "@_minOccurs": "0",
            },
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestItemScheduleLine",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ObjectNodeSenderTechnicalID",
                "@_type": "xi20:ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ID",
                "@_type": "xi20:BusinessTransactionDocumentItemScheduleLineID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TypeCode",
                "@_type": "xi20:BusinessTransactionDocumentItemScheduleLineTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Quantity",
                "@_type": "xi20:Quantity",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DateTimePeriod",
                "@_type": "xi20:UPPEROPEN_LOCALNORMALISED_DateTimePeriod",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestItemServiceTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ConfirmationRelevanceIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EmployeeTimeConfirmationRelevanceIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExpenseReportingConfirmationRelevanceIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ServiceWorkingConditionsCode",
                "@_type": "xi20:ServiceWorkingConditionsCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ServicePlannedDuration",
                "@_type": "xi20:Duration",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ResourceID",
                "@_type": "xi20:ResourceID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProjectTaskID",
                "@_type": "xi20:ProjectElementID",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyAddress",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "CorrespondenceLanguageCode",
                "@_type": "xi21:LanguageCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Email",
                "@_type": "SalesOrderMaintainRequestPartyAddressEmail",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "Facsimile",
                "@_type": "SalesOrderMaintainRequestPartyAddressFascmile",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "Telephone",
                "@_type": "SalesOrderMaintainRequestPartyAddressTelephone",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "Web",
                "@_type": "SalesOrderMaintainRequestPartyAddressWeb",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "DisplayName",
                "@_type": "SalesOrderMaintainRequestPartyAddressDisplayName",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "Name",
                "@_type": "SalesOrderMaintainRequestPartyAddressName",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "PostalAddress",
                "@_type": "SalesOrderMaintainRequestPartyAddressPostalAddress",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyAddressDisplayName",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "FormattedName",
              "@_type": "xi20:LONG_Name",
              "@_minOccurs": "0",
            },
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyAddressEmail",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "URI",
                "@_type": "xi20:EmailURI",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DefaultIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UsageDeniedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyAddressFascmile",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "Number",
                "@_type": "xi20:PhoneNumber",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FormattedNumberDescription",
                "@_type": "xi20:LANGUAGEINDEPENDENT_SHORT_Description",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DefaultIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UsageDeniedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyAddressName",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "AddressRepresentationCode",
                "@_type": "xi20:AddressRepresentationCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Name",
                "@_type": "xi20:OrganisationName",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyAddressPostalAddress",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "AddressRepresentationCode",
                "@_type": "xi20:AddressRepresentationCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CountryCode",
                "@_type": "xi20:CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RegionCode",
                "@_type": "xi20:RegionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CountyName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CityName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AdditionalCityName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DistrictName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "StreetPostalCode",
                "@_type": "xi20:PostalCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "POBoxPostalCode",
                "@_type": "xi20:PostalCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CompanyPostalCode",
                "@_type": "xi20:PostalCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "StreetPrefixName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AdditionalStreetPrefixName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "StreetName",
                "@_type": "xi20:StreetName",
                "@_minOccurs": "0",
              },
              {
                "@_name": "StreetSuffixName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AdditionalStreetSuffixName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "HouseID",
                "@_type": "xi20:HouseID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuildingID",
                "@_type": "xi20:BuildingID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RoomID",
                "@_type": "xi20:RoomID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FloorID",
                "@_type": "xi20:FloorID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CareOfName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "POBoxDeviatingCountryCode",
                "@_type": "xi20:CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "POBoxDeviatingRegionCode",
                "@_type": "xi20:RegionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "POBoxDeviatingCityName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "POBoxID",
                "@_type": "xi20:POBoxID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "POBoxIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxJurisdictionCode",
                "@_type": "xi20:TaxJurisdictionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TimeZoneCode",
                "@_type": "xi20:TimeZoneCode",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyAddressTelephone",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "Number",
                "@_type": "xi20:PhoneNumber",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FormattedNumberDescription",
                "@_type": "xi20:LANGUAGEINDEPENDENT_SHORT_Description",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DefaultConventionalPhoneNumberIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DefaultMobilePhoneNumberIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UsageDeniedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "MobilePhoneNumberIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SMSEnabledIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyAddressWeb",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "URI",
                "@_type": "xi20:WebURI",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DefaultIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UsageDeniedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyContactParty",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ObjectNodeSenderTechnicalID",
                "@_type": "xi20:ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PartyID",
                "@_type": "xi20:PartyID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AddressHostUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Address",
                "@_type": "SalesOrderMaintainRequestPartyAddress",
                "@_minOccurs": "0",
              },
              {
                "@_name": "MainIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyIDParty",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "PartyID",
                "@_type": "xi20:PartyID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ContactParty",
                "@_type": "SalesOrderMaintainRequestPartyContactParty",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "partyContactPartyListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestPartyParty",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "PartyID",
                "@_type": "xi20:PartyID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AddressHostUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Address",
                "@_type": "SalesOrderMaintainRequestPartyAddress",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ContactParty",
                "@_type": "SalesOrderMaintainRequestPartyContactParty",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "partyContactPartyListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestPaymentControl",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "PaymentProcessingCompanyUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentProcessingCompanyID",
                "@_type": "xi20:OrganisationalCentreID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentProcessingBusinessPartnerUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentProcessingBusinessPartnerID",
                "@_type": "xi20:BusinessPartnerInternalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ResponsibleEmployeeUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ResponsibleEmployeeID",
                "@_type": "xi20:BusinessPartnerInternalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PropertyMovementDirectionCode",
                "@_type": "xi20:PropertyMovementDirectionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentFormCode",
                "@_type": "xi20:PaymentFormCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentAmount",
                "@_type": "xi20:Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExchangeRate",
                "@_type": "xi20:ExchangeRate",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentBlock",
                "@_type": "xi20:PaymentBlock",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FirstPaymentInstructionTypeCode",
                "@_type": "xi20:PaymentInstructionTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SecondPaymentInstructionTypeCode",
                "@_type": "xi20:PaymentInstructionTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ThirdPaymentInstructionTypeCode",
                "@_type": "xi20:PaymentInstructionTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FourthPaymentInstructionTypeCode",
                "@_type": "xi20:PaymentInstructionTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BankChargeBearerCode",
                "@_type": "xi20:BankChargeBearerCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentPriorityCode",
                "@_type": "xi20:PriorityCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SinglePaymentIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DebitValueDate",
                "@_type": "xi21:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CreditValueDate",
                "@_type": "xi21:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentReceivablesPayablesGroupID",
                "@_type": "xi20:BusinessTransactionDocumentGroupID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentReferenceID",
                "@_type": "xi20:PaymentReferenceID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentReferenceTypeCode",
                "@_type": "xi20:PaymentReferenceTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Note",
                "@_type": "xi20:MEDIUM_Note",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExternalPayment",
                "@_type": "SalesOrderMaintainRequestPaymentControlExternalPayment",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "CreditCardPayment",
                "@_type": "SalesOrderMaintainRequestPaymentControlCreditCardPayment",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
            "xsd:group": {
              "@_ref": "xi16:SalesOrderMaintainRequestPaymentControlCH_Extension",
            },
          },
          "xsd:attribute": [
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
            {
              "@_name": "externalPaymentListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "creditCardPaymentListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestPaymentControlCreditCardPayment",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardKey",
                "@_type": "xi28:PaymentCardKey",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BusinessPartnerPaymentCardDetailsKeyID",
                "@_type": "xi20:BusinessPartnerPaymentCardDetailsID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardDataOriginTypeCode",
                "@_type": "xi20:DataOriginTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardAutomaticallyGeneratedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DeviceID",
                "@_type": "xi20:DeviceID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "LocationInternalID",
                "@_type": "xi20:LocationInternalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ClearingHouseAccountUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ClearingHouseAccountKeyID",
                "@_type": "xi20:ClearingHouseAccountID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardVerificationValueText",
                "@_type": "xi20:PaymentCardVerificationValueText",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardVerificationValueAvailabilityCode",
                "@_type": "xi20:PaymentCardVerificationValueAvailabilityCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardVerificationValueCheckRequiredIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AuthorisationRequiredIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AuthorisationLimitAmount",
                "@_type": "xi20:Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AuthorisationValueUnlimitedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Amount",
                "@_type": "xi20:Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentAuthorisedAmount",
                "@_type": "xi20:Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CompanyClearingHouseID",
                "@_type": "xi20:PartyPartyID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CreditCardPaymentAuthorisation",
                "@_type": "SalesOrderMaintainRequestPaymentControlCreditCardPaymentCreditCardPaymentAuthorisation",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "creditCardPaymentAuthorisationListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestPaymentControlCreditCardPaymentCreditCardPaymentAuthorisation",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ID",
                "@_type": "xi20:PaymentCardPaymentAuthorisationPartyID_V1",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ClearingHouseID",
                "@_type": "xi20:PaymentCardPaymentAuthorisationPartyID_V1",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProviderID",
                "@_type": "xi20:PaymentCardPaymentAuthorisationPartyID_V1",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardHolderAuthenticationID",
                "@_type": "xi20:PaymentCardHolderAuthenticationID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardHolderAuthenticationResultCode",
                "@_type": "xi20:PaymentCardHolderAuthenticationResultCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardHolderAuthenticationTokenText",
                "@_type": "xi20:PaymentCardHolderAuthenticationTokenText",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DateTime",
                "@_type": "xi21:GLOBAL_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardTransactionTypeCode",
                "@_type": "xi20:PaymentCardTransactionTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PreAuthorisationIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Amount",
                "@_type": "xi20:Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExpirationDateTime",
                "@_type": "xi21:GLOBAL_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ActiveIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AppliedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ResultCode",
                "@_type": "xi20:AuthorisationResultCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardAddressVerificationResultCode",
                "@_type": "xi20:PaymentCardAddressVerificationResultCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductRecipientPartyPaymentCardAddressVerificationResultCode",
                "@_type": "xi20:PaymentCardAddressVerificationResultCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardVerificationResultCode",
                "@_type": "xi20:PaymentCardVerificationResultCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentCardVerificationValueVerificationResultCode",
                "@_type": "xi20:PaymentCardVerificationValueVerificationResultCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ResultDescription",
                "@_type": "xi20:SHORT_Description",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPaymentControlExternalPayment",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "HouseBankAccountUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "HouseBankAccountKeyInternalID",
                "@_type": "xi20:BankAccountInternalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PaymentTransactionReferenceID",
                "@_type": "xi20:PaymentTransactionReferenceID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DocumentDate",
                "@_type": "xi20:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ValueDate",
                "@_type": "xi20:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Amount",
                "@_type": "xi20:Amount",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculation",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "MainDiscount",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationMainDiscount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PriceComponent",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationPriceComponent",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "ProductTaxDetails",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationProductTaxDetails",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "TaxationTerms",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationTaxationTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "WithholdingTaxDetails",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationWithholdingTaxDetails",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "priceComponentListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "productTaxDetailsListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "withholdingTaxDetailsListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationItem",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "CountryCode",
                "@_type": "xi20:CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxationCharacteristicsCode",
                "@_type": "xi20:ProductTaxationCharacteristicsCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxJurisdictionCode",
                "@_type": "xi20:TaxJurisdictionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "WithholdingTaxationCharacteristicsCode",
                "@_type": "xi20:WithholdingTaxationCharacteristicsCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemMainDiscount",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemMainDiscount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemMainPrice",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemMainPrice",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemPriceComponent",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemPriceComponent",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "ItemProductTaxDetails",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemProductTaxDetails",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "ItemTaxationTerms",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemTaxationTerms",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemWithholdingTaxDetails",
                "@_type": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemWithholdingTaxDetails",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "itemPriceComponentListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "itemProductTaxDetailsListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "itemWithholdingTaxDetailsListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemMainDiscount",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "Description",
                "@_type": "xi20:SHORT_Description",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Rate",
                "@_type": "xi20:Rate",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RateBaseQuantityTypeCode",
                "@_type": "xi20:QuantityTypeCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemMainPrice",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "Description",
                "@_type": "xi20:SHORT_Description",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Rate",
                "@_type": "xi20:Rate",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RateBaseQuantityTypeCode",
                "@_type": "xi20:QuantityTypeCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemPriceComponent",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ObjectNodeSenderTechnicalID",
                "@_type": "xi20:ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TypeCode",
                "@_type": "xi20:PriceSpecificationElementTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Description",
                "@_type": "xi20:SHORT_Description",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Rate",
                "@_type": "xi20:Rate",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RateBaseQuantityTypeCode",
                "@_type": "xi20:QuantityTypeCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemProductTaxDetails",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TransactionCurrencyProductTax",
                "@_type": "xi20:ProductTax",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemTaxationTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "SellerCountryCode",
                "@_type": "xi20:CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SellerTaxID",
                "@_type": "xi20:PartyTaxID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SellerTaxIdentificationNumberTypeCode",
                "@_type": "xi20:TaxIdentificationNumberTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuyerCountryCode",
                "@_type": "xi20:CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuyerTaxID",
                "@_type": "xi20:PartyTaxID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuyerTaxIdentificationNumberTypeCode",
                "@_type": "xi20:TaxIdentificationNumberTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EuropeanCommunityVATTriangulationIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxDate",
                "@_type": "xi20:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxDueDate",
                "@_type": "xi20:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxExemptionCertificateID",
                "@_type": "xi20:TaxExemptionCertificateID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxExemptionReasonCode",
                "@_type": "xi20:TaxExemptionReasonCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxExemptionReasonCodeRelevanceIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FollowUpTaxExemptionCertificateID",
                "@_type": "xi20:TaxExemptionCertificateID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductTaxStandardClassificationCode",
                "@_type": "xi20:ProductTaxStandardClassificationCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ProductTaxStandardClassificationSystemCode",
                "@_type": "xi20:ProductTaxStandardClassificationSystemCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationItemItemWithholdingTaxDetails",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "WithholdingTax",
                "@_type": "xi20:WithholdingTax",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TransactionCurrencyWithholdingTax",
                "@_type": "xi20:WithholdingTax",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationMainDiscount",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "Rate",
                "@_type": "xi20:Rate",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RateBaseQuantityTypeCode",
                "@_type": "xi20:QuantityTypeCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationPriceComponent",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ObjectNodeSenderTechnicalID",
                "@_type": "xi20:ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TypeCode",
                "@_type": "xi20:PriceSpecificationElementTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Rate",
                "@_type": "xi20:Rate",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RateBaseQuantityTypeCode",
                "@_type": "xi20:QuantityTypeCode",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationProductTaxDetails",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxationCharacteristicsCode",
                "@_type": "xi20:ProductTaxationCharacteristicsCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TransactionCurrencyProductTax",
                "@_type": "xi20:ProductTax",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationTaxationTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "SellerCountryCode",
                "@_type": "xi20:CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SellerTaxID",
                "@_type": "xi20:PartyTaxID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SellerTaxIdentificationNumberTypeCode",
                "@_type": "xi20:TaxIdentificationNumberTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuyerCountryCode",
                "@_type": "xi20:CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuyerTaxID",
                "@_type": "xi20:PartyTaxID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BuyerTaxIdentificationNumberTypeCode",
                "@_type": "xi20:TaxIdentificationNumberTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EuropeanCommunityVATTriangulationIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxDate",
                "@_type": "xi20:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxDueDate",
                "@_type": "xi20:Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxExemptionCertificateID",
                "@_type": "xi20:TaxExemptionCertificateID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxExemptionReasonCode",
                "@_type": "xi20:TaxExemptionReasonCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TaxExemptionReasonCodeRelevanceIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPriceAndTaxCalculationWithholdingTaxDetails",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "WithholdingTax",
                "@_type": "xi20:WithholdingTax",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TransactionCurrencyWithholdingTax",
                "@_type": "xi20:WithholdingTax",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestPricingTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "CurrencyCode",
                "@_type": "xi20:CurrencyCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PriceDateTime",
                "@_type": "xi21:LOCALNORMALISED_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "GrossAmountIndicator",
                "@_type": "xi20:Indicator",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestRequestedFulfillmentPeriodPeriodTerms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "StartDateTime",
                "@_type": "xi20:LOCALNORMALISED_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EndDateTime",
                "@_type": "xi20:LOCALNORMALISED_DateTime",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestSalesAndServiceBusinessArea",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "DistributionChannelCode",
              "@_type": "xi20:DistributionChannelCode",
              "@_minOccurs": "0",
            },
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestSalesTerms",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "CancellationReasonCode",
              "@_type": "xi20:CancellationReasonCode",
              "@_minOccurs": "0",
            },
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "SalesOrderMaintainRequestTextCollection",
          "xsd:sequence": {
            "xsd:element": {
              "@_name": "Text",
              "@_type": "SalesOrderMaintainRequestTextCollectionText",
              "@_minOccurs": "0",
              "@_maxOccurs": "unbounded",
            },
          },
          "xsd:attribute": [
            {
              "@_name": "textListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "actionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "SalesOrderMaintainRequestTextCollectionText",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ObjectNodeSenderTechnicalID",
                "@_type": "xi20:ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TypeCode",
                "@_type": "xi20:TextCollectionTextTypeCode",
              },
              {
                "@_name": "CreationDateTime",
                "@_type": "xi21:GLOBAL_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ContentText",
                "@_type": "xi20:LANGUAGEINDEPENDENT_Text",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "actionCode",
            "@_type": "xi20:ActionCode",
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/A1S/Global",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/AP/Common/GDT",
      "xsd:import": {
        "@_namespace": "http://{{url}}/xi/BASIS/Global",
      },
      "xsd:simpleType": [
        {
          "@_name": "ActionCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:enumeration": [
              {
                "@_value": "01",
              },
              {
                "@_value": "02",
              },
              {
                "@_value": "03",
              },
              {
                "@_value": "04",
              },
              {
                "@_value": "05",
              },
              {
                "@_value": "06",
              },
            ],
            "xsd:length": {
              "@_value": "2",
            },
          },
        },
        {
          "@_name": "AddressRepresentationCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "1",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "AgencyIdentificationCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "Amount.Content",
          "xsd:restriction": {
            "@_base": "xsd:decimal",
            "xsd:totalDigits": {
              "@_value": "28",
            },
            "xsd:fractionDigits": {
              "@_value": "6",
            },
            "xsd:maxInclusive": {
              "@_value": "9999999999999999999999.999999",
            },
            "xsd:minInclusive": {
              "@_value": "-9999999999999999999999.999999",
            },
          },
        },
        {
          "@_name": "AuthorisationResultCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BankAccountInternalID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "32",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BankChargeBearerCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BuildingID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessDocumentMessageID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "35",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessPartnerInternalID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessPartnerPaymentCardDetailsID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "6",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentGroupID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "35",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentItemGroupID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentItemID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentItemProcessingTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentItemScheduleLineID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentItemScheduleLineTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentItemTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "5",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentRelationshipRoleCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "5",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "CancellationReasonCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "CashDiscountTermsCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ChangeStateID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "40",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ClearingHouseAccountID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "32",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "CountryCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "2",
            },
          },
        },
        {
          "@_name": "CountryDiallingCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "CurrencyCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "3",
            },
          },
        },
        {
          "@_name": "CustomerTransactionDocumentDataOriginTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "CustomerTransactionDocumentFulfilmentBlockingReasonCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "DataOriginTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "Date",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Date",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:date",
            "xsd:pattern": {
              "@_value": "[0-9]{4}-[0-9]{2}-[0-9]{2}",
            },
          },
        },
        {
          "@_name": "DecimalValue",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Value",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:decimal",
            "xsd:totalDigits": {
              "@_value": "31",
            },
            "xsd:fractionDigits": {
              "@_value": "14",
            },
            "xsd:maxInclusive": {
              "@_value": "99999999999999999.99999999999999",
            },
            "xsd:minInclusive": {
              "@_value": "-99999999999999999.99999999999999",
            },
          },
        },
        {
          "@_name": "DeviceID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "65",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "DistributionChannelCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "DocumentCategoryCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:length": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "DocumentTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "5",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "DueCategoryCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "1",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "Duration",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Duration",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:duration",
            "xsd:pattern": {
              "@_value": ".{1,20}",
            },
          },
        },
        {
          "@_name": "EXTENDED_Name.Content",
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "255",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ExchangeRateRate",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Numeric",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:decimal",
            "xsd:totalDigits": {
              "@_value": "28",
            },
            "xsd:fractionDigits": {
              "@_value": "14",
            },
            "xsd:maxInclusive": {
              "@_value": "99999999999999.99999999999999",
            },
            "xsd:minInclusive": {
              "@_value": "-99999999999999.99999999999999",
            },
          },
        },
        {
          "@_name": "FloorID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "FormOfAddressCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "FulfilmentPartyCategoryCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "HouseID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "IncotermsClassificationCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "IncotermsTransferLocationName",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "28",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "Indicator",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Indicator",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:boolean",
          },
        },
        {
          "@_name": "IntegerValue",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Value",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:int",
          },
        },
        {
          "@_name": "InvoicingBlockingReasonCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "IssuingStatusCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:enumeration": [
              {
                "@_value": "1",
              },
              {
                "@_value": "2",
              },
              {
                "@_value": "3",
              },
              {
                "@_value": "4",
              },
            ],
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LANGUAGEINDEPENDENT_LONG_Text",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Text",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "80",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LANGUAGEINDEPENDENT_MEDIUM_Name",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "40",
            },
          },
        },
        {
          "@_name": "LANGUAGEINDEPENDENT_Name",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
          },
        },
        {
          "@_name": "LANGUAGEINDEPENDENT_SHORT_Description",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Description",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "40",
            },
          },
        },
        {
          "@_name": "LANGUAGEINDEPENDENT_Text",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Text",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
          },
        },
        {
          "@_name": "LOCALNORMALISED_DateTime.Content",
          "xsd:restriction": {
            "@_base": "xsd:dateTime",
            "xsd:pattern": {
              "@_value": "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]*)?",
            },
          },
        },
        {
          "@_name": "LONG_Name.Content",
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "80",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LegallyRequiredPhraseText",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Text",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "255",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LocationID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "20",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LocationInternalID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "20",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LogItemCategoryCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "15",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LogItemNote",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Note",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "200",
            },
          },
        },
        {
          "@_name": "LogItemNoteTemplateText",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Text",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "73",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LogItemPlaceholderSubstitutionText",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Text",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "50",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LogItemSeverityCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "1",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LogItemTemplatePlaceholderID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:length": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "LogItemTypeID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "40",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "MEDIUM_Name.Content",
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "40",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "MEDIUM_Note.Content",
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "80",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "MIMECode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "MeasureUnitCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "NOCONVERSION_ProductID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "60",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ObjectNodePartyTechnicalID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "70",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ObjectNodeTechnicalID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "70",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "OrganisationalCentreID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "20",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "POBoxID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PartialDeliveryControlCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PartyID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "60",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PartyPartyID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "60",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PartyTaxID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "20",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentBlockingReasonCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardAddressVerificationResultCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardHolderAuthenticationID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "40",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardHolderAuthenticationResultCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardHolderAuthenticationTokenText",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Text",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "30",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "25",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardPaymentAuthorisationPartyID_V1.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "60",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardTransactionTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardVerificationResultCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardVerificationValueAvailabilityCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:length": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentCardVerificationValueText",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Text",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "3",
            },
          },
        },
        {
          "@_name": "PaymentCardVerificationValueVerificationResultCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentFormCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "2",
            },
          },
        },
        {
          "@_name": "PaymentInstructionTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentReferenceID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "30",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentReferenceTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentServiceCustomerID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentServiceSubscriberID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "20",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PaymentTransactionReferenceID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "35",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "Percent",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Percent",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:decimal",
            "xsd:totalDigits": {
              "@_value": "16",
            },
            "xsd:fractionDigits": {
              "@_value": "6",
            },
            "xsd:maxInclusive": {
              "@_value": "9999999999.999999",
            },
            "xsd:minInclusive": {
              "@_value": "-9999999999.999999",
            },
          },
        },
        {
          "@_name": "PhoneNumberAreaID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PhoneNumberExtensionID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PhoneNumberSubscriberID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "30",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PostalCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PriceSpecificationElementTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PriorityCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "1",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProcessingResultCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProductInternalID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "40",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProductPartyID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "60",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProductStandardID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "14",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProductTaxEventTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProductTaxStandardClassificationCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "16",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProductTaxStandardClassificationSystemCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProductTaxationCharacteristicsCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProductTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ProjectElementID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "24",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "PropertyDataTypeFormatCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
          },
        },
        {
          "@_name": "PropertyMovementDirectionCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:length": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "Quantity.Content",
          "xsd:restriction": {
            "@_base": "xsd:decimal",
            "xsd:totalDigits": {
              "@_value": "31",
            },
            "xsd:fractionDigits": {
              "@_value": "14",
            },
            "xsd:maxInclusive": {
              "@_value": "99999999999999999.99999999999999",
            },
            "xsd:minInclusive": {
              "@_value": "-99999999999999999.99999999999999",
            },
          },
        },
        {
          "@_name": "QuantityTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "RegionCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "6",
            },
          },
        },
        {
          "@_name": "RequirementSpecificationID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "40",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ResourceID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "40",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "RoomID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "SHORT_Description.Content",
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "40",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "ServiceWorkingConditionsCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "StreetName",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
            "xsd:maxLength": {
              "@_value": "60",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxDeductibilityCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxExemptionCertificateID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "30",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxExemptionReasonCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxIdentificationNumberTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxJurisdictionCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "25",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxJurisdictionSubdivisionCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "15",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxJurisdictionSubdivisionTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxRateTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "5",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TaxTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TextCollectionTextTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "5",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TimeZoneCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "UUID.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "36",
            },
            "xsd:minLength": {
              "@_value": "36",
            },
            "xsd:pattern": {
              "@_value": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
            },
          },
        },
        {
          "@_name": "VersionID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "32",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "WebURI",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "URI",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:anyURI",
          },
        },
        {
          "@_name": "WithholdingTaxEventTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "WithholdingTaxIncomeTypeCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "8",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "WithholdingTaxationCharacteristicsCode.Content",
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "4",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
      ],
      "xsd:complexType": [
        {
          "@_name": "AddressRepresentationCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "AddressRepresentationCode.Content",
              "xsd:attribute": {
                "@_name": "listAgencyID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "Amount",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Amount",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "Amount.Content",
              "xsd:attribute": {
                "@_name": "currencyCode",
                "@_use": "required",
                "@_type": "xi21:CurrencyCode",
              },
            },
          },
        },
        {
          "@_name": "BankAccountInternalID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "BankAccountInternalID.Content",
              "xsd:attribute": {
                "@_name": "schemeAgencyID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "BusinessDocumentBasicMessageHeader",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ID",
                "@_type": "BusinessDocumentMessageID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "UUID",
                "@_type": "UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ReferenceID",
                "@_type": "BusinessDocumentMessageID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ReferenceUUID",
                "@_type": "UUID",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "BusinessDocumentMessageID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "BusinessDocumentMessageID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "BusinessTransactionDocumentID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "BusinessTransactionDocumentReference",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ID",
                "@_type": "BusinessTransactionDocumentID",
              },
              {
                "@_name": "UUID",
                "@_type": "UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TypeCode",
                "@_type": "BusinessTransactionDocumentTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemID",
                "@_type": "BusinessTransactionDocumentItemID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemUUID",
                "@_type": "UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ItemTypeCode",
                "@_type": "BusinessTransactionDocumentItemTypeCode",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "BusinessTransactionDocumentTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "BusinessTransactionDocumentTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "CancellationReasonCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "CancellationReasonCode.Content",
              "xsd:attribute": {
                "@_name": "listAgencyID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "CashDiscountTermsCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "CashDiscountTermsCode.Content",
              "xsd:attribute": {
                "@_name": "listAgencyID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "ClearingHouseAccountID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ClearingHouseAccountID.Content",
              "xsd:attribute": {
                "@_name": "schemeAgencyID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "DataOriginTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "DataOriginTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "DatePeriod",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "StartDate",
                "@_type": "Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EndDate",
                "@_type": "Date",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Duration",
                "@_type": "Duration",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "Description",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Description",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "xsd:string",
              "xsd:attribute": {
                "@_name": "languageCode",
                "@_type": "xi21:LanguageCode",
              },
            },
          },
        },
        {
          "@_name": "DeviceID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "DeviceID.Content",
              "xsd:attribute": {
                "@_name": "schemeAgencyID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "DistributionChannelCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "DistributionChannelCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "DocumentTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "DocumentTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "EXTENDED_Name",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "EXTENDED_Name.Content",
              "xsd:attribute": {
                "@_name": "languageCode",
                "@_type": "xi21:LanguageCode",
              },
            },
          },
        },
        {
          "@_name": "EmailURI",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "URI",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "xsd:anyURI",
              "xsd:attribute": {
                "@_name": "schemeID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "ExchangeRate",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UnitCurrency",
                "@_type": "CurrencyCode",
              },
              {
                "@_name": "QuotedCurrency",
                "@_type": "CurrencyCode",
              },
              {
                "@_name": "Rate",
                "@_type": "ExchangeRateRate",
              },
              {
                "@_name": "QuotationDateTime",
                "@_type": "xi21:GLOBAL_DateTime",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "FormOfAddressCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "FormOfAddressCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeAgencyID",
                  "@_type": "AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "FulfilmentPartyCategoryCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "FulfilmentPartyCategoryCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "Incoterms",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "ClassificationCode",
                "@_type": "IncotermsClassificationCode",
              },
              {
                "@_name": "TransferLocationName",
                "@_type": "IncotermsTransferLocationName",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "LOCALNORMALISED_DateTime",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "DateTime",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "LOCALNORMALISED_DateTime.Content",
              "xsd:attribute": {
                "@_name": "timeZoneCode",
                "@_use": "required",
                "@_type": "TimeZoneCode",
              },
            },
          },
        },
        {
          "@_name": "LONG_Name",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "LONG_Name.Content",
              "xsd:attribute": {
                "@_name": "languageCode",
                "@_type": "xi21:LanguageCode",
              },
            },
          },
        },
        {
          "@_name": "LocationID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "LocationID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencySchemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "LocationInternalID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "LocationInternalID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "Log",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "BusinessDocumentProcessingResultCode",
                "@_type": "ProcessingResultCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "MaximumLogItemSeverityCode",
                "@_type": "LogItemSeverityCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Item",
                "@_type": "LogItem",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
        },
        {
          "@_name": "LogItem",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "TypeID",
                "@_type": "LogItemTypeID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CategoryCode",
                "@_type": "LogItemCategoryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SeverityCode",
                "@_type": "LogItemSeverityCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ReferenceObjectNodeSenderTechnicalID",
                "@_type": "ObjectNodePartyTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ReferenceMessageElementName",
                "@_type": "LANGUAGEINDEPENDENT_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Note",
                "@_type": "LogItemNote",
              },
              {
                "@_name": "NoteTemplateText",
                "@_type": "LogItemNoteTemplateText",
                "@_minOccurs": "0",
              },
              {
                "@_name": "LogItemNotePlaceholderSubstitutionList",
                "@_type": "LogItemNotePlaceholderSubstitutionList",
                "@_minOccurs": "0",
              },
              {
                "@_name": "WebURI",
                "@_type": "WebURI",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "LogItemCategoryCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "LogItemCategoryCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "LogItemNotePlaceholderSubstitutionList",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "FirstPlaceholderID",
                "@_type": "LogItemTemplatePlaceholderID",
              },
              {
                "@_name": "SecondPlaceholderID",
                "@_type": "LogItemTemplatePlaceholderID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ThirdPlaceholderID",
                "@_type": "LogItemTemplatePlaceholderID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FourthPlaceholderID",
                "@_type": "LogItemTemplatePlaceholderID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FirstPlaceholderSubstitutionText",
                "@_type": "LogItemPlaceholderSubstitutionText",
              },
              {
                "@_name": "SecondPlaceholderSubstitutionText",
                "@_type": "LogItemPlaceholderSubstitutionText",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ThirdPlaceholderSubstitutionText",
                "@_type": "LogItemPlaceholderSubstitutionText",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FourthPlaceholderSubstitutionText",
                "@_type": "LogItemPlaceholderSubstitutionText",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "MEDIUM_Name",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "MEDIUM_Name.Content",
              "xsd:attribute": {
                "@_name": "languageCode",
                "@_type": "xi21:LanguageCode",
              },
            },
          },
        },
        {
          "@_name": "MEDIUM_Note",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Note",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "MEDIUM_Note.Content",
              "xsd:attribute": {
                "@_name": "languageCode",
                "@_type": "xi21:LanguageCode",
              },
            },
          },
        },
        {
          "@_name": "NOCONVERSION_ProductID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "NOCONVERSION_ProductID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "NamespaceURI",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "URI",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "xsd:anyURI",
              "xsd:attribute": {
                "@_name": "schemeID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "OrganisationName",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "FormOfAddressCode",
                "@_type": "FormOfAddressCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FirstLineName",
                "@_type": "LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SecondLineName",
                "@_type": "LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ThirdLineName",
                "@_type": "LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FourthLineName",
                "@_type": "LANGUAGEINDEPENDENT_MEDIUM_Name",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "PartyID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PartyID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencySchemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "PartyTaxID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PartyTaxID.Content",
              "xsd:attribute": {
                "@_name": "schemeID",
                "@_use": "required",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "PaymentBlock",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "PaymentBlockingReasonCode",
                "@_type": "PaymentBlockingReasonCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExpirationDateTime",
                "@_type": "xi21:GLOBAL_DateTime",
              },
              {
                "@_name": "CreationIdentityUUID",
                "@_type": "UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CreationDateTime",
                "@_type": "xi21:GLOBAL_DateTime",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "PaymentBlockingReasonCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PaymentBlockingReasonCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "PaymentCardHolderAuthenticationID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PaymentCardHolderAuthenticationID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "PaymentCardHolderAuthenticationResultCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PaymentCardHolderAuthenticationResultCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "PaymentCardID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PaymentCardID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "PaymentCardPaymentAuthorisationPartyID_V1",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PaymentCardPaymentAuthorisationPartyID_V1.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "PaymentCardTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PaymentCardTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "PaymentCardVerificationValueAvailabilityCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PaymentCardVerificationValueAvailabilityCode.Content",
              "xsd:attribute": {
                "@_name": "listVersionID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "15",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "PhoneNumber",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "AreaID",
                "@_type": "PhoneNumberAreaID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "SubscriberID",
                "@_type": "PhoneNumberSubscriberID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExtensionID",
                "@_type": "PhoneNumberExtensionID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CountryCode",
                "@_type": "CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CountryDiallingCode",
                "@_type": "CountryDiallingCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CountryName",
                "@_type": "MEDIUM_Name",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "PriceSpecificationElementTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "PriceSpecificationElementTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "ProductInternalID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ProductInternalID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "ProductStandardID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ProductStandardID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "@_use": "required",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "3",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "ProductTax",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "CountryCode",
                "@_type": "CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RegionCode",
                "@_type": "RegionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "JurisdictionCode",
                "@_type": "TaxJurisdictionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "JurisdictionSubdivisionCode",
                "@_type": "TaxJurisdictionSubdivisionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "JurisdictionSubdivisionTypeCode",
                "@_type": "TaxJurisdictionSubdivisionTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EventTypeCode",
                "@_type": "ProductTaxEventTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TypeCode",
                "@_type": "TaxTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RateTypeCode",
                "@_type": "TaxRateTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CurrencyCode",
                "@_type": "CurrencyCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BaseAmount",
                "@_type": "Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Percent",
                "@_type": "Percent",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BaseQuantity",
                "@_type": "Quantity",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BaseQuantityTypeCode",
                "@_type": "QuantityTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Rate",
                "@_type": "Rate",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Amount",
                "@_type": "Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "InternalAmount",
                "@_type": "Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "NonDeductiblePercent",
                "@_type": "Percent",
                "@_minOccurs": "0",
              },
              {
                "@_name": "NonDeductibleAmount",
                "@_type": "Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DeductibleAmount",
                "@_type": "Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DeductibilityCode",
                "@_type": "TaxDeductibilityCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BusinessTransactionDocumentItemGroupID",
                "@_type": "BusinessTransactionDocumentItemGroupID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EuropeanCommunityVATTriangulationIndicator",
                "@_type": "Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DueCategoryCode",
                "@_type": "DueCategoryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "StatisticRelevanceIndicator",
                "@_type": "Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DeferredIndicator",
                "@_type": "Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Exemption",
                "@_type": "TaxExemption",
                "@_minOccurs": "0",
              },
              {
                "@_name": "FollowUpExemption",
                "@_type": "TaxExemption",
                "@_minOccurs": "0",
              },
              {
                "@_name": "LegallyRequiredPhrase",
                "@_type": "LegallyRequiredPhraseText",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExchangeRate",
                "@_type": "ExchangeRate",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "ProductTaxEventTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ProductTaxEventTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "@_use": "required",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "ProductTaxStandardClassificationCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ProductTaxStandardClassificationCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "ProductTaxStandardClassificationSystemCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ProductTaxStandardClassificationSystemCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "ProductTaxationCharacteristicsCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ProductTaxationCharacteristicsCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "@_use": "required",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "ProjectElementID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ProjectElementID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "Quantity",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Quantity",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "Quantity.Content",
              "xsd:attribute": {
                "@_name": "unitCode",
                "@_type": "MeasureUnitCode",
              },
            },
          },
        },
        {
          "@_name": "QuantityTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "QuantityTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "Rate",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "DecimalValue",
                "@_type": "DecimalValue",
              },
              {
                "@_name": "MeasureUnitCode",
                "@_type": "MeasureUnitCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CurrencyCode",
                "@_type": "CurrencyCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BaseDecimalValue",
                "@_default": "1",
                "@_type": "DecimalValue",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BaseMeasureUnitCode",
                "@_type": "MeasureUnitCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BaseCurrencyCode",
                "@_type": "CurrencyCode",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "RegionCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "RegionCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "RequirementSpecificationID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "RequirementSpecificationID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "ResourceID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ResourceID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "SHORT_Description",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Description",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "SHORT_Description.Content",
              "xsd:attribute": {
                "@_name": "languageCode",
                "@_type": "xi21:LanguageCode",
              },
            },
          },
        },
        {
          "@_name": "ServiceWorkingConditionsCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "ServiceWorkingConditionsCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TaxDeductibilityCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxDeductibilityCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TaxExemption",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "CertificateID",
                "@_type": "TaxExemptionCertificateID",
              },
              {
                "@_name": "InternalCertificateID",
                "@_type": "TaxExemptionCertificateID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ValidityPeriod",
                "@_type": "DatePeriod",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Percent",
                "@_type": "Percent",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Amount",
                "@_type": "Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ReasonCode",
                "@_type": "TaxExemptionReasonCode",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "TaxExemptionCertificateID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxExemptionCertificateID.Content",
              "xsd:attribute": {
                "@_name": "schemeAgencyID",
                "xsd:simpleType": {
                  "xsd:restriction": {
                    "@_base": "xsd:token",
                    "xsd:maxLength": {
                      "@_value": "60",
                    },
                    "xsd:minLength": {
                      "@_value": "1",
                    },
                  },
                },
              },
            },
          },
        },
        {
          "@_name": "TaxExemptionReasonCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxExemptionReasonCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "@_use": "required",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TaxIdentificationNumberTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxIdentificationNumberTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "3",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TaxJurisdictionCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxJurisdictionCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TaxJurisdictionSubdivisionCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxJurisdictionSubdivisionCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TaxJurisdictionSubdivisionTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxJurisdictionSubdivisionTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TaxRateTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxRateTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "@_use": "required",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TaxTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TaxTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "@_use": "required",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "TextCollectionTextTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "TextCollectionTextTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencySchemeAgencyID",
                  "@_type": "xi21:AgencyIdentificationCode",
                },
              ],
            },
          },
        },
        {
          "@_name": "UPPEROPEN_LOCALNORMALISED_DateTimePeriod",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "StartDateTime",
                "@_type": "xi21:LOCALNORMALISED_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EndDateTime",
                "@_type": "xi21:LOCALNORMALISED_DateTime",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "UUID",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Identifier",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "UUID.Content",
              "xsd:attribute": [
                {
                  "@_name": "schemeID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "schemeAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "WithholdingTax",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "CountryCode",
                "@_type": "CountryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RegionCode",
                "@_type": "RegionCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "EventTypeCode",
                "@_type": "WithholdingTaxEventTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TypeCode",
                "@_type": "TaxTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "RateTypeCode",
                "@_type": "TaxRateTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CurrencyCode",
                "@_type": "CurrencyCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BaseAmount",
                "@_type": "Amount",
              },
              {
                "@_name": "Percent",
                "@_type": "Percent",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Amount",
                "@_type": "Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExcludedAmount",
                "@_type": "Amount",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BusinessTransactionDocumentItemGroupID",
                "@_type": "BusinessTransactionDocumentItemGroupID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "StatisticRelevanceIndicator",
                "@_type": "Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PlannedIndicator",
                "@_type": "Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExchangeRate",
                "@_type": "ExchangeRate",
                "@_minOccurs": "0",
              },
              {
                "@_name": "IncomeTypeCode",
                "@_type": "WithholdingTaxIncomeTypeCode",
                "@_minOccurs": "0",
              },
            ],
          },
        },
        {
          "@_name": "WithholdingTaxEventTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "WithholdingTaxEventTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "WithholdingTaxIncomeTypeCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "WithholdingTaxIncomeTypeCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          "@_name": "WithholdingTaxationCharacteristicsCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "WithholdingTaxationCharacteristicsCode.Content",
              "xsd:attribute": [
                {
                  "@_name": "listID",
                  "@_use": "required",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listVersionID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "15",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
                {
                  "@_name": "listAgencyID",
                  "xsd:simpleType": {
                    "xsd:restriction": {
                      "@_base": "xsd:token",
                      "xsd:maxLength": {
                        "@_value": "60",
                      },
                      "xsd:minLength": {
                        "@_value": "1",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/AP/Common/GDT",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/BASIS/Global",
      "xsd:simpleType": [
        {
          "@_name": "AgencyIdentificationCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:enumeration": [
              {
                "@_value": "1",
              },
              {
                "@_value": "5",
              },
              {
                "@_value": "6",
              },
              {
                "@_value": "16",
              },
              {
                "@_value": "17",
              },
              {
                "@_value": "84",
              },
              {
                "@_value": "107",
              },
              {
                "@_value": "109",
              },
              {
                "@_value": "112",
              },
              {
                "@_value": "113",
              },
              {
                "@_value": "114",
              },
              {
                "@_value": "116",
              },
              {
                "@_value": "117",
              },
              {
                "@_value": "124",
              },
              {
                "@_value": "130",
              },
              {
                "@_value": "131",
              },
              {
                "@_value": "138",
              },
              {
                "@_value": "142",
              },
              {
                "@_value": "146",
              },
              {
                "@_value": "262",
              },
              {
                "@_value": "296",
              },
              {
                "@_value": "310",
              },
            ],
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "CharacterSetCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "CurrencyCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "3",
            },
            "xsd:minLength": {
              "@_value": "3",
            },
          },
        },
        {
          "@_name": "Date",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Date",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:date",
            "xsd:pattern": {
              "@_value": "[0-9]{4}-[0-9]{2}-[0-9]{2}",
            },
          },
        },
        {
          "@_name": "GLOBAL_DateTime",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "DateTime",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:dateTime",
            "xsd:pattern": {
              "@_value": "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]{1,7})?Z",
            },
          },
        },
        {
          "@_name": "LOCALNORMALISED_DateTime.Content",
          "xsd:restriction": {
            "@_base": "xsd:dateTime",
            "xsd:pattern": {
              "@_value": "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]{1,7})?Z",
            },
          },
        },
        {
          "@_name": "LanguageCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:language",
            "xsd:maxLength": {
              "@_value": "2",
            },
            "xsd:minLength": {
              "@_value": "2",
            },
          },
        },
        {
          "@_name": "MIMECode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
        {
          "@_name": "TimeZoneCode",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Code",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:token",
            "xsd:maxLength": {
              "@_value": "10",
            },
            "xsd:minLength": {
              "@_value": "1",
            },
          },
        },
      ],
      "xsd:complexType": [
        {
          "@_name": "BinaryObject",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "BinaryObject",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "xsd:base64Binary",
              "xsd:attribute": [
                {
                  "@_name": "mimeCode",
                  "@_type": "MIMECode",
                },
                {
                  "@_name": "characterSetCode",
                  "@_type": "CharacterSetCode",
                },
                {
                  "@_name": "format",
                  "@_type": "xsd:token",
                },
                {
                  "@_name": "fileName",
                  "@_type": "xsd:string",
                },
                {
                  "@_name": "uri",
                  "@_type": "xsd:anyURI",
                },
              ],
            },
          },
        },
        {
          "@_name": "LOCALNORMALISED_DateTime",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "DateTime",
            },
          },
          "xsd:simpleContent": {
            "xsd:extension": {
              "@_base": "LOCALNORMALISED_DateTime.Content",
              "xsd:attribute": {
                "@_name": "timeZoneCode",
                "@_use": "required",
                "@_type": "TimeZoneCode",
              },
            },
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/BASIS/Global",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/DocumentServices/Global",
      "xsd:import": [
        {
          "@_namespace": "http://{{url}}/xi/BASIS/Global",
        },
        {
          "@_namespace": "http://{{url}}/xi/AP/Common/GDT",
        },
      ],
      "xsd:complexType": [
        {
          "@_name": "MaintenanceAttachmentFolder",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Document",
                "@_type": "MaintenanceAttachmentFolderDocument",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "DocumentListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "ActionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "MaintenanceAttachmentFolderDocument",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "UUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "LinkInternalIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "VisibleIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "CategoryCode",
                "@_type": "xi20:DocumentCategoryCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "TypeCode",
                "@_type": "xi20:DocumentTypeCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "MIMECode",
                "@_type": "xi20:MIMECode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Name",
                "@_type": "xi20:LANGUAGEINDEPENDENT_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "AlternativeName",
                "@_type": "xi20:LANGUAGEINDEPENDENT_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "InternalLinkUUID",
                "@_type": "xi20:UUID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Description",
                "@_type": "xi20:Description",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ExternalLinkWebURI",
                "@_type": "xi20:WebURI",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Property",
                "@_type": "MaintenanceAttachmentFolderDocumentProperty",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
              {
                "@_name": "FileContent",
                "@_type": "MaintenanceAttachmentFolderDocumentFileContent",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "PropertyListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "ActionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "MaintenanceAttachmentFolderDocumentFileContent",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "TechnicalID",
                "@_type": "xi20:ObjectNodeTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "BinaryObject",
                "@_type": "xi21:BinaryObject",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "ActionCode",
            "@_type": "xi20:ActionCode",
          },
        },
        {
          "@_name": "MaintenanceAttachmentFolderDocumentProperty",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "TechnicalID",
                "@_type": "xi20:ObjectNodeTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Name",
                "@_type": "xi20:LANGUAGEINDEPENDENT_Name",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DataTypeFormatCode",
                "@_type": "xi20:PropertyDataTypeFormatCode",
                "@_minOccurs": "0",
              },
              {
                "@_name": "VisibleIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "ChangeAllowedIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "MultipleValueIndicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "NamespaceURI",
                "@_type": "xi20:NamespaceURI",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Description",
                "@_type": "xi20:Description",
                "@_minOccurs": "0",
              },
              {
                "@_name": "PropertyValue",
                "@_type": "MaintenanceAttachmentFolderDocumentPropertyPropertyValue",
                "@_minOccurs": "0",
                "@_maxOccurs": "unbounded",
              },
            ],
          },
          "xsd:attribute": [
            {
              "@_name": "PropertyValueListCompleteTransmissionIndicator",
              "@_type": "xi20:Indicator",
            },
            {
              "@_name": "ActionCode",
              "@_type": "xi20:ActionCode",
            },
          ],
        },
        {
          "@_name": "MaintenanceAttachmentFolderDocumentPropertyPropertyValue",
          "xsd:sequence": {
            "xsd:element": [
              {
                "@_name": "TechnicalID",
                "@_type": "xi20:ObjectNodeTechnicalID",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Text",
                "@_type": "xi20:LANGUAGEINDEPENDENT_Text",
                "@_minOccurs": "0",
              },
              {
                "@_name": "Indicator",
                "@_type": "xi20:Indicator",
                "@_minOccurs": "0",
              },
              {
                "@_name": "DateTime",
                "@_type": "xi21:GLOBAL_DateTime",
                "@_minOccurs": "0",
              },
              {
                "@_name": "IntegerValue",
                "@_type": "xi20:IntegerValue",
                "@_minOccurs": "0",
              },
            ],
          },
          "xsd:attribute": {
            "@_name": "ActionCode",
            "@_type": "xi20:ActionCode",
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/DocumentServices/Global",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "xsd:simpleType": [
        {
          "@_name": "Ext00163E04D8151EE49FE3A85B2D112E5A",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
          },
        },
        {
          "@_name": "Ext00163E20A6261EE6ADF4C386A5C71FF0",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
          },
        },
        {
          "@_name": "Ext00163E34EC461ED7AECD6855BAEB1B7B",
          "xsd:annotation": {
            "xsd:documentation": {
              "@_xml:lang": "EN",
              "ccts:RepresentationTerm": "Name",
            },
          },
          "xsd:restriction": {
            "@_base": "xsd:string",
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/AP/PDI/ABSL",
      "xsd:simpleType": {
        "@_name": "ID",
        "xsd:annotation": {
          "xsd:documentation": {
            "@_xml:lang": "EN",
            "ccts:RepresentationTerm": "Identifier",
          },
        },
        "xsd:restriction": {
          "@_base": "xsd:token",
          "xsd:maxLength": {
            "@_value": "60",
          },
          "xsd:minLength": {
            "@_value": "1",
          },
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/AP/PDI/ABSL",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "xsd:import": {
        "@_namespace": "http://{{url}}/xi/AP/Common/GDT",
      },
      "xsd:complexType": {
        "@_name": "PaymentCardKey",
        "xsd:sequence": {
          "xsd:element": [
            {
              "@_name": "ID",
              "@_type": "xi20:PaymentCardID",
            },
            {
              "@_name": "TypeCode",
              "@_type": "xi20:PaymentCardTypeCode",
            },
          ],
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/AP/FO/PaymentCard/Global",
    dependencies: {
    },
  },
  {
    foundSchemaTag: {
      "@_targetNamespace": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns:ccts": "urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0",
      "@_xmlns:xi0": "http://{{url}}/xi/AP/CustomerExtension/BYD/A02IK",
      "@_xmlns:xi16": "http://{{url}}/xi/AP/Globalization",
      "@_xmlns:xi17": "http://{{url}}/xi/SAPGlobal20/Global",
      "@_xmlns:xi18": "http://{{url}}/xi/AP/Common/Global",
      "@_xmlns:xi19": "http://{{url}}/xi/A1S/Global",
      "@_xmlns:xi20": "http://{{url}}/xi/AP/Common/GDT",
      "@_xmlns:xi21": "http://{{url}}/xi/BASIS/Global",
      "@_xmlns:xi22": "http://{{url}}/xi/DocumentServices/Global",
      "@_xmlns:xi25": "http://{{url}}/xi/AP/Extensibility/GeneratedObjects",
      "@_xmlns:xi26": "http://{{url}}/xi/AP/PDI/ABSL",
      "@_xmlns:xi28": "http://{{url}}/xi/AP/FO/PaymentCard/Global",
      "@_xmlns:xi34": "http://{{url}}/xi/AP/PDI/bo",
      "@_xmlns": "http://{{url}}/xi/AP/PDI/bo",
      "xsd:simpleType": {
        "@_name": "String",
        "xsd:annotation": {
          "xsd:documentation": {
            "@_xml:lang": "EN",
            "ccts:RepresentationTerm": "Text",
          },
        },
        "xsd:restriction": {
          "@_base": "xsd:string",
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: "xsd",
      url: "http://www.w3.org/2001/XMLSchema",
      prefixFilter: "xsd:",
      isDefault: false,
      tnsDefinitionURL: "http://{{url}}/xi/A1S/Global",
    },
    targetNamespace: "http://{{url}}/xi/AP/PDI/bo",
    dependencies: {
    },
  },
]
