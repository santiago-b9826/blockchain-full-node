const { serverConfig } = require('./server.config');
const { connectDatabase } = require('./connectDB');
const {
    startP2P,
    broadcast,
    allTransactions,
    addApiTransactions,
    addP2PTransactions
} = require('./p2p.config');

module.exports = {
    server: serverConfig,
    startP2P,
    broadcast,
    allTransactions,
    addApiTransactions,
    addP2PTransactions,
    connectDatabase,
    env: require('./environment.config')
}