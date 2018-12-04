const program = require('commander')
const crypto = require('../lib/crypto')
const network = require('../lib/network')

program
  .action(async (plaintext, api, cmd) => {
    try {
      const apiPublicKey = await network.getPublicKey(api, 'signing', cmd.apiKey)
      const signedtext = await network.sign(plaintext, api, cmd.apiKey)
      const recoveredPlaintext = await crypto.verify(signedtext, apiPublicKey)
      console.log(`${recoveredPlaintext} was signed`)
      if (recoveredPlaintext == plaintext) {
        console.log('test succeeds')
        return
      }
    } catch(e) {
      console.log(e.message)
      console.log(e.stack)
    }
    console.log('test fails')
  })
  .option('-k, --api-key <key>', 'API key')
  .parse(process.argv)
