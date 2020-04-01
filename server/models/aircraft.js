const db = require('../db');

const aircraftSchema = new db.Schema(
    {
        id: { type: Number, default: 0 },
        flight_no: String,
        airline: String,
        source: String,
        destination: String,
    },
    {
        collection: 'aircraft'
    }

);

aircraftSchema.statics.getNextSequenceId = async function () {
    const dataObj = await this.findOne({}, { _id: 0, id: 1 }).sort({ id: -1 }).limit(1);
    const nextId = (((dataObj && dataObj.id) || 0) + 1);
    return nextId;
}

const Aircraft = db.model('Aircraft', aircraftSchema);

module.exports = Aircraft;