const db = require('../db');

const userSchema = new db.Schema(
    {
        id: { type: Number, default: 0 },
        name: String,
        email: String,
        password: String,
    },
    {
        collection: 'users'
    }

);

userSchema.statics.getNextSequenceId = async function () {
    const dataObj = await this.findOne({}, { _id: 0, id: 1 }).sort({ id: -1 }).limit(1);
    const nextId = (((dataObj && dataObj.id) || 0) + 1);
    return nextId;
}

const User = db.model('User', userSchema);

module.exports = User;