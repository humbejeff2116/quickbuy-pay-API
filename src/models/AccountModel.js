






const mongoose = require('mongoose');


const AccountSchema =  mongoose.Schema({
    AccountEmail:{type: String, required: true},
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountBalance: { type: Number, default: 0.00, required: false },
    createdAt: { type: Date , default: Date.now },
});

AccountSchema.statics.getAccountByAccountNumber = function(accountNumber) {
    let account = this.findOne({accountNumber});
    return account;
}

AccountSchema.methods.setDetails = function(accountName, accountEmail, accountNumber) {
    this.accountName = accountName;
    this.accountNumber = accountNumber;
    this.accountEmail = accountEmail;
}
AccountSchema.methods.getDetails = function() {

   return `${this.accountName} ${this.accountNumber}`;

}
AccountSchema.methods.deposit =  function(amount, callback) {
    if (amount < 1) {
        let err = new Error("invalid amount");
        return callback(err, null);
    }
    this.accountBalance += amount;
    let message = `${amount} has been deposited successfully`
    return callback(null, message);
}

AccountSchema.methods.withdraw = function(amount, callback) {
    if (amount < 1) {
        let err = new Error("invalid amount entered");
        return callback(err, null);
    }
    if (amount > this.accountBalance) {
        let err = new Error("insufficient funds");
        return callback(err, null);
    }
    this.accountBalance -= amount;
    let message = `${amount} has been withdrawn successfully`
    return callback(null, message);
}
AccountSchema.methods.receive = function(amount) {
    this.accountBalance += amount; 
}
AccountSchema.methods.transfer = function(amount, Account, callback) {
    if (amount < 1) {
        let err = new Error("invalid amount");
        return callback(err, null);
    }
    if (amount > this.accountBalance) {
        let err = new Error("insufficient funds");
        return callback(err, null);
    }
    Account.receive(amount);
    this.accountBalance -= amount;
    let message = `${amount} has been transfered successfully`
    return callback(null, message);
}
AccountSchema.methods.checkBalance = function() {
    return `balance is ${this.accountBalance}`
}

const Account = mongoose.model('accounts',AccountSchema);
module.exports = Account;

