const Router = require('express').Router;

const apiv1 = require('./api/v1/route')

let router = new Router();

router.use('/api/v1', apiv1);

module.exports = router;