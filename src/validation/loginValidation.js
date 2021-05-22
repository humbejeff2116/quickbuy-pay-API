
const { body, check } = require('express-validator');


const validation = [
    check('email').notEmpty().withMessage('email field is required'),
    check('email').isEmail().withMessage(' email field should contain a valid email'),
    check('password' ).notEmpty().withMessage('password field is required')
]
module.exports = validation; 
