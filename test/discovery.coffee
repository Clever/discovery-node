assert = require 'assert'
discovery = require "#{__dirname}/../index"

pairs =
  "SERVICE_REDIS_TCP_PROTO": "tcp"
  "SERVICE_REDIS_TCP_HOST": "redis.com"
  "SERVICE_REDIS_TCP_PORT": "6379"

  "SERVICE_GOOGLE_API_PROTO": "https"
  "SERVICE_GOOGLE_API_HOST": "api.google.com"
  "SERVICE_GOOGLE_API_PORT": "80"

  "SERVICE_LONG_APP_NAME_API_HOST": "arbitrary"

  "SERVICE_MISSING_PROTO_API_HOST": "missingproto.host"
  "SERVICE_MISSING_PROTO_API_PORT": "5000"

  "SERVICE_MISSING_HOST_API_PROTO": "missinghost.proto"
  "SERVICE_MISSING_HOST_API_PORT": "5000"

  "SERVICE_MISSING_PORT_API_PROTO": "missingport.proto"
  "SERVICE_MISSING_PORT_API_HOST": "example.com"

  "SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_PORT": "8000"

describe 'discovery', ->

  before () ->
    for name, value of pairs
      process.env[name] = value

  it 'test redis tcp discovery', ->
    expected_proto = "tcp"
    expected_host = "redis.com"
    expected_port = "6379"
    expected_url = "#{expected_proto}://#{expected_host}:#{expected_port}"
    expected_proto_host = "#{expected_proto}://#{expected_host}"
    expected_host_port = "#{expected_host}:#{expected_port}"

    disc = discovery("redis", "tcp")

    assert.equal disc.proto(), expected_proto
    assert.equal disc.host(), expected_host
    assert.equal disc.port(), expected_port
    assert.equal disc.url(), expected_url
    assert.equal disc.proto_host(), expected_proto_host
    assert.equal disc.host_port(), expected_host_port

  it 'test google https discovery', ->
    expected_proto = "https"
    expected_host = "api.google.com"
    expected_port = "80"
    expected_url = "#{expected_proto}://#{expected_host}:#{expected_port}"
    expected_proto_host = "#{expected_proto}://#{expected_host}"
    expected_host_port = "#{expected_host}:#{expected_port}"

    disc = discovery("google", "api")

    assert.equal disc.proto(), expected_proto
    assert.equal disc.host(), expected_host
    assert.equal disc.port(), expected_port
    assert.equal disc.url(), expected_url
    assert.equal disc.proto_host(), expected_proto_host
    assert.equal disc.host_port(), expected_host_port

  it 'test long arbitrary name with dashes', ->
    disc = discovery("long-app-name", "api")

    assert.equal disc.host(), "arbitrary"

    # proto and port are not defined for long-app-name
    assert.throws (-> disc.proto()), /Missing env var SERVICE_LONG_APP_NAME_API_PROTO/
    assert.throws (-> disc.port()), /Missing env var SERVICE_LONG_APP_NAME_API_PORT/
    assert.throws (-> disc.proto_host()), /Missing env var SERVICE_LONG_APP_NAME_API_PROTO/
    assert.throws (-> disc.host_port()), /Missing env var SERVICE_LONG_APP_NAME_API_PORT/

    # url should fail on missing proto first, but this can change,
    # so check for a missing env var generally.
    assert.throws (-> disc.url()), /Missing env var SERVICE_LONG_APP_NAME_API_[\w]+/

  it 'test expect error on missing proto', ->
    disc = discovery("missing-proto", "api")

    assert.equal disc.host(), "missingproto.host"
    assert.equal disc.port(), "5000"
    assert.equal disc.host_port(), "missingproto.host:5000"

    expected_error = /Missing env var SERVICE_MISSING_PROTO_API_PROTO/

    assert.throws (-> disc.proto()), expected_error
    assert.throws (-> disc.proto_host()), expected_error
    assert.throws (-> disc.url()), expected_error

  it 'test expect error on missing host', ->
    disc = discovery("missing-host", "api")

    assert.equal disc.proto(), "missinghost.proto"
    assert.equal disc.port(), "5000"

    expected_error = /Missing env var SERVICE_MISSING_HOST_API_HOST/

    assert.throws (-> disc.host()), expected_error
    assert.throws (-> disc.proto_host()), expected_error
    assert.throws (-> disc.host_port()), expected_error
    assert.throws (-> disc.url()), expected_error

  it 'test expect error on missing port', ->
    disc = discovery("missing-port", "api")

    assert.equal disc.proto(), "missingport.proto"
    assert.equal disc.host(), "example.com"
    assert.equal disc.proto_host(), "missingport.proto://example.com"

    expected_error = /Missing env var SERVICE_MISSING_PORT_API_PORT/

    assert.throws (-> disc.port()), expected_error
    assert.throws (-> disc.host_port()), expected_error
    assert.throws (-> disc.url()), expected_error

  it 'test expect error on missing two vars', ->
    disc = discovery("missing-proto-and-host", "foobar")

    assert.equal disc.port(), "8000"

    assert.throws (-> disc.proto()), /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_PROTO/
    assert.throws (->disc.host()), /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_HOST/
    assert.throws (->disc.proto_host()), /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_[\w]+/
    assert.throws (->disc.host_port()), /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_HOST/
    assert.throws (-> disc.url()), /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_[\w]+/
