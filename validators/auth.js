const { check } = require('express-validator')

exports.userSignupValidator = [
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is required'),

    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

];

exports.userLoginValidator = [

    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is required'),

];

