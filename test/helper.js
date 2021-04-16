'use strict'

const PM2 = require('pm2')

const startPM2 = () => {
  return new Promise((resolve, reject) => {
    // start pm2 in non-daemon mode
    PM2.connect(true, (err) => {
      if (err) {
        reject(err)
      }

      resolve(true)
    })
  })
}

const startPM2Process = (appPath) => {
  return new Promise((resolve, reject) => {
    PM2.start(appPath, (err) => {
      if (err) {
        reject(err)
      }

      resolve(true)
    })
  })
}

module.exports = {
	startPM2,
	startPM2Process
}
