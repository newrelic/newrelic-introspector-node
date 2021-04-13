const yargs = require('yargs');

const { list, introspect, instrument } = require('./commands');

yargs
  .usage('Usage: $0 <cmd> [options]')
  .command('list', 'List the instrumentable processes', {}, list)
  .command(
    'introspect',
    'Return contextual information about the passed PID',
    {
      pid: {
        demand: true,
        string: true,
      },
    },
    introspect,
  )
  .command(
    'instrument',
    'Instrument process with New Relic agent',
    {
      pid: {
        demand: true,
        string: true,
      },
      licenseKey: {
        demand: true,
        string: true,
      },
      appName: {
        string: true,
      },
    },
    instrument,
  )
  .help()
  .strict().argv;
