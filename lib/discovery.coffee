# Value is one of: PROTO, HOST, PORT
template = (service_name, interface_name, value) ->
  return "SERVICE_#{service_name}_#{interface_name}_#{value}"

get_var = (env_var) ->
  env_var = env_var.toUpperCase().replace /-/g, "_"
  val = process.env[env_var]

  if not val?
    throw new Error "Missing env var #{env_var}"

  return val

module.exports = (service_name, interface_name) ->
  proto: -> get_var(template(service_name, interface_name, "PROTO"))

  host: -> get_var(template(service_name, interface_name, "HOST"))

  port: -> get_var(template(service_name, interface_name, "PORT"))

  proto_host: -> "#{@proto()}://#{@host()}"

  host_port: -> "#{@host()}:#{@port()}"

  url: -> "#{@proto()}://#{@host()}:#{@port()}"
