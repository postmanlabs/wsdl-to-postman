/* eslint-disable no-restricted-modules */
const UserError = require('../UserError'),
  fs = require('fs');

var path = require('path'),
  pathBrowserify = require('path-browserify');

/** Reads the inputs from a folder and returns a mapped files object
 * @param {inputObject} input input object of type {type: <folder>, data: <Array>, origin, <string>}
 * @returns {object} Files with propety as the filename and value file content
 */
function readFromFolderStringInput(input) {
  let files;
  if (input.origin === 'browser') {
    path = pathBrowserify;
  }
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
 * @description Takes an input object {data: <string>, type: <string>} and returns
 * the processed information according to the nput
 *
 * @param {*} input {data: <string>, type: <string>}
 * @returns {object} file/string content and input data
 */
function readInput(input) {
  let xml;
  if (!input.data) {
    throw new UserError('Input.data not provided');
  }
  else if (input.type === 'file') {
    try {
      xml = fs.readFileSync(input.data, 'utf-8');
    }
    catch (error) {
      throw new UserError(`File ${input.data.split('/').reverse()[0]} not found`);
    }
  }
  else if (input.type === 'string') {
    xml = input.data;
  }
  else if (input.type === 'folder') {
    xml = readFromFolderStringInput(input);
  }
  else {
    throw new UserError(`Invalid input type (${input.type}). Type must be file/string/folder.`);
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
  else if (input.type === 'folder') {
    name = '';
  }
  else {
    return {
      result: false,
      reason: `Invalid input type (${input.type}). Type must be file/string/folder.`
    };
  }
  return name;
}

module.exports = {
  readInput,
  getCollectionNameFromFileOrEmpty
};
