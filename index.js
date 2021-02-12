'use strict';

const {
  SchemaPack
} = require('./lib/SchemaPack.js');

module.exports = {
  convert: function(input, options, cb) {
    const schema = new SchemaPack(input, options);
    let validationResults = schema.validate();
    if (validationResults.result) {
      return schema.convert(cb);
    }
    return cb(null, validationResult);
  },

  validate: function(input) {
    const schema = new SchemaPack(input);
    return schema.validate();
  },

  getMetaData: function(input, cb) {
    const schema = new SchemaPack(input);
    schema.getMetaData(cb);
  },

  mergeAndValidate: function(input, cb) {
    const schema = new SchemaPack(input);
    schema.mergeAndValidate(cb);
  },
  
  getOptions: function(mode, criteria) {
    return {}
  },
  
  SchemaPack
};
