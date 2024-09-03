import * as assert from "assert";
import { discovery, external_url } from "../lib/index";

const pairs = {
  SERVICE_REDIS_TCP_PROTO: "tcp",
  SERVICE_REDIS_TCP_HOST: "redis.com",
  SERVICE_REDIS_TCP_PORT: "6379",
  SERVICE_GOOGLE_API_PROTO: "https",
  SERVICE_GOOGLE_API_HOST: "api.google.com",
  SERVICE_GOOGLE_API_PORT: "80",
  SERVICE_LONG_APP_NAME_API_HOST: "arbitrary",
  SERVICE_MISSING_PROTO_API_HOST: "missingproto.host",
  SERVICE_MISSING_PROTO_API_PORT: "5000",
  SERVICE_MISSING_HOST_API_PROTO: "missinghost.proto",
  SERVICE_MISSING_HOST_API_PORT: "5000",
  SERVICE_MISSING_PORT_API_PROTO: "missingport.proto",
  SERVICE_MISSING_PORT_API_HOST: "example.com",
  SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_PORT: "8000",
  EXTERNAL_URL_CLEVER_COM: "https://clever.com:443",
  EXTERNAL_URL_API_CLEVER_COM: "https://api.clever.com:443",
};

describe("discovery", () => {
  beforeAll(() => {
    for (const name of Object.keys(pairs)) {
      const value = pairs[name as keyof typeof pairs];
      process.env[name] = value;
    }
  });
  it("test redis tcp discovery", () => {
    const expected_proto = "tcp";
    const expected_host = "redis.com";
    const expected_port = "6379";
    const expected_url = `${expected_proto}://${expected_host}:${expected_port}`;
    const expected_proto_host = `${expected_proto}://${expected_host}`;
    const expected_host_port = `${expected_host}:${expected_port}`;
    const disc = discovery("redis", "tcp");
    assert.equal(disc.proto(), expected_proto);
    assert.equal(disc.host(), expected_host);
    assert.equal(disc.port(), expected_port);
    assert.equal(disc.url(), expected_url);
    assert.equal(disc.proto_host(), expected_proto_host);
    return assert.equal(disc.host_port(), expected_host_port);
  });
  it("test google https discovery", () => {
    const expected_proto = "https";
    const expected_host = "api.google.com";
    const expected_port = "80";
    const expected_url = `${expected_proto}://${expected_host}:${expected_port}`;
    const expected_proto_host = `${expected_proto}://${expected_host}`;
    const expected_host_port = `${expected_host}:${expected_port}`;
    const disc = discovery("google", "api");
    assert.equal(disc.proto(), expected_proto);
    assert.equal(disc.host(), expected_host);
    assert.equal(disc.port(), expected_port);
    assert.equal(disc.url(), expected_url);
    assert.equal(disc.proto_host(), expected_proto_host);
    return assert.equal(disc.host_port(), expected_host_port);
  });
  it("test long arbitrary name with dashes", () => {
    const disc = discovery("long-app-name", "api");
    assert.equal(disc.host(), "arbitrary");
    assert.throws(() => disc.proto(), /Missing env var SERVICE_LONG_APP_NAME_API_PROTO/);
    assert.throws(() => disc.port(), /Missing env var SERVICE_LONG_APP_NAME_API_PORT/);
    assert.throws(() => disc.proto_host(), /Missing env var SERVICE_LONG_APP_NAME_API_PROTO/);
    assert.throws(() => disc.host_port(), /Missing env var SERVICE_LONG_APP_NAME_API_PORT/);
    assert.throws(() => disc.url(), /Missing env var SERVICE_LONG_APP_NAME_API_[\w]+/);
  });
  it("test expect error on missing proto", () => {
    const disc = discovery("missing-proto", "api");
    assert.equal(disc.host(), "missingproto.host");
    assert.equal(disc.port(), "5000");
    assert.equal(disc.host_port(), "missingproto.host:5000");
    const expected_error = /Missing env var SERVICE_MISSING_PROTO_API_PROTO/;
    assert.throws(() => disc.proto(), expected_error);
    assert.throws(() => disc.proto_host(), expected_error);
    assert.throws(() => disc.url(), expected_error);
  });
  it("test expect error on missing host", () => {
    const disc = discovery("missing-host", "api");
    assert.equal(disc.proto(), "missinghost.proto");
    assert.equal(disc.port(), "5000");
    const expected_error = /Missing env var SERVICE_MISSING_HOST_API_HOST/;
    assert.throws(() => disc.host(), expected_error);
    assert.throws(() => disc.proto_host(), expected_error);
    assert.throws(() => disc.host_port(), expected_error);
    assert.throws(() => disc.url(), expected_error);
  });
  it("test expect error on missing port", () => {
    const disc = discovery("missing-port", "api");
    assert.equal(disc.proto(), "missingport.proto");
    assert.equal(disc.host(), "example.com");
    assert.equal(disc.proto_host(), "missingport.proto://example.com");
    const expected_error = /Missing env var SERVICE_MISSING_PORT_API_PORT/;
    assert.throws(() => disc.port(), expected_error);
    assert.throws(() => disc.host_port(), expected_error);
    assert.throws(() => disc.url(), expected_error);
  });
  it("test external url", () => {
    // const disc = external_url("clever.com");
    assert.equal(external_url("clever.com"), "https://clever.com:443");
  });
  it("test complex external url", () => {
    // const disc = external_url("api.clever.com");
    assert.equal(external_url("api.clever.com"), "https://api.clever.com:443");
  });
  return it("test expect error on missing two vars", () => {
    const disc = discovery("missing-proto-and-host", "foobar");
    assert.equal(disc.port(), "8000");
    assert.throws(
      () => disc.proto(),
      /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_PROTO/,
    );
    assert.throws(() => disc.host(), /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_HOST/);
    assert.throws(
      () => disc.proto_host(),
      /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_[\w]+/,
    );
    assert.throws(
      () => disc.host_port(),
      /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_HOST/,
    );
    assert.throws(() => disc.url(), /Missing env var SERVICE_MISSING_PROTO_AND_HOST_FOOBAR_[\w]+/);
  });
});
