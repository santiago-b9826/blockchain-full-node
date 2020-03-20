const mongoose = require('mongoose');

const { DB_URI_SHELL, DB_REPLACE_STRING } = require('./environment.config');
const { Information } = require('../db/models');

const DB_INFO_NAME = 'info';

const create = async () => {
    const connectionString = DB_URI_SHELL.replace(DB_REPLACE_STRING, DB_INFO_NAME);
    mongoose.connect(connectionString, { useNewUrlParser: true });
    const response = await Information.find({});
    const dbLength = response.length;
    if (dbLength === 0) {
        const info = new Information({ numberOfChains: 0, dbNames: [] });
        await info.save();
    }
    mongoose.disconnect();
}

create();
