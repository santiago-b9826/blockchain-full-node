const { addApiTransactions } = require('../../../../config/p2p.config');
const Chain = require('../../../../models/chain');

const post = async (transactions) => {
    return addApiTransactions(transactions);
}

const get = async = () => {
    const { _, chain } = new Chain();
    return chain.get();
}

module.exports = {
    post,
    get
}