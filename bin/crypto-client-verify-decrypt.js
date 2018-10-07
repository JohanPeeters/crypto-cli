const program = require('commander')
const crypto = require('../lib/crypto')
const network = require('../lib/network')

program
  .action(async (plaintext, api, cmd) => {
    let apiPublicKey
    try {
      apiPublicKey = await network.getPublicKey(api, cmd.apiKey)
    } catch(e) {
      throw('no public key')
    }
    const ciphertext = await crypto.encrypt(plaintext, apiPublicKey)
    console.log(`plaintext "${plaintext}" encrypts to "${ciphertext}"`)
    let decipheredtext
    try {
      decipheredtext = await network.decrypt(ciphertext, api, cmd.apiKey)
      console.log(`API decrypts "${ciphertext}" as "${decipheredtext}"`)
      if (plaintext == decipheredtext) {
        console.log('test succeeds')
        return
      }
    } catch(e) {
      console.log('decryption service did not return')
    }
    console.log('test fails')
  })
  .option('-k, --api-key <key>', 'API key')
  .parse(process.argv)
