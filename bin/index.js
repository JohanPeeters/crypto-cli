#!/usr/bin/env node

const program = require('commander')

program
  .version('0.0.1', '-v, --version')
  .command('public-key <api> <type>', 'get the public <type> key. <type> is encryption or signing')
  .command('myKeyPair', 'generate or retrieve own key pair')
  .command('verify-decrypt <msg> <api>', 'locally encrypt <msg> asymmetrically and request <api>/decrypt to decrypt')
  .command('verify-sign <msg> <api>', 'request signature on <msg> at <api>/sign to sign')
  .command('verify-password-hash <pw> <api>', 'request the Argon2 hash of <pw> for storage')
  .parse(process.argv)
