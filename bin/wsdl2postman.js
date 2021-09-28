#!/usr/bin/env node
/* eslint-disable no-restricted-modules */
var program = require('commander'),
  Converter = require('../index.js'),
  fs = require('fs'),
  path = require('path'),
  availableOptions = require('../lib/utils/options').getOptions('use', { usage: ['CONVERSION'] }),
  inputFile,
  outputFile,
  prettyPrintFlag,
  configFile,
  definedOptions,
  testFlag,
  wsdlData;

/**
 * Parses comma separated options mentioned in command args and generates JSON object
 *
 * @param {String} value - User defined options value
 * @returns {Object} - Parsed option in format of JSON object
 */
function parseOptions(value) {
  let definedOptions = value.split(','),
    parsedOptions = {};

  definedOptions.forEach((definedOption) => {
    let option = definedOption.split('=');

    if (option.length === 2 && Object.keys(availableOptions).includes(option[0])) {
      try {
        // parse parsable data types (e.g. boolean, integer etc)
        parsedOptions[option[0]] = JSON.parse(option[1]);
      }
      catch (e) {
        // treat value as string if can not be parsed
        parsedOptions[option[0]] = option[1];
      }
    }
    else {
      console.warn('\x1b[33m%s\x1b[0m', 'Warning: Invalid option supplied ', option[0]);
    }
  });

  return parsedOptions;
}

program
  .version(require('../package.json').version, '-v, --version')
  .option('-s, --spec <spec>', 'Convert given WSDL 1.1 or 2.0 spec to Postman Collection v2.0')
  .option('-o, --output <output>', 'Write the collection to an output file')
  .option('-t, --test', 'Test the WSDL converter')
  .option('-p, --pretty', 'Pretty print the JSON file')
  .option('-c, --options-config <optionsConfig>', 'JSON file containing Converter options')
  .option('-O, --options <options>', 'comma separated list of options', parseOptions);

program.on('--help', function () {
  /* eslint-disable */
  console.log('    Converts a given WSDL specification to POSTMAN Collections v2.1.0   ');
  console.log(' ');
  console.log('    Examples:');
  console.log(' 		Read spec.wsdl and store the output in output.json after conversion     ');
  console.log('	           ./wsdl2postman -s spec.wsdl -o output.json ');
  console.log(' ');
  console.log('	        Read spec.wsdl and print the output to the Console        ');
  console.log('                   ./wsdl2postman -s spec.wsdl ');
  console.log(' ');
  console.log('                Read spec.wsdl and print the prettified output to the Console');
  console.log('                  ./wsdl2postman -s spec.wsdl -p');
  console.log(' ');
  /* eslint-enable */
});

program.parse(process.argv);
const options = program.opts();
inputFile = options.spec;
outputFile = options.output || false;
testFlag = options.test || false;
prettyPrintFlag = options.pretty || false;
configFile = options.optionsConfig || false;
definedOptions = (!(options.options instanceof Array) ? options.options : {});
wsdlData;


/**
 * Helper function for the CLI to perform file writes based on the flags
 * @param {Boolean} prettyPrintFlag - flag for pretty printing while writing the file
 * @param {String} file - Destination file to which the write is to be performed
 * @param {Object} collection - POSTMAN collection object
 * @returns {void}
 */
function writeToFile(prettyPrintFlag, file, collection) {
  if (prettyPrintFlag) {
    fs.writeFile(file, JSON.stringify(collection, null, 4), (err) => {
      if (err) { console.log('Could not write to file', err); } // eslint-disable-line no-console
      // eslint-disable-next-line no-console
      console.log('\x1b[32m%s\x1b[0m', 'Conversion successful, collection written to file');
    });
  }
  else {
    fs.writeFile(file, JSON.stringify(collection), (err) => {
      if (err) { console.log('Could not write to file', err); } // eslint-disable-line no-console
      // eslint-disable-next-line no-console
      console.log('\x1b[32m%s\x1b[0m', 'Conversion successful, collection written to file');
    });
  }
}

/**
 * Helper function for the CLI to convert swagger data input
 * @param {String} wsdlData - swagger data used for conversion input
 * @returns {void}
 */
function convert(wsdlData) {
  let options = {};

  // apply options from config file if present
  if (configFile) {
    configFile = path.resolve(configFile);
    console.log('Options Config file: ', configFile); // eslint-disable-line no-console
    options = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }

  // override options provided via cli
  if (definedOptions && Object.keys(definedOptions).length > 0) {
    options = definedOptions;
  }

  Converter.convert({
    type: 'string',
    data: wsdlData
  }, options, (err, status) => {
    if (err) {
      return console.error(err);
    }
    if (!status.result) {
      console.log(status.reason); // eslint-disable-line no-console
      process.exit(0);
    }
    else if (outputFile) {
      let file = path.resolve(outputFile);
      console.log('Writing to file: ', prettyPrintFlag, file, status); // eslint-disable-line no-console
      writeToFile(prettyPrintFlag, file, status.output[0].data);
    }
    else {
      console.log(status.output[0].data); // eslint-disable-line no-console
      process.exit(0);
    }
  });
}

if (testFlag) {
  wsdlData = fs.readFileSync(path.resolve(__dirname, '..', 'test/data/validWSDLs11',
    'calculator-soap11and12.wsdl'), 'utf8');
  console.log('testing conversion...'); // eslint-disable-line no-console
  convert(wsdlData);
}
else if (inputFile) {
  inputFile = path.resolve(inputFile);
  console.log('Input file: ', inputFile); // eslint-disable-line no-console
  wsdlData = fs.readFileSync(inputFile, 'utf8');
  convert(wsdlData);
}
else {
  program.emit('--help');
  process.exit(0);
}
