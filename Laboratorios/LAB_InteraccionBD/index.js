require('dotenv').config();

const express = require('express');
const path    = require('path');
const pool    = require('./util/database.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/games');
});

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

app.get('/test_db', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM games LIMIT 20');
        res.json(rows);
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al conectar con la base de datos');
    }
});

const gameRoutes = require('./routes/game.routes.js');
app.use('/games', gameRoutes);

app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});