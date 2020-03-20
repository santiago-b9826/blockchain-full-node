const mongoose = require('mongoose');

const Block = mongoose.model('Block',
    {
        header: Object,
        body: Object
    }
);

module.exports = Block;