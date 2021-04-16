'use strict'

const tap = require('tap')
const PM2 = require('pm2')
const path = require('path')
const sinon = require('sinon')
const { startPM2, startPM2Process } = require('../helper')

const fixturePath = path.join(__dirname, '..', 'fixture')
const appPath = `${fixturePath}/server.js`

const { list, introspect, instrument } = require('../../src/commands')

const processExitStub = sinon.stub(process, 'exit').returns(true)

tap.test('utils', (test) => {
  test.autoend()

	test.tearDown((done) => {
		processExitStub.restore()
		done
	})

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

  test.test('list command returns list of pids', async (t) => {
    const pm2Started = await startPM2()

    t.ok(pm2Started, 'pm2 started')

    const processStarted = await startPM2Process(appPath)

    t.ok(processStarted, 'test server started')

    const pidList = await list()

    t.equal(pidList.length, 1, 'returned on process')

    t.end()
  })

  // test.test('getProc should throw when pid not found', async (t) => {
  //   const pm2Started = await startPM2()

  //   t.ok(pm2Started, 'pm2 started')

  //   const fakePid = 707

  //   try {
  //     await getProc(fakePid)
  //   } catch (err) {
  //     t.ok(err, 'throws when pid not found')
  //   }

  //   t.end()
  // })
})
