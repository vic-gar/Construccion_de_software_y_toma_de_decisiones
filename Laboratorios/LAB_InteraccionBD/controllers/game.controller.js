const model = require('../models/game.model.js');

module.exports.index = async (req, res) => {
    try {
        const page     = parseInt(req.query.page) || 1;
        const pageSize = 20;

        const [juegos, total] = await Promise.all([
            model.fetchAll(page, pageSize),
            model.count()
        ]);

        const totalPages = Math.ceil(total / pageSize);

        res.render('games', {
            juegos,
            page,
            totalPages,
            total
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al obtener los juegos');
    }
};

module.exports.buscarSeguro = async (req, res) => {
    try {
        const titulo = req.query.titulo || '';
        const resultados = await model.findByTitle(titulo);

        res.render('buscar', {
            titulo,
            resultados,
            modo: 'seguro'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al buscar juegos');
    }
};

module.exports.buscarInseguro = async (req, res) => {
    try {
        const titulo = req.query.titulo || '';
        const resultados = await model.findByTitleInsegura(titulo);

        res.render('buscar', {
            titulo,
            resultados,
            modo: 'inseguro'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al buscar juegos');
    }
};

module.exports.getJuego = async (req, res) => {
    try {
        const id = req.params.game_id;
        const juego = await model.findById(id);

        if (!juego) {
            return res.status(404).send('Juego no encontrado');
        }

        res.render('game-detail', {
            juego
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al obtener el juego');
    }
};

module.exports.getNuevoJuego = (req, res) => {
    res.render('game-form', {
        modo: 'crear',
        juego: {}
    });
};

module.exports.postNuevoJuego = async (req, res) => {
    try {
        const game = {
            title: req.body.title,
            studio_id: req.body.studio_id,
            genre_id: req.body.genre_id,
            release_year: req.body.release_year,
            price: req.body.price,
            rating: req.body.rating
        };

        await model.save(game);
        res.redirect('/games');
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al guardar el juego');
    }
};

module.exports.getEditarJuego = async (req, res) => {
    try {
        const id = req.params.game_id;
        const juego = await model.findById(id);

        if (!juego) {
            return res.status(404).send('Juego no encontrado');
        }

        res.render('game-form', {
            modo: 'editar',
            juego
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar el juego');
    }
};

module.exports.postEditarJuego = async (req, res) => {
    try {
        const id = req.params.game_id;

        const game = {
            title: req.body.title,
            studio_id: req.body.studio_id,
            genre_id: req.body.genre_id,
            release_year: req.body.release_year,
            price: req.body.price,
            rating: req.body.rating
        };

        await model.update(id, game);
        res.redirect('/games/' + id);
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al actualizar el juego');
    }
};