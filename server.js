const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const api = require('./controllers/api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use('/css', express.static(path.join(__dirname, 'public/css')));

/* Call api resources */
api(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started successfully on port: ${PORT}`);
});