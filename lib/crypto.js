const nacl = require('libsodium-wrappers')
const storage = require('../lib/storage')

const generateAndStoreKeyPair = async () => {
  await nacl.ready
  const kp = nacl.crypto_box_keypair()
  const base64PrKey = nacl.to_base64(kp.privateKey)
  const base64PuKey = nacl.to_base64(kp.publicKey)
  keyPair = {
    privateKey: base64PrKey,
    publicKey: base64PuKey
  }
  storage.storeKeyPair(keyPair)
  return keyPair
}

exports.myKeyPair = async () => {
    let keyPair = await storage.retrieveKeyPair()
    if (!Boolean(keyPair) || !keyPair.privateKey || !keyPair.privateKey) {
      keyPair = generateAndStoreKeyPair()
    }
    return keyPair
}

exports.rotateKeyPair = async () => {
  return await generateAndStoreKeyPair()
}

exports.encrypt = async (plaintext, nonce, theirPublicKey) => {
  await nacl.ready
  try {
    const keyPair = await storage.retrieveKeyPair()
    const mySecretKey = nacl.from_base64(keyPair.privateKey)
    return nacl.to_base64(
      nacl.crypto_box_easy(
        plaintext,
        nonce,
        nacl.from_base64(theirPublicKey),
        mySecretKey
      ))
  } catch(e) {
    console.log(e)
    throw (new Error(`encryption fails: ${e.message}`))
  }
}
