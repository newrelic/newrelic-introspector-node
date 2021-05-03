/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict'

const fs = require('fs')
const execPromise = require('./execPromise')

const pm2List = async () => {
  const procListResults = await execPromise.execPromise('pm2 jlist')

  return JSON.parse(procListResults.stdout)
}

const pm2RestartandSave = async (pmId) => {
  await execPromise
  .execPromise(`pm2 restart ${pmId} --update-env --node-args "-r newrelic"`)

  await execPromise
  .execPromise('pm2 save')
}

const getProc = async (pid) => {
  try {
    const processes = await pm2List()
    const numPid = parseInt(pid, 10)
    const filtered = processes.filter((p) => p.pid === numPid)

    if (filtered.length !== 1) {
      throw new Error(`could not uniquely identify process with PID ${pid}`)
    }

    const [proc] = filtered

    return proc
  } catch (error) {
    throw new Error(error)
  }
}


const isFile = (path) => {
  try {
    const stats = fs.statSync(path)
    return stats.isFile()
  } catch (err) {
    return false
  }
}

const checkPackageJson = (path) => {
    if (!isFile(path)) {
      if (path[path.length - 1] === '/') {
        return (isFile(`${path}package.json`))
      }

      return (isFile(`${path}/package.json`))
    }

    const rgx = /[^/]*$/
    const pkgPath = path.replace(rgx, 'package.json')

    return isFile(pkgPath)
}

const getTruePath = async (proc) => {
  return new Promise((resolve, reject) => {
    let truePath = ''

    const cwdPathOk = checkPackageJson(proc.pm2_env.pm_cwd)

    const execPathOk = checkPackageJson(proc.pm2_env.pm_exec_path)

    if (cwdPathOk) {
      truePath = proc.pm2_env.pm_cwd
    } else if (execPathOk) {
      truePath = proc.pm2_env.pm_exec_path
    } else {
      reject(false)
    }

    if (isFile(truePath)) {
      resolve(truePath.substring(0, truePath.lastIndexOf('/')))
    }

    resolve(truePath)
  })
}

module.exports = {
  pm2List,
  pm2RestartandSave,
  exec: execPromise.execPromise,
  getProc,
  getTruePath,
  checkPackageJson
}
