let log = console.log;

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    log(req.url);

    res.setHeader("Content-Type", "text/html");

    if (req.url === "/") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.write("<h1>Error al cargar index.html</h1>");
                res.end();
                return;
            }

            res.write(data);
            res.end();
        });
    } else {
        res.write("<h1>404 - Página no encontrada</h1>");
        res.end();
    }
});

server.listen(4141, () => {
    log("Mi servidor está vivo corriendo en el puerto 4141");
});



/*
let log = console.log;

const http = require('http');
const server=http.createServer((req, res) => {
    log(req.url);
    res.setHeader("content-type", "text/html");
    res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>HTML</title>
        </head>
        <body>
        <h1>hola mundo desde node</h1>
        <javascript>
             //Mi código Javascript
             console.log("Hello");
        </javascript>
        </body>
        </html>
    `);
    res.end();
});

server.listen(4141, () => {
    log("Mi servidor está vivo corriendo en el puerto 4141");
});




log("Hola mundo");

//fs módulo que contendrá las funciones para manipular el sistema de archivos
const fs = require("fs");

//Crear archivo con la clase writeFileSync
fs.writeFileSync("archivo.txt", "Hola Mundo");

//Async Sort
const arreglo = [5000, 60, 90, 100, 10, 20, 10000, 0, 1];

for (let item of arreglo) {
    setTimeout(() => {
        log(item);
    }, item);
}

log("Hola")

setTimeout(() => {
    log('Mundo');
}, 2000);

log('Adios');
*/