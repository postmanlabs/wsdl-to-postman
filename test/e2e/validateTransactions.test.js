var expect = require('chai').expect,
    {
        SchemaPack
    } = require('../../lib/SchemaPack'),
    fs = require('fs'),
    path = require('path'),
    VALID_WSDL_PATH = 'test/data/validWSDLs11/numberConvertion.wsdl',
    numberToWordsCollectionItems = require('./../data/transactionsValidation/numberToWordsCollectionItems.json'),
    numberToWordsWSDLObject = require('./../data/transactionsValidation/wsdlObjects/numberToWords'),
    options = {};

describe('Test validate Transactions method in SchemaPack', function() {
    it('Should compare the PM Collection generated against the WSDL Object', function() {
        const schemaPack = new SchemaPack({
            type: 'file', data: VALID_WSDL_PATH
        }, options);
        // let schemaPack = new Converter.SchemaPack({ type: 'file', data: VALID_WSDL_PATH }, options);
        schemaPack.validateTransactions(numberToWordsCollectionItems, schemaPack.wsdlObject);
        console.log(schemaPack.validationResult);
    });
});
