const UserModel = require('../models/user');
const AirportModel = require('../models/airport');
const AircraftModel = require('../models/aircraft');
const TransactionModel = require('../models/transaction');

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
        const fuel_available = req.body.fuel_available;

        AirportModel.getNextSequenceId(function (dataId) {
            return dataId;
        }).then((dataId) => {

            AirportModel.create({ id: dataId, name, fuel_available, fuel_capacity }).then((result) => {
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

}