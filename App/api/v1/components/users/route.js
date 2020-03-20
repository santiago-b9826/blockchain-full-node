const Router = require('express').Router;

const { get, post } = require('./controller');

let router = new Router();

router.route('/')
    .get((...args) => get(...args));

router.route('/')
    .post((...args) => post(...args));

module.exports = router;