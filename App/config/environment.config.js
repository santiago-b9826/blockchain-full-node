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
    DB_HOST
} = process.env;

const isProd = NODE_ENV === PRODUCTION ? true : false;
const PORT = isProd ? APP_PROD_PORT : APP_DEV_PORT;
const MORGAN_MODE = isProd ? PROD_MORGAN : DEV_MORGAN;
const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`;

module.exports = {
    PORT,
    CHANNEL_NAME,
    MORGAN_MODE
}
