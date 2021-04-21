/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const PM2 = require('pm2')
const path = require('path')
const sinon = require('sinon')
const { startPM2, startPM2Process } = require('../helper')

const fixturePath = path.join(__dirname, '..', 'fixture')
const appPath = `${fixturePath}/server.js`

const { list, introspect } = require('../../src/commands')

let processExitStub
let consoleSpy

tap.test('utils', (test) => {
  test.autoend()

  test.beforeEach((done) => {
    processExitStub = sinon.stub(process, 'exit')

    consoleSpy = sinon.spy(console, 'log')
    PM2.delete('all', () => {
      done
    })
  })

  test.afterEach((done) => {
    processExitStub.restore()
    consoleSpy.restore()
    PM2.killDaemon(() => {
      PM2.disconnect()
      done
    })
  })

  test.test('list and introspect commands', async (t) => {
    const pm2Started = await startPM2()

    t.ok(pm2Started, 'pm2 started')

    const processStarted = await startPM2Process(appPath)

    t.ok(processStarted, 'test server started')

    await list()

    const listConsoleCall = consoleSpy.getCall(-1)
    const rgx = /[^log:]+$/
    const pid = listConsoleCall.args[0].match(rgx)[0].trim()

    t.ok(pid, 'list returned pid')
    t.ok(processExitStub.calledWith(0), 'exited command run with no error')

    await introspect({
      pid
    })

    const introspectConsoleCall = consoleSpy.getCall(-1)
    const introspectOutput = introspectConsoleCall.args[0].match(/{.+}/)

    t.ok(introspectOutput[0], 'introspect returns json')

    const introspectResult = JSON.parse(introspectOutput)

    t.equal(introspectResult.pid, parseInt(pid, 10), 'json parsed')

    t.end()
  })
})
