# crypto-assignment-check

This is a CLI utility for testing the crypto REST API students at EhB are building as an assignment for their software security course.

## Install

```sh
$ npm install crypto-assignment-check
```

## Usage

The CLI command is `crypto-client`. There is a subcommand for each endpoint of the APIs under test and an additional one for managing the keys of the test client.

For help

```sh
$ crypto-client help
```

## Test specifications

What does `crypto-client` test?

### `verify-decrypt`

The `msg` parameter is encrypted with the libsodium `crypto_box_easy` function and sent in a POST request to `<api>/decrypt` base64 encoded. If the endpoint returns `msg`, the test succeeds. Otherwise it fails.

The body of the POST request sent by `verify-decrypt` is a JSON object with a `ciphertext` field. For example:
```sh
{
  "ciphertext": "xg5mUtoF1y+f5Xv57IqEHBcKhLB9",
  "nonce": "fbEc+UEAXDBg3rZ4lpzcJppVis1NfQuy",
  "publickey": "YX2k2EpoLhF6PxfyT6+oa7ulH8g6YGDSqnXfErU003M"
}
```

Note that all binary data is base64 encoded so that it can be transported via the network. In other words, all have the request data field values are the result of calling libsodium `to_base64` on the respective binary data.

### `verify-sign`

The `msg` parameter is sent to `<api>/sign`. The test succeeds if libsodium's `crypto_sign_open` succeeds.

The body of the POST request sent by `verify-sign` is a JSON object with a `message` field. For example:
```sh
{
  "message": "hello"
}
```

A digital signature is binary. The test tool expects it in base64 encoded format.

### `verify-password-hash`

The `pw` parameter is sent to `<api>/pwhash-str`. The test succeeds if libsodium's `crypto_verify_pwhash_str` succeeds.

The body of the POST request sent by `verify-password-hash` is a JSON object with a `pw` field. For example:
```sh
{
  "pw": "hello"
}
```

### `public-key`

`crypto_box_easy` and `crypto_sign_open` respectively make use of the public encryption key and the public verification key of the API under test. So, in order for the 2 above tests to succeed, these have to be made available, which can be verified with the `public-key` command.

Public keys are binary, meaning that they can contain any sequence of bits. As such, they may not be suitable for transport across a network in their raw form and hence need to be encoded. This test tool assumes that the API returns them base64 encoded. In other words, it calls libsodium `from_base64` on the retrieved keys.
