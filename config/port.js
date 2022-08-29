const port_app = process.env.ENV_PRODUCTION == 'true' ? process.env.ENV_SYSTEM_PORT_HTTP_PRODUCTION : process.env.ENV_SYSTEM_PORT_HTTP_DEVELOPMENT;
const port_app_ssl = process.env.ENV_PRODUCTION == 'true' ? process.env.ENV_SYSTEM_PORT_HTTPS_PRODUCTION : process.env.ENV_SYSTEM_PORT_HTTPS_DEVELOPMENT;

module.exports = {
    port_app,
    port_app_ssl
}