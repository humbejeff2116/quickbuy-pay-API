const { body, check } = require('express-validator');


const validation = [
    check('subemail').notEmpty().withMessage('email field is required'),
    check('subemail').isEmail().withMessage(' email field should contain a valid email'),
]
module.exports = validation; 
