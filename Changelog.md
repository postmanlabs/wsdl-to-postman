# WSDL to Postman Changelog

#### v1.3.0 (October 19, 2022)
* Fixed issue where for namespace defined twice corresponding bodies were not resolved correctly. postmanlabs/postman-app-support#11296
* Updated release scripts.
* Made remote ref resolution related options internal.

#### v1.2.0 (August 12, 2022)
* Added an externally defined namespace (in root) used in the schema into the schema so the xsd2json process does not throw an error.
* Removed non required file from npm module from being published.

#### v1.1.0 (April 18, 2022)
* Stable release
* Removed libxmljs from package.json
