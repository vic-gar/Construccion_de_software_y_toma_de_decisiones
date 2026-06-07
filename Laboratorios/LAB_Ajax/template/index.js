const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const log = console.log;

const productsRoutes = require('./routes/products.routes');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(productsRoutes);

app.listen(3000, () => {
    log('Server listening to port 3000');
});