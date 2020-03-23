const UserModel = require('../models/user');
const AirportModel = require('../models/airport');
const AircraftModel = require('../models/aircraft');
const TransactionModel = require('../models/transaction');
const async = require('async');

module.exports = function (app) {

    app.get('/', (req, res) => {
        res.render('login', { error: '' });
    });

    app.post('/login', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        UserModel.findOne({ email, password }).then((result) => {
            if (result) {
                res.redirect('/airport/list');
            }

            res.render('login', { error: 'Invalid email or password' });
        }).catch((err) => {
            res.json(err.message);
        });
    });

    app.get('/airport/list', (req, res) => {
        AirportModel.find({}).sort({ name: 1 }).then((result) => {
            res.render('airport', { result });
        }).catch((err) => {
            res.json(err.message);
        });
    });

    app.post('/airport/add', (req, res) => {
        const name = req.body.name;
        const fuel_capacity = req.body.fuel_capacity;

        AirportModel.getNextSequenceId(function (dataId) {
            return dataId;
        }).then((dataId) => {

            AirportModel.create({ id: dataId, name, fuel_capacity }).then((result) => {
                res.redirect('/airport/list');
            }).catch((err) => {
                res.json(err.message);
            });

        }).catch((err) => {
            res.json(err.message);
        });

    });

    app.get('/aircraft/list', (req, res) => {
        AircraftModel.find({}).sort({ flight_no: 1 }).then((result) => {
            res.render('aircraft', { result });
        }).catch((err) => {
            res.json(err.message);
        });
    });

    app.post('/aircraft/add', (req, res) => {
        const airline = req.body.airline;
        const flight_no = req.body.flight_no;
        const source = req.body.source;
        const destination = req.body.destination;

        AircraftModel.getNextSequenceId(function (dataId) {
            return dataId;
        }).then((dataId) => {

            AircraftModel.create({ id: dataId, airline, flight_no, source, destination }).then((result) => {
                res.redirect('/aircraft/list');
            }).catch((err) => {
                res.json(err.message);
            });

        }).catch((err) => {
            res.json(err.message);
        });
    });

    app.get('/transaction/list', (req, res) => {

        async.parallel({
            airports: function (callback) {
                AirportModel.find({}).exec((error, response) => {
                    callback(null, response)
                })
            },
            aircrafts: function (callback) {
                AircraftModel.find({}).exec((error, response) => {
                    callback(null, response)
                })
            },
            transactions: function (callback) {
                TransactionModel.aggregate([
                    {
                        $lookup: {
                            from: 'airport',
                            localField: 'airport_id',
                            foreignField: 'id',
                            as: 'airport',
                        },
                    },
                    {
                        $unwind: {
                            path: "$airport",
                            preserveNullAndEmptyArrays: true
                        }
                    },

                    {
                        $lookup: {
                            from: 'aircraft',
                            localField: 'aircraft_id',
                            foreignField: 'id',
                            as: 'aircraft',
                        },
                    },
                    {
                        $unwind: {
                            path: "$aircraft",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: "$id",
                            id: { $first: "$id" },
                            airport_name: { $first: "$airport.name" },
                            airline_name: { $first: "$aircraft.airline" },
                            quantity: { $first: "$quantity" },
                            trans_type: { $first: "$trans_type" },
                            created_at: { $first: "$created_at" },
                            parent_transaction: { $first: "$parent_id" },
                        }
                    },
                    { $sort: { created_at: -1 } },

                ]).then((response) => {

                    const transactionData = response.map((item) => {
                        item['transaction_date'] = new Date(item.created_at).toLocaleString();
                        return item;
                    });

                    callback(null, transactionData)
                }).catch((err) => {
                    res.json(err.message);
                });
            }
        }, function (error, results) {
            if (error) {
                throw error;
            }

            res.render('transaction', { transactions: results.transactions, airports: results.airports, aircrafts: results.aircrafts });
        });

    });

    app.post('/transaction/add', (req, res) => {
        const airport_id = req.body.airport;
        const aircraft_id = req.body.aircraft;
        const trans_type = req.body.trans_type;
        const quantity = req.body.quantity;
        const parent_id = req.body.transaction;
        const created_at = new Date().getTime();

        TransactionModel.getNextSequenceId(function (dataId) {
            return dataId;
        }).then((dataId) => {

            TransactionModel.create({
                id: dataId, airport_id, aircraft_id, trans_type, quantity, parent_id, created_at
            }).then((result) => {
                res.redirect('/transaction/list');
            }).catch((err) => {
                res.json(err.message);
            });

        }).catch((err) => {
            res.json(err.message);
        });
    });

    app.get('/reports', (req, res) => {
        async.parallel({
            fuelAvailabilityData: function (callback) {
                TransactionModel.aggregate([
                    {
                        $lookup: {
                            from: 'airport',
                            localField: 'airport_id',
                            foreignField: 'id',
                            as: 'airport',
                        },
                    },
                    {
                        $group: {
                            _id: "$airport.id",
                            name: { $first: "$airport.name" },
                            total_fuel_in: {
                                $sum:
                                {
                                    $cond: [
                                        { $eq: ["$trans_type", 'IN'] },
                                        "$quantity",
                                        0
                                    ]
                                }
                            },
                            total_fuel_out: {
                                $sum:
                                {
                                    $cond: [
                                        { $eq: ["$trans_type", 'OUT'] },
                                        "$quantity",
                                        0
                                    ]
                                }
                            },
                        }
                    },
                    {
                        $addFields: {
                            fuel_available: { $subtract: ["$total_fuel_in", "$total_fuel_out"] }
                        }
                    }
                ]).then((response) => {
                    callback(null, response)
                })
            },
            fuelConsumptionData: function (callback) {
                TransactionModel.aggregate([
                    {
                        $lookup: {
                            from: 'airport',
                            localField: 'airport_id',
                            foreignField: 'id',
                            as: 'airport',
                        },
                    },
                    {
                        $unwind: {
                            path: "$airport",
                            preserveNullAndEmptyArrays: true
                        }
                    },

                    {
                        $lookup: {
                            from: 'aircraft',
                            localField: 'aircraft_id',
                            foreignField: 'id',
                            as: 'aircraft',
                        },
                    },
                    {
                        $unwind: {
                            path: "$aircraft",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: "$id",
                            id: { $first: "$id" },
                            airport_id: { $first: "$airport.id" },
                            airport_name: { $first: "$airport.name" },
                            airline_no: { $first: "$aircraft.flight_no" },
                            quantity: { $first: "$quantity" },
                            trans_type: { $first: "$trans_type" },
                            created_at: { $first: "$created_at" },
                            parent_transaction: { $first: "$parent_id" },
                        }
                    },
                    { $sort: { 'airport_id': 1, created_at: 1 } },
                ]).then((response) => {
                    const fuelAvailablePerTransaction = {};

                    const transactionData = response.map((item) => {
                        item['transaction_date'] = new Date(item.created_at).toLocaleString();

                        if (item.airport_id in fuelAvailablePerTransaction) {
                            const airportTransactions = fuelAvailablePerTransaction[item.airport_id];
                            const currentQuantity = airportTransactions[airportTransactions.length - 1].quantity;

                            if (item.trans_type == 'IN') {
                                fuelAvailablePerTransaction[item.airport_id].push({ transaction_id: item.id, quantity: Number(currentQuantity) + Number(item.quantity) });
                            } else if (item.trans_type == 'OUT') {
                                fuelAvailablePerTransaction[item.airport_id].push({ transaction_id: item.id, quantity: Number(currentQuantity) - Number(item.quantity) });
                            }

                        } else {
                            fuelAvailablePerTransaction[item.airport_id] = [];
                            fuelAvailablePerTransaction[item.airport_id].push({ transaction_id: item.id, quantity: item.quantity });
                        }

                        return item;
                    });

                    callback(null, { transactionData, fuelAvailablePerTransaction });
                })
            }
        }, function (error, results) {
            if (error) {
                throw error;
            }

            res.render('report', { fuelAvailabilityData: results.fuelAvailabilityData, fuelConsumptionData: results.fuelConsumptionData.transactionData, fuelAvailablePerTransaction: results.fuelConsumptionData.fuelAvailablePerTransaction });
        });

    });

}