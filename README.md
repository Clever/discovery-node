# discovery-node

This library programmatically finds endpoints for dependencies. Similar to [discovery-go](https://github.com/Clever/discovery-go) and [discovery-python](https://github.com/Clever/discovery-python).

See [Service Discovery](https://github.com/Clever/infra-docs/blob/master/deploy/service_discovery.md) for more details.

## API

- disc = **discovery**(\<service\>, \<interface\>)
  - disc.**proto**() - returns the service protocol
  - disc.**host**() - returns the hostname or ip
  - disc.**port**() - returns the port
  - disc.**host_port**() - returns (\<host\>:\<port\>)
  - disc.**proto_host**() - returns (\<proto\>://\<host\>)
  - disc.**url**() - returns the url (\<proto\>://\<host\>:\<port\>)

### Install and import

```bash
npm install --save clever-discovery
```

```coffee
discovery = require "clever-discovery"
```

### Examples

```coffee
disc_gearman = discovery("gearman-admin", "http")
try gearman_url = disc_gearman.url() catch err then cb(err)

disc_systemic = discovery("systemic", "thrift")
try systemic_host = disc_systemic.host() catch err then cb(err)
try systemic_port = disc_systemic.port() catch err then cb(err)
```

To see what interfaces a Clever service exposes, check its launch yaml. You should see one or more exposes listed, and the `name` of the expose is used as the `interface` value in the discovery client.
