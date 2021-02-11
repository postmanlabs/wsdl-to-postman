'use strict';

const {
  SchemaPack
} = require('./lib/SchemaPack.js');

module.exports = {
  convert: function(input, options, cb) {
    const converter = new SchemaPack(input, options);
    let validationResults = converter.validate();
    if (validationResults.result) {
      return converter.convert(cb);
    }
    return cb(null, validationResult);
  },

  validate: function(input) {
    const converter = new Converter(input);
    return converter.validate();
  },

  getMetaData: function(input, cb) {
    const converter = new Converter(input);
    converter.getMetaData(cb);
  },

  mergeAndValidate: function(input, cb) {
    const converter = new Converter(input);
    converter.mergeAndValidate(cb);
  },


  Converter
};
