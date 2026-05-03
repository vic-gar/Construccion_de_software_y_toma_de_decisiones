require('dotenv').config();
console.log(process.env.DATABASE_URL.length);
console.log(process.env.DATABASE_URL);

const http = require('http');
const express = require('express');
const path = require('path');
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
    secret: process.env.SESSION_SECRET || 'cambia-esto-en-desarrollo',
    resave: false,
    saveUninitialized: false
}));

const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection);

app.use((request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.get('/', (request, response, next) => {
    response.setHeader('Content-Type', 'text/plain');
    response.send("Hola Mundo");
    response.end();
});

const rutasUsuarios = require('./routes/usuarios.routes');
app.use('/usuarios', rutasUsuarios);

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
    request.session.mi_variable = "valor";
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

app.listen(3000);