






const express = require('express');
const multer = require('multer');
const upload1 = multer({dest: 'public/uploads/users'});
const signupValidation = require('../validation/signupValidation');
const loginValidation = require('../validation/loginValidation');
const usersController = require('../controllers/userController');
const accountController = require('../controllers/AccountController');
const jwtMiddleware = require('../Auth/jwtAuth');
let router = express.Router();


router.post('signup', upload1.single('profileimage'), signupValidation, usersController.signUp);
router.post('/login', loginValidation, usersController.userLogin);
router.post('/authenticate', jwtMiddleware, usersController.authenticate);
router.post('/openAccount', accountController.openAccount);
router.get('/account', jwtMiddleware, accountController.getAccount);
router.post('/deposit', jwtMiddleware, accountController.deposit);
router.post('withdraw', jwtMiddleware, accountController.withdraw);
router.post('/transfer', jwtMiddleware, accountController.transfer);
router.post('/checkBalance', jwtMiddleware, accountController.checkBalance);

module.exports = router;
