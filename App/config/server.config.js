const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('../routes');
const { PORT, MORGAN_MODE } = require('./environment.config');

const serverConfig = (app) => {
    app.set('port', PORT);
    app.use(cors());
    app.options('*', cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(morgan(MORGAN_MODE));
    app.use('/', routes);

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
}

module.exports = {
    serverConfig
}