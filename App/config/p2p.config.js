
/**
*   This code implements a peer to peer connection in a LAN.
*   
*   \author: Santiago Bedoya (2020)
* 
*  Disclaimer: this implementation was partialy based on this code:
*  https://medium.com/@carloslfu/make-a-p2p-connection-in-10-minutes-57d9559fd1c  
*
*/

const crypto = require('crypto');
const getPort = require('get-port');
const Swarm = require('discovery-swarm');
const defaults = require('dat-swarm-defaults');

/**
 * Here we will save our TCP peer connections
 * using the peer id as key: { peer_id: TCP_Connection }
 */
const peers = {};

// Counter for connections, used for identify connections
let connSeq = 0;

// Peer Identity, a random hash for identify your peer
const myId = crypto.randomBytes(32);

/** 
 * Default DNS and DHT servers
 * This servers are used for peer discovery and establishing connection
 */
const config = defaults({
    id: myId
});

/**
 * discovery-swarm library establishes a TCP p2p connection and uses
 * discovery-channel library for peer discovery
 */
const sw = Swarm(config);

const startP2P = async (channelName) => {
    console.log(`Welcome to ${channelName}`);
    // Choose a random unused port for listening TCP peer connections
    const port = await getPort();
    sw.listen(port);

    console.log(`P2P network is listening on port ${port}`);

    /**
     * The channel we are connecting to.
     * Peers should discover other peers in this channel
     */
    sw.join(channelName);

    sw.on('connection', (conn, info) => {
        // Connection id
        const seq = connSeq;
        const peerId = info.id.toString('hex');

        conn.on('data', data => {
            console.log(JSON.parse(data));
        });

        /**
         * Here we handle Peer disconnection
         * If the closing connection is the last connection with the peer, removes the peer
         */
        conn.on('close', () => {
            if (peers[peerId].seq === seq) {
                delete peers[peerId];
            }
        });

        /**
         * Save the connection 
         */
        if (!peers[peerId]) {
            peers[peerId] = {};
        }
        peers[peerId].conn = conn;
        peers[peerId].seq = seq;
        connSeq++;
    });
};

/**
 * Makes a broadcast the data to all connected peers
 * @param {JSON} data 
 */
const broadcast = (data) => {
    for (let id in peers) {
        peers[id].conn.write(JSON.stringify(data));
    }
};

module.exports = {
    startP2P,
    broadcast
}