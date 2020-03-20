const { Router } = require('express');

const router = new Router();

const comunication = require('./components/comunication/route');
const users = require('./components/users/route');

router.use('/chain', comunication);
router.use('/users', users);

module.exports = router;
