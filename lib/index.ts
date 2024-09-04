function template_service(service_name: string, interface_name: string, value: string) {
  return `SERVICE_${service_name}_${interface_name}_${value}`.toUpperCase().replace(/-/g, "_");
}

function template_external_url(input_url: string) {
  return `EXTERNAL_URL_${input_url.toUpperCase().replace(/\./g, "_")}`;
}

function get_var(env_var: string) {
  const key = env_var;
  const val = process.env[key];
  if (val == null) {
    throw new Error(`Missing env var ${key}`);
  }
  return val;
}

const discovery = (service_name: string, interface_name: string) => ({
  proto() {
    return get_var(template_service(service_name, interface_name, "PROTO"));
  },

  host() {
    return get_var(template_service(service_name, interface_name, "HOST"));
  },

  port() {
    return get_var(template_service(service_name, interface_name, "PORT"));
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

const external_url = (input_url: string) => {
  return get_var(template_external_url(input_url));
};

type discoveryMethod = keyof ReturnType<typeof discovery>;
type externalUrlMethod = ReturnType<typeof external_url>;

export { discovery, external_url, discoveryMethod, externalUrlMethod };
