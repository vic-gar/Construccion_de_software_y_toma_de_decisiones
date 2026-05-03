const http = require('http');
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const helmet = require('helmet');
app.use(helmet());

app.set('view engine', 'ejs');
app.set('views', 'views');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_de_desarrollo',
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

app.get('/', (request, response, next) => {
    response.setHeader('Content-Type', 'text/plain');
    response.send("Hola Mundo");
    response.end();
});

app.get("/test_ejs", (request, response, next) => {
    response.render("usuarios/registro", { registro: false });
});

const rutasUsuarios = require('./routes/usuarios.routes');
app.use('/usuarios', rutasUsuarios);

const rutasNotas = require('./routes/notas.routes');
app.use("/notas", rutasNotas);

app.get('/test_cookie', (request, response, next) => {
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Set-Cookie', 'mi_cookie=123; HttpOnly');
    response.send("Hola Mundo");
    response.end();
});

app.get('/test_value_cookie', async (request, response, next) => {
    response.setHeader('Content-Type', 'text/plain');
    response.send(request.cookies.mi_cookie);
    response.end();
});

app.get('/test_session', async (request, response, next) => {
    request.session.mi_variable = "valor"
    response.setHeader('Content-Type', 'text/plain');
    response.send(request.session.mi_variable);
    response.end();
});

app.get('/test_session_variable', async (request, response, next) => {
    response.setHeader('Content-Type', 'text/plain');
    response.send(request.session.mi_variable);
    response.end();
});

app.get('/logout', async (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/'); 
    });
});

app.use((request, response, next) => {
    response.status(404).send('Página no encontrada');
});

app.listen(3000);