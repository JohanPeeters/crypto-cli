const storage = require('node-persist')

exports.storeKeyPair = async (keyPair) => {
  await storage.init()
  storage.setItem('keyPair', keyPair)
}

exports.retrieveKeyPair = async () => {
  await storage.init()
  return await storage.getItem('keyPair')
}

exports.removeKeyPair = async () => {
  await storage.init()
  storage.removeItem('keyPair')
}
