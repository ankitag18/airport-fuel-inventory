const db = require('mongoose');

db.connect('mongodb://127.0.0.1:27017/inventory', { useNewUrlParser: true });

const connection = db.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

connection.on('open', () => {
    console.log('Connection Successfull');
});

module.exports = db;