function template(service_name: string, interface_name: string, value: string) {
  return `SERVICE_${service_name}_${interface_name}_${value}`;
}

function get_var(env_var: string) {
  env_var = env_var.toUpperCase().replace(/-/g, "_");
  const val = process.env[env_var];
  if (val == null) {
    throw new Error(`Missing env var ${env_var}`);
  }
  return val;
}

const discovery = (service_name: string, interface_name: string) => ({
  proto() {
    return get_var(template(service_name, interface_name, "PROTO"));
  },

  host() {
    return get_var(template(service_name, interface_name, "HOST"));
  },

  port() {
    return get_var(template(service_name, interface_name, "PORT"));
  },

  proto_host() {
    return `${this.proto()}://${this.host()}`;
  },

  host_port() {
    return `${this.host()}:${this.port()}`;
  },

  url() {
    return `${this.proto()}://${this.host()}:${this.port()}`;
  },
});

// eslint-disable-next-line no-redeclare
namespace discovery {
  export type Method = keyof ReturnType<typeof discovery>;
}

export = discovery;
