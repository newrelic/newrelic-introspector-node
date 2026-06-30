/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { checkPackageJson, getTruePath } = require('../../src/utils')

const fs = require('fs')
const sinon = require('sinon')

test.beforeEach((ctx) => {
  ctx.nr = { statSyncStub: sinon.stub(fs, 'statSync') }
})

test.afterEach((ctx) => {
  ctx.nr.statSyncStub.restore()
})

test('checkPackageJson returns true if path is dir with package.json', (t) => {
  const { statSyncStub } = t.nr
  const pathToCheck = '/dir'
  const pathPkgJson = '/dir/package.json'

  statSyncStub.withArgs(pathToCheck).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pathPkgJson).returns({
    isFile: () => true
  })
  const result = checkPackageJson(pathToCheck)

  assert.ok(result)
})

test('checkPackageJson returns true if false is dir with no package.json', (t) => {
  const { statSyncStub } = t.nr
  const pathToCheck = '/dir'
  const pathPkgJson = '/dir/package.json'

  statSyncStub.withArgs(pathToCheck).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pathPkgJson).returns({
    isFile: () => false
  })
  const result = checkPackageJson(pathToCheck)

  assert.ok(!result)
})

test("checkPackageJson returns true if path is dir, path ends in '/', with package.json", (t) => {
  const { statSyncStub } = t.nr
  const pathToCheck = '/dir/'
  const pathPkgJson = '/dir/package.json'

  statSyncStub.withArgs(pathToCheck).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pathPkgJson).returns({
    isFile: () => true
  })
  const result = checkPackageJson(pathToCheck)

  assert.ok(result)
})

test('checkPackageJson returns true if path is file with package.json in dir', (t) => {
  const { statSyncStub } = t.nr
  const pathToCheck = '/dir/file.js'
  const pathPkgJson = '/dir/package.json'

  statSyncStub.withArgs(pathToCheck).returns({
    isFile: () => true
  })
  statSyncStub.withArgs(pathPkgJson).returns({
    isFile: () => true
  })
  const result = checkPackageJson(pathToCheck)

  assert.ok(result)
})

test('checkPackageJson returns true if path is file with no package.json in dir', (t) => {
  const { statSyncStub } = t.nr
  const pathToCheck = '/dir/file.js'
  const pathPkgJson = '/dir/package.json'

  statSyncStub.withArgs(pathToCheck).returns({
    isFile: () => true
  })
  statSyncStub.withArgs(pathPkgJson).returns({
    isFile: () => false
  })
  const result = checkPackageJson(pathToCheck)

  assert.ok(!result)
})

test('getTruePath returns pm_cwd path if its good and removes filename from path', async (t) => {
  const { statSyncStub } = t.nr
  const pmCwdPath = '/dir/file.js'
  const pathPkgJson = '/dir/package.json'
  const pmExecPath = '/otherdir'
  const pathExecPkgJson = '/otherdir/package.json'

  const process = {
    pm2_env: {
      pm_cwd: pmCwdPath,
      pm_exec_path: pmExecPath
    }
  }

  statSyncStub.withArgs(pmCwdPath).returns({
    isFile: () => true
  })
  statSyncStub.withArgs(pathPkgJson).returns({
    isFile: () => true
  })
  statSyncStub.withArgs(pmExecPath).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pathExecPkgJson).returns({
    isFile: () => false
  })
  const result = await getTruePath(process)

  assert.ok(result)
  assert.equal(result, '/dir')
})

test('getTruePath returns pm_exec_path is dir w/ package.json and pm_cwd is bad', async (t) => {
  const { statSyncStub } = t.nr
  const pmCwdPath = '/dir'
  const pathPkgJson = '/dir/package.json'
  const pmExecPath = '/otherdir'
  const pathExecPkgJson = '/otherdir/package.json'

  const process = {
    pm2_env: {
      pm_cwd: pmCwdPath,
      pm_exec_path: pmExecPath
    }
  }

  statSyncStub.withArgs(pmCwdPath).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pathPkgJson).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pmExecPath).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pathExecPkgJson).returns({
    isFile: () => true
  })
  const result = await getTruePath(process)

  assert.ok(result)
  assert.equal(result, '/otherdir')
})

test('getTruePath rejects when pm_exec_path and pm_cwd are bad', async (t) => {
  const { statSyncStub } = t.nr
  const pmCwdPath = '/dir'
  const pathPkgJson = '/dir/package.json'
  const pmExecPath = '/otherdir'
  const pathExecPkgJson = '/otherdir/package.json'

  const process = {
    pm2_env: {
      pm_cwd: pmCwdPath,
      pm_exec_path: pmExecPath
    }
  }

  statSyncStub.withArgs(pmCwdPath).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pathPkgJson).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pmExecPath).returns({
    isFile: () => false
  })
  statSyncStub.withArgs(pathExecPkgJson).returns({
    isFile: () => false
  })

  await assert.rejects(getTruePath(process), /could not resolve a valid package path/)
})
