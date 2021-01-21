const User = require('../models/user');
const Transaction = require('../models/transaction');

exports.postUser = (req, res, next) => {
    const name = req.body.name;

    const user = new User({
        name: name
    });

    user
    .save()
    .then(result => {
        console.log('Created User');
        res.redirect('/')
    })
    .catch(err => {
        console.log(err);
    });
};
  

exports.getUsers = async (req, res, next) => {
    User
        .find()
        //.findOne({ _id: "6009f3d8019a22479cb21a5d"})
        .populate('Transaction')
        .then(user => {
            console.log(user)
        })
}