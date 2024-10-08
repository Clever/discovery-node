# discovery-node

This library programmatically finds endpoints for dependencies. Similar to [discovery-go](https://github.com/Clever/discovery-go) and [discovery-python](https://github.com/Clever/discovery-python).

See [Service Discovery](https://clever.atlassian.net/wiki/spaces/ENG/pages/116686857/Discovery) for more details.

## API

- disc = **discovery**(\<service\>, \<interface\>)
  - disc.**proto**() - returns the service protocol
  - disc.**host**() - returns the hostname or ip
  - disc.**port**() - returns the port
  - disc.**host_port**() - returns (\<host\>:\<port\>)
  - disc.**proto_host**() - returns (\<proto\>://\<host\>)
  - disc.**url**() - returns the url (\<proto\>://\<host\>:\<port\>)

- external_url(\<url\>) - returns the external url to use

### Install and import

```bash
npm install --save clever-discovery
```

```node
import { discovery, external_url } from "clever-discovery"
```

### Examples

```node
disc_gearman = discovery("gearman-admin", "http")
try gearman_url = disc_gearman.url() catch err then cb(err)

disc_systemic = discovery("systemic", "thrift")
try systemic_host = disc_systemic.host() catch err then cb(err)
try systemic_port = disc_systemic.port() catch err then cb(err)

try clever_com_url = external_url("clever.com") catch err then cb(err)
```

To see what interfaces a Clever service exposes, check its launch yaml. You should see one or more exposes listed, and the `name` of the expose is used as the `interface` value in the discovery client.
