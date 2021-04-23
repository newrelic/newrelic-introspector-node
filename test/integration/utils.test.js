/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
// const path = require('path')

// const fixturePath = path.join(__dirname, '..', 'fixture')
// const appPath = `${fixturePath}/server.js`

// const { getProc, pm2List } = require('../../src/utils')

tap.test('utils', (test) => {
  test.autoend()

  test.beforeEach((done) => {
    done
  })

  test.afterEach((done) => {
      done
  })

  test.test('getProc returns running node app info', async (t) => {
    t.end()
  })

  test.test('getProc should throw when pid not found', async (t) => {
    t.end()
  })
})
