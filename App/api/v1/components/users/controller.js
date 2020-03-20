const httpStatus = require('http-status');
const util = require('./util');

const post = async (req, res) => {
    const { data } = req.body;
    const { created, publicKey, privateKey } = await util.post(data);
    if (created) {
        return res
            .status(httpStatus.OK)
            .send({
                keys: {
                    publicKey,
                    privateKey
                },
                message: 'User created successfully'
            });
    }
    else {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: 'User already exists' });
    }
};

const get = async (req, res) => {
    const { } = req.body;
    const result = await util.post(transactions);
    if (result.length === 0) {
        return res
            .status(httpStatus.OK)
            .send({ message: 'All transactions were processed' });
    }
    else if (result.length > 0) {
        return res
            .status(httpStatus.PARTIAL_CONTENT)
            .send({
                failed_transactions: result,
                message: 'Some transactions are not correct'
            });
    }
    else {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: 'Internal server error' });
    }
};

module.exports = {
    post,
    get
};
