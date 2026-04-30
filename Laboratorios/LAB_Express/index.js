const http    = require('http');
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const app     = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false }));

//Middleware
app.use((request, response, next) => {
    console.log('Middleware!');
    next();
});

app.get('/', (request, response) => {
    response.setHeader('Content-Type', 'text/plain');
    response.write("URL index /");
    response.end(); 
});

app.get('/test_json', (request, response, next) => {
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({code:200, msg:"Ok GET"}));
    response.end();  
});

app.post('/test_json', (request, response, next) => {
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({code:200, msg:"Ok POST"}));
    response.end();  
});

const rutasHTML = require("./html.routes");
app.use('/html', rutasHTML);

const rutasFormulario = require("./formulario.routes");
app.use('/formulario', rutasFormulario);

app.use((request, response, next) => {
    console.log('Otro middleware!');
    response.status(404);
    response.write('¡Page Not Found!');
    response.end();
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});