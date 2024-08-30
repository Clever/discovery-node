function template_service(service_name: string, interface_name?: string, value?: string) {
  if (interface_name === undefined || interface_name === "") {
    throw new Error("interface_name is required");
  }

  if (value === undefined || value === "") {
    throw new Error("value is required");
  }

  return `SERVICE_${service_name}_${interface_name}_${value}`;
}

function template_external(url: string) {
  return `EXTERNAL_URL_${url.toUpperCase().replace(/\./g, "_")}`;
}

function get_var(env_var: string) {
  env_var = env_var.toUpperCase().replace(/-/g, "_");
  const val = process.env[env_var];
  if (val == null) {
    throw new Error(`Missing env var ${env_var}`);
  }
  return val;
}

const discovery = (service_name_or_url: string, interface_name?: string) => ({
  proto() {
    return get_var(template_service(service_name_or_url, interface_name, "PROTO"));
  },

  host() {
    return get_var(template_service(service_name_or_url, interface_name, "HOST"));
  },

  port() {
    return get_var(template_service(service_name_or_url, interface_name, "PORT"));
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

  external_url() {
    if (interface_name !== undefined && interface_name !== "") {
      throw new Error("interface_name should not be provided");
    }
    return get_var(template_external(service_name_or_url));
  },
});

// eslint-disable-next-line no-redeclare
namespace discovery {
  export type Method = keyof ReturnType<typeof discovery>;
}

export = discovery;
