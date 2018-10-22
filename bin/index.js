#!/usr/bin/env node

const program = require('commander')
const package = require('../package.json')

program
  .version(package.version, '-v, --version')
  .command('public-key <api> <type>', 'get the public <type> key. <type> is encryption or signing')
  .command('verify-decrypt <msg> <api>', 'locally encrypt <msg> asymmetrically and request <api>/decrypt to decrypt')
  .command('verify-sign <msg> <api>', 'request signature on <msg> at <api>/sign to sign')
  .command('verify-password-hash <pw> <api>', 'request the Argon2 hash of <pw> for storage')
  .parse(process.argv)
