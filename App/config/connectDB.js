const {
    DB_URI,
    MINE_PUBLIC_KEY,
    MINE_PRIVATE_KEY,
    MINE_TOTAL_CASH,
    MY_PUBLIC_KEY,
    MY_PRIVATE_KEY
} = require('./environment.config');
const { Block, User } = require('../db/models');
const { miningBlock } = require('../config/p2p.config');
const Chain = require('../models/chain');

const mongoose = require('mongoose');

const connectDatabase = async () => {
    mongoose.connect(DB_URI, { useNewUrlParser: true });
    const { _, chain } = new Chain();
    const blocks = await Block.find();
    await createAccounts();
    if (blocks.length === 0) {
        miningBlock([]);
    } else {
        chain.rebuild(blocks);
    }
}

const createAccounts = async () => {
    let users = await User.find({ publicKey: MINE_PUBLIC_KEY });
    if (users.length === 0) {
        const MINE = new User({ publicKey: MINE_PUBLIC_KEY, privateKey: MINE_PRIVATE_KEY, balance: MINE_TOTAL_CASH });
        await MINE.save();
    }
    users = await User.find({ publicKey: MY_PUBLIC_KEY });
    if (users.length === 0) {
        const me = new User({ publicKey: MY_PUBLIC_KEY, privateKey: MY_PRIVATE_KEY, balance: 0 });
        await me.save();
    }
}

module.exports = {
    connectDatabase
}