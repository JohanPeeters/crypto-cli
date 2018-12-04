# crypto-assignment-check

This is a CLI utility for testing the crypto REST API students at EhB are building as an assignment for their software security course.

## Install

```sh
$ npm install -g crypto-assignment-check
```
If you are using the Docker image, you can skip this step.

## Usage

The CLI command is `crypto-client`. There is a subcommand for each endpoint of the APIs under test.

For help

```sh
$ crypto-client help
Usage: crypto-client [options] [command]

Options:
  -v, --version                    output the version number
  -h, --help                       output usage information

Commands:
  public-key <api> <type>          get the public <type> key. <type> is encryption or signing
  verify-decrypt <msg> <api>       locally encrypt <msg> asymmetrically and request <api>/decrypt to decrypt
  verify-sign <msg> <api>          request signature on <msg> at <api>/sign to sign
  verify-password-hash <pw> <api>  request the Argon2 hash of <pw> for storage
  help [cmd]                       display help for [cmd]
```

or, with Docker

```
$ docker run yopeeters/crypto-cli:v1.4.1 help
```

All subcommands options and arguments need to be appended to the Docker command-line prefix `docker run yopeeters/crypto-cli`.

## Test specifications

What does `crypto-client` test?

### `verify-decrypt`

The `msg` parameter is encrypted with the libsodium `crypto_box_easy` function and sent in a POST request to `<api>/decrypt` base64 encoded. If the endpoint returns `msg`, the test succeeds. Otherwise it fails.

The body of the POST request sent by `verify-decrypt` is a JSON object with a `ciphertext` field. For example:
```sh
{
  "ciphertext": "xg5mUtoF1y-f5Xv57IqEHBcKhLB9",
  "nonce": "fbEc-UEAXDBg3rZ4lpzcJppVis1NfQuy",
  "publickey": "YX2k2EpoLhF6PxfyT6-oa7ulH8g6YGDSqnXfErU003M"
}
```

Note that all binary data is base64 encoded so that it can be transported via the network. In other words, all the request data field values are the result of calling the `to_base64` libsodium function on the respective binary data with the default variant: URLSAFE_NO_PADDING.

### `verify-sign`

The `msg` parameter is sent to `<api>/sign`. The test succeeds if libsodium's `crypto_sign_open` succeeds.

The body of the POST request sent by `verify-sign` is a JSON object with a `message` field. For example:
```sh
{
  "message": "hello"
}
```

A digital signature is binary. The test tool expects it in base64, URLSAFE_NO_PADDING variant, encoded format.

### `verify-password-hash`

The `pw` parameter is sent to `<api>/pwhash-str`. The test succeeds if libsodium's `crypto_verify_pwhash_str` succeeds.

The body of the POST request sent by `verify-password-hash` is a JSON object with a `pw` field. For example:
```sh
{
  "pw": "hello"
}
```

The test tool expects the response in base64, URLSAFE_NO_PADDING variant, encoded format.

### `public-key`

`crypto_box_easy` and `crypto_sign_open` respectively make use of the public encryption key and the public verification key of the API under test. So, in order for the 2 above tests to succeed, these have to be made available, which can be verified with the `public-key` command.

Public keys are binary, meaning that they can contain any sequence of bits. As such, they may not be suitable for transport across a network in their raw form and hence need to be encoded. This test tool assumes that the API returns them base64 encoded. In other words, it calls libsodium `from_base64` on the retrieved keys with the default variant - URLSAFE_NO_PADDING. Note that if public keys are returned in another format, this will cause `verify-` subcommands to fail as they attempt to decode with the URLSAFE_NO_PADDING variant.
