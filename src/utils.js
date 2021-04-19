/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const pm2 = require('pm2')
const { promisify } = require('util')

const pm2List = promisify(pm2.list).bind(pm2)
const pm2Restart = promisify(pm2.restart).bind(pm2)
const exec = promisify(require('child_process').exec)

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
  exec,
  getProc
}
