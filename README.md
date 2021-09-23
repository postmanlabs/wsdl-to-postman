# wsdl-to-postman

Enables Postman support of the WSDL specification
browserify index.js --standalone xsd2jsonschemafaker > xsd2jsonschemafaker.js


## Command Line Interface

The converter can be used as a CLI tool as well. The following [command line options](#options) are available.

`wsdl2postman [options]`

### Options
- `-v`, `--version`  
  Specifies the version of the converter

- `-s <source>`, `--spec <source>`  
  Used to specify the WSDL specification (file path) which is to be converted

- `-o <destination>`, `--output <destination>`  
  Used to specify the destination file in which the collection is to be written

- `-t`, `--test`  
  Used to test the collection with an in-built sample specification

- `-p`, `--pretty`  
  Used to pretty print the collection object while writing to a file

- `-O`, `--options`
  Used to supply options to the converter

- `-c`, `--options-config`  
  Used to supply options to the converter through config file

- `-h`, `--help`  
  Specifies all the options along with a few usage examples on the terminal


### Usage

**Sample usage examples of the converter CLI**


- Takes a specification (spec.wsdl) as an input and writes to a file (collection.json) with pretty printing and using provided options
```terminal
$ wsdl2postman -s spec.wsdl -o collection.json -p -O folderStrategy=Service
```

- Takes a specification (spec.wsdl) as an input and writes to a file (collection.json) with pretty printing and using provided options via config file
```terminal
$ wsdl2postman -s spec.wsdl -o collection.json -p  -c ./examples/cli-options-config.json
```

- Testing the converter
```terminal
$ wsdl2postman --test
```


## Conversion Schema data example values


| *WSDL Type* | *default value* | *note* |
| --- | --- | :---: |
| integer, int, number, decimal, double, float, long, short, unsignedInt, unsignedLong, unsignedShort  | random between 2 and 100 | if there are defined min and max use them and generates random value between those boundaries |
| string |   the word "string" | if there is a pattern a random string that conforms to that pattern, if there is minimum or maximum a string that conforms to that length e.g. the word "string....." for minimum (11) or "str.." for maximum (5)  |
| date | today's date | in xsd dateTime format according to: https://www.w3.org/TR/xmlschema11-2/#date |

- DateTime XSD format
```terminal
-?([1-9][0-9]{3,}||0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?
```
