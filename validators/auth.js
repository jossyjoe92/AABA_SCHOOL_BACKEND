const {check} = require('express-validator')

exports.userSignupValidator  = [
    check('firstname')
        .not()
        .isEmpty()
        .withMessage('Firstname is required'),
        check('lastname')
        .not()
        .isEmpty()
        .withMessage('Lastname is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6})
        .withMessage('Password must be at least 6 characters long'),
    check('phone')
        .isLength({ min: 11})
        .withMessage('invalid phone number')

];

exports.userLoginValidator  = [
  
    check('password')
        .isLength({ min: 6})
        .withMessage('Password must be at least 6 characters long'),
    check('phone')
        .isLength({ min: 11})
        .withMessage('invalid phone number')

]