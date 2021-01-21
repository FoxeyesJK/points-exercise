const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        userId: 
        { 
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true 
        },
        payer: String,
        points: 
        { 
            type: Number, 
            reqruied: true 
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Transaction', transactionSchema)