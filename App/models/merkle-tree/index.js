const { getHash } = require('../../services/hash');

class MerkleTree {
    constructor(transactions) {
        this.leaves = transactions;
    }

    buildTree(hashArray) {
        let parentArray = [];
        let aux;
        const arrayLength = hashArray.length;
        if (arrayLength === 1) {
            return hashArray[0];
        }
        for (let index = 0; index < arrayLength; index += 2) {
            if (index === arrayLength - 1) {
                aux = getHash(hashArray[index]);
            } else {
                aux = getHash(hashArray[index].concat(hashArray[index + 1]))
            }
            parentArray.push(aux);
        }
        return this.buildTree(parentArray);
    }

    getLeaves() {
        return this.leaves;
    }

    getRoot() {
        const hashLeaves = this.leaves.map(leaf => {
            return getHash(JSON.stringify(leaf));
        });
        this.root = this.buildTree(hashLeaves);
        return this.root;
    }
}

module.exports = MerkleTree;