const { serverConfig } = require('./server.config');
const { startP2P, broadcast } = require('./p2p.config');

module.exports = {
    server: serverConfig,
    startP2P,
    broadcast,
    env: require('./environment.config')
}