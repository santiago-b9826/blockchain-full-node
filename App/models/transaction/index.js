class Transaction {
    constructor(to, from, amount, message, phi) {
        this.to = to;
        this.from = from;
        this.amount = amount;
        this.message = message;
        this.phi = phi;
    }
}

module.exports = Transaction;