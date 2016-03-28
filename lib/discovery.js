function template(service_name, interface_name, value) {
  return "SERVICE_" + service_name + "_" + interface_name + "_" + value;
};

function get_var(env_var) {
  env_var = env_var.toUpperCase().replace(/-/g, "_");
  var val = process.env[env_var];
  if (val == null) {
    throw new Error("Missing env var " + env_var);
  }
  return val;
};

module.exports = function(service_name, interface_name) {
  return {
    proto: function() {
      return get_var(template(service_name, interface_name, "PROTO"));
    },

    host: function() {
      return get_var(template(service_name, interface_name, "HOST"));
    },

    port: function() {
      return get_var(template(service_name, interface_name, "PORT"));
    },

    proto_host: function() {
      return (this.proto()) + "://" + (this.host());
    },

    host_port: function() {
      return (this.host()) + ":" + (this.port());
    },

    url: function() {
      return (this.proto()) + "://" + (this.host()) + ":" + (this.port());
    }
  };
};
