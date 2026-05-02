const express = require('express');
const fs      = require('fs');
const path    = require('path');

const router  = express.Router();

router.get('/dashboard', function(request, response) {
    response.render('admindash', { pageTitle: 'Panel de Administración' });
});

router.get('/form', function(request, response) {
    response.render('form', { pageTitle: 'Formulario' });
});

router.post('/form', function(request, response) {
    const datos    = request.body;
    const archivo  = path.join(__dirname, '..', 'datos.txt');
    fs.appendFileSync(archivo, JSON.stringify(datos) + '\n');
    response.redirect('/');
});

router.get('/users', function(request, response) {
    response.render('adminusers', {
        pageTitle: 'Usuarios',
        usuarios: []
    });
});

module.exports = router;