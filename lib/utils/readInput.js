/* eslint-disable no-restricted-modules */
const InputError = require('../InputError'),
  fs = (process && typeof process.platform === 'string') ? require('fs') : require('browserify-fs'),
  path = require('path-browserify');


/** Reads the inputs from a folder and returns a mapped files object
 * @param {inputObject} input input object of type {type: <folder>, data: <Array>}
 * @returns {object} Files with propety as the filename and value file content
 */
function readFromFolderStringInput(input) {
  let files;
  if ('content' in input.data[0]) {
    files = {};
    input.data.forEach((file) => {
      files[path.resolve(file.fileName)] = file.content ? file.content : '';
    });
  }
  return { inputData: input.data, files };
}

/**
 *
 * @description Takes in an input object {data: <string>, type: <string>} and returns a string
 *
 * @param {*} input {data: <string>, type: <string>}
 * @returns {string} file/string content
 */
function readInput(input) {
  let xml;
  if (!input.data) {
    throw new InputError('Input.data not provided');
  }
  else if (input.type === 'file') {
    try {
      xml = fs.readFileSync(input.data, 'utf-8');
    }
    catch (error) {
      throw new InputError(`File ${input.data.split('/').reverse()[0]} not found`);
    }
  }
  else if (input.type === 'string') {
    xml = input.data;
  }
  else if (input.type === 'folder') {
    xml = readFromFolderStringInput(input);
  }
  else {
    throw new InputError(`Invalid input type (${input.type}). Type must be file/string.`);
  }
  return xml;
}


/** Method to help defining where the name will be extracted
 * Return the file name if input is file type, else return an empty string
 * @param {inputObject} input input object of type {type: <string>, data: <string>}
 * @returns {string} Return the file name if input is file type, else return an empty string
 */
function getCollectionNameFromFileOrEmpty(input) {
  let name;
  if (input.type === 'file') {
    if (!input.data) {
      return {
        result: false,
        reason: 'Input not provided'
      };
    }
    name = input.data.split('/').reverse()[0];
  }
  else if (input.type === 'string') {
    name = '';
  }
  else {
    return {
      result: false,
      reason: `Invalid input type (${input.type}). Type must be file/string.`
    };
  }
  return name;
}

module.exports = {
  readInput,
  getCollectionNameFromFileOrEmpty
};
