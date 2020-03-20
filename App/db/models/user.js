const mongoose = require('mongoose');

const User = mongoose.model('User', { publicKey: String, privateKey: String });

module.exports = User;