const nacl = require('libsodium-wrappers')
const storage = require('../lib/storage')

const fromBase64 = async (encoded) => {
  await nacl.ready
  const original = (encoded.includes('+') || encoded.includes('/'))?true:false
  const padding = encoded.endsWith('=')?true:false
  let variant
  if (original)
    variant = padding?nacl.base64_variants.ORIGINAL:nacl.base64_variants.ORIGINAL_NO_PADDING
  else
    variant = padding?nacl.base64_variants.URLSAFE:nacl.base64_variants.URLSAFE_NO_PADDING
  if (variant != nacl.base64_variants.URLSAFE_NO_PADDING) {
    console.log(`receiving data encoded in wrong base64 variant - only URLSAFE without padding is supported`)
    throw new Error(`cannot decode ${encoded}`)
  }
  return nacl.from_base64(encoded, variant)
}

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
  let key
  try {
    key = await fromBase64(theirPublicKey)
  } catch(e) {
    console.log(e)
    throw (new Error(`verification signature fails: ${e.message}`))
  }
  try {
    const keyPair = await this.myKeyPair()
    const mySecretKey = await fromBase64(keyPair.privateKey)
    return nacl.to_base64(
      nacl.crypto_box_easy(
        plaintext,
        nonce,
        key,
        mySecretKey
      ))
  } catch(e) {
    console.log(e)
    throw (new Error(`encryption fails: ${e.message}`))
  }
}

exports.verify = async (signedMessage, verifyingKey) => {
  await nacl.ready
  let key
  try {
    key = await fromBase64(verifyingKey)
  } catch(e) {
    console.log(e)
    throw (new Error(`verification signature fails: ${e.message}`))
  }
  try {
    let msg = await fromBase64(signedMessage)
//    let msg = await nacl.from_hex(signedMessage)
    return nacl.to_string(nacl.crypto_sign_open(
      msg,
      key
    ))
  } catch(e) {
    console.log(`${verifyingKey} is a ${verifyingKey.constructor.name}`)
    console.log(e)
    throw (new Error(`verification signature fails: ${e.message}`))
  }
}

exports.pwhash_str_verify = async (pwhash_str, password) => {
  await nacl.ready
  try {
    return nacl.crypto_pwhash_str_verify(
      pwhash_str,
      password
    )
  } catch(e) {
    console.log(e)
    throw (new Error(`verification signature fails: ${e.message}`))
  }
}
