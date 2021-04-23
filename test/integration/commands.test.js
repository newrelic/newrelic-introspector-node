/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const path = require('path')
const sinon = require('sinon')

// const fixturePath = path.join(__dirname, '..', 'fixture')
// const appPath = `${fixturePath}/server.js`

// const { list, introspect } = require('../../src/commands')

let processExitStub
// let consoleSpy

tap.test('utils', (test) => {
  test.autoend()

  test.beforeEach((done) => {
    processExitStub = sinon.stub(process, 'exit')

    // consoleSpy = sinon.spy(console, 'log')
    done
  })

  test.afterEach((done) => {
    processExitStub.restore()
    done
  })

  test.test('list and introspect commands', async (t) => {
    t.end()
  })
})
