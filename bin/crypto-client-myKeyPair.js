const program = require('commander')
const storage = require('../lib/storage')
const crypto = require('../lib/crypto')

program
  .action(async (cmd) => {
    const keyPair = cmd.rotate ?
      await crypto.rotateKeyPair() : await crypto.myKeyPair()
    console.log(`Private key: ${keyPair.privateKey}`)
    console.log(`Public key: ${keyPair.publicKey}`)
  })
  .option('-r, --rotate', 'rotate key pair')
  .parse(process.argv)
