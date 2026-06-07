const express     = require('express');
const path        = require('path');
const fs          = require('fs');
const app         = express();

const bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const rutasPrincipales = require('./routes/main.routes');
const rutasAdmin = require('./routes/admin.routes');

app.use(rutasPrincipales);
app.use('/admin', rutasAdmin);

app.use(function(request, response) {
    response.status(404).render('404', { pageTitle: 'Página no encontrada' });
});

app.listen(3000);