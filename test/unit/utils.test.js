/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const execPromise = require('../../src/execPromise')
const sinon = require('sinon')

const { getProc, pm2RestartandSave } = require('../../src/utils')

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

  test.test('pm2RestartAndSave should restart and save in pm2', async (t) => {
    execStub.resolves()
    await pm2RestartandSave(1)
    t.equal(execStub.callCount, 2, 'should call restart and save')
    t.equal(
      execStub.args[0][0],
      'pm2 restart 1 --update-env --node-args "-r newrelic"',
      'should call restart with proper args'
    )
    t.equal(execStub.args[1][0], 'pm2 save', 'should call save')
  })

  test.test('pm2RestartAndSave should throw error if restart fails', (t) => {
    const err = new Error('restart failed')
    execStub.onCall(0).rejects(err)
    t.rejects(pm2RestartandSave(1), err, 'should reject with restart error')
    t.end()
  })

  test.test('pm2RestartAndSave should throw error if save fails', async (t) => {
    const err = new Error('save failed')
    execStub.onCall(0).resolves()
    execStub.onCall(1).rejects(err)
    t.rejects(pm2RestartandSave(1), err, 'should reject with save error')
    t.end()
  })
})
