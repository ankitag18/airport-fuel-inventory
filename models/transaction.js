const db = require('../db');

const transactionSchema = new db.Schema(
    {
        id: { type: Number, default: 0 },
        created_at: Number,
        type: String,//(IN / OUT - In case of reverse transation, change type from IN>OUT or OUT>IN )
        airport_id: Number,
        aircraft_id: Number, //(required in case of transaction_type = OUT)
        quantity: Number,
        parent_id: Number //(refer to the transaction_id required to be reversed)
    },
    {
        collection: 'transaction'
    }

);

transactionSchema.statics.getNextSequenceId = async function () {
    const dataObj = await this.findOne({}, { _id: 0, id: 1 }).sort({ id: -1 }).limit(1);
    const nextId = (((dataObj && dataObj.id) || 0) + 1);
    return nextId;
}

const Transaction = db.model('Transaction', transactionSchema);

module.exports = Transaction;