/*
 * Copyright 2023 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-process-exit, no-console */

'use strict'

const { pm2List, pm2RestartandSave, exec, getProc, getTruePath } = require('./utils')

const list = async () => {
  try {
    const processes = await pm2List()

    const onlinePids = processes.reduce((pids, currentProc) => {
      if (currentProc.pm2_env.status === 'online') {
        return [...pids, currentProc.pid]
      }

      return pids
    }, [])

    console.log(onlinePids)
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const introspect = async (argv) => {
  try {
    const proc = await getProc(argv.pid)

    const output = {
      pid: proc.pid,
      pm_id: proc.pm_id,
      name: proc.name,
      pm_exec_path: proc.pm2_env.pm_exec_path,
      pm_cwd: proc.pm2_env.pm_cwd
    }

    console.log(JSON.stringify(output))
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const instrument = async (argv) => {
  try {
    const proc = await getProc(argv.pid)
    const truePath = await getTruePath(proc)

    const { stdout, stderr } = await exec('npm install newrelic --save', truePath)

    console.error(stdout)
    console.error(stderr)

    process.env.NEW_RELIC_LICENSE_KEY = argv.licenseKey
    process.env.NEW_RELIC_APP_NAME = argv.appName || proc.name
    process.env.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED = true
    if (argv.region.toLowerCase() === 'staging') {
      process.env.NEW_RELIC_HOST = 'staging-collector.newrelic.com'
    }

    await pm2RestartandSave(proc.pm_id)

    console.error('Process instrumented successfully')
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = { list, introspect, instrument }
