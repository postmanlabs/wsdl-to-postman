module.exports = 
  [
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/A1S/Global',
      'xsd:import': [
        {
          '@_namespace': 'http://sap.com/xi/A1S',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/Globalization',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/XU/SRM/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/Common/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/DocumentServices/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/CRM/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/BASIS/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/Common/GDT',
        },
      ],
      'xsd:complexType': [
        {
          '@_name': 'PurchaseOrderBundleMaintainRequestMessage_sync',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'BasicMessageHeader',
                '@_type': 'xi20:BusinessDocumentBasicMessageHeader',
              },
              {
                '@_name': 'PurchaseOrderMaintainBundle',
                '@_type': 'PurchaseOrderMaintainRequestBundle',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDQuery',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDQueryMessage_sync',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'PurchaseOrder',
              '@_type': 'PurchaseOrderByIDQuery',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponse',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Date',
                '@_type': 'xi22:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'OrderedDateTime',
                '@_type': 'xi22:LOCALNORMALISED_DateTime',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DataOriginTypeCode',
                '@_type': 'xi20:ProcurementDocumentDataOriginTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'xi20:BusinessTransactionDocumentTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProcessingTypeCode',
                '@_type': 'xi20:BusinessTransactionDocumentProcessingTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Name',
                '@_type': 'xi20:MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CurrencyCode',
                '@_type': 'xi20:CurrencyCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TemplateIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalNetAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CashDiscountTerms',
                '@_type': 'xi19:AccessCashDiscountTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ChangeStateID',
                '@_type': 'xi20:ChangeStateID',
              },
              {
                '@_name': 'DeliveryTerms',
                '@_type': 'xi36:PurchaseOrderByIDResponseDeliveryTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Status',
                '@_type': 'xi36:PurchaseOrderByIDResponseStatus',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BillToParty',
                '@_type': 'PurchaseOrderByIDResponseBillToParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerParty',
                '@_type': 'PurchaseOrderByIDResponseBuyerParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EmployeeResponsibleParty',
                '@_type': 'PurchaseOrderByIDResponseEmployeeResponsibleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ResponsiblePurchasingUnitParty',
                '@_type': 'PurchaseOrderByIDResponseResponsiblePurchasingUnitParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Item',
                '@_type': 'PurchaseOrderByIDResponseItem',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'TextCollection',
                '@_type': 'xi23:MaintenanceTextCollection',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AttachmentFolder',
                '@_type': 'xi23:MaintenanceAttachmentFolder',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SellerParty',
                '@_type': 'PurchaseOrderByIDResponseSellerParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SystemAdministrativeData',
                '@_type': 'xi20:SystemAdministrativeData',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentReferenceGoodsAndServiceAcknowledgementID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentReferencePurchasingContractID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentReferenceInternalRequestID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentReferenceOutboundDeliveryID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentReferencePurchaseRequestID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseBillToParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'NodeID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyTypeCode',
                '@_type': 'xi20:BusinessObjectTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AddressReference',
                '@_type': 'xi20:PartyAddressReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseBuyerParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'NodeID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyTypeCode',
                '@_type': 'xi20:BusinessObjectTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AddressReference',
                '@_type': 'xi20:PartyAddressReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseEmployeeResponsibleParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'NodeID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyTypeCode',
                '@_type': 'xi20:BusinessObjectTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AddressReference',
                '@_type': 'xi20:PartyAddressReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItem',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ItemID',
                '@_type': 'xi20:BusinessTransactionDocumentItemID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'xi20:BusinessTransactionDocumentItemTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'OrderedDateTime',
                '@_type': 'xi22:LOCALNORMALISED_DateTime',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryPeriod',
                '@_type': 'xi20:UPPEROPEN_LOCALNORMALISED_DateTimePeriod',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Description',
                '@_type': 'xi20:SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Quantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'QuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalDeliveredQuantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalDeliveredQuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalInvoiceQuantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalInvoiceQuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalInvoicedQuantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalInvoicedQuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemStatus',
                '@_type': 'xi36:PurchaseOrderByIDResponseItemStatus',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GrossAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NetAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CostUpperLimitAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CostUpperLimitExpectedAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GrossUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NetUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ListUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpPurchaseOrderConfirmation',
                '@_type': 'PurchaseOrderByIDResponseItemFollowUpPurchaseOrderConfirmation',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpDelivery',
                '@_type': 'PurchaseOrderByIDResponseItemFollowUpDelivery',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpInvoice',
                '@_type': 'PurchaseOrderByIDResponseItemFollowUpInvoice',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DirectMaterialIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ThirdPartyDealIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemProduct',
                '@_type': 'PurchaseOrderByIDResponseItemProduct',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemDeliveryTerms',
                '@_type': 'PurchaseOrderByIDResponseItemDeliveryTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EndBuyerParty',
                '@_type': 'PurchaseOrderByIDResponseItemEndBuyerParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductRecipientParty',
                '@_type': 'PurchaseOrderByIDResponseItemProductReceipientParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServicePerformerParty',
                '@_type': 'PurchaseOrderByIDResponseItemServicePerfomerParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemAccountingCodingBlockDistribution',
                '@_type': 'xi21:MaintenanceAccountingCodingBlockDistribution',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemAttachmentFolder',
                '@_type': 'xi23:MaintenanceAttachmentFolder',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemTextCollection',
                '@_type': 'xi23:MaintenanceTextCollection',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemImatListCompleteTransmissionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemPriceCalculation',
                '@_type': 'PurchaseOrderReadPriceCalculationItem',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemTaxCalculation',
                '@_type': 'PurchaseOrderReadTaxCalculationItem',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ShipToLocationID',
                '@_type': 'xi20:LocationID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ShipToLocationAddressHostUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemScheduleLine',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemScheduleLine',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
            'xsd:group': {
              '@_ref': 'PurchaseOrderByIDResponseItemGloExtension',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemDeliveryTerms',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'QuantityTolerance',
              '@_type': 'xi20:QuantityTolerance',
              '@_minOccurs': '0',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemEndBuyerParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemFollowUpDelivery',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'RequirementCode',
                '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
              },
              {
                '@_name': 'EmployeeTimeConfirmationRequiredIndicator',
                '@_type': 'xi20:Indicator',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemFollowUpInvoice',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'BusinessTransactionDocumentSettlementRelevanceIndicator',
                '@_type': 'xi20:Indicator',
              },
              {
                '@_name': 'RequirementCode',
                '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
              },
              {
                '@_name': 'EvaluatedReceiptSettlementIndicator',
                '@_type': 'xi20:Indicator',
              },
              {
                '@_name': 'DeliveryBasedInvoiceVerificationIndicator',
                '@_type': 'xi20:Indicator',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemFollowUpPurchaseOrderConfirmation',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'RequirementCode',
              '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemProduct',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductStandardID',
                '@_type': 'xi20:ProductStandardID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductCategoryStandardID',
                '@_type': 'xi20:ProductCategoryStandardID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CashDiscountDeductibleIndicator',
                '@_type': 'xi20:Indicator',
              },
              {
                '@_name': 'ProductCategoryIDKey',
                '@_type': 'xi18:ProductCategoryHierarchyProductCategoryIDKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductKey',
                '@_type': 'xi18:ProductKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductRequirementSpecificationKey',
                '@_type': 'xi18:RequirementSpecificationKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductSellerID',
                '@_type': 'xi20:ProductPartyID',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemProductReceipientParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PARTYKEY',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemServicePerfomerParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseMessage_sync',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'PurchaseOrder',
                '@_type': 'PurchaseOrderByIDResponse',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'Log',
                '@_type': 'xi20:Log',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseResponsiblePurchasingUnitParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'NodeID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyTypeCode',
                '@_type': 'xi20:BusinessObjectTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AddressReference',
                '@_type': 'xi20:PartyAddressReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseSellerParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'NodeID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyTypeCode',
                '@_type': 'xi20:BusinessObjectTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AddressReference',
                '@_type': 'xi20:PartyAddressReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainConfirmationBundle',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ReferenceObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ChangeStateID',
                '@_type': 'xi20:ChangeStateID',
              },
              {
                '@_name': 'BusinessTransactionDocumentID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
              },
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainConfirmationBundleMessage_sync',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'PurchaseOrder',
                '@_type': 'PurchaseOrderMaintainConfirmationBundle',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'Log',
                '@_type': 'xi20:Log',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundle',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ChangeStateID',
                '@_type': 'xi20:ChangeStateID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentTypeCode',
                '@_type': 'xi20:BusinessTransactionDocumentTypeCode',
              },
              {
                '@_name': 'Name',
                '@_type': 'xi20:MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Date',
                '@_type': 'xi20:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'OrderPurchaseOrderActionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CancelPurchaseOrderActionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FinishDeliveryPOActionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FinishInvoicePOActionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PreventDocumentOutputIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CurrencyCode',
                '@_type': 'xi20:CurrencyCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SellerParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EmployeeResponsibleParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BillToParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ResponsiblePurchasingUnitParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AttachmentFolder',
                '@_type': 'xi23:MaintenanceAttachmentFolder',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TextCollection',
                '@_type': 'xi23:MaintenanceTextCollection',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryTerms',
                '@_type': 'PurchaseOrderMaintainRequestBundleDeliveryTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CashDiscountTerms',
                '@_type': 'xi19:PurchaseOrderMaintenanceCashDiscountTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Item',
                '@_type': 'PurchaseOrderMaintainRequestBundleItem',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
          'xsd:attribute': [
            {
              '@_name': 'actionCode',
              '@_type': 'xi20:ActionCode',
            },
            {
              '@_name': 'ItemListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
          ],
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleDeliveryTerms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MaximumLeadTimeDuration',
                '@_type': 'xi20:DAY_Duration',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'IncoTerms',
                '@_type': 'xi20:Incoterms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'QuantityTolerance',
                '@_type': 'xi20:QuantityTolerance',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItem',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemID',
                '@_type': 'xi20:BusinessTransactionDocumentItemID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CancelItemPurchaseOrderActionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderItemFinishInvoice',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrdeItemFinishDelivery',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentItemTypeCode',
                '@_type': 'xi20:BusinessTransactionDocumentItemTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Quantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'QuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Description',
                '@_type': 'xi20:SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NetAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NetUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GrossAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GrossUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ListUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LimitAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryPeriod',
                '@_type': 'xi20:UPPEROPEN_LOCALNORMALISED_DateTimePeriod',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DirectMaterialIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ThirdPartyDealIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpPurchaseOrderConfirmation',
                '@_type': 'xi32:ProcurementDocumentItemFollowUpPurchaseOrderConfirmation',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpDelivery',
                '@_type': 'xi32:ProcurementDocumentItemFollowUpDelivery',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpInvoice',
                '@_type': 'xi32:ProcurementDocumentItemFollowUpInvoice',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemDeliveryTerms',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemDeliveryTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemProduct',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemProduct',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemIndividualMaterial',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemIndividualMaterial',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'ShipToLocation',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemLocation',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ReceivingItemSite',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemLocation',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EndBuyerParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductRecipientParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServicePerformerParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RequestorParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemAccountingCodingBlockDistribution',
                '@_type': 'xi21:MaintenanceAccountingCodingBlockDistribution',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemAttachmentFolder',
                '@_type': 'xi23:MaintenanceAttachmentFolder',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemTextCollection',
                '@_type': 'xi23:MaintenanceTextCollection',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemPurchasingContractReference',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemBusinessTransactionDocumentReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemPriceCalculation',
                '@_type': 'PurchaseOrderMaintainRequestPriceCalculationItem',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemTaxCalculation',
                '@_type': 'PurchaseOrderMaintainRequestTaxCalculationItem',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemPlannedLandedCost',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemLandedCosts',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'ItemScheduleLine',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemScheduleLine',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
            'xsd:group': {
              '@_ref': 'xi16:PurchaseOrderMaintainRequestBundleItemGloExtension',
            },
          },
          'xsd:attribute': [
            {
              '@_name': 'ItemImatListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
            {
              '@_name': 'actionCode',
              '@_type': 'xi20:ActionCode',
            },
          ],
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItemBusinessTransactionDocumentReference',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentReference',
                '@_type': 'xi20:BusinessTransactionDocumentReference',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItemDeliveryTerms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MaximumLeadTimeDuration',
                '@_type': 'xi20:DAY_Duration',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryPriorityCode',
                '@_type': 'xi20:PriorityCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'QuantityTolerance',
                '@_type': 'xi20:QuantityTolerance',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItemIndividualMaterial',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BelongsToIndividualMaterialKey',
                '@_type': 'xi18:ProductKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveredIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItemLandedCosts',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PriceComponent',
                '@_type': 'xi26:PlannedLandedCostProfilePriceComponentCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CalculationMethod',
                '@_type': 'xi26:PlannedLandedCostProfileCalculationMethodCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ChargesBasedOn',
                '@_type': 'xi26:PlannedLandedCostProfileChargesBasedOn',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServiceProviderParty',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SOSTypeCode',
                '@_type': 'xi20:BusinessTransactionDocumentTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SOSID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SOSItemID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServiceProductID',
                '@_type': 'xi20:ProductID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServiceProductQuantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BaseProductQuantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Percentage',
                '@_type': 'xi20:Percent',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NetPrice',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NetValue',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItemLocation',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LocationID',
                '@_type': 'xi20:LocationID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AddressHostUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Address',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddress',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItemParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AddressHostUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Address',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddress',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItemProduct',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductStandardID',
                '@_type': 'xi20:ProductStandardID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductCategoryStandardID',
                '@_type': 'xi20:ProductCategoryStandardID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CashDiscountDeductibleIndicator',
                '@_type': 'xi20:Indicator',
              },
              {
                '@_name': 'ProductCategoryIDKey',
                '@_type': 'xi18:ProductCategoryHierarchyProductCategoryIDKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductKey',
                '@_type': 'xi18:ProductKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductRequirementSpecificationKey',
                '@_type': 'xi18:RequirementSpecificationKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductSellerID',
                '@_type': 'xi20:ProductPartyID',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleItemScheduleLine',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ItemScheduleLineID',
                '@_type': 'xi20:BusinessTransactionDocumentItemScheduleLineID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryPeriod',
                '@_type': 'xi20:UPPEROPEN_LOCALNORMALISED_DateTimePeriod',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Quantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'QuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ReplaceIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestBundleParty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyKey',
                '@_type': 'xi18:PartyKey',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestLocationAddress',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'CorrespondenceLanguageCode',
                '@_type': 'xi22:LanguageCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Email',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddressEmail',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'Facsimile',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddressFascmile',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'Telephone',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddressTelephone',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'Web',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddressWeb',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'DisplayName',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddressDisplayName',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'Name',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddressName',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'PostalAddress',
                '@_type': 'PurchaseOrderMaintainRequestLocationAddressPostalAddress',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestLocationAddressDisplayName',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'FormattedName',
              '@_type': 'xi20:LONG_Name',
              '@_minOccurs': '0',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestLocationAddressEmail',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'URI',
                '@_type': 'xi20:EmailURI',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DefaultIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'UsageDeniedIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestLocationAddressFascmile',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'Number',
                '@_type': 'xi20:PhoneNumber',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FormattedNumberDescription',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DefaultIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'UsageDeniedIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestLocationAddressName',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'AddressRepresentationCode',
                '@_type': 'xi20:AddressRepresentationCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Name',
                '@_type': 'xi20:OrganisationName',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestLocationAddressPostalAddress',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'AddressRepresentationCode',
                '@_type': 'xi20:AddressRepresentationCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RegionCode',
                '@_type': 'xi20:RegionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CountyName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CityName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AdditionalCityName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DistrictName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'StreetPostalCode',
                '@_type': 'xi20:PostalCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'POBoxPostalCode',
                '@_type': 'xi20:PostalCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CompanyPostalCode',
                '@_type': 'xi20:PostalCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'StreetPrefixName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AdditionalStreetPrefixName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'StreetName',
                '@_type': 'xi20:StreetName',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'StreetSuffixName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AdditionalStreetSuffixName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'HouseID',
                '@_type': 'xi20:HouseID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuildingID',
                '@_type': 'xi20:BuildingID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RoomID',
                '@_type': 'xi20:RoomID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FloorID',
                '@_type': 'xi20:FloorID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CareOfName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'POBoxDeviatingCountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'POBoxDeviatingRegionCode',
                '@_type': 'xi20:RegionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'POBoxDeviatingCityName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'POBoxID',
                '@_type': 'xi20:POBoxID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'POBoxIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxJurisdictionCode',
                '@_type': 'xi20:TaxJurisdictionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TimeZoneCode',
                '@_type': 'xi20:TimeZoneCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestLocationAddressTelephone',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'Number',
                '@_type': 'xi20:PhoneNumber',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FormattedNumberDescription',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DefaultConventionalPhoneNumberIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DefaultMobilePhoneNumberIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'UsageDeniedIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MobilePhoneNumberIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SMSEnabledIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestLocationAddressWeb',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'URI',
                '@_type': 'xi20:WebURI',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DefaultIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'UsageDeniedIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestPriceAndTaxCalculationItemItemPriceComponent',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'xi20:PriceSpecificationElementTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Description',
                '@_type': 'xi20:SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Rate',
                '@_type': 'xi20:Rate',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RateBaseQuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestPriceAndTaxCalculationItemItemProductTaxDetails',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TransactionCurrencyProductTax',
                '@_type': 'xi20:ProductTax',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestPriceAndTaxCalculationItemItemTaxationTerms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'SellerCountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SellerTaxID',
                '@_type': 'xi20:PartyTaxID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SellerTaxIdentificationNumberTypeCode',
                '@_type': 'xi20:TaxIdentificationNumberTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerCountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerTaxID',
                '@_type': 'xi20:PartyTaxID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerTaxIdentificationNumberTypeCode',
                '@_type': 'xi20:TaxIdentificationNumberTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EuropeanCommunityVATTriangulationIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxDate',
                '@_type': 'xi20:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxDueDate',
                '@_type': 'xi20:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxExemptionCertificateID',
                '@_type': 'xi20:TaxExemptionCertificateID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxExemptionReasonCode',
                '@_type': 'xi20:TaxExemptionReasonCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxExemptionReasonCodeRelevanceIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpTaxExemptionCertificateID',
                '@_type': 'xi20:TaxExemptionCertificateID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductTaxStandardClassificationCode',
                '@_type': 'xi20:ProductTaxStandardClassificationCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductTaxStandardClassificationSystemCode',
                '@_type': 'xi20:ProductTaxStandardClassificationSystemCode',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestPriceAndTaxCalculationItemItemWithholdingTaxDetails',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'WithholdingTax',
                '@_type': 'xi20:WithholdingTax',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TransactionCurrencyWithholdingTax',
                '@_type': 'xi20:WithholdingTax',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestPriceCalculationItem',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'itemPriceComponentListCompleteTransmissionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'itemProductTaxDetailsListCompleteTransmissionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'itemWithholdingTaxDetailsListCompleteTransmissionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxationCharacteristicsCode',
                '@_type': 'xi20:ProductTaxationCharacteristicsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxJurisdictionCode',
                '@_type': 'xi20:TaxJurisdictionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'WithholdingTaxationCharacteristicsCode',
                '@_type': 'xi20:WithholdingTaxationCharacteristicsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemPriceComponent',
                '@_type': 'PurchaseOrderMaintainRequestPriceAndTaxCalculationItemItemPriceComponent',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestTaxCalculationItem',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxationCharacteristicsCode',
                '@_type': 'xi20:ProductTaxationCharacteristicsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxJurisdictionCode',
                '@_type': 'xi20:TaxJurisdictionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'WithholdingTaxationCharacteristicsCode',
                '@_type': 'xi20:WithholdingTaxationCharacteristicsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemProductTaxDetails',
                '@_type': 'PurchaseOrderMaintainRequestPriceAndTaxCalculationItemItemProductTaxDetails',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'temTaxationTerms',
                '@_type': 'PurchaseOrderMaintainRequestPriceAndTaxCalculationItemItemTaxationTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemWithholdingTaxDetails',
                '@_type': 'PurchaseOrderMaintainRequestPriceAndTaxCalculationItemItemWithholdingTaxDetails',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'actionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderMaintainRequestUploadDeliveryTerms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodePartyTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MaximumLeadTimeDuration',
                '@_type': 'xi20:DAY_Duration',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'IncoTerms',
                '@_type': 'xi20:Incoterms_PO_excel_upload',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'QuantityTolerance',
                '@_type': 'xi20:QuantityTolerance',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'PurchaseOrderReadItemPriceComponent',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'xi20:PriceSpecificationElementTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Description',
                '@_type': 'xi20:SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Rate',
                '@_type': 'xi20:Rate',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RateBaseQuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderReadItemProductTaxDetails',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TransactionCurrencyProductTax',
                '@_type': 'xi20:ProductTax',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderReadItemTaxationTerms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SellerCountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SellerTaxID',
                '@_type': 'xi20:PartyTaxID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SellerTaxIdentificationNumberTypeCode',
                '@_type': 'xi20:TaxIdentificationNumberTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerCountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerTaxID',
                '@_type': 'xi20:PartyTaxID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerTaxIdentificationNumberTypeCode',
                '@_type': 'xi20:TaxIdentificationNumberTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EuropeanCommunityVATTriangulationIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxDate',
                '@_type': 'xi20:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxDueDate',
                '@_type': 'xi20:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxExemptionCertificateID',
                '@_type': 'xi20:TaxExemptionCertificateID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxExemptionReasonCode',
                '@_type': 'xi20:TaxExemptionReasonCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxExemptionReasonCodeRelevanceIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpTaxExemptionCertificateID',
                '@_type': 'xi20:TaxExemptionCertificateID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductTaxStandardClassificationCode',
                '@_type': 'xi20:ProductTaxStandardClassificationCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductTaxStandardClassificationSystemCode',
                '@_type': 'xi20:ProductTaxStandardClassificationSystemCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderReadItemWithholdingTaxDetails',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'WithholdingTax',
                '@_type': 'xi20:WithholdingTax',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TransactionCurrencyWithholdingTax',
                '@_type': 'xi20:WithholdingTax',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderReadPriceCalculationItem',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ItemPriceComponent',
                '@_type': 'PurchaseOrderReadItemPriceComponent',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'itemPriceComponentListCompleteTransmissionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'itemProductTaxDetailsListCompleteTransmissionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'itemWithholdingTaxDetailsListCompleteTransmissionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxationCharacteristicsCode',
                '@_type': 'xi20:ProductTaxationCharacteristicsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxJurisdictionCode',
                '@_type': 'xi20:TaxJurisdictionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'WithholdingTaxationCharacteristicsCode',
                '@_type': 'xi20:WithholdingTaxationCharacteristicsCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderReadTaxCalculationItem',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'CountryCode',
                '@_type': 'xi20:CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxationCharacteristicsCode',
                '@_type': 'xi20:ProductTaxationCharacteristicsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TaxJurisdictionCode',
                '@_type': 'xi20:TaxJurisdictionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'WithholdingTaxationCharacteristicsCode',
                '@_type': 'xi20:WithholdingTaxationCharacteristicsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemProductTaxDetails',
                '@_type': 'PurchaseOrderReadItemProductTaxDetails',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'ItemTaxationTerms',
                '@_type': 'PurchaseOrderReadItemTaxationTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemWithholdingTaxDetails',
                '@_type': 'PurchaseOrderReadItemWithholdingTaxDetails',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderUploadConfirmation',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ReferenceObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ChangeStateID',
                '@_type': 'xi20:ChangeStateID',
              },
              {
                '@_name': 'BusinessTransactionDocumentID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
              },
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderUploadConfirmationMessage_sync',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'PurchaseOrder',
                '@_type': 'PurchaseOrderUploadConfirmation',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'Log',
                '@_type': 'xi20:Log',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderUploadItem',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemID',
                '@_type': 'xi20:BusinessTransactionDocumentItemID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CancelItemPurchaseOrderActionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentItemTypeCode',
                '@_type': 'xi20:BusinessTransactionDocumentItemTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Quantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'QuantityTypeCode',
                '@_type': 'xi20:QuantityTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Description',
                '@_type': 'xi20:SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NetAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NetUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GrossAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GrossUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ListUnitPrice',
                '@_type': 'xi20:Price',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LimitAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryPeriod',
                '@_type': 'xi20:UPPEROPEN_LOCALNORMALISED_DateTimePeriod',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DirectMaterialIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ThirdPartyDealIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpPurchaseOrderConfirmation',
                '@_type': 'xi32:ProcurementDocumentItemFollowUpPurchaseOrderConfirmationForExcelUpload',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpDelivery',
                '@_type': 'xi32:ProcurementDocumentItemFollowUpDeliveryForExcelUpload',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpInvoice',
                '@_type': 'xi32:ProcurementDocumentItemFollowUpInvoiceForExcelUpload',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemDeliveryTerms',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemDeliveryTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemProduct',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemProduct',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemIndividualMaterial',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemIndividualMaterial',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'ShipToLocation',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemLocation',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ReceivingItemSite',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemLocation',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EndBuyerParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductRecipientParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServicePerformerParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RequestorParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemAccountingCodingBlockDistribution',
                '@_type': 'xi21:MaintenanceAccountingCodingBlockDistribution',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemAttachmentFolder',
                '@_type': 'xi23:MaintenanceAttachmentFolder',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemTextCollection',
                '@_type': 'xi23:MaintenanceTextCollection',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemPurchasingContractReference',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemBusinessTransactionDocumentReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemPriceCalculation',
                '@_type': 'PurchaseOrderMaintainRequestPriceCalculationItem',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemTaxCalculation',
                '@_type': 'PurchaseOrderMaintainRequestTaxCalculationItem',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryStartDate',
                '@_type': 'xi29:General_StringForExcelUpload',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryStartTimeZone',
                '@_type': 'xi22:TimeZoneCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryEndDate',
                '@_type': 'xi29:General_StringForExcelUpload',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryEndTimeZone',
                '@_type': 'xi22:TimeZoneCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemPlannedLandedCost',
                '@_type': 'PurchaseOrderMaintainRequestBundleItemLandedCosts',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
            'xsd:group': {
              '@_ref': 'PurchaseOrderUploadItemGloExtension',
            },
          },
          'xsd:attribute': [
            {
              '@_name': 'ItemImatListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
            {
              '@_name': 'actionCode',
              '@_type': 'xi20:ActionCode',
            },
          ],
        },
        {
          '@_name': 'PurchaseOrderUploadRequest',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ChangeStateID',
                '@_type': 'xi20:ChangeStateID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentTypeCode',
                '@_type': 'xi20:BusinessTransactionDocumentTypeCode',
              },
              {
                '@_name': 'Name',
                '@_type': 'xi20:MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderID',
                '@_type': 'xi20:BusinessTransactionDocumentID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Date',
                '@_type': 'xi20:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'OrderPurchaseOrderActionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CancelPurchaseOrderActionIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PreventDocumentOutputIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CurrencyCode',
                '@_type': 'xi20:CurrencyCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BuyerParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SellerParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EmployeeResponsibleParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BillToParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ResponsiblePurchasingUnitParty',
                '@_type': 'PurchaseOrderMaintainRequestBundleParty',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AttachmentFolder',
                '@_type': 'xi23:MaintenanceAttachmentFolder',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TextCollection',
                '@_type': 'xi23:MaintenanceTextCollection',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryTerms',
                '@_type': 'PurchaseOrderMaintainRequestUploadDeliveryTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CashDiscountTerms',
                '@_type': 'xi19:PurchaseOrderMaintenanceCashDiscountTerms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Item',
                '@_type': 'PurchaseOrderUploadItem',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
          'xsd:attribute': [
            {
              '@_name': 'actionCode',
              '@_type': 'xi20:ActionCode',
            },
            {
              '@_name': 'ItemListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
          ],
        },
        {
          '@_name': 'PurchaseOrderUploadRequestMessage_sync',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'BasicMessageHeader',
                '@_type': 'xi20:BusinessDocumentBasicMessageHeader',
              },
              {
                '@_name': 'PurchaseOrder',
                '@_type': 'PurchaseOrderUploadRequest',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
        },
      ],
      'xsd:group': [
        {
          '@_name': 'PurchaseOrderByIDResponseItemGloExtension',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'HSNCodeIndiaCode',
              '@_minOccurs': '0',
              '@_form': 'qualified',
              '@_type': 'xi20:ProductTaxStandardClassificationCode',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderUploadItemGloExtension',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'HSNCodeIndiaCode',
              '@_minOccurs': '0',
              '@_form': 'qualified',
              '@_type': 'xi20:ProductTaxStandardClassificationCode',
            },
          },
        },
      ],
      'xsd:attributeGroup': [
        {
          '@_name': 'PurchaseOrderByIDResponseItemGloExtension',
        },
        {
          '@_name': 'PurchaseOrderUploadItemGloExtension',
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/A1S/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/Globalization',
      'xsd:import': {
        '@_namespace': 'http://sap.com/xi/AP/Common/GDT',
      },
      'xsd:group': {
        '@_name': 'PurchaseOrderMaintainRequestBundleItemGloExtension',
        'xsd:sequence': {
          'xsd:element': {
            '@_name': 'HSNCodeIndiaCode',
            '@_minOccurs': '0',
            '@_form': 'qualified',
            '@_type': 'xi20:ProductTaxStandardClassificationCode',
          },
        },
      },
      'xsd:attributeGroup': {
        '@_name': 'PurchaseOrderMaintainRequestBundleItemGloExtension',
      },
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/Globalization',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/SAPGlobal20/Global',
      'xsd:import': {
        '@_namespace': 'http://sap.com/xi/A1S/Global',
      },
      'xsd:element': [
        {
          '@_name': 'PurchaseOrderBundleCheckMaintainRequest_sync',
          '@_type': 'xi15:PurchaseOrderBundleMaintainRequestMessage_sync',
        },
        {
          '@_name': 'PurchaseOrderBundleMaintainConfirmation_sync',
          '@_type': 'xi15:PurchaseOrderMaintainConfirmationBundleMessage_sync',
        },
        {
          '@_name': 'PurchaseOrderBundleMaintainRequest_sync',
          '@_type': 'xi15:PurchaseOrderBundleMaintainRequestMessage_sync',
        },
        {
          '@_name': 'PurchaseOrderByIDQuery_sync',
          '@_type': 'xi15:PurchaseOrderByIDQueryMessage_sync',
        },
        {
          '@_name': 'PurchaseOrderByIDResponse_sync',
          '@_type': 'xi15:PurchaseOrderByIDResponseMessage_sync',
        },
        {
          '@_name': 'PurchaseOrderUploadConfirmation_sync',
          '@_type': 'xi15:PurchaseOrderUploadConfirmationMessage_sync',
        },
        {
          '@_name': 'PurchaseOrderUploadRequest_sync',
          '@_type': 'xi15:PurchaseOrderUploadRequestMessage_sync',
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/SAPGlobal20/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/Common/Global',
      'xsd:import': {
        '@_namespace': 'http://sap.com/xi/AP/Common/GDT',
      },
      'xsd:complexType': [
        {
          '@_name': 'ExchangeFaultData',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'faultText',
                '@_type': 'xsd:string',
              },
              {
                '@_name': 'faultUrl',
                '@_type': 'xsd:string',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'faultDetail',
                '@_type': 'ExchangeLogData',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
        },
        {
          '@_name': 'ExchangeLogData',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'severity',
                '@_type': 'xsd:string',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'text',
                '@_type': 'xsd:string',
              },
              {
                '@_name': 'url',
                '@_type': 'xsd:string',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'id',
                '@_type': 'xsd:string',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PartyKey',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'PartyTypeCode',
                '@_type': 'xi20:BusinessObjectTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PartyID',
                '@_type': 'xi20:PartyID',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'ProductCategoryHierarchyProductCategoryIDKey',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ProductCategoryHierarchyID',
                '@_type': 'xi20:ProductCategoryHierarchyID',
              },
              {
                '@_name': 'ProductCategoryInternalID',
                '@_type': 'xi20:ProductCategoryInternalID',
              },
            ],
          },
        },
        {
          '@_name': 'ProductKey',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ProductTypeCode',
                '@_type': 'xi20:ProductTypeCode',
              },
              {
                '@_name': 'ProductIdentifierTypeCode',
                '@_type': 'xi20:ProductIdentifierTypeCode',
              },
              {
                '@_name': 'ProductID',
                '@_type': 'xi20:ProductID',
              },
            ],
          },
        },
        {
          '@_name': 'RequirementSpecificationKey',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'RequirementSpecificationID',
                '@_type': 'xi20:RequirementSpecificationID',
              },
              {
                '@_name': 'RequirementSpecificationVersionID',
                '@_type': 'xi20:VersionID',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'StandardFaultMessageExtension',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'Log',
              '@_type': 'xi20:Log',
              '@_minOccurs': '0',
            },
          },
        },
      ],
      'xsd:simpleType': {
        '@_name': 'LEN120_LANGUAGEINDEPENDENT_Text',
        'xsd:annotation': {
          'xsd:documentation': {
            '@_xml:lang': 'EN',
            'ccts:RepresentationTerm': 'Text',
          },
        },
        'xsd:restriction': {
          '@_base': 'xsd:string',
          'xsd:maxLength': {
            '@_value': '120',
          },
          'xsd:minLength': {
            '@_value': '1',
          },
        },
      },
      'xsd:element': {
        '@_name': 'StandardFaultMessage',
        'xsd:complexType': {
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'standard',
                '@_type': 'ExchangeFaultData',
              },
              {
                '@_name': 'addition',
                '@_type': 'StandardFaultMessageExtension',
              },
            ],
          },
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/Common/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      'xsd:import': [
        {
          '@_namespace': 'http://sap.com/xi/BASIS/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/Common/GDT',
        },
      ],
      'xsd:complexType': [
        {
          '@_name': 'AccessCashDiscountTerms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Code',
                '@_type': 'xi20:CashDiscountTermsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Name',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CashDiscountLevelCode',
                '@_type': 'xi20:CashDiscountLevelCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CashDiscountLevelName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PaymentBaselineDate',
                '@_type': 'xi22:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MaximumCashDiscount',
                '@_type': 'xi20:CashDiscount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NormalCashDiscount',
                '@_type': 'xi20:CashDiscount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FullPaymentDueDaysValue',
                '@_type': 'xi20:FullPaymentCashDiscountTermsDueDaysValue',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FullPaymentDayOfMonthValue',
                '@_type': 'xi20:FullPaymentCashDiscountTermsDayOfMonthValue',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FullPaymentMonthOffsetValue',
                '@_type': 'xi20:FullPaymentCashDiscountTermsMonthOffsetValue',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FullPaymentEndDate',
                '@_type': 'xi22:Date',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderMaintenanceCashDiscountTerms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ObjectNodeSenderTechnicalID',
                '@_type': 'xi20:ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Code',
                '@_type': 'xi20:CashDiscountTermsCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PaymentBaselineDate',
                '@_type': 'xi22:Date',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/Common/GDT',
      'xsd:import': {
        '@_namespace': 'http://sap.com/xi/BASIS/Global',
      },
      'xsd:simpleType': [
        {
          '@_name': 'AccountDeterminationExpenseGroupCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'AccountingCodingBlockTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ActionCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '01',
              },
              {
                '@_value': '02',
              },
              {
                '@_value': '03',
              },
              {
                '@_value': '04',
              },
              {
                '@_value': '05',
              },
              {
                '@_value': '06',
              },
            ],
            'xsd:length': {
              '@_value': '2',
            },
          },
        },
        {
          '@_name': 'AddressHostTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'AddressRepresentationCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '1',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'AgencyIdentificationCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'Amount.Content',
          'xsd:restriction': {
            '@_base': 'xsd:decimal',
            'xsd:totalDigits': {
              '@_value': '28',
            },
            'xsd:fractionDigits': {
              '@_value': '6',
            },
            'xsd:maxInclusive': {
              '@_value': '9999999999999999999999.999999',
            },
            'xsd:minInclusive': {
              '@_value': '-9999999999999999999999.999999',
            },
          },
        },
        {
          '@_name': 'ApprovalStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
              {
                '@_value': '5',
              },
              {
                '@_value': '6',
              },
              {
                '@_value': '7',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BuildingID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessDocumentMessageID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '35',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessObjectTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessPartnerInternalID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '35',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentItemGroupID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentItemID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentItemScheduleLineID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentItemTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentProcessingTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CancellationStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
              {
                '@_value': '5',
              },
              {
                '@_value': '6',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CashDiscountDayOfMonthValue',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Value',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:int',
            'xsd:maxInclusive': {
              '@_value': '99',
            },
            'xsd:minInclusive': {
              '@_value': '-99',
            },
          },
        },
        {
          '@_name': 'CashDiscountDaysValue',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Value',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:int',
            'xsd:maxInclusive': {
              '@_value': '999',
            },
            'xsd:minInclusive': {
              '@_value': '-999',
            },
          },
        },
        {
          '@_name': 'CashDiscountLevelCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:length': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CashDiscountMonthOffsetValue',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Value',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:int',
            'xsd:maxInclusive': {
              '@_value': '99',
            },
            'xsd:minInclusive': {
              '@_value': '-99',
            },
          },
        },
        {
          '@_name': 'CashDiscountPercent',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Percent',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:decimal',
            'xsd:totalDigits': {
              '@_value': '5',
            },
            'xsd:fractionDigits': {
              '@_value': '3',
            },
            'xsd:maxInclusive': {
              '@_value': '99.999',
            },
            'xsd:minInclusive': {
              '@_value': '-99.999',
            },
          },
        },
        {
          '@_name': 'CashDiscountTermsCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ChangeStateID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CostObjectTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CountryCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '2',
            },
          },
        },
        {
          '@_name': 'CountryDiallingCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CurrencyCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '3',
            },
          },
        },
        {
          '@_name': 'DAY_Duration',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Duration',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:duration',
            'xsd:pattern': {
              '@_value': '[-P0-9D]{1,20}',
            },
          },
        },
        {
          '@_name': 'Date',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Date',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:date',
            'xsd:pattern': {
              '@_value': '[0-9]{4}-[0-9]{2}-[0-9]{2}',
            },
          },
        },
        {
          '@_name': 'DecimalValue',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Value',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:decimal',
            'xsd:totalDigits': {
              '@_value': '31',
            },
            'xsd:fractionDigits': {
              '@_value': '14',
            },
            'xsd:maxInclusive': {
              '@_value': '99999999999999999.99999999999999',
            },
            'xsd:minInclusive': {
              '@_value': '-99999999999999999.99999999999999',
            },
          },
        },
        {
          '@_name': 'DeliveryStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'DocumentCategoryCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:length': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'DocumentTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'DueCategoryCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '1',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'Duration',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Duration',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:duration',
            'xsd:pattern': {
              '@_value': '.{1,20}',
            },
          },
        },
        {
          '@_name': 'EXTENDED_Name.Content',
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '255',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'EmployeeID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '20',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ExchangeRateRate',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Numeric',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:decimal',
            'xsd:totalDigits': {
              '@_value': '28',
            },
            'xsd:fractionDigits': {
              '@_value': '14',
            },
            'xsd:maxInclusive': {
              '@_value': '99999999999999.99999999999999',
            },
            'xsd:minInclusive': {
              '@_value': '-99999999999999.99999999999999',
            },
          },
        },
        {
          '@_name': 'FinancialAccountingViewOfCostObjectID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'FloorID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'FollowUpBusinessTransactionDocumentRequirementCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '03',
              },
              {
                '@_value': '02',
              },
              {
                '@_value': '01',
              },
              {
                '@_value': '05',
              },
              {
                '@_value': '04',
              },
            ],
            'xsd:length': {
              '@_value': '2',
            },
          },
        },
        {
          '@_name': 'FormOfAddressCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'FullPaymentCashDiscountTermsDayOfMonthValue',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Value',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:int',
            'xsd:maxInclusive': {
              '@_value': '99',
            },
            'xsd:minInclusive': {
              '@_value': '-99',
            },
          },
        },
        {
          '@_name': 'FullPaymentCashDiscountTermsDueDaysValue',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Value',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:int',
            'xsd:maxInclusive': {
              '@_value': '999',
            },
            'xsd:minInclusive': {
              '@_value': '-999',
            },
          },
        },
        {
          '@_name': 'FullPaymentCashDiscountTermsMonthOffsetValue',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Value',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:int',
            'xsd:maxInclusive': {
              '@_value': '99',
            },
            'xsd:minInclusive': {
              '@_value': '-99',
            },
          },
        },
        {
          '@_name': 'GeneralLedgerAccountAliasCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '16',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'GeneralLedgerAccountAliasUsageCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'HouseID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'IdentityID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'IncotermsClassificationCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'IncotermsTransferLocationName',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Name',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '28',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'Indicator',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Indicator',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:boolean',
          },
        },
        {
          '@_name': 'IntegerValue',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Value',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:int',
          },
        },
        {
          '@_name': 'InvoicingStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LANGUAGEINDEPENDENT_LONG_Name',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Name',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '80',
            },
          },
        },
        {
          '@_name': 'LANGUAGEINDEPENDENT_LONG_Text',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Text',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '80',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LANGUAGEINDEPENDENT_MEDIUM_Name',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Name',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '40',
            },
          },
        },
        {
          '@_name': 'LANGUAGEINDEPENDENT_MEDIUM_Text',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Text',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LANGUAGEINDEPENDENT_Name',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Name',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
          },
        },
        {
          '@_name': 'LANGUAGEINDEPENDENT_SHORT_Description',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Description',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '40',
            },
          },
        },
        {
          '@_name': 'LANGUAGEINDEPENDENT_Text',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Text',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
          },
        },
        {
          '@_name': 'LONG_Name.Content',
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '80',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LegallyRequiredPhraseText',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Text',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '255',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LocationID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '20',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LogItemCategoryCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '15',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LogItemNote',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Note',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '200',
            },
          },
        },
        {
          '@_name': 'LogItemNoteTemplateText',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Text',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '73',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LogItemPlaceholderSubstitutionText',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Text',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '50',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LogItemSeverityCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '1',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LogItemTemplatePlaceholderID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:length': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'LogItemTypeID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'MEDIUM_Description.Content',
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '80',
            },
          },
        },
        {
          '@_name': 'MEDIUM_Name.Content',
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'MIMECode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'MeasureUnitCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ObjectNodePartyTechnicalID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '70',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ObjectNodeTechnicalID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '70',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ObjectTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'OrderingStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'OrganisationalCentreID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '20',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'POBoxID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PartyID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '60',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PartyTaxID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '20',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'Percent',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Percent',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:decimal',
            'xsd:totalDigits': {
              '@_value': '16',
            },
            'xsd:fractionDigits': {
              '@_value': '6',
            },
            'xsd:maxInclusive': {
              '@_value': '9999999999.999999',
            },
            'xsd:minInclusive': {
              '@_value': '-9999999999.999999',
            },
          },
        },
        {
          '@_name': 'PhoneNumberAreaID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PhoneNumberExtensionID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PhoneNumberSubscriberID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '30',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PostalCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PriceSpecificationElementTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PriorityCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '1',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProcessingResultCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProcessingStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
              {
                '@_value': '5',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProcurementDocumentDataOriginTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductCategoryHierarchyID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductCategoryInternalID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '20',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductCategoryStandardID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '60',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductIdentifierTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductPartyID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '60',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductStandardID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '14',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductTaxEventTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductTaxStandardClassificationCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '16',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductTaxStandardClassificationSystemCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductTaxationCharacteristicsCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProductTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProjectElementID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '24',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProjectElementTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'ProjectID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '24',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PropertyDataTypeFormatCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderConfirmationStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
              {
                '@_value': '5',
              },
              {
                '@_value': '6',
              },
              {
                '@_value': '7',
              },
              {
                '@_value': '8',
              },
              {
                '@_value': '9',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderDeliveryStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PurchaseOrderLifeCycleStatusCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
              {
                '@_value': '5',
              },
              {
                '@_value': '6',
              },
              {
                '@_value': '7',
              },
              {
                '@_value': '8',
              },
              {
                '@_value': '9',
              },
              {
                '@_value': '10',
              },
            ],
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'Quantity.Content',
          'xsd:restriction': {
            '@_base': 'xsd:decimal',
            'xsd:totalDigits': {
              '@_value': '31',
            },
            'xsd:fractionDigits': {
              '@_value': '14',
            },
            'xsd:maxInclusive': {
              '@_value': '99999999999999999.99999999999999',
            },
            'xsd:minInclusive': {
              '@_value': '-99999999999999999.99999999999999',
            },
          },
        },
        {
          '@_name': 'QuantityTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'RegionCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '6',
            },
          },
        },
        {
          '@_name': 'RequirementSpecificationID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'RoomID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'SHORT_Description.Content',
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'StreetName',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Name',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '60',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxDeductibilityCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxExemptionCertificateID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '30',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxExemptionReasonCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxIdentificationNumberTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxJurisdictionCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '25',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxJurisdictionSubdivisionCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '15',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxJurisdictionSubdivisionTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxRateTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TaxTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TextCollectionTextTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TimeZoneCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'UUID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '36',
            },
            'xsd:minLength': {
              '@_value': '36',
            },
            'xsd:pattern': {
              '@_value': '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
            },
          },
        },
        {
          '@_name': 'VersionID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '32',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'WebURI',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'URI',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:anyURI',
          },
        },
        {
          '@_name': 'WithholdingTaxEventTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'WithholdingTaxIncomeTypeCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '8',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'WithholdingTaxationCharacteristicsCode.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '4',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
      ],
      'xsd:complexType': [
        {
          '@_name': 'AccountingCodingBlockTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'AccountingCodingBlockTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'AddressRepresentationCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'AddressRepresentationCode.Content',
              'xsd:attribute': {
                '@_name': 'listAgencyID',
                'xsd:simpleType': {
                  'xsd:restriction': {
                    '@_base': 'xsd:token',
                    'xsd:maxLength': {
                      '@_value': '60',
                    },
                    'xsd:minLength': {
                      '@_value': '1',
                    },
                  },
                },
              },
            },
          },
        },
        {
          '@_name': 'Amount',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Amount',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'Amount.Content',
              'xsd:attribute': {
                '@_name': 'currencyCode',
                '@_use': 'required',
                '@_type': 'xi22:CurrencyCode',
              },
            },
          },
        },
        {
          '@_name': 'BusinessDocumentBasicMessageHeader',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ID',
                '@_type': 'BusinessDocumentMessageID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'UUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ReferenceID',
                '@_type': 'BusinessDocumentMessageID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ReferenceUUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'BusinessDocumentMessageID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'BusinessDocumentMessageID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'BusinessObjectTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'BusinessObjectTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'BusinessTransactionDocumentID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentReference',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ID',
                '@_type': 'BusinessTransactionDocumentID',
              },
              {
                '@_name': 'UUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'BusinessTransactionDocumentTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemID',
                '@_type': 'BusinessTransactionDocumentItemID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemUUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ItemTypeCode',
                '@_type': 'BusinessTransactionDocumentItemTypeCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'BusinessTransactionDocumentTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'BusinessTransactionDocumentTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'CashDiscount',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'DaysValue',
                '@_type': 'CashDiscountDaysValue',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DayOfMonthValue',
                '@_type': 'CashDiscountDayOfMonthValue',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MonthOffsetValue',
                '@_type': 'CashDiscountMonthOffsetValue',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EndDate',
                '@_type': 'Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Percent',
                '@_type': 'CashDiscountPercent',
              },
            ],
          },
        },
        {
          '@_name': 'CashDiscountLevelCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'CashDiscountLevelCode.Content',
              'xsd:attribute': {
                '@_name': 'listVersionID',
                'xsd:simpleType': {
                  'xsd:restriction': {
                    '@_base': 'xsd:token',
                    'xsd:maxLength': {
                      '@_value': '15',
                    },
                    'xsd:minLength': {
                      '@_value': '1',
                    },
                  },
                },
              },
            },
          },
        },
        {
          '@_name': 'CashDiscountTermsCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'CashDiscountTermsCode.Content',
              'xsd:attribute': {
                '@_name': 'listAgencyID',
                'xsd:simpleType': {
                  'xsd:restriction': {
                    '@_base': 'xsd:token',
                    'xsd:maxLength': {
                      '@_value': '60',
                    },
                    'xsd:minLength': {
                      '@_value': '1',
                    },
                  },
                },
              },
            },
          },
        },
        {
          '@_name': 'CostObjectTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'CostObjectTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'DatePeriod',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'StartDate',
                '@_type': 'Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EndDate',
                '@_type': 'Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Duration',
                '@_type': 'Duration',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'Description',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Description',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'xsd:string',
              'xsd:attribute': {
                '@_name': 'languageCode',
                '@_type': 'xi22:LanguageCode',
              },
            },
          },
        },
        {
          '@_name': 'DocumentTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'DocumentTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'EXTENDED_Name',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Name',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'EXTENDED_Name.Content',
              'xsd:attribute': {
                '@_name': 'languageCode',
                '@_type': 'xi22:LanguageCode',
              },
            },
          },
        },
        {
          '@_name': 'EmailURI',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'URI',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'xsd:anyURI',
              'xsd:attribute': {
                '@_name': 'schemeID',
                'xsd:simpleType': {
                  'xsd:restriction': {
                    '@_base': 'xsd:token',
                    'xsd:maxLength': {
                      '@_value': '60',
                    },
                    'xsd:minLength': {
                      '@_value': '1',
                    },
                  },
                },
              },
            },
          },
        },
        {
          '@_name': 'EmployeeID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'EmployeeID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ExchangeRate',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UnitCurrency',
                '@_type': 'CurrencyCode',
              },
              {
                '@_name': 'QuotedCurrency',
                '@_type': 'CurrencyCode',
              },
              {
                '@_name': 'Rate',
                '@_type': 'ExchangeRateRate',
              },
              {
                '@_name': 'QuotationDateTime',
                '@_type': 'xi22:GLOBAL_DateTime',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'FormOfAddressCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'FormOfAddressCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeAgencyID',
                  '@_type': 'AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'GeneralLedgerAccountAliasCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'GeneralLedgerAccountAliasCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'GeneralLedgerAccountAliasCodeContextElements',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'UsageCode',
              '@_type': 'GeneralLedgerAccountAliasUsageCode',
            },
          },
        },
        {
          '@_name': 'IdentityID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'IdentityID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'Incoterms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ClassificationCode',
                '@_type': 'IncotermsClassificationCode',
              },
              {
                '@_name': 'TransferLocationName',
                '@_type': 'IncotermsTransferLocationName',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'Incoterms_PO_excel_upload',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ClassificationCode',
                '@_type': 'IncotermsClassificationCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TransferLocationName',
                '@_type': 'IncotermsTransferLocationName',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'LONG_Name',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Name',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'LONG_Name.Content',
              'xsd:attribute': {
                '@_name': 'languageCode',
                '@_type': 'xi22:LanguageCode',
              },
            },
          },
        },
        {
          '@_name': 'LocationID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'LocationID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'Log',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'BusinessDocumentProcessingResultCode',
                '@_type': 'ProcessingResultCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MaximumLogItemSeverityCode',
                '@_type': 'LogItemSeverityCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Item',
                '@_type': 'LogItem',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
        },
        {
          '@_name': 'LogItem',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'TypeID',
                '@_type': 'LogItemTypeID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CategoryCode',
                '@_type': 'LogItemCategoryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SeverityCode',
                '@_type': 'LogItemSeverityCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ReferenceObjectNodeSenderTechnicalID',
                '@_type': 'ObjectNodePartyTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ReferenceMessageElementName',
                '@_type': 'LANGUAGEINDEPENDENT_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Note',
                '@_type': 'LogItemNote',
              },
              {
                '@_name': 'NoteTemplateText',
                '@_type': 'LogItemNoteTemplateText',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LogItemNotePlaceholderSubstitutionList',
                '@_type': 'LogItemNotePlaceholderSubstitutionList',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'WebURI',
                '@_type': 'WebURI',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'LogItemCategoryCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'LogItemCategoryCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'LogItemNotePlaceholderSubstitutionList',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'FirstPlaceholderID',
                '@_type': 'LogItemTemplatePlaceholderID',
              },
              {
                '@_name': 'SecondPlaceholderID',
                '@_type': 'LogItemTemplatePlaceholderID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ThirdPlaceholderID',
                '@_type': 'LogItemTemplatePlaceholderID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FourthPlaceholderID',
                '@_type': 'LogItemTemplatePlaceholderID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FirstPlaceholderSubstitutionText',
                '@_type': 'LogItemPlaceholderSubstitutionText',
              },
              {
                '@_name': 'SecondPlaceholderSubstitutionText',
                '@_type': 'LogItemPlaceholderSubstitutionText',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ThirdPlaceholderSubstitutionText',
                '@_type': 'LogItemPlaceholderSubstitutionText',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FourthPlaceholderSubstitutionText',
                '@_type': 'LogItemPlaceholderSubstitutionText',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'MEDIUM_Description',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Description',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'MEDIUM_Description.Content',
              'xsd:attribute': {
                '@_name': 'languageCode',
                '@_type': 'xi22:LanguageCode',
              },
            },
          },
        },
        {
          '@_name': 'MEDIUM_Name',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Name',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'MEDIUM_Name.Content',
              'xsd:attribute': {
                '@_name': 'languageCode',
                '@_type': 'xi22:LanguageCode',
              },
            },
          },
        },
        {
          '@_name': 'NamespaceURI',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'URI',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'xsd:anyURI',
              'xsd:attribute': {
                '@_name': 'schemeID',
                'xsd:simpleType': {
                  'xsd:restriction': {
                    '@_base': 'xsd:token',
                    'xsd:maxLength': {
                      '@_value': '60',
                    },
                    'xsd:minLength': {
                      '@_value': '1',
                    },
                  },
                },
              },
            },
          },
        },
        {
          '@_name': 'ObjectTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ObjectTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'OrganisationName',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'FormOfAddressCode',
                '@_type': 'FormOfAddressCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FirstLineName',
                '@_type': 'LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SecondLineName',
                '@_type': 'LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ThirdLineName',
                '@_type': 'LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FourthLineName',
                '@_type': 'LANGUAGEINDEPENDENT_MEDIUM_Name',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PartyAddressReference',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'AddressHostUUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AddressHostTypeCode',
                '@_type': 'AddressHostTypeCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PartyID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'PartyID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'PartyTaxID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'PartyTaxID.Content',
              'xsd:attribute': {
                '@_name': 'schemeID',
                '@_use': 'required',
                'xsd:simpleType': {
                  'xsd:restriction': {
                    '@_base': 'xsd:token',
                    'xsd:maxLength': {
                      '@_value': '60',
                    },
                    'xsd:minLength': {
                      '@_value': '1',
                    },
                  },
                },
              },
            },
          },
        },
        {
          '@_name': 'PhoneNumber',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'AreaID',
                '@_type': 'PhoneNumberAreaID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SubscriberID',
                '@_type': 'PhoneNumberSubscriberID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ExtensionID',
                '@_type': 'PhoneNumberExtensionID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CountryCode',
                '@_type': 'CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CountryDiallingCode',
                '@_type': 'CountryDiallingCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CountryName',
                '@_type': 'MEDIUM_Name',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'Price',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'Amount',
                '@_type': 'Amount',
              },
              {
                '@_name': 'BaseQuantity',
                '@_type': 'Quantity',
              },
              {
                '@_name': 'BaseQuantityTypeCode',
                '@_type': 'QuantityTypeCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PriceSpecificationElementTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'PriceSpecificationElementTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProductCategoryHierarchyID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProductCategoryHierarchyID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProductCategoryStandardID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProductCategoryStandardID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  '@_use': 'required',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '3',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProductID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProductID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProductStandardID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProductStandardID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  '@_use': 'required',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '3',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProductTax',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'CountryCode',
                '@_type': 'CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RegionCode',
                '@_type': 'RegionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'JurisdictionCode',
                '@_type': 'TaxJurisdictionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'JurisdictionSubdivisionCode',
                '@_type': 'TaxJurisdictionSubdivisionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'JurisdictionSubdivisionTypeCode',
                '@_type': 'TaxJurisdictionSubdivisionTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EventTypeCode',
                '@_type': 'ProductTaxEventTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'TaxTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RateTypeCode',
                '@_type': 'TaxRateTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CurrencyCode',
                '@_type': 'CurrencyCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BaseAmount',
                '@_type': 'Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Percent',
                '@_type': 'Percent',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BaseQuantity',
                '@_type': 'Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BaseQuantityTypeCode',
                '@_type': 'QuantityTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Rate',
                '@_type': 'Rate',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Amount',
                '@_type': 'Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'InternalAmount',
                '@_type': 'Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NonDeductiblePercent',
                '@_type': 'Percent',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NonDeductibleAmount',
                '@_type': 'Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeductibleAmount',
                '@_type': 'Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeductibilityCode',
                '@_type': 'TaxDeductibilityCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentItemGroupID',
                '@_type': 'BusinessTransactionDocumentItemGroupID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EuropeanCommunityVATTriangulationIndicator',
                '@_type': 'Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DueCategoryCode',
                '@_type': 'DueCategoryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'StatisticRelevanceIndicator',
                '@_type': 'Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeferredIndicator',
                '@_type': 'Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Exemption',
                '@_type': 'TaxExemption',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FollowUpExemption',
                '@_type': 'TaxExemption',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LegallyRequiredPhrase',
                '@_type': 'LegallyRequiredPhraseText',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ExchangeRate',
                '@_type': 'ExchangeRate',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'ProductTaxEventTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProductTaxEventTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  '@_use': 'required',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProductTaxStandardClassificationCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProductTaxStandardClassificationCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProductTaxStandardClassificationSystemCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProductTaxStandardClassificationSystemCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProductTaxationCharacteristicsCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProductTaxationCharacteristicsCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  '@_use': 'required',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProjectElementID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProjectElementID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProjectID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'ProjectID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'ProjectReference',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ProjectID',
                '@_type': 'ProjectID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectUUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectName',
                '@_type': 'MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectElementID',
                '@_type': 'ProjectElementID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectElementUUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectElementName',
                '@_type': 'MEDIUM_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectElementTypeCode',
                '@_type': 'ProjectElementTypeCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'Quantity',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Quantity',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'Quantity.Content',
              'xsd:attribute': {
                '@_name': 'unitCode',
                '@_type': 'MeasureUnitCode',
              },
            },
          },
        },
        {
          '@_name': 'QuantityTolerance',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'OverPercent',
                '@_type': 'Percent',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'OverPercentUnlimitedIndicator',
                '@_type': 'Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'UnderPercent',
                '@_type': 'Percent',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'QuantityTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'QuantityTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'Rate',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'DecimalValue',
                '@_type': 'DecimalValue',
              },
              {
                '@_name': 'MeasureUnitCode',
                '@_type': 'MeasureUnitCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CurrencyCode',
                '@_type': 'CurrencyCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BaseDecimalValue',
                '@_default': '1',
                '@_type': 'DecimalValue',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BaseMeasureUnitCode',
                '@_type': 'MeasureUnitCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BaseCurrencyCode',
                '@_type': 'CurrencyCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'RegionCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'RegionCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'RequirementSpecificationID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'RequirementSpecificationID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'SHORT_Description',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Description',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'SHORT_Description.Content',
              'xsd:attribute': {
                '@_name': 'languageCode',
                '@_type': 'xi22:LanguageCode',
              },
            },
          },
        },
        {
          '@_name': 'SystemAdministrativeData',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'CreationDateTime',
                '@_type': 'xi22:GLOBAL_DateTime',
              },
              {
                '@_name': 'CreationIdentityUUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LastChangeDateTime',
                '@_type': 'xi22:GLOBAL_DateTime',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LastChangeIdentityUUID',
                '@_type': 'UUID',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'TaxDeductibilityCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxDeductibilityCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'TaxExemption',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'CertificateID',
                '@_type': 'TaxExemptionCertificateID',
              },
              {
                '@_name': 'InternalCertificateID',
                '@_type': 'TaxExemptionCertificateID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ValidityPeriod',
                '@_type': 'DatePeriod',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Percent',
                '@_type': 'Percent',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Amount',
                '@_type': 'Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ReasonCode',
                '@_type': 'TaxExemptionReasonCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'TaxExemptionCertificateID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxExemptionCertificateID.Content',
              'xsd:attribute': {
                '@_name': 'schemeAgencyID',
                'xsd:simpleType': {
                  'xsd:restriction': {
                    '@_base': 'xsd:token',
                    'xsd:maxLength': {
                      '@_value': '60',
                    },
                    'xsd:minLength': {
                      '@_value': '1',
                    },
                  },
                },
              },
            },
          },
        },
        {
          '@_name': 'TaxExemptionReasonCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxExemptionReasonCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  '@_use': 'required',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'TaxIdentificationNumberTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxIdentificationNumberTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '3',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'TaxJurisdictionCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxJurisdictionCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'TaxJurisdictionSubdivisionCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxJurisdictionSubdivisionCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'TaxJurisdictionSubdivisionTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxJurisdictionSubdivisionTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'TaxRateTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxRateTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  '@_use': 'required',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'TaxTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TaxTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  '@_use': 'required',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'Text',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Text',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'xsd:string',
              'xsd:attribute': {
                '@_name': 'languageCode',
                '@_type': 'xi22:LanguageCode',
              },
            },
          },
        },
        {
          '@_name': 'TextCollectionTextTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'TextCollectionTextTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencySchemeAgencyID',
                  '@_type': 'xi22:AgencyIdentificationCode',
                },
              ],
            },
          },
        },
        {
          '@_name': 'UPPEROPEN_LOCALNORMALISED_DateTimePeriod',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'StartDateTime',
                '@_type': 'xi22:LOCALNORMALISED_DateTime',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EndDateTime',
                '@_type': 'xi22:LOCALNORMALISED_DateTime',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'UUID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'UUID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'WithholdingTax',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'CountryCode',
                '@_type': 'CountryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RegionCode',
                '@_type': 'RegionCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EventTypeCode',
                '@_type': 'WithholdingTaxEventTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'TaxTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RateTypeCode',
                '@_type': 'TaxRateTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CurrencyCode',
                '@_type': 'CurrencyCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BaseAmount',
                '@_type': 'Amount',
              },
              {
                '@_name': 'Percent',
                '@_type': 'Percent',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Amount',
                '@_type': 'Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ExcludedAmount',
                '@_type': 'Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BusinessTransactionDocumentItemGroupID',
                '@_type': 'BusinessTransactionDocumentItemGroupID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'StatisticRelevanceIndicator',
                '@_type': 'Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PlannedIndicator',
                '@_type': 'Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ExchangeRate',
                '@_type': 'ExchangeRate',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'IncomeTypeCode',
                '@_type': 'WithholdingTaxIncomeTypeCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'WithholdingTaxEventTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'WithholdingTaxEventTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'WithholdingTaxIncomeTypeCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'WithholdingTaxIncomeTypeCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'WithholdingTaxationCharacteristicsCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'WithholdingTaxationCharacteristicsCode.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  '@_use': 'required',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
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
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/Common/GDT',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      'xsd:import': [
        {
          '@_namespace': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/FO/FundManagement/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/Common/DataTypes',
        },
        {
          '@_namespace': 'http://sap.com/xi/BASIS/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/Common/GDT',
        },
      ],
      'xsd:complexType': [
        {
          '@_name': 'AccountingObjectCheckItemCostObjectReference',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'CostObjectTypeCode',
                '@_type': 'xi20:CostObjectTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CostObjectID',
                '@_type': 'xi20:FinancialAccountingViewOfCostObjectID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CostObjectUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CostObjectDescription',
                '@_type': 'xi20:MEDIUM_Description',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'CodingBlockCustomField1Code',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'CodingBlockCustomField1Code.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'CodingBlockCustomField2Code',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'CodingBlockCustomField2Code.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'CodingBlockCustomField3Code',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'CodingBlockCustomField3Code.Content',
              'xsd:attribute': [
                {
                  '@_name': 'listID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listVersionID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '15',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'listAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'CustomObjectID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'CustomObjectID.Content',
              'xsd:attribute': [
                {
                  '@_name': 'schemeID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
                {
                  '@_name': 'schemeAgencyID',
                  'xsd:simpleType': {
                    'xsd:restriction': {
                      '@_base': 'xsd:token',
                      'xsd:maxLength': {
                        '@_value': '60',
                      },
                      'xsd:minLength': {
                        '@_value': '1',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          '@_name': 'MaintenanceAccountingCodingBlockDistribution',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ValidityDate',
                '@_type': 'xi20:Date',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CompanyID',
                '@_type': 'xi20:OrganisationalCentreID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'IdentityID',
                '@_type': 'xi20:IdentityID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LanguageCode',
                '@_type': 'xi22:LanguageCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TemplateIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GeneralLedgerAccountAliasCode',
                '@_type': 'xi20:GeneralLedgerAccountAliasCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GeneralLedgerAccountAliasContextCodeElements',
                '@_type': 'xi20:GeneralLedgerAccountAliasCodeContextElements',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GeneralLedgerAccountAliasContextCodeElementsUsageName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'HostObjectTypeCode',
                '@_type': 'xi20:ObjectTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalAmount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TotalQuantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AccountingCodingBlockAssignment',
                '@_type': 'MaintenanceAccountingCodingBlockDistributionAccountingCodingBlockAssignment',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
          'xsd:attribute': [
            {
              '@_name': 'AccountingCodingBlockAssignmentListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
            {
              '@_name': 'ActionCode',
              '@_type': 'xi20:ActionCode',
            },
          ],
        },
        {
          '@_name': 'MaintenanceAccountingCodingBlockDistributionAccountingCodingBlockAssignment',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'CustomerContractItemDescription',
                '@_type': 'xi20:SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CustomerContractName',
                '@_type': 'xi20:EXTENDED_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CustomerContractReference',
                '@_type': 'xi20:BusinessTransactionDocumentReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TechnicalID',
                '@_type': 'xi20:ObjectNodeTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Percent',
                '@_type': 'xi20:Percent',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Amount',
                '@_type': 'xi20:Amount',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Quantity',
                '@_type': 'xi20:Quantity',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AccountingCodingBlockTypeCode',
                '@_type': 'xi20:AccountingCodingBlockTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AccountDeterminationExpenseGroupCode',
                '@_type': 'xi20:AccountDeterminationExpenseGroupCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GeneralLedgerAccountAliasCode',
                '@_type': 'xi20:GeneralLedgerAccountAliasCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProfitCentreID',
                '@_type': 'xi20:OrganisationalCentreID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProfitCentreUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CostCentreID',
                '@_type': 'xi20:OrganisationalCentreID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CostCentreUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'IndividualMaterialKey',
                '@_type': 'MaintenanceAccountingCodingBlockDistributionAccountingCodingBlockAssignmentIndividualMaterialKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'IndividualMaterialUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectTaskKey',
                '@_type': 'MaintenanceAccountingCodingBlockDistributionAccountingCodingBlockAssignmentProjectTaskKey',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectReference',
                '@_type': 'xi20:ProjectReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProjectReferenceProjectElementTypeName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SalesOrderReference',
                '@_type': 'xi20:BusinessTransactionDocumentReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SalesOrderReferenceTypeName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SalesOrderReferenceItemTypeName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SalesOrderName',
                '@_type': 'xi20:EXTENDED_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'SalesOrderItemDescription',
                '@_type': 'xi20:SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServiceOrderReference',
                '@_type': 'xi20:BusinessTransactionDocumentReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServiceOrderReferenceTypeName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServiceOrderReferenceItemTypeName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServiceOrderName',
                '@_type': 'xi20:EXTENDED_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ServiceOrderItemDescription',
                '@_type': 'xi20:SHORT_Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EmployeeID',
                '@_type': 'xi20:EmployeeID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EmployeeUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CompanyID',
                '@_type': 'xi20:OrganisationalCentreID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CompanyUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FinancialFunctionUUID',
                '@_type': 'xi38:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FinancialFundUUID',
                '@_type': 'xi38:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FinancialFunctionID',
                '@_type': 'xi28:FunctionID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'FinancialFundID',
                '@_type': 'xi28:FundID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CustomCode1',
                '@_type': 'CodingBlockCustomField1Code',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CustomCode2',
                '@_type': 'CodingBlockCustomField2Code',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CustomCode3',
                '@_type': 'CodingBlockCustomField3Code',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CustomObject1UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CustomObject1ID',
                '@_type': 'CustomObjectID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CustomText1',
                '@_type': 'CodingBlockCustomText',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CostObjectReference',
                '@_type': 'AccountingObjectCheckItemCostObjectReference',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GrantID',
                '@_type': 'xi30:GrantID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'GrantUUID',
                '@_type': 'xi38:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LeaseContractReference',
                '@_type': 'xi20:BusinessTransactionDocumentReference',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'MaintenanceAccountingCodingBlockDistributionAccountingCodingBlockAssignmentIndividualMaterialKey',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ProductTypeCode',
                '@_type': 'xi20:ProductTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductIdentifierTypeCode',
                '@_type': 'xi20:ProductIdentifierTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ProductID',
                '@_type': 'xi20:ProductID',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'MaintenanceAccountingCodingBlockDistributionAccountingCodingBlockAssignmentProjectTaskKey',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'TaskID',
              '@_type': 'xi20:ProjectElementID',
              '@_minOccurs': '0',
            },
          },
        },
      ],
      'xsd:simpleType': [
        {
          '@_name': 'CodingBlockCustomField1Code.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CodingBlockCustomField2Code.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CodingBlockCustomField3Code.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '5',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CodingBlockCustomText',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Text',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:string',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CustomObjectID.Content',
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '40',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/IS/CodingBlock/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/BASIS/Global',
      'xsd:simpleType': [
        {
          '@_name': 'AgencyIdentificationCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '5',
              },
              {
                '@_value': '6',
              },
              {
                '@_value': '16',
              },
              {
                '@_value': '17',
              },
              {
                '@_value': '84',
              },
              {
                '@_value': '107',
              },
              {
                '@_value': '109',
              },
              {
                '@_value': '112',
              },
              {
                '@_value': '113',
              },
              {
                '@_value': '114',
              },
              {
                '@_value': '116',
              },
              {
                '@_value': '117',
              },
              {
                '@_value': '124',
              },
              {
                '@_value': '130',
              },
              {
                '@_value': '131',
              },
              {
                '@_value': '138',
              },
              {
                '@_value': '142',
              },
              {
                '@_value': '146',
              },
              {
                '@_value': '262',
              },
              {
                '@_value': '296',
              },
              {
                '@_value': '310',
              },
            ],
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CharacterSetCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'CurrencyCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '3',
            },
            'xsd:minLength': {
              '@_value': '3',
            },
          },
        },
        {
          '@_name': 'Date',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Date',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:date',
            'xsd:pattern': {
              '@_value': '[0-9]{4}-[0-9]{2}-[0-9]{2}',
            },
          },
        },
        {
          '@_name': 'GLOBAL_DateTime',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'DateTime',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:dateTime',
            'xsd:pattern': {
              '@_value': '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]{1,7})?Z',
            },
          },
        },
        {
          '@_name': 'LOCALNORMALISED_DateTime.Content',
          'xsd:restriction': {
            '@_base': 'xsd:dateTime',
            'xsd:pattern': {
              '@_value': '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]{1,7})?Z',
            },
          },
        },
        {
          '@_name': 'LanguageCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:language',
            'xsd:maxLength': {
              '@_value': '2',
            },
            'xsd:minLength': {
              '@_value': '2',
            },
          },
        },
        {
          '@_name': 'MIMECode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'TimeZoneCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
      ],
      'xsd:complexType': [
        {
          '@_name': 'BinaryObject',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'BinaryObject',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'xsd:base64Binary',
              'xsd:attribute': [
                {
                  '@_name': 'mimeCode',
                  '@_type': 'MIMECode',
                },
                {
                  '@_name': 'characterSetCode',
                  '@_type': 'CharacterSetCode',
                },
                {
                  '@_name': 'format',
                  '@_type': 'xsd:token',
                },
                {
                  '@_name': 'fileName',
                  '@_type': 'xsd:string',
                },
                {
                  '@_name': 'uri',
                  '@_type': 'xsd:anyURI',
                },
              ],
            },
          },
        },
        {
          '@_name': 'LOCALNORMALISED_DateTime',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'DateTime',
            },
          },
          'xsd:simpleContent': {
            'xsd:extension': {
              '@_base': 'LOCALNORMALISED_DateTime.Content',
              'xsd:attribute': {
                '@_name': 'timeZoneCode',
                '@_use': 'required',
                '@_type': 'TimeZoneCode',
              },
            },
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/BASIS/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/DocumentServices/Global',
      'xsd:import': [
        {
          '@_namespace': 'http://sap.com/xi/BASIS/Global',
        },
        {
          '@_namespace': 'http://sap.com/xi/AP/Common/GDT',
        },
      ],
      'xsd:complexType': [
        {
          '@_name': 'MaintenanceAttachmentFolder',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Document',
                '@_type': 'MaintenanceAttachmentFolderDocument',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
          'xsd:attribute': [
            {
              '@_name': 'DocumentListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
            {
              '@_name': 'ActionCode',
              '@_type': 'xi20:ActionCode',
            },
          ],
        },
        {
          '@_name': 'MaintenanceAttachmentFolderDocument',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LinkInternalIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'VisibleIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CategoryCode',
                '@_type': 'xi20:DocumentCategoryCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'xi20:DocumentTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MIMECode',
                '@_type': 'xi20:MIMECode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Name',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'AlternativeName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'InternalLinkUUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Description',
                '@_type': 'xi20:Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ExternalLinkWebURI',
                '@_type': 'xi20:WebURI',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Property',
                '@_type': 'MaintenanceAttachmentFolderDocumentProperty',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
              {
                '@_name': 'FileContent',
                '@_type': 'MaintenanceAttachmentFolderDocumentFileContent',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': [
            {
              '@_name': 'PropertyListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
            {
              '@_name': 'ActionCode',
              '@_type': 'xi20:ActionCode',
            },
          ],
        },
        {
          '@_name': 'MaintenanceAttachmentFolderDocumentFileContent',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'TechnicalID',
                '@_type': 'xi20:ObjectNodeTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'BinaryObject',
                '@_type': 'xi22:BinaryObject',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'MaintenanceAttachmentFolderDocumentProperty',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'TechnicalID',
                '@_type': 'xi20:ObjectNodeTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Name',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DataTypeFormatCode',
                '@_type': 'xi20:PropertyDataTypeFormatCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'VisibleIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'ChangeAllowedIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'MultipleValueIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'NamespaceURI',
                '@_type': 'xi20:NamespaceURI',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Description',
                '@_type': 'xi20:Description',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PropertyValue',
                '@_type': 'MaintenanceAttachmentFolderDocumentPropertyPropertyValue',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
          'xsd:attribute': [
            {
              '@_name': 'PropertyValueListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
            {
              '@_name': 'ActionCode',
              '@_type': 'xi20:ActionCode',
            },
          ],
        },
        {
          '@_name': 'MaintenanceAttachmentFolderDocumentPropertyPropertyValue',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'TechnicalID',
                '@_type': 'xi20:ObjectNodeTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Text',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_Text',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Indicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DateTime',
                '@_type': 'xi22:GLOBAL_DateTime',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'IntegerValue',
                '@_type': 'xi20:IntegerValue',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'MaintenanceTextCollection',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'UUID',
                '@_type': 'xi20:UUID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Text',
                '@_type': 'MaintenanceTextCollectionText',
                '@_minOccurs': '0',
                '@_maxOccurs': 'unbounded',
              },
            ],
          },
          'xsd:attribute': [
            {
              '@_name': 'TextListCompleteTransmissionIndicator',
              '@_type': 'xi20:Indicator',
            },
            {
              '@_name': 'ActionCode',
              '@_type': 'xi20:ActionCode',
            },
          ],
        },
        {
          '@_name': 'MaintenanceTextCollectionText',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'TechnicalID',
                '@_type': 'xi20:ObjectNodeTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TypeCode',
                '@_type': 'xi20:TextCollectionTextTypeCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'LanguageCode',
                '@_type': 'xi22:LanguageCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CreationDateTime',
                '@_type': 'xi22:GLOBAL_DateTime',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'TextContent',
                '@_type': 'MaintenanceTextCollectionTextTextContent',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
        {
          '@_name': 'MaintenanceTextCollectionTextTextContent',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'TechnicalID',
                '@_type': 'xi20:ObjectNodeTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Text',
                '@_type': 'xi20:Text',
                '@_minOccurs': '0',
              },
            ],
          },
          'xsd:attribute': {
            '@_name': 'ActionCode',
            '@_type': 'xi20:ActionCode',
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/DocumentServices/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      'xsd:simpleType': [
        {
          '@_name': 'PlannedLandedCostProfileCalculationMethodCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
            ],
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PlannedLandedCostProfileChargesBasedOn',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
            ],
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'PlannedLandedCostProfilePriceComponentCode',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Code',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:enumeration': [
              {
                '@_value': '1',
              },
              {
                '@_value': '2',
              },
              {
                '@_value': '3',
              },
              {
                '@_value': '4',
              },
              {
                '@_value': '5',
              },
              {
                '@_value': '6',
              },
              {
                '@_value': '7',
              },
              {
                '@_value': '8',
              },
            ],
            'xsd:maxLength': {
              '@_value': '10',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/FO/PlannedLandedCost',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      'xsd:simpleType': [
        {
          '@_name': 'FunctionID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '35',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
        {
          '@_name': 'FundID',
          'xsd:annotation': {
            'xsd:documentation': {
              '@_xml:lang': 'EN',
              'ccts:RepresentationTerm': 'Identifier',
            },
          },
          'xsd:restriction': {
            '@_base': 'xsd:token',
            'xsd:maxLength': {
              '@_value': '35',
            },
            'xsd:minLength': {
              '@_value': '1',
            },
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/FO/FundManagement/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/A1S',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/A1S',
      'xsd:simpleType': {
        '@_name': 'General_StringForExcelUpload',
        'xsd:annotation': {
          'xsd:documentation': {
            '@_xml:lang': 'EN',
            'ccts:RepresentationTerm': 'Text',
          },
        },
        'xsd:restriction': {
          '@_base': 'xsd:string',
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/A1S',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      'xsd:simpleType': {
        '@_name': 'GrantID',
        'xsd:annotation': {
          'xsd:documentation': {
            '@_xml:lang': 'EN',
            'ccts:RepresentationTerm': 'Identifier',
          },
        },
        'xsd:restriction': {
          '@_base': 'xsd:token',
          'xsd:maxLength': {
            '@_value': '35',
          },
          'xsd:minLength': {
            '@_value': '1',
          },
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/FO/GrantManagement/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/XU/SRM/Global',
      'xsd:import': {
        '@_namespace': 'http://sap.com/xi/AP/Common/GDT',
      },
      'xsd:complexType': [
        {
          '@_name': 'ProcurementDocumentItemFollowUpDelivery',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'RequirementCode',
                '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EmployeeTimeConfirmationRequiredIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'ProcurementDocumentItemFollowUpDeliveryForExcelUpload',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'RequirementCode',
                '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EmployeeTimeConfirmationRequiredIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'ProcurementDocumentItemFollowUpInvoice',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'BusinessTransactionDocumentSettlementRelevanceIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RequirementCode',
                '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EvaluatedReceiptSettlementIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryBasedInvoiceVerificationIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'ProcurementDocumentItemFollowUpInvoiceForExcelUpload',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'BusinessTransactionDocumentSettlementRelevanceIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'RequirementCode',
                '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'EvaluatedReceiptSettlementIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryBasedInvoiceVerificationIndicator',
                '@_type': 'xi20:Indicator',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'ProcurementDocumentItemFollowUpPurchaseOrderConfirmation',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'RequirementCode',
              '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
              '@_minOccurs': '0',
            },
          },
        },
        {
          '@_name': 'ProcurementDocumentItemFollowUpPurchaseOrderConfirmationForExcelUpload',
          'xsd:sequence': {
            'xsd:element': {
              '@_name': 'RequirementCode',
              '@_type': 'xi20:FollowUpBusinessTransactionDocumentRequirementCode',
              '@_minOccurs': '0',
            },
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/XU/SRM/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/CRM/Global',
      'xsd:import': {
        '@_namespace': 'http://sap.com/xi/AP/Common/GDT',
      },
      'xsd:complexType': [
        {
          '@_name': 'PurchaseOrderByIDResponseDeliveryTerms',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'TechnicalID',
                '@_type': 'xi20:ObjectNodeTechnicalID',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryPriorityCode',
                '@_type': 'xi20:PriorityCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryPriorityName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'Incoterms',
                '@_type': 'xi20:Incoterms',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'IncotermsClassificationName',
                '@_type': 'xi20:LANGUAGEINDEPENDENT_LONG_Name',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseItemStatus',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'PurchaseOrderItemLifeCycleStatusCode',
                '@_type': 'xi20:PurchaseOrderLifeCycleStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderItemApprovalStatusCode',
                '@_type': 'xi20:ApprovalStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'CancellationStatusCode',
                '@_type': 'xi20:CancellationStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryProcessingStatusCode',
                '@_type': 'xi20:ProcessingStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'InvoiceProcessingStatusCode',
                '@_type': 'xi20:ProcessingStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'InvoicingStatusCode',
                '@_type': 'xi20:InvoicingStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'OrderingStatusCode',
                '@_type': 'xi20:OrderingStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderConfirmationStatusCode',
                '@_type': 'xi20:PurchaseOrderConfirmationStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderDeliveryStatusCode',
                '@_type': 'xi20:PurchaseOrderDeliveryStatusCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
        {
          '@_name': 'PurchaseOrderByIDResponseStatus',
          'xsd:sequence': {
            'xsd:element': [
              {
                '@_name': 'ApprovalStatusCode',
                '@_type': 'xi20:ApprovalStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'DeliveryProcessingStatusCode',
                '@_type': 'xi20:ProcessingStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'InvoiceProcessingStatusCode',
                '@_type': 'xi20:ProcessingStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'InvoicingStatusCode',
                '@_type': 'xi20:InvoicingStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'OrderDeliveryStatusCode',
                '@_type': 'xi20:DeliveryStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderConfirmationStatusCode',
                '@_type': 'xi20:PurchaseOrderConfirmationStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderDeliveryStatusCode',
                '@_type': 'xi20:PurchaseOrderDeliveryStatusCode',
                '@_minOccurs': '0',
              },
              {
                '@_name': 'PurchaseOrderLifeCycleStatusCode',
                '@_type': 'xi20:PurchaseOrderLifeCycleStatusCode',
                '@_minOccurs': '0',
              },
            ],
          },
        },
      ],
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/CRM/Global',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/AP/PDI/bo',
      'xsd:simpleType': {
        '@_name': 'String',
        'xsd:annotation': {
          'xsd:documentation': {
            '@_xml:lang': 'EN',
            'ccts:RepresentationTerm': 'Text',
          },
        },
        'xsd:restriction': {
          '@_base': 'xsd:string',
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/AP/PDI/bo',
  },
  {
    foundSchemaTag: {
      '@_targetNamespace': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns:ccts': 'urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:3.0',
      '@_xmlns:xi15': 'http://sap.com/xi/A1S/Global',
      '@_xmlns:xi16': 'http://sap.com/xi/AP/Globalization',
      '@_xmlns:xi17': 'http://sap.com/xi/SAPGlobal20/Global',
      '@_xmlns:xi18': 'http://sap.com/xi/AP/Common/Global',
      '@_xmlns:xi19': 'http://sap.com/xi/AP/FO/CashDiscountTerms/Global',
      '@_xmlns:xi20': 'http://sap.com/xi/AP/Common/GDT',
      '@_xmlns:xi21': 'http://sap.com/xi/AP/IS/CodingBlock/Global',
      '@_xmlns:xi22': 'http://sap.com/xi/BASIS/Global',
      '@_xmlns:xi23': 'http://sap.com/xi/DocumentServices/Global',
      '@_xmlns:xi26': 'http://sap.com/xi/AP/FO/PlannedLandedCost',
      '@_xmlns:xi28': 'http://sap.com/xi/AP/FO/FundManagement/Global',
      '@_xmlns:xi29': 'http://sap.com/xi/A1S',
      '@_xmlns:xi30': 'http://sap.com/xi/AP/FO/GrantManagement/Global',
      '@_xmlns:xi32': 'http://sap.com/xi/AP/XU/SRM/Global',
      '@_xmlns:xi36': 'http://sap.com/xi/AP/CRM/Global',
      '@_xmlns:xi37': 'http://sap.com/xi/AP/PDI/bo',
      '@_xmlns:xi38': 'http://sap.com/xi/Common/DataTypes',
      '@_xmlns': 'http://sap.com/xi/Common/DataTypes',
      'xsd:simpleType': {
        '@_name': 'UUID',
        'xsd:annotation': {
          'xsd:documentation': {
            '@_xml:lang': 'EN',
            'ccts:RepresentationTerm': 'Identifier',
          },
        },
        'xsd:restriction': {
          '@_base': 'xsd:token',
          'xsd:maxLength': {
            '@_value': '36',
          },
          'xsd:pattern': {
            '@_value': '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
          },
        },
      },
    },
    foundLocalSchemaNamespace: {
      key: 'xsd',
      url: 'http://www.w3.org/2001/XMLSchema',
      prefixFilter: 'xsd:',
      isDefault: false,
      tnsDefinitionURL: 'http://sap.com/xi/A1S/Global',
    },
    targetNamespace: 'http://sap.com/xi/Common/DataTypes',
  }
];
