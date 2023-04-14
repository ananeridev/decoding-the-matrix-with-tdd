class Transaction {
    constructor({customer, reality, amount, dueDate}) {
        this.customer = customer
        this.reality = reality
        this.amount = amount
        this.dueDate = dueDate
    }
}

module.exports = Transaction