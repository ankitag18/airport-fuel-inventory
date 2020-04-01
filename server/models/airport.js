const db = require('../db');

const airportSchema = new db.Schema(
    {
        id: { type: Number, default: 0 },
        name: String,
        fuel_capacity: { type: Number, default: 0 },
    },
    {
        collection: 'airport'
    }

);

airportSchema.statics.getNextSequenceId = async function () {
    const dataObj = await this.findOne({}, { _id: 0, id: 1 }).sort({ id: -1 }).limit(1);
    const nextId = (((dataObj && dataObj.id) || 0) + 1);
    return nextId;
}

const Airport = db.model('Airport', airportSchema);

module.exports = Airport;