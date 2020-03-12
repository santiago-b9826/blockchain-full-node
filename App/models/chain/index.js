const Block = require('../block');
const { getHash } = require('../../services/hash/util');
const { proofOfWork } = require('../../p2p-network/components/proof-of-work');

const ZERO = '0';

class Chain {
    constructor() {
        if (Chain.instance) {
            return { alreadyExists: true, chain: Chain.instance };
        }

        Chain.instance = this;
        this.last = '';
        return { alreadyExists: false, chain: this };
    }

    lastBlock() {
        return this.last;
    }

    async addBlock(transactions, nZeros = 1) {
        const header = {
            previousHash: this.lastBlock() !== '' ? getHash(this.lastBlock().header.hash + this.lastBlock().header.nonce) : ZERO.repeat(64),
            difficulty: nZeros
        };
        const body = {
            transactions: transactions
        }

        const newBlock = new Block(header, body);
        const newBlockHash = getHash(JSON.stringify(newBlock));
        const nonce = await proofOfWork(newBlockHash, nZeros);
        newBlock.setHeader(null, nonce, newBlockHash, null);
        this.last = newBlock;
    }
}

module.exports = Chain;