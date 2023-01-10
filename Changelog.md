# WSDL to Postman Changelog
### v1.7.0
* Upgrade libxmljs2 to support node 18

### v1.6.0
* Fixed issue [#11267](https://github.com/postmanlabs/postman-app-support/issues/11267) - WSDL Definition without a portType defined fails to import correctly in Postman

#### v1.5.0 (December 23, 2022)
* Fixed issue [#11329](https://github.com/postmanlabs/postman-app-support/issues/11329) - Imported WSDL collection contains incorrect separator & URL is not decoded completely.

#### v1.4.0 (November 09, 2022)
* Fixed issue where for certain definitions "Maximum stack limit reached" error was thrown.

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
