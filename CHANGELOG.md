### v0.3.0 (2023-12-05)

#### Features

* Added `node_version` to `instrospect` command output.

### v0.2.0 (2023-08-28)

* **BREAKING**: Removed support for Node 14.
* Added support for Node 20.

#### Bug Fixes

* use community header instead of community plus

#### Documentation

* update slack invite link

#### Miscellaneous Chores

* added release automation to prepare and create release, also jobs to add issues to engineering board and validate PRs. lastly, made an attempt to backfill a changelog
* removed unused, commented out code
* updated explorer hub link in readme

#### Tests

* added full unit test suite for all code.

### v0.1.2 (2023-11-30)

 * Fixes issue with install location when PM2 starts from outside the app directory (Adds process.pm_exec_path check for app location #12)

### v0.1.1 (2021-04-28)

 * Added bin file `newrelic-introspector-node` to execute package.

### v0.1.0 (2021-04-12)

 * Initial release of package. This is a CLI tool for discovering instrumentable Node.js applications on a system, retrieving contextual information about them, and automating the install of the New Relic Node agent.
 
