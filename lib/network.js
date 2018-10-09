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
    const data = e.response.data
    const msg = data.message
    throw(new Error(`public ${type} key retrieval fails: ${(typeof msg === 'string')?msg:data}`))
  }
}

exports.decrypt = async (
  ciphertext,
  nonce,
  publickey,
  api,
  apiKey
) => {
  const config = {
    url: '/decrypt',
    method: 'post',
    baseURL: api,
    data: {
      ciphertext: ciphertext,
      nonce: nonce,
      publickey: publickey
    }
  }
  if (apiKey) config.headers = {
    'x-api-key': apiKey
  }
  try {
    const res = await axios.request(config)
    return res.data
  } catch(e) {
    const data = e.response.data
    const msg = data.message
    throw(new Error(`decryption API fails: ${(typeof msg === 'string')?msg:data}`))
  }
}

exports.sign = async (plaintext, api, apiKey) => {
  const config = {
    url: '/sign',
    method: 'post',
    baseURL: api,
    data: {
      message: plaintext
    }
  }
  if (apiKey) config.headers = {
    'x-api-key': apiKey
  }
  try {
    const res = await axios.request(config)
    return res.data
  } catch(e) {
    const data = e.response.data
    const msg = data.message
    throw(new Error(`signing API fails: ${(typeof msg === 'string')?msg:data}`))
  }
}
