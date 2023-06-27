# WSDL to Postman Changelog

## [Unreleased]

## [v1.10.0] - 2023-06-27

### Added

-   [#11768](https://github.com/postmanlabs/postman-app-support/issues/11768) Added support for element and attribute prefixes for qualified schema types and elements.

### Fixed

-   Fixed issue where max stack size was reached while generating collection from certain WSDL definition.

## [v1.9.0] - 2023-05-04

### Added

-   Assigned user errors for various handled errors and updated error messaging to be more actionable. 

### Fixed

-   Fixed issue where conversion was failing with TypeError in case tns namespace is not defined correctly. 

## [v1.8.1] - 2023-04-17

### Added

-   GitHub Actions for Release management.

### Changed

-   Bumped up minimum Node version to 12.
-   Unit tests now run on Node versions 12, 16 and 18.

### Fixed

-   Fixed an issue where conversion failed with typeeror while resolving non defined variables.
-   Fixed an issue where circular references were not correctly identified while resolving elements.
-   Fixed an issue where for multiple binding namespaces conversion was failing.

## [1.8.0] - 2023-03-30

### Fixed

-   Fixed issue where conversion failed with RangeError: Maximum stack size reached when recursive elements were present.
-   Fixed issue where conversion failed with typeeror with path.includes is not a function.

## Previous Releases

Newer releases follow the [Keep a Changelog](https://keepachangelog.com) format.

#### v1.7.1 (March 02, 2023)

-   Improve performance by removing unnecessary deep copying of objects

#### v1.7.0 (January 10, 2023)

-   Upgrade libxmljs2 to support node 18

#### v1.6.0 (January 03, 2023)

-   Fixed issue [#11267](https://github.com/postmanlabs/postman-app-support/issues/11267) - WSDL Definition without a portType defined fails to import correctly in Postman

#### v1.5.0 (December 23, 2022)

-   Fixed issue [#11329](https://github.com/postmanlabs/postman-app-support/issues/11329) - Imported WSDL collection contains incorrect separator & URL is not decoded completely.

#### v1.4.0 (November 09, 2022)

-   Fixed issue where for certain definitions "Maximum stack limit reached" error was thrown.

#### v1.3.0 (October 19, 2022)

-   Fixed issue where for namespace defined twice corresponding bodies were not resolved correctly. postmanlabs/postman-app-support#11296
-   Updated release scripts.
-   Made remote ref resolution related options internal.

#### v1.2.0 (August 12, 2022)

-   Added an externally defined namespace (in root) used in the schema into the schema so the xsd2json process does not throw an error.
-   Removed non required file from npm module from being published.

#### v1.1.0 (April 18, 2022)

-   Stable release
-   Removed libxmljs from package.json

[Unreleased]: https://github.com/postmanlabs/wsdl-to-postman/compare/v1.10.0...HEAD

[v1.10.0]: https://github.com/postmanlabs/wsdl-to-postman/compare/v1.9.0...v1.10.0

[v1.9.0]: https://github.com/postmanlabs/wsdl-to-postman/compare/v1.8.1...v1.9.0

[v1.8.1]: https://github.com/postmanlabs/wsdl-to-postman/compare/1.8.0...v1.8.1

[1.8.0]: https://github.com/postmanlabs/wsdl-to-postman/compare/v1.7.1...1.8.0
