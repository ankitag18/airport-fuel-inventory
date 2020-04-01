const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const api = require('./controllers/api');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: '123456', saveUninitialized: true, resave: true }));

/* Call api resources */
api(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started successfully on port: ${PORT}`);
});