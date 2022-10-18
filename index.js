'use strict';

const {
    SchemaPack
  } = require('./lib/SchemaPack.js'),
  _ = require('lodash');

module.exports = {
  convert: function (input, options, cb) {
    const schema = new SchemaPack(input, options);
    if (schema.validationResult.result) {
      return schema.convert(cb);
    }
    return cb(null, schema.validationResult);
  },

  validate: function (input) {
    const schema = new SchemaPack(input);
    return schema.validationResult;
  },

  getMetaData: function (input, cb) {
    const schema = new SchemaPack(input);
    schema.getMetaData(cb);
  },

  mergeAndValidate: function (input, cb) {
    const schema = new SchemaPack(input);
    schema.mergeAndValidate(cb);
  },

  getOptions: function (mode, criteria) {
    return SchemaPack.getOptions(mode, criteria);
  },

  detectRootFiles: async function (input) {
    const schema = new SchemaPack(input);
    return schema.detectRootFiles(input);
  },

  detectRelatedFiles: async function(input) {
    const schema = new SchemaPack(input);
    return schema.detectRelatedFiles();
  },

  bundle: async function(input) {
    const schema = new SchemaPack(input, _.has(input, 'options') ? input.options : {});
    return schema.bundle(input);
  },

  SchemaPack
};
