const program = require('commander')
const crypto = require('../lib/crypto')
const network = require('../lib/network')

program
  .action(async (plaintext, api, cmd) => {
    try {
      const apiPublicKey = await network.getPublicKey(api, 'signing', cmd.apiKey)
      const signedtext = await network.sign(plaintext, api, cmd.apiKey)
      if (crypto.verify(plaintext, signedtext)) {
        console.log('test succeeds')
        return
      }
    } catch(e) {
      console.log(e)
    }
    console.log('test fails')
  })
  .option('-k, --api-key <key>', 'API key')
  .parse(process.argv)
