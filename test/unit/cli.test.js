/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const test = require('node:test')
const assert = require('node:assert')
const cp = require('child_process')
const util = require('util')
const execAsync = util.promisify(cp.exec)

/**
 * Yes all commands are failing because these are unit tests and lack pm2 and an app
 * That is ok as we are just testing the CLI args and mapping of commands not the business logic
 * of the actual commands that is done elsewhere
 */

test('should run list', async () => {
  await assert.rejects(
    execAsync('node ./src/cli list'),
    /Command failed: pm2 jlist/,
    'should run and fail because pm2 is not installed'
  )
})

test('should error if pid is not provided when calling introspect', async () => {
  await assert.rejects(
    execAsync('node ./src/cli introspect'),
    /Missing required argument: pid/,
    'should state pid is required'
  )
})

test('should run introspect when pid is provided', async () => {
  await assert.rejects(
    execAsync('node ./src/cli introspect --pid 0'),
    /Command failed: pm2 jlist/,
    'should run and fail because pm2 is not installed'
  )
})

test('should error when required fields are missing with instrument', async () => {
  await assert.rejects(
    execAsync('node ./src/cli instrument'),
    /Missing required arguments: pid, licenseKey/,
    'should state pid is required'
  )
})

test('should run instrument', async () => {
  await assert.rejects(
    execAsync('node ./src/cli instrument --pid 0 --licenseKey super-secret --appName test'),
    /Command failed: pm2 jlist/,
    'should run and fail because pm2 is not installed'
  )
})
