/*
 * Copyright 2021 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const yargs = require('yargs')

const { list, introspect, instrument } = require('./commands')

yargs
  .usage('Usage: $0 <cmd> [options]')
  .command('list', 'List the instrumentable processes', {}, list)
  .command(
    'introspect',
    'Return contextual information about the passed PID',
    {
      pid: {
        demand: true,
        string: true
      }
    },
    introspect
  )
  .command(
    'instrument',
    'Instrument process with New Relic agent',
    {
      pid: {
        demand: true,
        string: true
      },
      licenseKey: {
        demand: true,
        string: true
      },
      appName: {
        string: true
      }
      region: {
        string: true,
        default: process.env.NEW_RELIC_REGION || 'US'
       }
    },
    instrument
  )
  .help()
  .strict().argv
