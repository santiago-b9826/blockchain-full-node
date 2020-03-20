const httpStatus = require('http-status');
const util = require('./util');

const post = async (req, res) => {
    const { transactions } = req.body;
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

const get = async (req, res) => {
    const result = await util.get();
    if (result) {
        return res
            .status(httpStatus.OK)
            .send({ chain: result });
    }
    else {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: 'Internal Error' });
    }
};

module.exports = {
    post,
    get
};
