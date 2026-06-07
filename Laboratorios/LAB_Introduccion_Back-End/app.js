// 1. Función promedio
function promedio(arreglo) {
    let suma = 0;
    for (let numero of arreglo) {
        suma += numero;
    }
    return suma / arreglo.length;
}

console.log("Promedio:", promedio([10, 8, 9, 7, 10]));

// 2. Escribir string en archivo
const fs = require("fs");

function escribirArchivo(texto) {
    fs.writeFileSync("resultado.txt", texto);
    console.log("Archivo creado correctamente");
}

escribirArchivo("Laboratorio introducción back-end");

// 3. Problema propio Pasar de celsius a Fahrenheit
function celsiusAFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

console.log("25°C en Fahrenheit:", celsiusAFahrenheit(25));