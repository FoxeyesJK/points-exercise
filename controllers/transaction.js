const e = require('express');
const { validationResult } = require('express-validator');

const Transaction = require('../models/transaction');
const User = require('../models/user');

exports.postAddToTransaction = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    console.log('postTransactionsCalled')
    const userId = req.body.userId;
    const payer = req.body.payer;
    const points = req.body.points;

    const transaction = new Transaction({
        userId: userId,
        payer: payer,
        points: points
    });

    try {
        const trans = await transaction.save()
        
        res.status(200).json({
            message: 'Success',
            data: setTransactionLog(trans.payer, trans.points)
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
  

exports.postDeductFromTransaction = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const userId = req.body.userId;
    const deductPoints = req.body.points;

    try {
        const transactionsLog = [];
        const transactions = await Transaction.find({ 'userId': userId }).sort('createdAt');
        removeAndUpdateTransaction(transactions, deductPoints, transactionsLog);
            res.status(200).json({
            message: 'Success',
            data: transactionsLog
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            }
            next(err);
    }
};

const setTransactionLog = (payer, points) => {
    return `[${payer}, ${points} points, ${new Date().toString()}]`
}

const removeAndUpdateTransaction = (transactions = [], totalDeductPoints = 0, transactionsLog = []) => {
for (let transaction of transactions) {
    let deductPoints = 0;

    if(totalDeductPoints <= 0)
        return;

    if (transaction.points <= totalDeductPoints) {
        deductPoints = transaction.points;
        Transaction.findById(transaction._id)
        .then(transaction => {
            return transaction.remove(); 
        })
    } else {
        deductPoints = transaction.points - totalDeductPoints;
        Transaction.findById(transaction._id)
        .then(transaction => {
            transaction.points = deductPoints;
            return transaction.save(); 
        })
    }

    transactionsLog.push(setTransactionLog(transaction.payer, deductPoints));
    totalDeductPoints -= transaction.points;
}

if(totalDeductPoints > 0)
    transactionsLog.push(`[Remaining ${totalDeductPoints} points cannot be deducted - Not enough balance]`);
}
