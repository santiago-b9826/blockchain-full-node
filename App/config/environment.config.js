const { getHash } = require('../services/hash');

const PRODUCTION = 'production';

if (process.env.NODE_ENV !== PRODUCTION) {
    require('dotenv').config();
}

const {
    NODE_ENV,
    APP_PROD_PORT,
    APP_DEV_PORT,
    PROD_MORGAN,
    DEV_MORGAN,
    CHANNEL_NAME,
    DB_USER,
    DB_PASS,
    DB_HOST,
    TRANSACTIONS_PER_BLOCK,
    MINE_PUBLIC_KEY,
    MINE_PRIVATE_KEY,
    MINE_TOTAL_CASH,
    MY_FAVORITE_BEER,
    MY_FAVORITE_SPORT,
    MY_FAVORITE_NUMBER
} = process.env;

const isProd = NODE_ENV === PRODUCTION ? true : false;
const PORT = isProd ? APP_PROD_PORT : APP_DEV_PORT;
const MORGAN_MODE = isProd ? PROD_MORGAN : DEV_MORGAN;
const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`;
const { USER, TRANSACTION, BLOCK } = { USER: 'user', TRANSACTION: 'transaction', BLOCK: 'block' };
const MY_PUBLIC_KEY = getHash(MY_FAVORITE_BEER.concat(MY_FAVORITE_SPORT, MY_FAVORITE_NUMBER));
const MY_PRIVATE_KEY = getHash(MY_PUBLIC_KEY);

module.exports = {
    PORT,
    CHANNEL_NAME,
    MORGAN_MODE,
    TRANSACTIONS_PER_BLOCK,
    DB_URI,
    USER,
    TRANSACTION,
    BLOCK,
    MINE_PUBLIC_KEY,
    MINE_PRIVATE_KEY,
    MINE_TOTAL_CASH,
    MY_PUBLIC_KEY,
    MY_PRIVATE_KEY
}
