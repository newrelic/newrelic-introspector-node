### v1.0.0 (2023-08-17)

#### Bug Fixes

* use community header instead of community plus ([#22](https://github.com/newrelic/newrelic-introspector-node/pull/22)) ([c1599a8](https://github.com/newrelic/newrelic-introspector-node/commit/c1599a86f38a58e10869b92c9dc8080381956bbe))

#### Documentation

* update slack invite link ([#18](https://github.com/newrelic/newrelic-introspector-node/pull/18)) ([bc2a3e0](https://github.com/newrelic/newrelic-introspector-node/commit/bc2a3e05611675f9dec969675a59a5b1ee07f801))

#### Miscellaneous Chores

* added node 16, 18, 20 to ci ([#25](https://github.com/newrelic/newrelic-introspector-node/pull/25)) ([684c95a](https://github.com/newrelic/newrelic-introspector-node/commit/684c95a1c6db7608c0cd12295cd3d36255735c58))
* Added Node version to engines, specifying >=16 ([#33](https://github.com/newrelic/newrelic-introspector-node/pull/33)) ([d397f9f](https://github.com/newrelic/newrelic-introspector-node/commit/d397f9f75bebd20b29dcef07b3d6d85779fe89e5))
    * Signed-off-by: mrickard <maurice@mauricerickard.com>
* added our eslint ruleset, ran it and wired up husky + lint staged ([#26](https://github.com/newrelic/newrelic-introspector-node/pull/26)) ([512de3d](https://github.com/newrelic/newrelic-introspector-node/commit/512de3d25ae39f6018cb0f504950d197565df568))
* added release automation to prepare and create release, also jobs to add issues to engineering board and validate PRs. lastly, made an attempt to backfill a changelog ([#31](https://github.com/newrelic/newrelic-introspector-node/pull/31)) ([66af873](https://github.com/newrelic/newrelic-introspector-node/commit/66af873555283fb7ee0c6ead96a35ec846037843))
* Defined changelog_file for prepare-release.yml ([#34](https://github.com/newrelic/newrelic-introspector-node/pull/34)) ([49a016e](https://github.com/newrelic/newrelic-introspector-node/commit/49a016e97920033f4f21901e6f2c6d3c74932808))
    * Signed-off-by: mrickard <maurice@mauricerickard.com>
* removed unused, commented out code ([#27](https://github.com/newrelic/newrelic-introspector-node/pull/27)) ([1bb1531](https://github.com/newrelic/newrelic-introspector-node/commit/1bb1531a0986f59d85691bf30145b84cb28bcb3a))
* update explorer hub link in readme ([#24](https://github.com/newrelic/newrelic-introspector-node/pull/24)) ([615c6ff](https://github.com/newrelic/newrelic-introspector-node/commit/615c6ffce140248beeef0fb6b8990722ad76c1aa))
* update to newest community plus header ([#20](https://github.com/newrelic/newrelic-introspector-node/pull/20)) ([07810dd](https://github.com/newrelic/newrelic-introspector-node/commit/07810dd1e18ea20dfcee95d948242679aa585b0c))

#### Tests

* added full unit test suite for all code. ([#27](https://github.com/newrelic/newrelic-introspector-node/pull/27)) ([7f492fd](https://github.com/newrelic/newrelic-introspector-node/commit/7f492fdec08d1723edae43d78448553c23750c5f))
    * stuff

### v0.1.2 (2023-11-30)

 * Fixes issue with install location when PM2 starts from outside the app directory (Adds process.pm_exec_path check for app location #12)

### v0.1.1 (2021-04-28)

 * Added bin file `newrelic-introspector-node` to execute package.

### v0.1.0 (2021-04-12)

 * Initial release of package. This is a CLI tool for discovering instrumentable Node.js applications on a system, retrieving contextual information about them, and automating the install of the New Relic Node agent.
 
