const mongoose = require('mongoose');

const Transaction = mongoose
    .model(
        'Transaction',
        {
            to: String,
            from: String,
            amount: Number,
            message: String,
            fee: Number
        });

module.exports = Transaction;