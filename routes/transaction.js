const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const transactionController = require('../controllers/transaction');

const router = express.Router();

router.get('/');

router.post(
    '/add-points', 
    [
        body('userId')
            .custom((value, { req }) => {
                return User.findOne({ userId: value }).then(userDoc => {
                    if (userDoc) {
                        console.log('A User Does not exist')
                        return Promise.reject('A User does not exist.');
                    }
                });
            }),
        body('points')
            .isInt({ gt: 0 })
    ],
    transactionController.postAddToTransaction
);

router.post(
    '/deduct-points', 
    [
        body('userId')
            .custom((value, { req }) => {
                return User.findOne({ userId: value }).then(userDoc => {
                    if (userDoc) {
                        console.log('A User Does not exist')
                        return Promise.reject('A User does not exist.');
                    }
                });
            }),
        body('points')
            .isInt({ gt: 0 })
    ],
    transactionController.postDeductFromTransaction
);

module.exports = router;