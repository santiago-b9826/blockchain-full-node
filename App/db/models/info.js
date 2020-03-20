const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InformationSchema = new Schema({
    numberOfChains: {
        type: Number,
        required: true
    },
    dbNames: {
        type: Array,
        required: true
    }
});

const Information = mongoose.model('Information', InformationSchema);

module.exports = Information;