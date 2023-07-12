/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
module.exports = {
  extends: ['@newrelic'],
  parserOptions: {
    ecmaVersion: '2020'
  },
  overrides: [
    // cannot parse shebang any longer
    // see: https://github.com/Stuk/eslint-plugin-header/issues/39
    {
      files: ['src/cli.js'],
      rules: {
        'header/header': ['off']
      }
    }
  ]
}
