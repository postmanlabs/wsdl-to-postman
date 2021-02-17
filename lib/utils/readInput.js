const InputError = require('../inputError'),
  fs = require('fs');

/**
 *
 * @description Takes in a string and returns a constant verb
 *
 * @param {*} input input
 * @returns {string} file content
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
  else {
    throw new InputError(`Invalid input type (${input.type}). Type must be file/string.`);
  }
  return xml;
}

module.exports = {
  readInput
};