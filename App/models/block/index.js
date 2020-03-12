class Block {
    constructor(header, body) {
        this.header = header;
        this.body = body;
    }

    setHeader(previousHash, nonce, hash, difficulty) {
        this.header.previousHash = previousHash || this.header.previousHash;
        this.header.nonce = nonce || this.header.nonce;
        this.header.hash = hash || this.header.hash;
        this.header.difficulty = difficulty || this.header.difficulty;
    }
}

module.exports = Block;