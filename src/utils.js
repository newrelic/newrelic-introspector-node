/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict'

const execPromise = require('./execPromise')

const pm2List = async () => {
  const procListResults = await execPromise.execPromise('pm2 jlist')

  return JSON.parse(procListResults.stdout)
}

const pm2Restart = async (pmId) => {
  await execPromise
    .execPromise(`pm2 restart ${pmId} --update-env --node-args "-r newrelic"`)
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

module.exports = {
  pm2List,
  pm2Restart,
  exec: execPromise.execPromise,
  getProc
}