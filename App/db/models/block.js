const mongoose = require('mongoose');

const Header = require('./header');

const Block = mongoose.model('Block',
    {
        header: Object,
        body: Array
    }
);

module.exports = Block;