/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict'

const sharedConfig = require('@newrelic/eslint-config')
module.exports = [
  ...sharedConfig.configs.neostandard,
  sharedConfig.plugins.sonarjs.configs.recommended,
  sharedConfig.configs.baselineNewRelicConfig,
  // cannot parse shebang any longer
  // see: https://github.com/Stuk/eslint-plugin-header/issues/39
  {
    files: ['src/cli.js'],
    rules: {
      'header/header': ['off']
    }
  }
]
