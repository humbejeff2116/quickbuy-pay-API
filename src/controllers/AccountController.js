








const Account = require('../models/AccountModel');
const User = require('../models/userModel');



function Bank() {
    // TODO generate unique ten digit numbers for account Number
    let accountNumber = 0
    async function getlastAccountNumber() {
        const accounts = await Account.find({});
        const lastIssuedNumber = accounts[accounts.length -1];
        accountNumber =lastIssuedNumber.accountNumber;
    }
    function checkIfAccountExist(account, res) {  
        if (!account) {
            console.error("account does not exist");
            let errMessage = "Account does not exist";
            res.json({status:401, error:true, ErroroMessage: errMessage});
            return res.status(401);
        }
    }

    this.openAccount = async function(req, res) {
        const accountName = req.body.name
        const accountEmail = req.body.email;
        checkIfAccountWithEmailExist();
        createAccount();
        function checkIfAccountWithEmailExist() {
            const account = await Account.findOne({ accountEmail: accountEmail });           
            if (account) {
                res.json({status:400, message:' Email has already been used on this site'});
                return res.status(400);
            }
        }
        function createAccount() {
            const bankAccount = await new Account();
            await bankAccount.setDetails(accountName, accountEmail, ++accountNumber);
            await bankAccount.save()
            .then(data => {
                let accountDetails = data.map(details => {
                    return ({
                        accountName: details.accountName,
                        accountEmail: details.accountName,
                        accountNumber:details.accountNumber,
                        accountBalance: details.accountBalance
                    })
                })
                res.status(201).json({ status: 201, accountDetails, message: 'Account created sucessfully' });
            })
            .catch(err => {
                console.error(err.stack);             
                res.json({ status: 500, message: 'An error occured while creating account' });
                res.status(500);
            });
        }
    }

    this.getAccount = async function(req, res) {
        const accountName = req.body.name
        const accountEmail = req.body.email;
        checkIfAccountWithEmailExist();
        function checkIfAccountWithEmailExist() {
            const account = await Account.findOne({ accountEmail: accountEmail });           
            if (account) {
                const accountDetails = {
                    accountName: account.accountName,
                    accountEmail: account.accountEmail,
                    accountBalance: account.accountBalance
                }
                res.json({status:201, accountDetails, error: false});
                return res.status(201);
            }
            res.json({status:401, error: true, message:'account does not exist'});
            return res.status(401);
        }
    }

    this.deposit = async function(req, res) {
        const accountNumber = req.body.accountNumber;
        const amount = parseFloat( req.body.amount);
        const account = await Account.getAccountByAccountNumber(accountNumber);
        checkIfAccountExist(account, res);
        depositMoney(amount);

        function depositMoney(amount) {
            if (account) {
                //TODO... call external API to recieve sum and deposit in account
                account.deposit(amount.toFixed(2), function(err,message) {
                    if (err) {
                        console.error(err);                  
                        res.json({status:401,error:true,message: err});
                        return res.status(401);
                    }
                    account.save();            
                    res.json( {status:201 ,error:false, message: message });
                    return res.status(401);           
                });
            }  
        }  
    }

    this.withdraw = async function(req, res) {
        const accountNumber = req.body.accountNumber
        const amount = parseFloat(req.body.amount);
        const account = await Account.getAccountByAccountNumber(accountNumber);
        checkIfAccountExist(account, res);
        withdrawMoney(amount);
        function withdrawMoney(amount) {
                account.withdraw(amount.toFixed(2), function(err, message) {
                    if (err) {
                        console.error(err);                  
                        res.json({status:401,error:true,message: err});
                        return res.status(401);
                    }
                    account.save();            
                    res.json( {status:201 ,error:false, message: message });
                    return res.status(401);           
                });
           
        }
    }

    this.transfer = async function(req, res) {
        const accountNumber = req.body.accountNumber;
        const transferAccountNumber = req.body.transferAccountNumber;
        const amount = parseFloat( req.body.amount);
        const senderAccount = await Account.getAccountByAccountNumber(accountNumber);
        const recieverAccount =  await Account.getAccountByAccountNumber(transferAccountNumber);
        checkSenderAccount(accountNumber);
        checkRecieverAccount(transferAccountNumber);
        transferMoney(amount);

        function checkSenderAccount() { 
            if (!senderAccount) {
                console.error("account does not exist");
                let errMessage = "Account does not exist";
                res.json({status:401, error:true, ErroroMessage: errMessage});
                return res.status(401);
            }
        }

        function checkRecieverAccount() {      
            if (!recieverAccount) {
                console.error(" recievers account does not exist");
                let errMessage = "recievers Account does not exist";
                res.json({status:401, error:true, ErroroMessage: errMessage});
                return res.status(401);
            }
        }

        function transferMoney(amount) {
                senderAccount.transfer(amount.toFixed(2), recieverAccount, function(err, message) {
                    if (err) {
                        console.error(err);                  
                        res.json({status:401, error: true, message: err});
                        return res.status(401);
                    }
                   await senderAccount.save(); 
                   await recieverAccount.save();           
                    res.json( {status:201, error: false, message: message });
                    return res.status(401); 
                });   
        }    
    }

    this.checkBalance = async function(req, res) {
        const accountNumber = req.body.accountNumber;
        const account = await Account.getAccountByAccountNumber(accountNumber);
        checkIfAccountExist(account, res);
        checkBalance(account);
        function checkBalance(account) {
         const accountBalance = account.checkBalance();
         res.json({status:201, error: false,accountBalance});
         return res.status(201);
        }
    }
}
module.exports = new Bank()