const express = require('express');
const router = express.Router();

router.get('/test_html', (request, response, next) => {
    response.setHeader('Content-Type', 'text/html');    
    response.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Código en HTML</title>
        </head>
        <body>
            <h1>hola mundo desde express</h1>
        </body>
        </html>
    `);
    response.end(); 
});

router.get('/acerca', (request, response, next) => {
    response.setHeader('Content-Type', 'text/html');
    response.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Acerca</title>
        </head>
        <body>
            <h1>Acerca de la aplicación</h1>
            <p>Esta aplicación fue creada con Node.js y Express.</p>
        </body>
        </html>
    `);
    response.end();
});

module.exports = router;