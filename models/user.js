const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: 
        {
            type: String,
            required: true
        },
        transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        }
        ],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema)