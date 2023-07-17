/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const cp = require('child_process')
const { execPromise } = require('../../src/execPromise')
const sinon = require('sinon')

tap.test('execPromise', (t) => {
  let execStub

  t.autoend()

  t.beforeEach(() => {
    execStub = sinon.stub(cp, 'exec')
  })

  t.afterEach(() => {
    execStub.restore()
  })

  t.test('should resolve exec with stdout and stderr', async (t) => {
    const stdout = 'done!'
    const stderr = 'failed?'
    const cmd = 'my cmd'
    execStub.yields(null, stdout, stderr)
    const results = await execPromise(cmd)
    t.same(results, { stdout, stderr }, 'should return with stdout and stderr')
    t.equal(execStub.args[0][0], cmd)
  })

  t.test('should set cwd if pass in as 2nd arg', async (t) => {
    const stdout = 'done!'
    const stderr = 'failed?'
    const cmd = 'my cmd'
    const cwd = '/path/to/my-cwd'
    execStub.yields(null, stdout, stderr)
    await execPromise(cmd, cwd)
    t.same(execStub.args[0][1], { cwd })
  })

  t.test('should reject with error when exec fails', async (t) => {
    const err = new Error('failed to exec cmd')
    execStub.yields(err)
    t.rejects(execPromise(), err, 'rejected with proper error')
  })
})
