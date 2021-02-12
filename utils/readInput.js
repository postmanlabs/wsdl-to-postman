const InputError = require('../lib/inputError'),
    fs = require('fs');

function readInput(input) {
  let xml;
  if (!input.data) {
    throw new InputError('input.data not provided');
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
}
