/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const test = require('node:test')
const assert = require('node:assert')
const cp = require('child_process')
const { execPromise } = require('../../src/execPromise')
const sinon = require('sinon')

test.beforeEach((ctx) => {
  ctx.nr = { execStub: sinon.stub(cp, 'exec') }
})

test.afterEach((ctx) => {
  ctx.nr.execStub.restore()
})

test('should resolve exec with stdout and stderr', async (t) => {
  const { execStub } = t.nr
  const stdout = 'done!'
  const stderr = 'failed?'
  const cmd = 'my cmd'
  execStub.yields(null, stdout, stderr)
  const results = await execPromise(cmd)
  assert.deepEqual(results, { stdout, stderr }, 'should return with stdout and stderr')
  assert.equal(execStub.args[0][0], cmd)
})

test('should set cwd if pass in as 2nd arg', async (t) => {
  const { execStub } = t.nr
  const stdout = 'done!'
  const stderr = 'failed?'
  const cmd = 'my cmd'
  const cwd = '/path/to/my-cwd'
  execStub.yields(null, stdout, stderr)
  await execPromise(cmd, cwd)
  assert.deepEqual(execStub.args[0][1], { cwd })
})

test('should reject with error when exec fails', async (t) => {
  const { execStub } = t.nr
  const err = new Error('failed to exec cmd')
  execStub.yields(err)
  await assert.rejects(execPromise(), err, 'rejected with proper error')
})
