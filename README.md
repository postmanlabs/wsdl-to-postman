# wsdl-to-postman

Enables Postman support of the WSDL specification
browserify index.js --standalone xsd2jsonschemafaker > xsd2jsonschemafaker.js

## Conversion Schema data example values

| _wsdl type_                                                                                         |     _default value_      | _note_                                                                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------- | :----------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| integer, int, number, decimal, double, float, long, short, unsignedInt, unsignedLong, unsignedShort | random between 2 and 100 | if there are defined min and max use them and generates random value between those boundaries                                                                                                                     |
| string                                                                                              |    the word "string"     | if there is a pattern a random string that conforms to that pattern, if there is minimum or maximum a string that conforms to that length e.g. the word "string....." for minimum (11) or "str.." for maximum (5) |
| date                                                                                                |       today's date       | in xsd dateTime format ```'-?([1-9][0-9]{3,}| 0[0-9]{3})-(0[1-9] | 1[0-2])-(0[1-9] | [12][0-9] | 3[01])(Z | (\\+ | -)((0[0-9] | 1[0-3]):[0-5][0-9] | 14:00))?';```                                                |
