const express = require('express');
const router  = express.Router();

router.get('/', function(request, response) {
    response.setHeader('Content-Type', 'text/plain');
    response.send('Hola Mundo');
    response.end();
});

router.get('/test_ejs', function(request, response) {
    let frases = [];
    frases.push('Frase 1');
    frases.push('Frase 2');
    frases.push('Frase 3');
    frases.push('Frase 4');
    frases.push('Frase 5');

    response.render('index', {
        frases: frases
    });
});

router.get('/info', function(request, response) {
    response.render('info', {
        pageTitle: 'Información',
        mensaje: 'Esta es una ruta de información.'
    });
});

module.exports = router;