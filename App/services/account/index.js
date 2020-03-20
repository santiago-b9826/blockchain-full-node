const { getHash } = require('../hash');

const getKeys = async (beer, sport, number) => {
    const publicKey = await getHash(beer.concat(sport, number));
    const privateKey = await getHash(publicKey);
    return { publicKey, privateKey }
}

module.exports = {
    getKeys
}