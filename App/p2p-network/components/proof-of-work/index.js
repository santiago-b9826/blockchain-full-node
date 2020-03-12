const { getHash } = require('../../../services/hash/util');

/**
 * Get proof of work for a given hash (data) and network difficulty (nZeros)
 * @param {String} data 
 * @param {Int} nZeros 
 */
const proofOfWork = async (data, nZeros) => {
    const ZERO = '0';
    let dataHash;
    let response;
    for (let index = 0; true; index++) {
        response = await getHash(data + index);
        dataHash = response;
        if (String(dataHash).substring(0, nZeros) === ZERO.repeat(nZeros)) {
            return index;
        }
    }
}

module.exports = {
    proofOfWork
}