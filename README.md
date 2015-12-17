# discovery-node

Programmatically find services (like [discovery-go](https://github.com/Clever/discovery-go), but for node). This library currently is just an abstraction around reading environment variables used for dependent services.


## API

- disc = **discovery**(\<service\>, \<interface\>)
  - disc.**proto**() - returns the service protocol
  - disc.**host**() - returns the hostname or ip
  - disc.**port**() - returns the port
  - disc.**host_port**() - returns (\<host\>:\<port\>)
  - disc.**proto_host**() - returns (\<proto\>://\<host\>)
  - disc.**url**() - returns the url (\<proto\>://\<host\>:\<port\>)

### install and import

```bash
npm install --save @clever/discovery
```

```coffee
discovery = require "@clever/discovery"
```

### examples

```coffee
disc_gearman = discovery("gearman-admin", "http")
try gearman_url = disc_gearman.url() catch err then cb(err)


disc_redis = discovery("redis", "tcp")
try redis_host = disc_redis.host() catch err then cb(err)
try redis_port = disc_redis.port() catch err then cb(err)
```


### Environment Variables

This library looks up environment variables (eventually maybe not). For it to work, your environment variables need to adhere to the following convention:

SERVICE\_\<SERVICE_NAME\>\_\<PROTOCOL\>\_\<PROTO|HOST|PORT\>

Here is an example using redis:
```bash
SERVICE_REDIS_TCP_PROTO = "tcp"
SERVICE_REDIS_TCP_HOST = "localhost"
SERVICE_REDIS_TCP_PORT = "6379"
```
