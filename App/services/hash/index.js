const sha256 = require('js-sha256');

/**
 * Returns the hash of a String.
 * @param {String} data 
 */
const getHash = (data) => {
    const hash = sha256.create();
    hash.update(data);
    return hash.hex();
}

module.exports = {
    getHash
}