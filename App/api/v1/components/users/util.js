const mongoose = require('mongoose');

const { DB_URI } = require('../../../../config/environment.config');
const { getKeys } = require('../../../../services/account');
const { User } = require('../../../../db/models');

const post = async (data) => {
    let { beer, sport, number } = data;
    beer = beer.toLowerCase();
    sport = sport.toLowerCase();
    const { publicKey, privateKey } = await getKeys(beer, sport, number);

    mongoose.connect(DB_URI, { useNewUrlParser: true });
    const response = await User.find({ publicKey: publicKey });

    if (response.length === 0) {
        const newUser = new User({ publicKey: publicKey, privateKey: privateKey, balance: 0 });
        await newUser.save();
        return { created: true, publicKey, privateKey };
    }
    return { created: false };

}

module.exports = {
    post
}