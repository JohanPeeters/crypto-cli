const program = require('commander')
const crypto = require('../lib/crypto')
const network = require('../lib/network')

program
  .action(async (plaintext, api, cmd) => {
    console.log('not implemented yet')
  })
  .option('-k, --api-key <key>', 'API key')
  .parse(process.argv)
