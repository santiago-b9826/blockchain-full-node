const Block = require('../block');
const { getHash } = require('../../services/hash');
const { proofOfWork } = require('../../p2p-network/components/proof-of-work');
const MerkleTree = require('../merkle-tree');

const ZERO = '0';

class Chain {
    constructor() {
        if (Chain.instance) {
            return { alreadyExists: true, chain: Chain.instance };
        }

        Chain.instance = this;
        this.logicOrder = []
        this.last = '';
        return { alreadyExists: false, chain: this };
    }

    lastBlock() {
        return this.last;
    }

    async addBlock(transactions, nZeros = 3) {
        const merkleTree = new MerkleTree(transactions);
        const rootMerkleTree = merkleTree.getRoot();
        const header = {
            previousHash: this.lastBlock() !== '' ? getHash(this.lastBlock().header.hash + this.lastBlock().header.nonce) : ZERO.repeat(64),
            difficulty: nZeros,
            height: this.lastBlock() === '' ? 0 : this.lastBlock().header.height + 1,
            rootMerkleTree
        };
        const body = {
            transactions: transactions
        }

        const newBlock = new Block(header, body);
        const newBlockHash = getHash(JSON.stringify(newBlock));
        const nonce = await proofOfWork(newBlockHash, nZeros);
        newBlock.setHeader(null, nonce, newBlockHash, null, null);
        this.logicOrder.push(newBlock);
        this.last = newBlock;
    }

    rebuild(blocks) {
        blocks = blocks.sort((a, b) => parseInt(a.header.height) - parseInt(b.header.height));
        blocks.forEach((block) => {
            this.addSharedBlock(block);
        });
    }

    addSharedBlock(block) {
        const { header, body } = block;
        const newBlock = new Block(header, body);
        this.logicOrder.push(newBlock);
        this.last = newBlock;
    }

    get() {
        return this.logicOrder;
    }
}

module.exports = Chain;