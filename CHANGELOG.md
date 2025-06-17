### v1.1.0 (2025-06-17)

#### Miscellaneous chores

* Add testing against Node 24 ([#60](https://github.com/newrelic/newrelic-introspector-node/pull/60)) ([ad91b01](https://github.com/newrelic/newrelic-introspector-node/commit/ad91b01eb7eb9bb0bfb46e853d5455498b3b1697))

### v1.0.0 (2024-07-31)
#### ⚠ BREAKING CHANGES

* Dropped support for Node 16

#### Features

* Dropped support for Node 16 ([#55](https://github.com/newrelic/newrelic-introspector-node/pull/55)) ([ab9edd5](https://github.com/newrelic/newrelic-introspector-node/commit/ab9edd55f5af5eea0c209a906c3fb020d389cee7))

### v0.4.0 (2024-06-28)

#### Features

* Added support for Node 22.

#### Miscellaneous chores

* Added Node 22 to CI ([#45](https://github.com/newrelic/newrelic-introspector-node/pull/45)) ([a9485c8](https://github.com/newrelic/newrelic-introspector-node/commit/a9485c8a7bdf3d8f38df1bac1af0b9dbf9867405))
* Updated minimum versions of dev dependencies. ([#43](https://github.com/newrelic/newrelic-introspector-node/pull/43)) ([7b78db5](https://github.com/newrelic/newrelic-introspector-node/commit/7b78db594b48cdf8c11f30e9e2b2117e0e0dbc11))([#44](https://github.com/newrelic/newrelic-introspector-node/pull/44)) ([14bc335](https://github.com/newrelic/newrelic-introspector-node/commit/14bc335acf85036e593b5cacc35dbaf78e1f993f))
* Removed outdated Slack reference ([#47](https://github.com/newrelic/newrelic-introspector-node/pull/47)) ([be3088d](https://github.com/newrelic/newrelic-introspector-node/commit/be3088db6fbd7c5bb92854fad8baa0c9704293ef))

#### Continuous integration

* Removed `use_new_release` input from prepare release workflow ([#42](https://github.com/newrelic/newrelic-introspector-node/pull/42)) ([0b75a75](https://github.com/newrelic/newrelic-introspector-node/commit/0b75a750c0d465ebea1057f926e60bb5556d9cf6))
* removed changelog.json file ([#41](https://github.com/newrelic/newrelic-introspector-node/pull/41)) ([4ee2093](https://github.com/newrelic/newrelic-introspector-node/commit/4ee2093c2161a569fffa5fae346c13407b65318b))

### v0.3.0 (2023-12-05)

#### Features

* Added `node_version` to `introspect` command output ([#38](https://github.com/newrelic/newrelic-introspector-node/pull/38)) ([45f8299](https://github.com/newrelic/newrelic-introspector-node/commit/45f829998d92d6994c8e8ab21d674a8c8221a072)).

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
 
