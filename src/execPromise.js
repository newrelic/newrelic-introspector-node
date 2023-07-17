/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const cp = require('child_process')

const execPromise = (cmd, cwd) => {
  const opts = {}

  if (cwd) {
    opts.cwd = cwd
  }
  return new Promise((resolve, reject) => {
    cp.exec(cmd, opts, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }

      resolve({
        stdout,
        stderr
      })
    })
  })
}

// export like this to stub function in tests
module.exports = {
  execPromise
}
