import { URL } from "url";

function template(service_name: string, interface_name: string, value: string) {
  return `SERVICE_${service_name}_${interface_name}_${value}`;
}

function get_var(env_var: string) {
  const key = env_var.toUpperCase().replace(/-/g, "_");
  const val = process.env[key];
  if (val == null) {
    throw new Error(`Missing env var ${key}`);
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

const external_url = (input_url: string) => {
  const key = `EXTERNAL_URL_${input_url.toUpperCase().replace(".", "_")}`;
  const val = process.env[key];
  if (val == null) {
    throw new Error(`Missing env var ${key}`);
  }
  return new URL(val).toString();
};

export default discovery;
export { external_url };
