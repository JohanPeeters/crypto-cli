const program = require('commander')
const crypto = require('../lib/crypto')
const network = require('../lib/network')

program
  .action(async (password, api, cmd) => {
    try {
      const pwhash_str = await network.pwhash_str(password, api, cmd.apiKey)
      const verificationSucceeds = await crypto.pwhash_str_verify(pwhash_str, password)
      if (verificationSucceeds) {
        console.log(`test succeeds`)
        return
      }
    } catch(e) {
      console.log(e.message)
    }
    console.log('test fails')
  })
  .option('-k, --api-key <key>', 'API key')
  .parse(process.argv)
