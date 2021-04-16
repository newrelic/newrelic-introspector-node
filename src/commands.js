'use strict'

const { pm2List, pm2Restart, exec, getProc } = require('./utils')

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

    console.log(output)
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const instrument = async (argv) => {
  try {
    const proc = await getProc(argv.pid)

    const { stdout, stderr } = await exec('npm install newrelic --save', {
      cwd: proc.pm2_env.pm_cwd
    })

    console.log(stdout)
    console.log(stderr)

    process.env.NEW_RELIC_LICENSE_KEY = argv.licenseKey
    process.env.NEW_RELIC_APP_NAME = argv.appName || proc.name

    await pm2Restart(proc.pm_id, {
      nodeArgs: '-r newrelic',
      updateEnv: true
    })

    console.log('Process instrumented successfully')
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = { list, introspect, instrument }
