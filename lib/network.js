const axios = require('axios')

exports.getPublicKey = async (api, type, apiKey) => {
  const config = {
    url: `/publickey?type=${type}`,
    method: 'get',
    baseURL: api
  }
  if (apiKey) config.headers = {
    'x-api-key': apiKey
  }
  try {
    const res = await axios.request(config)
    return res.data
  } catch(e) {
    console.log(`public key could not be retrieved: \
request failed with status ${e.response.status}\
, ${e.response.statusText}`)
    throw(e)
  }
}

exports.decrypt = async (ciphertext, api, apiKey) => {
  const config = {
    url: '/decrypt',
    method: 'post',
    baseURL: api,
    data: {
      ciphertext: ciphertext
    }
  }
  if (apiKey) config.headers = {
    'x-api-key': apiKey
  }
  try {
    const res = await axios.request(config)
    return res.data
  } catch(e) {
    console.log(`plaintext could not be retrieved: \
request failed with status ${e.response.status}\
, ${e.response.statusText}`)
    throw(e)
  }
}
