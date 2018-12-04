const program = require('commander')
const nacl = require('libsodium-wrappers')
const crypto = require('../lib/crypto')
const network = require('../lib/network')
const storage = require('../lib/storage')

program
  .action(async (plaintext, api, cmd) => {
    try {
      const apiPublicKey = await network.getPublicKey(api, 'encryption', cmd.apiKey)
      const nonce = nacl.randombytes_buf(nacl.crypto_box_NONCEBYTES)
      const ciphertext = await crypto.encrypt(plaintext, nonce, apiPublicKey)
      const keyPair = await crypto.myKeyPair()
      const myPublicKey = keyPair.publicKey
      const decipheredtext =
        await network.decrypt(
          ciphertext,
          nacl.to_base64(nonce),
          myPublicKey,
          api,
          cmd.apiKey
        )
      console.log(`${plaintext} decrypted as ${decipheredtext}`)
      if (plaintext == decipheredtext) {
        console.log('test succeeds')
        return
      }
    } catch(e) {
      console.log(`cannot decrypt: ${e.message}`)
      console.log(e.stack)
    }
    console.log('test fails')
  })
  .option('-k, --api-key <key>', 'API key')
  .parse(process.argv)
