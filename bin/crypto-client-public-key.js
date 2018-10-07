const program = require('commander')
const getPublicKey = require('../lib/network').getPublicKey

program
  .action(async (url, type, cmd) => {
    let key
    try {
      key = await getPublicKey(url, type, cmd.apiKey)
    } catch(e) {
    }
    if (key) console.log(key)
  })
  .option('-k, --api-key <key>', 'API key')
  .parse(process.argv)
