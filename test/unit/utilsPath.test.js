/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tap = require('tap')
const { checkPackageJson, getTruePath } = require('../../src/utils')

const fs = require('fs')
const sinon = require('sinon')

tap.test('helper', (test) => {
  let statSyncStub

  test.autoend()

  test.beforeEach(() => {
    statSyncStub = sinon.stub(fs, 'statSync')
  })

  test.afterEach(() => {
    statSyncStub.restore()
  })

  test.test('checkPackageJson returns true if path is dir with package.json', (t) => {
    const pathToCheck = '/dir'
    const pathPkgJson = '/dir/package.json'

    statSyncStub.withArgs(pathToCheck).returns({
      isFile: () => false
    })
    statSyncStub.withArgs(pathPkgJson).returns({
      isFile: () => true
    })
    const result = checkPackageJson(pathToCheck)

    t.ok(result)

    t.end()
  })

  test.test('checkPackageJson returns true if false is dir with no package.json', (t) => {
    const pathToCheck = '/dir'
    const pathPkgJson = '/dir/package.json'

    statSyncStub.withArgs(pathToCheck).returns({
      isFile: () => false
    })
    statSyncStub.withArgs(pathPkgJson).returns({
      isFile: () => false
    })
    const result = checkPackageJson(pathToCheck)

    t.notOk(result)

    t.end()
  })

  test.test(
    "checkPackageJson returns true if path is dir, path ends in '/', with package.json",
    (t) => {
      const pathToCheck = '/dir/'
      const pathPkgJson = '/dir/package.json'

      statSyncStub.withArgs(pathToCheck).returns({
        isFile: () => false
      })
      statSyncStub.withArgs(pathPkgJson).returns({
        isFile: () => true
      })
      const result = checkPackageJson(pathToCheck)

      t.ok(result)

      t.end()
    }
  )

  test.test('checkPackageJson returns true if path is file with package.json in dir', (t) => {
    const pathToCheck = '/dir/file.js'
    const pathPkgJson = '/dir/package.json'

    statSyncStub.withArgs(pathToCheck).returns({
      isFile: () => true
    })
    statSyncStub.withArgs(pathPkgJson).returns({
      isFile: () => true
    })
    const result = checkPackageJson(pathToCheck)

    t.ok(result)

    t.end()
  })

  test.test('checkPackageJson returns true if path is file with no package.json in dir', (t) => {
    const pathToCheck = '/dir/file.js'
    const pathPkgJson = '/dir/package.json'

    statSyncStub.withArgs(pathToCheck).returns({
      isFile: () => true
    })
    statSyncStub.withArgs(pathPkgJson).returns({
      isFile: () => false
    })
    const result = checkPackageJson(pathToCheck)

    t.notOk(result)

    t.end()
  })

  test.test(
    'getTruePath returns pm_cwd path if its good and removes filename from path',
    async (t) => {
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

      t.ok(result)
      t.equal(result, '/dir')

      t.end()
    }
  )

  test.test(
    'getTruePath returns pm_exec_path is dir w/ package.json and pm_cwd is bad',
    async (t) => {
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

      t.ok(result)
      t.equal(result, '/otherdir')

      t.end()
    }
  )

  test.test('getTruePath rejects when pm_exec_path and pm_cwd are bad', async (t) => {
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

    try {
      await getTruePath(process)
    } catch (e) {
      t.notOk(e)
    }

    t.end()
  })
})
