const { Router } = require('express');

const router = new Router();

const comunication = require('./components/comunication/route');

router.use('/transaction', comunication);

module.exports = router;
