class Transaction {
    constructor(to, from, amount, message, fee) {
        this.to = to;
        this.from = from;
        this.amount = amount;
        this.message = message;
        this.fee = fee;
    }
}

module.exports = Transaction;