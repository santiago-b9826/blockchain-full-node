
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

const mongoose = require('mongoose');
const cron = require('node-cron');

const TransactionClass = require('../models/transaction');
const Chain = require('../models/chain');
const { Transaction, User, Block } = require('../db/models');
const env = require('./environment.config');

const {
    TRANSACTIONS_PER_BLOCK,
    USER,
    TRANSACTION,
    BLOCK,
    DB_URI,
    MINE_PUBLIC_KEY,
    MINE_PRIVATE_KEY,
    MY_PUBLIC_KEY,
    MY_PRIVATE_KEY } = env;

let allTransactions = [];
let transactionsToBroadcast = [];
let errorTransactions = [];
let mininFlag = false;

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
            data = JSON.parse(data);
            switch (data.type) {
                case USER:
                    break;
                case TRANSACTION:
                    addP2PTransactions(data.transactions);
                    break;
                case BLOCK:
                    try {
                        throw new Error('Stop Everything!!, Another node has found the block');
                    } catch (e) {
                        const { _, chain } = new Chain();
                        chain.addSharedBlock(data.block);
                        console.log(e.message);
                    }
                    break;
                default:
                    break;
            }
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

const countPeers = () => {
    let counter = 0;
    for (let id in peers) {
        counter++;
    }
    return counter;
}

const addTransaction = (transaction) => {
    const { to, from, amount, message, fee } = transaction;
    const newTransaction = new TransactionClass(to, from, amount, message, fee);
    const isValid = validateTransaction(newTransaction);
    if (isValid) {
        allTransactions.push(newTransaction);
        transactionsToBroadcast.push(newTransaction);
    } else {
        errorTransactions.push(newTransaction)
    }
}

const addApiTransactions = (transactions) => {
    transactionsToBroadcast = [];
    errorTransactions = [];
    transactions.forEach(transaction => {
        addTransaction(transaction);
    });
    broadcast({ type: TRANSACTION, transactions: transactionsToBroadcast });
    if (allTransactions.length >= TRANSACTIONS_PER_BLOCK) {
        miningBlock(allTransactions, countPeers() + 2);
    }
    return errorTransactions;
}

const addP2PTransactions = (transactions) => {
    transactions.forEach(transaction => {
        const { to, from, amount, message, fee } = transaction;
        const newTransaction = new TransactionClass(to, from, amount, message, fee);
        allTransactions.push(newTransaction);
    });
}

const validateTransaction = (transaction) => {
    return true;
}

cron.schedule('*/1 * * * *', () => {
    if (mininFlag) {
        miningBlock(allTransactions, countPeers + 2);
    } else {
        mininFlag = true;
    }
});

const miningBlock = async (transactions) => {
    const dbTransactions = [];
    const { _, chain } = new Chain();
    const ownTransaction = new TransactionClass(MY_PUBLIC_KEY, MINE_PUBLIC_KEY, 5, 'Mining block', 0);
    transactions.unshift(ownTransaction);
    mininFlag = false;
    mongoose.connect(DB_URI, { useNewUrlParser: true });

    await chain.addBlock(transactions);

    const lastBlock = chain.lastBlock();
    const { header, body } = lastBlock
    const dbBlock = new Block({ header, body });
    await dbBlock.save();

    for (let index = 0; index < transactions.length; index++) {
        let transaction = transactions[index];
        const { to, from, amount, message, fee } = transaction;
        await User.updateOne(
            {
                publicKey: from,
            },
            {
                $inc: { balance: -amount }
            }
        );
        await User.updateOne(
            {
                publicKey: to,
            },
            {
                $inc: { balance: amount }
            }
        );
        dbTransactions.push(new Transaction({ to, from, amount, message, fee }));
    }

    await Transaction.create(dbTransactions);
    broadcast({ type: BLOCK, block: lastBlock });
    allTransactions = [];
    return lastBlock;
}

module.exports = {
    startP2P,
    broadcast,
    allTransactions,
    addApiTransactions,
    addP2PTransactions,
    miningBlock
}