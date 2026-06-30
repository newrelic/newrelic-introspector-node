/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const test = require('node:test')
const assert = require('node:assert')
const execPromise = require('../../src/execPromise')
const sinon = require('sinon')

const { getProc, pm2RestartandSave } = require('../../src/utils')

test.beforeEach((ctx) => {
  ctx.nr = { execStub: sinon.stub(execPromise, 'execPromise') }
})

test.afterEach((ctx) => {
  ctx.nr.execStub.restore()
})

test('getProc returns running node app info', async (t) => {
  const { execStub } = t.nr
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

  assert.equal(result.pid, 0)
})

test('getProc should throw when pid not found', async (t) => {
  const { execStub } = t.nr
  const stdout = []

  const processObject = {
    stdout: JSON.stringify(stdout),
    stderr: ''
  }
  execStub.returns(Promise.resolve(processObject))

  await assert.rejects(getProc(0), 'throws when pid not found')
})

test('pm2RestartAndSave should restart and save in pm2', async (t) => {
  const { execStub } = t.nr
  execStub.resolves()
  await pm2RestartandSave(1)
  assert.equal(execStub.callCount, 2, 'should call restart and save')
  assert.equal(
    execStub.args[0][0],
    'pm2 restart 1 --update-env --node-args "-r newrelic"',
    'should call restart with proper args'
  )
  assert.equal(execStub.args[1][0], 'pm2 save', 'should call save')
})

test('pm2RestartAndSave should throw error if restart fails', async (t) => {
  const { execStub } = t.nr
  const err = new Error('restart failed')
  execStub.onCall(0).rejects(err)
  await assert.rejects(pm2RestartandSave(1), err, 'should reject with restart error')
})

test('pm2RestartAndSave should throw error if save fails', async (t) => {
  const { execStub } = t.nr
  const err = new Error('save failed')
  execStub.onCall(0).resolves()
  execStub.onCall(1).rejects(err)
  await assert.rejects(pm2RestartandSave(1), err, 'should reject with save error')
})
