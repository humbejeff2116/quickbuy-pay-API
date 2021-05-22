
const {body, check  } = require('express-validator');


const validation = [
    check('firstname').notEmpty().withMessage('Firstname is required*'),
    check('lastname').notEmpty().withMessage('Lastname is required*'),
    check('email').notEmpty().withMessage('Email is required*'),
    check('email').isEmail().withMessage('Please enter a valid email*'),
    check('phonenumber').isMobilePhone().withMessage('Please enter a valid phone number*'),
    check('password' )
    .custom((value, {req})=> {
        if(!value) {
            throw new Error('Password is required*');
        }
        if(value !== req.body.password2) {
          throw new Error('Password confirmation is incorrect*');
        }   
        return value;
    }),
    check('password').isLength({ min: 4 }).withMessage( 'password should be at least 4 characters*' )
]
module.exports = validation; 
