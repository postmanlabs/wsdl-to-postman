// default options
// if mode=document, returns an array of name/id/default etc.

/**
 * name - human-readable name for the option
 * id - key to pass the option with
 * type - boolean or enum for now
 * default - the value that's assumed if not specified
 * availableOptions - allowed values (only for type=enum)
 * description - human-readable description of the item
 * external - whether the option is settable via the API
 * usage - array of supported types of usage (i.e. CONVERSION, VALIDATION)
 *
 * @param {string} [mode='document'] Describes use-case. 'document' will return an array
 * with all options being described. 'use' will return the default values of all options
 * @param {Object} criteria Decribes required criteria for options to be returned. can have properties
 *   external: <boolean>
 *   usage: <array> (Array of supported usage type - CONVERSION, o)
 * @returns {mixed} An array or object (depending on mode) that describes available options
 */
function getOptions(mode = 'document', criteria = {}) {
  // Override mode & criteria if first arg is criteria (objects)
  if (typeof mode === 'object') {
    criteria = mode;
    mode = 'document';
  }

  let optsArray = [
    {
      name: 'Folder organization',
      id: 'folderStrategy',
      type: 'enum',
      default: 'Port/Endpoint',
      availableOptions: ['No folders', 'Port/Endpoint', 'Service'],
      description: 'Select whether to create folders according to the WSDL port/endpoing service or without folders',
      external: true,
      usage: ['CONVERSION']
    },
    {
      name: 'Header validation',
      id: 'validateHeader',
      type: 'boolean',
      default: false,
      description: 'Select true to validate your collection requests/responses headers are correctly set',
      external: true,
      usage: ['VALIDATION']
    },
    {
      name: 'Properties to ignore during validation',
      id: 'validationPropertiesToIgnore',
      type: 'array',
      default: [],
      description:
        'Specific properties (parts of a request/response pair) to ignore during validation.' +
        ' Must be sent as an array of strings. Valid inputs in the array: ' +
        ' BODY, RESPONSE_BODY, SOAP_METHOD',
      external: true,
      usage: ['VALIDATION']
    },
    {
      name: 'Ignore mismatch for unresolved postman variables',
      id: 'ignoreUnresolvedVariables',
      type: 'boolean',
      default: false,
      description:
        'Whether to ignore mismatches resulting from unresolved variables in the Postman request',
      external: true,
      usage: ['VALIDATION']
    },
    {
      name: 'Add details in the reported mismatches',
      id: 'detailedBlobValidation',
      type: 'boolean',
      default: false,
      description: 'If it is true, all the mismatches will contain detailed info about the error generated' +
        ' if false, the mismatch will return a general description for the error',
      external: true,
      usage: ['VALIDATION']
    },
    {
      name: 'Show missing in schema errors',
      id: 'showMissingInSchemaErrors',
      type: 'boolean',
      default: true,
      description: 'If true (as default), it will report mismatches generated from errors with elements that are' +
        ' not in the schema but are in the request body, if false it will not report those errors',
      external: true,
      usage: ['VALIDATION']
    },
    {
      name: 'Suggest available fixes',
      id: 'suggestAvailableFixes',
      type: 'boolean',
      default: false,
      description: 'If is true, all the mismatches in the body will contain the current and wrong value in ' +
        'your request an a suggestion with a value valid in schema',
      external: true,
      usage: ['VALIDATION']
    }
  ];

  if (criteria && typeof criteria === 'object') {
    if (Array.isArray(criteria.usage)) {
      let tempOptsArray = [];

      criteria.usage.forEach((usageCriteria) => {
        tempOptsArray = [...tempOptsArray, ...optsArray.filter((option) => {
          return option.usage.includes(usageCriteria);
        })];
      });
      optsArray = tempOptsArray;
    }
  }

  if (mode === 'use') {
    let defOptions = {};
    optsArray.forEach((option) => {
      defOptions[option.id] = option.default;
    });
    return defOptions;
  }
  return optsArray.filter((option) => {
    return option.external === true;
  });
}

module.exports = {
  getOptions
};
