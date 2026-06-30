/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-console */
'use strict'

const test = require('node:test')
const assert = require('node:assert')
const utils = require('../../src/utils')
const sinon = require('sinon')

test.beforeEach((ctx) => {
  const sandbox = sinon.createSandbox()
  sandbox.stub(console, 'log')
  sandbox.stub(console, 'error')
  sandbox.stub(process, 'exit')
  sandbox.stub(utils, 'pm2List')
  sandbox.stub(utils, 'getProc')
  sandbox.stub(utils, 'getTruePath')
  sandbox.stub(utils, 'pm2RestartandSave')
  sandbox.stub(utils, 'exec')
  const { list, introspect, instrument } = require('../../src/commands')
  ctx.nr = { sandbox, list, introspect, instrument }
})

test.afterEach((ctx) => {
  ctx.nr.sandbox.restore()
  // clean up so stubs do not persist
  delete require.cache[require.resolve('../../src/commands')]
})

test('list should list all pm2 online pids', async (t) => {
  const { list } = t.nr
  const processes = [
    {
      pid: 0,
      pm2_env: {
        status: 'online'
      }
    },
    {
      pid: 1,
      pm2_env: {
        status: 'stopped'
      }
    },
    {
      pid: 2,
      pm2_env: {
        status: 'online'
      }
    }
  ]

  utils.pm2List.resolves(processes)
  await list()
  assert.deepEqual(console.log.args[0][0], [0, 2], 'should only list pids online')
  assert.equal(process.exit.callCount, 1, 'should exit once')
  assert.equal(process.exit.args[0][0], 0, 'should called process exit with code 0')
})

test('should list 0 pids if no pm2 processes exist', async (t) => {
  const { list } = t.nr
  utils.pm2List.resolves([])
  await list()
  assert.deepEqual(console.log.args[0][0], [], 'should not list any pids')
  assert.equal(process.exit.callCount, 1, 'should exit once')
  assert.equal(process.exit.args[0][0], 0, 'should called process exit with code 0')
})

test('should log console error when pm2List fails', async (t) => {
  const { list } = t.nr
  const err = new Error('failed to list pids')
  utils.pm2List.rejects(err)
  await list()
  assert.deepEqual(console.error.args[0][0], err, 'should log error')
  assert.equal(process.exit.callCount, 1, 'should exit once')
  assert.equal(process.exit.args[0][0], 1, 'should called process exit with code 1')
})

test('introspect should list pm2 metadata in json format', async (t) => {
  const { introspect } = t.nr
  const pm2Meta = {
    pid: 0,
    pm_id: 1,
    name: 'Unit Test',
    pm2_env: {
      pm_exec_path: '/path/to/pm2',
      pm_cwd: 'pm2 list',
      node_version: '16.20.2'
    }
  }

  utils.getProc.resolves(pm2Meta)

  await introspect({ pid: 0 })
  assert.equal(
    console.log.args[0][0],
    JSON.stringify({
      pid: 0,
      pm_id: 1,
      name: 'Unit Test',
      pm_exec_path: '/path/to/pm2',
      pm_cwd: 'pm2 list',
      node_version: '16.20.2'
    }),
    'should list meta about a pid'
  )
  assert.equal(process.exit.callCount, 1, 'should exit once')
  assert.equal(process.exit.args[0][0], 0, 'should called process exit with code 0')
})

test('introspect should log error when getProc fails', async (t) => {
  const { introspect } = t.nr
  const err = new Error('failed to get pid meta')
  utils.getProc.rejects(err)
  await introspect({})
  assert.deepEqual(console.error.args[0][0], err, 'should log error')
  assert.equal(process.exit.callCount, 1, 'should exit once')
  assert.equal(process.exit.args[0][0], 1, 'should called process exit with code 1')
})

test('instrument should install agent and restart pm2 with agent loaded', async (t) => {
  const { instrument } = t.nr
  const pidMeta = { pm_id: 0 }
  utils.getProc.resolves(pidMeta)
  const truePath = '/path/for/realz'
  utils.getTruePath.resolves(truePath)
  utils.pm2RestartandSave.resolves()
  const output = {
    stderr: 'no error',
    stdout: 'install done!'
  }
  utils.exec.resolves(output)

  await instrument({ pid: 0 })
  assert.deepEqual(console.error.callCount, 3, 'should call console.error three times')
  assert.equal(console.error.args[0][0], output.stdout, 'should log stdout')
  assert.equal(console.error.args[1][0], output.stderr, 'should log stderr')
  assert.equal(console.error.args[2][0], 'Process instrumented successfully')
  assert.equal(utils.exec.args[0][1], truePath, 'should install with truePath')
  assert.equal(
    utils.pm2RestartandSave.args[0][0],
    0,
    'should call restart with the appropriate pid'
  )
  assert.equal(process.exit.callCount, 1, 'should exit once')
  assert.equal(process.exit.args[0][0], 0, 'should called process exit with code 0')
})

test('should set process env vars from argv', async (t) => {
  const { instrument } = t.nr
  utils.getProc.resolves({})
  utils.getTruePath.resolves()
  utils.exec.resolves({})
  utils.pm2RestartandSave.resolves()

  const argv = {
    pid: 0,
    licenseKey: 'super-secret',
    appName: 'my-app',
    region: 'prod'
  }

  await instrument(argv)
  assert.equal(process.env.NEW_RELIC_LICENSE_KEY, argv.licenseKey)
  assert.equal(process.env.NEW_RELIC_APP_NAME, argv.appName)
  assert.equal(process.env.NEW_RELIC_HOST, undefined)
  assert.equal(process.env.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED, 'true')
})

test('should set NEW_RELIC_HOST to staging url if region is staging', async (t) => {
  const { instrument } = t.nr
  utils.getProc.resolves({ name: 'test-app' })
  utils.getTruePath.resolves()
  utils.exec.resolves({})
  utils.pm2RestartandSave.resolves()

  const argv = {
    pid: 0,
    licenseKey: 'super-secret',
    region: 'staging'
  }

  await instrument(argv)
  assert.equal(process.env.NEW_RELIC_HOST, 'staging-collector.newrelic.com')
  assert.equal(process.env.NEW_RELIC_APP_NAME, 'test-app')
})

test('should log error and exit with code 0 if any async function fails in instrument', async (t) => {
  const { instrument } = t.nr
  const err = new Error('failed to get pid meta')
  utils.getProc.rejects(err)
  await instrument({})
  assert.deepEqual(console.error.args[0][0], err, 'should log error')
  assert.equal(process.exit.callCount, 1, 'should exit once')
  assert.equal(process.exit.args[0][0], 1, 'should called process exit with code 1')
})
