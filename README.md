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

The `msg` parameter is encrypted with the libsodium `crypto_box_easy` function and sent to `<api>/decrypt` base64 encoded. If the endpoint returns `msg`, the test succeeds. Otherwise it fails.

### `verify-sign`

The `msg` parameter is sent to `<api>/sign`. The test succeeds if libsodium's `crypto_sign_open` succeeds.

### `public-key`

`crypto_box_easy` and `crypto_sign_open` respectively make use of the public encryption key and the public verification key of the API under test. So, in order for the 2 above tests to succeed, these have to be made available, which can be verified with the `public-key` command.
