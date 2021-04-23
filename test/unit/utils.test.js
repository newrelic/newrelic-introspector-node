/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict'

const tap = require('tap')
const execPromise = require('../../src/execPromise')
let sinon = require('sinon')

const { getProc } = require('../../src/utils')

tap.test('utils', (test) => {
  let execStub

  test.autoend()

  test.beforeEach(() => {
    execStub = sinon.stub(execPromise, 'execPromise')
  })

  test.afterEach(() => {
    execStub.restore()
  })

  test.test('getProc returns running node app info', async (t) => {
    const stdout = [
      {
        pid: 0
      }
    ]

    const processObject = {
      stdout: JSON.stringify(stdout),
      stderr: ''
    }
    execStub.returns(Promise.resolve(processObject))
    const result = await getProc(0)

    t.equal(result.pid, 0)

    t.end()
  })

  test.test('getProc should throw when pid not found', async (t) => {
    const stdout = []

    const processObject = {
      stdout: JSON.stringify(stdout),
      stderr: ''
    }
    execStub.returns(Promise.resolve(processObject))

    try {
      await getProc(0)
    } catch (err) {
      t.ok(err, 'throws when pid not found')
    }

    t.end()
  })
})
