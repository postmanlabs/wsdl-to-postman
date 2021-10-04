id|type|available options|default|description|usage
|---|---|---|---|---|---|
folderStrategy|enum|No folders, Port/Endpoint, Service|Port/Endpoint|Select whether to create folders according to the WSDL port/endpoing service or without folders|CONVERSION
resolveRemoteRefs|boolean|-|false|Select whether to resolve remote references.|CONVERSION
sourceUrl|string|-||Specify source URL of definition to resolve remote references mentioned in it.|CONVERSION
validateHeader|boolean|-|false|Select true to validate your collection requests/responses headers are correctly set|VALIDATION
validationPropertiesToIgnore|array|-||Specific properties (parts of a request/response pair) to ignore during validation. Must be sent as an array of strings. Valid inputs in the array:  BODY, RESPONSE_BODY, SOAP_METHOD|VALIDATION
ignoreUnresolvedVariables|boolean|-|false|Whether to ignore mismatches resulting from unresolved variables in the Postman request|VALIDATION
detailedBlobValidation|boolean|-|false|If it is true, all the mismatches will contain detailed info about the error generated if false, the mismatch will return a general description for the error|VALIDATION
showMissingInSchemaErrors|boolean|-|true|If true (as default), it will report mismatches generated from errors with elements that are not in the schema but are in the request body, if false it will not report those errors|VALIDATION
suggestAvailableFixes|boolean|-|false|If is true, all the mismatches in the body will contain the current and wrong value in your request an a suggestion with a value valid in schema|VALIDATION
