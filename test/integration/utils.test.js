'use strict'

const tap = require('tap')
const PM2 = require('pm2')
const path = require('path')
const { startPM2, startPM2Process } = require('../helper')

const fixturePath = path.join(__dirname, '..', 'fixture')
const appPath = `${fixturePath}/server.js`

const { getProc, pm2List } = require('../../src/utils')

tap.test('utils', (test) => {
  test.autoend()

  test.beforeEach((done) => {
    PM2.delete('all', () => {
      done
    })
  })

  test.afterEach((done) => {
    PM2.killDaemon(() => {
      PM2.disconnect()
      done
    })
  })

  test.test('getProc returns running node app info', async (t) => {
    const pm2Started = await startPM2()

    t.ok(pm2Started, 'pm2 started')

    const processStarted = await startPM2Process(appPath)

    t.ok(processStarted, 'test server started')

    const pidList = await pm2List()

    t.equal(pidList.length, 1, 'returned on process')

    const pid = pidList[0].pid

    t.ok(pid, 'returns pid')

    const proc = await getProc(pid)

    t.ok(proc.pid, 'getProc returns process info')

    t.end()
  })

  test.test('getProc should throw when pid not found', async (t) => {
    const pm2Started = await startPM2()

    t.ok(pm2Started, 'pm2 started')

    const fakePid = 707

    try {
      await getProc(fakePid)
    } catch (err) {
      t.ok(err, 'throws when pid not found')
    }

    t.end()
  })
})
