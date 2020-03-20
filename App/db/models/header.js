const mongoose = require('mongoose');

// const Header = mongoose.model('Header',
//     {
//         previousHash: String,
//         difficulty: Number,
//         nonce: Number,
//         blockHash: String,
//         merkleRoot: String
//     }
// );

class Header {
    constructor(previousHash, difficulty, nonce, blockHash, merkleRoot) {
        this.previousHash = previousHash;
        this.difficulty = difficulty;
        this.nonce = nonce;
        this.blockHash = blockHash;
        this.merkleRoot = merkleRoot;
    }
}

module.exports = Header;