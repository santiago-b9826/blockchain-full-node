const express = require('express');
const { server, startP2P, env, connectDatabase } = require('./App/config');

const app = express();

startP2P(env.CHANNEL_NAME);
connectDatabase();
server(app);

app.listen(app.get('port'), () =>
    console.log(`Fullnode API is running on port ${app.get('port')}`)
);