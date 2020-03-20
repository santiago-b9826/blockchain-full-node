const mongoose = require('mongoose');

const User = mongoose.model('User', { publicKey: String, privateKey: String, balance: Number });

module.exports = User;