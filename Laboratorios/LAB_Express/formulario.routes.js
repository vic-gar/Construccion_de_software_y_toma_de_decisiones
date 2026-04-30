const express = require('express');
const fs      = require('fs');
const path    = require('path');
const router = express.Router();

router.get('/form_method', (request, response, next) => {
    response.setHeader('Content-Type', 'text/html');
    const html = fs.readFileSync(path.resolve(__dirname, './form.html'), 'utf8');
    response.write(html);
    response.end();  
});

router.post('/form_method', (request, response, next) => {
    const indice = Number(request.body.indice);
    const imprimir = request.body.imprimir;

    let contenido = '';

    for(var i = 1; i <= indice; i++){
        console.log(imprimir);
        contenido += imprimir + '\n';
    }

    fs.appendFileSync(path.resolve(__dirname, './datos.txt'), contenido);

    response.setHeader('Content-Type', 'text/html');
    response.statusCode = 200;
    response.write(`
        <h1>Datos guardados correctamente</h1>
        <p>Se guardó el texto en datos.txt</p>
        <a href="/formulario/form_method">Regresar</a>
    `);
    response.end();
});

module.exports = router;